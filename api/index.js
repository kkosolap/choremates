// index.js

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cron = require('node-cron');

const PORT = 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/********************************************************** */
/*              DATABASE CONNECTION BELOW:                  */
/********************************************************** */
require('dotenv').config();  // load env variables

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    database: "choremates",   
    user: process.env.DB_USER,
    // put "DB_PASSWORD=yourpassword" in your local .env file, 
    // replace yourpassword with your mysql root password -EL
    password: process.env.DB_PASSWORD, 
});

// connect to the database
db.connect((err) =>{
    if (err){
        console.log("API connect: Error connecting to database: ", err.message);
        return;
    }
    console.log("Connected to database.");
});


/********************************************************** */
/*             ALL GET AND POST PATHS BELOW:                */
/********************************************************** */
app.get('/', (req, res) => {    
    // this is what will display when visiting http://ipv4:3000/ -KK
    res.send("Hello World!")
});

app.get('/get-users', (req, res) => {
    db.query('SELECT id, username, display_name FROM users', (err, results) => {
        if (err) {
            console.error("API get-users: Error querying database: ", err.message);
            return res.status(500).send("Error querying database.");
        }
        res.json(results);
    });
});


/********************************************************** */
/*                HELPER FUNCTIONS BELOW:                */
/********************************************************** */
// gets the user id given a username -KK
async function getUserId(username) {
    const [results] = await db.promise().query("SELECT id FROM users WHERE username = ?", [username]);
    if (results.length === 0) {
        console.log(`API getUserId: User ${username} not found`);
        throw new Error(`User ${username} not found`);
    }
    return results[0].id;
}

// gets the group id given a group_name -KK
async function getGroupId(group_name) {
    const [results] = await db.promise().query("SELECT id FROM group_names WHERE group_name = ?", [group_name]);
    if (results.length === 0) {
        console.log(`API getGroupId: Group ${group_name} not found`);
        throw new Error(`Group ${group_name} not found`);
    }
    return results[0].id;
}

// gets the chore id and completion status given a chore_name -KK
async function getChoreIdAndCompletionStatus(chore_name, user_id) {
    const [results] = await db.promise().query("SELECT id, is_completed FROM chores WHERE chore_name = ? AND user_id = ?", [chore_name, user_id]);    
    if (results.length === 0) {
        console.log(`API getChoreIdAndCompletionStatus: Chore ${chore_name} not found`);
        throw new Error(`Chore ${chore_name} not found`);
    }
    return { chore_id: results[0].id, is_completed: results[0].is_completed };
}

// gets the group chore id and completion status given a chore_name -KK
async function getGroupChoreIdAndCompletionStatus(group_chore_name, group_id) {
    const query = `SELECT id, is_completed FROM group_chores WHERE group_chore_name = ? AND group_id = ?`
    const [results] = await db.promise().query(query, [group_chore_name, group_id]);    
    if (results.length === 0) {
        console.log(`API getGroupChoreIdAndCompletionStatus: Chore ${group_chore_name} not found`);
        throw new Error(`Chore ${group_chore_name} not found`);
    }
    return { group_chore_id: results[0].id, is_completed: results[0].is_completed };
}

// gets the task id given a task_name -KK
async function getTaskId(task_name, chore_id) {
    const [results] = await db.promise().query("SELECT id FROM tasks WHERE task_name = ? AND chore_id = ?", [task_name, chore_id]);
    if (results.length === 0) {
        console.log(`API getTaskId: Task ${task_name} not found`);
        throw new Error(`Task ${task_name} not found`);
    }
    return results[0].id;
}

// gets the task id given a task_name -KK
async function getGroupTaskId(group_task_name, group_chore_id) {
    const [results] = await db.promise().query("SELECT id FROM group_tasks WHERE group_task_name = ? AND group_chore_id = ?", [group_task_name, group_chore_id]);
    if (results.length === 0) {
        console.log(`API getTaskId: Task ${group_task_name} not found`);
        throw new Error(`Task ${group_task_name} not found`);
    }
    return results[0].id;
}


/********************************************************** */
/*                USER AUTHENTICATION BELOW:                */
/********************************************************** */
// user registration -EL
app.post('/register', async (req, res) => {
    console.log("API register: Registration request received");
    console.log(req.body);

    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Missing username or password" });
    }

    try {
        // Check if the username already exists
        db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
            if (err) {
                console.error("API register: Error checking for existing user: ", err.message);
                return res.status(500).json({ error: "Error checking for existing user" });
            }

            if (results.length > 0) {
                return res.status(409).json({ error: "Username already exists" }); // 409
            }

            // if the username does not exist, proceed with hashing the password and inserting the user
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log("API register: Password hashed successfully");

            db.query('INSERT INTO users (username, display_name, security_key) VALUES (?, ?, ?)', [username, username, hashedPassword], 
            (err, result) => {
                if (err) {
                    console.error("API register: Error inserting into database: ", err.message);
                    return res.status(500).json({ error: "Registration failed (database error)" });
                }
                console.log("API register: User registered successfully!");
                res.status(201).json({ message: 'User registered successfully!' });
            });
        });

    } catch (err) {
        console.error("API register: Registration process failed:", err);
        return res.status(500).json({ error: "Registration failed" });
    }
});

// user login -EL
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ message: 'Invalid username or password' });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.security_key);
        if (!isMatch) return res.status(401).json({ message: 'Invalid username or password' });

        const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.status(200).json({ token });
    });
});

// user logout -EL
app.post('/logout', (req, res) => {
    // Nathan pls handle token invalidation on the client side. -- Ethan
    res.status(200).json({ message: 'Logged out successfully!' });
});


/********************************************************** */
/*                USER IMPLEMENTATION BELOW:                */
/********************************************************** */
// get the user's display name -KK
app.post('/get-display', async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            console.log("API get-display: Missing username.");
            return res.status(400).send("Missing username.");
        }
        const user_id = await getUserId(username);

        const [results] = await db.promise().query("SELECT display_name FROM users WHERE id = ?", [user_id]);
        res.status(200).json(results);
    } catch (error) {
        console.error("API get-display: Error:", error.message);
        res.status(500).send("Error getting display name.");
    }
});

// changes the display name for a user -KK
app.post('/update-display', async (req, res) => {
    try {
        const { username, display_name } = req.body;
        if (!username || !display_name) {
            console.log("API update_display: Missing username or display name.");
            return res.status(400).send("Missing username or display name.");
        }
        const user_id = await getUserId(username);

        const [results] = await db.promise().query("UPDATE users SET display_name = ? WHERE id = ?", [display_name, user_id]);
        res.json(results);
    } catch (error) {
        console.error("API update_display: Error:", error.message);
        res.status(500).send("Error updating display name.");
    }
});

// get the user's theme -KK
app.post('/get-theme', async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            console.log("API get-theme: Missing username.");
            return res.status(400).send("Missing username.");
        }
        const user_id = await getUserId(username);
        console.log(user_id);

        const [results] = await db.promise().query("SELECT theme FROM users WHERE id = ?", [user_id]);
        res.status(200).json(results);
    } catch (error) {
        console.error("API get-theme: Error:", error.message);
        res.status(500).send("Error getting theme.");
    }
});

// changes the theme for a user -KK
app.post('/update-theme', async (req, res) => {
    try {
        const { username, theme } = req.body;
        if (!username || !theme) {
            console.log("API update-theme: Missing username or theme.");
            return res.status(400).send("Missing username or theme.");
        }
        const user_id = await getUserId(username);

        const [results] = await db.promise().query("UPDATE users SET theme = ? WHERE id = ?", [theme, user_id]);
        res.json(results);
    } catch (error) {
        console.error("API update-theme: Error:", error.message);
        res.status(500).send("Error updating theme.");
    }
});

// get the user's profile pic -KK
app.post('/get-profile', async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            console.log("API get-profile: Missing username.");
            return res.status(400).send("Missing username.");
        }
        const user_id = await getUserId(username);

        const [results] = await db.promise().query("SELECT profile_pic FROM users WHERE id = ?", [user_id]);
        res.status(200).json(results);
    } catch (error) {
        console.error("API get-profile: Error:", error.message);
        res.status(500).send("Error getting theme.");
    }
});

// changes the theme for a user -KK
app.post('/update-profile', async (req, res) => {
    try {
        const { username, profile_pic } = req.body;
        if (!username || !profile_pic) {
            console.log("API update-profile: Missing username or profile pic.");
            return res.status(400).send("Missing username or profile pic.");
        }
        const user_id = await getUserId(username);

        const [results] = await db.promise().query("UPDATE users SET profile_pic = ? WHERE id = ?", [profile_pic, user_id]);
        res.json(results);
    } catch (error) {
        console.error("API update-profile: Error:", error.message);
        res.status(500).send("Error updating theme.");
    }
});


/********************************************************** */
/*             RECURRENCE IMPLEMENTATION BELOW:             */
/********************************************************** */
// cron job for daily and weekly resets - AT
// every minute for test purposes - AT
cron.schedule('* * * * *', () => { resetAndRotateChores('Every Minute'); });
cron.schedule('0 0 * * *',  () => { resetAndRotateChores('Daily'); });
cron.schedule('0 0 * * 1',  () => { resetAndRotateChores('Weekly'); });

// function to handle single user recurrence -AT
async function resetAndRotateChores(type) {
    try {
        await resetSingleUserChores(type);          // single-user chores recurrence
        await resetAndRotateGroupUserChores(type);  // group-user chores recurrence and rotation
    } catch (error) {
        console.error("Error in resetAndRotateChores:", error);
    }
}

async function resetSingleUserChores(type) {
    const query = `SELECT id, is_completed FROM chores WHERE recurrence = ?`;
    const [chores] = await db.promise().query(query, [type]);

    for (const chore of chores) {
        const query = `UPDATE chores SET is_completed = false WHERE id = ?`;
        try{
            console.log("API resetRecurringChores: reseting chore " + chore.id);
            await db.promise().query(query, [chore.id]);
        } catch (error) {
            console.error("Error resetting chore:", error);
        }
    }
}

async function resetAndRotateGroupUserChores(type) {
    const query = `SELECT id, group_id, assigned_to, is_completed FROM group_chores WHERE recurrence = ?`;
    const [groupChores] = await db.promise().query(query, [type]);

    for (const chore of groupChores) {
        const query = `UPDATE group_chores SET is_completed = false WHERE id = ?`;
        try{
            console.log("API resetAndRotateGroupUserChores: resetting chore " + chore.id);
            await db.promise().query(query, [chore.id]);

            // should only be calling rotate when the chores are reset each week
            if (type === 'Weekly') { // only handles weekly recurrence right now, need to do daily recurrence reset every week - AT
                await rotateChoreToNextUser(chore.group_id, chore.id, chore.assigned_to);
            }

        } catch (error) {
            console.error("Error resetting chore:", error);
        }
    }
}

async function rotateChoreToNextUser(group_id, chore_id, current_assigned_to) {
    try {
        // retrieve all users in the group (order them for consistent rotation) -AT
        const query = 'SELECT id FROM group_members WHERE group_id = ? ORDER BY id ASC'
        const [users] = await db.promise().query(query, [group_id]);

        // find the current user in the sorted user list -AT
        const currentIndex = users.findIndex(user => user.id === current_assigned_to);
        if (currentIndex === -1) {
            console.error(`User with ID ${current_assigned_to} not found in group ${group_id}.`);
            return;
        }

        // Rotate to the next user (loop back to the first user if at the end) -AT
        const nextUser = users[(currentIndex + 1) % users.length];

        // Update the chore with the new user assignment -AT
        const updateQuery = `UPDATE group_chores SET assigned_to = ? WHERE id = ?`;
        await db.promise().query(updateQuery, [nextUser.id, chore_id]);

        console.log(`Group chore ${chore_id} rotated to new user: ${nextUser.id}`);
    } catch (error) {
        console.error("Error rotating group chore to the next user:", error);
    }
}


/********************************************************** */
/*             CHORE IMPLEMENTATION BELOW:                  */
/********************************************************** */
// get all chores for a user -KK
app.post('/get-chores', async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            console.log("API get-chores: Missing username.");
            return res.status(400).send("Missing username.");
        }

        const user_id = await getUserId(username);

        const [results] = await db.promise().query("SELECT id, chore_name, recurrence FROM chores WHERE user_id = ?", [user_id]);
        res.json(results);
    } catch (error) {
        console.error("API get-chores: Error:", error.message);
        res.status(500).send("Error retrieving chores.");
    }
});

// get all the chores and associated tasks for a specific user -KK
app.post('/get-chores-data', async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            console.log("API get-chores-data: Missing username.");
            return res.status(400).send("Missing username.");
        }

        const user_id = await getUserId(username);

        const query = `
            SELECT 
                chores.chore_name, 
                chores.is_completed AS chore_is_completed, 
                chores.recurrence AS chore_recurrence,
                tasks.id,
                tasks.task_name, 
                tasks.is_completed AS task_is_completed
            FROM chores
            LEFT JOIN tasks ON chores.id = tasks.chore_id
            WHERE chores.user_id = ?
        `;

        const [results] = await db.promise().query(query, [user_id]);
        res.json(results);
    } catch (error) {
        console.error("API get-chores-data: Error:", error.message);
        res.status(500).send("Error retrieving chores.");
    }
});

// add a new chore for the user -KK
app.post('/add-chore', async (req, res) => {
    try {
        const { chore_name, username, recurrence } = req.body;
        if (!chore_name || !username || !recurrence) {
            console.log("API add-chore: Missing chore, username, or recurrence.");
            return res.status(400).send("Missing chore, username, or recurrence.");
        }

        const user_id = await getUserId(username);
        const [duplicate] = await db.promise().query("SELECT id FROM chores WHERE user_id = ? AND chore_name = ?", [user_id, chore_name]);
        if (duplicate.length > 0) {
            console.log("API add-chore: Duplicate chore name.");
            return res.status(400).send("This chore already exists!");
        }

        const query = "INSERT INTO chores (user_id, chore_name, recurrence) VALUES (?, ?, ?)";
        await db.promise().query(query, [user_id, chore_name, recurrence]);
        res.status(200).json({ message: "Chore added successfully." });
    } catch (error) {
        console.error("API add-chore: Error:", error.message);
        res.status(500).send("An error occurred while adding the chore.");
    }
});

// update the details of a chore -MH
app.post('/update-chore', async (req, res) => {
    try {
        const { old_chore_name, new_chore_name, username, recurrence } = req.body;
        if (!old_chore_name || !new_chore_name || !username || !recurrence) {
            console.log("API update-chore: Missing required fields.");
            return res.status(400).send("Missing required fields.");
        }

        const user_id = await getUserId(username);
        
        // Update the chore details in the database
        const query = `
            UPDATE chores
            SET chore_name = ?, recurrence = ?
            WHERE user_id = ? AND chore_name = ?
        `;
        await db.promise().query(query, [new_chore_name, recurrence, user_id, old_chore_name]);

        res.status(200).json({ message: "Chore updated successfully." });
    } catch (error) {
        console.error("API update-chore: Error:", error.message);
        res.status(500).send("An error occurred while updating the chore.");
    }
});

// deletes a chore for the user from the database -KK
app.post('/delete-chore', async (req, res) => {
    try {
        const { chore_name, username } = req.body;
        if (!chore_name || !username) {
            console.log("API delete-chore: Missing chore or username.");
            return res.status(400).send("Missing chore or username.");
        }

        const user_id = await getUserId(username);
        const { chore_id } = await getChoreIdAndCompletionStatus(chore_name, user_id);

        await db.promise().query("DELETE FROM chores WHERE id = ?", [chore_id]);
        res.status(200).json({ message: "Chore deleted successfully." });
    } catch (error) {
        console.error("API delete-chore: Error:", error.message);
        res.status(500).send("An error occurred while deleting the chore.");
    }
});

// toggle the completion status of a chore, false -> true and true -> false -KK
app.post('/complete-chore', async (req, res) => {
    try {
        const { chore_name, username } = req.body;
    
        if (!chore_name || !username) {
            console.log("API complete-chore: Missing username or chore name.");
            return res.status(400).send("Missing username or chore name.");
        }
        
        const user_id = await getUserId(username);
        const { chore_id } = await getChoreIdAndCompletionStatus(chore_name, user_id);
        
        await db.promise().query("UPDATE chores SET is_completed = NOT is_completed WHERE id = ?", [chore_id]);

        res.status(200).json({ message: "Chore completion status toggled successfully." });
    } catch (error) {
        console.error("API complete-chore: Error:", error.message);
        res.status(500).send("An error occurred while toggling chore completion status.");
    }
});
  

/********************************************************** */
/*               TASK IMPLEMENTATION BELOW:                 */
/********************************************************** */
// gets a list of tasks given a chore -KK
app.post('/get-tasks', async (req, res) => {
    try {
        const { chore_name, username } = req.body;
        if(!chore_name || !username){
            console.log("API get-tasks: Missing username or chore name.");
            return res.status(400).send("Missing username or chore name.");
        }

        const user_id = await getUserId(username);
        const { chore_id } = await getChoreIdAndCompletionStatus(chore_name, user_id);

        // get the tasks from the database -KK
        const [tasks] = await db.promise().query("SELECT task_name from tasks WHERE chore_id = ?", [chore_id]);
        res.status(200).json(tasks);
    } catch (error) {
        console.error("API get-tasks: Error:", error.message);
        res.status(500).send("An error occurred while adding the task.");
    }
});

// adds a task for a given chore to the database -KK
app.post('/add-task', async (req, res) => {
    try {
        const { chore_name, task_name, username } = req.body;
        if(!chore_name || !task_name || !username){
            console.log("API add-task: Missing username, chore name, or task name.");
            return res.status(400).send("Missing username, chore name, or task name.");
        }

        const user_id = await getUserId(username);
        const { chore_id, is_completed } = await getChoreIdAndCompletionStatus(chore_name, user_id);
        const [duplicate] = await db.promise().query("SELECT id FROM tasks WHERE task_name = ? AND chore_id = ?", [task_name, chore_id]);
        if (duplicate.length > 0) {
            console.log("API add-task: Duplicate task name.");
            return res.status(400).send("This task already exists!");
        }

        // add the task to the database -KK
        await db.promise().query("INSERT INTO tasks (chore_id, task_name) VALUES (?, ?)", [chore_id, task_name]);  
        
        // mark chore as incomplete -KK
        if(is_completed){
            await db.promise().query("UPDATE chores SET is_completed = NOT is_completed WHERE id = ?", [chore_id]);
        }
        res.status(200).json({ message: "Changed completion successfully." });
    } catch (error) {
        console.error("API add-task: Error:", error.message);
        res.status(500).send("An error occurred while adding the task.");
    }
});
   
// deletes a task for a given chore from the database -KK
app.post('/delete-task', async (req, res) => {
    try {
        const { chore_name, task_name, username } = req.body;
        if (!chore_name || !task_name || !username) {
            console.log("API delete-task: Missing username, chore name, or task name.");
            return res.status(400).send("Missing username, chore name, or task name.");
        }

        const user_id = await getUserId(username);
        const { chore_id } = await getChoreIdAndCompletionStatus(chore_name, user_id);
        const task_id = await getTaskId(task_name, chore_id);

        await db.promise().query("DELETE FROM tasks WHERE id = ?", [task_id]);
        res.status(200).json({ message: "Task deleted successfully." });
    } catch (error) {
        console.error("API delete-task: Error:", error.message);
        res.status(500).send("An error occurred while deleting the task.");
    }
});

// toggles the completion status of the task, false -> true and true -> false -KK
app.post('/complete-task', async (req, res) => {
    try {
        const { chore_name, task_name, username } = req.body;
        if (!chore_name || !task_name || !username) {
            console.log("API complete-task: Missing username, chore name, or task name.");
            return res.status(400).send("Missing username, chore name, or task name.");
        }

        const user_id = await getUserId(username);
        const { chore_id } = await getChoreIdAndCompletionStatus(chore_name, user_id);
        const task_id = await getTaskId(task_name, chore_id);

        await db.promise().query("UPDATE tasks SET is_completed = NOT is_completed WHERE id = ?", [task_id]);
        res.status(200).json({ message: "Task completion status toggled successfully." });
    } catch (error) {
        console.error("API complete-task: Error:", error.message);
        res.status(500).send("An error occurred while toggling task completion status.");
    }
});

// matches the completion status of the task to match the completion status of the chore
app.post('/match-task', async (req, res) => {
    try {
        const { chore_name, task_name, username } = req.body;
        if (!chore_name || !task_name || !username) {
            console.log("API match-task: Missing username, chore name, or task name.");
            return res.status(400).send("Missing username, chore name, or task name.");
        }

        const user_id = await getUserId(username);
        const { chore_id, is_completed } = await getChoreIdAndCompletionStatus(chore_name, user_id);
        const task_id = await getTaskId(task_name, chore_id);

        await db.promise().query("UPDATE tasks SET is_completed = ? WHERE id = ?", [is_completed, task_id]);
        res.status(200).json({ message: "Task completion status matched successfully." });
    } catch (error) {
        console.error("API match-task: Error:", error.message);
        res.status(500).send("An error occurred while matching task completion status.");
    }
});


/********************************************************** */
/*              GROUP IMPLEMENTATION BELOW:                 */
/********************************************************** */
// create a new group -EL
// input: group_name, username (the person who wants to create the group)
app.post('/create-group', async (req, res) => {
    const { group_name, username } = req.body;

    // check if group name and user ID are provided
    if (!group_name || !username) {
        return res.status(400).json({ error: "Missing group name or username" });
    }

    const user_id = await getUserId(username);

    // insert the new group into group_names
    db.query('INSERT INTO group_names (group_name) VALUES (?)', [group_name], (err, result) => {
        if (err) {
            console.error("API create-group: Error creating group: ", err.message);
            return res.status(500).json({ error: "Failed to create group" });
        }

        // id of the newly created group
        const groupId = result.insertId;

        // add the creator as a member of the group with the role of admin
        db.query('INSERT INTO group_members (user_id, group_id, role) VALUES (?, ?, ?)', [user_id, groupId, 'admin'], (err) => {
            if (err) {
                console.error("API create-group: Error adding group member: ", err.message);
                return res.status(500).json({ error: "Failed to add user to group" });
            }

            res.status(201).json({ message: 'Group created successfully', group_id: groupId });
        });
    });
});

// get all members and their roles of a specific group -EL
// input: group_id
// output: member name, role
app.get('/get-group-members', (req, res) => {
    const { group_id } = req.query;

    // Query to retrieve member names for the specified group
    const getGroupMembersQuery = `
        SELECT users.username, group_members.role 
        FROM group_members 
        JOIN users ON group_members.user_id = users.id 
        WHERE group_members.group_id = ?
    `;

    db.query(getGroupMembersQuery, [group_id], (err, results) => {
        if (err) {
            console.error("API get-group-members: Error retrieving group members: ", err.message);
            return res.status(500).json({ error: "Failed to retrieve group members" });
        }
        res.status(200).json(results);
    });
});

// returns the id and name of all the groups that the user is a member/admin of -KK
// input: username
// output: group_id, group_name 
app.post('/get-all-groups-for-user', async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            console.log("API get-all-groups-for-user: Missing username.");
            return res.status(400).send("Missing username.");
        }

        const user_id = await getUserId(username);

        const query =   `SELECT 
                            group_members.group_id,
                            group_names.group_name
                        FROM group_members
                        JOIN group_names ON group_members.group_id = group_names.id
                        WHERE group_members.user_id = ?`

        const [results] = await db.promise().query(query, [user_id]);

        res.json(results);
    } catch (error) {
        console.error("get-all-groups-for-user: Error:", error.message);
        res.status(500).send("Error retrieving group names.");
    }
});

// send an invitation, only 'admin' can invite -EL
// input: inviter_name, invitee_name, group_id
app.post('/send-invite', async (req, res) => {
    const { inviter_name, invitee_name, group_id } = req.body;

    const inviter_id = await getUserId(inviter_name);
    const invitee_id = await getUserId(invitee_name);

    // check if inviter is an admin in the group
    const adminCheckQuery = `
        SELECT role FROM group_members 
        WHERE user_id = ? AND group_id = ? AND role = 'admin'
    `;

    db.query(adminCheckQuery, [inviter_id, group_id], (err, results) => {
        if (err) {
            console.error("API send-invite: Error checking admin role when inviting: ", err.message);
            return res.status(500).json({ error: "Failed to verify inviter's role" });
        }
        if (results.length === 0) {
            return res.status(403).json({ error: "Only admins can invite members to the group" });
        }

        // insert invitation into group_invitations table
        const insertInvitationQuery = `
            INSERT INTO group_invitations (inviter_id, invitee_id, group_id, status)
            VALUES (?, ?, ?, 'pending')
        `;
        db.query(insertInvitationQuery, [inviter_id, invitee_id, group_id], (err, result) => {
            if (err) {
                console.error("API send-invite: Error creating invitation: ", err.message);
                return res.status(500).json({ error: "Failed to send invitation" });
            }
            res.status(200).json({ message: "Invitation sent successfully" });
        });
    });
});

// get received pending invitations for a specific user -EL
// input: username (want to retrieve this person's pending invitations)
// output: pending invitations for that user
app.get('/get-received-invite', async (req, res) => {
    const { username } = req.query;

    const user_id = await getUserId(username);

    const sql = `SELECT * FROM group_invitations WHERE invitee_id = ? AND status = 'pending'`;
    db.query(sql, [user_id], (err, results) => {
        if (err) {
            console.error("API get-received-invite: Error fetching pending invitations:", err);
            return res.status(500).json({ error: "Failed to retrieve pending invitations" });
        }
        res.status(200).json(results);
    });
});

// respond to invitation based on user's response (accepted / rejected) -EL
// input: invitation_id, response (either "accepted" or "rejected")
app.post('/respond-to-invite', (req, res) => {
    const { invitation_id, response } = req.body;

    // Update the status in the group_invitations table
    const updateSql = `UPDATE group_invitations SET status = ? WHERE id = ?`;
    db.query(updateSql, [response, invitation_id], (err) => {
        if (err) {
            console.error("API respond-to-invite: Error updating invitation status:", err);
            return res.status(500).json({ error: "Failed to update invitation status" });
        }

        // if accepted, add the user to the group
        if (response === 'accepted') {
            // find the user's id and the group's id
            const getGroupDetailsSql = `
                SELECT invitee_id, group_id 
                FROM group_invitations 
                WHERE id = ?
            `;
            db.query(getGroupDetailsSql, [invitation_id], (err, result) => {
                if (err || result.length === 0) {
                    console.error("API respond-to-invite: Error retrieving group details when adding user to the group:", err);
                    return res.status(500).json({ error: "Failed to retrieve group details when adding user to the group" });
                }
                
                const { invitee_id, group_id } = result[0];
                // add user to the group
                const addMemberSql = `INSERT INTO group_members (user_id, group_id, role) VALUES (?, ?, 'member')`;
                db.query(addMemberSql, [invitee_id, group_id], (err) => {
                    if (err) {
                        console.error("API respond-to-invite: Error adding member:", err);
                        return res.status(500).json({ error: "Failed to add member to group" });
                    }
                    res.status(200).json({ message: "Invitation accepted, added to group" });
                });
            });
        } 
        // invitation rejected
        else { 
            res.status(200).json({ message: "Invitation declined" });
        }
    });
});

// check if a user is an admin of a specific group -- EL
// input: username, group_id
// output: isadmin : true/false 
app.get('/get-is-admin', (req, res) => {
    const { username, group_id } = req.query;

    // query to check if the user is an admin in the specified group
    const checkAdminQuery = `
        SELECT role 
        FROM group_members 
        JOIN users ON group_members.user_id = users.id 
        WHERE users.username = ? AND group_members.group_id = ?
    `;

    db.query(checkAdminQuery, [username, group_id], (err, results) => {
        if (err) {
            console.error("API get-is-admin: Error checking admin status: ", err.message);
            return res.status(500).json({ error: "Failed to check admin status" });
        }

        // Check if role is 'admin'
        if (results.length > 0 && results[0].role === 'admin') {
            res.status(200).json({ isAdmin: true });
        } else {
            res.status(200).json({ isAdmin: false });
        }
    });
});

// remove a user (must be member) from group (only admin can remove members, but admin cannot remove themselves)
// input: username (requesting user, the user that's trying to remove someone from the group), 
//        group_id, 
//        user_to_remove (this is a username)
// output: if success, user_to_remove will be removed from the group
app.delete('/remove-user-from-group', (req, res) => {
    const { username, group_id, user_to_remove } = req.body;

    // check if the requesting user is an admin
    const checkAdminQuery = `
        SELECT role 
        FROM group_members 
        JOIN users ON group_members.user_id = users.id 
        WHERE users.username = ? AND group_members.group_id = ?
    `;

    db.query(checkAdminQuery, [username, group_id], (err, results) => {
        if (err) {
            console.error("API remove-user-from-group: Error checking admin status: ", err.message);
            return res.status(500).json({ error: "Failed to check admin status" });
        }

        // check if the user is an admin
        if (results.length > 0 && results[0].role === 'admin') {
            // an admin can't remove themselves from the group
            if (username === user_to_remove) {
                return res.status(400).json({ error: "Admin cannot remove themselves" });
            }

            // remove the user from the group
            const removeUserQuery = `
                DELETE FROM group_members 
                WHERE group_id = ? AND user_id = (SELECT id FROM users WHERE username = ?)
            `;

            db.query(removeUserQuery, [group_id, user_to_remove], (err, result) => {
                if (err) {
                    console.error("API remove-user-from-group: Error removing user: ", err.message);
                    return res.status(500).json({ error: "Failed to remove user" });
                }

                if (result.affectedRows > 0) {
                    return res.status(200).json({ success: `User ${user_to_remove} removed from the group` });
                } else {
                    return res.status(404).json({ error: "User not found in this group" });
                }
            });
        } else {
            return res.status(403).json({ error: "You must be an admin to remove a user" });
        }
    });
});

// let a non-admin member leave a group
// input: username 
//        group_id
// output: if success, user with username will leave group with id = group_id
app.delete('/leave-group', (req, res) => {
    const { username, group_id } = req.body;

    // query to check if the user is a member and not an admin in the specified group
    const checkMembershipQuery = `
        SELECT role 
        FROM group_members 
        JOIN users ON group_members.user_id = users.id 
        WHERE users.username = ? AND group_members.group_id = ?
    `;

    db.query(checkMembershipQuery, [username, group_id], (err, results) => {
        if (err) {
            console.error("API leave-group: Error checking membership status: ", err.message);
            return res.status(500).json({ error: "Failed to check membership status" });
        }

        // verify the user is a member (not an admin)
        if (results.length > 0 && results[0].role !== 'admin') {
            // query to remove the user from the group
            const removeMemberQuery = `
                DELETE FROM group_members 
                WHERE user_id = (SELECT id FROM users WHERE username = ?) 
                AND group_id = ?
            `;

            db.query(removeMemberQuery, [username, group_id], (err, result) => {
                if (err) {
                    console.error("API leave-group: Error removing member from group: ", err.message);
                    return res.status(500).json({ error: "Failed to leave group" });
                }
                res.status(200).json({ message: "Successfully left the group" });
            });
        } else {
            res.status(403).json({ error: "Only non-admin members can leave the group" });
        }
    });
});



/********************************************************** */
/*              GROUP CHORE IMPLEMENTATION BELOW:           */
/********************************************************** */
// get all the chores and associated tasks for a specific user -KK
app.post('/get-group-chores-data', async (req, res) => {
    try {
        const { group_id } = req.body;
        if (!group_id) {
            console.log("API get-group-chores-data: Missing group id.");
            return res.status(400).send("Missing group id.");
        }

        const query = `
            SELECT 
                group_chores.group_id,
                group_chores.group_chore_name, 
                group_chores.is_completed AS chore_is_completed, 
                group_chores.recurrence AS chore_recurrence,
                group_chores.assigned_to
                group_tasks.group_task_name, 
                group_tasks.is_completed AS task_is_completed
            FROM group_chores
            LEFT JOIN group_tasks ON group_chores.id = group_tasks.group_chore_id
            WHERE group_chores.group_id = ?
        `;

        const [results] = await db.promise().query(query, [group_id]);
        res.json(results);
    } catch (error) {
        console.error("API get-group-chores-data: Error:", error.message);
        res.status(500).send("Error retrieving chores.");
    }
});

// get all the chores and associated tasks for a specific user -KK
app.post('/get-group-chores-data-for-user', async (req, res) => {
    try {
        const { group_id, username } = req.body;
        if (!group_id) {
            console.log("API get-group-chores-data: Missing group id or username.");
            return res.status(400).send("Missing group id or username.");
        }

        const user_id = await getUserId(username);

        const query = `
            SELECT 
                group_chores.group_id, 
                group_chores.group_chore_name,
                group_chores.is_completed AS chore_is_completed,
                group_chores.recurrence AS chore_recurrence,
                group_tasks.id,
                group_tasks.group_task_name,
                group_tasks.is_completed AS task_is_completed
            FROM group_chores
            LEFT JOIN group_tasks ON group_chores.id = group_tasks.group_chore_id
            WHERE group_chores.assigned_to = ? AND group_chores.group_id = ?
        `;

        const [results] = await db.promise().query(query, [user_id, group_id]);
        res.json(results);
    } catch (error) {
        console.error("API get-group-chores-data: Error:", error.message);
        res.status(500).send("Error retrieving chores.");
    }
});

// get group_name by group_id -MH
app.post('/get-group-name', async (req, res) => {
    const { group_id } = req.body;
    try {
        const [results] = await db.promise().query("SELECT group_name FROM group_names WHERE id = ?", [group_id]);
        if (results.length === 0) {
        return res.status(404).json({ error: 'Group not found' });
        }
        res.json({ group_name: results[0].group_name });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// add a new chore to the group -KK
app.post('/add-group-chore', async (req, res) => {
    try {
        const { group_chore_name, group_id, assign_to, recurrence } = req.body;
        if (!group_chore_name || !group_id || !assign_to || !recurrence) {
            console.log("API add-group-chore: Missing required fields.");
            return res.status(400).send("Missing required fields.");
        }  

        // TEMPORARY
        const user_id = await getUserId(assign_to);

        const [duplicate] = await db.promise().query("SELECT id FROM group_chores WHERE group_id = ? AND group_chore_name = ?", [group_id, group_chore_name]);
        if (duplicate.length > 0) {
            console.log("API add-group-chore: Duplicate chore name.");
            return res.status(400).send("This chore already exists for this group!");
        }

        const query = "INSERT INTO group_chores (group_id, group_chore_name, recurrence, assigned_to) VALUES (?, ?, ?, ?)";
        await db.promise().query(query, [group_id, group_chore_name, recurrence, user_id]);
        res.status(200).json({ message: "Chore added to group successfully." });
    } catch (error) {
        console.error("API add-group-chore: Error:", error.message);
        res.status(500).send("An error occurred while adding the chore to the group.");
    }
});

// update the details of a chore -MH
app.post('/update-group-chore', async (req, res) => {
    try {
        const { old_chore_name, new_chore_name, group_id, recurrence, assigned_to } = req.body;
        if (!old_chore_name || !new_chore_name || !group_id || !recurrence || !assigned_to) {
            console.log("API update-group-chore: Missing required fields.");
            return res.status(400).send("Missing required fields.");
        }
        
        // NEED TO CHANGE LATER
        const assign_to = await getUserId(assigned_to);
        // NEED TO CHANGE ABOVE LATER

        const { group_chore_id } = await getGroupChoreIdAndCompletionStatus(old_chore_name, group_id);

        // Update the chore details in the database
        const query = `
            UPDATE group_chores
            SET group_chore_name = ?, recurrence = ?, assigned_to = ?
            WHERE id = ?
        `;
        await db.promise().query(query, [new_chore_name, recurrence, assign_to, group_chore_id ]);

        res.status(200).json({ message: "Chore updated successfully." });
    } catch (error) {
        console.error("API update-group-chore: Error:", error.message);
        res.status(500).send("An error occurred while updating the chore.");
    }
});

app.post('/delete-group-chore', async (req, res) => {
    try {
        const { group_chore_name, group_id } = req.body;
        if (!group_chore_name || !group_id) {
            console.log("API delete-group-chore: Missing required fields.");
            return res.status(400).send("Missing required fields.");
        }

        const { group_chore_id } = await getGroupChoreIdAndCompletionStatus(group_chore_name, group_id);

        await db.promise().query("DELETE FROM group_chores WHERE id = ?", [group_chore_id]);
        res.status(200).json({ message: "Chore deleted successfully." });
    } catch (error) {
        console.error("API delete-group-chore: Error:", error.message);
        res.status(500).send("An error occurred while deleting the chore.");
    }
});

// toggle the completion status of a group chore, false -> true and true -> false -KK
app.post('/complete-group-chore', async (req, res) => {
    try {
        const { group_chore_name, group_id } = req.body;
    
        if (!group_chore_name || !group_id) {
            console.log("API complete-group-chore: Missing required fields.");
            return res.status(400).send("Missing required fields.");
        }
        
        const { group_chore_id } = await getGroupChoreIdAndCompletionStatus(group_chore_name, group_id);
        
        await db.promise().query("UPDATE group_chores SET is_completed = NOT is_completed WHERE id = ?", [group_chore_id]);

        res.status(200).json({ message: "Chore completion status toggled successfully." });
    } catch (error) {
        console.error("API complete-group-chore: Error:", error.message);
        res.status(500).send("An error occurred while toggling chore completion status.");
    }
});


/********************************************************** */
/*               GROUP TASK IMPLEMENTATION BELOW:           */
/********************************************************** */
// gets a list of all tasks given a group chore -KK
app.post('/get-group-tasks', async (req, res) => {
    try {
        const { group_chore_name, group_id } = req.body;
        if(!group_chore_name || !group_id){
            console.log("API get-group-tasks: Missing group name or chore name.");
            return res.status(400).send("Missing group name or chore name.");
        }

        const { group_chore_id } = await getGroupChoreIdAndCompletionStatus(group_chore_name, group_id);

        // get the tasks from the database -KK
        const [group_tasks] = await db.promise().query("SELECT group_task_name from group_tasks WHERE group_chore_id = ?", [group_chore_id]);
        res.status(200).json(group_tasks);
    } catch (error) {
        console.error("API get-group-tasks: Error:", error.message);
        res.status(500).send("An error occurred while adding the task.");
    }
});

// adds a task for a given group chore to the database -KK
app.post('/add-group-task', async (req, res) => {
    try {
        const { group_chore_name, group_task_name, group_id } = req.body;
        if(!group_chore_name || !group_task_name || !group_id){
            console.log("API add-group-task: Missing fields.");
            return res.status(400).send("Missing fields.");
        } 

        const { group_chore_id, is_completed } = await getGroupChoreIdAndCompletionStatus(group_chore_name, group_id);
        const [duplicate] = await db.promise().query("SELECT id FROM group_tasks WHERE group_task_name = ? AND group_chore_id = ?", [group_task_name, group_chore_id]);
        if (duplicate.length > 0) {
            console.log("API add-group-task: Duplicate task name.");
            return res.status(400).send("This task already exists!");
        }

        // add the task to the database -KK
        await db.promise().query("INSERT INTO group_tasks (group_chore_id, group_task_name) VALUES (?, ?)", [group_chore_id, group_task_name]);  
        
        // mark chore as incomplete -KK
        if(is_completed){
            await db.promise().query("UPDATE group_chores SET is_completed = NOT is_completed WHERE id = ?", [group_chore_id]);
        }
        res.status(200).json({ message: "Changed completion successfully." });
    } catch (error) {
        console.error("API add-group-task: Error:", error.message);
        res.status(500).send("An error occurred while adding the task.");
    }
});
   
// deletes a task for a given chore from the database -KK
app.post('/delete-group-task', async (req, res) => {
    try {
        const { group_chore_name, group_task_name, group_id } = req.body;
        if (!group_chore_name || !group_task_name || !group_id) {
            console.log("API delete-group-task: Missing fields.");
            return res.status(400).send("Missing fields.");
        }

        const { group_chore_id } = await getGroupChoreIdAndCompletionStatus(group_chore_name, group_id);
        const group_task_id = await getGroupTaskId(group_task_name, group_chore_id);

        await db.promise().query("DELETE FROM group_tasks WHERE id = ?", [group_task_id]);
        res.status(200).json({ message: "Task deleted successfully." });
    } catch (error) {
        console.error("API delete-group-task: Error:", error.message);
        res.status(500).send("An error occurred while deleting the task.");
    }
});

// toggles the completion status of the task, false -> true and true -> false -KK
app.post('/complete-group-task', async (req, res) => {
    try {
        const { group_chore_name, group_task_name, group_id } = req.body;
        if (!group_chore_name || !group_task_name || !group_id) {
            console.log("API complete-group-task: Missing fields.");
            return res.status(400).send("Missing fields.");
        }

        const { group_chore_id } = await getGroupChoreIdAndCompletionStatus(group_chore_name, group_id);
        const group_task_id = await getGroupTaskId(group_task_name, group_chore_id);

        await db.promise().query("UPDATE group_tasks SET is_completed = NOT is_completed WHERE id = ?", [group_task_id]);
        res.status(200).json({ message: "Task completion status toggled successfully." });
    } catch (error) {
        console.error("API complete-group-task: Error:", error.message);
        res.status(500).send("An error occurred while toggling task completion status.");
    }
});

// matches the completion status of the task to match the completion status of the chore
app.post('/match-group-task', async (req, res) => {
    try {
        const { group_chore_name, group_task_name, group_id } = req.body;
        if (!group_chore_name || !group_task_name || !group_id) {
            console.log("API match-group-task: Missing fields.");
            return res.status(400).send("Missing fields.");
        }

        const { group_chore_id, is_completed } = await getGroupChoreIdAndCompletionStatus(group_chore_name, group_id);
        const group_task_id = await getGroupTaskId(group_task_name, group_chore_id);

        await db.promise().query("UPDATE group_tasks SET is_completed = ? WHERE id = ?", [is_completed, group_task_id]);
        res.status(200).json({ message: "Task completion status matched successfully." });
    } catch (error) {
        console.error("API match-group-task: Error:", error.message);
        res.status(500).send("An error occurred while matching task completion status.");
    }
});


// keep this at the very bottom of the file -KK
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}.`)
    console.log(`Access server at ${process.env.API_URL}`)
});
// index.js

// ALL BACKEND CODE HAPPENS HERE -KK

var express = require("express");
const cors = require("cors");
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
    // replace yourpassword with your mysql root password --Ethan
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

app.get('/home', (req, res) => {
    // this is what will display when visiting http://ipv4:3000/home -KK
    res.send("Welcome to the Home Page!")
});

app.get('/get_users', (req, res) => {
    // db.query('SELECT * FROM users', (err, results) => {
    db.query('SELECT id, username, display_name FROM users', (err, results) => {
        if (err) {
            console.error("API get_users: Error querying database: ", err.message);
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

// gets the chore id and completion status given a chore_name -KK
async function getChoreIdAndCompletionStatus(chore_name, user_id) {
    const [results] = await db.promise().query("SELECT id, is_completed FROM chores WHERE chore_name = ? AND user_id = ?", [chore_name, user_id]);    if (results.length === 0) {
        console.log(`API getChoreId: Chore ${chore_name} not found`);
        throw new Error(`Chore ${chore_name} not found`);
    }
    return { chore_id: results[0].id, is_completed: results[0].is_completed };
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

/********************************************************** */
/*                USER AUTHENTICATION BELOW:                */
/********************************************************** */
// user registration 
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

app.post('/logout', (req, res) => {
    // Nathan pls handle token invalidation on the client side. -- Ethan
    res.status(200).json({ message: 'Logged out successfully!' });
});

/********************************************************** */
/*                USER IMPLEMENTATION BELOW:                */
/********************************************************** */
// get the user's display name
app.post('/get_display', async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            console.log("API get_display: Missing username.");
            return res.status(400).send("Missing username.");
        }
        const user_id = await getUserId(username);

        const [results] = await db.promise().query("SELECT display_name FROM users WHERE id = ?", [user_id]);
        res.status(200).json(results);
    } catch (error) {
        console.error("API get_display: Error:", error.message);
        res.status(500).send("Error getting display name.");
    }
});

// changes the display name for a user
app.post('/update_display', async (req, res) => {
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

// get the user's theme
app.post('/get_theme', async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            console.log("API get_theme: Missing username.");
            return res.status(400).send("Missing username.");
        }
        const user_id = await getUserId(username);

        const [results] = await db.promise().query("SELECT theme FROM users WHERE id = ?", [user_id]);
        res.status(200).json(results);
    } catch (error) {
        console.error("API update_theme: Error:", error.message);
        res.status(500).send("Error getting theme.");
    }
});

// changes the theme for a user
app.post('/update_theme', async (req, res) => {
    try {
        const { username, theme } = req.body;
        if (!username || !theme) {
            console.log("API update_theme: Missing username or theme.");
            return res.status(400).send("Missing username or theme.");
        }
        const user_id = await getUserId(username);

        const [results] = await db.promise().query("UPDATE users SET theme = ? WHERE id = ?", [theme, user_id]);
        res.json(results);
    } catch (error) {
        console.error("API update_theme: Error:", error.message);
        res.status(500).send("Error updating theme.");
    }
});

/********************************************************** */
/*             TASK IMPLEMENTATION BELOW:                   */
/********************************************************** */
// get all chores for a user -KK
app.post('/get_chores', async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            console.log("API get_chores: Missing username.");
            return res.status(400).send("Missing username.");
        }

        const user_id = await getUserId(username);

        const [results] = await db.promise().query("SELECT id, chore_name, recurrence FROM chores WHERE user_id = ?", [user_id]);
        res.json(results);
    } catch (error) {
        console.error("API get_chores: Error:", error.message);
        res.status(500).send("Error retrieving chores.");
    }
});

// get all the chores and associated tasks for a specific user -KK
app.post('/get_chores_data', async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            console.log("API get_chores_data: Missing username.");
            return res.status(400).send("Missing username.");
        }

        const user_id = await getUserId(username);

        const query = `
            SELECT 
                chores.chore_name, 
                chores.is_completed AS chore_is_completed, 
                chores.recurrence AS chore_recurrence,
                tasks.task_name, 
                tasks.is_completed AS task_is_completed
            FROM chores
            LEFT JOIN tasks ON chores.id = tasks.chore_id
            WHERE chores.user_id = ?
        `;

        const [results] = await db.promise().query(query, [user_id]);
        res.json(results);
    } catch (error) {
        console.error("API get_chores_data: Error:", error.message);
        res.status(500).send("Error retrieving chores.");
    }
});

// add a new chore for the user -KK
app.post('/add_chore', async (req, res) => {
    try {
        const { chore_name, username, recurrence } = req.body;
        if (!chore_name || !username || !recurrence) {
            console.log("API add_chore: Missing chore, username, or recurrence.");
            return res.status(400).send("Missing chore, username, or recurrence.");
        }

        const user_id = await getUserId(username);
        const [duplicate] = await db.promise().query("SELECT id FROM chores WHERE user_id = ? AND chore_name = ?", [user_id, chore_name]);
        if (duplicate.length > 0) {
            console.log("API add_chore: Duplicate chore name.");
            return res.status(400).send("This chore already exists!");
        }

        const query = "INSERT INTO chores (user_id, chore_name, is_completed, recurrence) VALUES (?, ?, false, ?)";
        await db.promise().query(query, [user_id, chore_name, recurrence]);
        res.status(200).json({ message: "Chore added successfully." });
    } catch (error) {
        console.error("API add_chore: Error:", error.message);
        res.status(500).send("An error occurred while adding the chore.");
    }
});

// update the details of a chore -MH
app.post('/update_chore', async (req, res) => {
    try {
        const { old_chore_name, new_chore_name, username, recurrence } = req.body;
        if (!old_chore_name || !new_chore_name || !username || !recurrence) {
            console.log("API update_chore: Missing required fields.");
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
        console.error("API update_chore: Error:", error.message);
        res.status(500).send("An error occurred while updating the chore.");
    }
});

// deletes a chore for the user from the database -KK
app.post('/delete_chore', async (req, res) => {
    try {
        const { chore_name, username } = req.body;
        if (!chore_name || !username) {
            console.log("API delete_chore: Missing chore or username.");
            return res.status(400).send("Missing chore or username.");
        }

        const user_id = await getUserId(username);
        const { chore_id } = await getChoreIdAndCompletionStatus(chore_name, user_id);

        await db.promise().query("DELETE FROM chores WHERE id = ?", [chore_id]);
        res.status(200).json({ message: "Chore deleted successfully." });
    } catch (error) {
        console.error("API delete_chore: Error:", error.message);
        res.status(500).send("An error occurred while deleting the chore.");
    }
});

// toggle the completion status of a chore, false -> true and true -> false -KK
app.post('/complete_chore', async (req, res) => {
    try {
        const { chore_name, username } = req.body;
        if (!chore_name || !username) {
            console.log("API complete_chore: Missing username or chore name.");
            return res.status(400).send("Missing username or chore name.");
        }

        const user_id = await getUserId(username);
        const { chore_id } = await getChoreIdAndCompletionStatus(chore_name, user_id);

        await db.promise().query("UPDATE chores SET is_completed = NOT is_completed WHERE id = ?", [chore_id]);
        res.status(200).json({ message: "Chore completion status toggled successfully." });
    } catch (error) {
        console.error("API complete_chore: Error:", error.message);
        res.status(500).send("An error occurred while toggling chore completion status.");
    }
});


/********************************************************** */
/*               TASK IMPLEMENTATION BELOW:                 */
/********************************************************** */
// gets a list of tasks given a chore -KK
app.post('/get_tasks', async (req, res) => {
    try {
        const { chore_name, username } = req.body;
        if(!chore_name || !username){
            console.log("API get_tasks: Missing username or chore name.");
            return res.status(400).send("Missing username or chore name.");
        }

        const user_id = await getUserId(username);
        const { chore_id } = await getChoreIdAndCompletionStatus(chore_name, user_id);

        // get the tasks from the database -KK
        const [tasks] = await db.promise().query("SELECT task_name from tasks WHERE chore_id = ?", [chore_id]);
        res.status(200).json(tasks);
    } catch (error) {
        console.error("API get_tasks: Error:", error.message);
        res.status(500).send("An error occurred while adding the task.");
    }
});

// adds a task for a given chore to the database -KK
app.post('/add_task', async (req, res) => {
    try {
        const { chore_name, task_name, username } = req.body;
        if(!chore_name || !task_name || !username){
            console.log("API add_task: Missing username, chore name, or task name.");
            return res.status(400).send("Missing username, chore name, or task name.");
        }

        const user_id = await getUserId(username);
        const { chore_id, is_completed } = await getChoreIdAndCompletionStatus(chore_name, user_id);
        const [duplicate] = await db.promise().query("SELECT id FROM tasks WHERE task_name = ? AND chore_id = ?", [task_name, chore_id]);
        if (duplicate.length > 0) {
            console.log("API add_task: Duplicate task name.");
            return res.status(400).send("This task already exists!");
        }

        // add the task to the database -KK
        await db.promise().query("INSERT INTO tasks (chore_id, task_name, is_completed) VALUES (?, ?, false)", [chore_id, task_name]);  
        
        // mark chore as incomplete -KK
        if(is_completed){
            await db.promise().query("UPDATE chores SET is_completed = NOT is_completed WHERE id = ?", [chore_id]);
        }
        res.status(200).json({ message: "Changed completion successfully." });
    } catch (error) {
        console.error("API add_task: Error:", error.message);
        res.status(500).send("An error occurred while adding the task.");
    }
});
   
// deletes a task for a given chore from the database -KK
app.post('/delete_task', async (req, res) => {
    try {
        const { chore_name, task_name, username } = req.body;
        if (!chore_name || !task_name || !username) {
            console.log("API delete_task: Missing username, chore name, or task name.");
            return res.status(400).send("Missing username, chore name, or task name.");
        }

        const user_id = await getUserId(username);
        const { chore_id } = await getChoreIdAndCompletionStatus(chore_name, user_id);
        const task_id = await getTaskId(task_name, chore_id);

        await db.promise().query("DELETE FROM tasks WHERE id = ?", [task_id]);
        res.status(200).json({ message: "Task deleted successfully." });
    } catch (error) {
        console.error("API delete_task: Error:", error.message);
        res.status(500).send("An error occurred while deleting the task.");
    }
});

// toggles the completion status of the task, false -> true and true -> false -KK
app.post('/complete_task', async (req, res) => {
    try {
        const { chore_name, task_name, username } = req.body;
        if (!chore_name || !task_name || !username) {
            console.log("API complete_task: Missing username, chore name, or task name.");
            return res.status(400).send("Missing username, chore name, or task name.");
        }

        const user_id = await getUserId(username);
        const { chore_id } = await getChoreIdAndCompletionStatus(chore_name, user_id);
        const task_id = await getTaskId(task_name, chore_id);

        await db.promise().query("UPDATE tasks SET is_completed = NOT is_completed WHERE id = ?", [task_id]);
        res.status(200).json({ message: "Task completion status toggled successfully." });
    } catch (error) {
        console.error("API complete_task: Error:", error.message);
        res.status(500).send("An error occurred while toggling task completion status.");
    }
});

// matches the completion status of the task to match the completion status of the chore
app.post('/match_task', async (req, res) => {
    try {
        const { chore_name, task_name, username } = req.body;
        if (!chore_name || !task_name || !username) {
            console.log("API match_task: Missing username, chore name, or task name.");
            return res.status(400).send("Missing username, chore name, or task name.");
        }

        const user_id = await getUserId(username);
        const { chore_id, is_completed } = await getChoreIdAndCompletionStatus(chore_name, user_id);
        const task_id = await getTaskId(task_name, chore_id);

        await db.promise().query("UPDATE tasks SET is_completed = ? WHERE id = ?", [is_completed, task_id]);
        res.status(200).json({ message: "Task completion status matched successfully." });
    } catch (error) {
        console.error("API match_task: Error:", error.message);
        res.status(500).send("An error occurred while matching task completion status.");
    }
});


/********************************************************** */
/*               SERVER LOGS BELOW:                         */
/********************************************************** */

// keep this at the very bottom of the file -KK
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}.`)
    console.log(`Access server at ${process.env.API_URL}`)
});


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
    // host: process.env.DB_HOST,
    // database: "choremates",   
    // user: process.env.DB_USER,
    host: "localhost",
    database: "choremates",   
    user: "root",
    // put "DB_PASSWORD=yourpassword" in your local .env file, replace yourpassword with your mysql root password --Ethan
    password: process.env.DB_PASSWORD, 
});

// connect to the database
db.connect((err) =>{
    if (err){
        console.log("Error connecting to database: ", err.message);

        return;
    }
    console.log("Connected to database.");
});


/********************************************************** */
/*             ALL GET AND POST PATHS BELOW:                */
/********************************************************** */

app.get('/chores', (req, res) => {
    const sql = `SELECT id, chore_name FROM chores;`; // Add id to the query
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching chores:', err);
            return res.status(500).send('Failed to retrieve chores');
        }
        res.status(200).json(results);
    });
});


// Added to test using forms to add chores -VA
app.post('/addChore', (req, res) => {
    const { user_id, chore_name } = req.body;
    const sql = `INSERT INTO chores (user_id, chore_name, is_completed) VALUES (?, ?, ?)`;
    
    db.query(sql, [user_id, chore_name, 0], (err, results) => {
        if (err) {
            console.error('Error adding chore:', err);
            return res.status(500).send('Failed to add chore');
        }
        res.status(200).send('Chore added successfully');
    });
});

app.get('/', (req, res) => {    
    // this is what will display when visiting http://localhost:3000/ -KK
    res.send("Hello World!")
});

app.get('/home', (req, res) => {
    // this is what will display when visiting http://localhost:3000/home -KK
    res.send("Welcome to the Home Page!")
});

// app.get('/get_users', (req, res) => {
//     db.query('SELECT * FROM users', (err, results) => {
//         if (err) {
//             console.error("API: Error querying database: ", err.message);
//             return res.status(500).send("Error querying database.");
//         }
//         res.json(results);
//     });
// });

app.get('/get_users', (req, res) => {
    db.query('SELECT id, username, display_name FROM users', (err, results) => {
        if (err) {
            console.error("API: Error querying database: ", err.message);
            return res.status(500).send("Error querying database.");
        }
        res.json(results);
    });
});



/********************************************************** */
/*                USER AUTHENTICATION BELOW:                */
/********************************************************** */
// user registration 
app.post('/register', async (req, res) => {
    console.log("Registration request received");
    console.log(req.body);

    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Missing username or password" });
    }

    try {
        // Check if the username already exists
        db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
            if (err) {
                console.error("Error checking for existing user: ", err.message);
                return res.status(500).json({ error: "Error checking for existing user" });
            }

            if (results.length > 0) {
                return res.status(409).json({ error: "Username already exists" }); // 409
            }

            // if the username does not exist, proceed with hashing the password and inserting the user
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log("Password hashed successfully");

            db.query('INSERT INTO users (username, security_key) VALUES (?, ?)', [username, hashedPassword], 
            (err, result) => {
                if (err) {
                    console.error("Error inserting into database: ", err.message);
                    return res.status(500).json({ error: "Registration failed (database error)" });
                }
                console.log("User registered successfully!");
                res.status(201).json({ message: 'User registered successfully!' });
            });
        });

    } catch (err) {
        console.error("Registration process failed:", err);
        return res.status(500).json({ error: "Registration failed" });
    }
});

// user login
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

// user logout
app.post('/logout', (req, res) => {
    // Nathan pls handle token invalidation on the client side. -- Ethan
    res.status(200).json({ message: 'Logged out successfully!' });
});


/********************************************************** */
/*              CHORE IMPLEMENTATION BELOW:                 */
/********************************************************** */
app.get('/get_chores', (req, res) => {
    const user_id = req.query.user_id;

    const baseQuery = `
        SELECT 
            chores.chore_name, 
            chores.is_completed AS chore_is_completed, 
            tasks.task_name, 
            tasks.is_completed AS task_is_completed
        FROM chores
        LEFT JOIN tasks ON chores.id = tasks.chore_id
    `;

    if (!user_id) { 
        console.log("API: No user specified. Returning all items.");

        db.query(baseQuery, (err, results) => {
            if (err) {
                console.error("API: Error querying database: ", err.message);
                return res.status(500).send("Error querying database.");
            }
            res.json(results);
        });
        // return res.status(400).send("Missing user_id.");
        // change this section to the above line later for more security -KK
    } else {
        //console.log(`API: Returning items for user_id ${user_id}`);

        db.query(`${baseQuery} WHERE chores.user_id = ?`, [user_id], (err, results) => {
            if (err) {
                console.error("API: Error querying database: ", err.message);
                return res.status(500).send("Error querying database.");
            }
            res.json(results);
        });
    }
});


/********************************************************** */
/*               TASK IMPLEMENTATION BELOW:                 */
/********************************************************** */
app.get('/get_tasks', (req, res) => {
    const user_id = req.query.user_id; 
    if (!user_id) { // no user is specified, display all items -KK
        console.log("API: No user specified. Returning all items."); 
        db.query('SELECT * FROM tasks', (err, results) => {
            if (err) {
                console.error("API: Error querying database: ", err.message);
                return res.status(500).send("Error querying database.");
            }
            res.json(results);
        });
        // return res.status(400).send("Missing user_id.");
        // change this section to the above line later for more security -KK
    }
    else{
        const query = `
            SELECT chores.chore_name, tasks.task_name
            FROM tasks
            JOIN chores ON tasks.chore_id = chores.id
            WHERE chores.user_id = ?
        `;

        db.query(query, [user_id], (err, results) => {
            if (err) {
                console.error("API: Error querying database: ", err.message);
                return res.status(500).send("Error querying database.");
            }
            res.json(results);
        });
    }
});

// pre: chore_name and task_name -KK
app.post('/add_task', (req, res) => {
    const chore_name = req.query.chore_name;    // query is what gets passed in through the url -KK
    const task_name = req.body.task_name;       // body is what gets passed in to "post" on the ui side -KK
    const user_id = req.body.user_id;
    if(!chore_name || !task_name){
        console.log("API: Missing chore or task name.");
        return res.status(400).send("Missing chore or task name.");
    }

    // get the chore id from the chore name passed into the request -KK
    db.query("SELECT id FROM chores WHERE chore_name = ? AND user_id = ?", [chore_name, user_id], (err, results) => {
        if (err) {
            console.error("API: Error retrieving chore id: ", err.message);
            return res.status(500).send("Error retrieving chore id.");
        }
        
        if (results.length == 0) {
            console.log("API: Chore not found.");
            return res.status(404).send("Not found.");
        }

        const chore_id = results[0].id;

        // check to see if the task already exists for the chore -KK
        db.query("SELECT id FROM tasks WHERE task_name = ? AND chore_id = ?", [task_name, chore_id], (err, results) => {
            if (err) {
                console.error("API: Error checking for duplicate item: ", err.message);
                return res.status(500).send("Error checking for duplicate item.");
            }

            if (results.length > 0) {
                console.log("API: Duplicate task name.");
                return res.status(400).send("This task already exists for your chore!");
            }


            // insert the new task into the task table -KK
            const query = `INSERT INTO tasks (chore_id, task_name) VALUES (?, ?)`;
            db.query(query, [chore_id, task_name], (err, results) => {
                if (err) {
                    console.error("API: Error inserting into database: ", err.message);
                    return res.status(500).send("Error inserting into database.");
                }
                res.json("Added item successfully.");
            });
        });
    });
})

// pre: chore_name and task_name -KK
app.delete('/delete_task', (req, res) => {
    const chore_name = req.query.chore_name; 
    const task_name = req.query.task_name;

    if(!chore_name || !task_name){
        console.log("API: Missing chore or task name.");
        return res.status(400).send("Missing chore name or task description.");
    }

    // get the chore id from the chore name passed into the request -KK
    db.query("SELECT id from chores WHERE chore_name = ?", [chore_name], (err, results) => {
        if (err) {
            console.error("API: Error retrieving chore id: ", err.message);
            return res.status(500).send("Error retrieving chore id.");
        }
        
        if (results.length == 0) {
            console.log("API: Chore not found.");
            return res.status(404).send("Not found.");
        }

        const chore_id = results[0].id;

        // delete the task -KK
        const query = `DELETE FROM tasks WHERE chore_id = ? AND task_name = ?`;
        db.query(query, [chore_id, task_name], (err, results) => {
            if (err) {
                console.error("API: Error deleting task from database: ", err.message);
                return res.status(500).send("Error deleting task from database.");
            }
            res.json("Deleted task successfully.");
        });
    });
})




// keep this at the very bottom of the file -KK
app.listen(PORT, () => console.log(`Server listening on port ${PORT}.`));


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
    db.query('SELECT username FROM users', (err, results) => {
        if (err) {
            console.error("API get_users: Error querying database: ", err.message);
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

            db.query('INSERT INTO users (username, security_key) VALUES (?, ?)', [username, hashedPassword], 
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


/********************************************************** */
/*              LOGIN/LOGOUT BELOW:                         */
/********************************************************** */
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
/*              CHORE IMPLEMENTATION BELOW:                 */
/********************************************************** */
app.get('/chores', (req, res) => {
    const sql = `SELECT id, chore_name FROM chores`; // Add id to the query
    db.query(sql, (err, results) => {
        if (err) {
            console.error('API chores: Error fetching chores:', err);
            return res.status(500).send('Failed to retrieve chores');
        }
        res.status(200).json(results);
    });
});

// pre: username -KK
app.get('/get_chores', (req, res) => {
    const username = req.body.username;

    if(!username){
        console.log("API get_chores: Missing username.");
        return res.status(400).send("Missing username.");
    }

    // get the user id from the username passed into the request -KK
    db.query("SELECT id from users WHERE username = ?", [username], (err, results) => {
        if (err) {
            console.error("API get_chores: Error retrieving user id: ", err.message);
            return res.status(500).send("Error retrieving user id.");
        }
        
        if (results.length == 0) {
            console.log("API get_chores: User not found.");
            return res.status(404).send("Not found.");
        }

        const user_id = results[0].id;

        const baseQuery = `
            SELECT 
                chores.chore_name, 
                chores.is_completed AS chore_is_completed, 
                tasks.task_name, 
                tasks.is_completed AS task_is_completed
            FROM chores
            LEFT JOIN tasks ON chores.id = tasks.chore_id
        `;

        db.query(`${baseQuery} WHERE chores.user_id = ?`, [user_id], (err, results) => {
            if (err) {
                console.error("API get_chores: Error querying database: ", err.message);
                return res.status(500).send("Error querying database.");
            }
            res.json(results);
        });
    });
});

// Added to test using forms to add chores -VA
// pre: chore_name, username -KK
app.post('/add_chore', (req, res) => {
    const chore_name = req.body.chore_name;    
    const username = req.body.username;
    if(!chore_name || !username){
        console.log("API add_chore: Missing chore or username.");
        return res.status(400).send("Missing chore or username.");
    }

    // get the user id from the username passed into the request -KK
    db.query("SELECT id from users WHERE username = ?", [username], (err, results) => {
        if (err) {
            console.error("API add_chore: Error retrieving user id: ", err.message);
            return res.status(500).send("Error retrieving user id.");
        }
        
        if (results.length == 0) {
            console.log("API add_chore: User not found.");
            return res.status(404).send("Not found.");
        }

        const user_id = results[0].id;

        // check to see if the chore already exists for this user -KK
        db.query("SELECT id FROM chores WHERE user_id = ? AND chore_name = ?", [user_id, chore_name], (err, results) => {
            if (err) {
                console.error("API add_chore: Error checking for duplicate item: ", err.message);
                return res.status(500).send("Error checking for duplicate item.");
            }

            if (results.length > 0) {
                console.log("API add_chore: Duplicate chore name.");
                return res.status(400).send("This chore already exists!");
            }

            // insert the new chore into the chores table -KK
            const query = `INSERT INTO chores (user_id, chore_name, is_completed) VALUES (?, ?, false)`;
            db.query(query, [user_id, chore_name], (err, results) => {
                if (err) {
                    console.error("API add_chore: Error inserting into database: ", err.message);
                    return res.status(500).send("Error inserting into database.");
                }
                res.json("Added item successfully.");
            });
        });
    });
})

// pre: user_id and chore_name -KK
app.delete('/delete_chore', (req, res) => {
    const chore_name = req.query.chore_name; 
    const user_id = req.body.user_id;

    if(!chore_name || !user_id){
        console.log("API delete_chore: Missing chore or username.");
        return res.status(400).send("Missing chore or username.");
    }

    // get the chore id from the chore name passed into the request -KK
    db.query("SELECT id from chores WHERE chore_name = ? AND user_id = ?", [chore_name, user_id], (err, results) => {
        if (err) {
            console.error("API delete_chore: Error retrieving chore id: ", err.message);
            return res.status(500).send("Error retrieving chore id.");
        }
        
        if (results.length == 0) {
            console.log("API delete_chore: Chore not found.");
            return res.status(404).send("Not found.");
        }

        const chore_id = results[0].id;

        // delete the chore -KK
        const query = `DELETE FROM chores WHERE chore_id = ?`;
        db.query(query, [chore_id], (err, results) => {
            if (err) {
                console.error("API delete_chore: Error deleting task from database: ", err.message);
                return res.status(500).send("Error deleting task from database.");
            }
            res.json("Deleted task successfully.");
        });
    });
})


/********************************************************** */
/*               TASK IMPLEMENTATION BELOW:                 */
/********************************************************** */
app.get('/get_tasks', (req, res) => {
    const user_id = req.query.user_id; 
    if (!user_id) { // no user is specified
        return res.status(400).send("Missing user_id.");
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
                console.error("API get_tasks: Error querying database: ", err.message);
                return res.status(500).send("Error querying database.");
            }
            res.json(results);
        });
    }
});

// pre: chore_name and task_name -KK
app.post('/add_task', (req, res) => {
    const chore_name = req.body.chore_name;    // query is what gets passed in through the url -KK
    const task_name = req.body.task_name;       // body is what gets passed in to "post" on the ui side -KK
    const username = req.body.username;
    if(!chore_name || !task_name){
        console.log("API add_task: Missing chore or task name.");
        return res.status(400).send("Missing chore or task name.");
    }

    // get the user id from the username passed into the request -KK
    db.query("SELECT id from users WHERE username = ?", [username], (err, results) => {
        if (err) {
            console.error("API add_task: Error retrieving user id: ", err.message);
            return res.status(500).send("Error retrieving user id.");
        }
        
        if (results.length == 0) {
            console.log("API add_task: User not found.");
            return res.status(404).send("Not found.");
        }

        const user_id = results[0].id;

        // get the chore id from the chore name passed into the request -KK
        db.query("SELECT id FROM chores WHERE chore_name = ? AND user_id = ?", [chore_name, user_id], (err, results) => {
            if (err) {
                console.error("API add_task: Error retrieving chore id: ", err.message);
                return res.status(500).send("Error retrieving chore id.");
            }
            
            if (results.length == 0) {
                console.log("API add_task: Chore not found.");
                return res.status(404).send("Not found.");
            }

            const chore_id = results[0].id;

            // check to see if the task already exists for the chore -KK
            db.query("SELECT id FROM tasks WHERE task_name = ? AND chore_id = ?", [task_name, chore_id], (err, results) => {
                if (err) {
                    console.error("API add_task: Error checking for duplicate item: ", err.message);
                    return res.status(500).send("Error checking for duplicate item.");
                }

                if (results.length > 0) {
                    console.log("API add_task: Duplicate task name.");
                    return res.status(400).send("This task already exists for your chore!");
                }


                // insert the new task into the task table -KK
                const query = `INSERT INTO tasks (chore_id, task_name) VALUES (?, ?)`;
                db.query(query, [chore_id, task_name], (err, results) => {
                    if (err) {
                        console.error("API add_task: Error inserting into database: ", err.message);
                        return res.status(500).send("Error inserting into database.");
                    }
                    res.json("Added item successfully.");
                });
            });
        });
    });
})

// pre: chore_name and task_name -KK
app.delete('/delete_task', (req, res) => {
    const chore_name = req.query.chore_name; 
    const task_name = req.query.task_name;

    if(!chore_name || !task_name){
        console.log("API delete_task: Missing chore or task name.");
        return res.status(400).send("Missing chore name or task description.");
    }

    // get the chore id from the chore name passed into the request -KK
    db.query("SELECT id from chores WHERE chore_name = ?", [chore_name], (err, results) => {
        if (err) {
            console.error("API delete_task: Error retrieving chore id: ", err.message);
            return res.status(500).send("Error retrieving chore id.");
        }
        
        if (results.length == 0) {
            console.log("API delete_task: Chore not found.");
            return res.status(404).send("Not found.");
        }

        const chore_id = results[0].id;

        // delete the task -KK
        const query = `DELETE FROM tasks WHERE chore_id = ? AND task_name = ?`;
        db.query(query, [chore_id, task_name], (err, results) => {
            if (err) {
                console.error("API delete_task: Error deleting task from database: ", err.message);
                return res.status(500).send("Error deleting task from database.");
            }
            res.json("Deleted task successfully.");
        });
    });
})




// keep this at the very bottom of the file -KK
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}.`)
    console.log(`Access server at ${process.env.API_URL}`)
});


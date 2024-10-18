// ChoreMates Project
// CSE 115A with Professor Richard Jullig @ UCSC


// ALL BACKEND CODE HAPPENS HERE -KK

var express = require("express");
const cors = require("cors");
const PORT = 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/********************************************************** */
/*              DATABASE CONNECTION BELOW:                  */
/********************************************************** */
require('dotenv').config();  // load env variables

const mysql = require('mysql2');
const db = mysql.createConnection({
    host: "localhost",
    database: "choremates",   
    user: "root",
    password: process.env.DB_PASSWORD,     // change this to your own password that
                                            // you created when installing mysql -KK
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
app.get('/', (req, res) => {    
    // this is what will display when visiting http://localhost:3000/ -KK
    res.send("Hello World!")
});

app.get('/home', (req, res) => {
    // this is what will display when visiting http://localhost:3000/home -KK
    res.send("Welcome to the Home Page!")
});

app.get('/get_users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error("API: Error querying database: ", err.message);
            return res.status(500).send("Error querying database.");
        }
        res.json(results);
    });
});


/********************************************************** */
/*             TASK IMPLEMENTATION BELOW:                   */
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
            SELECT chores.chore, tasks.task
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
    db.query("SELECT id FROM chores WHERE chore = ? AND user_id = ?", [chore_name, user_id], (err, results) => {
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
        db.query("SELECT id FROM tasks WHERE task = ? AND chore_id = ?", [task_name, chore_id], (err, results) => {
            if (err) {
                console.error("API: Error checking for duplicate item: ", err.message);
                return res.status(500).send("Error checking for duplicate item.");
            }

            if (results.length > 0) {
                console.log("API: Duplicate task name.");
                return res.status(400).send("This task already exists for your chore!");
            }


            // insert the new task into the task table -KK
            const query = `INSERT INTO tasks (chore_id, task) VALUES (?, ?)`;
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
    db.query("SELECT id from chores WHERE chore = ?", [chore_name], (err, results) => {
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
        const query = `DELETE FROM tasks WHERE chore_id = ? AND task = ?`;
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


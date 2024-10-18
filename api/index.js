// ChoreMates Project
// CSE 115A with Professor Richard Jullig @ UCSC


// ALL BACKEND CODE HAPPENS HERE -KK

var express = require("express");
const cors = require("cors");
const PORT = 3000;


// const express = require('express');         // Added for Adding Chores -VA
const app = express();
const bodyParser = require('body-parser'); // Added for database connection to adding chores -VA

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());                 // For parsing application/json         -VA


/********************************************************** */
/*              DATABASE CONNECTION BELOW:                  */
/********************************************************** */
// <<<<<<< Updated upstream
require('dotenv').config();  // load env variables

// =======
const mysql = require('mysql2');
const db = mysql.createConnection({
    host: "localhost",
    database: "choremates",   
    user: "root",
    password: process.env.DB_PASSWORD,     // change this to your own password that
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

// Added to test using forms to add chores -VA
app.post('/addChore', (req, res) => {
    const { choreName } = req.body;
    const sql = `INSERT INTO chores (name) VALUES (?)`;
    db.query(sql, [choreName], (err, result) => {
      if (err) {
        return res.status(500).send('Failed to add chore');
      }
      res.status(200).send('Chore added successfully');
    });
  });

app.get('/chores', (req, res) => {
    const sql = `SELECT * FROM chores`;

    db.query(sql, (err, results) => {
        if (err) {
        console.error('Error fetching chores:', err);
        return res.status(500).send('Failed to retrieve chores');
        }
        res.status(200).json(results); // Return the list of chores
    });
});


// End of 'Added to test using forms to add chores' -VA

// keep this at the very bottom of the file -KK
app.listen(PORT, () => console.log(`Server listening on port ${PORT}.`));


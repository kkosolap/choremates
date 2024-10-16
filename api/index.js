// ChoreMates Project
// CSE 115A with Professor Richard Jullig @ UCSC


// ALL BACKEND CODE HAPPENS HERE -KK

var express = require("express");
const cors = require("cors");
const mysql = require('mysql2');
const bcrypt = require('bcrypts');
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

// ------------------------------------------Account------------------------------------------------
// user registration 
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query('INSERT INTO users (username, security_key) VALUES (?, ?)', [username, hashedPassword], 
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'User registered successfully!' });
    });
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



// keep this at the very bottom of the file -KK
app.listen(PORT, () => console.log(`Server listening on port ${PORT}.`));


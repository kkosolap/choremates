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
const mysql = require('mysql');
const db = mysql.createConnection({
    host: "localhost",
    database: "choremates",   
    user: "root",
    password: "Katkat560",     // change this to your own password that
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



// keep this at the very bottom of the file -KK
app.listen(PORT, () => console.log(`Server listening on port ${PORT}.`));


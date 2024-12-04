// connection.js

require('dotenv').config();  // load env variables
const mysql = require('mysql2');

/********************************************************** */
/*              DATABASE CONNECTION BELOW:                  */
/********************************************************** */
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

module.exports = db;
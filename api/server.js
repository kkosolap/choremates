// server.js

require('dotenv').config(); 

const app = require('./index'); 

const PORT = 3000;
const API_URL = process.env.API_URL;

// start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}.`);
    console.log(`Access server at ${API_URL}`);
});

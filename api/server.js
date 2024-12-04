// server.js

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/user');
const choresRoutes = require('./routes/chores');
const tasksRoutes = require('./routes/tasks');
const groupRoutes = require('./routes/groups');

require('./utils/recurrence');

app.use('/', authRoutes);
app.use('/', usersRoutes);
app.use('/', choresRoutes);
app.use('/', tasksRoutes);
app.use('/', groupRoutes);

const PORT = 3000;
const API_URL = process.env.API_URL;

// start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}.`);
    console.log(`Access server at ${API_URL}`);
});
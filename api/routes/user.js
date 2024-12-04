// user.js

const express = require('express');
const router = express.Router();

const db = require('../db/connection');
const { getUserId, canModifyChore } = require('../utils/helpers');

/********************************************************** */
/*                USER IMPLEMENTATION BELOW:                */
/********************************************************** */
// get id (user's id) -VA
router.post('/get-user-id', async (req, res) => {
    const { username } = req.body;
    try {
      const user_id = await getUserId(username);  
      
      res.json({ id: user_id });  
    } catch (error) {
      console.error('API get-user-id: Error fetching user ID:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });

// get the user's username from user_id -KK
router.post('/get-username', async (req, res) => {
    try {
        const { user_id } = req.body;
        if (!user_id) {
            console.log("API get-username: Missing user id.");
            return res.status(400).send("Missing user id.");
        }

        const results = await db.promise().query("SELECT username FROM users WHERE id = ?", [user_id]);
        res.status(200).json(results[0]);
    } catch (error) {
        console.error("API get-username: Error:", error.message);
        res.status(500).send("Error getting username.");
    }
});

// get the user's display name -KK
router.post('/get-display', async (req, res) => {
    try {
        let { username, user_id } = req.body;
        if (!username && !user_id) {
            console.log("API get-display: Missing username.");
            return res.status(400).send("Missing username.");
        }
        if(!user_id){
            user_id = await getUserId(username);
        }

        const [results] = await db.promise().query("SELECT display_name FROM users WHERE id = ?", [user_id]);
        res.status(200).json(results);
    } catch (error) {
        console.error("API get-display: Error:", error.message);
        res.status(500).send("Error getting display name.");
    }
});

// changes the display name for a user -KK
router.post('/update-display', async (req, res) => {
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

// get the user's theme -KK
router.post('/get-theme', async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            console.log("API get-theme: Missing username.");
            return res.status(400).send("Missing username.");
        }
        const user_id = await getUserId(username);

        const [results] = await db.promise().query("SELECT theme FROM users WHERE id = ?", [user_id]);
        res.status(200).json(results);
    } catch (error) {
        console.error("API get-theme: Error:", error.message);
        res.status(500).send("Error getting theme.");
    }
});

// changes the theme for a user -KK
router.post('/update-theme', async (req, res) => {
    try {
        const { username, theme } = req.body;
        if (!username || !theme) {
            console.log("API update-theme: Missing username or theme.");
            return res.status(400).send("Missing username or theme.");
        }
        const user_id = await getUserId(username);

        const [results] = await db.promise().query("UPDATE users SET theme = ? WHERE id = ?", [theme, user_id]);
        res.json(results);
    } catch (error) {
        console.error("API update-theme: Error:", error.message);
        res.status(500).send("Error updating theme.");
    }
});

// get the user's profile pic -KK
router.post('/get-profile', async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            console.log("API get-profile: Missing username.");
            return res.status(400).send("Missing username.");
        }
        const user_id = await getUserId(username);

        const [results] = await db.promise().query("SELECT profile_pic FROM users WHERE id = ?", [user_id]);
        res.status(200).json(results);
    } catch (error) {
        console.error("API get-profile: Error:", error.message);
        res.status(500).send("Error getting theme.");
    }
});

// changes the theme for a user -KK
router.post('/update-profile', async (req, res) => {
    try {
        const { username, profile_pic } = req.body;
        if (!username || !profile_pic) {
            console.log("API update-profile: Missing username or profile pic.");
            return res.status(400).send("Missing username or profile pic.");
        }
        const user_id = await getUserId(username);

        const [results] = await db.promise().query("UPDATE users SET profile_pic = ? WHERE id = ?", [profile_pic, user_id]);
        res.json(results);
    } catch (error) {
        console.error("API update-profile: Error:", error.message);
        res.status(500).send("Error updating theme.");
    }
});

// returns true if the user has editing rights for the group -KK
router.post('/get-perms', async (req, res) => {
    try {
        const { username, group_id } = req.body;
        if(!username || !group_id) {
            console.log("API get-perms: Missing required fields.");
            return res.status(400).send("Missing required fields.");
        }

        const perm = await canModifyChore(username, group_id);
        res.json(perm);
    } catch (error) {
        console.error("API get-perms: Error:", error.message);
        res.status(500).send("Error getting user permission.");
    }
});

module.exports = router;

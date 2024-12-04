// groups.js

const express = require('express');
const router = express.Router();

const db = require('../db/connection');
const { getUserId } = require('../utils/helpers');

/********************************************************** */
/*              GROUP IMPLEMENTATION BELOW:                 */
/********************************************************** */
// create a new group -EL
// input: group_name, username (the person who wants to create the group)
router.post('/create-group', async (req, res) => {
    const { group_name, username } = req.body;

    // check if group name and user ID are provided
    if (!group_name || !username) {
        return res.status(400).json({ error: "Missing group name or username" });
    }

    // check if group name is too long
    if (group_name.length > 14) {
        return res.status(400).json({ error: "Group name must be less than 15 characters" });
    }

    const user_id = await getUserId(username);

    // insert the new group into group_names
    db.query('INSERT INTO group_names (group_name) VALUES (?)', [group_name], (err, result) => {
        if (err) {
            console.error("API create-group: Error creating group: ", err.message);
            return res.status(500).json({ error: "Failed to create group" });
        }

        // id of the newly created group
        const groupId = result.insertId;

        // add the creator as a member of the group with the role of admin
        db.query('INSERT INTO group_members (user_id, group_id, role) VALUES (?, ?, ?)', [user_id, groupId, 'admin'], (err) => {
            if (err) {
                console.error("API create-group: Error adding group member: ", err.message);
                return res.status(500).json({ error: "Failed to add user to group" });
            }

            res.status(201).json({ message: 'Group created successfully', group_id: groupId });
        });
    });
});

// get group member info -EL
// input: group_id
// output: member's username, member's display name, user_id, role
router.get('/get-group-members', (req, res) => {
    const { group_id } = req.query;

    // check if group_id is provided
    if (!group_id) {
        return res.status(400).json({ error: "Missing group_id" });
    }

    // Query to retrieve member names for the specified group
    const getGroupMembersQuery = `
        SELECT users.username, users.display_name, group_members.user_id, group_members.role 
        FROM group_members 
        JOIN users ON group_members.user_id = users.id 
        WHERE group_members.group_id = ?
    `;

    db.query(getGroupMembersQuery, [group_id], (err, results) => {
        if (err) {
            console.error("API get-group-members: Error retrieving group members: ", err.message);
            return res.status(500).json({ error: "Failed to retrieve group members" });
        }
        res.status(200).json(results);
    });
});

// get number of members in a group -EL
// input: group_id
// output: {member_count: integer}
router.get('/get-group-size', (req, res) => {
    const { group_id } = req.query;

    if (!group_id) {
        return res.status(400).json({ error: "Group ID is required" });
    }

    // query to count the number of members in the group
    const countMembersQuery = `
        SELECT COUNT(*) AS member_count 
        FROM group_members 
        WHERE group_id = ?
    `;

    db.query(countMembersQuery, [group_id], (err, results) => {
        if (err) {
            console.error("API get-group-size: Error retrieving member count: ", err.message);
            return res.status(500).json({ error: "Failed to retrieve group member count" });
        }

        // return the count of members
        res.status(200).json({ member_count: results[0].member_count });
    });
});

// returns the id and name of all the groups that the user is a member/admin of -KK
// input: username
// output: group_id, group_name 
router.post('/get-all-groups-for-user', async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            console.log("API get-all-groups-for-user: Missing username.");
            return res.status(400).send("Missing username.");
        }

        const user_id = await getUserId(username);

        const query =   `SELECT 
                            group_members.group_id,
                            group_names.group_name,
                            group_members.can_modify_chore 
                        FROM group_members
                        JOIN group_names ON group_members.group_id = group_names.id
                        WHERE group_members.user_id = ?`

        const [results] = await db.promise().query(query, [user_id]);

        res.json(results);
    } catch (error) {
        console.error("get-all-groups-for-user: Error:", error.message);
        res.status(500).send("Error retrieving group names.");
    }
});

// send an invitation, only 'admin' can invite -EL
// input: inviter_name (username), invitee_name (username), group_id
router.post('/send-invite', async (req, res) => {
    const { inviter_name, invitee_name, group_id } = req.body;

    try {
        // query to fetch user_id
        const userIdQuery = "SELECT id FROM users WHERE username = ?";

        // check if inviter exists
        const [inviterResults] = await db.promise().query(userIdQuery, [inviter_name]);

        if (inviterResults.length === 0) {
            console.error("API send-invite: Inviter does not exist");
            return res.status(404).json({ error: `Inviter '${inviter_name}' does not exist` });
        }
        const inviter_id = inviterResults[0].id;

        // check if invitee exists
        const [inviteeResults] = await db.promise().query(userIdQuery, [invitee_name]);

        if (inviteeResults.length === 0) {
            console.error("API send-invite: Invitee does not exist");
            return res.status(404).json({ error: `Invitee '${invitee_name}' does not exist` });
        }
        const invitee_id = inviteeResults[0].id;

        // check if the inviter is an admin in the group
        const adminCheckQuery = `
            SELECT role FROM group_members 
            WHERE user_id = ? AND group_id = ? AND role = 'admin'
        `;

        const [adminResults] = await db.promise().query(adminCheckQuery, [inviter_id, group_id]);

        if (adminResults.length === 0) {
            return res.status(403).json({ error: "Only admins can invite members to the group" });
        }

        // check if the invitee is already in the group
        const checkMemberQuery = `
            SELECT * FROM group_members 
            WHERE user_id = ? AND group_id = ?
        `;
        const [memberResults] = await db.promise().query(checkMemberQuery, [invitee_id, group_id]);

        if (memberResults.length > 0) {
            console.error("API send-invite: Invitee is already in the group");
            return res.status(400).json({ error: "User already in the group" });
        }

        // check if there is a pending invitation for the invitee
        const checkInvitationQuery = `
            SELECT * FROM group_invitations 
            WHERE invitee_id = ? AND group_id = ? AND status = 'pending'
        `;
        const [invitationResults] = await db.promise().query(checkInvitationQuery, [invitee_id, group_id]);

        if (invitationResults.length > 0) {
            console.error("API send-invite: Invitee already has a pending invitation from the group");
            return res.status(400).json({ error: "This user already has a pending invitation from the group" });
        }

        // insert the invitation into the group_invitations table
        const insertInvitationQuery = `
            INSERT INTO group_invitations (inviter_id, invitee_id, group_id, status)
            VALUES (?, ?, ?, 'pending')
        `;
        await db.promise().query(insertInvitationQuery, [inviter_id, invitee_id, group_id]);

        res.status(200).json({ message: "Invitation sent successfully" });
    } catch (error) {
        console.error("API send-invite: Unexpected error: ", error.message);
        res.status(500).json({ error: "An unexpected error occurred" });
    }
});

// get received pending invitations for a specific user -EL
// input: username (want to retrieve this person's pending invitations)
// output: pending invitations for that user
router.get('/get-received-invite', async (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ error: "Username is required" });
    }

    const user_id = await getUserId(username);

    const sql = `SELECT * FROM group_invitations WHERE invitee_id = ? AND status = 'pending'`;
    db.query(sql, [user_id], (err, results) => {
        if (err) {
            console.error("API get-received-invite: Error fetching pending invitations:", err);
            return res.status(500).json({ error: "Failed to retrieve pending invitations" });
        }
        res.status(200).json(results);
    });
});

// respond to invitation based on user's response (accepted / rejected) -EL
// input: invitation_id, response (either "accepted" or "rejected")
router.post('/respond-to-invite', (req, res) => {
    const { invitation_id, response } = req.body;

    // Update the status in the group_invitations table
    const updateSql = `UPDATE group_invitations SET status = ? WHERE id = ?`;
    db.query(updateSql, [response, invitation_id], (err) => {
        if (err) {
            console.error("API respond-to-invite: Error updating invitation status:", err);
            return res.status(500).json({ error: "Failed to update invitation status" });
        }

        // if accepted, add the user to the group
        if (response === 'accepted') {
            // find the user's id and the group's id
            const getGroupDetailsSql = `
                SELECT invitee_id, group_id 
                FROM group_invitations 
                WHERE id = ?
            `;
            db.query(getGroupDetailsSql, [invitation_id], (err, result) => {
                if (err || result.length === 0) {
                    console.error("API respond-to-invite: Error retrieving group details when adding user to the group:", err);
                    return res.status(500).json({ error: "Failed to retrieve group details when adding user to the group" });
                }
                
                const { invitee_id, group_id } = result[0];
                // add user to the group
                const addMemberSql = `INSERT INTO group_members (user_id, group_id, role) VALUES (?, ?, 'member')`;
                db.query(addMemberSql, [invitee_id, group_id], (err) => {
                    if (err) {
                        console.error("API respond-to-invite: Error adding member:", err);
                        return res.status(500).json({ error: "Failed to add member to group" });
                    }
                    res.status(200).json({ message: "Invitation accepted, added to group" });
                });
            });
        } 
        // invitation rejected
        else { 
            res.status(200).json({ message: "Invitation declined" });
        }
    });
});

// check if a user is an admin of a specific group -- EL
// input: username, group_id
// output: isadmin : true/false 
router.get('/get-is-admin', (req, res) => {
    const { username, group_id } = req.query;

    if (!username || !group_id) {
        return res.status(400).json({ error: "Username and group ID are required" });
    }

    // query to check if the user is an admin in the specified group
    const checkAdminQuery = `
        SELECT role 
        FROM group_members 
        JOIN users ON group_members.user_id = users.id 
        WHERE users.username = ? AND group_members.group_id = ?
    `;

    db.query(checkAdminQuery, [username, group_id], (err, results) => {
        if (err) {
            console.error("API get-is-admin: Error checking admin status: ", err.message);
            return res.status(500).json({ error: "Failed to check admin status" });
        }

        // Check if role is 'admin'
        if (results.length > 0 && results[0].role === 'admin') {
            res.status(200).json({ isAdmin: true });
        } else {
            res.status(200).json({ isAdmin: false });
        }
    });
});

// remove a user (must be member) from group (only admin can remove members, but admin cannot remove themselves) --EL
// input: username (requesting user, the user that's trying to remove someone from the group), 
//        group_id, 
//        user_to_remove (this is a username)
// output: if success, user_to_remove will be removed from the group
router.delete('/remove-user-from-group', (req, res) => {
    const { username, group_id, user_to_remove } = req.body;

    // check if the requesting user is an admin
    const checkAdminQuery = `
        SELECT role 
        FROM group_members 
        JOIN users ON group_members.user_id = users.id 
        WHERE users.username = ? AND group_members.group_id = ?
    `;

    db.query(checkAdminQuery, [username, group_id], (err, results) => {
        if (err) {
            console.error("API remove-user-from-group: Error checking admin status: ", err.message);
            return res.status(500).json({ error: "Failed to check admin status" });
        }

        // check if the user is an admin
        if (results.length > 0 && results[0].role === 'admin') {
            // an admin can't remove themselves from the group
            if (username === user_to_remove) {
                return res.status(400).json({ error: "Admin cannot remove themselves" });
            }

            // assign chores of the user to be removed to the admin
            const assignChoresQuery = `
                UPDATE group_chores
                SET assigned_to = (SELECT id FROM users WHERE username = ?)
                WHERE group_id = ? AND assigned_to = (SELECT id FROM users WHERE username = ?)
            `;

            db.query(assignChoresQuery, [username, group_id, user_to_remove], (err, result) => {
                if (err) {
                    console.error("API remove-user-from-group: Error reassigning chores: ", err.message);
                    return res.status(500).json({ error: "Failed to reassign chores" });
                }

                // remove the user from the group
                const removeUserQuery = `
                    DELETE FROM group_members 
                    WHERE group_id = ? AND user_id = (SELECT id FROM users WHERE username = ?)
                `;

                db.query(removeUserQuery, [group_id, user_to_remove], (err, result) => {
                    if (err) {
                        console.error("API remove-user-from-group: Error removing user: ", err.message);
                        return res.status(500).json({ error: "Failed to remove user" });
                    }

                    if (result.affectedRows > 0) {
                        return res.status(200).json({ success: `User ${user_to_remove} removed from the group, and their chores reassigned to the admin` });
                    } else {
                        console.error("API remove-user-from-group: User not found in this group");
                        return res.status(404).json({ error: "User not found in this group" });
                    }
                });
            });
        } else {
            return res.status(403).json({ error: "You must be an admin to remove a user" });
        }
    });
});


// let a non-admin member leave a group --EL
// input: username 
//        group_id
// output: if success, user with username will leave the group, their assigned group_chores will be assigned to the admin
router.delete('/leave-group', (req, res) => {
    const { username, group_id } = req.body;

    // query to check if the user is a member and not an admin
    const checkMembershipQuery = `
        SELECT role, user_id 
        FROM group_members 
        JOIN users ON group_members.user_id = users.id 
        WHERE users.username = ? AND group_members.group_id = ?
    `;

    db.query(checkMembershipQuery, [username, group_id], (err, results) => {
        if (err) {
            console.error("API leave-group: Error checking membership status: ", err.message);
            return res.status(500).json({ error: "Failed to check membership status" });
        }

        if (results.length > 0 && results[0].role !== 'admin') {
            const userId = results[0].user_id;

            // query to get the admin's ID for the group
            const getAdminQuery = `
                SELECT user_id AS admin_id 
                FROM group_members 
                WHERE group_id = ? AND role = 'admin'
            `;

            db.query(getAdminQuery, [group_id], (err, adminResults) => {
                if (err) {
                    console.error("API leave-group: Error fetching admin ID: ", err.message);
                    return res.status(500).json({ error: "Failed to fetch admin ID" });
                }

                const adminId = adminResults[0].admin_id;

                // query to reassign chores to the admin
                const reassignChoresQuery = `
                    UPDATE group_chores 
                    SET assigned_to = ? 
                    WHERE group_id = ? AND assigned_to = ?
                `;

                db.query(reassignChoresQuery, [adminId, group_id, userId], (err) => {
                    if (err) {
                        console.error("API leave-group: Error reassigning chores: ", err.message);
                        return res.status(500).json({ error: "Failed to reassign chores" });
                    }

                    // query to remove the user from the group
                    const removeMemberQuery = `
                        DELETE FROM group_members 
                        WHERE user_id = ? AND group_id = ?
                    `;

                    db.query(removeMemberQuery, [userId, group_id], (err) => {
                        if (err) {
                            console.error("API leave-group: Error removing member from group: ", err.message);
                            return res.status(500).json({ error: "Failed to leave group" });
                        }
                        res.status(200).json({ message: "Successfully left the group and chores reassigned to admin" });
                    });
                });
            });
        } else {
            res.status(403).json({ error: "Only non-admin members can leave the group" });
        }
    });
});

// let an admin disband a group --EL
// input: username 
//        group_id
// output: if success, group with id = group_id will be disbanded
router.delete('/disband-group', (req, res) => {
    const { username, group_id } = req.body;

    // query to verify if the user is the admin of the specified group
    const checkAdminQuery = `
        SELECT role 
        FROM group_members 
        JOIN users ON group_members.user_id = users.id 
        WHERE users.username = ? AND group_members.group_id = ?
    `;

    db.query(checkAdminQuery, [username, group_id], (err, results) => {
        if (err) {
            console.error("API disband-group: Error verifying admin status: ", err.message);
            return res.status(500).json({ error: "Failed to verify admin status" });
        }

        // check if the user is an admin
        if (results.length > 0 && results[0].role === 'admin') {
            // query to delete the group
            const deleteGroupQuery = `
                DELETE FROM group_names 
                WHERE id = ?
            `;

            db.query(deleteGroupQuery, [group_id], (err, result) => {
                if (err) {
                    console.error("API disband-group: Error disbanding group: ", err.message);
                    return res.status(500).json({ error: "Failed to disband group" });
                }
                res.status(200).json({ message: "Group successfully disbanded" });
            });
        } else {
            res.status(403).json({ error: "Only group admins can disband the group" });
        }
    });
});

// let an admin change the group name --EL
// input: new_group_name
//        group_id 
//        username (should be an admin)
// output: if success, group name will be changed to new_group_name
router.post('/change-group-name', async (req, res) => {
    const { new_group_name, group_id, username } = req.body;

    try {
        // check if the user is an admin of the group
        const adminCheckQuery = `
            SELECT role FROM group_members 
            INNER JOIN users ON group_members.user_id = users.id
            WHERE users.username = ? AND group_members.group_id = ? AND role = 'admin'
        `;

        const [adminResults] = await db.promise().query(adminCheckQuery, [username, group_id]);

        if (adminResults.length === 0) {
            return res.status(403).json({ error: "You must be an admin to change the group name" });
        }

        // update the group name
        const updateGroupNameQuery = `
            UPDATE group_names
            SET group_name = ? 
            WHERE id = ?
        `;

        await db.promise().query(updateGroupNameQuery, [new_group_name, group_id]);

        res.status(200).json({ message: "Group name updated successfully" });
    } catch (error) {
        console.error("API change-group-name: Unexpected error: ", error.message);
        res.status(500).json({ error: "An unexpected error occurred" });
    }
});

// let an admin update a group member's permission to modify (add, update, delete) group chores --EL
// input: username (the admin)
//        group_id 
//        user_to_update (update this member's permission)
//        can_modify_chore (True / False, update permission to the corresponding boolean)
// output: if success, group with id = group_id will be disbanded
router.put('/update-chore-permission', (req, res) => {
    const { username, group_id, user_to_update, can_modify_chore } = req.body;

    // query to check if the requester is an admin of the group
    const checkAdminQuery = `
        SELECT role 
        FROM group_members 
        JOIN users ON group_members.user_id = users.id 
        WHERE users.username = ? AND group_members.group_id = ?
    `;

    db.query(checkAdminQuery, [username, group_id], (err, results) => {
        if (err) {
            console.error("API update-chore-permission: Error verifying admin status: ", err.message);
            return res.status(500).json({ error: "Failed to verify admin status" });
        }

        // verify if the requester is an admin
        if (results.length > 0 && results[0].role === 'admin') {
            // query to update chore modification permission for the member
            const updatePermissionQuery = `
                UPDATE group_members 
                JOIN users ON group_members.user_id = users.id 
                SET can_modify_chore = ? 
                WHERE users.username = ? AND group_members.group_id = ?
            `;

            db.query(updatePermissionQuery, [can_modify_chore, user_to_update, group_id], (err, result) => {
                if (err) {
                    console.error("API update-chore-permission: Error updating group chore permission: ", err.message);
                    return res.status(500).json({ error: "Failed to update group chore permission" });
                }

                res.status(200).json({ message: "Group chore modification permission updated successfully" });
            });
        } else {
            res.status(403).json({ error: "Only admins can update group chore permissions" });
        }
    });
});

module.exports = router;

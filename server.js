// Express Server Config
const express = require("express");
const app = express();
app.use(express.json());
PORT = 2113;

//connect to database
const db = require("./database/db-connector");

/* queries for users */

app.get("/get-users", (req, res) => {
	//sql query to get all users in the database and return them
	const getUsers = "select * from Users;";

	db.pool.query(getUsers, function (err, results, fields) {
		res.send(JSON.stringify(results));
	});
});

// Get user by id
app.get("/get-user", (req, res) => {
	//sql query to get a specific user in the db
	const getUser = `select * from Users
                    where Users.user_id = ${req.query.user_id};`;

	db.pool.query(getUser, function (err, results, fields) {
		if (err) {
			res.status(500).send(
				`There was an error fetching user ${req.query.user_id}: ${err}`
			);
		}
		if (results.length === 0) {
			res.status(404).send(`User ${req.query.user_id} not found`);
		} else {
			res.send(results[0]);
		}
	});
});

app.post("/create-user", (req, res) => {
	const createUser = `INSERT INTO Users
        (email, join_date, hashed_password, username, display_name, bio)
        VALUES (?, ?, ?, ?, ?, ?);`;
	data = [
		req.body.email,
		req.body.join_date,
		req.body.password,
		req.body.username,
		req.body.display_name,
		req.body.bio,
	];

	db.pool.query(createUser, data, (err, results, fields) => {
		if (err) {
			res.status(500).send(`
                There was an error creating the user: ${err}`);
		} else {
			res.status(200).send("User created.");
		}
	});
});

app.get("/delete-user", (req, res) => {
	//deletes a given user based on user_id
	const deleteUser = `delete from Users
    where user_id = ${req.query.user_id};`;

	if (req.query.user_id == 1) {
		res.status(422).send("Admin user cannot be deleted");
	} else {
		db.pool.query(deleteUser, (err, results, fields) => {
			if (err) {
				res.status(500).send(
					`There was an error deleting user
                    ${req.query.user_id}: ${err}`
				);
			} else {
				res.send("User deleted.");
			}
		});
	}
});

/* queries for posts */

app.get("/get-posts", (req, res) => {
	//sql query to get all posts in the database and return them
	const getPosts = `select *,
	DATE_FORMAT(time_posted, '%b %e, %Y %l:%i%p') AS time_posted
	from Posts;`;

	db.pool.query(getPosts, function (err, results, fields) {
		res.send(JSON.stringify(results));
	});
});

// Get single post by id
app.get("/get-post-by-id", (req, res) => {
	//sql query to a selected post in the database
	const getPosts = `select *,
	DATE_FORMAT(time_posted, '%b %e, %Y %l:%i%p') AS time_posted
	from Posts
	where post_id = ${req.query.post_id};`;

	db.pool.query(getPosts, function (err, results, fields) {
		if (err) {
			res.status(500).send(
				`There was an error fetching post
                ${req.query.post_id}: ${err}`
			);
		} else if (results.length == 0) {
			res.status(404).send(`Post not found`);
		} else {
			res.status(200).send(JSON.stringify(results));
		}
	});
});

app.get("/get-posts-by-user", (req, res) => {
	//returns posts by a specific user
	const getPostsByUser = `select * from Posts
    inner join Users on Posts.user_id = Users.user_id
    where Users.user_id = ${req.query.user_id};`;

	db.pool.query(getPostsByUser, function (err, results, fields) {
		if (err) {
			res.status(500).send(
				`There was an error fetching posts for user
                ${req.query.user_id}: ${err}`
			);
		} else {
			res.status(200).send(JSON.stringify(results));
		}
	});
});

app.get("/get-posts-by-group", (req, res) => {
	//show all posts in a given group
	const getPostsByGroup = `select * from Posts
    where group_posted = ${req.query.group_id};`;

	db.pool.query(getPostsByGroup, function (err, results, fields) {
		if (err) {
			res.status(500).send(
				`There was an error fetching posts for group: ${err}`
			);
		} else {
			res.status(200).send(JSON.stringify(results));
		}
	});
});

app.post("/create-post", (req, res) => {
	//allows creation of new post
	const createPost = `INSERT INTO Posts
        (user_id, post_body, time_posted, group_posted)
        VALUES (?, ?, ?, ?);`;
	const data = [
		req.body.user_id,
		req.body.post_body,
		req.body.time_posted,
		req.body.group_posted,
	];
	db.pool.query(createPost, data, (err, results, fields) => {
		if (err) {
			res.status(500).send(`
                There was an error creating the post: ${err}`);
		} else {
			res.status(200).send(JSON.stringify(results));
		}
	});
});

app.get("/delete-post", (req, res) => {
	//deletes a given post based on post_id
	const deletePost = `delete from Posts
    where post_id = ${req.query.post_id};`;

	db.pool.query(deletePost, (err, results, fields) => {
		if (err) {
			res.status(500).send(`There was an error deleting post: ${err}`);
		} else {
			res.send("Post deleted.");
		}
	});
});

app.get("/update-post-group", (req, res) => {
	//updates which group a post was made in
	const updatePostGroup = `update Posts
    set group_posted = ${req.query.group_id}
    where post_id = ${req.query.post_id};`;

	db.pool.query(updatePostGroup, function (err, results, fields) {
		if (err) {
			res.status(500).send(`Error updating group for post: ${err}`);
		} else {
			res.status(200).send("Group updated.");
		}
	});
});

/* queries for groups */
app.get("/get-groups", (req, res) => {
	//sql query to get all groups in the database and return them
	const getGroups = "select * from Groups;";

	db.pool.query(getGroups, function (err, results, fields) {
		res.send(JSON.stringify(results));
	});
});

app.post("/add-group", (req, res) => {
	//creates a group
	const createGroup = `INSERT INTO Groups
        (group_name, creator_id)
        VALUES (?, ?);`;
	data = [req.body.group_name, req.body.creator];

	db.pool.query(createGroup, data, (err, results, fields) => {
		if (err) {
			res.status(500).send(`
                There was an error creating the group: ${err}`);
		} else {
			res.status(200).send("Group created.");
		}
	});
});

app.get("/delete-group", (req, res) => {
	//deletes a given group
	const deleteGroup = `delete from Groups
    where group_id = ${req.query.group_id};`;

	db.pool.query(deleteGroup, function (err, results, fields) {
		if (err) {
			res.status(500)().send(`There was an error deleting group: ${err}`);
		} else {
			res.status(200).send(`Group deleted.`);
		}
	});
});

app.get("/get-members", (req, res) => {
	//sql query to get all members that are part of a given group
	//returns username and user_id number for clarity
	const getMembers = `
      select username, user_id from Users
      inner join Group_Members on Users.user_id = Group_Members.member_id
      where group_id = ${req.query.group_id};`;

	db.pool.query(getMembers, function (err, results, fields) {
		if (err) {
			res.status(500).send(
				`There was an error retriving members in group: ${err}`
			);
		} else {
			res.send(JSON.stringify(results));
		}
	});
});

app.get("/add-to-group", (req, res) => {
	//adds a user to a given group
	const addToGroup = `insert into Group_Members (group_id, member_id)
	values (?, ?);`;
	const vals = [req.query.group_id, req.query.member_id];

	db.pool.query(addToGroup, vals, function (err, results, fields) {
		if (err) {
			res.status(500).send(
				`There was an error adding user to group: ${err}`
			);
		} else {
			res.status(200).send("User added to group.");
		}
	});
});

app.get("/remove-from-group", (req, res) => {
	//removes a user from a given group
	const removeFromGroup = `delete from Group_Members
		where group_id = ? and user_id = ?;`;
	const vals = [req.query.group_id, req.query.user_id];

	db.pool.query(removeFromGroup, vals, function (err, results, fields) {
		if (err) {
			res.status(500).send(
				`There was an error removing user from group: ${err}`
			);
		} else {
			res.status(200).send("User removed from group.");
		}
	});
});

/* queries for direct messages */

app.get("/get-messages", (req, res) => {
	const getMessages = `select *,
	DATE_FORMAT(time_sent, '%b %e, %Y %l:%i%p') AS time_sent
	from Direct_Messages`;

	db.pool.query(getMessages, function (err, results, fields) {
		if (err) {
			res.status(500).send(`Error retrieving messages`);
		} else {
			res.status(200).send(JSON.stringify(results));
		}
	});
});

app.get("/show-messages-between", (req, res) => {
	//shows all messages between user1 and user2 (as chosen by client)
	const vals = [req.query.user_id1, req.query.user_id2];
	const getMessages = `select * from Direct_Messages
	where (sender_id = ${vals[0]} and receiver_id = ${vals[1]})
	or (sender_id = ${vals[1]} and receiver_id = ${vals[0]});`;

	db.pool.query(getMessages, function (err, results, fields) {
		if (err) {
			res.status(500).send(
				`Error retrieving messages between users
                ${vals[0]} and ${vals[1]}: ${err}`
			);
		} else {
			res.send(JSON.stringify(results));
		}
	});
});

app.get("/send-message", (req, res) => {
	const sendMessage = `insert into Direct_Messages (sender_id, receiver_id, message_content)
	values (?, ?, ?);`;
	const vals = [
		req.query.sender_id,
		req.query.receiver_id,
		req.query.message_content,
	];

	db.pool.query(sendMessage, vals, function (err, results, fields) {
		if (err) {
			res.status(500).send(
				`There was an error sending your message: ${err}`
			);
		} else {
			res.status(200).send("Message sent.");
		}
	});
});
/* queries for reports */

app.get("/get-reports", (req, res) => {
	const getReports = `select * from Reports`;

	db.pool.query(getReports, function (err, results, fields) {
		if (err) {
			res.status(500).send(`Error fetching reports: ${err}`);
		} else {
			res.status(200).send(JSON.stringify(results));
		}
	});
});

app.get("/get-user-reports-by-report", (req, res) => {
	const getUserReports = `select * from User_Reports
	where report_id = ${req.query.report_id}`;

	db.pool.query(getUserReports, function (err, results, fields) {
		if (err) {
			res.status(500).send(`Error fetching user reports: ${err}`);
		} else {
			res.status(200).send(JSON.stringify(results));
		}
	});
});

app.post("/open-report", (req, res) => {
	//opens a report on a given post
	const openReport = `insert into Reports (reported_post, notes)
	values (?, ?);`;
	const vals = [req.body.post_id, req.body.notes];

	//create user report by admin
	const createUserReport = `insert into User_Reports (report_id, reporting_user, report_reason)
	values (
		(select report_id from Reports where reported_post = ${req.body.post_id}),
		1,
		"Administration report."
	);`;

	db.pool.query(openReport, vals, function (err, results, fields) {
		if (err) {
			res.status(500).send(`Error opening report on post: ${err}`);
		} else {
			//also create a user report from admin
			db.pool.query(createUserReport, function (err, results, fields) {
				if (err) {
					res.status(500).send(
						`Error adding user report from admin: ${err}`
					);
				} else {
					res.status(200).send("Admin user report created.");
				}
			});
		}
	});
});

app.post("/update-report", (req, res) => {
	//update notes on a given report
	const updateReport = `Update Reports
	set notes = "${req.body.notes}"
	where report_id = ${req.body.report_id};`;

	db.pool.query(updateReport, function (err, results, fields) {
		if (err) {
			res.status(500).send(`Error updating notes on report: ${err}`);
		} else {
			res.status(200).send("Report updated.");
		}
	});
});

app.get("/update-report-status", (req, res) => {
	//mark a report as resolved, aka set Reports.status to 1
	const setStatus = `update Reports
	set status = ${req.query.status}
	where report_id = ${req.query.report_id};`;

	db.pool.query(setStatus, function (err, results, fields) {
		if (err) {
			res.status(500).send(`Error updating status for report: ${err}`);
		} else {
			res.status(200).send("Report status switched.");
		}
	});
});

app.get("/delete-report", (req, res) => {
	//delete a report given report_id
	const deleteReport = `delete from Reports
	where report_id = ${req.query.report_id};`;

	db.pool.query(deleteReport, function (err, results, fields) {
		if (err) {
			res.status(500).send(`Error deleting report: ${err}`);
		} else {
			res.status(200).send("Report deleted.");
		}
	});
});

app.listen(PORT, () => {
	console.log(`Server started. Listening on port ${PORT}...`);
});

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
	const createUser =
		"INSERT INTO Users (email, join_date, hashed_password, username, display_name, bio) VALUES (?, ?, ?, ?, ?, ?)";
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
			res.status(500).send(`There was an error creating the user: ${err}`);
		} else {
			res.status(200).send(JSON.stringify(results));
		}
	});
});

app.get("/delete-user", (req, res) => {
	//deletes a given user based on user_id
	const deleteUser = `
    delete from Users
    where user_id = ${req.query.user_id};`;

	if (req.query.user_id == 1) {
		res.status(422).send("Admin user cannot be deleted");
	} else {
		db.pool.query(deleteUser, (err, results, fields) => {
			if (err) {
				res.status(500).send(
					`There was an error deleting user ${req.query.user_id}: ${err}`
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
	const getPosts = "select * from Posts;";

	db.pool.query(getPosts, function (err, results, fields) {
		res.send(JSON.stringify(results));
	});
});

app.get("/get-posts-by-user", (req, res) => {
	//returns posts by a specific user
	const getPostsByUser = `
    select * from Posts
    inner join Users on Posts.user_id = Users.user_id
    where Users.user_id = ${req.query.user_id};`;

	db.pool.query(getPostsByUser, function (err, results, fields) {
		if (err) {
			res.status(500).send(
				`There was an error fetching posts for user ${req.query.user_id}: ${err}`
			);
		} else {
			res.status(200).send(JSON.stringify(results));
		}
	});
});

app.get("/get-posts-by-group", (req, res) => {
	//show all posts in a given group
	const getPostsByGroup = `
    select * from Posts
    where group_posted = ${req.query.group_id};`;

	db.pool.query(getPostsByGroup, function (err, results, fields) {
		if (err) {
			res.status(500).send(
				`There was an error fetching posts for group ${req.query.group_id}: ${err}`
			);
		} else {
			res.status(200).send(JSON.stringify(results));
		}
	});
});

app.post("/create-post", (req, res) => {
	//allows creation of new post
	const createPost =
		"INSERT INTO Posts (user_id, post_body, time_posted, group_posted) VALUES (?, ?, ?, ?)";
	const data = [
		req.body.user_id,
		req.body.post_body,
		req.body.time_posted,
		req.body.group_posted,
	];

	db.pool.query(createPost, data, (err, results, fields) => {
		if (err) {
			res.status(500).send(`There was an error creating the post: ${err}`);
		} else {
			res.status(200).send(JSON.stringify(results));
		}
	});
});

app.get("/delete-post", (req, res) => {
	//deletes a given post based on post_id
	const deleteUser = `
    delete from Posts
    where post_id = ${req.query.post_id};`;

	db.pool.query(deleteUser, (err, results, fields) => {
		if (err) {
			res.status(500).send(
				`There was an error deleting post ${req.query.post_id}: ${err}`
			);
		} else {
			res.send("Post deleted.");
		}
	});
});

app.get("/update-post-group", (req, res) => {
	//updates which group a post was made in
	const updatePostGroup = `
    update Posts
    set group_posted = ${req.query.group_id}
    where post_id = ${req.query.post_id};`;

	db.pool.query(updatePostGroup, function (err, results, fields) {
		if (err) {
			res.status(500).send(
				`There was an error updating group for post ${req.query.post_id}: ${err}`
			);
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

app.listen(PORT, () => {
	console.log(`Server started. Listening on port ${PORT}...`);
});

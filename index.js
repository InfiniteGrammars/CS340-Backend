// Express Server Config
const express = require("express");
const app = express();
app.use(express.json());

//connect to database
const db = require("./database/db-connector");

//main page
app.get("/", (req, res) => {
	res.send("Bird App Administration"); //placeholder
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
	//returns posts by a specific user (chosen from dropdown by username)
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

	console.log(req.body);

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
	const deletePost = `
    delete from Posts
    where post_id = ${req.query.post_id};`;

	db.pool.query(deletePost, (err, results, fields) => {
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
	//updates which group a post was made in (or makes it public)
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

app.listen(3000, () => {
	console.log(`Server started. Listening on port 3000...`);
});

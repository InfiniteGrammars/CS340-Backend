// Express Server Config
const express = require('express');
const app = express();
app.use(express.json());

//connect to database
const db = require('./database/db-connector');

//main page
app.get('/', (req, res) => { 
  res.send('Bird App Administration'); //placeholder
});

/* queries for posts */ 

app.get('/get-posts', (req, res) => {
  //sql query to get all posts in the database and return them

  let getPosts = 'select * from Posts;'; 

  db.pool.query(getPosts, function(err, results, fields) { 
    res.send(JSON.stringify(results));
  });
 
});

app.get('/get-posts-by-user', (req, res) => { 

  //returns posts by a specific user (chosen from dropdown by username) 
  let getPostsByUser = 'select * from Posts ' 
  + 'inner join Users on Posts.user_id = Users.user_id ' 
  + `where Users.username = ${req.query.user_id};`;

  db.pool.query(getPostsByUser, function(err, results, fields) { 
    res.send(JSON.stringify(results));
  });
});

app.get('get-posts-by-group', (req, res) => {

  //show all posts in a given group 
  let getPostsByGroup = 'select * from Posts ' 
  + `where group_id = ${req.query.group_id};`;

  db.pool.query(getPostsByGroup, function (err, results, fields) {
    res.send(JSON.stringify(results));
  });
});

app.get('/create-post', (req, res) => { 
  
  //allows creation of new post 
  let createPost = 'insert into Posts (user_id, post_body, time_posted, group_posted) ' 
  + `values (${req.query.user_id}, 
            ${req.query.post_body}, 
            ${req.query.time_posted}, 
            ${req.query.group_posted});`;
  
  db.pool.query(createPost, function (err, results, fields) {
    res.send('Post created.')
  });

});

app.get('/delete-post', (req, res) => {

  //deletes a given post based on post_id
  let deletePost = 'delete from Posts '
  + `where post_id = ${req.query.post_id};`; 

  db.pool.query(deletePost, function (err, results, fields) {
    res.send('Post deleted.');
  });
});

app.get('/update-post-group', (req, res) => { 

  //updates which group a post was made in (or makes it public)
  let updatePostGroup = 'update Posts '
  + `set group_id = ${req.query.group_id} ` 
  + `where post_id = ${req.query.post_id};`;

  db.pool.query(updatePostGroup, function (err, results, fields) { 
    res.send('Group updated.');
  });
});


app.listen(3000, ()=> {
  console.log(`Server started...`);
})

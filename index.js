import express from "express";

// Express Server Config
const app = express();
app.use(express.json());


app.get('/get-posts', (req, res) => {
  /* Insert SQL query here, e.g.:
     getPosts = 'SELECT * FROM Posts'; */


  /* Execute query on DB:
    db.pool.query(getPosts, function(err, results, fields){
     // Send results to browser:
    res.send(JSON.stringify(results));
  }) */

  // This is just for testing while there are no queries:
  res.send(`Route 'get-posts' is active.`);
})

app.listen(3000, ()=> {
  console.log(`Server started...`);
})

//create a connection pool and then export it so we can use it in the rest of our files

let mysql = require('mysql'); 

let pool = mysql.createPool({
   connectionLimit : 10,
   host : 'classmysql.engr.oregonstate.edu',
   user : 'cs340_escotoso',
   password : '7868',
   database : 'cs340_escotoso'
});

module.exports.pool = pool;


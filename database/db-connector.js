/*
Date: 08/03/2023
Based on:
Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%201%20-%20Connecting%20to%20a%20MySQL%20Database
*/

//create a connection pool and then export it so we can use it in the rest of our files

let mysql = require("mysql");
require("dotenv").config(); //save passwords in separate private file

let pool = mysql.createPool({
   connectionLimit: 10,
   host: process.env.DB_HOST,
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB,
});

module.exports.pool = pool;

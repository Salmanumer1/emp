const mysql = require("mysql2/promise");


const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "salman120umer",
  database: "employee_db"
});


module.exports = db;
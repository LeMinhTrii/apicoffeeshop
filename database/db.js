// const mysql = require("mysql2");

// const db = mysql.createConnection({
//   host: process.env.DB_HOST || "103.245.246.146",
//   user: process.env.DB_USER || "leminhtri",
//   password: process.env.DB_PASS || "qwer1234",
//   database: process.env.DB_NAME || "coffeapp",
// });

// // Test the connection

// module.exports = db;
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST || "bbv4cpycpurjnwengapg-mysql.services.clever-cloud.com",
  user: process.env.DB_USER || "us0sdjqgpgxwq1tc",
  password: process.env.DB_PASS || "gkiqMSJaUaQTvN6dbxtY",
  database: process.env.DB_NAME || "bbv4cpycpurjnwengapg",
  port: 3306,
});

module.exports = db;

const mysql = require('mysql');

const pool = mysql.createPool({
    host: "localhost",
    user: "your_username",
    password: "your_password",
    database: "your_database"
});

module.exports = pool;

pool.getConnection((err, connection) => {
    if (err) {
      throw err;
    }
    console.log('Connected to MySQL server');
    
    // ... Use the 'connection' object to query the database ...
    
    connection.release(); // Release the connection back to the pool when you're done with it
  });
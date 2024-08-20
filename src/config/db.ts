import mysql from 'mysql2/promise'


const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'fabricshop',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  
  module.exports = pool;
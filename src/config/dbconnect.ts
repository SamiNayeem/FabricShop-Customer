const pool = require('./db');

const databaseConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to database");
    // connection.release(); 
  } catch (error) {
    let errorMessage = 'Failed to connect database';
    if (error instanceof Error) {
        errorMessage += `: ${error.message}`
    }
    console.log(errorMessage)
  }
};

module.exports = databaseConnection;
const mysql = require("mysql2/promise");
console.log("MYSQL_HOST =", process.env.MYSQL_HOST);
console.log("MYSQL_USER =", process.env.MYSQL_USER);
console.log("MYSQL_PASSWORD =", process.env.MYSQL_PASSWORD ? "SET" : "NOT SET");
console.log("MYSQL_DB =", process.env.MYSQL_DB);

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  port: process.env.MYSQL_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Creates the enquiries table if it does not already exist.
// Called once on server startup so you don't need to run manual SQL scripts.
const initDb = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS enquiries (
      id INT AUTO_INCREMENT PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL,
      phone_number VARCHAR(50) NOT NULL,
      email VARCHAR(255),
      project_type VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      plot_size VARCHAR(100),
      budget VARCHAR(100),
      start_date VARCHAR(100),
      project_brief TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    const connection = await pool.getConnection();
    await connection.query(createTableQuery);
    connection.release();
    console.log("MySQL connected and enquiries table is ready.");
  } catch (error) {
    console.error("Failed to initialize MySQL:", error.message);
    console.error(
      "The server will keep running, but enquiries will not be saved to the database until this is fixed."
    );
  }
};

module.exports = { pool, initDb };

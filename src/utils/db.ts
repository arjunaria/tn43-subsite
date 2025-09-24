import mysql from "mysql2/promise"; // Use the promise-based version of MySQL2

declare global {
  // Prevents TypeScript from complaining about redeclaration
  var mysqlPool: mysql.Pool | undefined;
}

// Create a connection pool (adjust with your DB credentials)
const pool = mysql.createPool({
  host: "118.139.183.234",    // Database host
  user: "DB_ALL_READ",         // Database user
  password: "%$g-IqbO!z6M", // Database password
  database: "DB_TN43", // Database name
   waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
export { pool };


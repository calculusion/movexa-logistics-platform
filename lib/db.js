// Import the PostgreSQL connection pool
const { Pool } = require("pg");

// Create a shared database connection using the connection string
// stored in the environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Export the connection pool for use throughout the application
module.exports = pool;

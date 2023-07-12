// class from postgress, creates a connection Pool,
// clients can make queries and send responses
const { Pool } = require('pg');

//allows us to load our environment variables into this file
require('dotenv').config();

console.log(process.env.DB_NAME);

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
  });

  // ...

const createTableQuery = `
CREATE TABLE IF NOT EXISTS book_inventory (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL
);
`;

//creates the table based on the table query 
const createTable = async () => {
try {
  await pool.query(createTableQuery);
  console.log('Table created successfully');
} catch (err) {
  console.error('Error executing query', err.stack);
}
};

createTable();
  
module.exports = {
    query: (text, params, callback) => {
      console.log("QUERY:", text, params || "");
      return pool.query(text, params, callback);
    },
  };
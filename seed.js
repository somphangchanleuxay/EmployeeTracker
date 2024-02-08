const mysql = require('mysql2');
const fs = require('fs');
const util = require('util');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'potato',
  database: 'employee_db',
});

// Read the seed SQL file
const seedSql = fs.readFileSync('./seed.sql', 'utf8');

// Promisify MySQL queries
const query = util.promisify(connection.query).bind(connection);

// Connect to the database
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');

  // Execute the seed SQL script
  query(seedSql)
    .then(() => {
      console.log('Database seeded successfully');
      connection.end();
    })
    .catch((error) => {
      console.error('Error seeding database:', error);
      connection.end();
    });
});
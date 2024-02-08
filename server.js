const mysql = require('mysql2');
const inquirer = require('inquirer');
const util = require('util');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'potato',
    database: 'employee_db'  
});

// Promisify MySQL queries
const query = util.promisify(connection.query).bind(connection);

// Connect to the database
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
    startApp();
  });
  
// Function to start the application
function startApp() {
    inquirer
      .prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Exit',
        ],
      })
      .then((answer) => {
        switch (answer.action) {
          case 'View all departments':
            viewAllDepartments();
            break;
          case 'View all roles':
            viewAllRoles();
            break;
          case 'View all employees':
            viewAllEmployees();
            break;
          case 'Add a department':
            addDepartment();
            break;
          case 'Add a role':
            addRole();
            break;
          case 'Add an employee':
            addEmployee();
            break;
          case 'Update an employee role':
            updateEmployeeRole();
            break;
          case 'Exit':
            connection.end();
            console.log('Connection closed. Goodbye!');
            break;
        }
      });
  }
  
  // Function to view all departments
  async function viewAllDepartments() {
    const departments = await query('SELECT * FROM departments');
    console.table(departments);
    startApp();
  }
  
  // Function to view all roles
  async function viewAllRoles() {
    const roles = await query('SELECT * FROM roles');
    console.table(roles);
    startApp();
  }
  
  // Function to view all employees
  async function viewAllEmployees() {
    const employees = await query('SELECT * FROM employees');
    console.table(employees);
    startApp();
  }
  
  // Function to add a department
  async function addDepartment() {
    const answer = await inquirer.prompt({
      type: 'input',
      name: 'departmentName',
      message: 'Enter the name of the department:',
    });
  
    await query('INSERT INTO departments (department_name) VALUES (?)', [answer.departmentName]);
    console.log('Department added successfully!');
    startApp();
  }
  

module.exports = connection;
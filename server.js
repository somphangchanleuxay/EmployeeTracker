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
  
// Function to add a role
async function addRole() {
  const roleInfo = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter the title of the new role:',
    },
    {
      type: 'number',
      name: 'salary',
      message: 'Enter the salary for the new role:',
    },
    {
      type: 'number',
      name: 'department_id',
      message: 'Enter the department ID for the new role:',
    },
  ]);

  await query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)', [
    roleInfo.title,
    roleInfo.salary,
    roleInfo.department_id,
  ]);

  console.log('Role added successfully!');
  startApp();
}

// Function to add an employee
async function addEmployee() {
  const employeeInfo = await inquirer.prompt([
    {
      type: 'input',
      name: 'first_name',
      message: 'Enter the first name of the new employee:',
    },
    {
      type: 'input',
      name: 'last_name',
      message: 'Enter the last name of the new employee:',
    },
    {
      type: 'number',
      name: 'role_id',
      message: 'Enter the role ID for the new employee:',
    },
    {
      type: 'number',
      name: 'manager_id',
      message: 'Enter the manager ID for the new employee (if applicable):',
    },
  ]);

  await query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [
    employeeInfo.first_name,
    employeeInfo.last_name,
    employeeInfo.role_id,
    employeeInfo.manager_id,
  ]);

  console.log('Employee added successfully!');
  startApp();
}

// Function to update an employee's role
async function updateEmployeeRole() {
  // Get the list of employees for the user to choose from
  const employees = await query('SELECT id, CONCAT(first_name, " ", last_name) AS full_name FROM employees');
  
  // Prompt the user to select an employee to update
  const employeeToUpdate = await inquirer.prompt({
    type: 'list',
    name: 'employee_id',
    message: 'Select the employee whose role you want to update:',
    choices: employees.map((employee) => ({
      value: employee.id,
      name: employee.full_name,
    })),
  });

  // Prompt the user to enter the new role ID for the selected employee
  const newRoleId = await inquirer.prompt({
    type: 'number',
    name: 'role_id',
    message: 'Enter the new role ID for the employee:',
  });

  await query('UPDATE employees SET role_id = ? WHERE id = ?', [newRoleId.role_id, employeeToUpdate.employee_id]);

  console.log('Employee role updated successfully!');
  startApp();
}

module.exports = connection;
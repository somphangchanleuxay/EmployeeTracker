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
          'View employees by manager',  
          'View employees by department',  
          'Delete department',  
          'Delete role',  
          'Delete employee',  
          'View department budget', 
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
          case 'Update employee manager':
            updateEmployeeManager();
            break;
          case 'View employees by manager':
            viewEmployeesByManager();
            break;
          case 'View employees by department':
            viewEmployeesByDepartment();
            break;
          case 'Delete department':
            deleteDepartment();
            break;
          case 'Delete role':
            deleteRole();
            break;
          case 'Delete employee':
            deleteEmployee();
            break;
          case 'View department budget':
            viewDepartmentBudget();
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

// Function to update an employee's manager
async function updateEmployeeManager() {
  // Get the list of employees for the user to choose from
  const employees = await query('SELECT id, CONCAT(first_name, " ", last_name) AS full_name FROM employees');
  
  // Prompt the user to select an employee to update
  const employeeToUpdate = await inquirer.prompt({
    type: 'list',
    name: 'employee_id',
    message: 'Select the employee whose manager you want to update:',
    choices: employees.map((employee) => ({
      value: employee.id,
      name: employee.full_name,
    })),
  });

  // Prompt the user to enter the new manager ID for the selected employee
  const newManagerId = await inquirer.prompt({
    type: 'number',
    name: 'manager_id',
    message: 'Enter the new manager ID for the employee:',
  });

  await query('UPDATE employees SET manager_id = ? WHERE id = ?', [newManagerId.manager_id, employeeToUpdate.employee_id]);

  console.log('Employee manager updated successfully!');
  startApp();
}

// Function to view employees by manager
async function viewEmployeesByManager() {
  // Get the list of managers for the user to choose from
  const managers = await query('SELECT DISTINCT manager_id, CONCAT(first_name, " ", last_name) AS full_name FROM employees WHERE manager_id IS NOT NULL');
  
  // Prompt the user to select a manager to view employees
  const selectedManager = await inquirer.prompt({
    type: 'list',
    name: 'manager_id',
    message: 'Select the manager to view employees:',
    choices: managers.map((manager) => ({
      value: manager.manager_id,
      name: manager.full_name,
    })),
  });

  // Get employees under the selected manager
  const employees = await query('SELECT * FROM employees WHERE manager_id = ?', [selectedManager.manager_id]);
  console.table(employees);
  startApp();
}

// Function to view employees by department
async function viewEmployeesByDepartment() {
  try {
    // Get the list of departments for the user to choose from
    const departments = await query('SELECT * FROM departments');

    // Prompt the user to select a department to view employees
    const selectedDepartment = await inquirer.prompt({
      type: 'list',
      name: 'department_id',
      message: 'Select the department to view employees:',
      choices: departments.map((department) => ({
        value: department.id,
        name: department.department_name,
      })),
    });

    // Get employees in the selected department along with their roles
    const employees = await query('SELECT employees.*, roles.title AS role_title FROM employees INNER JOIN roles ON employees.role_id = roles.id WHERE roles.department_id = ?', [selectedDepartment.department_id]);
    
    console.table(employees);
    startApp();
  } catch (error) {
    console.error('Error viewing employees by department:', error);
    startApp();
  }
}

// Function to delete a department
async function deleteDepartment() {
  // Get the list of departments for the user to choose from
  const departments = await query('SELECT * FROM departments');
  
  // Prompt the user to select a department to delete
  const departmentToDelete = await inquirer.prompt({
    type: 'list',
    name: 'department_id',
    message: 'Select the department to delete:',
    choices: departments.map((department) => ({
      value: department.id,
      name: department.department_name,
    })),
  });

  // Delete the selected department
  await query('DELETE FROM departments WHERE id = ?', [departmentToDelete.department_id]);
  console.log('Department deleted successfully!');
  startApp();
}

// Function to delete a role
async function deleteRole() {
  // Get the list of roles for the user to choose from
  const roles = await query('SELECT * FROM roles');
  
  // Prompt the user to select a role to delete
  const roleToDelete = await inquirer.prompt({
    type: 'list',
    name: 'role_id',
    message: 'Select the role to delete:',
    choices: roles.map((role) => ({
      value: role.id,
      name: role.title,
    })),
  });

  // Delete the selected role
  await query('DELETE FROM roles WHERE id = ?', [roleToDelete.role_id]);
  console.log('Role deleted successfully!');
  startApp();
}

// Function to delete an employee
async function deleteEmployee() {
  // Get the list of employees for the user to choose from
  const employees = await query('SELECT id, CONCAT(first_name, " ", last_name) AS full_name FROM employees');
  
  // Prompt the user to select an employee to delete
  const employeeToDelete = await inquirer.prompt({
    type: 'list',
    name: 'employee_id',
    message: 'Select the employee to delete:',
    choices: employees.map((employee) => ({
      value: employee.id,
      name: employee.full_name,
    })),
  });

  // Delete the selected employee
  await query('DELETE FROM employees WHERE id = ?', [employeeToDelete.employee_id]);
  console.log('Employee deleted successfully!');
  startApp();
}

// Function to view the total utilized budget of a department
async function viewDepartmentBudget() {
  try {
    // Get the list of departments for the user to choose from
    const departments = await query('SELECT * FROM departments');

    // Prompt the user to select a department to view the budget
    const selectedDepartment = await inquirer.prompt({
      type: 'list',
      name: 'department_id',
      message: 'Select the department to view the budget:',
      choices: departments.map((department) => ({
        value: department.id,
        name: department.department_name,
      })),
    });

    // Get the total utilized budget of the selected department
    const budget = await query('SELECT departments.department_name, SUM(roles.salary) AS total_budget FROM roles JOIN departments ON roles.department_id = departments.id WHERE roles.department_id = ?', [selectedDepartment.department_id]);

    console.log(`Total Utilized Budget for ${budget[0].department_name}: $${budget[0].total_budget}`);
    startApp();
  } catch (error) {
    console.error('Error viewing department budget:', error);
    startApp();
  }
}

module.exports = connection;
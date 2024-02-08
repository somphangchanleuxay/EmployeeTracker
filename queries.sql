-- view all departments
SELECT * FROM departments;

-- view all roles
SELECT roles.title, roles.id AS role_id, departments.department_name, roles.salary
FROM roles
INNER JOIN departments ON roles.department_id = departments.id;

-- view all employees
SELECT employees.id, employees.first_name, employees.last_name,
       roles.title AS job_title, departments.department_name, roles.salary,
       CONCAT(managers.first_name, ' ', managers.last_name) AS manager
FROM employees
INNER JOIN roles ON employees.role_id = roles.id
INNER JOIN departments ON roles.department_id = departments.id
LEFT JOIN employees managers ON employees.manager_id = managers.id;

-- add a department
INSERT INTO departments (department_name) VALUES ('Your Department Name');

-- add a role
INSERT INTO roles (title, salary, department_id) VALUES ('Your Role Title', 50000, 1);

-- add an employee
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('John', 'Doe', 1, 1);

-- update an employee role
UPDATE employees SET role_id = 2 WHERE id = 1;
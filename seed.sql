
INSERT INTO departments (department_name) VALUES ('Sales');
INSERT INTO departments (department_name) VALUES ('Marketing');
INSERT INTO departments (department_name) VALUES ('Finance');

INSERT INTO roles (title, salary, department_id) VALUES ('Sales Manager', 60000, 1);
INSERT INTO roles (title, salary, department_id) VALUES ('Marketing Coordinator', 50000, 2);
INSERT INTO roles (title, salary, department_id) VALUES ('Financial Analyst', 70000, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('John', 'Doe', 1, NULL);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Jane', 'Smith', 2, 1);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Bob', 'Johnson', 3, 1);
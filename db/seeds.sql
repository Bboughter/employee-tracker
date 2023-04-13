INSERT INTO department (name) VALUES
    ('Sales'),
    ('Law Enforcement'),
    ('Legal'),
    ('Engineering');

INSERT INTO roles (title, salary, department_id) VALUES
    ('Sales Manager', 50000.00, 1),
    ('Sales Associate', 30000.00, 1),
    ('Police Officer', 90000.00, 2),
    ('Police Sergeant', 105000.00, 2),
    ('Lawyer', 150000.00, 3),
    ('Legal Aid', 70000.00, 3),
    ('Bioengineer', 100000, 4),
    ('Aerospace Engineer', 120000, 4);
    

Insert INTO employee (first_name, last_name, role_id, manager_id) VALUES
   ('Tamara', 'Hauswirth', 1, NULL),
    ('Laurie', 'Farnham', 2, 1),
	('Steven', 'Vo', 3, NULL),
    ('Ryan', 'Reyes', 4, 3),
    ('Daniel', 'Boughter', 5, NULL),
    ('Jared', "Atkinson", 6, 5),
    ('Amy', 'DeSmet', 7, NULL),
    ('Brett', 'Morinaka', 8, NULL);
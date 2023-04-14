const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');



const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'password123',
    database: 'employees_db'
  },
  console.log(`Connected to the employees_db database.`)
);

function mainPrompt() {
  inquirer
    .prompt([
      {
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
          'Update an employee role'
        ]
      }
    ])
    .then((answers) => {
      switch (answers.action) {
        case 'View all departments':
          viewAllDepartments()
          break;
        case 'View all roles':
         viewAllRoles()
          break;
        case 'View all employees':
          viewAllEmployees()
          break;
        case 'Add a department':
          addDepartment()
          break;
        case 'Add a role':
          addRole()
          break;
        case 'Add an employee':
          addEmployee()
          break;
        case 'Update an employee role':
          updateEmployeeRole()
          break;
        default:
          console.log(`Sorry, please choose an option. ${answers}.`);
      }
     
    })
    .catch((error) => {
      console.log(error);
    })
};

function viewAllDepartments() {
  db.query('SELECT * FROM department', (err, res) => {
    console.table(res);
    mainPrompt();
  })
}

function viewAllRoles() {
  db.query('SELECT * FROM roles', (err, res) => {
    console.table(res);
    mainPrompt();
  })
}

function viewAllEmployees() {
  db.query('SELECT employee.id, employee.first_name, employee.last_name, roles.title, roles.salary, department.name AS department_name, manager.first_name AS manager_first_name, manager.last_name AS manager_last_name FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id', (err, res) => {
    console.table(res);
    mainPrompt();
  })
}

function addDepartment() {
  inquirer
  .prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the department you would like to add?'
      }
    ])
  .then((answers) => {
      db.query('INSERT INTO department SET?', { name: answers.name }, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`Added ${answers.name} to the database.`);
          mainPrompt();
        }
      })
    })
  .catch((error) => {
      console.log(error);
    })
}

function addRole() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: 'What is the title of the role you would like to add?'
      },
      {
        type: 'input',
        name: 'salary',
        message: 'What is the salary of the role you would like to add?'
      },
      {
        type: 'input',
        name: 'department_id',
        message: 'What is the department ID of the role you would like to add?'
      }
    ])
    .then((answers) => {
      db.query(
        'INSERT INTO roles SET ?',
        {
          title: answers.title,
          salary: answers.salary,
          department_id: answers.department_id
        },
        (err, res) => {
          if (err) {
            console.log(err);
          } else {
            console.log(`${res.affectedRows} role inserted!\n`);
          }
          mainPrompt();
        }
      );
    })
    .catch((error) => {
      console.log(error);
    });
}
  

function addEmployee() {
  db.query('SELECT id, first_name, last_name FROM employee', (err, res) => {
    if (err) {
      console.log(err);
      return;
    }

    const managersChoices = res.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));

    // Add a null option for manager
    managersChoices.unshift({ name: 'None', value: null });

    inquirer.prompt([
      {
        type: 'input',
        name: 'first_name',
        message: 'What is the employee\'s first name?'
      },
      {
        type: 'input',
        name: 'last_name',
        message: 'What is the employee\'s last name?'
      },
      {
        type: 'input',
        name: 'role_id',
        message: 'What is the employee\'s role ID?',
        
      },
      {
        type: 'list',
        name: 'manager_id',
        message: 'Who is the employee\'s manager?',
        choices: managersChoices
      }
    ])
    .then((answers) => {
      db.query(
        'INSERT INTO employee SET ?',
        {
          first_name: answers.first_name,
          last_name: answers.last_name,
          role_id: answers.role_id,
          manager_id: answers.manager_id
        },
        (err, res) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log(`${res.affectedRows} employee inserted!\n`);
          mainPrompt();
        }
      );
    })
    .catch((error) => {
      console.log(error);
    });
  });
}

function updateEmployeeRole() {
  db.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee', (err, res) => {
    if (err) {
      console.log(err);
      return;
    }
    const employeesChoices = res.map(employee => ({
      name: employee.employee.name,
      value: employee.id,
    }));
    inquirer.prompt ({
        type: 'list',
        name: 'employee_id',
        message: 'Which employee would you like to update?',
        choices: employeesChoices
      }).then((employeeAnswer) => {
        db.query('SELECT id, title FROM roles', (err, res) => {
          if (err) {
            console.log(err);
            return;
          }
          const rolesChoices = res.map( role => ({
            name: role.title,
            value: role.id,
          }));
          inquirer.prompt({
              type: 'list',
              name: 'role_id',
              message: 'What is the employee\'s new role?',
              choices: rolesChoices
            }) .then((roleAnswer) => {
              db.query(
                'UPDATE employee SET role_id =? WHERE id =?',
                [roleAnswer.role_id, employeeAnswer.employee_id],
                (err, res) => {
                  if (err) {
                    console.log(err);
                    return;
                  }
                  console.log(`${res.affectedRows} employee updated!\n`);
                  mainPrompt();
                }
                );
              });
            });
          });
        });
      }
mainPrompt();
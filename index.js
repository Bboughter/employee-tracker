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
          console.log('viewing all roles');
          break;
        case 'View all employees':
          console.log('viewing all employees');
          break;
        default:
          console.log(`Sorry, please choose an option. ${answers}.`);
      }
      // Use user feedback for... whatever!!
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else went wrong
      }
    })
};

function viewAllDepartments() {
  db.query('SELECT * FROM department', (err, res) => {
    console.table(res);
    mainPrompt();
  })
}
mainPrompt();
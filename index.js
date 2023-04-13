const inquirer = require('inquirer');
const mysql = require('mysql');
const consoleTable = require('console.table');

const PORT = process.env.PORT || 3001;

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'password123',
      database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
  );

  
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
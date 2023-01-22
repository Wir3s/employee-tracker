const inquirer = require("inquirer");
// Import and require mysql2
const mysql = require("mysql2");

const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password
    password: "turnip",
    database: "employees_db",
  },
  console.log(`Connected to the classlist_db database.`)
);

const mainMenuQ = [
  {
    type: "list",
    name: "mmPrompt",
    choices: [
      "View All Employees",
      "Add Employee",
      "Update Employee Role",
      "View All Roles",
      "Add Role",
      "View All Departments",
      "Add Department",
      "Quit",
    ],
    message: "What would you like to do?",
  },
];

const newDeptQ = [
  {
    type: "input",
    name: "newD",
    message: "What is name of the new Department?",
  },
];

function mainMenu() {
  inquirer.prompt(mainMenuQ).then((data) => {
    switch (data.mmPrompt) {
      case "View All Employees":
        viewAllEmp();
        break;
      case "Add Employee":
        break;
      case "Update Employee Role":
        updateEmpR();
        break;
      case "View All Roles":
        viewAllRoles();
        break;
      case "Add Role":
        addRole();
        break;
      case "View All Departments":
        viewAllDept();
        break;
      case "Add Department":
        addDept();
        break;
      case "Quit":
        break;
    }
  });
}

// Pre-made queries
const selEmpFN = "SELECT first_name FROM employee";
const selAllEmp = "SELECT * from role";

// Inqurier List for Updating Employee Role
// const updateEmpRoleQ = [
//   {
//     type: "list",
//     name: "empL",
//     message: "Which Employee?",
//     choices: "viewEmpChoices()",
//   },
// ];

//Function to try to list employee names as choices
// function viewEmpChoices() {
//   db.query(
//     "SELECT * FROM role JOIN department ON role.department_id = department.id",
//     function (err, results) {
//       {
//         console.table(results);
//         mainMenu();
//       }
//     }
//   );
// }

function viewAllEmp() {
  db.query(
    "SELECT first_name, last_name FROM employee",
    function (err, results) {
      console.table(results);
      mainMenu();
    }
  );
}

function viewAllDept() {
  db.query("SELECT * FROM department", function (err, results) {
    console.table(results);
    mainMenu();
  });
}

function viewAllRoles() {
  db.query(
    "SELECT * FROM role JOIN department ON role.department_id = department.id",
    function (err, results) {
      console.table(results, ["id", "title", "salary", "name"]);
      mainMenu();
    }
  );
}

function addDept() {
  inquirer.prompt(newDeptQ).then((data) => {
    db.query(
      "INSERT INTO department (name) VALUES (?)",
      [data.newD],
      function (err, results) {
        console.log(results);
        viewAllDept();
      }
    );
  });
}
// Update Employee Roles - Attempt 1

// function updateEmpR() {
//   inquirer.prompt(updateEmpRoleQ).then((data) => {
//     console.log(data);
//   });
// }

// Update Employee Roles - Attempt 2

function updateEmpR() {
  db.promise()
    .query("Select first_name, last_name from employee")
    .then(([rows, fields]) => {
      console.log(rows);
    })
    .catch(console.log)
    .then(() => db.end());
}

// Add an Employee
const addEmpQ = [
  {
    type: "input",
    name: "newEmpName",
    message: "What is name of the new Employee?",
  },
  {
    type: "input",
    name: "newEmpDep",
    message: "What department are they in?",
  },
];

// Add a role

mainMenu();

// Notes from Sara:
// addEmployee(employee) {

//   return this.connection.promise().query("INSERT INTO employee SET ?", employee);

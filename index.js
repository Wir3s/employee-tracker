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

// View all employees without PROMISE
// function viewAllEmp() {
//   db.query(
//     "SELECT first_name, last_name FROM employee",
//     function (err, results) {
//       console.table(results);
//       mainMenu();
//     }
//   );
// }

// View all employees with PROMISE
function viewAllEmp() {
  db.promise()
    .query("SELECT first_name, last_name FROM employee")
    .then(([rows, fields]) => {
      console.table(rows);
      mainMenu();
    })
    .catch(console.log);
}

// View Departments without PROMISE
// function viewAllDept() {
//   db.query("SELECT * FROM department", function (err, results) {
//     console.table(results);
//     mainMenu();
//   });
// }

// View Departments with PROMISE
function viewAllDept() {
  db.promise()
    .query("SELECT * FROM department")
    .then(([rows, fields]) => {
      console.table(rows);
      mainMenu();
    })
    .catch(console.log);
}

// View Roles
function viewAllRoles() {
  db.query(
    "SELECT * FROM role JOIN department ON role.department_id = department.id",
    function (err, results) {
      console.table(results, ["id", "title", "salary", "name"]);
      mainMenu();
    }
  );
}

// Add a role
// function addRole() {}

// Add a department
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
// Get all roles as CHOICE
function viewEmpRoles() {
  return db.promise().query("SELECT title, id FROM role");
}

// Get all employees as CHOICE

function viewEmpChoices() {
  return db.promise().query("SELECT first_name, last_name, id FROM employee");
}
// Update employee role
const updateEmpR = () => {
  viewEmpChoices()
  .then(([rows]) => {
    let employees = rows;
    console.log(employees);
    let employeeChoices = employees.map(
      (a) => `${a.first_name} ${a.last_name} ${a.id}`
    );
    console.log(employeeChoices);
    
    inquirer
      .prompt([
        {
          type: "list",
          name: "empL",
          message: "Which Employee?",
          choices: employeeChoices,
        },
      ])

      .then(
        viewEmpRoles().then(([rows]) => {
          let roles = rows;
          console.log(roles);
          let roleChoices = roles.map((a) => `${a.title} ${a.id}`);
          console.log(roleChoices);
          inquirer
            .prompt([
              {
                type: "list",
                name: "roleL",
                message: "Change to which role?",
                choices: roleChoices,
              },
            ])
            .then((data) => {
              console.log(data);
            });
        })
      );
  });
};

// Add an Employee
// const addEmpQ = [
//   {
//     type: "input",
//     name: "newEmpName",
//     message: "What is name of the new Employee?",
//   },
//   {
//     type: "list",
//     name: "newEmpDep",
//     message: "What department are they in?",
//     choices:
//   },
// ];

mainMenu();

// Notes from Sara:
// addEmployee(employee) {

//   return this.connection.promise().query("INSERT INTO employee SET ?", employee);

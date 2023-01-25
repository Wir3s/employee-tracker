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
      "View Employees By Department",
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
        addNewEmp();
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
      case "View Employees By Department":
        viewEmpByDep();
        break;
      default:
        quit();
        break;
    }
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

// Get all departments as CHOICE
function viewDeptChoices() {
  return db.promise().query("SELECT id, name FROM department");
}

// Get all managers as CHOICE
function viewMgrChoices() {
  return db
    .promise()
    .query(
      "SELECT id, first_name, last_name FROM employee WHERE manager_id IS NULL"
    );
}

// View all employees with PROMISE
function viewAllEmp() {
  db.promise()
    .query(
      "SELECT e.id, e.first_name AS First_Name, e.last_name AS Last_Name, m.first_name AS Manager, r.title AS Role, r.salary AS Salary, d.name AS Department FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee m ON e.manager_id = m.id"
    )
    .then(([rows, fields]) => {
      console.table(rows);
      mainMenu();
    })
    .catch(console.log);
}

// View Departments with PROMISE
function viewAllDept() {
  db.promise()
    .query("SELECT id, name AS department FROM department")
    .then(([rows, fields]) => {
      console.table(rows);
      mainMenu();
    })
    .catch(console.log);
}

// View Roles
function viewAllRoles() {
  db.query(
    "SELECT role.id As Role_ID, role.title, role.salary, department.name AS Department FROM role JOIN department ON role.department_id = department.id",
    function (err, results) {
      console.table(results, ["Role_ID", "title", "salary", "Department"]);
      mainMenu();
    }
  );
}

// Add a role
const addRole = () => {
  viewDeptChoices().then(([rows]) => {
    let depts = rows;
    let deptChoices = depts.map((a) => ({ name: a.name, value: a.id }));
    inquirer
      .prompt([
        {
          type: "input",
          name: "newRoleTitle",
          message: "What is the title of the new Role?",
        },
        {
          type: "input",
          name: "newSal",
          message: "What is the salary of the new Role?",
        },
        {
          type: "list",
          name: "deptL",
          message: "Which department does the role belong to?",
          choices: deptChoices,
        },
      ])
      .then((data) => {
        db.query(
          "INSERT INTO role SET ?",
          {
            title: data.newRoleTitle,
            salary: data.newSal,
            department_id: data.deptL,
          },
          function (err, results) {
            viewAllRoles();
          }
        );
      });
  });
};

// View Employees By Department
function viewEmpByDep() {
  viewDeptChoices().then(([rows]) => {
    let depts = rows;
    let deptChoices = depts.map((a) => ({ name: a.name, value: a.id }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "deptL",
          message: "Which department does the role belong to?",
          choices: deptChoices,
        },
      ])
      .then((data) => {
        db.query(
          "SELECT e.id, e.first_name AS First_Name, e.last_name AS Last_Name, d.name AS Department FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id WHERE ?",
          { department_id: data.deptL },
          function (err, results) {
            console.table(results);
            mainMenu();
          }
        );
      });
  });
}

// Add a department
function addDept() {
  inquirer.prompt(newDeptQ).then((data) => {
    db.query(
      "INSERT INTO department (name) VALUES (?)",
      [data.newD],
      function (err, results) {
        viewAllDept();
      }
    );
  });
}

// Update employee role
const updateEmpR = () => {
  viewEmpChoices().then(([rows]) => {
    let employees = rows;
    let employeeChoices = employees.map((a) => ({
      name: a.first_name + " " + a.last_name,
      value: a.id,
    }));
    viewEmpRoles().then(([rows]) => {
      let roles = rows;
      let roleChoices = roles.map((a) => ({ name: a.title, value: a.id }));
      inquirer
        .prompt([
          {
            type: "list",
            name: "empL",
            message: "Which Employee?",
            choices: employeeChoices,
          },
          {
            type: "list",
            name: "roleL",
            message: "Change to which role?",
            choices: roleChoices,
          },
        ])
        .then((data) => {
          db.query(
            "UPDATE employee SET ? WHERE ?",
            [
              {
                role_id: data.roleL,
              },
              { id: data.empL },
            ],
            function (err, results) {
              viewAllEmp();
            }
          );
        });
    });
  });
};

// Add an Employee
const addNewEmp = () => {
  viewMgrChoices().then(([rows]) => {
    let mngrs = rows;
    let managerChoices = mngrs.map((a) => ({
      name: a.first_name + " " + a.last_name,
      value: a.id,
    }));
    viewEmpRoles().then(([rows]) => {
      let roles = rows;
      let roleChoices = roles.map((a) => ({ name: a.title, value: a.id }));
      inquirer
        .prompt([
          {
            type: "input",
            name: "newEmpFName",
            message: "What is the first name of the new Employee?",
          },
          {
            type: "input",
            name: "newEmpLName",
            message: "What is the last name of the new Employee?",
          },
          {
            type: "list",
            name: "newEmpMgr",
            message: "Who is their manager?",
            choices: managerChoices,
          },
          {
            type: "list",
            name: "newEmpRole",
            message: "What role do they have?",
            choices: roleChoices,
          },
        ])
        .then((data) => {
          db.query(
            "INSERT INTO employee SET ?",
            {
              first_name: data.newEmpFName,
              last_name: data.newEmpLName,
              manager_id: data.newEmpMgr,
              role_id: data.newEmpRole,
            },
            function (err, results) {
              viewAllEmp();
            }
          );
        });
    });
  });
};

function quit() {
  process.exit();
}

mainMenu();

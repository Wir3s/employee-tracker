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
      "SELECT e.id, first_name, last_name, title, salary, d.name AS department FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id"
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
    console.log(depts);
    let deptChoices = depts.map((a) => ({ name: a.name, value: a.id }));
    console.log(deptChoices);
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
        console.log("Here is data", data);
        db.query(
          "INSERT INTO role SET ?",
          {
            title: data.newRoleTitle,
            salary: data.newSal,
            department_id: data.deptL,
          },
          function (err, results) {
            console.log(results);
            viewAllRoles();
          }
        );
      });
  });
};

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

// Update employee role
const updateEmpR = () => {
  viewEmpChoices().then(([rows]) => {
    let employees = rows;
    console.log(employees);
    let employeeChoices = employees.map(
      (a) => `${a.first_name} ${a.last_name} ${a.id}`
    );
    console.log(employeeChoices);
    viewEmpRoles().then(([rows]) => {
      let roles = rows;
      console.log(roles);
      let roleChoices = roles.map((a) => `${a.title} ${a.id}`);
      console.log(roleChoices);
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
          console.log(data);
          console.log(roles);
          // const empLID = empL.split(" ");
          // console.log(empLID[1]);
        });
    });
  });
};

// Add an Employee
const addNewEmp = () => {
  viewMgrChoices().then(([rows]) => {
    let mngrs = rows;
    console.log(mngrs);
    let managerChoices = mngrs.map(
      (a) => `${a.id} ${a.first_name} ${a.last_name}`
    );
    console.log(managerChoices);
    viewEmpRoles().then(([rows]) => {
      let roles = rows;
      console.log(roles);
      let roleChoices = roles.map((a) => `${a.title} ${a.id}`);
      console.log(roleChoices);
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
          console.log(data);
        });
    });
  });
};

function quit() {
  process.exit();
}

mainMenu();

// addEmployee(employee) {

//   return this.connection.promise().query("INSERT INTO employee SET ?", employee);

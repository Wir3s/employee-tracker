const inquirer = require("inquirer");

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

function mainMenu() {
  inquirer.createPromptModule(mainMenuQ).then((data) => {
    switch (data.mmPrompt) {
      case "View All Employees":
        viewAllEmp();
        break;
      case "Add Employee":
        break;
      case "Update Employee Role":
        break;
      case "View All Roles":
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

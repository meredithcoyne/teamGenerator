const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const Employee = require("./lib/Employee");

let team = [];
let canAddManager = true;

// Write code to use inquirer to gather information about the development team members, and to create objects for each team member (using the correct classes as blueprints!)
const questions = {
    Manager: [{
            type: "input",
            name: "name",
            message: "What is the manager's name?",
        },
        {
            type: "input",
            name: "id",
            message: "What is the manager's id?",
        },
        {
            type: "input",
            name: "email",
            message: "What is the manager's email address?",
        },
        {
            type: "input",
            name: "officeNumber",
            message: "What is the manager's office number?",
        },
        {
            type: "list",
            name: "addNew",
            message: "Do you want to add another employee",
            choices: ["yes", "no"]
        }
    ],

    Engineer: [{
            type: "input",
            name: "name",
            message: "What is the engineer's name?",
        },
        {
            type: "input",
            name: "id",
            message: "What is the engineer's id?",
        },
        {
            type: "input",
            name: "email",
            message: "What is the engineer's email address?",
        },
        {
            type: "input",
            name: "github",
            message: "What is the engineer's GitHub username?",
        },
        {
            type: "list",
            name: "addNew",
            message: "Do you want to add another employee",
            choices: ["yes", "no"]
        }
    ],

    Intern: [{
            type: "input",
            name: "name",
            message: "What is the intern's name?",
            },
        {
            type: "input",
            name: "id",
            message: "What is the intern's id?",
           },
        {
            type: "input",
            name: "email",
            message: "What is the intern's email address?",
            },
        {
            type: "input",
            name: "school",
            message: "What school is the intern attending?",
            },
        {
            type: "list",
            name: "addNew",
            message: "Do you want to add another employee",
            choices: ["yes", "no"]
        }
    ]
};

const selectMemberType = [{
    type: "list",
    name: "memberType",
    message: "Please choose the role for the employee",
    choices: ["Manager", "Engineer", "Intern"],
}];

function addNewMember() {
    inquirer.prompt(selectMemberType)
        .then(answer => {
            // console.log(answer.memberType);

            if (answer.memberType === "Manager") {
                if (canAddManager) {
                    inquirer.prompt(questions.Manager)
                        .then(answer => {
                            //save employee info
                            const manager = new Manager(
                                answer.name,
                                answer.id,
                                answer.email,
                                answer.officeNumber
                            );

                            //add info to team array if manager doesn't exist
                            team.push(manager);
                            canAddManager = false;
                            if (answer.addNew === "yes") {
                                addNewMember();
                            } else {
                                generate();
                            }
                        });
                } else {
                    //only 1 manager
                    console.log("There is a manager already!")
                    addNewMember();
                }


            } else if (answer.memberType === "Engineer") {
                inquirer.prompt(questions.Engineer)
                    .then(answer => {
                        //save ee info
                        const engineer = new Engineer(
                            answer.name,
                            answer.id,
                            answer.email,
                            answer.github
                        );
                        //add info to team array
                        team.push(engineer);
                        if (answer.addNew === "yes") {
                            addNewMember();
                        } else {
                            generate();
                        };
                    });

            } else if (answer.memberType === "Intern") {
                inquirer.prompt(questions.Intern)
                    .then(answer => {
                        //save ee info
                        const intern = new Intern(
                            answer.name,
                            answer.id,
                            answer.email,
                            answer.school
                        );
                        //add info to team array
                        team.push(intern);
                        if (answer.addNew === "yes") {
                            addNewMember();
                        } else {
                            generate();
                        };
                    });
            };
        });
};

addNewMember();

function generate() {
    fs.writeFileSync(outputPath, render(team), "utf-8");
    process.exit(0);
}
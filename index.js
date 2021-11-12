const fs = require('fs');
const inquirer = require('inquirer');
const Engineer = require('./lib/Engineer');
const Intern = require('./lib/Intern');
const Manager = require('./lib/Manager');

const employeeNames = [];

function init() {
    generateHTML();
    addTeamMember();
}

function addTeamMember() {
    inquirer.prompt([{
                type: 'input',
                name: 'name',
                message: 'What is the name team member you would like to add?'
            },

            {
                type: 'list',
                name: 'role',
                message: 'Please select the role of the team member you just added.',
                choices: [
                    'Engineer',
                    'Intern',
                    'Manager',
                ]
            },

            {
                type: 'input',
                name: 'id',
                message: 'What is the ID number of the team member you just added?'
            },

            {
                type: 'input',
                name: 'email',
                message: 'What is the email address of the team member you just added?'
            }
        ])

        .then(function ({
            name,
            role,
            id,
            email
        }) {
            let employeeInfo = "";
            if (role === 'Engineer') {
                employeeInfo = 'Github';
            } else if (role === 'Intern') {
                employeeInfo = 'school';
            } else {
                employeeInfo = 'officeNumber'
            }

            inquirer.prompt([{
                        type: 'input',
                        name: 'employeeInfo',
                        message: `Please enter the ${employeeInfo} of the member you just added.`
                    },

                    {
                        type: 'list',
                        name: 'addMoreMembers',
                        message: 'Would you like to add another team member?',
                        choices: [
                            'yes',
                            'no'
                        ]
                    }
                ])

                .then(function ({
                    employeeInfo,
                    addMoreMembers
                }) {
                    let newTeamMember;
                    if (role === 'Engineer') {
                        newTeamMember = new Engineer(name, id, email, employeeInfo);
                    } else if (role === 'Intern') {
                        newTeamMember = new Intern(name, id, email, employeeInfo);
                    } else if (role === 'Manager') {
                        newTeamMember = new Manager(name, id, email, employeeInfo);
                    }

                    employeeNames.push(newTeamMember);
                    addHTML(newTeamMember)
                        .then(function () {
                            if (addMoreMembers === "yes") {
                                addTeamMember();
                            } else {
                                endHTML();
                            }
                        });
                });
        });
}

function generateHTML() {
    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Our Team</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/css?family=Merriweather|Muli:300" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <script src="https://kit.fontawesome.com/c502137733.js"></script>
</head>
    
    <body>
    <div class="container-fluid">
    <div class="row">
        <div class="col-12 jumbotron mb-3 team-heading">
            <h1 class="text-center">Our <span>Team</span></h1>
        </div>
    </div>
</div>
<div class="container">
<div class="row">`;

    fs.writeFile('./template/index.html', html, function (err) {
        if (err) {
            console.log(err);
        }
    });
    console.log('starting HTML');
}

function addHTML(teamMember) {
    return new Promise(function (resolve, reject) {
        const name = teamMember.getName();
        const role = teamMember.getRole();
        const id = teamMember.getId();
        const email = teamMember.getEmail();

        let teamData = "";
        if (role === 'Engineer') {
            const gitHub = teamMember.getGithub();
            teamData = `<div class="team-area col-12 d-flex justify-content-center mt-5">
            <div class="card employee-card mr-4 ml-4 mb-3">
<div class="card-header text-center">
    <h2 class="card-title">${name}</h2>
    <h3 class="card-title"><i class="fas fa-mug-hot mr-2"></i>Manager</h3>
</div>
<div class="card-body">
    <ul class="list-group">
    <li class="list-group-item"><b>ID: </b>${id}</li>
        <li class="list-group-item"><b>Email Address: </b>${email}</li>
        <li class="list-group-item"><b>Office Number: </b>${officeNumber}</li>
    </ul>
</div>
</div>`;
        } else if (role === 'Intern') {
            const school = teamMember.getSchool();
            teamData = `<div class="col-sm">
            <div class="card bg-primary mx-auto my-3" style="width: 18rem">
            <h5 class="fas fa-user-graduate card-header text-center"><b>${name}</b><br /><br />Intern</h5>
            <ul class="list-group list-group-flush">
                <li class="list-group-item"><b>ID: </b>${id}</li>
                <li class="list-group-item"><b>Email Address: </b>${email}</li>
                <li class="list-group-item"><b>School: </b>${school}</li>
            </ul>
            </div>
        </div>`;
        } else if (role === 'Manager') {
            const officeNumber = teamMember.getOfficeNumber();
            teamData = `<div class="col-sm">
            <div class="card bg-primary mx-auto my-3" style="width: 18rem">
            <h5 class="fas fa-mug-hot card-header text-center"><b>${name}</b><br /><br />Manager</h5>
            <ul class="list-group list-group-flush">
                <li class="list-group-item"><b>ID: </b>${id}</li>
                <li class="list-group-item"><b>Email Address: </b>${email}</li>
                <li class="list-group-item"><b>Office Number </b>${officeNumber}</li>
            </ul>
            </div>
        </div>`;
        }
        console.log("adding team member");
        fs.appendFile('./template/index.html', teamData, function (err) {
            if (err) {
                return reject(err);
            };
            return resolve();
        });
    });
}

function endHTML() {
    const endHTML = ` </div>
    </div>
    
</body>
</html>`;

    fs.appendFile('./template/index.html', endHTML, function (err) {
        if (err) {
            console.log(err);
        };
    });
    console.log('end of HTML');
}

init();
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const employeeFile = [];

const promptQuestions = () => {
    inquirer.prompt ([
        {
            type: 'input',
            name: 'name',
            message: "Enter this team member's name:",
        },
        {
            type: 'number',
            name: 'id',
            message: "Enter this team member's ID:",
        },
        {
            type: 'input',
            name: 'email',
            message: "Enter this team member's email:",
        },
        {
            type: 'list',
            name: 'type',
            message: 'Select a job description for this team member:',
            choices: ['Engineer','Intern','Manager'],
        },
            {
                type: 'input',
                name: 'github',
                message: "Enter this team member's GitHub username:",
                when: (data) => data.type === "Engineer"
            },
            {
                type: 'input',
                name: 'School',
                message: "Enter this team member's school name:",
                when: (data) => data.type === "Intern"
            },
            {
                type: 'input',
                name: 'officeNumber',
                message: "Enter this team member's office number:",
                when: (data) => data.type === "Manager"
            },
            {
                    type: 'confirm',
                    name: 'add',
                    message: 'Would you like to add another employee?'
            }
    ])
    .then((data) =>{
        if (data.type === "Engineer"){
            employeeFile.push(new Engineer(data.name, data.id, data.email, data.github))
        } 
        else if (data.type === "Intern") {
            employeeFile.push(new Intern(data.name, data.id, data.email, data.school))
        } 
        else {
            employeeFile.push(new Manager(data.name, data.id, data.email, data.officeNumber))
        }

        if (data.add === true) {
            promptQuestions();
        } else {
            fs.appendFile(outputPath, render(employeeFile), (err) =>
            err ? console.log(err) : console.log("Team Member Added!"))
        }
    })
};

promptQuestions();
console.log(employeeFile)
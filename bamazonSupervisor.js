var mysql = require("mysql")
var inquire = require("inquirer")
require("console.table")

var updatedItemId = ""
var itemName = ""
var quantityAdded = ""
var inStock = 0
var itemPrice = 0

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err
    //console.log("connection succesful");
    displayPrompt()
});

displayPrompt = function () {
    inquire.prompt([
        {
            type: "checkbox",
            message: "What would you like to do?",
            choices: ["View Product Sales by Department", "Create New Department"],
            name: "input",
            default: false,

        }
    ])
        .then(function (response) {
            switch (response.input[0]) {
                case "View Product Sales by Department":
                    break
                case "Create New Department":
                createDepartment()
                    break

            }
        })
}
anythingElse = function () {
    inquire.prompt([
        {
            type: "confirm",
            message: "Would you like do anything else? ",
            name: "nextAction",
        }

    ])
        .then(function (response) {
            switch (response.nextAction) {
                case true:
                    displayPrompt()
                    break
                case false:
                    console.log("Have a great day!")
                    connection.end()
            }

        })
}

// INSERT INTO departments (department_name, over_head_costs)
createDepartment = function(){
    inquire.prompt(
        [ 
         {
             name: "departmentName",
             type: "input",
             message: "Department: "
         },
         {
             name: "overheadCost",
             type: "input",
             message: "Overhead Cost: "
         }]
     )
         .then(function (newDepartmentData) {
             console.log("\nAdding new department!");
             console.log(newDepartmentData)
             connection.query("INSERT INTO departments SET ?",
                 {
                     department_name: newDepartmentData.departmentName,
                     over_head_costs: newDepartmentData.overheadCost
                 }, function (err, res) {
                     if(err)console.log(err)
                     console.log("New Department Added!");
                     anythingElse()
                 });
         });
}
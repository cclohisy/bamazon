var mysql = require("mysql")
var inquire = require("inquirer")
require("console.table")

var overheadCost = 0
var totalSales = 0
var totalProfit = 0
var departmentName = ""

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) console.log("Unable to connect.")
    //throw err
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
                    //viewSales()
                    getSalesData()
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
                    console.log("\nHave a great day!\n")
                    connection.end()
            }

        })
}

getSalesData = function () {
    connection.query("SELECT d.department_id, d.department_name, d.over_head_costs," +
        " SUM( p.product_sales) - d.over_head_costs AS total_profit FROM bamazon.products p" +
        " RIGHT JOIN departments d ON p.department_name  = d.department_name" +
        " GROUP BY department_name ",
        //     SELECT d.department_id, d.department_name, d.over_head_costs, p.product_sales,
        // SUM( p.product_sales) - d.over_head_costs AS total_profit FROM bamazon.products p
        // RIGHT JOIN departments  d ON p.department_name  = d.department_name
        // GROUP BY department_name 
        function (err, products) {
            if (err) console.log("something went wrong... Please try again");

            else {
                console.log("\n")
                console.table(products)

                anythingElse()
            }
        })
}

// INSERT INTO departments (department_name, over_head_costs)
createDepartment = function () {
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
            console.log("\nAdding new department...");
            //  console.log(newDepartmentData)
            departmentName = newDepartmentData.departmentName
            connection.query("INSERT INTO departments SET ?",
                {
                    department_name: newDepartmentData.departmentName,
                    over_head_costs: newDepartmentData.overheadCost
                }, function (err, res) {
                    if (err) console.log("OOPS! Somethign went wrong... Please try again.")
                    console.log(departmentName + " department added!\n");
                    anythingElse()
                });
        });
}
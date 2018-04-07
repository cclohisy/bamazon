var mysql = require("mysql")
var inquire = require("inquirer")
require("console.table")

//var itemArray = []
var pickedItemId = ""
var itemName = ""
var quantityPurchased = ""
var inStock = 0
var itemPrice = 0
var customerCost = 0

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err
    console.log("connection succesful");
    dataDisplay()
});

dataDisplay = function () {
    connection.query("SELECT item_id, product_name, price FROM products", function (err, items) {
        if (err) throw err;

        else {
            console.table(items)
            inquire.prompt([
                {
                    type: "input",
                    message: "Please enter the id of the item you wish to purchase: ",
                    name: "pickedItemId",
                },
                {
                    type: "input",
                    message: "How many?",
                    name: "quantityPurchased",

                }

            ])
                .then(function (response) {
                    pickedItemId = response.pickedItemId
                    quantityPurchased = response.quantityPurchased
                    checkInventory()
                })
        }
    })


}

checkInventory = function () {
    connection.query("SELECT stock_quantity, product_name FROM products WHERE?",
        {
            item_id: pickedItemId
        },
        function (err, stock) {
            inStock = stock[0].stock_quantity
            itemName = stock[0].product_name

            if (err) throw err;

            else if (quantityPurchased <= inStock) {
                inStock -= quantityPurchased
                updateInventory()

            }
            else {
                console.log("Not enough in stock to fill order!") //boot back to datadisplay?
                inquire.prompt([
                    {
                        type: "confirm",
                        message: "Would you like to try again? ",
                        name: "tryAgain",
                        default: false
                    }

                ])
                    .then(function (response) {
                        switch (response.tryAgain) {
                            case true:
                                dataDisplay()
                                break
                            case false:
                            console.log("Come back soon!")
                                connection.end()
                        }

                    })
            }
        })
}

updateInventory = function () {
    console.log("Updating stock count...\n");
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: inStock
            },
            {
                item_id: pickedItemId
            }
        ],
        function (err, updatedStock) {
            console.log("Stock Updated!")
            calculateCost()

        });

}

calculateCost = function () {
    connection.query("SELECT price FROM products WHERE?",
        {
            item_id: pickedItemId
        },
        function (err, priceData) {
            itemPrice = priceData[0].price
            customerCost = itemPrice * quantityPurchased
            console.log("\n__________________________________________\nYou bought " + quantityPurchased + " " + itemName + "(s) " +
                " at " + itemPrice + " a piece. \nYour total cost for this purchase is: $" + customerCost)
            connection.end()
        })

}
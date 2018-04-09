var mysql = require("mysql")
var inquire = require("inquirer")
require("console.table")

var pickedItemId = ""
var itemName = ""
var quantityPurchased = ""
var inStock = 0
var itemPrice = 0
var customerCost = 0
var totalSales = 0

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) console.log("UNABLE TO CONNECT")
    //throw err
    //console.log("connection succesful");
    dataDisplay()
});

dataDisplay = function () {
    connection.query("SELECT item_id, product_name, price FROM products", function (err, items) {
        if (err){
            console.log("OOPS... Something went wrong, please try again!")
            anythingElse()

        } 
        //throw err;

        else {
            console.log("\n")
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
    connection.query("SELECT stock_quantity, product_name,product_sales FROM products WHERE?",
        {
            item_id: pickedItemId
        },
        function (err, productData) {
            inStock = productData[0].stock_quantity
            itemName = productData[0].product_name
            totalSales = productData[0].product_sales

            if (err) {console.log("OOPS... Something went wrong, please try again!")
            anythingElse();}

            else if (quantityPurchased <= inStock) {
                inStock -= quantityPurchased
                updateInventory()

            }
            else {
                console.log("\nNot enough in stock to fill order!\n") //boot back to datadisplay?
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
                                console.log("Come back soon!\n")
                                connection.end()
                        }

                    })
            }
        })
}

updateInventory = function () {
    //console.log("Updating stock count...\n");
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
            
            //console.log("Stock Updated!\n")
            calculateCost()

        })

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
                " at $" + itemPrice + " a piece. \nYour total cost for this purchase is: $" + customerCost+"\n__________________________________________\n")
            updateProductSales()
            anythingElse()
        })

}

// bamazonCustomer.js app so that this value is updated with each individual products total revenue from each sale.
updateProductSales = function () {
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                product_sales: totalSales + customerCost
            },
            {
                item_id: pickedItemId
            }
        ],
        function (err, result) {

        })

}
anythingElse = function () {
    inquire.prompt([
        {
            type: "confirm",
            message: "Would you like to purchase another item? ",
            name: "nextAction",
        }

    ])
        .then(function (response) {
            switch (response.nextAction) {
                case true:
                    dataDisplay()
                    break
                case false:
                    console.log("\nThank you, come again soon!\n")
                    connection.end()
            }

        })
}
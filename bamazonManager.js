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

// List a set of menu options:
// View Products for Sale
// View Low Inventory
// Add to Inventory
// Add New Product
displayPrompt = function () {
    inquire.prompt([
        {
            type: "checkbox",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
            name: "input",
            default: false,

        }
    ])
        .then(function (mangResponse) {
            switch (mangResponse.input[0]) {
                case "View Products for Sale":
                    viewProducts()
                    break
                case "View Low Inventory":
                    viewInventory()
                    break
                case "Add to Inventory":
                    addInventory()
                    break
                case "Add New Product":
                    addProduct()
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
                    console.log("Have a great day!\n")
                    connection.end()
            }

        })
}
// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
viewProducts = function () {
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function (err, items) {
        if (err) throw err;

        else {
            console.log("\n")
            console.table(items)
            anythingElse()
        }
    })
}
// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
viewInventory = function () {
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products HAVING stock_quantity <= 5",
        function (err, lowInventory) {
            if (err) throw err;

            else {
                console.log("\n")
                console.table(lowInventory)
                anythingElse()
            }
        })
}
// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" 
//of any item currently in the store.
addInventory = function () {
    connection.query("SELECT item_id, product_name, price,stock_quantity FROM products", function (err, items) {
        if (err) throw err;

        else {
            console.log("\n")
            console.table(items)
            inquire.prompt([
                {
                    type: "input",
                    message: "Please enter the id of the item you wish to edit: ",
                    name: "updatedItemId",
                },
                {
                    type: "input",
                    message: "How many items are you increasing inventory by?",
                    name: "quantityAdded",

                }

            ])
                .then(function (response) {
                    updatedItemId = response.updatedItemId
                    quantityAdded = parseInt(response.quantityAdded)
                    adjustInventory()
                })
        }
    })
}
adjustInventory = function () {
    connection.query("SELECT stock_quantity, product_name FROM products WHERE?",
        {
            item_id: updatedItemId
        },
        function (err, stock) {
            inStock = stock[0].stock_quantity
            itemName = stock[0].product_name

            if (err) throw err;

            else {
                inStock += quantityAdded
                updateInventory()
            }

        })
}

updateInventory = function () {
    console.log("\nUpdating stock count...\n");
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: inStock
            },
            {
                item_id: updatedItemId
            }
        ],
        function (err, updatedStock) {
            console.log("Stock Updated! " + itemName + "'s inventory was increased by " + quantityAdded)
            anythingElse()
        });
}
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.
//product_name, department_name, price,stock_quantity
addProduct = function () {
    inquire.prompt(
       [ {
            name: "productName",
            type: "input",
            message: "Product Name: "
        },
        {
            name: "departmentName",
            type: "input",
            message: "Department: "
        },
        {
            name: "price",
            type: "input",
            message: "Price: "
        },
        {
            name: "quantity",
            type: "input",
            message: "Quantity: "
        }]
    )
        .then(function (newProductData) {
            console.log("\nAdding new product...");
            itemName = newProductData.productName
            connection.query("INSERT INTO products SET ?",
                {
                    product_name: newProductData.productName,
                    department_name: newProductData.departmentName,
                    price:newProductData.price ,
                    stock_quantity: newProductData.quantity
                }, function (err, results) {
                    console.log(itemName + " added to product list!\n");
                    anythingElse()
                });
        });
}




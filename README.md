# BAmazon

## About 
An Amazon-like storefront with the MySQL database. The app takes orders from customers and depletes stock from the store's inventory. It also tracks product sales across your store's departments and then provide a summary of the highest-grossing departments in the "store".

### Installation
1. Clone repository.
1. Install Node dependencies 
    1. Run command in Terminal/Bash :
    `npm install`
1. Run server on localhost port 8889.

## How Does It Work?

### Customer 
Run `node bamazonCustomer.js` and follow prompts to do the following: 
* Print  table of products available.
* Choose product to purchase by ID number.
* If there is a sufficient amount of the product in stock, it will return the total for that purchase.
    * When the purchase goes through, it updates the stock quantity to reflect the purchase.
    ![Purchase Succes](/custPurchase.png)
* If there is not enough of the product in stock, it will display error message.


### Manager

### Supervisor 


## Built With
* Node.js
* [MySql NPM package](https://www.npmjs.com/package/mysql)
* [Inquirer NPM package]( https://www.npmjs.com/package/inquirer)


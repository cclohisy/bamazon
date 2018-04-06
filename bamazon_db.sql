DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(550) ,
  department_name VARCHAR(255) ,
  price DECIMAL(10,2),
  stock_quantity INTEGER(10),
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price,stock_quantity)
VALUES ("TV", "Electronics", 5675.99, 1000),
("Squeegee", "Electronics", 29.99, 23092),
("Lipstick", "Health and Beauty", 5.65, 79043),
("Necklace", "Jewlery", 5675.99, 1000),
("Speaker", "Electronics", 499.99, 46933);
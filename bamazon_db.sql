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

-- Create a new MySQL table called departments. Your table should include the following columns:

-- department_id
-- department_name
-- over_head_costs (A dummy number you set for each department)

USE bamazon;

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(550) ,
  over_head_costs DECIMAL(12,2),
  PRIMARY KEY (item_id)
);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Electronics", 800000.00),
("Health and Beauty", 500000.00),
("Jewlery", 300000.00),
("Grocery", 600000.00);

ALTER TABLE products ADD product_sales;

-- join table attempts...this version does not combine similar departments ids
SELECT d.department_id, d.department_name, d.over_head_costs, p.product_sales
FROM bamazon.products p
JOIN departments  d ON p.department_name  = d.department_name


-- woohooo groups by dept id to avoid repetition :)
SELECT d.department_id, d.department_name, d.over_head_costs, p.product_sales
FROM bamazon.products p
JOIN departments  d ON p.department_name  = d.department_name
GROUP BY department_id\

-- ADD RIGHT JOIN... WILL STILL SHOW GET PRODUCT SALES RIGHT PRODUCT SALES...
SELECT d.department_id, d.department_name, d.over_head_costs, p.product_sales,
SUM( p.product_sales - d.over_head_costs) AS total_profit
FROM bamazon.products p
RIGHT JOIN departments  d ON p.department_name  = d.department_name
GROUP BY department_name 

-- WORKING! :) 
--displays dept name and total product sales for each department and groups by department name... add alias?
--NEED TO APPLY THIS TO JOIN.. after alias? 
SELECT department_name, SUM(product_sales) AS total_sales FROM products 
WHERE p.department_name = p.department_name 
GROUP BY department_name;

-- attempt at joining
SELECT d.department_id, d.department_name, d.over_head_costs, p.product_sales,
SUM( p.product_sales - d.over_head_costs) AS total_profit,
SUM(product_sales) AS total_sales FROM bamazon.products p
RIGHT JOIN departments  d ON p.department_name  = d.department_name
GROUP BY department_name 

--THINK this is working?... 




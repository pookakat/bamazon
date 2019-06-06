var inquirer = require ('inquirer');

var mysql = require ('mysql');

var wait = require ('wait-for-stuff');

var connection = mysql.createConnection({
    host : '127.0.0.1',
    user : 'root',
    password : '',
    database : 'bamazon'
});

connection.connect(function(err){
    if (err){
        console.error('Could not connect');
        return;
    }
    console.log('Connected to BAMazon. Welcome, Manager!');
    managerQuestions();
});

//The first questions

function managerQuestions(){
    inquirer.prompt([
        {
            type: 'list',
            name: 'managerList',
            message: 'What can BAMazon do today?',
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit BAMazon']
        }
    ]).then(function(inquirerResponse){
        switch (inquirerResponse.managerList){
            case 'View Products for Sale':
                inventoryView('all');
                break;
            case 'View Low Inventory':
                inventoryView('low');
                break;
            case 'Add to Inventory':
                addNumbers();
                break;
            case 'Add New Product':
                addProduct();
                break;
            case 'Exit BAMazon':
                console.log('Goodbye');
                connection.end();
        }
    });
};

//Prints an inventory based on the parameter all or items with a low (5 or lower) value.

function inventoryView(listParameter){
    var queryString = 'SELECT * FROM products';
    connection.query(queryString, function(err, rows, fields) {
        if (err) throw err;
        
        if (listParameter === 'all'){
     
            for (var i in rows) {
                console.log('ID: ' + rows[i].id + '   PRODUCT: ' + rows[i].product_name + '   PRICE: ' + rows[i].price + '   QUANTITY IN STOCK: ' + rows[i].stock_quantity);
            }
        }
        else{
            for (var i in rows) {
                if (rows[i].stock_quantity <= 5){
                    console.log('ID: ' + rows[i].id + '   PRODUCT: ' + rows[i].product_name + '   PRICE: ' + rows[i].price + '   QUANTITY IN STOCK: ' + rows[i].stock_quantity);
                }
            }
        }
        managerQuestions();
    });
};

//More questions for adding things to the database

function addNumbers(){
    inquirer.prompt([
        {
            type: 'input',
            name: 'id',
            message: 'Sure! We can add more quantity to your products. What ID number?'
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'How many more should we add?'        
        }]).then(function(inquirerResponse){
            var id = inquirerResponse.id;
            var quantity = parseInt(inquirerResponse.quantity, 10);
            calcuateNewQuantity(id, quantity);
        });
};

function addProduct(){
    inquirer.prompt([
        {
            type: 'input',
            name: 'productName',
            message: 'Sure! We can add more products to our stock. What are we adding?'
        },
        {
            type: 'input',
            name: 'department',
            message: 'What department should they go in?'        
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'How many should we start with?'        
        },
        {
            type: 'input',
            name: 'price',
            message: 'How much should we sell them for?'
        }]).then(function(inquirerResponse){
            var product = inquirerResponse.productName;
            var department = inquirerResponse.department;
            var quantity = parseInt(inquirerResponse.quantity, 10);
            var price = parseInt(inquirerResponse.price, 10);
            addProductToDB(product, department, quantity, price);
        });
};

//These are calculating functions

function calcuateNewQuantity(id, quantity){
    var queryString = `SELECT product_name, stock_quantity FROM products WHERE id = '${id}'`;

    connection.query(queryString,  function(err, result, fields) {
        if (err) throw err;
        
        console.log('Adding ' + quantity + ' more ' + result[0].product_name +'(s) to current stock of ' + result[0].stock_quantity + '.');
        var newQuantity = result[0].stock_quantity + quantity;
        console.log('New quantity of ' + result[0].product_name +'(s) is ' + newQuantity + '.');
        addToDB(id, newQuantity);       
    });
};

//Functions to add things to the database

function addToDB(id, quantity){
    connection.query(`UPDATE products SET stock_quantity = '${quantity}' WHERE id='${id}'`);
    managerQuestions();
};

function addProductToDB(product, department, quantity, price){
    var queryString = `INSERT INTO products(product_name, department_name, stock_quantity, price)
        VALUES('${product}', '${department}', '${quantity}', '${price}')`;
    connection.query(queryString,  function(err, result, fields) {
        if (err) throw err;

        console.log('New Product Added: ' + product + ' ID: ' + result.insertId);
        });

        wait.for.time(1);
        managerQuestions();
        
}
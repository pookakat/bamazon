var inquirer = require ('inquirer');

var mysql = require ('mysql');

var products = ['Leave BAMazon'];

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
    console.log('Connected to BAMazon');
});

var queryString = 'SELECT * FROM products';

connection.query(queryString, function(err, rows, fields) {
    if (err) throw err;
 
    for (var i in rows) {
        products.push(rows[i].product_name);
    }
    buyerQuestions();
});

function buyerQuestions(){
    var databaseNumbers=[];
    inquirer.prompt([
        {
            type: 'list',
            name: 'purchase',
            message: 'Welcome to BAMazon! What would you like to buy?',
            choices: products
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'How many would you like?'
        }
    ]).then(function(inquirerResponse){
        var quantity = inquirerResponse.quantity;
        var product = inquirerResponse.purchase;
        if (product === 'Leave BAMazon'){
            console.log('Goodbye');
            connection.end();
        }
        else{
        console.log('You wish to buy ' + quantity + ' ' + product +'(s)? \n Ok, checking database...');
        checkProduct(product, quantity);
        }});
};

function checkProduct(product, quantity){

    var queryString = `SELECT stock_quantity, price FROM products WHERE product_name = '${product}'`;

    connection.query(queryString,  function(err, result, fields) {
        if (err) throw err;
     
        var databaseNumbers = result[0];
        checkStuff(product, quantity, databaseNumbers);        
    });
}

function checkStuff(product, quantity, databaseNumbers){
    if (databaseNumbers.stock_quantity > 0){
        console.log('We currently have ' + databaseNumbers.stock_quantity + ' ' + product + '(s).');
        if (quantity>databaseNumbers.stock_quantity){
            console.log('We do not have enough for you');
            buyerQuestions();
        }
        else{
            console.log('Here ya go! ' + quantity + ' ' + product + '(s) coming right up!');
            totalPrice = databaseNumbers.price * quantity;
            newStockQuantity = databaseNumbers.stock_quantity - quantity;
            updateQuantity(product, newStockQuantity);
            console.log('That will be ' + totalPrice + ' dollars.');
            buyerQuestions();
        }
    }
    else{
        console.log('Stock of ' + product + '(s) is empty!');
        buyerQuestions();
    }
}

function updateQuantity(product, quantity){
    connection.query(`UPDATE products SET stock_quantity = '${quantity}' WHERE product_name='${product}'`);
}

// SELECT * FROM products WHERE product_name = 'product name'
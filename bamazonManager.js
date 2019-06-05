var inquirer = require ('inquirer');

var mysql = require ('mysql');

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
                console.log('Make new stuff');
                break;
            case 'Exit BAMazon':
                console.log('Goodbye');
                connection.end();
        }
    });
}

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
}

function addNumbers(){
    
}
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
    console.log('Connected to BAMazon');
});


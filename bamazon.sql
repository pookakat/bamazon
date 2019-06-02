DROP DATABASE IF EXISTS bamazon;

Create DATABASE bamazon;

USE bamazon;

create table products(
	id Integer(11) auto_increment not null,
    product_name VARCHAR(50) not null,
    department_name varchar(30) not null,
    price Integer(5) not null,
    stock_quantity Integer(7) not null,
    primary key(id)
);

insert into products(product_name, department_name, price, stock_quantity)
	values	('Corvette Stingray', 'autos', 30000, 15),
			('How to Make Programs Do the Stuff', 'books', 20, 100),
            ('Evil Pony', 'pets', 0, 20000),
            ('Nice Pony', 'pets', 100000, 0),
            ('Dukie', 'music', 5, 100),
            ('Ghostbusters', 'movies', 5, 100),
            ('Bioshock: The Collectors Edition', 'games', 30, 57),
            ('Rabid Squirrel', 'pets', 5, 1000),
            ('Call Me Maybe', 'music', 2, 100),
            ('The Division 2', 'games', 60, 100),
            ('A Ford That Works', 'autos', 50000, 0);

select * from products;
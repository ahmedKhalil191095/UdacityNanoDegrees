CREATE TABLE orderProduct (orderId INTEGER REFERENCES orders(id),productId INTEGER REFERENCES products(id),quantity INTEGER);

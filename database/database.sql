CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (name, price) VALUES
('Headphones', 59.99),
('Smart Watch', 99.99),
('Mouse', 29.99),
('Keyboard', 79.99),
('USB-C Cable', 9.99),
('Laptop Stand', 24.99),
('Speaker', 39.99),
('Phone Holder', 14.99),
('Webcam', 49.99),
('External SSD', 119.99),
('Power Bank', 34.99),
('Monitor', 199.99),
('Tablet', 249.99),
('Phone Case', 12.99),
('Charger', 19.99),
('Earbuds', 149.99);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total NUMERIC(10,2),
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER,
    price NUMERIC(10,2)
);
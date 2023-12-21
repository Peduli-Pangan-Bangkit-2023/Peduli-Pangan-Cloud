CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    name VARCHAR(25) NOT NULL,
    price DOUBLE NOT NULL,
    date DATETIME NOT NULL,
    detail TEXT,
    attachment VARCHAR(255),
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL
);
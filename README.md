# Live Site: https://buyme-1.onrender.com
# BuyMe

BuyMe is a simple e-commerce website project.

In this project, users can see products, sign up, log in, add items to cart, add items to wishlist, and place an order.

## Features

- User signup
- User login
- Logout
- View products
- Search products
- Add to cart
- Wishlist
- Product comments
- Checkout
- Feedback

## Technologies Used

- HTML
- CSS
- JavaScript
- Bootstrap
- Node.js
- Express.js
- PostgreSQL

## How to Run the Project

1. Download or clone the project.
2. Open the project folder.
3. Install packages:

```bash
npm install
```

4. Create a `.env` file and add:

```env
PORT=3000
DB_USER=your_postgres_user
DB_HOST=localhost
DB_NAME=buyme
DB_PASSWORD=your_postgres_password
DB_PORT=5432
JWT_SECRET=your_secret_key
```

5. Create a PostgreSQL database named `buyme`.
6. Run the SQL file from `database/database.sql`.
7. Start the server:

```bash
npm start
```

8. Open in browser:

```text
http://localhost:3000
```

## Project Pages

- Home page
- Products page
- Cart page
- Wishlist page
- Login page
- Signup page
- Feedback page

## Database Tables

- users
- products
- orders
- order_items

# 🍽️ Catering Reservation & Ordering System

A web-based **Catering Reservation and Ordering System** developed using **HTML, CSS, and JavaScript**.  
This project allows catering service providers (Admin) to manage products and orders, while users can browse menus, add items to cart, place orders, and track order status.

---

## 📌 Features

### 🔐 Authentication
- Admin & User registration
- Login with role selection (Admin / User)
- Login allowed only after successful registration

---

### 👨‍💼 Admin Module
- Register and Login
- Upload catering products
- Upload products by category:
  - Veg
  - Non-Veg
  - Starters
  - Desserts
- View products on cart
- View total price of user
- View all customer orders
- Dashboard with navigation

---

### 👤 User Module
- Register and Login
- View catering products
- Filter products by category:
  - Veg
  - Non-Veg
  - Starters
  - Desserts
- Add products to cart
- Increase / Decrease quantity
- Remove items from cart
- View total price
- Place order
- View order history with:
  - Order ID
  - Order Date
  - Order Items
  - Order Total
  - Order Status
- Manage user profile

---

### 🛒 Cart & Order Management
- Cart count badge in navbar
- Persistent cart using `localStorage`
- Order stored with unique Order ID
- Orders visible in “My Orders” after placement

---

### 🎨 UI Features
- Same CSS theme across all pages
- Responsive layout
- Clean card-based UI
- Navbar navigation on all pages

---

## 🛠️ Technologies Used
- **HTML5**
- **CSS3**
- **JavaScript (Vanilla JS)**
- **LocalStorage** for data persistence

---

## 📂 Project Structure

Catering-System/

├── admin-dashboard.html # Admin dashboard

├── view-products.html # Product listing

├── cart.html # Cart page

├── index.html # Home page (Login / Register + About / Contact)

├── orders.html # My Orders page

├── profile.html # User profile


├── README.md # Project documentation

├── styles.css # Common stylesheet

├── user-dashboard.html # User dashboard

└── view-products.html # Product listing


## 🚀 How to Run the Project

1. Open `index.html` in any modern web browser
2. Register as Admin or User
3. Login and start using the system
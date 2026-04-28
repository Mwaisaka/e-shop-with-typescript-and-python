# 🛒 Full Stack E-Commerce Platform

![React](https://img.shields.io/badge/Frontend-React-blue)
![Django](https://img.shields.io/badge/Backend-Django-green)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue)
![Tailwind](https://img.shields.io/badge/Styling-TailwindCSS-38bdf8)
![License](https://img.shields.io/badge/License-MIT-yellow)

A modern **full-stack e-commerce web application** built using **React + Vite + TypeScript + Tailwind CSS** on the frontend and **Django** on the backend.

The platform allows users to **browse products, search, filter, add to cart, leave reviews, manage orders, and manage their profile** while administrators manage products and users through the Django admin dashboard.

This project demonstrates **full stack architecture, REST API design, authentication systems, and scalable UI development**.

---

# 🌐 Live Demo

Frontend:

```
https://nzisa-fashions.onrender.com
```

Backend API:

```
https://nzisa-fashions-backend.onrender.com/
```

Admin Panel:

```
https://nzisa-fashions-backend.onrender.com/admin/
```

---

# 🖼 Screenshots

## Home Page

Add screenshot:

```
/screenshots/homepage.png
```

## Product Page

```
/screenshots/product-page.png
```

## Cart Page

```
/screenshots/cart.png
```

## Admin Dashboard

```
/screenshots/admin.png
```

---

# 🚀 Features

## 👤 User Features

✔ User registration
✔ Login & logout
✔ Profile management
✔ Change password
✔ Upload profile photo
✔ View order history
✔ Wishlist functionality

---

## 🛍 Product Features

✔ Browse product catalog
✔ Product detail pages
✔ Product categories
✔ Product search
✔ Filter by:

* category
* price
* rating

✔ Product reviews and ratings
✔ Related products suggestions

---

## 🛒 Cart & Orders

✔ Add products to cart
✔ Update cart quantities
✔ Remove items from cart
✔ Checkout functionality
✔ View order history

---

## 📊 Admin Features

Accessible via **Django Admin Panel**

✔ Product management
✔ Category management
✔ Order management
✔ User management
✔ Review moderation

---

# 🧱 Tech Stack

## Frontend

* React
* Vite
* TypeScript
* Tailwind CSS
* React Router
* Axios

---

## Backend

* Django
* Django REST Framework
* SQLite / PostgreSQL
* Django Authentication

---

## Dev Tools

* Git
* ESLint
* Prettier
* Postman

---

# 🏗 System Architecture

```
React Frontend
      │
      │ REST API (Axios)
      ▼
Django Backend
      │
      ▼
Database (SQLite / PostgreSQL)
```

---

# 📂 Project Structure

```
ecommerce-app
│
├── backend
│   ├── accounts
│   ├── products
│   ├── orders
│   ├── reviews
│   ├── manage.py
│   └── settings.py
│
├── frontend
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── context
│   │   ├── hooks
│   │   ├── pages
│   │   ├── routes
│   │   └── types
│   │
│   ├── public
│   └── vite.config.ts
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```
git clone https://github.com/yourusername/ecommerce-app.git

cd ecommerce-app
```

---

# 🖥 Backend Setup

Navigate to backend folder:

```
cd ds_server
```

Install dependencies:

```
pip install -r requirements.txt
```

Apply migrations:

```
python manage.py migrate
```

Create admin user:

```
python manage.py createsuperuser
```

Start server:

```
python manage.py runserver
```

Backend will run at:

```
http://127.0.0.1:8000
```

---

# 💻 Frontend Setup

Navigate to frontend folder:

```
cd ds_client
```

Install dependencies:

```
npm install
```

Run development server:

```
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

---

# 🔌 API Endpoints

## Authentication

```
POST /accounts/register/
POST /accounts/login/
POST /accounts/logout/
```

---

## Products

```
GET /api/products/
GET /api/products/:id
```

Filters supported:

```
/api/products/?q=laptop
/api/products/?category=electronics
/api/products/?rating=4
/api/products/?max_price=1000
```

---

## Reviews

```
POST /api/reviews/
GET /api/reviews/:product_id
```

---

## Orders

```
GET /api/orders/
POST /api/orders/create/
```

---

# 🔐 Authentication

Authentication uses:

* Django sessions
* Protected API routes
* React AuthContext for global user state

---

# 📱 UI Features

✔ Responsive design
✔ Mobile navigation menu
✔ Product search bar
✔ Filters sidebar
✔ User avatar dropdown
✔ Shopping cart icon with counter
✔ Wishlist icon
✔ Product rating display

---

# ☁️ Deployment

Recommended deployment setup:

| Component | Platform   |
| --------- | ---------- |
| Frontend  | Render     |
| Backend   | Render     |
| Database  | SQLite     |

---

# 🧪 Future Improvements

* Stripe payment integration
* Email notifications
* Order tracking
* Product recommendation engine
* Real-time notifications
* Docker deployment
* Kubernetes deployment
* CI/CD pipelines

---

# 👨‍💻 Author

**Frank Mwaisaka**

Full Stack Developer

Passionate about building scalable applications using:

* React
* Django
* TypeScript
* JavaScript
* Python
* Modern Web Technologies

---

# 📜 License

MIT License

---

# ⭐ Support

If you found this project useful, please give it a ⭐ on GitHub.

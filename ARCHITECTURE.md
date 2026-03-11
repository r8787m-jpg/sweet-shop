# Sweet Shop System - Architecture Document

## 1. Backend Structure (Node.js + Express)
```
backend/
├── server.js           # Main server entry
├── package.json       # Dependencies
├── routes/
│   ├── customerRoutes.js    # Customer API
│   ├── orderRoutes.js       # Order API
│   ├── productRoutes.js     # Product API
│   └── adminRoutes.js       # Admin API
├── models/
│   ├── customer.js    # Customer model
│   ├── order.js       # Order model
│   └── product.js     # Product model
├── middleware/
│   └── auth.js        # Authentication middleware
└── database/
    └── db.js          # SQLite database connection
```

## 2. Frontend Structure
```
public/
├── index.html              # Home page
├── order-cake.html         # Custom cake ordering
├── order-buffet.html       # Buffet catering
├── order-sweets.html       # Ready sweets
├── admin/
│   ├── dashboard.html     # Admin dashboard
│   ├── orders.html        # Order management
│   ├── products.html      # Product management
│   └── customers.html     # Customer management
├── css/
│   └── style.css          # Global styles
└── js/
    ├── main.js            # Main functionality
    ├── api.js             # API calls
    └── admin.js           # Admin functionality
```

## 3. Database Schema (SQLite)

### Tables:

#### customers
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER PRIMARY KEY | Auto increment |
| name | TEXT | Customer name |
| email | TEXT UNIQUE | Email address |
| phone | TEXT | Phone number |
| address | TEXT | Delivery address |
| created_at | DATETIME | Creation timestamp |

#### products
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER PRIMARY KEY | Auto increment |
| name | TEXT | Product name |
| category | TEXT | cake/buffet/sweets |
| description | TEXT | Product description |
| price | REAL | Price |
| image | TEXT | Image URL |
| available | INTEGER | 0 or 1 |
| created_at | DATETIME | Creation timestamp |

#### orders
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER PRIMARY KEY | Auto increment |
| customer_id | INTEGER | Foreign key to customers |
| order_type | TEXT | cake/buffet/sweets |
| product_id | INTEGER | Foreign key to products (nullable for custom) |
| quantity | INTEGER | Order quantity |
| total_price | REAL | Total price |
| status | TEXT | pending/confirmed/preparing/delivered/cancelled |
| notes | TEXT | Special instructions |
| delivery_date | DATE | Required delivery date |
| created_at | DATETIME | Creation timestamp |

## 4. API Endpoints

### Customer APIs
- `POST /api/customers` - Register new customer
- `GET /api/customers/:id` - Get customer by ID
- `GET /api/customers` - List all customers

### Product APIs
- `GET /api/products` - List all products (with filters)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Add new product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Order APIs
- `POST /api/orders` - Create new order
- `GET /api/orders` - List orders (with filters)
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status (admin)

### Admin APIs
- `POST /api/admin/login` - Admin login
- `GET /api/admin/stats` - Dashboard statistics

---

## 5. Technology Stack

- **Backend**: Node.js + Express.js
- **Database**: SQLite (simple, no setup required)
- **Frontend**: HTML5 + Bootstrap 5 + Vanilla JavaScript
- **Authentication**: JWT tokens for admin

---

_Generated: 2026-03-11_

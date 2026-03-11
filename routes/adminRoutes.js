const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db');

const router = express.Router();
const JWT_SECRET = 'sweet-shop-secret-key-2026';

// Admin login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  db.get("SELECT * FROM admins WHERE username = ?", [username], (err, admin) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const validPassword = bcrypt.compareSync(password, admin.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, username: admin.username });
  });
});

// Middleware to verify admin token
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Dashboard statistics
router.get('/stats', verifyAdmin, (req, res) => {
  const stats = {};
  
  db.get("SELECT COUNT(*) as total FROM customers", (err, row) => {
    stats.customers = row.total;
    
    db.get("SELECT COUNT(*) as total FROM orders", (err, row) => {
      stats.totalOrders = row.total;
      
      db.get("SELECT COUNT(*) as total FROM orders WHERE status = 'pending'", (err, row) => {
        stats.pendingOrders = row.total;
        
        db.get("SELECT SUM(total_price) as total FROM orders WHERE status = 'delivered'", (err, row) => {
          stats.totalRevenue = row.total || 0;
          
          res.json(stats);
        });
      });
    });
  });
});

// Get all customers (admin)
router.get('/customers', verifyAdmin, (req, res) => {
  db.all("SELECT * FROM customers ORDER BY created_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get all orders (admin)
router.get('/orders', verifyAdmin, (req, res) => {
  const { status } = req.query;
  let query = "SELECT o.*, c.name as customer_name, c.phone as customer_phone, p.name as product_name FROM orders o LEFT JOIN customers c ON o.customer_id = c.id LEFT JOIN products p ON o.product_id = p.id";
  let params = [];
  
  if (status) {
    query += " WHERE o.status = ?";
    params.push(status);
  }
  
  query += " ORDER BY o.created_at DESC";
  
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Update order status
router.put('/orders/:id/status', verifyAdmin, (req, res) => {
  const { status } = req.body;
  db.run("UPDATE orders SET status = ? WHERE id = ?", [status, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Order status updated', changes: this.changes });
  });
});

// Get all products (admin)
router.get('/products', verifyAdmin, (req, res) => {
  db.all("SELECT * FROM products ORDER BY category, name", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Add product
router.post('/products', verifyAdmin, (req, res) => {
  const { name, category, description, price, image, available } = req.body;
  db.run(
    "INSERT INTO products (name, category, description, price, image, available) VALUES (?, ?, ?, ?, ?, ?)",
    [name, category, description, price, image, available ? 1 : 0],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, message: 'Product added' });
    }
  );
});

// Update product
router.put('/products/:id', verifyAdmin, (req, res) => {
  const { name, category, description, price, image, available } = req.body;
  db.run(
    "UPDATE products SET name = ?, category = ?, description = ?, price = ?, image = ?, available = ? WHERE id = ?",
    [name, category, description, price, image, available ? 1 : 0, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Product updated', changes: this.changes });
    }
  );
});

// Delete product
router.delete('/products/:id', verifyAdmin, (req, res) => {
  db.run("DELETE FROM products WHERE id = ?", [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Product deleted', changes: this.changes });
  });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Get all products (with optional category filter)
router.get('/', (req, res) => {
  const { category, available, limit } = req.query;
  let sql = `SELECT * FROM products WHERE 1=1`;
  const params = [];

  if (category) {
    sql += ` AND category = ?`;
    params.push(category);
  }
  
  if (available !== undefined) {
    sql += ` AND available = ?`;
    params.push(available);
  }

  sql += ` ORDER BY category, name`;
  
  if (limit) {
    sql += ` LIMIT ?`;
    params.push(parseInt(limit));
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get product by ID
router.get('/:id', (req, res) => {
  const sql = `SELECT * FROM products WHERE id = ?`;
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(row);
  });
});

// Add new product
router.post('/', (req, res) => {
  const { name, category, description, price, image, available } = req.body;
  
  if (!name || !category || !price) {
    return res.status(400).json({ error: 'Name, category, and price are required' });
  }

  const sql = `INSERT INTO products (name, category, description, price, image, available) VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(sql, [name, category, description, price, image, available !== false ? 1 : 0], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID, message: 'Product added successfully' });
  });
});

// Update product
router.put('/:id', (req, res) => {
  const { name, category, description, price, image, available } = req.body;
  const sql = `UPDATE products SET name = ?, category = ?, description = ?, price = ?, image = ?, available = ? WHERE id = ?`;
  db.run(sql, [name, category, description, price, image, available ? 1 : 0, req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Product updated successfully' });
  });
});

// Delete product
router.delete('/:id', (req, res) => {
  const sql = `DELETE FROM products WHERE id = ?`;
  db.run(sql, [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Product deleted successfully' });
  });
});

module.exports = router;

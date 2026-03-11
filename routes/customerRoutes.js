const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Register new customer
router.post('/', (req, res) => {
  const { name, email, phone, address } = req.body;
  
  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }

  const sql = `INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)`;
  db.run(sql, [name, email, phone, address], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID, message: 'Customer registered successfully' });
  });
});

// Get all customers
router.get('/', (req, res) => {
  const sql = `SELECT * FROM customers ORDER BY created_at DESC`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get customer by ID
router.get('/:id', (req, res) => {
  const sql = `SELECT * FROM customers WHERE id = ?`;
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(row);
  });
});

// Update customer
router.put('/:id', (req, res) => {
  const { name, email, phone, address } = req.body;
  const sql = `UPDATE customers SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?`;
  db.run(sql, [name, email, phone, address, req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Customer updated successfully' });
  });
});

// Delete customer
router.delete('/:id', (req, res) => {
  const sql = `DELETE FROM customers WHERE id = ?`;
  db.run(sql, [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Customer deleted successfully' });
  });
});

module.exports = router;

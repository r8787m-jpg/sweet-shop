const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Create new order
router.post('/', (req, res) => {
  const { 
    customer_id, 
    order_type, 
    product_id, 
    quantity, 
    total_price, 
    notes, 
    delivery_date,
    customer_name,
    customer_phone,
    customer_address
  } = req.body;

  if (!order_type || !total_price) {
    return res.status(400).json({ error: 'Order type and total price are required' });
  }

  const sql = `INSERT INTO orders 
    (customer_id, order_type, product_id, quantity, total_price, notes, delivery_date, customer_name, customer_phone, customer_address) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.run(sql, [
    customer_id || null,
    order_type,
    product_id || null,
    quantity || 1,
    total_price,
    notes || '',
    delivery_date || '',
    customer_name || '',
    customer_phone || '',
    customer_address || ''
  ], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ 
      id: this.lastID, 
      orderId: this.lastID,
      order_number: `ORD-${String(this.lastID).padStart(5, '0')}`,
      message: 'Order placed successfully' 
    });
  });
});

// Get all orders (with optional filters)
router.get('/', (req, res) => {
  const { status, order_type, customer_id } = req.query;
  let sql = `SELECT o.*, c.name as customer_name, c.phone as customer_phone, p.name as product_name 
             FROM orders o 
             LEFT JOIN customers c ON o.customer_id = c.id 
             LEFT JOIN products p ON o.product_id = p.id 
             WHERE 1=1`;
  const params = [];

  if (status) {
    sql += ` AND o.status = ?`;
    params.push(status);
  }
  
  if (order_type) {
    sql += ` AND o.order_type = ?`;
    params.push(order_type);
  }

  if (customer_id) {
    sql += ` AND o.customer_id = ?`;
    params.push(customer_id);
  }

  sql += ` ORDER BY o.created_at DESC`;

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get order by ID
router.get('/:id', (req, res) => {
  const sql = `SELECT o.*, c.name as customer_name, c.email as customer_email, c.phone as customer_phone, c.address as customer_address, p.name as product_name 
               FROM orders o 
               LEFT JOIN customers c ON o.customer_id = c.id 
               LEFT JOIN products p ON o.product_id = p.id 
               WHERE o.id = ?`;
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(row);
  });
});

// Update order status
router.put('/:id/status', (req, res) => {
  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  const validStatuses = ['pending', 'confirmed', 'preparing', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const sql = `UPDATE orders SET status = ? WHERE id = ?`;
  db.run(sql, [status, req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Order status updated successfully' });
  });
});

// Update order
router.put('/:id', (req, res) => {
  const { quantity, total_price, notes, delivery_date, status } = req.body;
  const sql = `UPDATE orders SET quantity = ?, total_price = ?, notes = ?, delivery_date = ?, status = ? WHERE id = ?`;
  db.run(sql, [quantity, total_price, notes, delivery_date, status, req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Order updated successfully' });
  });
});

// Delete order
router.delete('/:id', (req, res) => {
  const sql = `DELETE FROM orders WHERE id = ?`;
  db.run(sql, [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Order deleted successfully' });
  });
});

module.exports = router;

const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const customerRoutes = require('./routes/customerRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Serve frontend pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/order-cake', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'order-cake.html'));
});

app.get('/order-buffet', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'order-buffet.html'));
});

app.get('/order-sweets', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'order-sweets.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'dashboard.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║   🍰 Sweet Shop System Running          ║
║   🌐 http://localhost:${PORT}              ║
║   👤 Admin: /admin (admin/admin123)     ║
╚══════════════════════════════════════════╝
  `);
});

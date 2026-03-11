const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'sweetshop.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // Customers table
    db.run(`
      CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        phone TEXT NOT NULL,
        address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Products table
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        image TEXT,
        available INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Orders table
    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER,
        order_type TEXT NOT NULL,
        product_id INTEGER,
        quantity INTEGER DEFAULT 1,
        total_price REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        notes TEXT,
        delivery_date TEXT,
        customer_name TEXT,
        customer_phone TEXT,
        customer_address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);

    // Admin table
    db.run(`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, () => {
      // Insert default admin if not exists
      const bcrypt = require('bcryptjs');
      const defaultPassword = bcrypt.hashSync('admin123', 10);
      
      db.get("SELECT * FROM admins WHERE username = 'admin'", (err, row) => {
        if (!row) {
          db.run("INSERT INTO admins (username, password) VALUES (?, ?)", ['admin', defaultPassword]);
          console.log('Default admin created: admin / admin123');
        }
      });

      // Insert sample products
      insertSampleProducts();
    });

    console.log('Database tables initialized');
  });
}

function insertSampleProducts() {
  db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
    if (row.count === 0) {
      const products = [
        // Cakes
        ['Chocolate Dream Cake', 'cake', 'Rich chocolate layered cake with cream', 150, '/images/cake-chocolate.jpg'],
        ['Vanilla Bliss Cake', 'cake', 'Classic vanilla cake with buttercream', 120, '/images/cake-vanilla.jpg'],
        ['Red Velvet Cake', 'cake', 'Elegant red velvet with cream cheese', 180, '/images/cake-redvelvet.jpg'],
        ['Custom Design Cake', 'cake', 'Fully customized cake per your design', 250, '/images/cake-custom.jpg'],
        
        // Buffet
        ['Standard Buffet Package', 'buffet', 'Includes 5 types of sweets + 2 drinks', 500, '/images/buffet-standard.jpg'],
        ['Premium Buffet Package', 'buffet', 'Includes 10 types of sweets + 4 drinks', 900, '/images/buffet-premium.jpg'],
        ['VIP Buffet Package', 'buffet', 'Full service + 15 types + unlimited drinks', 1500, '/images/buffet-vip.jpg'],
        
        // Sweets
        ['Baklava Box (1kg)', 'sweets', 'Fresh baklava mixed nuts', 80, '/images/sweets-baklava.jpg'],
        ['Kunafa Box (1kg)', 'sweets', 'Creamy kunafa', 100, '/images/sweets-kunafa.jpg'],
        ['Maamoul Box (1kg)', 'sweets', 'Date-filled maamoul', 60, '/images/sweets-maamoul.jpg'],
        ['Basbousa Cake (1kg)', 'sweets', 'Semolina cake with syrup', 50, '/images/sweets-basbousa.jpg']
      ];

      const stmt = db.prepare("INSERT INTO products (name, category, description, price, image) VALUES (?, ?, ?, ?, ?)");
      products.forEach(p => stmt.run(p));
      stmt.finalize();
      console.log('Sample products inserted');
    }
  });
}

module.exports = db;

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.API_KEY || 'tractor_secret_123';
const JWT_SECRET = process.env.JWT_SECRET || 'hud_dashboard_secret_key_2026';

app.use(cors());
app.use(express.json());

// Middleware: Simple API Key Auth (for the Tractor)
const authenticateHardware = (req, res, next) => {
  const providedKey = req.headers['x-api-key'];
  if (providedKey === API_KEY) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
  }
};

// Middleware: JWT Auth (for the Web App)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied: No token provided' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

let db;

(async () => {
  // Initialize SQLite Database
  db = await open({
    filename: './telemetry.sqlite',
    driver: sqlite3.Database
  });

  // Create Telemetry Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS telemetry (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      loader REAL,
      obstacle REAL,
      zmpt REAL,
      lat TEXT,
      lng TEXT,
      fix INTEGER,
      sats INTEGER,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create Users Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('\x1b[32m[Database]\x1b[0m SQLite initialized');
})();

// --- AUTH ENDPOINTS ---

// Signup
app.post('/api/auth/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);

  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, username: user.username } });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// --- TELEMETRY ENDPOINTS ---

// Dashboard fetches LATEST data (Protected)
app.get('/api/telemetry', authenticateToken, async (req, res) => {
  const data = await db.get('SELECT * FROM telemetry ORDER BY id DESC LIMIT 1');
  res.json(data || { message: 'No data yet' });
});

// Dashboard fetches HISTORY (Protected)
app.get('/api/telemetry/history', authenticateToken, async (req, res) => {
  const data = await db.all('SELECT * FROM telemetry ORDER BY id DESC LIMIT 50');
  res.json(data);
});

// The Tractor sends data (AUTH REQUIRED via API Key)
app.post('/api/telemetry', authenticateHardware, async (req, res) => {
  const { loader, obstacle, zmpt, lat, lng, fix, sats } = req.body;
  
  await db.run(
    `INSERT INTO telemetry (loader, obstacle, zmpt, lat, lng, fix, sats) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [loader, obstacle, zmpt, lat, lng, fix ? 1 : 0, sats]
  );

  console.log('\x1b[34m[Telemetry]\x1b[0m New data saved to SQLite');
  res.status(201).send('Data Saved');
});

app.listen(PORT, () => {
  console.log(`\x1b[32m[Tractor_OS Backend]\x1b[0m Running at http://localhost:${PORT}`);
  console.log(`\x1b[33m[Auth]\x1b[0m JWT enabled for Web and API Key for Hardware`);
});


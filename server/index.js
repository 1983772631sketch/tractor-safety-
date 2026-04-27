require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const app = express();
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.API_KEY || 'tractor_secret_123';

app.use(cors());
app.use(express.json());

// Middleware: Simple API Key Auth
const authenticate = (req, res, next) => {
  const providedKey = req.headers['x-api-key'];
  if (providedKey === API_KEY) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
  }
};

let db;

(async () => {
  // Initialize SQLite Database
  db = await open({
    filename: './telemetry.sqlite',
    driver: sqlite3.Database
  });

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

  console.log('\x1b[32m[Database]\x1b[0m SQLite initialized');
})();

// ENDPOINT 1: Dashboard fetches LATEST data
app.get('/api/telemetry', async (req, res) => {
  const data = await db.get('SELECT * FROM telemetry ORDER BY id DESC LIMIT 1');
  res.json(data || { message: 'No data yet' });
});

// ENDPOINT 2: Dashboard fetches HISTORY
app.get('/api/telemetry/history', async (req, res) => {
  const data = await db.all('SELECT * FROM telemetry ORDER BY id DESC LIMIT 50');
  res.json(data);
});

// ENDPOINT 3: The Tractor sends data (AUTH REQUIRED)
app.post('/api/telemetry', authenticate, async (req, res) => {
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
  console.log(`\x1b[33m[Auth]\x1b[0m API Key is required for POST requests`);
});

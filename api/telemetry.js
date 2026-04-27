import { db } from '@vercel/postgres';

export default async function handler(request, response) {
  // 1. Handle GET (Latest Telemetry)
  if (request.method === 'GET') {
    try {
      const { rows } = await db.sql`SELECT * FROM telemetry ORDER BY id DESC LIMIT 1`;
      return response.status(200).json(rows[0] || { message: 'No data yet' });
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }

  // 2. Handle POST (New Telemetry)
  if (request.method === 'POST') {
    const { loader, obstacle, zmpt, lat, lng, fix, sats } = request.body;
    const authKey = request.headers['x-api-key'];

    // Simple Auth
    if (authKey !== process.env.API_KEY) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    try {
      // Create table if it doesn't exist
      await db.sql`
        CREATE TABLE IF NOT EXISTS telemetry (
          id SERIAL PRIMARY KEY,
          loader REAL,
          obstacle REAL,
          zmpt REAL,
          lat TEXT,
          lng TEXT,
          fix BOOLEAN,
          sats INTEGER,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;

      await db.sql`
        INSERT INTO telemetry (loader, obstacle, zmpt, lat, lng, fix, sats)
        VALUES (${loader}, ${obstacle}, ${zmpt}, ${lat}, ${lng}, ${fix}, ${sats});
      `;

      return response.status(201).json({ message: 'Telemetry saved' });
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }

  return response.status(405).json({ error: 'Method not allowed' });
}

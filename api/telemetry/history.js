import { db } from '@vercel/postgres';

export default async function handler(request, response) {
  if (request.method === 'GET') {
    try {
      // Create table if it doesn't exist (safety check)
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

      const { rows } = await db.sql`SELECT * FROM telemetry ORDER BY id DESC LIMIT 50`;
      return response.status(200).json(rows);
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }

  return response.status(405).json({ error: 'Method not allowed' });
}

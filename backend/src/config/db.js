const { Pool } = require('pg')

if (!process.env.DATABASE_URL) {
  console.warn('[SISLOG] DATABASE_URL no está configurada; el módulo WMS no podrá consultar PostgreSQL.')
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
})

async function query(text, params = []) {
  return pool.query(text, params)
}

module.exports = { pool, query }

import { Pool, neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

// Required for Node.js - neonConfig tells the driver to use ws package
neonConfig.webSocketConstructor = ws

const url = process.env.DATABASE_URL
console.log('DATABASE_URL prefix:', url?.substring(0, 40))

const pool = new Pool({ connectionString: url })
const client = await pool.connect()
const { rows } = await client.query(`SELECT COUNT(*) FROM "Brand"`)
console.log('Brand count:', rows[0].count)
client.release()
await pool.end()
console.log('OK — Neon WebSocket connection works!')

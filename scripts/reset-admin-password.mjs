/**
 * Resetea la contraseña del usuario admin en Neon.
 * Ejecución: node scripts/reset-admin-password.mjs
 */

import { readFileSync } from 'fs'
import { createRequire } from 'module'

// Cargar bcryptjs (CommonJS) desde ESM
const require = createRequire(import.meta.url)
const bcrypt = require('bcryptjs')

// Cargar .env.local
function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    try {
      const content = readFileSync(file, 'utf8')
      for (const line of content.split('\n')) {
        const match = line.match(/^([A-Z_][A-Z0-9_]*)="?([^"]*)"?$/)
        if (match && !process.env[match[1]]) {
          process.env[match[1]] = match[2]
        }
      }
    } catch { /* archivo no existe */ }
  }
}
loadEnv()

// ── Nueva contraseña ──────────────────────────────────────────────────────────
const NEW_PASSWORD = 'Admin1234!'
const ADMIN_EMAIL  = 'eliasbalcazarmartinez@gmail.com'
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const url = process.env.DATABASE_URL
  if (!url || url.startsWith('file:')) {
    throw new Error('DATABASE_URL debe apuntar a Neon PostgreSQL.')
  }

  // Importar dinámicamente para ESM
  const { Pool, neonConfig } = await import('@neondatabase/serverless')
  const { default: ws } = await import('ws')
  neonConfig.webSocketConstructor = ws

  const pool = new Pool({ connectionString: url })
  const client = await pool.connect()

  try {
    const hash = await bcrypt.hash(NEW_PASSWORD, 12)

    const { rowCount } = await client.query(
      `UPDATE "User" SET password = $1 WHERE email = $2`,
      [hash, ADMIN_EMAIL]
    )

    if (rowCount === 0) {
      console.error(`❌  No se encontró el usuario: ${ADMIN_EMAIL}`)
    } else {
      console.log(`✓  Contraseña actualizada para ${ADMIN_EMAIL}`)
      console.log(`   Nueva contraseña: ${NEW_PASSWORD}`)
    }
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch(e => { console.error(e); process.exit(1) })

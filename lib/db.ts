import { PrismaClient, Prisma } from '@/lib/generated/prisma/client'
import { Pool } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'

// Serialize Decimal fields as numbers in JSON responses (not strings)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(Prisma.Decimal.prototype as any).toJSON = function () { return this.toNumber() }

const url = process.env.DATABASE_URL ?? ''

function createPrisma() {
  if (url.startsWith('file:') || url === '') {
    // Local dev — SQLite (dynamic require avoids bundling native module on Vercel)
    const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3')
    const adapter = new PrismaBetterSqlite3({ url: url || 'file:./dev.db' })
    return new PrismaClient({ adapter })
  }

  // Production — Neon PostgreSQL via WebSocket Pool (supports writes + transactions)
  // PrismaNeonHttp is read-only in Prisma v7 (wraps all writes in TX internally)
  const pool = new Pool({ connectionString: url })
  const adapter = new PrismaNeon(pool)
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }
export const prisma = globalForPrisma.prisma ?? createPrisma()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

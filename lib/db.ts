import { PrismaClient } from '@/lib/generated/prisma/client'

function createPrisma() {
  const url = process.env.DATABASE_URL ?? ''

  if (url.startsWith('file:') || url === '') {
    // Local dev — SQLite
    const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3')
    const adapter = new PrismaBetterSqlite3({ url: url || 'file:./dev.db' })
    return new PrismaClient({ adapter })
  }

  // Production — Neon PostgreSQL
  const { Pool } = require('@neondatabase/serverless')
  const { PrismaNeon } = require('@prisma/adapter-neon')
  const pool = new Pool({ connectionString: url })
  const adapter = new PrismaNeon(pool)
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma = globalForPrisma.prisma ?? createPrisma()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

import { PrismaClient } from '@/lib/generated/prisma/client'

function createPrisma() {
  const url = process.env.DATABASE_URL ?? ''

  if (url.startsWith('file:') || url === '') {
    // Local dev — SQLite
    const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3')
    const adapter = new PrismaBetterSqlite3({ url: url || 'file:./dev.db' })
    return new PrismaClient({ adapter })
  }

  // Production — Neon PostgreSQL via WebSocket
  // In Prisma v7, PrismaNeon takes config directly (not a Pool instance)
  const { neonConfig } = require('@neondatabase/serverless')
  const { PrismaNeon } = require('@prisma/adapter-neon')
  const ws = require('ws')
  neonConfig.webSocketConstructor = ws
  const adapter = new PrismaNeon({ connectionString: url })
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma = globalForPrisma.prisma ?? createPrisma()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

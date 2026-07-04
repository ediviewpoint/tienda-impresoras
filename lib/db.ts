import { PrismaClient } from '@/lib/generated/prisma/client'
import { PrismaNeonHttp } from '@prisma/adapter-neon'

const url = process.env.DATABASE_URL ?? ''
// Prefer unpooled URL for Neon HTTP driver (direct connection)
const neonUrl = process.env.DATABASE_URL_UNPOOLED ?? url

function createPrisma() {
  if (url.startsWith('file:') || url === '') {
    // Local dev — SQLite (dynamic require avoids bundling native module on Vercel)
    const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3')
    const adapter = new PrismaBetterSqlite3({ url: url || 'file:./dev.db' })
    return new PrismaClient({ adapter })
  }

  // Production — Neon PostgreSQL via HTTP (no WebSocket, works in all serverless envs)
  const adapter = new PrismaNeonHttp(neonUrl, {})
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }
export const prisma = globalForPrisma.prisma ?? createPrisma()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

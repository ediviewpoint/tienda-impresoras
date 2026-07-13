import { PrismaClient, Prisma } from '@/lib/generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

// Serialize Decimal fields as numbers in JSON responses (not strings)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(Prisma.Decimal.prototype as any).toJSON = function () { return this.toNumber() }

function createPrisma(): PrismaClient {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set')
  const adapter = new PrismaNeon({ connectionString: url })
  return new PrismaClient({ adapter })
}

const g = globalThis as unknown as { _prisma?: PrismaClient }

function getClient(): PrismaClient {
  if (!g._prisma) g._prisma = createPrisma()
  return g._prisma
}

// Lazy proxy: Prisma client is only created on first DB call, not at module import time.
// This prevents build failures when DATABASE_URL is absent during static analysis.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    const client = getClient()
    const value = (client as any)[prop]
    return typeof value === 'function' ? value.bind(client) : value
  },
})

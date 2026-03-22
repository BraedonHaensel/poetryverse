import { PrismaClient } from '@prisma/client'
import pg from 'pg'
const { Pool } = pg
import { PrismaPg } from '@prisma/adapter-pg'

declare global {
  var cachedPrisma: PrismaClient
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const logLevels = ['query' as const]

export let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({ adapter })
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient({ adapter, log: logLevels })
  }
  prisma = global.cachedPrisma
}

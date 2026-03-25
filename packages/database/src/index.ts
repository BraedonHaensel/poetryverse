import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

declare global {
  var cachedPrisma: PrismaClient
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
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

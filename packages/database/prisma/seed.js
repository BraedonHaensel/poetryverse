import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { userData } from './seeding-data/user.js'
import { poemData } from './seeding-data/poem.js'
import { poemLikeData } from './seeding-data/poemLike.js'
import { reportData } from './seeding-data/report.js'
import { poemTypeData } from './seeding-data/poemType.js'
import { poemTagData } from './seeding-data/poemTag.js'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

/**
 * Seeds the database tables with sample data
 */
async function main() {
  const poemTypeResult = await prisma.poemType.createMany({
    data: poemTypeData,
    skipDuplicates: true,
  })

  const tagResult = await prisma.tag.createMany({
    data: poemTagData,
    skipDuplicates: true,
  })

  const userResult = await prisma.user.createMany({
    data: userData,
    skipDuplicates: true,
  })

  const poemResult = await prisma.poem.createMany({
    data: poemData,
    skipDuplicates: true,
  })

  const poemLikeResult = await prisma.poemLike.createMany({
    data: poemLikeData,
    skipDuplicates: true,
  })

  const reportResult = await prisma.report.createMany({
    data: reportData,
    skipDuplicates: true,
  })

  if (
    [
      poemTypeResult,
      tagResult,
      userResult,
      poemResult,
      poemLikeResult,
      reportResult,
    ].every((result) => result.count === 0)
  ) {
    // DB already contains all the seed data
    console.log(
      'Seed complete. No changes were made as the database is already up to date!'
    )
  } else {
    // Dispaly the number of additions to each table
    console.log(
      `Seed complete. Added:
    - ${poemTypeResult.count} poem types 
    - ${tagResult.count} poem tags
    - ${userResult.count} users
    - ${poemResult.count} poems
    - ${poemLikeResult.count} poem likes
    - ${reportResult.count} reports`
    )
  }
}

main()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })

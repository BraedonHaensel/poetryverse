const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg')
const { userData } = require('./seeding-data/user')
const { poemData } = require('./seeding-data/poem')
const { poemLikeData } = require('./seeding-data/poemLike')
const { reportData } = require('./seeding-data/report')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

/**
 * Seeds the database tables with sample data
 */
async function main() {
  const poemTypeResult = await prisma.poemType.createMany({
    data: poemTypes,
    skipDuplicates: true,
  })

  const tagResult = await prisma.tag.createMany({
    data: tags,
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
    - ${tagResult.count} tags
    - ${userResult.count} users
    - ${poemResult.count} poems
    - ${poemLikeResult.count} poemLikes
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

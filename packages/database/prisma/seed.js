import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { userData } from './seeding-data/user.js'
import { poemData } from './seeding-data/poem.js'
import { poemLikeData } from './seeding-data/poemLike.js'
import { reportData } from './seeding-data/report.js'
import { poemTypeData } from './seeding-data/poemType.js'
import { tagData } from './seeding-data/tag.js'
import { poemTagData } from './poemTag.js'

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
    data: tagData,
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

  const poemTagResult = await prisma.poemTag.createMany({
    data: poemTagData,
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
      poemTagResult,
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
    - ${poemTagResult.count} poem tag relationships
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

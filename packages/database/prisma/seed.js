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

const poemTypes = [
  { id: 'haiku', name: 'Haiku' },
  { id: 'couplet', name: 'Couplet' },
  { id: 'sonnet', name: 'Sonnet' },
]

const tags = [
  { id: 'nature', name: 'Nature' },
  { id: 'romance', name: 'Romance' },
  { id: 'comedy', name: 'Comedy' },
  { id: 'parody', name: 'Parody' },
]

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
    skipDuplicates: true
  })

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

main()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })

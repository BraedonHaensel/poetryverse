const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const poemTypes = [
  { id: 'haiku', name: 'Haiku' },
  { id: 'couplet', name: 'Couplet' },
  { id: 'sonnet', name: 'Sonnet' },
]

const tags = ['Nature', 'Romance', 'Comedy', 'Parody']

async function main() {
  const poemTypeResult = await prisma.poemType.createMany({
    data: poemTypes,
    skipDuplicates: true,
  })

  const tagResult = await prisma.tag.createMany({
    data: tags.map((name) => ({ name })),
    skipDuplicates: true,
  })

  console.log(
    `Seed complete. Added ${poemTypeResult.count} poem types and ${tagResult.count} tags.`
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

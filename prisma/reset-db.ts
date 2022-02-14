import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * This function will drop the 'public' schema and will recreate it.
 * This is useful for development and testing purposes.
 * Only works in Postgres.
 */
async function resetDatabase() {
  await prisma.$queryRaw`
    DROP SCHEMA public CASCADE;    
  `

  await prisma.$queryRaw`
    CREATE SCHEMA public;
  `
}

resetDatabase()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

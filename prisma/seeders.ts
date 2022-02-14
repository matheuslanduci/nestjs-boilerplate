import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function seedDatabase() {
  for (let i = 0; i < 10; i++) {
    await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: await hash('password', 10)
      }
    })
  }
}

seedDatabase()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

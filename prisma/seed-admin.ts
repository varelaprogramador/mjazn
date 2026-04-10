/**
 * Cria o usuário admin inicial para o Better Auth.
 * Rode uma vez: npx tsx prisma/seed-admin.ts
 */
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { admin } from 'better-auth/plugins'
import { config } from 'dotenv'

config({ path: '.env.local' })

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: { enabled: true },
  plugins: [admin()],
})

async function main() {
  const email = process.env.ADMIN_EMAIL ?? 'admin@regiaonorte.com'
  const password = process.env.ADMIN_PASSWORD ?? 'RegNorte2025!'
  const name = 'Admin'

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.log(`Admin já existe: ${email}`)
    await prisma.$disconnect()
    return
  }

  await auth.api.signUpEmail({
    body: { email, password, name },
  })

  // Promove para admin
  await prisma.user.update({
    where: { email },
    data: { role: 'admin' },
  })

  console.log(`✅ Admin criado: ${email}`)
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

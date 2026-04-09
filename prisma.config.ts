import { config } from 'dotenv'
// Carrega .env.local antes do defineConfig ler process.env
config({ path: '.env.local' })

import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env['DATABASE_URL']!,
    directUrl: process.env['DIRECT_URL']!,
  },
})

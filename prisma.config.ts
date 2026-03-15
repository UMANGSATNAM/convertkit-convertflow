import { defineConfig } from '@prisma/config'

export default defineConfig({
  earlyAccess: true,
  schema: {
    options: {
      datasource: {
        url: process.env.DATABASE_URL,
      },
    },
  },
})

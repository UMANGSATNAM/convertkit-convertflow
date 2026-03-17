import path from 'node:path';
import { defineConfig } from '@prisma/config';

try {
  process.loadEnvFile();
} catch (e) {
  // .env file might not exist in Docker build, ignore
}

export default defineConfig({
  schema: path.join(import.meta.dirname, 'prisma', 'schema.prisma'),
  engine: 'classic',
  datasource: {
    // At Docker build time DATABASE_URL may not exist yet.
    // prisma generate doesn't connect — it only generates client code —
    // so a mysql:// placeholder is safe here. At runtime the real
    // Railway DATABASE_URL will always be present.
    url: process.env.DATABASE_URL || 'mysql://build:build@localhost:3306/build',
  },
});

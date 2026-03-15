import { PrismaConfig } from '@prisma/config';

export default {
  schema: {
    kind: 'single',
    filePath: 'prisma/schema.prisma',
  },
  earlyAccess: true,
} satisfies PrismaConfig;

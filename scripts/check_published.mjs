import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const statuses = await prisma.componentRegistry.groupBy({
    by: ['status'],
    _count: { _all: true }
  });
  console.log('Statuses in DB:', statuses);
  await prisma.$disconnect();
}

check().catch(console.error);

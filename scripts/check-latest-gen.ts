import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const latest = await prisma.storeGeneration.findFirst({
    orderBy: { createdAt: 'desc' }
  });
  console.log("Latest Generation:", latest);
}
main().catch(console.error).finally(() => prisma.$disconnect());

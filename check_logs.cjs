const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const gens = await prisma.storeGeneration.findMany({
    orderBy: { createdAt: 'desc' },
    take: 1
  });

  console.log(JSON.stringify(gens, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

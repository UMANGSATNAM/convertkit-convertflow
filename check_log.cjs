const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const gen = await prisma.storeGeneration.findFirst({
    orderBy: { createdAt: 'desc' }
  });
  console.log(JSON.stringify(gen.log, null, 2));
  console.log('STATUS:', gen.status);
  console.log('ERROR:', gen.error);
}
main().catch(console.error).finally(() => prisma.$disconnect());

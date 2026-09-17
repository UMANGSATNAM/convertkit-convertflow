import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const version2 = await prisma.componentRegistry.findMany({
    where: { version: '2' },
    select: { id: true, componentId: true, category: true, liquidPath: true, status: true }
  });
  console.log(`Version 2 count: ${version2.length}`);
  console.log('Sample version 2:', version2.slice(0, 5));

  const allMarquees = await prisma.componentRegistry.findMany({
    where: { liquidPath: { contains: 'marquee' } },
    select: { id: true, componentId: true, category: true, liquidPath: true, status: true }
  });
  console.log('All marquees:', allMarquees);

  await prisma.$disconnect();
}

check().catch(console.error);

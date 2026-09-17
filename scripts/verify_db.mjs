import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function verify() {
  // 1. Count by status
  const published = await prisma.componentRegistry.count({ where: { status: 'PUBLISHED' } });
  const archived = await prisma.componentRegistry.count({ where: { status: 'ARCHIVED' } });
  const total = await prisma.componentRegistry.count();
  console.log(`\n=== DB STATUS RIGHT NOW ===`);
  console.log(`Total records: ${total}`);
  console.log(`PUBLISHED: ${published}`);
  console.log(`ARCHIVED: ${archived}`);

  // 2. List ALL published records
  const allPublished = await prisma.componentRegistry.findMany({
    where: { status: 'PUBLISHED' },
    select: { componentId: true, category: true, sectionType: true },
    orderBy: { category: 'asc' }
  });
  console.log(`\n=== ALL PUBLISHED SECTIONS ===`);
  for (const p of allPublished) {
    console.log(`  [${p.category}] ${p.componentId} (type: ${p.sectionType})`);
  }

  // 3. Check if ANY old legacy section is still PUBLISHED
  const legacyCheck = await prisma.componentRegistry.findMany({
    where: {
      status: 'PUBLISHED',
      componentId: { contains: 'caratlane' }
    }
  });
  console.log(`\n=== CARATLANE CHECK ===`);
  console.log(`CaratLane sections still PUBLISHED: ${legacyCheck.length}`);

  const heroCheck = await prisma.componentRegistry.findMany({
    where: {
      status: 'PUBLISHED',
      category: 'hero'
    },
    select: { componentId: true }
  });
  console.log(`\n=== HERO CATEGORY ===`);
  console.log(`Hero sections PUBLISHED: ${heroCheck.length}`);
  for (const h of heroCheck) {
    console.log(`  - ${h.componentId}`);
  }

  await prisma.$disconnect();
}

verify().catch(console.error);

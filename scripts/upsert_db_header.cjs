const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.componentRegistry.upsert({
    where: { componentId: 'header-tech-v1' },
    update: {
      sectionType: 'header',
      family: 'Tech',
      status: 'PUBLISHED',
      liquidPath: 'components/header/header-tech-v1.liquid',
      category: 'headers-footers',
      industryTags: ['tech', 'gadgets'],
      styleTags: ['minimal', 'cyber']
    },
    create: {
      componentId: 'header-tech-v1',
      sectionType: 'header',
      family: 'Tech',
      status: 'PUBLISHED',
      liquidPath: 'components/header/header-tech-v1.liquid',
      category: 'headers-footers',
      industryTags: ['tech', 'gadgets'],
      styleTags: ['minimal', 'cyber'],
      version: '1'
    }
  });
  console.log('Upserted header-tech-v1 in Prisma DB');
}

main().catch(console.error).finally(() => prisma.$disconnect());

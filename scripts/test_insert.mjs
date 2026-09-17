import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function testInsert() {
  try {
    const res = await prisma.componentRegistry.create({
      data: {
        componentId: 'announcement-marquee',
        category: 'announcement',
        sectionType: 'announcement-marquee',
        liquidPath: 'components/announcement/announcement-marquee.liquid',
        family: 'Announcement Bars',
        visualStyle: 'marquee-ticker',
        industryTags: ['all', 'retail', 'fashion'],
        styleTags: ['modern', 'marquee', 'infinite-scroll'],
        croScore: 95.0,
        mobileScore: 98.0,
        status: 'PUBLISHED',
        isUniversal: true,
        version: '2'
      }
    });
    console.log('Successfully inserted announcement-marquee:', res);
  } catch (err) {
    console.error('Insert error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

testInsert();

// Seed luxury jewellery sections into ComponentRegistry (using correct schema fields)
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const luxurySections = [
  {
    componentId: 'global_luxury_styles',
    category: 'global',
    industryTags: ['jewelry', 'luxury', 'fashion', 'beauty', 'accessories'],
    styleTags: ['luxury', 'editorial', 'dark', 'minimal', 'premium'],
    searchKeywords: ['global', 'fonts', 'animations', 'design system', 'css variables'],
    croScore: 100.0,
    mobileScore: 100.0,
    version: '1.0.0',
    liquidPath: 'theme-template/sections/global_luxury_styles.liquid',
    status: 'PUBLISHED',
  },
  {
    componentId: 'hero_luxury_editorial',
    category: 'hero',
    industryTags: ['jewelry', 'luxury', 'fashion', 'accessories', 'beauty'],
    styleTags: ['luxury', 'editorial', 'dark', 'premium', 'bold'],
    searchKeywords: ['hero', 'fullscreen', 'parallax', 'video', 'animated', 'gold', 'jewellery'],
    croScore: 98.0,
    mobileScore: 96.0,
    version: '1.0.0',
    liquidPath: 'theme-template/sections/hero_luxury_editorial.liquid',
    status: 'PUBLISHED',
  },
  {
    componentId: 'grid_jewellery_showcase',
    category: 'product_grid',
    industryTags: ['jewelry', 'luxury', 'accessories', 'fashion'],
    styleTags: ['luxury', 'editorial', 'dark', 'premium'],
    searchKeywords: ['product grid', 'jewellery', 'hover', 'quick-add', 'dark', 'gold', 'jewelry'],
    croScore: 97.0,
    mobileScore: 95.0,
    version: '1.0.0',
    liquidPath: 'theme-template/sections/grid_jewellery_showcase.liquid',
    status: 'PUBLISHED',
  },
  {
    componentId: 'testimonials_luxury_marquee',
    category: 'testimonials',
    industryTags: ['jewelry', 'luxury', 'fashion', 'beauty', 'accessories'],
    styleTags: ['luxury', 'editorial', 'dark', 'premium', 'minimal'],
    searchKeywords: ['testimonials', 'marquee', 'reviews', 'dark', 'animated', 'jewellery'],
    croScore: 96.0,
    mobileScore: 95.0,
    version: '1.0.0',
    liquidPath: 'theme-template/sections/testimonials_luxury_marquee.liquid',
    status: 'PUBLISHED',
  },
  {
    componentId: 'trust_luxury_pillars',
    category: 'trust',
    industryTags: ['jewelry', 'luxury', 'fashion', 'accessories', 'beauty'],
    styleTags: ['luxury', 'editorial', 'dark', 'premium'],
    searchKeywords: ['trust', 'badges', 'hallmark', 'bis', 'icons', 'dark', 'gold', 'jewellery'],
    croScore: 95.0,
    mobileScore: 97.0,
    version: '1.0.0',
    liquidPath: 'theme-template/sections/trust_luxury_pillars.liquid',
    status: 'PUBLISHED',
  },
  {
    componentId: 'footer_luxury_mega',
    category: 'footer',
    industryTags: ['jewelry', 'luxury', 'fashion', 'accessories', 'beauty'],
    styleTags: ['luxury', 'editorial', 'dark', 'premium'],
    searchKeywords: ['footer', 'mega', 'newsletter', 'social', 'dark', 'gold', 'jewellery'],
    croScore: 95.0,
    mobileScore: 94.0,
    version: '1.0.0',
    liquidPath: 'theme-template/sections/footer_luxury_mega.liquid',
    status: 'PUBLISHED',
  },
];

async function main() {
  console.log('🔶 Seeding luxury jewellery D2C sections...\n');

  for (const section of luxurySections) {
    const result = await prisma.componentRegistry.upsert({
      where: { componentId: section.componentId },
      update: {
        category: section.category,
        industryTags: section.industryTags,
        styleTags: section.styleTags,
        searchKeywords: section.searchKeywords,
        croScore: section.croScore,
        mobileScore: section.mobileScore,
        version: section.version,
        liquidPath: section.liquidPath,
        status: section.status,
      },
      create: {
        componentId: section.componentId,
        category: section.category,
        industryTags: section.industryTags,
        styleTags: section.styleTags,
        searchKeywords: section.searchKeywords,
        croScore: section.croScore,
        mobileScore: section.mobileScore,
        version: section.version,
        liquidPath: section.liquidPath,
        status: section.status,
      },
    });
    console.log(`✅  ${result.componentId} [${result.category}] — PUBLISHED`);
  }

  const total = await prisma.componentRegistry.count({ where: { status: 'PUBLISHED' } });
  console.log(`\n✨ Done! Total PUBLISHED sections in DB: ${total}`);
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());

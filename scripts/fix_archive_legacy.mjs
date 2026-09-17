import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const ACTIVE_37_IDS = [
  // 1. Announcement (2)
  'announcement-marquee',
  'announcement-countdown',

  // 2. Hero (5)
  'hero-split-luxury',
  'hero-editorial-brand',
  'hero-high-conversion',
  'hero-video-poster',
  'hero-minimal-clean',

  // 3. PDP & Sticky ATC (5)
  'pdp-sticky-atc',
  'pdp-trust-tabs',
  'pdp-stock-urgency',
  'pdp-swatch-gallery',
  'pdp-bundle-fbt',

  // 4. Offer & Poster (5)
  'offer-bento-grid',
  'offer-coupon-strip',
  'offer-dual-poster',
  'offer-countdown-sale',
  'offer-discount-ribbon',

  // 5. Categories (5)
  'category-story-bubbles',
  'category-bento-cards',
  'category-minimal-tiles',
  'category-masonry-lookbook',
  'category-slider-rail',

  // 6. Product Cards (5)
  'product-card-quickadd',
  'product-card-swatches',
  'product-card-trust',
  'product-card-badge-sale',
  'product-card-minimal',

  // 7. Headers (5)
  'header-megamenu',
  'header-centered-brand',
  'header-sticky-glass',
  'header-minimal-inline',
  'header-promo-embedded',

  // 8. Footers (5)
  'footer-multi-column',
  'footer-newsletter-focus',
  'footer-minimal-centered',
  'footer-trust-badges',
  'footer-ecommerce-app'
];

async function main() {
  console.log(`Verifying active 37 IDs... Target count: ${ACTIVE_37_IDS.length}`);

  // Step 1: Check how many of the 37 exist
  const existing37 = await prisma.componentRegistry.findMany({
    where: { componentId: { in: ACTIVE_37_IDS } }
  });
  console.log(`Found ${existing37.length} of 37 in DB.`);

  // Step 2: Set ALL components NOT in the 37 list to ARCHIVED
  const archiveResult = await prisma.componentRegistry.updateMany({
    where: {
      componentId: { notIn: ACTIVE_37_IDS }
    },
    data: {
      status: 'ARCHIVED'
    }
  });
  console.log(`Archived ${archiveResult.count} legacy components.`);

  // Step 3: Set ALL 37 to PUBLISHED
  const publishResult = await prisma.componentRegistry.updateMany({
    where: {
      componentId: { in: ACTIVE_37_IDS }
    },
    data: {
      status: 'PUBLISHED'
    }
  });
  console.log(`Set ${publishResult.count} components to PUBLISHED.`);

  // Step 4: Verification
  const publishedCount = await prisma.componentRegistry.count({
    where: { status: 'PUBLISHED' }
  });
  const archivedCount = await prisma.componentRegistry.count({
    where: { status: 'ARCHIVED' }
  });

  console.log(`\nFinal Verification:`);
  console.log(`- PUBLISHED count: ${publishedCount} (MUST BE EXACTLY 37)`);
  console.log(`- ARCHIVED count: ${archivedCount}`);

  const byCat = await prisma.componentRegistry.groupBy({
    by: ['category'],
    where: { status: 'PUBLISHED' },
    _count: { _all: true }
  });
  console.log('\nPublished breakdown by category:');
  console.log(byCat);

  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});

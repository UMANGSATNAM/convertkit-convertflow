import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// ── THE 37 EXACT COMPONENT IDs WE WANT ──
const KEEP_IDS = [
  'announcement-marquee',
  'announcement-bar-promo',
  'hero-fullscreen-parallax',
  'hero-split-lifestyle',
  'hero-video-autoplay',
  'hero-gradient-text',
  'hero-carousel-multi',
  'pdp-sticky-atc-bar',
  'pdp-image-zoom-gallery',
  'pdp-bundled-offer',
  'pdp-size-guide-modal',
  'pdp-before-after-slider',
  'offer-countdown-banner',
  'offer-bogo-strip',
  'offer-seasonal-poster',
  'offer-flash-sale-grid',
  'offer-loyalty-points-bar',
  'category-grid-hover',
  'category-carousel-icon',
  'category-tab-filter',
  'category-masonry-lookbook',
  'category-mega-dropdown',
  'product-card-quick-view',
  'product-card-swipe-gallery',
  'product-card-compare-stack',
  'product-card-wishlist-heart',
  'product-card-rating-badge',
  'header-mega-nav',
  'header-sticky-scroll',
  'header-transparent-hero',
  'header-mobile-drawer',
  'header-announcement-combo',
  'footer-newsletter-social',
  'footer-mega-links',
  'footer-minimal-brand',
  'footer-accordion-mobile',
  'footer-trust-badges',
];

async function nukeAndRebuild() {
  console.log('=== STEP 1: ARCHIVE *EVERYTHING* IN THE TABLE ===');
  const archiveResult = await prisma.componentRegistry.updateMany({
    data: { status: 'ARCHIVED' },
  });
  console.log(`Archived ALL: ${archiveResult.count} records`);

  // Verify
  const publishedAfterArchive = await prisma.componentRegistry.count({ where: { status: 'PUBLISHED' } });
  console.log(`PUBLISHED after archiving all: ${publishedAfterArchive}`);
  if (publishedAfterArchive !== 0) {
    console.error('ERROR: Still have PUBLISHED records after archiving all!');
    await prisma.$disconnect();
    process.exit(1);
  }

  console.log('\n=== STEP 2: CHECK WHICH OF OUR 37 EXIST ===');
  const existing = await prisma.componentRegistry.findMany({
    where: { componentId: { in: KEEP_IDS } },
    select: { componentId: true, id: true },
  });
  const existingIds = existing.map(e => e.componentId);
  console.log(`Found ${existing.length} of 37 in DB`);

  // Un-archive existing ones
  if (existing.length > 0) {
    console.log('\n=== STEP 3: UN-ARCHIVE EXISTING 37 ===');
    const unarchive = await prisma.componentRegistry.updateMany({
      where: { componentId: { in: KEEP_IDS } },
      data: { status: 'PUBLISHED' },
    });
    console.log(`Un-archived: ${unarchive.count}`);
  }

  // Find missing ones
  const missing = KEEP_IDS.filter(id => !existingIds.includes(id));
  if (missing.length > 0) {
    console.log(`\n=== STEP 4: CREATE ${missing.length} MISSING SECTIONS ===`);
    for (const id of missing) {
      const meta = getSectionMeta(id);
      await prisma.componentRegistry.create({
        data: {
          componentId: id,
          family: meta.family,
          category: meta.category,
          sectionType: meta.sectionType,
          visualStyle: meta.visualStyle,
          liquidPath: `sections/${id}.liquid`,
          status: 'PUBLISHED',
          industryTags: [],
          styleTags: [],
          archetypes: [],
          compatibleSlots: [],
        },
      });
      console.log(`  Created: ${id}`);
    }
  }

  console.log('\n=== FINAL VERIFICATION ===');
  const finalPublished = await prisma.componentRegistry.count({ where: { status: 'PUBLISHED' } });
  const finalArchived = await prisma.componentRegistry.count({ where: { status: 'ARCHIVED' } });
  const finalTotal = await prisma.componentRegistry.count();
  console.log(`Total: ${finalTotal}`);
  console.log(`PUBLISHED: ${finalPublished}`);
  console.log(`ARCHIVED: ${finalArchived}`);

  if (finalPublished === 37) {
    console.log('\n✅ SUCCESS: Exactly 37 sections are PUBLISHED');
  } else {
    console.error(`\n❌ MISMATCH: Expected 37 PUBLISHED, got ${finalPublished}`);
  }

  // List all published
  const allPub = await prisma.componentRegistry.findMany({
    where: { status: 'PUBLISHED' },
    select: { componentId: true, category: true },
    orderBy: { category: 'asc' },
  });
  console.log('\nAll PUBLISHED:');
  for (const p of allPub) {
    console.log(`  [${p.category}] ${p.componentId}`);
  }

  await prisma.$disconnect();
}

function getSectionMeta(id) {
  const map = {
    'announcement-marquee':       { family: 'announcement', category: 'announcement', sectionType: 'announcement-bar', visualStyle: 'marquee-scroll' },
    'announcement-bar-promo':     { family: 'announcement', category: 'announcement', sectionType: 'announcement-bar', visualStyle: 'promo-highlight' },
    'hero-fullscreen-parallax':   { family: 'hero', category: 'hero', sectionType: 'hero-banner', visualStyle: 'fullscreen-parallax' },
    'hero-split-lifestyle':       { family: 'hero', category: 'hero', sectionType: 'hero-banner', visualStyle: 'split-lifestyle' },
    'hero-video-autoplay':        { family: 'hero', category: 'hero', sectionType: 'hero-banner', visualStyle: 'video-autoplay' },
    'hero-gradient-text':         { family: 'hero', category: 'hero', sectionType: 'hero-banner', visualStyle: 'gradient-text' },
    'hero-carousel-multi':        { family: 'hero', category: 'hero', sectionType: 'hero-banner', visualStyle: 'carousel-multi' },
    'pdp-sticky-atc-bar':         { family: 'pdp', category: 'product-page', sectionType: 'pdp', visualStyle: 'sticky-atc' },
    'pdp-image-zoom-gallery':     { family: 'pdp', category: 'product-page', sectionType: 'pdp', visualStyle: 'image-zoom' },
    'pdp-bundled-offer':          { family: 'pdp', category: 'product-page', sectionType: 'pdp', visualStyle: 'bundled-offer' },
    'pdp-size-guide-modal':       { family: 'pdp', category: 'product-page', sectionType: 'pdp', visualStyle: 'size-guide' },
    'pdp-before-after-slider':    { family: 'pdp', category: 'product-page', sectionType: 'pdp', visualStyle: 'before-after' },
    'offer-countdown-banner':     { family: 'offer', category: 'offer', sectionType: 'offer-banner', visualStyle: 'countdown' },
    'offer-bogo-strip':           { family: 'offer', category: 'offer', sectionType: 'offer-banner', visualStyle: 'bogo-strip' },
    'offer-seasonal-poster':      { family: 'offer', category: 'offer', sectionType: 'offer-banner', visualStyle: 'seasonal-poster' },
    'offer-flash-sale-grid':      { family: 'offer', category: 'offer', sectionType: 'offer-banner', visualStyle: 'flash-sale' },
    'offer-loyalty-points-bar':   { family: 'offer', category: 'offer', sectionType: 'offer-banner', visualStyle: 'loyalty-points' },
    'category-grid-hover':        { family: 'categories', category: 'categories', sectionType: 'category-grid', visualStyle: 'hover-reveal' },
    'category-carousel-icon':     { family: 'categories', category: 'categories', sectionType: 'category-grid', visualStyle: 'carousel-icon' },
    'category-tab-filter':        { family: 'categories', category: 'categories', sectionType: 'category-grid', visualStyle: 'tab-filter' },
    'category-masonry-lookbook':  { family: 'categories', category: 'categories', sectionType: 'category-grid', visualStyle: 'masonry-lookbook' },
    'category-mega-dropdown':     { family: 'categories', category: 'categories', sectionType: 'category-grid', visualStyle: 'mega-dropdown' },
    'product-card-quick-view':    { family: 'product-card', category: 'product-card', sectionType: 'product-card', visualStyle: 'quick-view' },
    'product-card-swipe-gallery': { family: 'product-card', category: 'product-card', sectionType: 'product-card', visualStyle: 'swipe-gallery' },
    'product-card-compare-stack': { family: 'product-card', category: 'product-card', sectionType: 'product-card', visualStyle: 'compare-stack' },
    'product-card-wishlist-heart': { family: 'product-card', category: 'product-card', sectionType: 'product-card', visualStyle: 'wishlist-heart' },
    'product-card-rating-badge':  { family: 'product-card', category: 'product-card', sectionType: 'product-card', visualStyle: 'rating-badge' },
    'header-mega-nav':            { family: 'header', category: 'header', sectionType: 'header', visualStyle: 'mega-nav' },
    'header-sticky-scroll':       { family: 'header', category: 'header', sectionType: 'header', visualStyle: 'sticky-scroll' },
    'header-transparent-hero':    { family: 'header', category: 'header', sectionType: 'header', visualStyle: 'transparent-hero' },
    'header-mobile-drawer':       { family: 'header', category: 'header', sectionType: 'header', visualStyle: 'mobile-drawer' },
    'header-announcement-combo':  { family: 'header', category: 'header', sectionType: 'header', visualStyle: 'announcement-combo' },
    'footer-newsletter-social':   { family: 'footer', category: 'footer', sectionType: 'footer', visualStyle: 'newsletter-social' },
    'footer-mega-links':          { family: 'footer', category: 'footer', sectionType: 'footer', visualStyle: 'mega-links' },
    'footer-minimal-brand':       { family: 'footer', category: 'footer', sectionType: 'footer', visualStyle: 'minimal-brand' },
    'footer-accordion-mobile':    { family: 'footer', category: 'footer', sectionType: 'footer', visualStyle: 'accordion-mobile' },
    'footer-trust-badges':        { family: 'footer', category: 'footer', sectionType: 'footer', visualStyle: 'trust-badges' },
  };
  return map[id] || { family: 'unknown', category: 'unknown', sectionType: 'unknown', visualStyle: 'unknown' };
}

nukeAndRebuild().catch(console.error);

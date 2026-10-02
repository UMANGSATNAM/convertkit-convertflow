import prisma from '../app/db.server';

async function seed() {
  const urgencyItems = [
    {
      componentId: 'urgency-flash-bar',
      category: 'urgency',
      sectionType: 'urgency',
      liquidPath: 'components/urgency/urgency-flash-bar.liquid',
      family: 'Urgency & Scarcity',
      visualStyle: 'countdown-bar',
      status: 'PUBLISHED',
      isUniversal: true,
      archetypes: JSON.stringify(['scarcity_booster', 'flash_sale', 'countdown']),
      industryTags: JSON.stringify(['universal', 'fashion', 'tech', 'beauty', 'dropshipping']),
      styleTags: JSON.stringify(['countdown', 'coupon', 'urgent'])
    },
    {
      componentId: 'urgency-stock-scarcity',
      category: 'urgency',
      sectionType: 'urgency',
      liquidPath: 'components/urgency/urgency-stock-scarcity.liquid',
      family: 'Urgency & Scarcity',
      visualStyle: 'stock-scarcity',
      status: 'PUBLISHED',
      isUniversal: true,
      archetypes: JSON.stringify(['stock_meter', 'scarcity', 'pdp_booster']),
      industryTags: JSON.stringify(['universal', 'fashion', 'tech', 'beauty', 'dropshipping']),
      styleTags: JSON.stringify(['stock-alert', 'viewers', 'fire-meter'])
    },
    {
      componentId: 'urgency-live-proof',
      category: 'urgency',
      sectionType: 'urgency',
      liquidPath: 'components/urgency/urgency-live-proof.liquid',
      family: 'Urgency & Scarcity',
      visualStyle: 'live-toast',
      status: 'PUBLISHED',
      isUniversal: true,
      archetypes: JSON.stringify(['social_proof', 'live_purchases', 'fomo']),
      industryTags: JSON.stringify(['universal', 'fashion', 'tech', 'beauty', 'dropshipping']),
      styleTags: JSON.stringify(['social-proof', 'recent-sales', 'verified'])
    },
    {
      componentId: 'urgency-cart-timer',
      category: 'urgency',
      sectionType: 'urgency',
      liquidPath: 'components/urgency/urgency-cart-timer.liquid',
      family: 'Urgency & Scarcity',
      visualStyle: 'cart-reservation',
      status: 'PUBLISHED',
      isUniversal: true,
      archetypes: JSON.stringify(['cart_reservation', 'scarcity', 'timer']),
      industryTags: JSON.stringify(['universal', 'fashion', 'tech', 'beauty', 'dropshipping']),
      styleTags: JSON.stringify(['cart-reserve', 'countdown', 'fomo'])
    },
    {
      componentId: 'urgency-sticky-atc',
      category: 'urgency',
      sectionType: 'urgency',
      liquidPath: 'components/urgency/urgency-sticky-atc.liquid',
      family: 'Urgency & Scarcity',
      visualStyle: 'sticky-atc-urgency',
      status: 'PUBLISHED',
      isUniversal: true,
      archetypes: JSON.stringify(['sticky_atc', 'bottom_bar', 'countdown']),
      industryTags: JSON.stringify(['universal', 'fashion', 'tech', 'beauty', 'dropshipping']),
      styleTags: JSON.stringify(['sticky-atc', 'countdown', 'quick-checkout'])
    }
  ];

  for (const item of urgencyItems) {
    const res = await prisma.componentRegistry.upsert({
      where: { componentId: item.componentId },
      update: item,
      create: item
    });
    console.log('Successfully upserted urgency section:', res.componentId);
  }

  // Also ensure category for all cart-drawers is set to 'cart-drawer'
  const cartDrawers = await prisma.componentRegistry.updateMany({
    where: { sectionType: 'cart-drawer' },
    data: { category: 'cart-drawer', status: 'PUBLISHED' }
  });
  console.log('Updated cart-drawers category count:', cartDrawers.count);

  // Also ensure category for all product-pages is set to 'product-page'
  const pdps = await prisma.componentRegistry.updateMany({
    where: { sectionType: 'product-page' },
    data: { category: 'product-page', status: 'PUBLISHED' }
  });
  console.log('Updated product-pages category count:', pdps.count);

  const totalUrgency = await prisma.componentRegistry.count({ where: { category: 'urgency' } });
  console.log('Total Urgency Sections in DB:', totalUrgency);
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

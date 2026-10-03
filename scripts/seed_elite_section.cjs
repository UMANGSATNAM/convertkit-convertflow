const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

const eliteComponents = [
  {
    componentId: 'elite-pdp-buybox',
    name: 'Elite Luxe PDP Buy Box',
    type: '1000cr-elite',
    category: '1000cr-elite',
    sectionType: 'product-page',
    liquidPath: 'components/product-page/elite-pdp-buybox.liquid',
    filePath: 'components/product-page/elite-pdp-buybox.liquid',
    metaPath: 'components/product-page/elite-pdp-buybox.meta.json',
    visualStyle: 'minimalist-luxury',
    family: '1000cr Elite Luxury',
    archetypes: ['luxury', 'editorial', 'high-cro', 'scarcity', 'flagship'],
    compatibleSlots: [],
    status: 'PUBLISHED',
    version: '1',
    designDirection: 'minimalist-luxury',
    layoutVariant: 'sticky-gallery-buybox',
    isUniversal: true,
    industryTags: ['fashion', 'apparel', 'beauty', 'jewelry', 'luxury'],
    styleTags: ['clean', 'slate', 'emerald', 'swatches', 'pincode', 'cod', 'urgency', 'sticky-atc'],
    searchKeywords: ['1000cr', 'elite', 'pdp', 'buy box', 'product page', 'luxury', 'cod', 'pincode'],
    croScore: 99.5,
    mobileScore: 99.0,
    performanceScore: 99.0
  },
  {
    componentId: 'atelier-luxe-pdp',
    name: 'Atelier Luxe PDP Buy Box',
    type: '1000cr-elite',
    category: '1000cr-elite',
    sectionType: 'product-page',
    liquidPath: 'components/product-page/atelier-luxe-pdp.liquid',
    filePath: 'components/product-page/atelier-luxe-pdp.liquid',
    metaPath: 'components/product-page/atelier-luxe-pdp.meta.json',
    visualStyle: 'minimalist-luxury',
    family: '1000cr Elite Luxury',
    archetypes: ['fashion', 'apparel', 'couture', 'high-cro', 'bundles'],
    compatibleSlots: [],
    status: 'PUBLISHED',
    version: '1',
    designDirection: 'minimalist-luxury',
    layoutVariant: 'sticky-editorial-breaks',
    isUniversal: true,
    industryTags: ['fashion', 'apparel', 'clothing', 'couture', 'accessories', 'luxury-wear'],
    styleTags: ['clean', 'sand-gold', 'quantity-breaks', 'fit-guide', 'pincode', 'cod', 'sticky-atc'],
    searchKeywords: ['1000cr', 'atelier', 'luxe', 'pdp', 'buy box', 'product page', 'fashion', 'bundles', 'cod', 'pincode'],
    croScore: 99.6,
    mobileScore: 99.2,
    performanceScore: 99.1
  },
  {
    componentId: 'clinical-pro-pdp',
    name: 'Clinical Pro PDP Buy Box',
    type: '1000cr-elite',
    category: '1000cr-elite',
    sectionType: 'product-page',
    liquidPath: 'components/product-page/clinical-pro-pdp.liquid',
    filePath: 'components/product-page/clinical-pro-pdp.liquid',
    metaPath: 'components/product-page/clinical-pro-pdp.meta.json',
    visualStyle: 'minimalist-luxury',
    family: '1000cr Elite Luxury',
    archetypes: ['beauty', 'clinical', 'skincare', 'high-cro', 'subscription'],
    compatibleSlots: [],
    status: 'PUBLISHED',
    version: '1',
    designDirection: 'minimalist-luxury',
    layoutVariant: 'clinical-trial-subscribe',
    isUniversal: true,
    industryTags: ['beauty', 'skincare', 'cosmetics', 'clinical', 'wellness', 'serum'],
    styleTags: ['clean', 'slate', 'emerald-accent', 'subscribe-save', 'clinical-trial', 'pincode', 'cod', 'sticky-atc'],
    searchKeywords: ['1000cr', 'clinical', 'pro', 'pdp', 'buy box', 'product page', 'skincare', 'subscription', 'cod', 'pincode'],
    croScore: 99.7,
    mobileScore: 99.4,
    performanceScore: 99.0
  },
  {
    componentId: 'titan-vault-pdp',
    name: 'Titan Vault PDP Buy Box',
    type: '1000cr-elite',
    category: '1000cr-elite',
    sectionType: 'product-page',
    liquidPath: 'components/product-page/titan-vault-pdp.liquid',
    filePath: 'components/product-page/titan-vault-pdp.liquid',
    metaPath: 'components/product-page/titan-vault-pdp.meta.json',
    visualStyle: 'minimalist-luxury',
    family: '1000cr Elite Luxury',
    archetypes: ['electronics', 'smart-hardware', 'gadgets', 'high-cro', 'urgency'],
    compatibleSlots: [],
    status: 'PUBLISHED',
    version: '1',
    designDirection: 'minimalist-luxury',
    layoutVariant: 'hardware-specs-urgency',
    isUniversal: true,
    industryTags: ['electronics', 'audio', 'gadgets', 'tech', 'hardware', 'luxury-tech'],
    styleTags: ['clean', 'titanium', 'electric-cyan', 'countdown-timer', 'specs-grid', 'shield-care', 'pincode', 'cod', 'sticky-atc'],
    searchKeywords: ['1000cr', 'titan', 'vault', 'pdp', 'buy box', 'product page', 'electronics', 'gadgets', 'audio', 'countdown', 'cod', 'pincode'],
    croScore: 99.8,
    mobileScore: 99.5,
    performanceScore: 99.2
  }
];

async function main() {
  console.log("Adding all 4 1000cr PDP Buy Boxes to Registry & Database...");

  const registryPath = path.join(__dirname, '..', 'app', 'data', 'templates', 'theme-engine', 'registry.json');
  const registryRaw = fs.readFileSync(registryPath, 'utf8');
  const registry = JSON.parse(registryRaw);

  for (let i = eliteComponents.length - 1; i >= 0; i--) {
    const comp = eliteComponents[i];
    const existingIdx = registry.components.findIndex(c => c.componentId === comp.componentId);
    if (existingIdx >= 0) {
      registry.components[existingIdx] = comp;
    } else {
      registry.components.unshift(comp);
    }
  }

  const updatedRaw = JSON.stringify(registry, null, 2);
  fs.writeFileSync(registryPath, updatedRaw, 'utf8');
  console.log("Updated registry.json with all 4 PDP buy boxes at positions 0-3.");

  // Update hash in registryMeta
  const canonicalRaw = updatedRaw.replace(/\r\n/g, "\n");
  const registryHash = crypto.createHash('sha256').update(canonicalRaw).digest('hex');
  await prisma.registryMeta.upsert({
    where: { id: "singleton" },
    update: { registryHash, seededAt: new Date() },
    create: { id: "singleton", registryHash, seededAt: new Date() }
  });

  // Upsert into ComponentRegistry table
  for (const comp of eliteComponents) {
    const dbData = {
      componentId: comp.componentId,
      category: comp.category,
      niche: comp.archetypes[0] || 'luxury',
      sectionType: comp.sectionType,
      filePath: comp.filePath,
      liquidPath: comp.liquidPath,
      metaPath: comp.metaPath,
      family: comp.family,
      archetypes: comp.archetypes,
      visualStyle: comp.visualStyle,
      compatibleSlots: comp.compatibleSlots,
      industryTags: comp.industryTags,
      styleTags: comp.styleTags,
      searchKeywords: comp.searchKeywords,
      croScore: comp.croScore,
      mobileScore: comp.mobileScore,
      version: comp.version,
      status: comp.status,
      isUniversal: true,
      performanceScore: comp.performanceScore
    };

    const record = await prisma.componentRegistry.upsert({
      where: { componentId: comp.componentId },
      update: dbData,
      create: dbData
    });
    console.log("Seeded:", record.componentId, "->", comp.name);
  }

  console.log("All 4 PDP buy box components registered successfully!");
}

main()
  .catch(err => {
    console.error("Error seeding elite sections:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

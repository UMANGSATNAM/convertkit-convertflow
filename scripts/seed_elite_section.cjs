const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function main() {
  console.log("Adding 1000cr Section #1 (elite-pdp-buybox) to Registry & Database...");

  const registryPath = path.join(__dirname, '..', 'app', 'data', 'templates', 'theme-engine', 'registry.json');
  const registryRaw = fs.readFileSync(registryPath, 'utf8');
  const registry = JSON.parse(registryRaw);

  const eliteComponent = {
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
  };

  // 1. Add to registry.json if not present or update
  const existingIdx = registry.components.findIndex(c => c.componentId === 'elite-pdp-buybox');
  if (existingIdx >= 0) {
    registry.components[existingIdx] = eliteComponent;
  } else {
    // Add right at the very beginning of the components array so it has top prominence!
    registry.components.unshift(eliteComponent);
  }

  const updatedRaw = JSON.stringify(registry, null, 2);
  fs.writeFileSync(registryPath, updatedRaw, 'utf8');
  console.log("Updated registry.json with elite-pdp-buybox at position 0.");

  // Update hash in registryMeta
  const canonicalRaw = updatedRaw.replace(/\r\n/g, "\n");
  const registryHash = crypto.createHash('sha256').update(canonicalRaw).digest('hex');
  await prisma.registryMeta.upsert({
    where: { id: "singleton" },
    update: { registryHash, seededAt: new Date() },
    create: { id: "singleton", registryHash, seededAt: new Date() }
  });

  // 2. Upsert into ComponentRegistry table
  const dbData = {
    componentId: eliteComponent.componentId,
    category: eliteComponent.category,
    niche: 'luxury',
    sectionType: eliteComponent.sectionType,
    filePath: eliteComponent.filePath,
    liquidPath: eliteComponent.liquidPath,
    metaPath: eliteComponent.metaPath,
    family: eliteComponent.family,
    archetypes: eliteComponent.archetypes,
    visualStyle: eliteComponent.visualStyle,
    compatibleSlots: eliteComponent.compatibleSlots,
    industryTags: eliteComponent.industryTags,
    styleTags: eliteComponent.styleTags,
    searchKeywords: eliteComponent.searchKeywords,
    croScore: eliteComponent.croScore,
    mobileScore: eliteComponent.mobileScore,
    version: eliteComponent.version,
    status: eliteComponent.status,
    isUniversal: true,
    performanceScore: eliteComponent.performanceScore
  };

  const record = await prisma.componentRegistry.upsert({
    where: { componentId: 'elite-pdp-buybox' },
    update: dbData,
    create: dbData
  });

  console.log("Successfully seeded ComponentRegistry record:", record.componentId, "Category:", record.category);
}

main()
  .catch(err => {
    console.error("Error seeding elite section:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

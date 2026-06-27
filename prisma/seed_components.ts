import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding ComponentRegistry for Design Systems V2...");

  // Load the new registry.json
  const registryPath = path.join(process.cwd(), 'app', 'data', 'templates', 'theme-engine', 'component-registry', 'registry.json');
  const registryRaw = fs.readFileSync(registryPath, 'utf8');
  
  // Parse ignoring comments using Function (since JSON.parse fails on // comments)
  const registry = new Function('return ' + registryRaw)();
  
  const components = registry.components.map((comp: any) => {
    const familyStr = Array.isArray(comp.family) ? comp.family.join(", ") : (comp.family || "");
    const firstFamily = Array.isArray(comp.family) ? comp.family[0] : (comp.family || "");
    const industryTags = Array.isArray(comp.family) 
      ? comp.family.map((f: any) => String(f).toLowerCase())
      : (comp.family ? [String(comp.family).toLowerCase()] : ["generic"]);
    
    return {
      componentId: comp.componentId,
      category: comp.type, // Map 'type' to 'category'
      niche: firstFamily ? String(firstFamily).toLowerCase() : "core",
      sectionType: comp.type,
      filePath: comp.liquidPath,
      liquidPath: comp.liquidPath,
      metaPath: comp.metaPath,
      family: familyStr,
      archetypes: comp.archetypes || [],
      visualStyle: comp.visualStyle || "",
      compatibleSlots: comp.compatibleSlots || [],
      industryTags: industryTags,
      styleTags: comp.visualStyle ? [comp.visualStyle] : [],
      searchKeywords: [comp.type, comp.visualStyle, ...industryTags].filter(Boolean),
      croScore: 95.0,
      mobileScore: 95.0,
      version: String(comp.version || "1"),
      status: comp.status === "approved" ? "PUBLISHED" : "DRAFT",
      isUniversal: !!comp.isUniversal,
      performanceScore: 95.0
    };
  });

  // Clean the current table
  await prisma.componentRegistry.deleteMany({});
  console.log("Cleared old ComponentRegistry.");

  for (const comp of components) {
    await prisma.componentRegistry.upsert({
      where: { componentId: comp.componentId },
      update: comp,
      create: comp
    });
    console.log(`Seeded component: ${comp.componentId}`);
  }

  console.log("ComponentRegistry V2 seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

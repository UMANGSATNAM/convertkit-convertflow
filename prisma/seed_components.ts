import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding ComponentRegistry for Design Systems V2...");

  // Load the new registry.json
  const registryPath = path.join(process.cwd(), 'app', 'data', 'templates', 'theme-engine', 'registry.json');
  const registryRaw = fs.readFileSync(registryPath, 'utf8');
  
  const canonicalRegistryRaw = registryRaw.replace(/\r\n/g, "\n");
  const registryHash = crypto.createHash('sha256').update(canonicalRegistryRaw).digest('hex');
  let registry: any;
  try {
    registry = JSON.parse(registryRaw);
  } catch (e: any) {
    throw new Error(`registry.json is not valid JSON: ${e.message}`);
  }
  
  const components = registry.components.map((comp: any) => {
    const familyStr = Array.isArray(comp.family) ? comp.family.join(", ") : (comp.family || "General");
    const firstFamily = Array.isArray(comp.family) ? comp.family[0] : (comp.family || "General");
    const industryTags = Array.isArray(comp.family) 
      ? comp.family.map((f: any) => String(f).toLowerCase())
      : (comp.family ? [String(comp.family).toLowerCase()] : ["generic"]);
    
    const cat = comp.type || comp.category || "custom";

    return {
      componentId: comp.componentId,
      category: cat,
      niche: firstFamily ? String(firstFamily).toLowerCase() : "core",
      sectionType: comp.sectionType || comp.componentId,
      filePath: comp.liquidPath || comp.filePath || "",
      liquidPath: comp.liquidPath || comp.filePath || "",
      metaPath: comp.metaPath || "",
      family: familyStr,
      archetypes: comp.archetypes || [],
      visualStyle: comp.visualStyle || "",
      compatibleSlots: comp.compatibleSlots || [],
      industryTags: industryTags,
      styleTags: comp.visualStyle ? [comp.visualStyle] : [],
      searchKeywords: [cat, comp.visualStyle, ...industryTags].filter(Boolean),
      croScore: 95.0,
      mobileScore: 95.0,
      version: String(comp.version || "1"),
      status: comp.status === "draft" || comp.status === "DRAFT" ? "DRAFT" : "PUBLISHED",
      isUniversal: !!comp.isUniversal,
      performanceScore: 95.0
    };
  });

  // Clean the current table
  await prisma.componentRegistry.deleteMany({});
  console.log("Cleared old ComponentRegistry.");

  await prisma.componentRegistry.createMany({
    data: components
  });
  console.log(`Seeded ${components.length} components.`);

  // Seed the RegistryMeta singleton table to store registry.json SHA-256 hash
  await prisma.registryMeta.upsert({
    where: { id: "singleton" },
    update: { registryHash, seededAt: new Date() },
    create: { id: "singleton", registryHash, seededAt: new Date() }
  });
  console.log(`Seeded RegistryMeta singleton with hash: ${registryHash}`);

  console.log("ComponentRegistry V2 seeding complete.");

  // Post-seed verification loop to strictly enforce SSOT alignment
  console.log("Starting DB post-seed verification audit...");
  const metaRecord = await prisma.registryMeta.findUnique({ where: { id: "singleton" } });
  if (!metaRecord || metaRecord.registryHash !== registryHash) {
    console.error(`[SeedVerification] RegistryMeta hash mismatch! Expected ${registryHash}, got ${metaRecord?.registryHash}`);
    process.exit(1);
  }

  const expectedCount = registry.components.filter((c: any) => c.status !== "draft" && c.status !== "DRAFT").length;
  const dbComponents = await prisma.componentRegistry.findMany({ where: { status: "PUBLISHED" } });
  if (dbComponents.length !== expectedCount) {
    console.error(`[SeedVerification] Expected exactly ${expectedCount} published components in DB, found ${dbComponents.length}!`);
    process.exit(1);
  }

  for (const dbComp of dbComponents) {
    const jsonComp = registry.components.find((c: any) => c.componentId === dbComp.componentId);
    if (!jsonComp) {
      console.error(`[SeedVerification] DB Component "${dbComp.componentId}" not found in registry.json!`);
      process.exit(1);
    }
    const expectedCat = jsonComp.type || jsonComp.category || "custom";
    if (dbComp.category !== expectedCat) {
      console.error(`[SeedVerification] Category drift detected: DB category "${dbComp.category}" !== JSON type "${expectedCat}" for "${dbComp.componentId}"`);
      process.exit(1);
    }
  }
  console.log(`✅ DB post-seed verification audit SUCCESS! All ${expectedCount} database components and RegistryMeta are fully aligned with registry.json.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

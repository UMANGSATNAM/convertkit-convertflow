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
    const familyStr = Array.isArray(comp.family) ? comp.family.join(", ") : (comp.family || "");
    const firstFamily = Array.isArray(comp.family) ? comp.family[0] : (comp.family || "");
    const industryTags = Array.isArray(comp.family) 
      ? comp.family.map((f: any) => String(f).toLowerCase())
      : (comp.family ? [String(comp.family).toLowerCase()] : ["generic"]);
    
    return {
      componentId: comp.componentId,
      category: comp.type, // Map 'type' to 'category'
      niche: firstFamily ? String(firstFamily).toLowerCase() : "core",
      sectionType: comp.sectionType || comp.componentId,
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

  const expectedCount = registry.components.filter((c: any) => c.status === "approved").length;
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
    if (dbComp.category !== jsonComp.type) {
      console.error(`[SeedVerification] Category drift detected: DB category "${dbComp.category}" !== JSON type "${jsonComp.type}" for "${dbComp.componentId}"`);
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

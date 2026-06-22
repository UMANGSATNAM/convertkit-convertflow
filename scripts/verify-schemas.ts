import * as fs from "fs/promises";
import * as path from "path";

const NICHES_DIR = path.resolve("app/data/templates/theme-engine/niches");

interface SchemaDef {
  settings?: Array<{ id?: string; type: string }>;
  blocks?: Array<{ type: string; settings?: Array<{ id?: string; type: string }> }>;
}

async function getDirectories(source: string): Promise<string[]> {
  try {
    const dirents = await fs.readdir(source, { withFileTypes: true });
    return dirents
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
  } catch (err) {
    return [];
  }
}

function extractSchema(fileContent: string, filepath: string): SchemaDef | null {
  const schemaRegex = /{%([\s\S]*?)schema([\s\S]*?)%}([\s\S]*?){%([\s\S]*?)endschema([\s\S]*?)%}/;
  const match = fileContent.match(schemaRegex);
  if (!match) return null;

  const jsonText = match[3].trim();
  try {
    return JSON.parse(jsonText);
  } catch (err: any) {
    throw new Error(`Invalid JSON in schema of file ${filepath}: ${err.message}`);
  }
}

async function verifySchemas() {
  console.log("--------------------------------------------------");
  console.log("Starting Cross-Niche Schema Consistency Check...");
  console.log("--------------------------------------------------");

  const niches = await getDirectories(NICHES_DIR);
  if (niches.length === 0) {
    console.log(`[Warning] No niches found in ${NICHES_DIR}. Verify path layout.`);
    return;
  }

  console.log(`Found niches: ${niches.join(", ")}`);

  // Map of: sectionFilename -> nicheName -> SchemaDef
  const sectionSchemas: Record<string, Record<string, SchemaDef | null>> = {};

  for (const niche of niches) {
    const sectionsDir = path.join(NICHES_DIR, niche, "sections");
    let files: string[] = [];
    try {
      files = await fs.readdir(sectionsDir);
    } catch (e) {
      console.warn(`[Warning] No sections directory found for niche '${niche}' at ${sectionsDir}`);
      continue;
    }

    for (const file of files) {
      if (!file.endsWith(".liquid")) continue;

      const filePath = path.join(sectionsDir, file);
      const content = await fs.readFile(filePath, "utf-8");
      
      let schema: SchemaDef | null = null;
      try {
        schema = extractSchema(content, filePath);
      } catch (err: any) {
        console.error(err.message);
        process.exit(1);
      }

      if (!sectionSchemas[file]) {
        sectionSchemas[file] = {};
      }
      sectionSchemas[file][niche] = schema;
    }
  }

  let hasError = false;

  // Now, for each section, compare schemas across all niches
  for (const [sectionFile, nicheMap] of Object.entries(sectionSchemas)) {
    const nicheEntries = Object.entries(nicheMap);
    if (nicheEntries.length < 2) continue; // Only one niche has this section, nothing to compare

    const referenceNiche = nicheEntries[0][0];
    const referenceSchema = nicheEntries[0][1];

    for (let i = 1; i < nicheEntries.length; i++) {
      const currentNiche = nicheEntries[i][0];
      const currentSchema = nicheEntries[i][1];

      // Both should either have a schema or both should not
      if ((referenceSchema === null) !== (currentSchema === null)) {
        console.error(
          `[FAIL] Schema presence mismatch in section '${sectionFile}':\n` +
          `  - Niche '${referenceNiche}' has schema: ${referenceSchema !== null}\n` +
          `  - Niche '${currentNiche}' has schema: ${currentSchema !== null}`
        );
        hasError = true;
        continue;
      }

      if (referenceSchema && currentSchema) {
        // Compare settings
        const refSettings = referenceSchema.settings || [];
        const curSettings = currentSchema.settings || [];

        // Check length
        if (refSettings.length !== curSettings.length) {
          console.error(
            `[FAIL] Settings count mismatch in section '${sectionFile}':\n` +
            `  - Niche '${referenceNiche}' has ${refSettings.length} settings\n` +
            `  - Niche '${currentNiche}' has ${curSettings.length} settings`
          );
          hasError = true;
        }

        // Compare setting IDs and types
        const maxSettings = Math.max(refSettings.length, curSettings.length);
        for (let s = 0; s < maxSettings; s++) {
          const refSet = refSettings[s];
          const curSet = curSettings[s];

          if (refSet && curSet) {
            if (refSet.id !== curSet.id) {
              console.error(
                `[FAIL] Setting ID mismatch in section '${sectionFile}' at index ${s}:\n` +
                `  - Niche '${referenceNiche}' defines ID: '${refSet.id}'\n` +
                `  - Niche '${currentNiche}' defines ID: '${curSet.id}'`
              );
              hasError = true;
            }
            if (refSet.type !== curSet.type) {
              console.error(
                `[FAIL] Setting Type mismatch in section '${sectionFile}' for setting ID '${refSet.id || s}':\n` +
                `  - Niche '${referenceNiche}' type: '${refSet.type}'\n` +
                `  - Niche '${currentNiche}' type: '${curSet.type}'`
              );
              hasError = true;
            }
          }
        }

        // Compare blocks
        const refBlocks = referenceSchema.blocks || [];
        const curBlocks = currentSchema.blocks || [];

        if (refBlocks.length !== curBlocks.length) {
          console.error(
            `[FAIL] Block count mismatch in section '${sectionFile}':\n` +
            `  - Niche '${referenceNiche}' has ${refBlocks.length} block types\n` +
            `  - Niche '${currentNiche}' has ${curBlocks.length} block types`
          );
          hasError = true;
        }

        const maxBlocks = Math.max(refBlocks.length, curBlocks.length);
        for (let b = 0; b < maxBlocks; b++) {
          const refBlock = refBlocks[b];
          const curBlock = curBlocks[b];

          if (refBlock && curBlock) {
            if (refBlock.type !== curBlock.type) {
              console.error(
                `[FAIL] Block Type mismatch in section '${sectionFile}' at block index ${b}:\n` +
                `  - Niche '${referenceNiche}' type: '${refBlock.type}'\n` +
                `  - Niche '${currentNiche}' type: '${curBlock.type}'`
              );
              hasError = true;
            }

            // Compare block settings
            const refBlockSettings = refBlock.settings || [];
            const curBlockSettings = curBlock.settings || [];

            if (refBlockSettings.length !== curBlockSettings.length) {
              console.error(
                `[FAIL] Block settings count mismatch in section '${sectionFile}', block type '${refBlock.type}':\n` +
                `  - Niche '${referenceNiche}' has ${refBlockSettings.length} settings\n` +
                `  - Niche '${currentNiche}' has ${curBlockSettings.length} settings`
              );
              hasError = true;
            }

            const maxBlockSettings = Math.max(refBlockSettings.length, curBlockSettings.length);
            for (let bs = 0; bs < maxBlockSettings; bs++) {
              const refBSet = refBlockSettings[bs];
              const curBSet = curBlockSettings[bs];

              if (refBSet && curBSet) {
                if (refBSet.id !== curBSet.id) {
                  console.error(
                    `[FAIL] Block setting ID mismatch in section '${sectionFile}', block type '${refBlock.type}' at index ${bs}:\n` +
                    `  - Niche '${referenceNiche}' defines ID: '${refBSet.id}'\n` +
                    `  - Niche '${currentNiche}' defines ID: '${curBSet.id}'`
                  );
                  hasError = true;
                }
                if (refBSet.type !== curBSet.type) {
                  console.error(
                    `[FAIL] Block setting Type mismatch in section '${sectionFile}', block type '${refBlock.type}' for setting ID '${refBSet.id || bs}':\n` +
                    `  - Niche '${referenceNiche}' type: '${refBSet.type}'\n` +
                    `  - Niche '${currentNiche}' type: '${curBSet.type}'`
                  );
                  hasError = true;
                }
              }
            }
          }
        }
      }
    }
  }

  if (hasError) {
    console.error("\n[FAIL] Schema check failed due to inconsistencies listed above.");
    process.exit(1);
  } else {
    console.log("\n[SUCCESS] All schemas are 100% consistent across all niches!");
  }
}

verifySchemas();

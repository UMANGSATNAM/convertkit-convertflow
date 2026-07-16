import { compileTheme } from "../app/services/theme-engine/compiler.server.ts";

async function checkManifestCount() {
  const storeBlueprint = {
    pages: {
      index: {
        sections: [
          { componentId: "hero-editorial-v1", settings: {} }
        ]
      }
    },
    settings: {
      colors_accent: "#008060",
      type_header_font: "playfair_n4"
    }
  };

  const compiled = await compileTheme(
    storeBlueprint,
    undefined as any,
    { industry: "jewellery" }
  );

  const fileKeys = Object.keys(compiled.filesToUpload);
  console.log("=== COMPILATION MANIFEST SUMMARY ===");
  console.log("Total files in compiled bundle:", fileKeys.length);

  const byDir: Record<string, number> = {};
  for (const key of fileKeys) {
    const dir = key.split("/")[0];
    byDir[dir] = (byDir[dir] || 0) + 1;
  }
  console.log("Files by directory:", byDir);

  const baseTokensContent = compiled.filesToUpload["assets/base-tokens.css"];
  console.log("base-tokens.css present:", !!baseTokensContent);
  const nicheTokensContent = compiled.filesToUpload["assets/niche-tokens.css"];
  console.log("=== GENERATED NICHE-TOKENS.CSS FULL CONTENTS ===");
  console.log(nicheTokensContent || "NOT FOUND");
  console.log("================================================");
}

checkManifestCount().catch((err) => {
  console.error(err);
  process.exit(1);
});


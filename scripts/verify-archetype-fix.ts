(global as any).__redis = { set: async () => "OK", eval: async () => 1, on: () => {} };
import { invalidateRegistryCache, retrieveBestComponent } from "../app/services/theme-engine/retrieval.server.js";

invalidateRegistryCache();

const streetwearSections = ["hero", "header", "testimonials", "newsletter", "footer", "featured-collection"];

console.log("\n🧪 ARCHETYPE VERIFICATION — bold_lifestyle × fashion\n");
console.log("=".repeat(60));

for (const section of streetwearSections) {
  const r = await retrieveBestComponent({
    sectionType: section,
    brandArchetype: "bold_lifestyle",
    catalogIndustry: "fashion",
    catalogStyle: "trendy",
    catalogVisualComplexity: "high"
  });
  if (r) {
    const archetypeStatus = r.breakdown!.archetypeMatch === 20 ? "✅" : r.breakdown!.archetypeMatch === 10 ? "⚠️ " : "❌";
    console.log(`${archetypeStatus} [${section.padEnd(22)}] winner=${r.componentId.padEnd(30)} archetype=${r.breakdown!.archetypeMatch}/20 total=${r.score}`);
  } else {
    console.log(`⚠️  [${section.padEnd(22)}] no component found`);
  }
}
console.log("=".repeat(60));

import { BrandExtractionService } from '../app/services/core/BrandExtractionService.js';
import { ShopifyColorGuard } from '../app/services/core/ShopifyColorGuard.js';

async function run() {
  const extracted = await BrandExtractionService.extractBrandAesthetics("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", { name: "Test", industry: "jewellery", valueProposition: "Testing" });
  console.log("Raw Extracted:");
  console.log(extracted);
  
  const tokens = await BrandExtractionService.mapToTokens(extracted, false);
  console.log("\nBaseSettings (Mapped Tokens):");
  console.log(tokens);
  
  const guarded = ShopifyColorGuard.apply(tokens);
  console.log("\nAfter Color Guard:");
  console.log(guarded);
}
run().catch(console.error);

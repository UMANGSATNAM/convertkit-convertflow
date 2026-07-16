import { BrandExtractionService } from "./app/services/core/BrandExtractionService.js";
import prisma from "./app/db.server.js";

async function main() {
  const g = await prisma.storeGeneration.findUnique({ where: { id: "cmri7b77g0001vkx4phep8dhb" } });
  const aiData = g?.aiPayload as any;
  if (aiData?.logoBase64) {
    const rawExtracted = await BrandExtractionService.extractBrandAesthetics(aiData.logoBase64, "image/png", "jewellery");
    console.log("Extracted:", JSON.stringify(rawExtracted, null, 2));
    const tokens = BrandExtractionService.mapToTokens(rawExtracted, false);
    console.log("Tokens:", JSON.stringify(tokens, null, 2));
  }
}
main();

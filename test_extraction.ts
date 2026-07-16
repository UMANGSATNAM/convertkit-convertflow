import dotenv from "dotenv";
dotenv.config();
import { BrandExtractionService } from "./app/services/core/BrandExtractionService.js";

async function run() {
  // A small 1x1 transparent PNG base64
  const imageBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
  const result = await BrandExtractionService.extractBrandAesthetics(imageBase64, "image/png", "jewellery");
  console.log("Result:", JSON.stringify(result, null, 2));
}

run().catch(console.error);

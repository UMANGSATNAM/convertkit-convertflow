import prisma from "../../db.server";

export async function runHealthScan(shopId: string, themeId: string, trigger: string = "MANUAL") {
  console.log(`[HEALTH] Running scan for shop ${shopId} on theme ${themeId}`);
  
  // Mock Scanner Logic
  const issues = [];
  let score = 100;

  // 1. Check for unoptimized images (mock)
  issues.push({
    key: "HEAVY_IMAGES",
    severity: "HIGH",
    target: "assets/hero-banner.jpg",
    detail: "Image is 1.2MB, which slows down mobile load times.",
    autoFixable: true
  });
  score -= 15;

  // 2. Check for missing alt text
  issues.push({
    key: "MISSING_ALT",
    severity: "MEDIUM",
    target: "products/summer-dress",
    detail: "3 product images are missing alt text, hurting SEO.",
    autoFixable: true
  });
  score -= 10;

  // 3. Check for mobile tap targets
  issues.push({
    key: "SMALL_TAP_TARGETS",
    severity: "MEDIUM",
    target: "templates/product.json",
    detail: "Add to cart button may be too small on mobile screens.",
    autoFixable: false
  });
  score -= 5;

  const report = await prisma.healthReport.create({
    data: {
      shopId,
      score,
      issues,
      trigger
    }
  });

  return report;
}

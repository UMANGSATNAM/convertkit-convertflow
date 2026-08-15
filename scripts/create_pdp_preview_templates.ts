import fs from "fs";
import path from "path";

const templatesDir = path.join(process.cwd(), "dev-theme-peri", "templates");

const allNiches = [
  "beauty", "fashion", "tech", "health", "fmcg",
  "jewelry", "pet", "home", "fitness", "auto",
  "kids", "coffee", "gaming", "eco", "artisan"
];

allNiches.forEach(niche => {
  const sectionsObj: Record<string, any> = {
    main: { type: "main-page", settings: {} }
  };
  const orderArr: string[] = ["main"];

  for (let v = 1; v <= 10; v++) {
    const secKey = `sec_${v}`;
    sectionsObj[secKey] = {
      type: `pdp-${niche}-v${v}`,
      settings: {}
    };
    orderArr.push(secKey);
  }

  const templateContent = {
    sections: sectionsObj,
    order: orderArr
  };

  const filename = `page.pdp-${niche}-preview.json`;
  fs.writeFileSync(path.join(templatesDir, filename), JSON.stringify(templateContent, null, 2));
});

console.log("All 15 Niche PDP Preview JSON templates successfully created!");

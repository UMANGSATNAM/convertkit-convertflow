import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Database with Niche data...');

  const koskiiPalette = {
    primary: "#8B0000",
    secondary: "#D4AF37",
    background: "#FFFFFF",
    text: "#333333",
    border: "#EAEAEA"
  };

  const niches = [
    {
      id: "ethnic-wear",
      name: "Ethnic Wear",
      nameHi: "एथनिक वियर",
      themeZipUrl: "https://pub-dev.r2.dev/themes/ethnic-wear-1.0.0.zip",
      themeVersion: "1.0.0",
      previewImages: ["https://placehold.co/600x800?text=Ethnic+Wear+1"],
      demoStoreUrl: "https://ethnic-demo.storeforge.app",
      demoCatalogUrl: "https://pub-dev.r2.dev/catalogs/ethnic-wear.json",
      pagesPreset: {
        en: [{ title: "About Us", handle: "about-us" }, { title: "Contact", handle: "contact" }],
        hi: [{ title: "हमारे बारे में", handle: "about-us" }, { title: "संपर्क", handle: "contact" }]
      },
      menusPreset: {
        main: ["Lehengas", "Sarees", "Salwar Suits", "Gowns"],
        footer: ["About Us", "Contact Us", "Shipping Policy"]
      },
      settingsBase: {
        colors_solid_button_labels: koskiiPalette.background,
        colors_accent_1: koskiiPalette.primary,
        colors_accent_2: koskiiPalette.secondary,
        colors_text: koskiiPalette.text,
        colors_background_1: koskiiPalette.background,
        colors_outline_button_labels: koskiiPalette.primary
      },
      palettePresets: [
        { name: "Royal Koskii", colors: koskiiPalette },
        { name: "Pastel Wedding", colors: { primary: "#F8C8DC", secondary: "#C1E1C1", background: "#FFFFFF", text: "#4A4A4A" } }
      ],
      fontPairs: [
        { heading: "Playfair Display", body: "Lato" },
        { heading: "Cinzel", body: "Open Sans" }
      ],
      campaignFit: {
        tags: ["wedding", "festive", "diwali", "rakhi"]
      },
      active: true
    },
    // Adding the other 9 placeholders
    ...[
      "jewellery", "grooming", "beauty", "streetwear", 
      "activewear", "electronics", "kids", "home-decor", "food"
    ].map(id => ({
      id,
      name: id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      nameHi: id, // Stub
      themeZipUrl: `https://pub-dev.r2.dev/themes/${id}-1.0.0.zip`,
      themeVersion: "1.0.0",
      previewImages: [`https://placehold.co/600x800?text=${id}`],
      demoStoreUrl: `https://${id}-demo.storeforge.app`,
      demoCatalogUrl: `https://pub-dev.r2.dev/catalogs/${id}.json`,
      pagesPreset: { en: [], hi: [] },
      menusPreset: { main: ["Shop All"], footer: ["Contact"] },
      settingsBase: {},
      palettePresets: [],
      fontPairs: [],
      campaignFit: { tags: [] },
      active: true
    }))
  ];

  for (const niche of niches) {
    await prisma.niche.upsert({
      where: { id: niche.id },
      update: niche,
      create: niche
    });
    console.log(`Upserted Niche: ${niche.id}`);
  }

  console.log('Seeding Complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

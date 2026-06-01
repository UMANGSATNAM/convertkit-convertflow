import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const defaultSectionsConfig = {
  sections: {
    hero_banner: {
      type: "image-banner",
      settings: {
        heading: "Welcome to Our Store",
        subheading: "Find the best products right here",
        button_label: "Shop Now",
        button_link: "/collections/all",
        image_overlay_opacity: 30
      }
    },
    featured_collection: {
      type: "featured-collection",
      settings: {
        title: "Bestsellers",
        collection: "",
        products_to_show: 8
      }
    }
  },
  order: ["hero_banner", "featured_collection"]
};

const templatesToSeed = [
  {
    niche: "jewellery",
    pageType: "homepage",
    templateName: "Jewellery Homepage",
    description: "Elegant homepage optimized for fine jewellery with trust badges and occasion sections.",
    sectionsConfig: defaultSectionsConfig,
    isActive: true
  },
  {
    niche: "grooming",
    pageType: "homepage",
    templateName: "Grooming Homepage",
    description: "Bold masculine layout highlighting active ingredients and routines.",
    sectionsConfig: defaultSectionsConfig,
    isActive: true
  },
  {
    niche: "fashion",
    pageType: "homepage",
    templateName: "Fashion Homepage",
    description: "Editorial lookbook style with large imagery and quick-add.",
    sectionsConfig: defaultSectionsConfig,
    isActive: true
  },
  {
    niche: "beauty",
    pageType: "homepage",
    templateName: "Beauty Homepage",
    description: "Clean aesthetic with concern-based navigation and shade selectors.",
    sectionsConfig: defaultSectionsConfig,
    isActive: true
  },
  {
    niche: "food",
    pageType: "homepage",
    templateName: "Food & Beverage Homepage",
    description: "Health-first design with nutrition callouts and farm-to-shelf story.",
    sectionsConfig: defaultSectionsConfig,
    isActive: true
  },
  {
    niche: "home-decor",
    pageType: "homepage",
    templateName: "Home Decor Homepage",
    description: "Room-by-room inspiration with mood lighting effects.",
    sectionsConfig: defaultSectionsConfig,
    isActive: true
  },
  {
    niche: "fitness",
    pageType: "homepage",
    templateName: "Fitness Homepage",
    description: "High-energy layout focusing on transformations and equipment specs.",
    sectionsConfig: defaultSectionsConfig,
    isActive: true
  },
  {
    niche: "pets",
    pageType: "homepage",
    templateName: "Pet Supplies Homepage",
    description: "Playful design with pet-type navigation and care guides.",
    sectionsConfig: defaultSectionsConfig,
    isActive: true
  }
];

async function main() {
  console.log("Starting seed process...");

  // Wipe existing templates
  await prisma.pageTemplate.deleteMany({});
  console.log("Wiped existing templates.");

  // Insert new templates
  for (const t of templatesToSeed) {
    await prisma.pageTemplate.create({
      data: t
    });
    console.log(`Created template: ${t.templateName}`);
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

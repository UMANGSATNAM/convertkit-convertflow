import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const niches = ["jewellery", "grooming", "fashion", "beauty", "food", "home-decor", "fitness", "pets"];
const pageTypes = ["homepage", "product", "collection", "about", "landing"];

const placeholderImages = {
  homepage: [
    "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png",
    "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-lifestyle-1_large.png"
  ],
  product: [
    "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-product-1_large.png",
    "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-product-5_large.png"
  ],
  collection: [
    "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-collection-1_large.png",
    "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-collection-2_large.png"
  ],
  about: [
    "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-lifestyle-2_large.png"
  ],
  landing: [
    "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-lifestyle-1_large.png"
  ]
};

const templatesData = [];

// Helper to generate a random template
let counter = 1;

for (const niche of niches) {
  for (const pageType of pageTypes) {
    // Generate at least 1 template for every niche-pageType combo (8 x 5 = 40)
    const images = placeholderImages[pageType] || placeholderImages['homepage'];
    const imageUrl = images[counter % images.length];

    let sectionsConfig = {};
    if (pageType === 'homepage' || pageType === 'landing') {
      sectionsConfig = {
        sections: {
          "hero": { "type": "image-banner", "settings": { "image_overlay_opacity": 40 } },
          "featured": { "type": "featured-collection", "settings": { "title": "Top Picks" } },
          "text": { "type": "rich-text", "settings": { "title": `Welcome to ${niche} store` } }
        },
        order: ["hero", "featured", "text"]
      };
    } else if (pageType === 'product') {
      sectionsConfig = {
        sections: {
          "main": { "type": "main-product", "settings": {} },
          "trust": { "type": "multicolumn", "settings": { "title": "Why buy from us", "column_alignment": "center" } },
          "reviews": { "type": "apps", "settings": {} }
        },
        order: ["main", "trust", "reviews"]
      };
    } else if (pageType === 'collection') {
      sectionsConfig = {
        sections: {
          "banner": { "type": "collection-banner", "settings": { "show_collection_image": true } },
          "main": { "type": "main-collection-product-grid", "settings": { "products_per_page": 16 } }
        },
        order: ["banner", "main"]
      };
    } else if (pageType === 'about') {
      sectionsConfig = {
        sections: {
          "story": { "type": "image-with-text", "settings": { "title": `Our ${niche} Story` } },
          "values": { "type": "multicolumn", "settings": { "title": "Our Core Values" } }
        },
        order: ["story", "values"]
      };
    }

    templatesData.push({
      niche: niche,
      pageType: pageType,
      templateName: `Premium ${niche.charAt(0).toUpperCase() + niche.slice(1)} ${pageType.charAt(0).toUpperCase() + pageType.slice(1)} - V${(counter % 3) + 1}`,
      description: `A highly converting ${pageType} template specifically designed for ${niche} brands.`,
      previewImageUrl: imageUrl,
      sectionsConfig: sectionsConfig,
      isActive: true
    });
    counter++;
  }
}

// Generate 10 extra variations to reach 50 templates
for (let i = 0; i < 10; i++) {
  const niche = niches[i % niches.length];
  const pageType = pageTypes[i % pageTypes.length];
  const imageUrl = placeholderImages[pageType][0] || placeholderImages['homepage'][0];
  
  templatesData.push({
    niche: niche,
    pageType: pageType,
    templateName: `${niche.charAt(0).toUpperCase() + niche.slice(1)} Exclusive Drop ${i + 1}`,
    description: `Alternative variation of the ${pageType} for limited editions.`,
    previewImageUrl: imageUrl,
    sectionsConfig: {
      sections: {
        "hero": { "type": "image-banner", "settings": { "image_overlay_opacity": 60 } },
        "gallery": { "type": "multicolumn", "settings": { "title": "Featured Looks" } }
      },
      order: ["hero", "gallery"]
    },
    isActive: true
  });
}

async function main() {
  console.log("Cleaning up old templates...");
  await prisma.pageTemplate.deleteMany({});
  
  console.log(`Inserting ${templatesData.length} new templates...`);
  for (const t of templatesData) {
    await prisma.pageTemplate.create({
      data: t
    });
  }
  
  console.log(`Successfully generated and seeded ${templatesData.length} templates!`);
}

main().catch(console.error).finally(() => prisma.$disconnect());

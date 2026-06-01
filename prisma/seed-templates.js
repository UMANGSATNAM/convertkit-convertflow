import prisma from "../app/db.server";

async function main() {
  const templates = [
    {
      niche: "fashion",
      pageType: "landing",
      templateName: "Streetwear Drop Vol 1",
      description: "High-contrast layout for exclusive streetwear drops with a countdown timer and FOMO blocks.",
      previewImageUrl: "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-collection-1_large.png",
      sectionsConfig: {
        sections: {
          "main": {
            "type": "main-page",
            "settings": {}
          },
          "hero": {
            "type": "image-banner",
            "settings": {
              "image_overlay_opacity": 40,
              "image_height": "large",
              "text_box_position": "bottom-center"
            }
          },
          "featured": {
            "type": "featured-collection",
            "settings": {
              "title": "The Drop",
              "products_to_show": 4
            }
          }
        },
        order: ["hero", "main", "featured"]
      }
    },
    {
      niche: "jewellery",
      pageType: "product",
      templateName: "Luxury Rings Showcase",
      description: "Elegant, minimalist product page focusing on high-resolution images and trust badges.",
      previewImageUrl: "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-product-5_large.png",
      sectionsConfig: {
        sections: {
          "main": {
            "type": "main-product",
            "settings": {}
          },
          "trust": {
            "type": "multicolumn",
            "settings": {
              "title": "Why buy from us",
              "column_alignment": "center"
            }
          }
        },
        order: ["main", "trust"]
      }
    },
    {
      niche: "grooming",
      pageType: "homepage",
      templateName: "Men's Essentials Frontpage",
      description: "Conversion-optimized homepage for men's grooming brands.",
      previewImageUrl: "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png",
      sectionsConfig: {
        sections: {
          "hero": {
            "type": "image-banner",
            "settings": {}
          },
          "categories": {
            "type": "collection-list",
            "settings": {
              "title": "Shop by Category"
            }
          }
        },
        order: ["hero", "categories"]
      }
    },
    {
      niche: "food",
      pageType: "about",
      templateName: "Our Farm Story",
      description: "Story-telling template perfect for organic food brands.",
      previewImageUrl: "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-lifestyle-1_large.png",
      sectionsConfig: {
        sections: {
          "story": {
            "type": "image-with-text",
            "settings": {}
          },
          "values": {
            "type": "multicolumn",
            "settings": {}
          }
        },
        order: ["story", "values"]
      }
    }
  ];

  for (const t of templates) {
    await prisma.pageTemplate.create({
      data: t
    });
  }
  
  console.log("Seeded Page Templates successfully.");
}

main().catch(console.error).finally(() => prisma.$disconnect());

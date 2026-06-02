import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding CaratLane Jewellery Template...");

  // The massive Shopify JSON template structure connecting all 12 sections
  const caratlaneJsonTemplate = {
    name: "Jewellery - CaratLane Edition",
    layout: "theme",
    sections: {
      "hero-slider": {
        type: "ck-jewel-hero-slider",
        settings: {
          headline: "The Perfect Gift for Her",
          subheadline: "Discover our new Diamond Collection, crafted with love.",
          button_text: "Shop Now",
          button_link: "/collections/all",
          bg_color: "#fdf7f8",
          text_color: "#4a4a4a",
          btn_color: "#B76E79"
        }
      },
      "trust-badges": {
        type: "ck-jewel-trust-badges",
        settings: {}
      },
      "shop-by-category": {
        type: "ck-jewel-shop-by-category",
        settings: {}
      },
      "new-arrivals": {
        type: "ck-jewel-new-arrivals-grid",
        settings: {
          title: "New Arrivals",
          subtitle: "Discover the latest additions to our exquisite collection.",
          view_all_text: "Explore All"
        }
      },
      "shop-by-price": {
        type: "ck-jewel-shop-by-price",
        settings: {}
      },
      "gifting-guide": {
        type: "ck-jewel-gifting-guide",
        settings: {}
      },
      "product-slider": {
        type: "ck-jewel-product-slider",
        settings: {
          title: "Trending Now"
        }
      },
      "try-at-home": {
        type: "ck-jewel-try-at-home",
        settings: {}
      },
      "shop-by-material": {
        type: "ck-jewel-shop-by-material",
        settings: {}
      },
      "testimonials": {
        type: "ck-jewel-testimonials",
        settings: {}
      },
      "store-locator": {
        type: "ck-jewel-store-locator-cta",
        settings: {}
      },
      "newsletter": {
        type: "ck-jewel-newsletter",
        settings: {}
      }
    },
    order: [
      "hero-slider",
      "trust-badges",
      "shop-by-category",
      "new-arrivals",
      "shop-by-price",
      "gifting-guide",
      "product-slider",
      "try-at-home",
      "shop-by-material",
      "testimonials",
      "store-locator",
      "newsletter"
    ]
  };

  const template = await prisma.pageTemplate.create({
    data: {
      niche: "jewellery",
      pageType: "index",
      templateName: "Jewellery - CaratLane Edition",
      description: "A premium, massive 12-section template inspired by CaratLane. Perfect for high-end jewellery stores.",
      previewImageUrl: "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081",
      sectionsConfig: caratlaneJsonTemplate,
      isActive: true
    }
  });

  console.log(`Created Template: ${template.templateName} (ID: ${template.id})`);
  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

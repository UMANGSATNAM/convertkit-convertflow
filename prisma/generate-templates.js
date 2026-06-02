import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
const prisma = new PrismaClient();

const generateId = () => crypto.randomBytes(4).toString('hex');

const getCopy = (niche) => {
  const copyMap = {
    jewellery: {
      headline: "Discover True Elegance",
      subtext: "Handcrafted fine jewelry designed to celebrate your most precious moments.",
      btnText: "Shop Collection",
      feature1: "Ethically Sourced",
      feature2: "Lifetime Warranty",
      feature3: "Free Insured Shipping",
      storyHeading: "The Art of Fine Jewelry",
      storyBody: "Every piece tells a story. We blend traditional craftsmanship with modern design to create timeless pieces that you'll cherish forever."
    },
    grooming: {
      headline: "Elevate Your Routine",
      subtext: "Premium grooming essentials crafted for the modern gentleman.",
      btnText: "Shop Essentials",
      feature1: "Natural Ingredients",
      feature2: "Cruelty Free",
      feature3: "Dermatologist Tested",
      storyHeading: "Built for Men",
      storyBody: "We believe grooming should be simple but effective. Our products are engineered with the highest quality ingredients to deliver real results."
    },
    fashion: {
      headline: "Define Your Style",
      subtext: "Discover the latest trends and elevate your wardrobe with our exclusive new arrivals.",
      btnText: "Explore New Arrivals",
      feature1: "Premium Fabrics",
      feature2: "Sustainable Fashion",
      feature3: "Easy Returns",
      storyHeading: "Fashion Forward",
      storyBody: "Our mission is to empower individuals through style. We curate collections that balance contemporary trends with timeless elegance."
    },
    beauty: {
      headline: "Unleash Your Glow",
      subtext: "Clean, conscious beauty products that enhance your natural radiance.",
      btnText: "Shop Skincare",
      feature1: "100% Vegan",
      feature2: "Paraben Free",
      feature3: "Clinically Proven",
      storyHeading: "Pure Beauty",
      storyBody: "We formulate our products with powerful active ingredients and botanical extracts to nourish your skin from the inside out."
    },
    food: {
      headline: "Taste the Difference",
      subtext: "Artisanal, organic ingredients delivered fresh from the farm to your table.",
      btnText: "Order Now",
      feature1: "Locally Sourced",
      feature2: "100% Organic",
      feature3: "Farm Fresh",
      storyHeading: "Our Farm Story",
      storyBody: "We work directly with local farmers to bring you the highest quality, sustainably grown ingredients. Taste nature the way it was meant to be."
    },
    "home-decor": {
      headline: "Transform Your Space",
      subtext: "Curated decor pieces that turn your house into a beautiful, inspiring home.",
      btnText: "Shop Decor",
      feature1: "Artisan Crafted",
      feature2: "Modern Design",
      feature3: "Secure Packaging",
      storyHeading: "Design Your Sanctuary",
      storyBody: "Your home should be a reflection of your personality. We travel the world to source unique, handcrafted decor items that bring life to any room."
    },
    fitness: {
      headline: "Push Your Limits",
      subtext: "High-performance gear designed to help you achieve your ultimate fitness goals.",
      btnText: "Shop Gear",
      feature1: "Sweat Resistant",
      feature2: "Ergonomic Fit",
      feature3: "Built to Last",
      storyHeading: "Engineered for Performance",
      storyBody: "We design gear that works as hard as you do. Whether you're training for a marathon or hitting the gym, our apparel provides maximum comfort and support."
    },
    pets: {
      headline: "Only the Best for Your Pet",
      subtext: "Premium food, toys, and accessories for the furry members of your family.",
      btnText: "Shop Pet Supplies",
      feature1: "Vet Approved",
      feature2: "Nutritious Food",
      feature3: "Durable Toys",
      storyHeading: "For the Love of Pets",
      storyBody: "We know that pets are family. That's why we meticulously source our products to ensure your best friend lives a happy, healthy, and playful life."
    }
  };
  return copyMap[niche] || copyMap['fashion'];
};

const buildImageBanner = (copy) => {
  const hId = generateId();
  const tId = generateId();
  const bId = generateId();
  return {
    "type": "image-banner",
    "blocks": {
      [hId]: { "type": "heading", "settings": { "heading": copy.headline } },
      [tId]: { "type": "text", "settings": { "text": copy.subtext } },
      [bId]: { "type": "buttons", "settings": { "button_label_1": copy.btnText, "button_link_1": "shopify://collections/all" } }
    },
    "block_order": [hId, tId, bId],
    "settings": {
      "image_overlay_opacity": 40,
      "image_height": "large",
      "desktop_content_position": "middle-center",
      "show_text_box": false
    }
  };
};

const buildRichText = (copy) => {
  const hId = generateId();
  const tId = generateId();
  const bId = generateId();
  return {
    "type": "rich-text",
    "blocks": {
      [hId]: { "type": "heading", "settings": { "heading": "Welcome to our store" } },
      [tId]: { "type": "text", "settings": { "text": `<p>${copy.subtext}</p>` } },
      [bId]: { "type": "buttons", "settings": { "button_label_1": copy.btnText, "button_link_1": "shopify://collections/all" } }
    },
    "block_order": [hId, tId, bId],
    "settings": {
      "desktop_content_position": "center"
    }
  };
};

const buildMulticolumn = (copy) => {
  const c1Id = generateId();
  const c2Id = generateId();
  const c3Id = generateId();
  return {
    "type": "multicolumn",
    "blocks": {
      [c1Id]: { "type": "column", "settings": { "title": copy.feature1, "text": "<p>Quality guaranteed.</p>" } },
      [c2Id]: { "type": "column", "settings": { "title": copy.feature2, "text": "<p>We care about our impact.</p>" } },
      [c3Id]: { "type": "column", "settings": { "title": copy.feature3, "text": "<p>Hassle-free experience.</p>" } }
    },
    "block_order": [c1Id, c2Id, c3Id],
    "settings": {
      "title": "Why Choose Us",
      "background_style": "secondary",
      "column_alignment": "center"
    }
  };
};

const buildImageWithText = (copy) => {
  const hId = generateId();
  const tId = generateId();
  const bId = generateId();
  return {
    "type": "image-with-text",
    "blocks": {
      [hId]: { "type": "heading", "settings": { "heading": copy.storyHeading } },
      [tId]: { "type": "text", "settings": { "text": `<p>${copy.storyBody}</p>` } },
      [bId]: { "type": "button", "settings": { "button_label": "Read More", "button_link": "shopify://pages/about" } }
    },
    "block_order": [hId, tId, bId],
    "settings": {
      "layout": "image_first",
      "desktop_image_width": "medium",
      "desktop_content_position": "middle"
    }
  };
};

const buildFeaturedCollection = () => {
  return {
    "type": "featured-collection",
    "settings": {
      "title": "Best Sellers",
      "products_to_show": 4,
      "columns_desktop": 4,
      "show_rating": true,
      "show_vendor": false
    }
  };
};

const buildMainProduct = () => {
  return {
    "type": "main-product",
    "blocks": {
      "vendor": { "type": "text", "settings": { "text": "{{ product.vendor }}" } },
      "title": { "type": "title", "settings": {} },
      "price": { "type": "price", "settings": {} },
      "variant_picker": { "type": "variant_picker", "settings": { "picker_type": "button" } },
      "quantity_selector": { "type": "quantity_selector", "settings": {} },
      "buy_buttons": { "type": "buy_buttons", "settings": { "show_dynamic_checkout": true } },
      "description": { "type": "description", "settings": {} }
    },
    "block_order": ["vendor", "title", "price", "variant_picker", "quantity_selector", "buy_buttons", "description"],
    "settings": {}
  };
};

const buildMainCollection = () => {
  return {
    "type": "main-collection-product-grid",
    "settings": {
      "products_per_page": 16,
      "columns_desktop": 4,
      "enable_filtering": true,
      "enable_sorting": true
    }
  };
};

const niches = ["jewellery", "grooming", "fashion", "beauty", "food", "home-decor", "fitness", "pets"];
const pageTypes = ["homepage", "product", "collection", "about", "landing"];

const placeholderImages = {
  homepage: [
    "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80"
  ],
  product: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80"
  ],
  collection: [
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80"
  ],
  about: [
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
  ],
  landing: [
    "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=80"
  ]
};

const templatesData = [];
let counter = 1;

for (const niche of niches) {
  const copy = getCopy(niche);
  
  for (const pageType of pageTypes) {
    const images = placeholderImages[pageType] || placeholderImages['homepage'];
    const imageUrl = images[counter % images.length];

    let sectionsConfig = {};
    if (pageType === 'homepage' || pageType === 'landing') {
      sectionsConfig = {
        sections: {
          "hero": buildImageBanner(copy),
          "features": buildMulticolumn(copy),
          "featured": buildFeaturedCollection(),
          "story": buildImageWithText(copy)
        },
        order: ["hero", "features", "featured", "story"]
      };
    } else if (pageType === 'product') {
      sectionsConfig = {
        sections: {
          "main": buildMainProduct(),
          "trust": buildMulticolumn(copy),
          "related": buildFeaturedCollection()
        },
        order: ["main", "trust", "related"]
      };
    } else if (pageType === 'collection') {
      sectionsConfig = {
        sections: {
          "banner": { "type": "collection-banner", "settings": { "show_collection_image": true, "show_collection_description": true } },
          "main": buildMainCollection(),
          "bottom_text": buildRichText(copy)
        },
        order: ["banner", "main", "bottom_text"]
      };
    } else if (pageType === 'about') {
      sectionsConfig = {
        sections: {
          "hero": buildImageBanner({ ...copy, headline: copy.storyHeading, subtext: "Learn more about our journey and values." }),
          "story": buildImageWithText(copy),
          "values": buildMulticolumn(copy)
        },
        order: ["hero", "story", "values"]
      };
    }

    templatesData.push({
      niche: niche,
      pageType: pageType,
      templateName: `Premium ${niche.charAt(0).toUpperCase() + niche.slice(1)} ${pageType.charAt(0).toUpperCase() + pageType.slice(1)} - High Fidelity`,
      description: `A fully-built, real-world ${pageType} design loaded with professional copywriting and rich blocks.`,
      previewImageUrl: imageUrl,
      sectionsConfig: sectionsConfig,
      isActive: true
    });
    counter++;
  }
}

for (let i = 0; i < 10; i++) {
  const niche = niches[i % niches.length];
  const pageType = pageTypes[i % pageTypes.length];
  const copy = getCopy(niche);
  const imageUrl = placeholderImages[pageType][0] || placeholderImages['homepage'][0];
  
  templatesData.push({
    niche: niche,
    pageType: pageType,
    templateName: `${niche.charAt(0).toUpperCase() + niche.slice(1)} Conversion Drop ${i + 1}`,
    description: `Alternate ultra-high conversion layout with rich components.`,
    previewImageUrl: imageUrl,
    sectionsConfig: {
      sections: {
        "hero": buildImageWithText(copy),
        "gallery": buildMulticolumn(copy),
        "text": buildRichText(copy)
      },
      order: ["hero", "gallery", "text"]
    },
    isActive: true
  });
}

async function main() {
  console.log("Cleaning up old templates...");
  await prisma.pageTemplate.deleteMany({});
  
  console.log(`Inserting ${templatesData.length} HIGH FIDELITY REAL templates...`);
  for (const t of templatesData) {
    await prisma.pageTemplate.create({
      data: t
    });
  }
  
  console.log(`Successfully generated and seeded ${templatesData.length} REAL templates!`);
}

main().catch(console.error).finally(() => prisma.$disconnect());

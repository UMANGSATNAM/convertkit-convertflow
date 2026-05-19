export const SECTION_REGISTRY = {
  "hero-split-image": {
    id: "hero-split-image",
    name: "Hero Split Image",
    category: "Hero",
    schema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          title: "Heading",
          default: "Discover New Arrivals",
        },
        subtitle: {
          type: "string",
          title: "Subheading",
          default: "Curated styles for this season.",
        },
        image_url: {
          type: "string",
          title: "Image URL",
          default: "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png",
        },
        button_text: {
          type: "string",
          title: "Button Text",
          default: "Shop Now",
        },
        button_link: {
          type: "string",
          title: "Button Link",
          default: "/collections/all",
        },
      },
      required: ["title"],
    },
  },
  "product-benefits-grid": {
    id: "product-benefits-grid",
    name: "Product Benefits Grid",
    category: "Store Features",
    schema: {
      type: "object",
      properties: {
        columns: {
          type: "number",
          title: "Columns (Desktop)",
          default: 3,
        },
        gap: {
          type: "number",
          title: "Grid Gap",
          default: 24,
        },
        icon_color: {
          type: "string",
          title: "Icon Color",
          default: "#4F46E5",
        }
      }
    }
  },
  "countdown-timer": {
    id: "countdown-timer",
    name: "Countdown Timer",
    category: "Promotions",
    schema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          title: "Heading",
          default: "Flash Sale Ending Soon",
        },
        end_time: {
          type: "string",
          title: "End Time (ISO Date)",
          default: "2026-12-31T23:59:59Z",
        },
        bg_color: {
          type: "string",
          title: "Background Color",
          default: "#B8860B",
        }
      }
    }
  },
  "email-popup": {
    id: "email-popup",
    name: "Email Capture Popup",
    category: "Lead Gen",
    schema: {
      type: "object",
      properties: {
        heading: {
          type: "string",
          title: "Popup Heading",
          default: "Get 15% Off Your First Order",
        },
        discount_code: {
          type: "string",
          title: "Discount Code To Give",
          default: "WELCOME15",
        }
      }
    }
  }
};

export function getSectionSchema(id) {
  return SECTION_REGISTRY[id]?.schema || null;
}

export function getAllSections() {
  return Object.values(SECTION_REGISTRY);
}

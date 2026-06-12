export type CampaignTemplate = {
  key: string;
  name: string;
  json: any;
};

// These are mock baseline JSON templates.
// They would be expanded with actual layout data and section blocks.

export const campaignTemplates: Record<string, CampaignTemplate> = {
  "diwali": {
    key: "diwali",
    name: "Diwali Mega Sale",
    json: {
      sections: {
        hero: {
          type: "hero-banner",
          settings: {
            title: "Diwali Mega Sale",
            subtitle: "Up to 50% Off Everything"
          }
        },
        countdown: {
          type: "countdown-timer",
          settings: {
            title: "Offer Ends Soon!"
          }
        },
        products: {
          type: "featured-collection"
        }
      },
      order: ["hero", "countdown", "products"]
    }
  },
  "eoss": {
    key: "eoss",
    name: "End of Season Sale",
    json: {
      sections: {
        hero: {
          type: "hero-banner",
          settings: {
            title: "End of Season Sale",
            subtitle: "Clearance starts now"
          }
        },
        products: {
          type: "featured-collection"
        }
      },
      order: ["hero", "products"]
    }
  },
  "new-launch": {
    key: "new-launch",
    name: "New Collection Launch",
    json: {
      sections: {
        hero: {
          type: "hero-banner",
          settings: {
            title: "New Collection",
            subtitle: "Discover the latest trends"
          }
        },
        products: {
          type: "featured-collection"
        }
      },
      order: ["hero", "products"]
    }
  },
  "wedding": {
    key: "wedding",
    name: "Wedding Season",
    json: {
      sections: {
        hero: {
          type: "hero-banner",
          settings: {
            title: "The Wedding Edit",
            subtitle: "Celebrate in style"
          }
        },
        products: {
          type: "featured-collection"
        }
      },
      order: ["hero", "products"]
    }
  },
  "rakhi": {
    key: "rakhi",
    name: "Rakhi Special",
    json: {
      sections: {
        hero: {
          type: "hero-banner",
          settings: {
            title: "Rakhi Special",
            subtitle: "Gifts for your sibling"
          }
        },
        products: {
          type: "featured-collection"
        }
      },
      order: ["hero", "products"]
    }
  },
  "valentines": {
    key: "valentines",
    name: "Valentine's Day",
    json: {
      sections: {
        hero: {
          type: "hero-banner",
          settings: {
            title: "Valentine's Day",
            subtitle: "Gifts they will love"
          }
        },
        products: {
          type: "featured-collection"
        }
      },
      order: ["hero", "products"]
    }
  },
  "national-sale": {
    key: "national-sale",
    name: "Republic/Independence Day",
    json: {
      sections: {
        hero: {
          type: "hero-banner",
          settings: {
            title: "Freedom Sale",
            subtitle: "Celebrate with massive discounts"
          }
        },
        products: {
          type: "featured-collection"
        }
      },
      order: ["hero", "products"]
    }
  }
};

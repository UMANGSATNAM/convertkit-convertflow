import { ImageRole } from "../../services/theme-engine/image-assignment.server";

export interface PlaceholderImage {
  id: string; // filename identifier e.g. "placeholder-beauty-hero-1.jpg"
  url: string; // royalty-free commercial-use Unsplash URL
  role: ImageRole;
  description: string;
}

export type NichePackName = "beauty" | "jewellery" | "fashion" | "wellness" | "grooming";

export const NICHE_PLACEHOLDER_PACKS: Record<NichePackName, PlaceholderImage[]> = {
  beauty: [
    {
      id: "placeholder-beauty-hero-1.jpg",
      url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1600&auto=format&fit=crop",
      role: "hero_lifestyle",
      description: "Model applying luxury face oil dropper in soft studio lighting"
    },
    {
      id: "placeholder-beauty-hero-2.jpg",
      url: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1600&auto=format&fit=crop",
      role: "hero_lifestyle",
      description: "High-end skincare bottles arranged on minimal stone vanity"
    },
    {
      id: "placeholder-beauty-lookbook-1.jpg",
      url: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=1600&auto=format&fit=crop",
      role: "lookbook_editorial",
      description: "Editorial shot of botanical face oil ritual with natural shadow play"
    },
    {
      id: "placeholder-beauty-lookbook-2.jpg",
      url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1600&auto=format&fit=crop",
      role: "lookbook_editorial",
      description: "Luxury minimal cream jar on travertine pedestal"
    },
    {
      id: "placeholder-beauty-texture-1.jpg",
      url: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=1600&auto=format&fit=crop",
      role: "texture_ingredient",
      description: "Rich hydrating face cream macro texture smear"
    },
    {
      id: "placeholder-beauty-texture-2.jpg",
      url: "https://images.unsplash.com/photo-1608248597359-0e6d526a67e3?q=80&w=1600&auto=format&fit=crop",
      role: "texture_ingredient",
      description: "Amber glass botanical elixir serum with macro droplets"
    },
    {
      id: "placeholder-beauty-texture-3.jpg",
      url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1600&auto=format&fit=crop",
      role: "texture_ingredient",
      description: "Golden botanical oil infusion macro flatlay"
    },
    {
      id: "placeholder-beauty-avatar-1.jpg",
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
      role: "portrait_avatar",
      description: "Portrait of confident South Asian woman with glowing skin"
    },
    {
      id: "placeholder-beauty-avatar-2.jpg",
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
      role: "portrait_avatar",
      description: "Portrait of young professional man with well-groomed skin"
    },
    {
      id: "placeholder-beauty-avatar-3.jpg",
      url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop",
      role: "portrait_avatar",
      description: "Portrait of young woman smiling naturally"
    },
    {
      id: "placeholder-beauty-avatar-4.jpg",
      url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
      role: "portrait_avatar",
      description: "Portrait of man in casual elegant wear"
    },
    {
      id: "placeholder-beauty-avatar-5.jpg",
      url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
      role: "portrait_avatar",
      description: "Portrait of woman with soft studio lighting"
    }
  ],
  jewellery: [
    {
      id: "placeholder-jewellery-hero-1.jpg",
      url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1600&auto=format&fit=crop",
      role: "hero_lifestyle",
      description: "Woman wearing fine gold diamond necklace in editorial lighting"
    },
    {
      id: "placeholder-jewellery-lookbook-1.jpg",
      url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1600&auto=format&fit=crop",
      role: "lookbook_editorial",
      description: "Gold rings and bracelets arranged on velvet tray"
    },
    {
      id: "placeholder-jewellery-texture-1.jpg",
      url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1600&auto=format&fit=crop",
      role: "texture_ingredient",
      description: "Macro artisan gold texture and sparkling gemstones"
    },
    {
      id: "placeholder-jewellery-avatar-1.jpg",
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
      role: "portrait_avatar",
      description: "Portrait of customer wearing fine jewellery"
    }
  ],
  fashion: [
    {
      id: "placeholder-fashion-hero-1.jpg",
      url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop",
      role: "hero_lifestyle",
      description: "High fashion editorial runway and lifestyle look"
    },
    {
      id: "placeholder-fashion-lookbook-1.jpg",
      url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop",
      role: "lookbook_editorial",
      description: "Woman shopping in luxury fashion boutique"
    },
    {
      id: "placeholder-fashion-texture-1.jpg",
      url: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1600&auto=format&fit=crop",
      role: "texture_ingredient",
      description: "Premium woven wool and silk fabric weave macro"
    },
    {
      id: "placeholder-fashion-avatar-1.jpg",
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
      role: "portrait_avatar",
      description: "Portrait of stylish client"
    }
  ],
  wellness: [
    {
      id: "placeholder-wellness-hero-1.jpg",
      url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1600&auto=format&fit=crop",
      role: "hero_lifestyle",
      description: "Serene wellness spa and organic herbal tea setup"
    },
    {
      id: "placeholder-wellness-lookbook-1.jpg",
      url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1600&auto=format&fit=crop",
      role: "lookbook_editorial",
      description: "Holistic wellness meditation ritual in sunlit room"
    },
    {
      id: "placeholder-wellness-texture-1.jpg",
      url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=1600&auto=format&fit=crop",
      role: "texture_ingredient",
      description: "Organic dried herbs and apothecary botanicals"
    },
    {
      id: "placeholder-wellness-avatar-1.jpg",
      url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop",
      role: "portrait_avatar",
      description: "Portrait of wellness customer"
    }
  ],
  grooming: [
    {
      id: "placeholder-grooming-hero-1.jpg",
      url: "https://images.unsplash.com/photo-1621607512214-68297480165e?q=80&w=1600&auto=format&fit=crop",
      role: "hero_lifestyle",
      description: "Modern luxury men grooming kit and beard oil display"
    },
    {
      id: "placeholder-grooming-lookbook-1.jpg",
      url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1600&auto=format&fit=crop",
      role: "lookbook_editorial",
      description: "Well-groomed gentleman adjusting collar"
    },
    {
      id: "placeholder-grooming-texture-1.jpg",
      url: "https://images.unsplash.com/photo-1585232351009-aa87416fca90?q=80&w=1600&auto=format&fit=crop",
      role: "texture_ingredient",
      description: "Rich lather shaving cream and badger brush macro"
    },
    {
      id: "placeholder-grooming-avatar-1.jpg",
      url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
      role: "portrait_avatar",
      description: "Portrait of male grooming client"
    }
  ]
};

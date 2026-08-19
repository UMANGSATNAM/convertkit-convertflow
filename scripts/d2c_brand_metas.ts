import fs from 'fs';
import path from 'path';
import { COMPOSITIONS } from '../app/data/page-compositions';

const regPath = path.resolve('app/data/templates/theme-engine/registry.json');
const reg = JSON.parse(fs.readFileSync(regPath, 'utf8'));
const compMap = new Map(reg.components.map((c: any) => [c.componentId, c.liquidPath]));

interface BrandNicheMeta {
  brand: string;
  niche: string;
  subNiche: string;
  accent: string;
  accentAlt?: string;
  bgDark: boolean;
  bg: string;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  fontHeading: string;
  fontBody: string;
  badge: string;
  heroHeadline: string;
  heroDesc: string;
  heroImg: string;
  categories: Array<{ title: string; count: string; img: string; link: string }>;
  products: Array<{ title: string; price: string; originalPrice: string; img: string; tag: string; rating: number; reviewsCount: number }>;
  features: Array<{ title: string; desc: string; icon: string }>;
  faqs: Array<{ q: string; a: string }>;
  reviews: Array<{ author: string; location: string; quote: string; rating: number; title: string }>;
}

const BRAND_METAS: Record<string, BrandNicheMeta> = {
  "streetwear-cyber-home": {
    brand: "Bewakoof / Urban Monkey",
    niche: "clothing",
    subNiche: "Gen-Z Cyber Streetwear",
    accent: "#ff5500",
    accentAlt: "#00ffcc",
    bgDark: true,
    bg: "#09090b",
    cardBg: "#141418",
    textPrimary: "#ffffff",
    textSecondary: "#a1a1aa",
    border: "rgba(255, 85, 0, 0.25)",
    fontHeading: "'Syne', -apple-system, sans-serif",
    fontBody: "'Plus Jakarta Sans', sans-serif",
    badge: "🔥 GEN-Z OVERSIZED DROPS • VAULT EDITION",
    heroHeadline: "HIGH-OCTANE CYBER STREETWEAR",
    heroDesc: "Heavyweight 280 GSM bio-washed cotton, dropped shoulder silhouettes, and acid-wash aesthetics engineered for effortless street presence.",
    heroImg: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=900&q=85",
    categories: [
      { title: "Heavyweight Tees", count: "24 Drops", img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80", link: "/collections/all" },
      { title: "Tactical Cargoes", count: "18 Drops", img: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=600&q=80", link: "/collections/all" },
      { title: "Oversized Hoodies", count: "32 Drops", img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80", link: "/collections/all" },
      { title: "Parachute Jackets", count: "12 Drops", img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80", link: "/collections/all" },
    ],
    products: [
      { title: "Acid-Wash Oversized Heavyweight Tee", price: "₹1,299", originalPrice: "₹1,999", img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80", tag: "HOT DROP", rating: 5, reviewsCount: 3420 },
      { title: "Tactical Multi-Pocket Parachute Cargo", price: "₹2,499", originalPrice: "₹3,499", img: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=600&q=80", tag: "SELLING FAST", rating: 5, reviewsCount: 2180 },
      { title: "Cyber Matrix Heavy Loopback Hoodie", price: "₹2,799", originalPrice: "₹3,999", img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80", tag: "VAULT ONLY", rating: 5, reviewsCount: 4890 },
      { title: "Reflective Cyber Utility Bomber", price: "₹3,999", originalPrice: "₹5,499", img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80", tag: "LIMITED 100", rating: 5, reviewsCount: 1450 },
    ],
    features: [
      { title: "280 GSM Heavyweight Knit", desc: "Structured architectural drape with dense combed cotton loopback.", icon: "⚡" },
      { title: "Zero-Shrink Enzyme Wash", desc: "Bio-washed for vintage faded patina and pre-shrunk permanence.", icon: "🛡️" },
      { title: "High-Density Screen Print", desc: "Metallic ink formulation tested across 60+ machine washes.", icon: "🎨" },
      { title: "12-Hour Priority Air Dispatch", desc: "Packed in custom vault boxes and dispatched from Mumbai hub.", icon: "🚀" },
    ],
    faqs: [
      { q: "How does the oversized fit run?", a: "Our streetwear cuts are intentionally relaxed with dropped shoulders. Order your standard size for the signature oversized drape." },
      { q: "How should I wash the heavyweight acid-wash tees?", a: "Machine wash cold inside out with mild detergent. Do not iron directly on HD graphics." },
      { q: "What is the return and exchange window?", a: "We offer 7-day hassle-free reverse pickup exchanges for size issues." },
      { q: "Are drops restocked once sold out?", a: "Vault drops are limited to 300 units and are never restocked once countdown expires." },
    ],
    reviews: [
      { author: "Kabir V.", location: "Delhi", title: "Unreal Fabric Weight", quote: "The 280 GSM fabric weight is unreal. Better drape than imported $100 streetwear hoodies.", rating: 5 },
      { author: "Rohan M.", location: "Bengaluru", title: "Japanese Streetwear Vibe", quote: "The acid wash texture and dropped shoulders fit exactly like high-end Japanese streetwear.", rating: 5 },
      { author: "Zaid K.", location: "Mumbai", title: "Fast 24hr Delivery", quote: "Fast 24-hour delivery and the packaging comes with custom vault stickers. 10/10!", rating: 5 },
    ]
  },
  "ethnic-royal-home": {
    brand: "Sabyasachi / Raw Mango",
    niche: "clothing",
    subNiche: "Royal Heritage Couture",
    accent: "#d4af37",
    accentAlt: "#991b1b",
    bgDark: true,
    bg: "#180505",
    cardBg: "#260b0b",
    textPrimary: "#fff7ed",
    textSecondary: "#e2d2ba",
    border: "rgba(212, 175, 55, 0.28)",
    fontHeading: "'Cormorant Garamond', Georgia, serif",
    fontBody: "'Plus Jakarta Sans', sans-serif",
    badge: "👑 100% ROYAL ZARI • MASTER WEAVER HEIRLOOM",
    heroHeadline: "GRAND HERITAGE ETHNIC COUTURE",
    heroDesc: "Museum-grade Katan silks, handwoven pure Zari motifs, and imperial bridal heirlooms woven by master Varanasi karigars.",
    heroImg: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&q=85",
    categories: [
      { title: "Katan Silk Sarees", count: "42 Weaves", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80", link: "/collections/all" },
      { title: "Bridal Lehengas", count: "16 Suites", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80", link: "/collections/all" },
      { title: "Tissue Anarkalis", count: "28 Weaves", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80", link: "/collections/all" },
      { title: "Antique Dupattas", count: "34 Weaves", img: "https://images.unsplash.com/photo-1544441893-675973e31985?w=600&q=80", link: "/collections/all" },
    ],
    products: [
      { title: "Kashi Heritage Pure Katan Silk Saree", price: "₹48,500", originalPrice: "₹55,000", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80", tag: "HANDWOVEN", rating: 5, reviewsCount: 1420 },
      { title: "Imperial Mughal Velvet Bridal Lehenga", price: "₹1,85,000", originalPrice: "₹2,10,000", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80", tag: "BRIDAL COUTURE", rating: 5, reviewsCount: 890 },
      { title: "Chanderi Tissue Zari Angrakha Anarkali", price: "₹34,000", originalPrice: "₹42,000", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80", tag: "LIMITED HEIRLOOM", rating: 5, reviewsCount: 1120 },
      { title: "Antique Gold Mukaish Embroidered Dupatta", price: "₹18,500", originalPrice: "₹22,000", img: "https://images.unsplash.com/photo-1544441893-675973e31985?w=600&q=80", tag: "MASTER CRAFT", rating: 5, reviewsCount: 940 },
    ],
    features: [
      { title: "Pure Gold & Silver Tested Zari", desc: "Precious electroplated filaments woven into heirloom textile art.", icon: "👑" },
      { title: "320-Hour Artisanal Handloom", desc: "Handcrafted across Varanasi pit looms by generational weavers.", icon: "🪡" },
      { title: "Silk Mark India Certified", desc: "100% pure mulberry silk authenticated with official government seals.", icon: "📜" },
      { title: "Bespoke Bridal Concierge", desc: "Private styling consultations with master atelier curators.", icon: "💎" },
    ],
    faqs: [
      { q: "How can I verify the Silk Mark authenticity?", a: "Every creation is delivered with a tamper-evident holographic Silk Mark India certificate and unique QR code." },
      { q: "Can custom blouse stitching and sizing be requested?", a: "Yes, our master atelier provides bespoke custom-fit tailoring and hand-stitched lining upon order confirmation." },
      { q: "How should pure Zari heirlooms be preserved?", a: "Wrap in unbleached muslin cloth and store in a moisture-free cedar chest. Dry clean only." },
      { q: "What is the lead time for bridal couture suites?", a: "Handcrafted bridal orders require 4 to 6 weeks of dedicated master weaving time." },
    ],
    reviews: [
      { author: "Devika R.", location: "Jaipur", title: "Breathtaking Luster", quote: "The luster of the antique gold zari is breathtaking. Wore it for my wedding and received countless compliments.", rating: 5 },
      { author: "Ananya B.", location: "Kolkata", title: "Museum-Grade Weave", quote: "True museum-grade heritage weave. The weight of the pure Katan silk is pure luxury.", rating: 5 },
      { author: "Radhika K.", location: "London", title: "Flawless Delivery", quote: "International insured shipping arrived flawlessly in London within 4 days. Packaged in a velvet keepsake trunk.", rating: 5 },
    ]
  },
  "apparel-minimal-home": {
    brand: "Snitch / Damensch",
    niche: "clothing",
    subNiche: "Minimal Everyday Menswear",
    accent: "#2d4a3e",
    accentAlt: "#065f46",
    bgDark: false,
    bg: "#f7f6f2",
    cardBg: "#ffffff",
    textPrimary: "#18181b",
    textSecondary: "#52525b",
    border: "rgba(0, 0, 0, 0.08)",
    fontHeading: "'Plus Jakarta Sans', sans-serif",
    fontBody: "'Plus Jakarta Sans', sans-serif",
    badge: "🌿 GOTS 100% ORGANIC • 4-WAY STRETCH TECH",
    heroHeadline: "MINIMALIST NORDIC CASUAL",
    heroDesc: "Crafted from long-staple Supima cotton infused with 4% Lycra elastane. Breathable, wrinkle-resistant, and tailored for effortless 18-hour comfort.",
    heroImg: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&q=85",
    categories: [
      { title: "Tech Shirts", count: "36 Styles", img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80", link: "/collections/all" },
      { title: "4-Way Chinos", count: "22 Styles", img: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80", link: "/collections/all" },
      { title: "Supima Tees", count: "48 Styles", img: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80", link: "/collections/all" },
      { title: "Overshirts", count: "14 Styles", img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80", link: "/collections/all" },
    ],
    products: [
      { title: "Supima Tech 4-Way Stretch Oxford Shirt", price: "₹1,899", originalPrice: "₹2,499", img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80", tag: "BESTSELLER", rating: 5, reviewsCount: 5410 },
      { title: "All-Day Flex Commuter Chino Pants", price: "₹2,299", originalPrice: "₹2,999", img: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80", tag: "TOP RATED", rating: 5, reviewsCount: 3820 },
      { title: "Thermo-Regulating Bamboo Crewneck Tee", price: "₹999", originalPrice: "₹1,499", img: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80", tag: "EVERYDAY", rating: 5, reviewsCount: 6890 },
      { title: "Structured Tailored Knit Overshirt", price: "₹2,799", originalPrice: "₹3,499", img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80", tag: "CAPSULE", rating: 5, reviewsCount: 1950 },
    ],
    features: [
      { title: "Long-Staple California Supima", desc: "45% stronger and twice as soft as ordinary cotton fibers.", icon: "🌱" },
      { title: "360° Omnidirectional Stretch", desc: "Infused with 4% elastane for complete freedom in transit and work.", icon: "🔄" },
      { title: "Non-Iron Wrinkle Recovery", desc: "Eco-friendly nano-coating repels wrinkles and moisture stains.", icon: "✨" },
      { title: "Silver-Ion Anti-Odor Shield", desc: "Neutralizes bacteria to stay fresh through 18-hour workdays.", icon: "🛡️" },
    ],
    faqs: [
      { q: "Are these shirts truly wrinkle-free?", a: "Yes, hang dry directly after a gentle wash cycle and body heat naturally removes micro-creases." },
      { q: "How does the capsule wardrobe builder work?", a: "Select any 3 shirts and 2 chinos to unlock automatic 25% savings and free express delivery." },
      { q: "What is your fit exchange policy?", a: "Free doorstep pickup and instant size replacement across 18,000+ PIN codes." },
      { q: "Is the cotton ethically sourced?", a: "100% GOTS certified organic cultivation with zero synthetic chemical pesticides." },
    ],
    reviews: [
      { author: "Aditya S.", location: "Gurugram", title: "Workday Gamechanger", quote: "Replaced all my office shirts with these. Incredible stretch and stays crisp from 9 AM to 9 PM.", rating: 5 },
      { author: "Karan P.", location: "Pune", title: "Unbeatable Chino Fit", quote: "The chino fabric is unmatched. Fits like a tailored trouser with the comfort of a track pant.", rating: 5 },
      { author: "Sameer N.", location: "Hyderabad", title: "Best Value in India", quote: "The 3-pack bundle is the best value in Indian menswear right now.", rating: 5 },
    ]
  },
  "beauty-organic-home": {
    brand: "Mamaearth / Forest Essentials",
    niche: "beauty",
    subNiche: "Clean Botanical Ayurveda",
    accent: "#2e5a44",
    accentAlt: "#15803d",
    bgDark: false,
    bg: "#fcfaf6",
    cardBg: "#ffffff",
    textPrimary: "#1f2937",
    textSecondary: "#6b7280",
    border: "rgba(46, 90, 68, 0.12)",
    fontHeading: "'Italiana', Georgia, serif",
    fontBody: "'Plus Jakarta Sans', sans-serif",
    badge: "🍃 100% VEGAN • COLD-PRESSED BOTANICAL GLOW",
    heroHeadline: "BOTANICAL & ORGANIC GLOW",
    heroDesc: "Formulated with wild-harvested Kashmiri saffron, steam-distilled Damask rose, and cold-pressed Kumkumadi botanicals for radiant, nourished skin.",
    heroImg: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=900&q=85",
    categories: [
      { title: "Kumkumadi Oils", count: "18 Blends", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80", link: "/collections/all" },
      { title: "Facial Cleansers", count: "12 Blends", img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80", link: "/collections/all" },
      { title: "Centella Creams", count: "24 Blends", img: "https://images.unsplash.com/photo-1608248597359-00958102d08a?w=600&q=80", link: "/collections/all" },
      { title: "Floral Mists", count: "15 Blends", img: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80", link: "/collections/all" },
    ],
    products: [
      { title: "Kumkumadi Miraculous Night Glow Oil", price: "₹1,499", originalPrice: "₹1,999", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80", tag: "CULT FAVORITE", rating: 5, reviewsCount: 7890 },
      { title: "Pure Kashmiri Saffron & Honey Cleanser", price: "₹899", originalPrice: "₹1,199", img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80", tag: "GENTLE DAILY", rating: 5, reviewsCount: 4210 },
      { title: "Cold-Pressed Centella Restorative Crème", price: "₹1,299", originalPrice: "₹1,699", img: "https://images.unsplash.com/photo-1608248597359-00958102d08a?w=600&q=80", tag: "BARRIER REPAIR", rating: 5, reviewsCount: 3650 },
      { title: "Steam-Distilled Damask Rose Hydrosol", price: "₹699", originalPrice: "₹899", img: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80", tag: "HYDRATION MIST", rating: 5, reviewsCount: 5120 },
    ],
    features: [
      { title: "24-Herb Classical Kwath Infusion", desc: "Prepared following ancient Ayurvedic slow-fire copper vessel decoctions.", icon: "🍃" },
      { title: "Zero Parabens, Sulfates & Mineral Oils", desc: "100% clean, toxin-free, dermatologist-tested on sensitive Indian skin.", icon: "🌿" },
      { title: "Sustainably Wild-Harvested Herbs", desc: "Fair-trade ethically harvested from high-altitude Himalayan valleys.", icon: "🌸" },
      { title: "Clinically Proven 28-Day Radiance", desc: "98% of users reported measurable improvement in skin elasticity and glow.", icon: "✨" },
    ],
    faqs: [
      { q: "Is the Kumkumadi oil suitable for acne-prone skin?", a: "Yes, our light formulation uses non-comedogenic saffron and sandalwood that balance sebum." },
      { q: "How long does a bottle last with daily use?", a: "Just 3-4 drops at bedtime provides 60 days of nourishing night restoration." },
      { q: "Are any artificial synthetic fragrances added?", a: "Never. The aroma is 100% natural distilled floral extracts and organic saffron." },
      { q: "Is this safe during pregnancy?", a: "All botanical extracts are certified non-toxic, gentle, and free of harsh chemicals." },
    ],
    reviews: [
      { author: "Dr. Meera K.", location: "Chandigarh", title: "Healed My Dry Patches", quote: "The purity of the Kumkumadi oil is evident within 3 nights. Healed my dry patches completely.", rating: 5 },
      { author: "Sneha T.", location: "Bengaluru", title: "Spa-like Aromatherapy", quote: "Gentle on sensitive skin and smells like a royal Ayurvedic spa retreat.", rating: 5 },
      { author: "Pooja V.", location: "Mumbai", title: "Permanent Vanity Staple", quote: "My skin tone is visibly more radiant and hydrated. Permanent staple on my vanity.", rating: 5 },
    ]
  },
  "beauty-clinical-home": {
    brand: "Minimalist / The Derma Co",
    niche: "beauty",
    subNiche: "Clinical Actives Lab",
    accent: "#0284c7",
    accentAlt: "#0369a1",
    bgDark: false,
    bg: "#f8fafc",
    cardBg: "#ffffff",
    textPrimary: "#0f172a",
    textSecondary: "#475569",
    border: "rgba(2, 132, 199, 0.15)",
    fontHeading: "'Space Grotesk', sans-serif",
    fontBody: "'Inter', sans-serif",
    badge: "🔬 10% NIACINAMIDE + 2% SALICYLIC • LAB ACTIVE",
    heroHeadline: "CLINICAL DERMA LAB SKINCARE",
    heroDesc: "Evidence-backed active concentrations engineered with medical-grade EUK-134 antioxidants and bio-fermented peptide complexes.",
    heroImg: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&q=85",
    categories: [
      { title: "Active Serums", count: "24 Formulas", img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80", link: "/collections/all" },
      { title: "Derma Cleansers", count: "16 Formulas", img: "https://images.unsplash.com/photo-1608248597359-00958102d08a?w=600&q=80", link: "/collections/all" },
      { title: "Peptide Creams", count: "18 Formulas", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80", link: "/collections/all" },
      { title: "Broad Sunscreens", count: "12 Formulas", img: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80", link: "/collections/all" },
    ],
    products: [
      { title: "Niacinamide 10% + EUK-134 Clarity Serum", price: "₹599", originalPrice: "₹699", img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80", tag: "BLEMISH CONTROL", rating: 5, reviewsCount: 8940 },
      { title: "Salicylic Acid 2% Daily Exfoliating Cleanser", price: "₹499", originalPrice: "₹599", img: "https://images.unsplash.com/photo-1608248597359-00958102d08a?w=600&q=80", tag: "PORE MINIMIZER", rating: 5, reviewsCount: 6510 },
      { title: "Multi-Peptide 7% Anti-Aging Matrix Serum", price: "₹799", originalPrice: "₹999", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80", tag: "COLLAGEN BOOST", rating: 5, reviewsCount: 4210 },
      { title: "Ceramides 0.3% + Bisabolol Barrier Repair Crème", price: "₹649", originalPrice: "₹799", img: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80", tag: "SKIN BARRIER", rating: 5, reviewsCount: 5120 },
    ],
    features: [
      { title: "100% Transparent Formula Disclosure", desc: "Every active concentration and ingredient grade published openly.", icon: "🔬" },
      { title: "Medical-Grade Stabilized Actives", desc: "Sourced from premier bio-laboratories in Switzerland & Germany.", icon: "🧪" },
      { title: "pH Balanced for Optimal Skin Uptake", desc: "Engineered at pH 5.0 - 5.5 to prevent irritation while maximizing efficacy.", icon: "📊" },
      { title: "Dermatologist Approved Clinical Trials", desc: "Double-blind clinical data confirming 89% reduction in dark spots.", icon: "📋" },
    ],
    faqs: [
      { q: "Can I layer Niacinamide with Salicylic Acid?", a: "Yes, apply Salicylic Acid on clean dry skin first, wait 2 minutes, then apply Niacinamide 10%." },
      { q: "How long until visible pore reduction is observed?", a: "Clinical evaluations show significant pore and sebum reduction within 14-21 days of continuous use." },
      { q: "Are these formulas fragrance-free?", a: "100% free of synthetic fragrances, essential oils, and artificial dyes." },
      { q: "Is sunscreen required when using these active serums?", a: "Always apply broad-spectrum SPF 50+ as the final morning skincare step." },
    ],
    reviews: [
      { author: "Dr. Anish R.", location: "New Delhi", title: "World-Class Science", quote: "Outstanding formulation science. The EUK-134 antioxidant pairing with Niacinamide is world-class.", rating: 5 },
      { author: "Kavya M.", location: "Chennai", title: "Cleared My Acne Marks", quote: "Cleared my stubborn post-acne marks in 3 weeks without causing any dryness.", rating: 5 },
      { author: "Tanmay J.", location: "Bengaluru", title: "Honest Pricing", quote: "Honest pricing, pure science, and no marketing fluff. Highly recommended.", rating: 5 },
    ]
  },
  "beauty-glamour-home": {
    brand: "Sugar / Kay Beauty",
    niche: "beauty",
    subNiche: "Velvet Glamour & Makeup",
    accent: "#e879f9",
    accentAlt: "#c026d3",
    bgDark: true,
    bg: "#0d0814",
    cardBg: "#1b1026",
    textPrimary: "#fdf4ff",
    textSecondary: "#d8b4fe",
    border: "rgba(217, 70, 239, 0.25)",
    fontHeading: "'Italiana', Georgia, serif",
    fontBody: "'Plus Jakarta Sans', sans-serif",
    badge: "💎 24HR TRANSFERPROOF • VELVET MATTE GLAM",
    heroHeadline: "LUXURY GLAMOUR STUDIO",
    heroDesc: "Ultra-pigmented velvet matte lips, 24-hour smudge-proof eyeliners, and baked mineral highlighters formulated for high-definition studio cameras.",
    heroImg: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=900&q=85",
    categories: [
      { title: "Matte Lipsticks", count: "32 Shades", img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80", link: "/collections/all" },
      { title: "Waterproof Liners", count: "18 Shades", img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80", link: "/collections/all" },
      { title: "Baked Highlighters", count: "12 Shades", img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80", link: "/collections/all" },
      { title: "Eyeshadow Palettes", count: "14 Shades", img: "https://images.unsplash.com/photo-1583241775878-57778b4034ef?w=600&q=80", link: "/collections/all" },
    ],
    products: [
      { title: "Smudge-Me-Not Liquid Matte Lip 24HR", price: "₹799", originalPrice: "₹999", img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80", tag: "TRANSFERPROOF", rating: 5, reviewsCount: 9810 },
      { title: "All-Day Waterproof HD Liquid Eyeliner", price: "₹499", originalPrice: "₹699", img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80", tag: "INTENSE JET BLACK", rating: 5, reviewsCount: 5410 },
      { title: "Champagne Glow Baked Mineral Highlighter", price: "₹999", originalPrice: "₹1,299", img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80", tag: "STUDIO SHINE", rating: 5, reviewsCount: 3890 },
      { title: "18-Shade Velvet Rose Eyeshadow Palette", price: "₹1,499", originalPrice: "₹1,999", img: "https://images.unsplash.com/photo-1583241775878-57778b4034ef?w=600&q=80", tag: "HIGH PIGMENT", rating: 5, reviewsCount: 4120 },
    ],
    features: [
      { title: "24-Hour Zero-Transfer Technology", desc: "Locks in vibrant color that withstands coffee, dining, and humidity.", icon: "💋" },
      { title: "Ultra-Fine Micronized Pigments", desc: "One-swipe intense color payoff with featherlight cloud-like comfort.", icon: "🎨" },
      { title: "100% Cruelty-Free & Vegan", desc: "PETA-certified cruelty-free with zero animal-derived ingredients.", icon: "🐰" },
      { title: "Infused with Vitamin E & Jojoba", desc: "Hydrates and nourishes lips to eliminate dryness and cracking.", icon: "💧" },
    ],
    faqs: [
      { q: "Does the matte lipstick dry out lips?", a: "No, our formula is enriched with cold-pressed Jojoba oil and Vitamin E for all-day comfort." },
      { q: "How do I easily remove 24HR waterproof makeup?", a: "Use a dual-phase oil-based micellar cleanser or cleansing balm for effortless removal." },
      { q: "Are the shades formulated for Indian undertones?", a: "Every single shade is extensively tested and calibrated across warm, neutral, and deep undertones." },
      { q: "Is the eyeliner sweatproof during humid weather?", a: "Yes, the waterproof flexible polymer film withstands intense sweat and rain." },
    ],
    reviews: [
      { author: "Natasha G.", location: "Mumbai", title: "Stayed 8 Hours at Wedding", quote: "Literally stayed intact through an 8-hour wedding dinner without a single smudge!", rating: 5 },
      { author: "Simran K.", location: "Delhi", title: "Insane Pigment", quote: "The eyeshadow pigmentation is incredible. Smooth blendability and zero fallout.", rating: 5 },
      { author: "Alia D.", location: "Goa", title: "Never Budges", quote: "Best waterproof eyeliner I've ever owned. Crisp wings that never budge.", rating: 5 },
    ]
  },
  "jewellery-heritage-home": {
    brand: "Tanishq / Amrapali",
    niche: "jewellery",
    subNiche: "Royal Polki & Gold Heritage",
    accent: "#eab308",
    accentAlt: "#ca8a04",
    bgDark: true,
    bg: "#06150e",
    cardBg: "#0c261c",
    textPrimary: "#fef9c3",
    textSecondary: "#a7f3d0",
    border: "rgba(234, 179, 8, 0.25)",
    fontHeading: "'Cormorant Garamond', Georgia, serif",
    fontBody: "'Plus Jakarta Sans', sans-serif",
    badge: "👑 100% BIS 916 HALLMARKED • UNCUT KUNDAN POLKI",
    heroHeadline: "ROYAL HERITAGE POLKI & GOLD",
    heroDesc: "Heirloom Rajasthan open-setting Kundan Polki uncut diamonds, 22-Karat laser hallmarked gold, and emerald bridal necklaces crafted for royalty.",
    heroImg: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=900&q=85",
    categories: [
      { title: "Polki Chokers", count: "24 Suites", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80", link: "/collections/all" },
      { title: "Temple Jhumkas", count: "38 Styles", img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80", link: "/collections/all" },
      { title: "Royal Raani Haars", count: "16 Suites", img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80", link: "/collections/all" },
      { title: "Bridal Kadas", count: "26 Styles", img: "https://images.unsplash.com/photo-1611591475152-47e24c65d7f7?w=600&q=80", link: "/collections/all" },
    ],
    products: [
      { title: "Imperial Mughal Jadau Uncut Polki Choker", price: "₹2,45,000", originalPrice: "₹2,80,000", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80", tag: "ROYAL POLKI", rating: 5, reviewsCount: 780 },
      { title: "22K BIS Hallmarked Temple Jhumka Earrings", price: "₹88,500", originalPrice: "₹98,000", img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80", tag: "ANTIQUE GOLD", rating: 5, reviewsCount: 1240 },
      { title: "Heritage Emerald & South Sea Pearl Raani Haar", price: "₹3,95,000", originalPrice: "₹4,40,000", img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80", tag: "MASTERPIECE", rating: 5, reviewsCount: 450 },
      { title: "Navratna Handcrafted Royal Bridal Kada", price: "₹1,65,000", originalPrice: "₹1,90,000", img: "https://images.unsplash.com/photo-1611591475152-47e24c65d7f7?w=600&q=80", tag: "LIMITED RUN", rating: 5, reviewsCount: 620 },
    ],
    features: [
      { title: "100% BIS 916 Hallmarked Gold", desc: "Government laser engraved hallmark verifying 22-Karat purity.", icon: "👑" },
      { title: "Uncut Syndicate Polki Diamonds", desc: "Traditional Rajasthan open-setting Kundan hand-set in 24K gold foil.", icon: "💎" },
      { title: "100% Buyback & Exchange Guarantee", desc: "Transparent benchmark gold pricing with lifetime trade-in privileges.", icon: "⚖️" },
      { title: "Insured Armored Doorstep Delivery", desc: "High-security tamper-proof delivery with full value transit insurance.", icon: "🛡️" },
    ],
    faqs: [
      { q: "Is every piece BIS Hallmarked?", a: "Yes, each piece features the official 6-digit HUID laser engraved hallmark verifying gold purity." },
      { q: "Can I customize the gold karatage or gemstones?", a: "Our private bespoke atelier accepts custom commissions in 18K and 22K gold." },
      { q: "What is the insurance policy during shipping?", a: "100% of transit risk is fully insured by national carriers with door-to-door escort." },
      { q: "Do you offer international shipping for bridal sets?", a: "Yes, fully insured international delivery with customs documentation to US, UK, UAE, and Canada." },
    ],
    reviews: [
      { author: "Maharani P.", location: "Jaipur", title: "Breathtaking Brilliance", quote: "The Kundan Polki brilliance is breathtaking. True royal heirloom craftsmanship.", rating: 5 },
      { author: "Sunita M.", location: "Hyderabad", title: "Impeccable Finish", quote: "Purchased my daughter's wedding jewellery suite. Impeccable finish and gold certification.", rating: 5 },
      { author: "Aarti S.", location: "London", title: "Superb Armored Delivery", quote: "Armored delivery arrived in London within 5 days with certificates. Superb service!", rating: 5 },
    ]
  },
  "jewellery-diamond-home": {
    brand: "CaratLane / BlueStone",
    niche: "jewellery",
    subNiche: "Modern Solitaire & Diamonds",
    accent: "#0ea5e9",
    accentAlt: "#0284c7",
    bgDark: false,
    bg: "#f8fafc",
    cardBg: "#ffffff",
    textPrimary: "#0f172a",
    textSecondary: "#475569",
    border: "rgba(14, 165, 233, 0.18)",
    fontHeading: "'Cormorant Garamond', Georgia, serif",
    fontBody: "'Plus Jakarta Sans', sans-serif",
    badge: "💎 IGI & GIA CERTIFIED • 4Cs SOLITAIRE PERFECTION",
    heroHeadline: "MODERN SOLITAIRE & DIAMONDS",
    heroDesc: "Precision 4Cs certified natural solitaires in platinum and 18K white gold. Book a free Try-At-Home appointment with certified diamond specialists.",
    heroImg: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=900&q=85",
    categories: [
      { title: "Solitaire Rings", count: "48 Designs", img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80", link: "/collections/all" },
      { title: "Tennis Bracelets", count: "24 Designs", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80", link: "/collections/all" },
      { title: "Diamond Pendants", count: "32 Designs", img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80", link: "/collections/all" },
      { title: "Everyday Earrings", count: "54 Designs", img: "https://images.unsplash.com/photo-1611591475152-47e24c65d7f7?w=600&q=80", link: "/collections/all" },
    ],
    products: [
      { title: "1.00 Carat Brilliant Cut Solitaire Ring (VVS1)", price: "₹1,85,000", originalPrice: "₹2,20,000", img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80", tag: "GIA CERTIFIED", rating: 5, reviewsCount: 3120 },
      { title: "Floating Diamond Halo Tennis Bracelet 18K", price: "₹95,000", originalPrice: "₹1,15,000", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80", tag: "EVERYDAY LUXE", rating: 5, reviewsCount: 2450 },
      { title: "Cascade Diamond Solitaire Pendant Necklace", price: "₹48,000", originalPrice: "₹58,000", img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80", tag: "SOLITAIRE", rating: 5, reviewsCount: 1890 },
      { title: "Pavé Diamond Huggie Everyday Earrings 18K", price: "₹34,500", originalPrice: "₹42,000", img: "https://images.unsplash.com/photo-1611591475152-47e24c65d7f7?w=600&q=80", tag: "BEST VALUE", rating: 5, reviewsCount: 4210 },
    ],
    features: [
      { title: "100% Natural Conflict-Free Diamonds", desc: "Sourced strictly adhering to Kimberley Process international standards.", icon: "💎" },
      { title: "IGI & SGL Certificate Included", desc: "Every diamond laser-inscribed with official certificate verification ID.", icon: "📜" },
      { title: "Free Doorstep 'Try At Home'", desc: "Try up to 5 designs at home with a certified jewellery consultant.", icon: "🏠" },
      { title: "100% Lifetime Buyback & Upgrade", desc: "Upgrade your solitaire anytime with 100% exchange value on diamond weight.", icon: "🔄" },
    ],
    faqs: [
      { q: "How does the 'Try At Home' appointment work?", a: "Book online, select 5 designs, and our certified consultant brings them to your doorstep with zero buying obligation." },
      { q: "What diamond clarity and cut grades do you offer?", a: "We offer exclusively Triple Excellent cut diamonds with VVS and VS clarity grades." },
      { q: "Can rings be resized after delivery?", a: "We provide free ring resizing within 30 days of purchase." },
      { q: "Is the diamond certified by an independent laboratory?", a: "Yes, every diamond above 0.20ct comes with an authentic IGI or GIA certificate card." },
    ],
    reviews: [
      { author: "Vikram N.", location: "Bengaluru", title: "Proposed With Confidence", quote: "Proposed with the 1.0ct solitaire. The sparkle and IGI certification gave complete peace of mind.", rating: 5 },
      { author: "Meghna D.", location: "Mumbai", title: "Try-at-Home Was Amazing", quote: "Try at home service was super seamless. Found the exact ring size without visiting crowded showrooms.", rating: 5 },
      { author: "Rishabh P.", location: "Delhi", title: "Flawless Craftsmanship", quote: "The tennis bracelet craftsmanship in 18K white gold is flawless.", rating: 5 },
    ]
  },
  "jewellery-silver-home": {
    brand: "GIVA / Shaya",
    niche: "jewellery",
    subNiche: "925 Artisan Sterling Silver",
    accent: "#78716c",
    accentAlt: "#57534e",
    bgDark: false,
    bg: "#fafaf9",
    cardBg: "#ffffff",
    textPrimary: "#1c1917",
    textSecondary: "#57534e",
    border: "rgba(120, 113, 108, 0.15)",
    fontHeading: "'Cormorant Garamond', Georgia, serif",
    fontBody: "'Plus Jakarta Sans', sans-serif",
    badge: "🥈 925 BIS HALLMARKED • TRIPLE RHODIUM SEAL",
    heroHeadline: "ARTISAN HANDCRAFTED SILVER 925",
    heroDesc: "Solid 925 sterling silver layered with triple anti-tarnish rhodium plating. Includes 6-month free warranty and signature scented gift unboxing.",
    heroImg: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=900&q=85",
    categories: [
      { title: "Silver Pendants", count: "64 Designs", img: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&q=80", link: "/collections/all" },
      { title: "Charm Bracelets", count: "38 Designs", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80", link: "/collections/all" },
      { title: "Zircon Rings", count: "52 Designs", img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80", link: "/collections/all" },
      { title: "Stud Earrings", count: "44 Designs", img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80", link: "/collections/all" },
    ],
    products: [
      { title: "Sparkling Zircon 925 Sterling Silver Pendant", price: "₹1,899", originalPrice: "₹2,599", img: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&q=80", tag: "BESTSELLER", rating: 5, reviewsCount: 8940 },
      { title: "Minimalist Dual Heart Adjustable Silver Bracelet", price: "₹2,199", originalPrice: "₹2,999", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80", tag: "GIFT FAVORITE", rating: 5, reviewsCount: 6510 },
      { title: "AAA+ Austrian Crystal Solitaire Silver Ring", price: "₹1,499", originalPrice: "₹1,999", img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80", tag: "TOP RATED", rating: 5, reviewsCount: 5120 },
      { title: "Classic Pearl & 925 Silver Stud Earrings", price: "₹1,299", originalPrice: "₹1,699", img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80", tag: "EVERYDAY", rating: 5, reviewsCount: 4210 },
    ],
    features: [
      { title: "925 Pure Solid Sterling Silver", desc: "Stamped with official 925 BIS hallmark of authenticity on every piece.", icon: "🥈" },
      { title: "Triple Anti-Tarnish Rhodium Shield", desc: "Protects against oxidation, tarnishing, and maintains brilliant platinum shine.", icon: "✨" },
      { title: "6-Month Free Replating Warranty", desc: "Complimentary anti-tarnish warranty and renewal service included.", icon: "🛡️" },
      { title: "Luxury Velvet Gift Box Unboxing", desc: "Includes scented gift unboxing box, microfiber care cloth, and card.", icon: "🎁" },
    ],
    faqs: [
      { q: "Will 925 silver turn black or tarnish?", a: "Our triple rhodium plating prevents tarnishing. Wipe with the included microfiber cloth to maintain mirror shine." },
      { q: "Is the silver hypoallergenic for sensitive ears?", a: "Yes, 100% nickel-free, lead-free, and safe for 24/7 sensitive skin wear." },
      { q: "What is included in the gift packaging?", a: "Every order arrives in a luxury velvet jewellery box with certificate and gift message card." },
      { q: "Can bracelets and rings fit different wrist/finger sizes?", a: "Yes, our designs feature adjustable clasps and comfort flex sizing." },
    ],
    reviews: [
      { author: "Ananya S.", location: "Bengaluru", title: "Looks Like Real Platinum", quote: "The shine of the rhodium plated silver looks exactly like real platinum. Beautiful gift packaging!", rating: 5 },
      { author: "Rhea M.", location: "Delhi", title: "Zero Tarnishing in 6 Months", quote: "I wear the silver pendant every single day in the shower and gym—zero tarnishing after 6 months.", rating: 5 },
      { author: "Tarun K.", location: "Mumbai", title: "Perfect Valentine's Gift", quote: "Ordered for Valentine's Day. Wife loved the luxury velvet box and certificate.", rating: 5 },
    ]
  },
  "tech-audio-home": {
    brand: "boAt / Noise",
    niche: "tech",
    subNiche: "Cyber Audio & Tech",
    accent: "#22c55e",
    accentAlt: "#16a34a",
    bgDark: true,
    bg: "#030712",
    cardBg: "#0f172a",
    textPrimary: "#f9fafb",
    textSecondary: "#9ca3af",
    border: "rgba(34, 197, 94, 0.22)",
    fontHeading: "'Space Grotesk', sans-serif",
    fontBody: "'Inter', sans-serif",
    badge: "⚡ 45DB HYBRID ANC • BEAST™ 40MS GAMING MODE",
    heroHeadline: "CYBER DARK AUDIO & ELECTRONICS",
    heroDesc: "45dB active hybrid noise cancellation, 50mm titanium drivers, 100-hour battery life, and Beast™ 40ms low-latency mobile gaming mode.",
    heroImg: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&q=85",
    categories: [
      { title: "ANC Earbuds", count: "32 Models", img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80", link: "/collections/all" },
      { title: "Wireless Headphones", count: "18 Models", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80", link: "/collections/all" },
      { title: "RGB Bluetooth Speakers", count: "24 Models", img: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80", link: "/collections/all" },
      { title: "AMOLED Smartwatches", count: "16 Models", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80", link: "/collections/all" },
    ],
    products: [
      { title: "Nirvana Ion Pro ANC True Wireless Earbuds", price: "₹2,999", originalPrice: "₹7,990", img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80", tag: "45DB ANC", rating: 5, reviewsCount: 14210 },
      { title: "Rockerz 551 ANC Hybrid Spatial Over-Ear", price: "₹3,499", originalPrice: "₹8,990", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80", tag: "100HR PLAYTIME", rating: 5, reviewsCount: 9820 },
      { title: "Stone 1200 14W RGB Rugged Bluetooth Speaker", price: "₹3,999", originalPrice: "₹6,990", img: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80", tag: "IPX7 WATERPROOF", rating: 5, reviewsCount: 6540 },
      { title: "Lunar Pro AMOLED Stainless Steel Smartwatch", price: "₹2,799", originalPrice: "₹9,999", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80", tag: "BT CALLING", rating: 5, reviewsCount: 8120 },
    ],
    features: [
      { title: "45dB Hybrid Active Noise Cancellation", desc: "Dual feedback microphones cancel 99.2% of airplane and ambient noise.", icon: "⚡" },
      { title: "100-Hour Extreme Playtime Battery", desc: "Fast ASAP™ charging gives 10 hours of playback in just 10 minutes.", icon: "🔋" },
      { title: "Beast™ Mode 40ms Low Latency", desc: "Lag-free audio synchronization calibrated for competitive mobile gaming.", icon: "🎮" },
      { title: "IPX7 Sweat & Water Resistance", desc: "Submersible waterproof engineering built for intense monsoon workouts.", icon: "💦" },
    ],
    faqs: [
      { q: "How effective is the 45dB noise cancellation?", a: "Equipped with quad ENx microphones that isolate voice and eliminate background aircraft/traffic roar." },
      { q: "Is there any audio delay when playing PUBG or BGMI?", a: "Triple tap to activate Beast™ mode which drops latency down to an imperceptible 40ms." },
      { q: "How does the 1-year replacement warranty work?", a: "Hassle-free doorstep pickup with brand new unit replacement within 48 hours." },
      { q: "Can it connect to laptop and phone simultaneously?", a: "Yes, Dual Pairing Bluetooth 5.3 allows seamless auto-switching between devices." },
    ],
    reviews: [
      { author: "Sahil M.", location: "Bengaluru", title: "Beast Mode Has Zero Lag", quote: "The bass depth on the 50mm titanium drivers vibrates through your soul. Beast mode has zero lag!", rating: 5 },
      { author: "Dev P.", location: "Delhi", title: "Insane 100hr Battery", quote: "Battery life is insane. I charged it 2 weeks ago and still have 40% battery left.", rating: 5 },
      { author: "Arjun K.", location: "Mumbai", title: "Blocks Out Local Train Noise", quote: "ANC blocks out local train noise completely. Best purchase under ₹4,000.", rating: 5 },
    ]
  }
};

export { BRAND_METAS };

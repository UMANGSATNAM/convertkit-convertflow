#!/usr/bin/env node
/**
 * Builds a demo catalogue for every niche the app offers.
 *
 * `prisma/seed.ts` seeds ten niches; `themes/` held one catalogue, for
 * ethnic-wear, and `importCatalog` read that file regardless of what the
 * merchant picked. A beauty store was seeded with bridal lehengas, and when the
 * file was missing from the deployed image it was seeded with nothing at all.
 *
 * ## About the photographs
 *
 * Product images are the one thing that cannot be written from scratch. The
 * URLs used here are the ones already present and working in
 * `app/data/placeholders/index.ts`, reused by role — they are real photographs,
 * not grey "800x1200" boxes, and they are the only stock URLs in this project
 * that are known to resolve.
 *
 * Niches with no matching pack fall back to `picsum.photos` seeded URLs, which
 * always resolve but are not subject-specific. Those are marked in the file so
 * they are easy to find and replace with real product photography before a
 * merchant ever sees them.
 *
 * Prices are in rupees, matching the app's Indian D2C positioning, and are
 * written as plain decimal strings because that is what `productVariantsBulkCreate`
 * expects.
 *
 * Usage: node scripts/build_niche_catalogs.cjs [--dry]
 */

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const THEMES = path.join(ROOT, "themes");
const DRY = process.argv.includes("--dry");

// ── Photography ────────────────────────────────────────────────────────────
// Pulled from app/data/placeholders/index.ts so nothing new is invented.
function packUrls() {
  const src = fs.readFileSync(path.join(ROOT, "app/data/placeholders/index.ts"), "utf-8");
  const byRole = {};
  const re = /url:\s*["']([^"']+)["'][\s\S]{0,120}?role:\s*["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    (byRole[m[2]] = byRole[m[2]] || []).push(m[1]);
  }
  // Some entries list role before url.
  const re2 = /role:\s*["']([^"']+)["'][\s\S]{0,120}?url:\s*["']([^"']+)["']/g;
  while ((m = re2.exec(src)) !== null) {
    const list = (byRole[m[1]] = byRole[m[1]] || []);
    if (!list.includes(m[2])) list.push(m[2]);
  }
  return byRole;
}

const ROLE_URLS = packUrls();
const PRODUCT_ISH = [
  ...(ROLE_URLS.texture_ingredient || []),
  ...(ROLE_URLS.lookbook_editorial || []),
  ...(ROLE_URLS.hero_lifestyle || []),
];

let realIdx = 0;
function realPhoto() {
  if (PRODUCT_ISH.length === 0) return null;
  return PRODUCT_ISH[realIdx++ % PRODUCT_ISH.length];
}

/** Always resolves; subject is not controlled. Flagged for replacement. */
function seededPhoto(slug, n) {
  return `https://picsum.photos/seed/${slug}-${n}/1200/1500`;
}

function imagesFor(handle, title, useReal) {
  const out = [];
  for (let i = 1; i <= 2; i++) {
    const url = useReal ? realPhoto() : null;
    out.push({
      src: url || seededPhoto(handle, i),
      alt: `${title} — view ${i}`,
      ...(url ? {} : { note: "REPLACE: generic stock, not subject-specific" }),
    });
  }
  return out;
}

// ── Catalogue data ─────────────────────────────────────────────────────────
// Sizes/variant axis differs by niche, so each entry declares its own.
const NICHES = {
  beauty: {
    vendor: "Peri",
    axis: "Size",
    realPhotos: true,
    products: [
      ["Vitamin C Brightening Serum", "Serum", 1450, 1850, ["30 ml", "50 ml"], "A 12% vitamin C serum that evens tone without the sting. Layers under sunscreen, absorbs in seconds."],
      ["Gentle Foaming Cleanser", "Cleanser", 690, 890, ["100 ml", "200 ml"], "Removes sunscreen and city grime without stripping. Fragrance-free, pH balanced for daily use."],
      ["Ceramide Repair Moisturiser", "Moisturiser", 1150, null, ["50 g"], "Three ceramides and squalane rebuild the barrier overnight. Rich, but never greasy."],
      ["Mineral Sunscreen SPF 50", "Sunscreen", 950, 1200, ["50 ml"], "Zinc-based broad spectrum with no white cast on Indian skin tones. Reapply-friendly texture."],
      ["Overnight Retinal Treatment", "Treatment", 1890, 2400, ["30 ml"], "Encapsulated retinal at 0.05% — visible smoothing without the peeling week."],
      ["Rose Clay Purifying Mask", "Mask", 780, null, ["75 g"], "Draws out congestion in ten minutes. Kaolin and rose clay, no drying alcohol."],
      ["Hydrating Rice Water Toner", "Toner", 620, 790, ["150 ml", "250 ml"], "A watery-light first step that leaves skin plump rather than tight."],
      ["Barrier Recovery Face Oil", "Face Oil", 1350, null, ["30 ml"], "Cold-pressed marula and rosehip. Two drops is the whole dose."],
    ],
  },
  jewellery: {
    vendor: "Aurelia",
    axis: "Size",
    realPhotos: true,
    products: [
      ["Kundan Polki Choker", "Necklace", 28500, 34000, ["One size"], "Uncut polki set in 22k gold plating over silver. Weighty, and meant to be worn."],
      ["Temple Jhumka Earrings", "Earrings", 8900, null, ["One size"], "South Indian temple motifs in hand-finished gold plating. Light enough for a full evening."],
      ["Emerald Drop Necklace", "Necklace", 15600, 18900, ["16 in", "18 in"], "A single emerald-cut drop on a fine chain. The piece you reach for without thinking."],
      ["Pearl Layered Haar", "Necklace", 22000, null, ["One size"], "Three strands of freshwater pearls with a carved gold clasp."],
      ["Diamond Solitaire Ring", "Ring", 45000, 52000, ["12", "14", "16", "18"], "A brilliant-cut solitaire in a six-prong setting. Certified, and sized to order."],
      ["Meenakari Bangle Set", "Bangles", 12400, 15000, ["2.4", "2.6", "2.8"], "Hand-painted meenakari in six colours, set of four."],
      ["Antique Gold Maang Tikka", "Hair", 6800, null, ["One size"], "Oxidised finish with a pearl drop. Sits flat, stays put."],
      ["Stackable Gold Band Trio", "Ring", 9600, 11500, ["12", "14", "16"], "Three plain bands in mixed finishes, made to be worn together or apart."],
    ],
  },
  "ethnic-wear": {
    vendor: "Koskii",
    axis: "Size",
    realPhotos: true,
    products: [
      ["Crimson Bridal Lehenga Choli", "Lehenga", 25000, 30000, ["S", "M", "L", "XL"], "Zari and resham on raw silk, with a six-metre flare. Made for the day you plan around."],
      ["Chikankari Cotton Kurta", "Kurta", 2400, 2999, ["S", "M", "L", "XL", "XXL"], "Hand-embroidered Lucknowi chikankari on breathable cotton. Gets softer with every wash."],
      ["Banarasi Silk Saree", "Saree", 12500, 15000, ["Free size"], "Pure katan silk with a traditional zari border, woven in Varanasi."],
      ["Anarkali Georgette Suit", "Suit", 5600, 6900, ["S", "M", "L", "XL"], "Floor-length anarkali with churidar and dupatta. Flows without weighing you down."],
      ["Bandhani Cotton Dupatta", "Dupatta", 1450, null, ["Free size"], "Tie-dyed by hand in Kutch. Every piece is slightly its own."],
      ["Silk Blend Nehru Jacket", "Jacket", 3800, 4500, ["38", "40", "42", "44"], "A structured jacket that lifts a plain kurta into something occasion-ready."],
      ["Embroidered Sharara Set", "Sharara", 8900, 10500, ["S", "M", "L", "XL"], "Wide-leg sharara with a short kurti and organza dupatta."],
      ["Handloom Cotton Saree", "Saree", 3200, null, ["Free size"], "Everyday handloom with a contrast pallu. Light enough for a working day."],
    ],
  },
  streetwear: {
    vendor: "Foundry",
    axis: "Size",
    realPhotos: true,
    products: [
      ["Heavyweight Boxy Tee", "T-Shirt", 1899, 2299, ["S", "M", "L", "XL", "XXL"], "240 GSM cotton with a dropped shoulder. Holds its shape past fifty washes."],
      ["Raw Selvedge Denim", "Jeans", 4999, null, ["28", "30", "32", "34", "36"], "14oz raw selvedge, unwashed. Fades to your own pattern over a year."],
      ["Oversized Hoodie", "Hoodie", 3499, 4200, ["S", "M", "L", "XL"], "Brushed fleece inside, heavy drape outside. Kangaroo pocket sized for actual hands."],
      ["Cargo Utility Pant", "Trousers", 3299, null, ["28", "30", "32", "34"], "Six pockets that all close. Ripstop cotton, tapered from the knee."],
      ["Graphic Print Crewneck", "Sweatshirt", 2799, 3400, ["S", "M", "L", "XL"], "Screen-printed in small runs. The print cracks in, not off."],
      ["Nylon Coach Jacket", "Jacket", 4499, 5200, ["S", "M", "L", "XL"], "Water-resistant shell with a snap front and mesh lining."],
      ["Panelled Track Pant", "Trousers", 2999, null, ["S", "M", "L", "XL"], "Side-panel detail, elasticated cuff, deep zip pockets."],
      ["Canvas Tote", "Accessory", 1299, null, ["One size"], "16oz canvas with a reinforced base. Carries a laptop and a week's groceries."],
    ],
  },
  grooming: {
    vendor: "Bearded",
    axis: "Size",
    realPhotos: true,
    products: [
      ["Beard Growth Oil", "Beard Oil", 799, 999, ["30 ml", "60 ml"], "Cold-pressed argan and jojoba. Absorbs without leaving the shine."],
      ["Charcoal Face Wash", "Cleanser", 449, null, ["100 ml"], "Activated charcoal for oily skin and city pollution. Doesn't strip."],
      ["Matte Hair Clay", "Styling", 649, 799, ["50 g"], "Strong hold, zero shine, and it washes out with plain water."],
      ["Sandalwood Shave Cream", "Shaving", 549, null, ["100 g"], "Dense lather that stays put for a three-pass shave."],
      ["Beard Grooming Kit", "Kit", 1899, 2400, ["Standard"], "Oil, balm, wooden comb and boar-bristle brush in a travel case."],
      ["Anti-Dandruff Shampoo", "Hair Care", 599, 749, ["200 ml", "400 ml"], "Ketoconazole with aloe, so it treats without leaving the scalp raw."],
      ["Cooling Aftershave Balm", "Shaving", 499, null, ["100 ml"], "Alcohol-free, so it calms rather than burns."],
      ["Precision Beard Trimmer", "Tool", 2499, 2999, ["Standard"], "Twenty length settings, ninety-minute runtime, fully washable head."],
    ],
  },
  activewear: {
    vendor: "Strive",
    axis: "Size",
    realPhotos: false,
    products: [
      ["Seamless Training Tee", "T-Shirt", 1799, 2199, ["S", "M", "L", "XL"], "Knitted in one piece so there are no seams to chafe. Dries in minutes."],
      ["High-Waist Compression Legging", "Leggings", 2499, 2999, ["XS", "S", "M", "L", "XL"], "Squat-proof at every angle, with a waistband that stays where you put it."],
      ["Lightweight Running Short", "Shorts", 1599, null, ["S", "M", "L", "XL"], "Five-inch inseam with a zip pocket that holds a phone without bouncing."],
      ["Performance Sports Bra", "Sports Bra", 1899, 2299, ["S", "M", "L", "XL"], "Medium-high support with removable pads and a racerback that doesn't dig."],
      ["Training Joggers", "Trousers", 2299, null, ["S", "M", "L", "XL"], "Four-way stretch with a tapered leg and zipped ankle."],
      ["Windproof Running Jacket", "Jacket", 3499, 4200, ["S", "M", "L", "XL"], "Packs into its own pocket. Reflective detailing on both sleeves."],
      ["Grip Training Sock", "Accessory", 599, null, ["Free size"], "Silicone grip on the sole for studio work. Sold as a pair."],
      ["Insulated Steel Bottle", "Accessory", 1299, 1599, ["750 ml"], "Holds cold for eighteen hours. Fits a standard cage."],
    ],
  },
  electronics: {
    vendor: "Volt",
    axis: "Variant",
    realPhotos: false,
    products: [
      ["Active Noise Cancelling Headphones", "Headphones", 8999, 11999, ["Black", "Sand"], "Thirty-hour battery, multipoint pairing, and cups that clear an average ear."],
      ["Wireless Earbuds Pro", "Earbuds", 4999, 6499, ["White", "Graphite"], "Adaptive ANC with a transparency mode you can actually hold a conversation in."],
      ["65W GaN Charger", "Charger", 2499, null, ["Standard"], "Charges a laptop and a phone at once, in a plug the size of a matchbox."],
      ["Mechanical Keyboard TKL", "Keyboard", 6999, 8500, ["Brown switch", "Red switch"], "Hot-swappable, PBT keycaps, and a gasket mount that softens the bottom-out."],
      ["Portable SSD 1TB", "Storage", 7499, 8999, ["1 TB", "2 TB"], "1050 MB/s read over USB-C, in an aluminium shell that survives a bag."],
      ["4K Webcam", "Camera", 5999, null, ["Standard"], "Autofocus that holds on a face, and a physical privacy shutter."],
      ["Smart Fitness Band", "Wearable", 3499, 4200, ["Black", "Blue"], "Fourteen-day battery with SpO2 and sleep staging."],
      ["Braided USB-C Cable", "Cable", 799, null, ["1 m", "2 m"], "100W rated, nylon braided, with a strain relief that outlasts the phone."],
    ],
  },
  "home-decor": {
    vendor: "Terra",
    axis: "Size",
    realPhotos: false,
    products: [
      ["Handthrown Stoneware Vase", "Vase", 2400, 2900, ["Small", "Medium", "Large"], "Thrown and glazed by hand, so no two are quite the same height."],
      ["Terracotta Planter Set", "Planter", 1800, null, ["Set of 3"], "Unglazed terracotta that breathes, with drainage that actually drains."],
      ["Handwoven Jute Rug", "Rug", 6500, 7800, ["4x6 ft", "5x8 ft"], "Flat-woven jute with a cotton binding. Wears in rather than out."],
      ["Brass Table Lamp", "Lighting", 4200, null, ["Standard"], "Solid brass base with a linen shade. Warms to a deeper tone over years."],
      ["Block Print Cushion Cover", "Textiles", 890, 1100, ["16 in", "20 in"], "Hand block printed in Bagru, in a cotton that softens with washing."],
      ["Ceramic Dinner Set", "Tableware", 5600, 6900, ["Set of 8", "Set of 16"], "Reactive glaze, dishwasher safe, and heavy enough not to slide."],
      ["Mango Wood Serving Board", "Tableware", 1650, null, ["Medium", "Large"], "Single piece of mango wood, oiled and ready to use."],
      ["Cotton Throw Blanket", "Textiles", 2800, 3400, ["Single", "Double"], "Waffle-weave cotton that works in summer and layers in winter."],
    ],
  },
  kids: {
    vendor: "Little Field",
    axis: "Size",
    realPhotos: false,
    products: [
      ["Organic Cotton Romper", "Romper", 1200, 1500, ["0-3 m", "3-6 m", "6-12 m", "12-18 m"], "GOTS-certified cotton with nickel-free snaps all the way down."],
      ["Wooden Stacking Toy", "Toy", 1450, null, ["One size"], "Beech wood with water-based, non-toxic paint. Survives being thrown."],
      ["Printed Cotton Tee Pack", "T-Shirt", 999, 1299, ["1-2 y", "2-3 y", "3-4 y", "4-5 y"], "Set of three in soft jersey. Prints that survive the wash."],
      ["Soft Muslin Swaddle Set", "Bedding", 1650, 1999, ["Set of 3"], "Double-gauze muslin that gets softer each wash and stays breathable."],
      ["Toddler Canvas Sneakers", "Footwear", 1350, null, ["4", "5", "6", "7", "8"], "Flexible sole for early walkers, with a velcro strap they can manage."],
      ["Fleece Hooded Jacket", "Jacket", 1899, 2299, ["2-3 y", "3-4 y", "4-5 y"], "Warm without the bulk, with cuffs that stay over small hands."],
      ["Cotton Sleep Sack", "Sleepwear", 1550, null, ["S", "M", "L"], "TOG 1.0 for Indian nights, with a two-way zip for changes."],
      ["Silicone Feeding Set", "Feeding", 1250, 1500, ["Standard"], "Suction bowl, plate and two spoons. Dishwasher and microwave safe."],
    ],
  },
  food: {
    vendor: "Slow Roast",
    axis: "Size",
    realPhotos: true,
    products: [
      ["Single Origin Coffee Beans", "Coffee", 750, 899, ["250 g", "500 g", "1 kg"], "Chikmagalur estate, medium roast, with a roast date on every bag."],
      ["Cold Brew Concentrate", "Coffee", 650, null, ["500 ml"], "Steeped eighteen hours. Cut it one to three and it holds a week."],
      ["Raw Forest Honey", "Pantry", 550, 699, ["350 g", "700 g"], "Unfiltered and unheated, so it crystallises. That is the point."],
      ["Stone Ground Cocoa", "Pantry", 890, null, ["250 g"], "Single-estate cacao, stone ground for three days. 70% and nothing else."],
      ["Artisanal Masala Chai", "Tea", 480, 600, ["100 g", "250 g"], "Assam CTC with whole spices, ground the week it ships."],
      ["Cold Pressed Coconut Oil", "Pantry", 620, null, ["500 ml", "1 L"], "Wood-pressed in small batches, so it still smells like coconut."],
      ["Millet Breakfast Granola", "Breakfast", 540, 680, ["400 g"], "Little millet, jaggery and almonds. No refined sugar, no palm oil."],
      ["Assorted Nut Butter Trio", "Pantry", 1150, 1400, ["Set of 3"], "Peanut, almond and cashew. One ingredient each, plus salt."],
    ],
  },
};

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function skuFor(vendor, title, variant) {
  const v = vendor.slice(0, 3).toUpperCase();
  const t = title.split(" ").map(w => w[0]).join("").slice(0, 4).toUpperCase();
  return `${v}-${t}-${slugify(variant).toUpperCase().slice(0, 6)}`;
}

let written = 0;
const summary = [];

for (const [nicheId, spec] of Object.entries(NICHES)) {
  const catalogue = spec.products.map(([title, type, price, compareAt, variants, description]) => {
    const handle = slugify(title);
    return {
      title,
      handle,
      vendor: spec.vendor,
      product_type: type,
      tags: [nicheId, slugify(type), spec.vendor.toLowerCase()],
      seo_title: `${title} | ${spec.vendor}`,
      seo_description: description.slice(0, 155),
      body_html: `<p>${description}</p>`,
      images: imagesFor(handle, title, spec.realPhotos),
      variants: variants.map(v => ({
        title: v,
        price: price.toFixed(2),
        compare_at_price: compareAt ? compareAt.toFixed(2) : null,
        sku: skuFor(spec.vendor, title, v),
        inventory_quantity: 25,
      })),
      option_name: spec.axis,
    };
  });

  const dir = path.join(THEMES, nicheId);
  const file = path.join(dir, "catalog.json");

  if (!DRY) {
    fs.mkdirSync(dir, { recursive: true });
    const out = JSON.stringify(catalogue, null, 2);
    JSON.parse(out); // guard
    fs.writeFileSync(file, out);
  }

  written++;
  const stock = catalogue.filter(p => p.images.some(i => i.note)).length;
  summary.push(
    `  ${nicheId.padEnd(13)} ${catalogue.length} products, ` +
    `${catalogue.reduce((n, p) => n + p.variants.length, 0)} variants` +
    (stock ? `   (${stock} using generic stock — replace before launch)` : "")
  );
}

console.log(DRY ? "--dry: nothing written\n" : `Wrote ${written} catalogue(s)\n`);
console.log(summary.join("\n"));

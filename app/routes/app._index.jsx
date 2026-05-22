import { json } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { useState, useCallback, useEffect } from "react";
import { authenticate } from "../shopify.server";
import { TEMPLATE_HTMLS } from "../templatesHtml.js";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return json({ ok: true });
};

/* ── Templates Config ── */
const TEMPLATES = [
  {
    id: "pilgrim",
    name: "Pilgrim Beauty",
    niche: "BEAUTY & SKINCARE",
    nicheColor: "#C17F5E",
    nicheBg: "#FFF0E5",
    accent: "#C17F5E",
    desc: "Premium beauty landing page with hero, trust badges, categories, bestsellers, ingredients, brand story, testimonials & newsletter.",
    icon: "leaf",
  },
  {
    id: "tanishq",
    name: "Tanishq Jewellery",
    niche: "LUXURY JEWELLERY",
    nicheColor: "#D4AF37",
    nicheBg: "#FFF8E1",
    accent: "#D4AF37",
    desc: "Luxurious jewellery storefront with gold accents, serif typography, BIS hallmark trust, collection grids, craftsmanship story & elegant reviews.",
    icon: "diamond",
  },
  {
    id: "caratlane",
    name: "CaratLane Clone",
    niche: "EVERYDAY JEWELLERY",
    nicheColor: "#493161",
    nicheBg: "#F6EFFB",
    accent: "#DEBB43",
    desc: "A gorgeous modern clone of CaratLane with deep purple, warm gold, large image banners, elegant typography, and massive Theme Editor customizability.",
    icon: "diamond",
  },
  {
    id: "jewellery-heritage",
    name: "Meenakshi Jewellers",
    niche: "BRIDAL JEWELLERY",
    nicheColor: "#8B1A2C",
    nicheBg: "#F9EEF0",
    accent: "#C89B72",
    desc: "Festive crimson & rose-gold heritage template. Split hero, occasion filter strip, Cinzel serif typography — completely distinct from Tanishq & CaratLane.",
    icon: "diamond",
  },
  {
    id: "fashion-clothing",
    name: "VŌLT Fashion",
    niche: "CLOTHING & APPAREL",
    nicheColor: "#1a1a1a",
    nicheBg: "#F0EDE8",
    accent: "#1a1a1a",
    desc: "Stark editorial fashion template with full-viewport hero, size selector band, and a bold Bebas Neue identity — for clothing brands.",
    icon: "desktop",
  },
  {
    id: "footwear",
    name: "Solera Footwear",
    niche: "SHOES & FOOTWEAR",
    nicheColor: "#C65D2A",
    nicheBg: "#FBF0E8",
    accent: "#C65D2A",
    desc: "Premium footwear template with built-in size selector tabs, sustainability section, and warm sand tones for shoe & sneaker brands.",
    icon: "leaf",
  },
  {
    id: "ayurveda-wellness",
    name: "Ayurva Wellness",
    niche: "AYURVEDA & HEALTH",
    nicheColor: "#2E4B35",
    nicheBg: "#EDF4EE",
    accent: "#E07B2A",
    desc: "Yatra One typography, botanical ingredient grid, dosha quiz CTA, and AYUSH certification badges — for health & wellness brands.",
    icon: "leaf",
  },
  {
    id: "mobile-accessories",
    name: "STACKD Accessories",
    niche: "TECH ACCESSORIES",
    nicheColor: "#00F0C8",
    nicheBg: "#0D0D12",
    accent: "#00F0C8",
    desc: "Futuristic dark-mode design with device compatibility selector, neon accents, and performance-focused product cards for phone cases.",
    icon: "zap",
  },
  {
    id: "kids-toys",
    name: "PlayBox Kids",
    niche: "TOYS & EDUCATION",
    nicheColor: "#2D6BE4",
    nicheBg: "#EFF4FF",
    accent: "#F9C22E",
    desc: "Playful Baloo 2 font, age-range badges, skill tags on cards, colorful blob hero animation — designed for kids toy stores.",
    icon: "zap",
  },
  {
    id: "home-furniture",
    name: "Haven Furniture",
    niche: "HOME & FURNITURE",
    nicheColor: "#B5834A",
    nicheBg: "#F5EFE6",
    accent: "#B5834A",
    desc: "Artisan serif template with room lookbook grid, 'how it works' steps, and solid wood heritage positioning for furniture brands.",
    icon: "diamond",
  },
  {
    id: "food-delivery",
    name: "Veda Eats",
    niche: "FOOD & DELIVERY",
    nicheColor: "#FF5722",
    nicheBg: "#FFF0E8",
    accent: "#FF5722",
    desc: "Cloud kitchen landing page with address input hero, cuisine chip filters, card-style menu, and trust stats — for food delivery brands.",
    icon: "check",
  },
  {
    id: "electronics",
    name: "Tech & Electronics",
    niche: "ELECTRONICS",
    nicheColor: "#5735db",
    nicheBg: "#e9e5f5",
    accent: "#5735db",
    desc: "Minimalist dark-mode template designed for tech products with detailed specification grids and mega-menu navigation.",
    icon: "desktop",
  },
  {
    id: "home-decor",
    name: "Home Decor",
    niche: "INTERIOR DESIGN",
    nicheColor: "#8B7355",
    nicheBg: "#FAF5ED",
    accent: "#8B7355",
    desc: "Elegant, editorial template utilizing masonry layout for lifestyle driven products with serif typography.",
    icon: "diamond",
  },
  {
    id: "pet-supplies",
    name: "Pet Supplies",
    niche: "PETS",
    nicheColor: "#D35400",
    nicheBg: "#f9e0d1",
    accent: "#D35400",
    desc: "Friendly, colorful UI featuring 'Subscribe & Save' widget patterns and premium branding.",
    icon: "leaf",
  },
  {
    id: "luxury-watches",
    name: "Luxury Watches",
    niche: "LUXURY",
    nicheColor: "#C5A028",
    nicheBg: "#fbf6e2",
    accent: "#C5A028",
    desc: "High-end horology template featuring deep black and gold styling with glassmorphic depth.",
    icon: "diamond",
  },
  {
    id: "outdoor-gear",
    name: "Outdoor Gear",
    niche: "OUTDOORS",
    nicheColor: "#2A4B2A",
    nicheBg: "#dbe8db",
    accent: "#2A4B2A",
    desc: "Rugged and brutalist design for survival/outdoor gear with quick-access product spec icons.",
    icon: "leaf",
  },
  {
    id: "organic-food",
    name: "Organic Food",
    niche: "GROCERY",
    nicheColor: "#4A7c59",
    nicheBg: "#e5f1e8",
    accent: "#4A7c59",
    desc: "Fresh, airy template tailored for FMCG and organic produce with inline quantity selectors.",
    icon: "leaf",
  },
  {
    id: "fitness-supplements",
    name: "Fitness Supplements",
    niche: "FITNESS",
    nicheColor: "#050505",
    nicheBg: "#ebfb61",
    accent: "#E2FE16",
    desc: "Aggressive duotone styling built for high-energy brands, featuring large strike-through retail pricing.",
    icon: "zap",
  },
  {
    id: "baby-apparel",
    name: "Baby Apparel",
    niche: "BABY & KIDS",
    nicheColor: "#F6A8B6",
    nicheBg: "#fcedef",
    accent: "#F6A8B6",
    desc: "Soft pastel, heavily rounded design system with age-range taggings and gentle typography.",
    icon: "desktop",
  },
  {
    id: "coffee-roasters",
    name: "Coffee Roasters",
    niche: "FOOD & BEV",
    nicheColor: "#3E2723",
    nicheBg: "#efebe9",
    accent: "#3E2723",
    desc: "Warm artisanal roastery template matching coffee origins with built-in tasting note tags.",
    icon: "check",
  },
  {
    id: "beauty-cosmetics",
    name: "Clean Cosmetics",
    niche: "BEAUTY",
    nicheColor: "#D4BBA5",
    nicheBg: "#f8f3f0",
    accent: "#D4BBA5",
    desc: "Conscious beauty template with subtle gradients, nude palettes, and a sticky 'add to bag' scroll interaction.",
    icon: "leaf",
  },
];

/* ── SVG Icons ── */
const SVG = {
  zap: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  rocket: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`,
  check: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#27ae60" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`,
  desktop: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  tablet: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>`,
  mobile: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>`,
  leaf: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75"/></svg>`,
  diamond: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5Z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`,
};

const icon = (name) => {
  const s = SVG[name] || "";
  return <span dangerouslySetInnerHTML={{ __html: s }} style={{ display: "inline-flex", alignItems: "center" }} />;
};

/* ── Tanishq Jewellery Preview HTML ── */
const tanishqPreviewHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Tanishq Store Preview</title>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #FDFAF3; color: #1A0F0A; -webkit-font-smoothing: antialiased; }
    img { max-width: 100%; height: auto; display: block; }
    
    /* SHIMMER STYLES */
    .shimmer-wrapper {
      position: relative;
      background: #F4E7C4;
      overflow: hidden;
    }
    .shimmer-wrapper::before {
      content: '';
      position: absolute;
      top: 0; left: -100%; width: 50%; height: 100%;
      background: linear-gradient(to right, transparent, rgba(253, 250, 243, 0.4), transparent);
      animation: shimmer 2s infinite linear;
      z-index: 10;
    }
    @keyframes shimmer {
      100% { left: 200%; }
    }
    .img-loading {
      opacity: 0;
      transition: opacity 0.5s ease;
    }
    .img-loaded {
      opacity: 1;
    }
  </style>
</head>
<body>
  <!-- 1. Announcement Bar -->
  <div style="background:#8B1A2C; color:#FDFAF3; padding:12px; text-align:center; font-size:11px; font-weight:600; letter-spacing:1px; text-transform:uppercase;">
    ✨ Making charges waived on select bridal collections. Shop now
  </div>

  <!-- 2. Header -->
  <div style="padding:24px; border-bottom:1px solid rgba(212, 175, 55, 0.3); background:#FDFAF3; position:sticky; top:0; z-index:100;">
    <div style="max-width:1320px; margin:0 auto; display:flex; justify-content:space-between; align-items:center;">
      <div style="display:flex; gap:24px; font-size:12px; font-weight:500; letter-spacing:1px; text-transform:uppercase;">
        <span>Shop</span>
        <span>Gifting</span>
        <span>Golden Harvest</span>
      </div>
      <div style="font-family:'Cormorant Garamond', serif; font-size:32px; font-weight:700; color:#8B1A2C; letter-spacing:4px;">TANISHQ</div>
      <div style="display:flex; gap:24px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
      </div>
    </div>
  </div>

  <!-- 3. Hero -->
  <div style="position:relative; min-height:680px; background:#1A0F0A; display:flex; align-items:center; overflow:hidden; padding:80px 0;">
    <div style="position:absolute; inset:0; background:radial-gradient(circle at 80% 50%, rgba(139, 26, 44, 0.15) 0%, transparent 60%);"></div>
    <div style="max-width:1320px; margin:0 auto; padding:0 24px; width:100%; display:grid; grid-template-columns:1.2fr 0.8fr; gap:64px; align-items:center; position:relative; z-index:2;">
      <div style="border-left:2px solid #D4AF37; padding-left:40px;">
        <span style="color:#D4AF37; font-size:12px; font-weight:700; letter-spacing:4px; text-transform:uppercase; margin-bottom:24px; display:block;">A TATA PRODUCT</span>
        <h1 style="font-family:'Cormorant Garamond', serif; font-size:64px; font-weight:600; line-height:1.05; color:#FDFAF3; margin-bottom:28px;">Draped in <span style="color:#D4AF37; font-style:italic;">Heritage</span> & Elegance</h1>
        <p style="font-size:16px; color:rgba(253, 250, 243, 0.7); margin-bottom:44px; max-width:540px; line-height:1.8;">Exquisite gold, diamond, and kundan jewelry handcrafted by India’s finest artisans. Celebrate life’s beautiful milestones with trust and luxury.</p>
        <div style="display:flex; gap:16px;">
          <a href="#" style="display:inline-flex; background:#D4AF37; color:#1A0F0A; padding:16px 36px; font-size:12px; font-weight:700; text-decoration:none; letter-spacing:2px; text-transform:uppercase;">Explore Collections</a>
          <a href="#" style="display:inline-flex; border:1px solid rgba(255,255,255,0.4); color:#FFF; padding:16px 36px; font-size:12px; font-weight:700; text-decoration:none; letter-spacing:2px; text-transform:uppercase;">Book Video Call</a>
        </div>
      </div>
      <div class="shimmer-wrapper" style="position:relative; width:100%; aspect-ratio:4/5; border:1px solid rgba(212, 175, 55, 0.3); padding:16px; margin:0 auto; max-width:500px;">
        <img src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80" alt="Luxury Jewellery" style="width:100%; height:100%; object-fit:cover; filter:brightness(0.9);" onload="this.classList.add('img-loaded')" class="img-loading">
        <div style="position:absolute; bottom:-20px; left:-20px; background:#FDFAF3; border:1px solid #D4AF37; padding:20px 24px; text-align:center;">
          <span style="font-size:24px; font-weight:700; color:#8B1A2C; display:block; font-family:'Cormorant Garamond', serif;">100%</span>
          <span style="font-size:10px; text-transform:uppercase; letter-spacing:1px; color:#7D6B58;">BIS Certified</span>
        </div>
      </div>
    </div>
  </div>

  <!-- 4. Logo List -->
  <div style="padding:48px 0; border-bottom:1px solid rgba(212, 175, 55, 0.2); background:#FFFDFC;">
    <div style="max-width:1320px; margin:0 auto; padding:0 24px; display:flex; justify-content:space-between; align-items:center;">
      <span style="font-family:'Cormorant Garamond', serif; font-size:24px; color:#1A0F0A; font-weight:600;">BIS Hallmarked</span>
      <span style="width:4px; height:4px; background:#D4AF37; border-radius:50%;"></span>
      <span style="font-family:'Cormorant Garamond', serif; font-size:24px; color:#1A0F0A; font-weight:600;">GIA Certified</span>
      <span style="width:4px; height:4px; background:#D4AF37; border-radius:50%;"></span>
      <span style="font-family:'Cormorant Garamond', serif; font-size:24px; color:#1A0F0A; font-weight:600;">100% Exchange</span>
      <span style="width:4px; height:4px; background:#D4AF37; border-radius:50%;"></span>
      <span style="font-family:'Cormorant Garamond', serif; font-size:24px; color:#1A0F0A; font-weight:600;">Insured Shipping</span>
    </div>
  </div>

  <!-- 5. Collections -->
  <div style="padding:100px 0; background:#FDFAF3;">
    <div style="max-width:1320px; margin:0 auto; padding:0 24px;">
      <div style="text-align:center; margin-bottom:64px;">
        <span style="font-size:11px; font-weight:700; letter-spacing:4px; text-transform:uppercase; color:#D4AF37; margin-bottom:16px; display:block;">CURATED FOR YOU</span>
        <h2 style="font-family:'Cormorant Garamond', serif; font-size:48px; color:#1A0F0A; margin-bottom:16px; position:relative; display:inline-block; padding-bottom:12px;">Shop by Occasion<span style="position:absolute; bottom:0; left:50%; transform:translateX(-50%); width:60px; height:1px; background:#D4AF37;"></span></h2>
      </div>
      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:24px;">
        <div class="shimmer-wrapper" style="aspect-ratio:3/4; border:1px solid rgba(212, 175, 55, 0.2); position:relative; overflow:hidden;">
          <img src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80" style="width:100%; height:100%; object-fit:cover;" onload="this.classList.add('img-loaded')" class="img-loading">
          <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(26, 15, 10, 0.85) 0%, transparent 60%); display:flex; flex-direction:column; justify-content:flex-end; padding:24px;">
            <h3 style="font-family:'Cormorant Garamond', serif; font-size:24px; color:#FDFAF3; margin-bottom:6px;">Bridal Gold</h3>
          </div>
        </div>
        <div class="shimmer-wrapper" style="aspect-ratio:3/4; border:1px solid rgba(212, 175, 55, 0.2); position:relative; overflow:hidden;">
          <img src="https://images.unsplash.com/photo-1599643477874-c5a81026afdb?auto=format&fit=crop&w=600&q=80" style="width:100%; height:100%; object-fit:cover;" onload="this.classList.add('img-loaded')" class="img-loading">
          <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(26, 15, 10, 0.85) 0%, transparent 60%); display:flex; flex-direction:column; justify-content:flex-end; padding:24px;">
            <h3 style="font-family:'Cormorant Garamond', serif; font-size:24px; color:#FDFAF3; margin-bottom:6px;">Diamond Solitaires</h3>
          </div>
        </div>
        <div class="shimmer-wrapper" style="aspect-ratio:3/4; border:1px solid rgba(212, 175, 55, 0.2); position:relative; overflow:hidden;">
          <img src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80" style="width:100%; height:100%; object-fit:cover;" onload="this.classList.add('img-loaded')" class="img-loading">
          <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(26, 15, 10, 0.85) 0%, transparent 60%); display:flex; flex-direction:column; justify-content:flex-end; padding:24px;">
            <h3 style="font-family:'Cormorant Garamond', serif; font-size:24px; color:#FDFAF3; margin-bottom:6px;">Everyday Elegance</h3>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 6. Featured Products -->
  <div style="padding:100px 0; background:#FFFDFC; border-top:1px solid rgba(212, 175, 55, 0.25);">
    <div style="max-width:1320px; margin:0 auto; padding:0 24px;">
      <div style="text-align:center; margin-bottom:64px;">
        <span style="font-size:11px; font-weight:700; letter-spacing:4px; text-transform:uppercase; color:#D4AF37; margin-bottom:16px; display:block;">NEW ARRIVALS</span>
        <h2 style="font-family:'Cormorant Garamond', serif; font-size:48px; color:#1A0F0A; margin-bottom:16px; position:relative; display:inline-block; padding-bottom:12px;">Just In — Exquisite Pieces<span style="position:absolute; bottom:0; left:50%; transform:translateX(-50%); width:60px; height:1px; background:#D4AF37;"></span></h2>
      </div>
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:24px;">
        <div style="background:#FDFAF3; border:1px solid rgba(212, 175, 55, 0.15); display:flex; flex-direction:column;">
          <div class="shimmer-wrapper" style="aspect-ratio:1;">
            <img src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=500&q=80" style="width:100%; height:100%; object-fit:cover;" onload="this.classList.add('img-loaded')" class="img-loading">
          </div>
          <div style="padding:24px; text-align:center; display:flex; flex-direction:column; justify-content:space-between; flex-grow:1;">
            <div>
              <div style="font-size:10px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:#7D6B58; margin-bottom:8px;">Gold Sets</div>
              <h3 style="font-size:16px; font-weight:500; margin-bottom:12px;">Celestial Gold Necklace Set</h3>
            </div>
            <div>
              <div style="font-family:'Cormorant Garamond', serif; font-size:20px; font-weight:700; color:#8B1A2C; margin-bottom:16px;">₹1,24,999</div>
              <button style="width:100%; padding:14px; background:#1A0F0A; color:#D4AF37; border:none; font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase;">Add to Bag</button>
            </div>
          </div>
        </div>
        <div style="background:#FDFAF3; border:1px solid rgba(212, 175, 55, 0.15); display:flex; flex-direction:column;">
          <div class="shimmer-wrapper" style="aspect-ratio:1;">
            <img src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=500&q=80" style="width:100%; height:100%; object-fit:cover;" onload="this.classList.add('img-loaded')" class="img-loading">
          </div>
          <div style="padding:24px; text-align:center; display:flex; flex-direction:column; justify-content:space-between; flex-grow:1;">
            <div>
              <div style="font-size:10px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:#7D6B58; margin-bottom:8px;">Diamond Sets</div>
              <h3 style="font-size:16px; font-weight:500; margin-bottom:12px;">Lumina Diamond Choker</h3>
            </div>
            <div>
              <div style="font-family:'Cormorant Garamond', serif; font-size:20px; font-weight:700; color:#8B1A2C; margin-bottom:16px;">₹3,45,000</div>
              <button style="width:100%; padding:14px; background:#1A0F0A; color:#D4AF37; border:none; font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase;">Add to Bag</button>
            </div>
          </div>
        </div>
        <div style="background:#FDFAF3; border:1px solid rgba(212, 175, 55, 0.15); display:flex; flex-direction:column;">
          <div class="shimmer-wrapper" style="aspect-ratio:1;">
            <img src="https://images.unsplash.com/photo-1599643477874-c5a81026afdb?auto=format&fit=crop&w=500&q=80" style="width:100%; height:100%; object-fit:cover;" onload="this.classList.add('img-loaded')" class="img-loading">
          </div>
          <div style="padding:24px; text-align:center; display:flex; flex-direction:column; justify-content:space-between; flex-grow:1;">
            <div>
              <div style="font-size:10px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:#7D6B58; margin-bottom:8px;">Bangles</div>
              <h3 style="font-size:16px; font-weight:500; margin-bottom:12px;">Heritage Gold Kadas (Pair)</h3>
            </div>
            <div>
              <div style="font-family:'Cormorant Garamond', serif; font-size:20px; font-weight:700; color:#8B1A2C; margin-bottom:16px;">₹85,500</div>
              <button style="width:100%; padding:14px; background:#1A0F0A; color:#D4AF37; border:none; font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase;">Add to Bag</button>
            </div>
          </div>
        </div>
        <div style="background:#FDFAF3; border:1px solid rgba(212, 175, 55, 0.15); display:flex; flex-direction:column;">
          <div class="shimmer-wrapper" style="aspect-ratio:1;">
            <img src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=500&q=80" style="width:100%; height:100%; object-fit:cover;" onload="this.classList.add('img-loaded')" class="img-loading">
          </div>
          <div style="padding:24px; text-align:center; display:flex; flex-direction:column; justify-content:space-between; flex-grow:1;">
            <div>
              <div style="font-size:10px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:#7D6B58; margin-bottom:8px;">Earrings</div>
              <h3 style="font-size:16px; font-weight:500; margin-bottom:12px;">Polki Jhumkas</h3>
            </div>
            <div>
              <div style="font-family:'Cormorant Garamond', serif; font-size:20px; font-weight:700; color:#8B1A2C; margin-bottom:16px;">₹45,999</div>
              <button style="width:100%; padding:14px; background:#1A0F0A; color:#D4AF37; border:none; font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase;">Add to Bag</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 7. Bridal / Editorial -->
  <div style="padding:120px 0; background:#1A0F0A; color:#FDFAF3;">
    <div style="max-width:1320px; margin:0 auto; padding:0 24px; display:grid; grid-template-columns:1fr 1.2fr; gap:80px; align-items:center;">
      <div class="shimmer-wrapper" style="border:1px solid #D4AF37; padding:16px;">
        <img src="https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80" style="width:100%; aspect-ratio:4/5; object-fit:cover;" onload="this.classList.add('img-loaded')" class="img-loading">
      </div>
      <div>
        <span style="color:#D4AF37; font-size:12px; font-weight:700; letter-spacing:4px; text-transform:uppercase; margin-bottom:24px; display:block;">BRIDAL COLLECTION</span>
        <h2 style="font-family:'Cormorant Garamond', serif; font-size:52px; line-height:1.15; margin-bottom:28px;">Begin Your <span style="color:#D4AF37; font-style:italic;">Forever</span> in Gold</h2>
        <p style="font-size:15px; line-height:1.9; color:rgba(253, 250, 243, 0.7); margin-bottom:44px; max-width:600px;">From temple jewellery to contemporary bridal sets — find the perfect pieces to make your special day unforgettable.</p>
        <a href="#" style="display:inline-flex; background:#D4AF37; color:#1A0F0A; padding:16px 36px; font-size:12px; font-weight:700; text-decoration:none; letter-spacing:2px; text-transform:uppercase;">Explore Bridal</a>
      </div>
    </div>
  </div>

  <!-- 8. Craft Stats -->
  <div style="padding:100px 0; background:#1A0F0A; color:#FDFAF3; text-align:center;">
    <div style="max-width:1000px; margin:0 auto; padding:0 24px;">
      <span style="color:#D4AF37; font-size:12px; font-weight:700; letter-spacing:4px; text-transform:uppercase; margin-bottom:24px; display:block;">LEGACY OF TRUST</span>
      <h2 style="font-family:'Cormorant Garamond', serif; font-size:52px; margin-bottom:28px;">80 Years of <span style="color:#D4AF37; font-style:italic;">Exquisite Craftsmanship</span></h2>
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:32px; border-top:1px solid rgba(212, 175, 55, 0.2); padding-top:48px;">
        <div>
          <h3 style="font-size:40px; font-weight:700; color:#D4AF37; margin-bottom:12px;">80+</h3>
          <span style="font-size:11px; color:rgba(253, 250, 243, 0.5); text-transform:uppercase; letter-spacing:1px; font-weight:600;">Years of Trust</span>
        </div>
        <div>
          <h3 style="font-size:40px; font-weight:700; color:#D4AF37; margin-bottom:12px;">400+</h3>
          <span style="font-size:11px; color:rgba(253, 250, 243, 0.5); text-transform:uppercase; letter-spacing:1px; font-weight:600;">Stores</span>
        </div>
        <div>
          <h3 style="font-size:40px; font-weight:700; color:#D4AF37; margin-bottom:12px;">5000+</h3>
          <span style="font-size:11px; color:rgba(253, 250, 243, 0.5); text-transform:uppercase; letter-spacing:1px; font-weight:600;">Artisans</span>
        </div>
        <div>
          <h3 style="font-size:40px; font-weight:700; color:#D4AF37; margin-bottom:12px;">100%</h3>
          <span style="font-size:11px; color:rgba(253, 250, 243, 0.5); text-transform:uppercase; letter-spacing:1px; font-weight:600;">BIS Hallmarked</span>
        </div>
      </div>
    </div>
  </div>

  <!-- 9. Image with Text -->
  <div style="padding:120px 0; background:#FDFAF3;">
    <div style="max-width:1320px; margin:0 auto; padding:0 24px; display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:center;">
      <div>
        <h2 style="font-family:'Cormorant Garamond', serif; font-size:48px; color:#1A0F0A; margin-bottom:24px;">The Tanishq Promise</h2>
        <p style="font-size:16px; color:#7D6B58; line-height:1.8; margin-bottom:32px;">Every diamond is ethically sourced and rigorously graded. Every ounce of gold is melted in-house to guarantee unmatched purity. We don't just sell jewellery; we build relationships grounded in absolute transparency.</p>
        <a href="#" style="color:#8B1A2C; font-weight:700; letter-spacing:1px; text-transform:uppercase; text-decoration:underline; font-size:12px;">Read Our Ethics Policy</a>
      </div>
      <div class="shimmer-wrapper" style="aspect-ratio:4/3; border:1px solid rgba(212, 175, 55, 0.2);">
        <img src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80" style="width:100%; height:100%; object-fit:cover;" onload="this.classList.add('img-loaded')" class="img-loading">
      </div>
    </div>
  </div>

  <!-- 10. Reviews -->
  <div style="padding:100px 0; background:#FFFDFC; border-top:1px solid rgba(212, 175, 55, 0.2);">
    <div style="max-width:1320px; margin:0 auto; padding:0 24px;">
      <div style="text-align:center; margin-bottom:64px;">
        <span style="font-size:11px; font-weight:700; letter-spacing:4px; text-transform:uppercase; color:#D4AF37; margin-bottom:16px; display:block;">CUSTOMER STORIES</span>
        <h2 style="font-family:'Cormorant Garamond', serif; font-size:48px; color:#1A0F0A; margin-bottom:16px; position:relative; display:inline-block; padding-bottom:12px;">Treasured by Millions<span style="position:absolute; bottom:0; left:50%; transform:translateX(-50%); width:60px; height:1px; background:#D4AF37;"></span></h2>
      </div>
      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:24px;">
        <div style="background:#FDFAF3; border:1px solid rgba(212, 175, 55, 0.15); padding:40px 32px; text-align:center;">
          <div style="color:#D4AF37; margin-bottom:24px; display:flex; justify-content:center; gap:4px;">
            ★★★★★
          </div>
          <p style="font-family:'Cormorant Garamond', serif; font-size:22px; font-style:italic; color:#1A0F0A; line-height:1.6; margin-bottom:32px;">"The craftsmanship is unmatched. My wedding necklace from Tanishq is the most beautiful piece I own."</p>
          <div style="font-size:12px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#1A0F0A; margin-bottom:4px;">Meera S.</div>
          <div style="font-size:11px; color:#7D6B58;">Chennai • Bridal Set</div>
        </div>
        <div style="background:#FDFAF3; border:1px solid rgba(212, 175, 55, 0.15); padding:40px 32px; text-align:center;">
          <div style="color:#D4AF37; margin-bottom:24px; display:flex; justify-content:center; gap:4px;">
            ★★★★★
          </div>
          <p style="font-family:'Cormorant Garamond', serif; font-size:22px; font-style:italic; color:#1A0F0A; line-height:1.6; margin-bottom:32px;">"Bought diamond studs for my anniversary. The purity certificate and hallmark give me total confidence."</p>
          <div style="font-size:12px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#1A0F0A; margin-bottom:4px;">Rahul D.</div>
          <div style="font-size:11px; color:#7D6B58;">Pune • Diamond Studs</div>
        </div>
        <div style="background:#FDFAF3; border:1px solid rgba(212, 175, 55, 0.15); padding:40px 32px; text-align:center;">
          <div style="color:#D4AF37; margin-bottom:24px; display:flex; justify-content:center; gap:4px;">
            ★★★★★
          </div>
          <p style="font-family:'Cormorant Garamond', serif; font-size:22px; font-style:italic; color:#1A0F0A; line-height:1.6; margin-bottom:32px;">"Their everyday gold bangles are so elegant. I get compliments every single day at work!"</p>
          <div style="font-size:12px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#1A0F0A; margin-bottom:4px;">Ananya R.</div>
          <div style="font-size:11px; color:#7D6B58;">Hyderabad • Gold Bangles</div>
        </div>
      </div>
    </div>
  </div>

  <!-- 11. Footer -->
  <div style="background:#1A0F0A; color:#FDFAF3; padding:80px 0 40px; border-top:4px solid #8B1A2C;">
    <div style="max-width:1320px; margin:0 auto; padding:0 24px;">
      <div style="display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:64px; margin-bottom:64px;">
        <div>
          <div style="font-family:'Cormorant Garamond', serif; font-size:32px; font-weight:700; color:#8B1A2C; letter-spacing:4px; margin-bottom:24px;">TANISHQ</div>
          <p style="font-size:14px; color:rgba(253, 250, 243, 0.7); line-height:1.8;">A TATA product representing the pinnacle of Indian craftsmanship and purity.</p>
        </div>
        <div>
          <h4 style="font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase; margin-bottom:24px; color:#D4AF37;">Shop</h4>
          <ul style="list-style:none; line-height:2.4; font-size:14px; color:rgba(253, 250, 243, 0.7);">
            <li>Gold</li><li>Diamonds</li><li>Bridal</li><li>Gifting</li>
          </ul>
        </div>
        <div>
          <h4 style="font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase; margin-bottom:24px; color:#D4AF37;">Services</h4>
          <ul style="list-style:none; line-height:2.4; font-size:14px; color:rgba(253, 250, 243, 0.7);">
            <li>Book Appointment</li><li>Golden Harvest</li><li>Store Locator</li>
          </ul>
        </div>
        <div>
          <h4 style="font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase; margin-bottom:24px; color:#D4AF37;">Connect</h4>
          <ul style="list-style:none; line-height:2.4; font-size:14px; color:rgba(253, 250, 243, 0.7);">
            <li>Instagram</li><li>Facebook</li><li>YouTube</li>
          </ul>
        </div>
      </div>
      <div style="text-align:center; padding-top:40px; border-top:1px solid rgba(253, 250, 243, 0.1); font-size:12px; color:rgba(253, 250, 243, 0.5);">
        &copy; 2026 Tanishq. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>`;

const pilgrimPreviewHTML = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"><style>:root{--p-peach:#FFF0E5;--p-rose:#C17F5E;--p-sand:#FAF6F2;--p-text:#2A2522;--p-radius:24px}*{margin:0;padding:0;box-sizing:border-box}body{font-family:'DM Sans',sans-serif;color:var(--p-text);line-height:1.6;background:#fff;-webkit-font-smoothing:antialiased}img,svg{max-width:100%;display:block}.pg-ann{background:var(--p-text);color:var(--p-peach);text-align:center;padding:12px 16px;font-size:13px;font-weight:500;letter-spacing:.5px;display:flex;align-items:center;justify-content:center;gap:8px}.pg-ann a{color:#fff;text-decoration:underline;text-underline-offset:4px;font-weight:600}.pg-hero{position:relative;min-height:85vh;display:flex;align-items:center;overflow:hidden;background:linear-gradient(135deg,var(--p-peach) 0%,var(--p-sand) 100%)}.pg-container{max-width:1440px;margin:0 auto;width:100%;padding:0 5%}.pg-hero-grid{display:grid;grid-template-columns:1fr 1.1fr;gap:60px;align-items:center;position:relative;z-index:2}.pg-badge{display:inline-flex;background:rgba(193,127,94,.15);color:var(--p-rose);padding:8px 16px;border-radius:30px;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:24px}.pg-hero h1{font-size:clamp(40px,6vw,72px);font-weight:800;line-height:1.05;margin-bottom:24px;letter-spacing:-1.5px;color:var(--p-text)}.pg-hero h1 i{font-style:italic;color:var(--p-rose);font-weight:400}.pg-hero p{font-size:clamp(16px,2vw,18px);color:rgba(42,37,34,.7);margin-bottom:40px;max-width:480px}.pg-cta{display:inline-flex;align-items:center;gap:12px;background:var(--p-text);color:#fff;padding:18px 40px;border-radius:50px;font-size:15px;font-weight:700;text-decoration:none;transition:transform .3s,background .3s}.pg-cta:hover{transform:translateY(-2px);background:var(--p-rose)}.pg-hero-visual{position:relative;width:100%;aspect-ratio:1;display:flex;align-items:center;justify-content:center}.pg-circle-1{position:absolute;width:80%;height:80%;border-radius:50%;background:#E8D8CD;top:5%;right:0;filter:blur(40px);opacity:.6}.pg-circle-2{position:absolute;width:60%;height:60%;border-radius:50%;background:var(--p-rose);bottom:10%;left:5%;filter:blur(60px);opacity:.2}.pg-img-mask{position:relative;width:85%;height:95%;border-radius:200px 200px 24px 24px;overflow:hidden;background:#fff;border:4px solid var(--p-sand);box-shadow:0 30px 60px rgba(193,127,94,.1);display:flex;align-items:center;justify-content:center}.pg-img-mask img{width:100%;height:100%;object-fit:cover}.pg-floating-card{position:absolute;bottom:10%;left:-5%;background:rgba(255,255,255,.9);backdrop-filter:blur(10px);padding:16px 24px;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,.08);display:flex;align-items:center;gap:12px;border:1px solid rgba(255,255,255,.4)}.pg-floating-card div p{margin:0;font-size:12px;font-weight:700;color:var(--p-text)}.pg-floating-card div span{font-size:11px;color:var(--p-rose);font-weight:600}.pg-trust{margin-top:-40px;position:relative;z-index:10;padding:0 5%}.pg-trust-inner{max-width:1200px;margin:0 auto;background:rgba(255,255,255,.85);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.6);padding:24px 40px;border-radius:30px;box-shadow:0 20px 40px rgba(193,127,94,.05);display:flex;justify-content:space-around;flex-wrap:wrap;gap:20px}.pg-trust-item{display:flex;align-items:center;gap:12px;font-size:14px;font-weight:600;color:var(--p-text)}.pg-trust-icon{color:var(--p-rose);display:flex;padding:10px;background:var(--p-peach);border-radius:50%}.pg-section{padding:100px 5%}.pg-header{text-align:center;margin-bottom:60px}.pg-header h2{font-size:clamp(32px,4vw,48px);font-weight:800;letter-spacing:-1px;margin-bottom:16px}.pg-header p{font-size:16px;color:rgba(42,37,34,.6);max-width:500px;margin:0 auto}.pg-cat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;max-width:1440px;margin:0 auto}.pg-cat-card{position:relative;border-radius:var(--p-radius);overflow:hidden;aspect-ratio:4/5;text-decoration:none;display:block}.pg-cat-bg{width:100%;height:100%;object-fit:cover;transition:transform .6s cubic-bezier(0.2,0.8,0.2,1)}.pg-cat-card:hover .pg-cat-bg{transform:scale(1.05)}.pg-cat-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(42,37,34,.7) 0%,transparent 50%);display:flex;flex-direction:column;justify-content:flex-end;padding:30px;color:#fff}.pg-cat-overlay h3{font-size:24px;font-weight:700;margin-bottom:4px}.pg-cat-overlay span{font-size:13px;font-weight:500;opacity:.9}.pg-prod-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:30px;max-width:1440px;margin:0 auto}.pg-prod-card{background:#fff;border-radius:var(--p-radius);overflow:hidden;transition:transform .3s;display:flex;flex-direction:column}.pg-prod-card:hover{transform:translateY(-8px)}.pg-prod-img{position:relative;aspect-ratio:1;background:var(--p-sand);border-radius:var(--p-radius);overflow:hidden;padding:20px;display:flex;align-items:center;justify-content:center}.pg-prod-img img{width:80%;height:80%;object-fit:contain;mix-blend-mode:multiply;transition:transform .5s}.pg-prod-card:hover .pg-prod-img img{transform:scale(1.08)}.pg-tag{position:absolute;top:16px;left:16px;background:#fff;color:var(--p-text);padding:6px 14px;border-radius:20px;font-size:11px;font-weight:800;letter-spacing:1px;box-shadow:0 4px 12px rgba(0,0,0,.05)}.pg-prod-info{padding:24px 8px 8px;flex-grow:1;display:flex;flex-direction:column}.pg-rating{display:flex;align-items:center;gap:4px;margin-bottom:8px;color:#F59E0B;font-size:13px}.pg-rating span{color:rgba(42,37,34,.5);font-weight:500;font-size:12px;margin-left:4px}.pg-prod-title{font-size:16px;font-weight:700;line-height:1.4;margin-bottom:12px;flex-grow:1}.pg-prod-price{display:flex;align-items:baseline;gap:8px;margin-bottom:20px}.pg-price-new{font-size:20px;font-weight:800;color:var(--p-rose)}.pg-price-old{font-size:14px;color:rgba(42,37,34,.4);text-decoration:line-through}.pg-add{width:100%;padding:14px;background:var(--p-sand);color:var(--p-text);border:none;border-radius:16px;font-size:13px;font-weight:700;cursor:pointer;transition:background .3s,color .3s;letter-spacing:.5px}.pg-prod-card:hover .pg-add{background:var(--p-text);color:#fff}@media(max-width:1024px){.pg-hero-grid{grid-template-columns:1fr;text-align:center;gap:40px;padding-top:40px}.pg-hero p{margin:0 auto 40px}.pg-cat-grid,.pg-prod-grid{grid-template-columns:repeat(2,1fr);gap:16px}.pg-floating-card{display:none}.pg-img-mask{border-radius:120px 120px 24px 24px}}@media(max-width:640px){.pg-trust-inner{padding:20px;border-radius:20px;flex-direction:column;align-items:flex-start;gap:16px}.pg-hero{min-height:auto;padding-bottom:60px}.pg-section{padding:60px 5%}}/* Pilgrim skeleton shimmer */@keyframes pilgrim-shine {  0%   { background-position: -800px 0; }  100% { background-position: 800px 0; }}@media (prefers-reduced-motion: reduce) {  @keyframes pilgrim-shine { 0%,100%{ opacity:1; } 50%{ opacity:.6; } }}.pg-cat-card, .pg-prod-img, .pg-img-mask {  position: relative;  overflow: hidden;}.pg-cat-card::after, .pg-prod-img::after, .pg-img-mask::after {  content: ""; position: absolute; inset: 0;  background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0) 100%);  background-size: 800px 100%;  animation: pilgrim-shine 1.5s infinite linear;  pointer-events: none;  z-index: 5;}</style></head><body><div class="pg-ann">✨ Reveal your natural glow. Free shipping on orders over ₹999 <a href="#">Shop Now</a></div><div class="pg-hero"><div class="pg-container pg-hero-grid"><div><div class="pg-badge">Vegan &amp; Cruelty-Free</div><h1>Ancient Beauty,<br><i>Modern Science.</i></h1><p>Discover potent skincare formulations crafted with pure global ingredients. Unlock the secret to radiant, healthy skin.</p><a href="#" class="pg-cta">Explore Collection <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a></div><div class="pg-hero-visual"><div class="pg-circle-1"></div><div class="pg-circle-2"></div><div class="pg-img-mask"><img src="https://images.unsplash.com/photo-1615397323237-77fb270fb759?q=80&amp;w=800&amp;auto=format&amp;fit=crop" alt="Skincare Model" style="width: 100%; height: 100%; object-fit: cover;"></div><div class="pg-floating-card"><div class="pg-trust-icon" style="padding: 6px; background: #fff;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg></div><div><p>FDA Approved</p><span>Dermatologically Tested</span></div></div></div></div></div><div class="pg-trust"><div class="pg-trust-inner"><div class="pg-trust-item"><div class="pg-trust-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg></div>Free &amp; Fast Shipping</div><div class="pg-trust-item"><div class="pg-trust-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div>100% Cruelty Free</div><div class="pg-trust-item"><div class="pg-trust-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg></div>Toxin Free Formulas</div></div></div><div class="pg-section"><div class="pg-header"><div class="pg-badge" style="background: transparent; color: var(--p-rose); padding: 0; margin-bottom: 12px;">Curated Rituals</div><h2>Shop by Category</h2></div><div class="pg-cat-grid"><a href="#" class="pg-cat-card"><img src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&amp;w=600&amp;auto=format&amp;fit=crop" class="pg-cat-bg" alt="Skincare"><div class="pg-cat-overlay"><h3>Face Care</h3><span>45+ Products</span></div></a><a href="#" class="pg-cat-card"><img src="https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&amp;w=600&amp;auto=format&amp;fit=crop" class="pg-cat-bg" alt="Haircare"><div class="pg-cat-overlay"><h3>Hair Care</h3><span>32+ Products</span></div></a><a href="#" class="pg-cat-card"><img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&amp;w=600&amp;auto=format&amp;fit=crop" class="pg-cat-bg" alt="Bodycare"><div class="pg-cat-overlay"><h3>Body Care</h3><span>28+ Products</span></div></a><a href="#" class="pg-cat-card"><img src="https://images.unsplash.com/photo-1594913604432-840b2fbe00e5?q=80&amp;w=600&amp;auto=format&amp;fit=crop" class="pg-cat-bg" alt="Gifting"><div class="pg-cat-overlay"><h3>Gifts &amp; Kits</h3><span>15+ Products</span></div></a></div></div><div class="pg-section" style="background: #FAFAFA;"><div class="pg-header"><div class="pg-badge" style="background: transparent; color: var(--p-rose); padding: 0; margin-bottom: 12px;">Most Loved</div><h2>Bestselling Formulas</h2></div><div class="pg-prod-grid"><div class="pg-prod-card"><div class="pg-prod-img"><div class="pg-tag">BESTSELLER</div><img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&amp;w=400&amp;auto=format&amp;fit=crop" alt="Serum"></div><div class="pg-prod-info"><div class="pg-rating">★★★★★ <span>(1.2k)</span></div><div class="pg-prod-title">2% Hyaluronic Acid Hydration Serum</div><div class="pg-prod-price"><span class="pg-price-new">₹599</span> <span class="pg-price-old">₹799</span></div><button class="pg-add">Add to Cart</button></div></div><div class="pg-prod-card"><div class="pg-prod-img"><div class="pg-tag" style="color: #2ECC71;">NEW IN</div><img src="https://images.unsplash.com/photo-1608248593842-8021b61c9443?q=80&amp;w=400&amp;auto=format&amp;fit=crop" alt="Moisturizer"></div><div class="pg-prod-info"><div class="pg-rating">★★★★☆ <span>(840)</span></div><div class="pg-prod-title">Korean Snail Mucin Repair Cream</div><div class="pg-prod-price"><span class="pg-price-new">₹649</span> <span class="pg-price-old">₹899</span></div><button class="pg-add">Add to Cart</button></div></div><div class="pg-prod-card"><div class="pg-prod-img"><img src="https://images.unsplash.com/photo-1629198725962-d2861c8a66b2?q=80&amp;w=400&amp;auto=format&amp;fit=crop" alt="Oil"></div><div class="pg-prod-info"><div class="pg-rating">★★★★★ <span>(2.4k)</span></div><div class="pg-prod-title">Redensyl Advanced Hair Growth Serum</div><div class="pg-prod-price"><span class="pg-price-new">₹899</span></div><button class="pg-add">Add to Cart</button></div></div><div class="pg-prod-card"><div class="pg-prod-img"><div class="pg-tag" style="color: #E74C3C;">HOT</div><img src="https://images.unsplash.com/photo-1556228720-192a6af4e865?q=80&amp;w=400&amp;auto=format&amp;fit=crop" alt="Peel"></div><div class="pg-prod-info"><div class="pg-rating">★★★★★ <span>(3.1k)</span></div><div class="pg-prod-title">25% AHA + 2% BHA Peeling Solution</div><div class="pg-prod-price"><span class="pg-price-new">₹549</span> <span class="pg-price-old">₹699</span></div><button class="pg-add">Add to Cart</button></div></div></div></div>Your Brand.</span><span>Powered by ConvertFlow</span></div></div></div>


<!-- SUPER THEME SECTIONS PREVIEW -->
<div style="font-family: inherit; background: #FFF9FB; padding: 40px 0; border-top: 1px solid rgba(0,0,0,0.05); color: #1a0a0e;">
  <div style="text-align: center; margin-bottom: 20px;">
    <span style="background: #C9184A; color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Super Theme Sections</span>
  </div>

  <!-- COUNTDOWN BANNER -->
  <div style="background:#C9184A; color:#fff; text-align:center; padding:24px; margin: 40px 0;">
    <h2 style="font-size:24px; font-weight:700; margin-bottom:12px;">Flash Sale Ending Soon</h2>
    <div style="display:inline-flex; gap:16px;">
      <div style="background:rgba(0,0,0,0.15); padding:12px 20px; border-radius:8px;"><span style="font-size:24px; font-weight:700;">02</span><br><span style="font-size:11px; text-transform:uppercase;">Days</span></div>
      <div style="background:rgba(0,0,0,0.15); padding:12px 20px; border-radius:8px;"><span style="font-size:24px; font-weight:700;">14</span><br><span style="font-size:11px; text-transform:uppercase;">Hours</span></div>
      <div style="background:rgba(0,0,0,0.15); padding:12px 20px; border-radius:8px;"><span style="font-size:24px; font-weight:700;">45</span><br><span style="font-size:11px; text-transform:uppercase;">Mins</span></div>
      <div style="background:rgba(0,0,0,0.15); padding:12px 20px; border-radius:8px;"><span style="font-size:24px; font-weight:700;">12</span><br><span style="font-size:11px; text-transform:uppercase;">Secs</span></div>
    </div>
  </div>

  <!-- BEFORE/AFTER SLIDER -->
  <div style="max-width:800px; margin:60px auto; text-align:center;">
    <h2 style="font-size:32px; font-weight:800; margin-bottom:8px; color: #1a0a0e;">Real Results</h2>
    <p style="opacity:0.7; margin-bottom:32px;">See the difference</p>
    <div style="position:relative; width:100%; height:400px; background:rgba(0,0,0,0.05); border-radius:12px; overflow:hidden;">
      <div style="position:absolute; inset:0; background:url('https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png') center/cover;"></div>
      <div style="position:absolute; inset:0; right:50%; background:url('https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png') center/cover; border-right:4px solid #fff; filter:grayscale(100%);"></div>
      <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:40px; height:40px; background:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 10px rgba(0,0,0,0.2);"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></div>
    </div>
  </div>

  <!-- FREQUENTLY BOUGHT TOGETHER -->
  <div style="max-width:1000px; margin:60px auto; background:rgba(0,0,0,0.03); padding:40px; border-radius:12px; border: 1px solid rgba(0,0,0,0.05);">
    <h2 style="font-size:24px; font-weight:700; margin-bottom:24px; color: #1a0a0e;">Frequently Bought Together</h2>
    <div style="display:flex; gap:20px; align-items:center; margin-bottom:24px;">
      <div style="width:120px; text-align:center;"><div style="width:120px; height:120px; background:rgba(0,0,0,0.08); border-radius:8px; margin-bottom:12px;"></div><div style="font-weight:600; font-size:14px; color: #1a0a0e;">Main Item</div></div>
      <div style="font-size:24px; opacity: 0.3;">+</div>
      <div style="width:120px; text-align:center;"><div style="width:120px; height:120px; background:rgba(0,0,0,0.08); border-radius:8px; margin-bottom:12px;"></div><div style="font-weight:600; font-size:14px; color: #1a0a0e;">Add-on 1</div></div>
      <div style="font-size:24px; opacity: 0.3;">+</div>
      <div style="width:120px; text-align:center;"><div style="width:120px; height:120px; background:rgba(0,0,0,0.08); border-radius:8px; margin-bottom:12px;"></div><div style="font-weight:600; font-size:14px; color: #1a0a0e;">Add-on 2</div></div>
      <div style="margin-left:auto; text-align:right;">
        <div style="font-size:14px; opacity: 0.5; text-decoration:line-through;">$150.00</div>
        <div style="font-size:24px; font-weight:800; color: #C9184A;">$135.00</div>
        <button style="background:#1a0a0e; color:#FFF9FB; border:none; padding:12px 24px; border-radius:6px; font-weight:600; margin-top:12px; cursor:pointer;">Add Bundle to Cart</button>
      </div>
    </div>
  </div>

  <!-- SHOPPABLE IMAGE -->
  <div style="max-width:1200px; margin:60px auto; text-align:center;">
    <h2 style="font-size:32px; font-weight:800; margin-bottom:8px; color: #1a0a0e;">Shop the Look</h2>
    <p style="opacity:0.7; margin-bottom:32px;">Tap the pins to view products</p>
    <div style="position:relative; width:100%; height:500px; background:rgba(0,0,0,0.05); border-radius:12px; overflow:hidden;">
      <div style="position:absolute; top:40%; left:50%; width:24px; height:24px; background:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 0 0 4px rgba(255,255,255,0.3); cursor:pointer;">
        <div style="width:8px; height:8px; background:#C9184A; border-radius:50%;"></div>
      </div>
      <div style="position:absolute; top:60%; left:30%; width:24px; height:24px; background:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 0 0 4px rgba(255,255,255,0.3); cursor:pointer;">
        <div style="width:8px; height:8px; background:#C9184A; border-radius:50%;"></div>
      </div>
    </div>
  </div>
</div>
</body></html>`;

/* ── CaratLane Preview ── */
const caratlanePreviewHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>CaratLane Store Preview</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #fff; color: #333; -webkit-font-smoothing: antialiased; }
    img { max-width: 100%; height: auto; display: block; }
    
    /* SHIMMER STYLES */
    .shimmer-wrapper {
      position: relative;
      background: #f5f5f5;
      overflow: hidden;
    }
    .shimmer-wrapper::before {
      content: '';
      position: absolute;
      top: 0; left: -100%; width: 50%; height: 100%;
      background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.6), transparent);
      animation: shimmer 2s infinite linear;
      z-index: 10;
    }
    @keyframes shimmer {
      100% { left: 200%; }
    }
    .img-loading { opacity: 0; transition: opacity 0.5s ease; }
    .img-loaded { opacity: 1; }
  </style>
</head>
<body>
  <!-- 1. Announcement Bar -->
  <div style="background:#f1e9ff; color:#493161; padding:10px; text-align:center; font-size:12px; font-weight:600; letter-spacing:1px;">
    ✨ Extra 20% off on Diamond Making Charges. Use code: SHINE20
  </div>

  <!-- 2. Header -->
  <div style="padding:20px 40px; border-bottom:1px solid #eee; background:#fff; position:sticky; top:0; z-index:100; display:flex; justify-content:space-between; align-items:center;">
    <div style="display:flex; gap:24px; font-size:13px; font-weight:500;">
      <span style="color:#493161; font-weight:600;">NEW ARRIVALS</span>
      <span>RINGS</span>
      <span>EARRINGS</span>
      <span>NECKLACES</span>
    </div>
    <div style="font-family:'Playfair Display', serif; font-size:32px; font-weight:700; color:#493161; letter-spacing:1px;">CaratLane</div>
    <div style="display:flex; gap:24px; color:#493161;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
    </div>
  </div>

  <!-- 3. Hero -->
  <div style="background:linear-gradient(135deg,#fdfbfb,#ebedee); position:relative; overflow:hidden;">
    <div style="max-width:1320px; margin:0 auto; padding:60px 24px; display:grid; grid-template-columns:1fr 1fr; min-height:560px; align-items:center; gap:40px;">
      <div style="z-index:2;">
        <span style="font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#885bb5; margin-bottom:16px; display:block;">A TANISHQ PARTNERSHIP</span>
        <h1 style="font-family:'Playfair Display', serif; font-size:64px; font-weight:700; color:#493161; line-height:1.1; margin-bottom:24px;">Diamonds for Every Day, <i style="font-style:italic; color:#885bb5;">Every You</i></h1>
        <p style="font-size:16px; line-height:1.6; color:#555; max-width:480px; margin-bottom:40px;">Discover lightweight, everyday fine jewellery designed for the modern Indian woman. Try at home, buy with confidence.</p>
        <div style="display:flex; gap:16px;">
          <a href="#" style="display:inline-flex; align-items:center; justify-content:center; background:#493161; color:#fff; padding:14px 32px; font-size:14px; font-weight:600; text-decoration:none; border-radius:8px; box-shadow:0 4px 12px rgba(73, 49, 97, 0.2);">Shop New Arrivals</a>
          <a href="#" style="display:inline-flex; align-items:center; justify-content:center; background:#fff; color:#493161; padding:14px 32px; font-size:14px; font-weight:600; text-decoration:none; border-radius:8px; border:1px solid #493161;">Try at Home</a>
        </div>
      </div>
      <div style="position:relative; z-index:1;">
        <div style="position:absolute; inset:10% 0 -10% 10%; background:linear-gradient(135deg, #e0c3fc, #8ec5fc); border-radius:24px; opacity:0.3; filter:blur(40px);"></div>
        <div style="position:relative; background:#fff; border-radius:16px; padding:12px; box-shadow:0 20px 40px rgba(73, 49, 97, 0.1); transform:rotate(2deg);">
          <div class="shimmer-wrapper" style="width:100%; aspect-ratio:4/5; border-radius:8px;">
            <img src="https://images.unsplash.com/photo-1599643477874-c5a81026afdb?auto=format&fit=crop&w=800&q=80" style="width:100%; height:100%; object-fit:cover;" onload="this.classList.add('img-loaded')" class="img-loading">
          </div>
          <div style="position:absolute; top:30px; left:-30px; background:#fff; padding:16px; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.1); display:flex; align-items:center; gap:12px; transform:rotate(-4deg);">
            <div style="width:40px; height:40px; background:#F6EFFB; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#493161;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
            <div>
              <div style="font-size:12px; font-weight:700; color:#493161;">Try at Home</div>
              <div style="font-size:10px; color:#666;">Free Service</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 4. Trust Badges -->
  <div style="background:#fff; padding:40px 0; border-bottom:1px solid #eee;">
    <div style="max-width:1320px; margin:0 auto; padding:0 24px; display:grid; grid-template-columns:repeat(4, 1fr); gap:24px;">
      <div style="display:flex; align-items:center; gap:16px; background:#F6EFFB; padding:20px; border-radius:12px;">
        <div style="width:48px; height:48px; background:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#493161; box-shadow:0 4px 12px rgba(73, 49, 97, 0.08);">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        </div>
        <div>
          <h3 style="font-size:14px; font-weight:700; color:#493161; margin-bottom:4px;">BIS Hallmarked</h3>
          <p style="font-size:12px; color:#666; line-height:1.4;">100% certified purity</p>
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:16px; background:#F6EFFB; padding:20px; border-radius:12px;">
        <div style="width:48px; height:48px; background:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#493161; box-shadow:0 4px 12px rgba(73, 49, 97, 0.08);">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <div>
          <h3 style="font-size:14px; font-weight:700; color:#493161; margin-bottom:4px;">Lifetime Exchange</h3>
          <p style="font-size:12px; color:#666; line-height:1.4;">Full value exchange policy</p>
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:16px; background:#F6EFFB; padding:20px; border-radius:12px;">
        <div style="width:48px; height:48px; background:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#493161; box-shadow:0 4px 12px rgba(73, 49, 97, 0.08);">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
        </div>
        <div>
          <h3 style="font-size:14px; font-weight:700; color:#493161; margin-bottom:4px;">15-Day Returns</h3>
          <p style="font-size:12px; color:#666; line-height:1.4;">No questions asked</p>
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:16px; background:#F6EFFB; padding:20px; border-radius:12px;">
        <div style="width:48px; height:48px; background:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#493161; box-shadow:0 4px 12px rgba(73, 49, 97, 0.08);">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </div>
        <div>
          <h3 style="font-size:14px; font-weight:700; color:#493161; margin-bottom:4px;">Try at Home</h3>
          <p style="font-size:12px; color:#666; line-height:1.4;">Free trial before you buy</p>
        </div>
      </div>
    </div>
  </div>

  <!-- 5. Collections (Occasions) -->
  <div style="background:#fafafa; padding:80px 0;">
    <div style="max-width:1320px; margin:0 auto; padding:0 24px;">
      <div style="text-align:center; margin-bottom:48px;">
        <span style="font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#885bb5; margin-bottom:12px; display:block;">SHOP BY OCCASION</span>
        <h2 style="font-family:'Playfair Display', serif; font-size:40px; font-weight:700; color:#493161; margin-bottom:12px;">For Every Moment</h2>
        <p style="font-size:15px; color:#666; max-width:500px; margin:0 auto;">Find the perfect piece for work, weekends, or celebrations</p>
      </div>
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:20px;">
        <div class="shimmer-wrapper" style="border-radius:12px; aspect-ratio:3/4; position:relative; overflow:hidden;">
          <img src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80" style="width:100%; height:100%; object-fit:cover;" onload="this.classList.add('img-loaded')" class="img-loading">
          <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(73, 49, 97, 0.8) 0%, transparent 50%); display:flex; flex-direction:column; justify-content:flex-end; padding:24px;">
            <h3 style="font-size:20px; font-weight:600; color:#fff; margin-bottom:4px;">Everyday Wear</h3>
            <span style="font-size:12px; color:rgba(255,255,255,0.8);">200+ designs</span>
          </div>
        </div>
        <div class="shimmer-wrapper" style="border-radius:12px; aspect-ratio:3/4; position:relative; overflow:hidden;">
          <img src="https://images.unsplash.com/photo-1599643477874-c5a81026afdb?auto=format&fit=crop&w=600&q=80" style="width:100%; height:100%; object-fit:cover;" onload="this.classList.add('img-loaded')" class="img-loading">
          <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(73, 49, 97, 0.8) 0%, transparent 50%); display:flex; flex-direction:column; justify-content:flex-end; padding:24px;">
            <h3 style="font-size:20px; font-weight:600; color:#fff; margin-bottom:4px;">Office Chic</h3>
            <span style="font-size:12px; color:rgba(255,255,255,0.8);">120+ designs</span>
          </div>
        </div>
        <div class="shimmer-wrapper" style="border-radius:12px; aspect-ratio:3/4; position:relative; overflow:hidden;">
          <img src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80" style="width:100%; height:100%; object-fit:cover;" onload="this.classList.add('img-loaded')" class="img-loading">
          <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(73, 49, 97, 0.8) 0%, transparent 50%); display:flex; flex-direction:column; justify-content:flex-end; padding:24px;">
            <h3 style="font-size:20px; font-weight:600; color:#fff; margin-bottom:4px;">Wedding Guest</h3>
            <span style="font-size:12px; color:rgba(255,255,255,0.8);">80+ designs</span>
          </div>
        </div>
        <div class="shimmer-wrapper" style="border-radius:12px; aspect-ratio:3/4; position:relative; overflow:hidden;">
          <img src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=600&q=80" style="width:100%; height:100%; object-fit:cover;" onload="this.classList.add('img-loaded')" class="img-loading">
          <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(73, 49, 97, 0.8) 0%, transparent 50%); display:flex; flex-direction:column; justify-content:flex-end; padding:24px;">
            <h3 style="font-size:20px; font-weight:600; color:#fff; margin-bottom:4px;">Gifting</h3>
            <span style="font-size:12px; color:rgba(255,255,255,0.8);">150+ designs</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 6. Bestsellers -->
  <div style="background:#fff; padding:80px 0;">
    <div style="max-width:1320px; margin:0 auto; padding:0 24px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:40px;">
        <div>
          <span style="font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#885bb5; margin-bottom:12px; display:block;">TRENDING NOW</span>
          <h2 style="font-family:'Playfair Display', serif; font-size:36px; font-weight:700; color:#493161; margin-bottom:8px;">Bestselling Designs</h2>
          <p style="font-size:14px; color:#666;">Most loved pieces by our community</p>
        </div>
        <a href="#" style="display:inline-flex; align-items:center; gap:8px; color:#493161; font-size:14px; font-weight:600; text-decoration:none; padding-bottom:4px; border-bottom:2px solid #493161;">
          View All Bestsellers
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:24px;">
        <div style="background:#fff; border-radius:8px; border:1px solid #eee; display:flex; flex-direction:column; position:relative;">
          <div style="position:absolute; top:12px; right:12px; z-index:2; background:#fff; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 8px rgba(0,0,0,0.1); color:#999;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </div>
          <div class="shimmer-wrapper" style="aspect-ratio:1;">
            <img src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=500&q=80" style="width:100%; height:100%; object-fit:cover; mix-blend-mode:multiply;" onload="this.classList.add('img-loaded')" class="img-loading">
          </div>
          <div style="padding:20px; display:flex; flex-direction:column; flex-grow:1;">
            <h3 style="font-size:14px; font-weight:500; color:#333; line-height:1.4; margin-bottom:12px; height:40px;">Elegant Diamond Ring</h3>
            <div style="margin-top:auto;">
              <div style="font-size:18px; font-weight:700; color:#493161; margin-bottom:16px;">₹24,999</div>
              <button style="width:100%; padding:12px; background:#fff; color:#493161; border:1px solid #493161; border-radius:6px; font-size:13px; font-weight:600;">Add to Cart</button>
            </div>
          </div>
        </div>
        <div style="background:#fff; border-radius:8px; border:1px solid #eee; display:flex; flex-direction:column; position:relative;">
          <div style="position:absolute; top:12px; right:12px; z-index:2; background:#fff; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 8px rgba(0,0,0,0.1); color:#999;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </div>
          <div class="shimmer-wrapper" style="aspect-ratio:1;">
            <img src="https://images.unsplash.com/photo-1599643477874-c5a81026afdb?auto=format&fit=crop&w=500&q=80" style="width:100%; height:100%; object-fit:cover; mix-blend-mode:multiply;" onload="this.classList.add('img-loaded')" class="img-loading">
          </div>
          <div style="padding:20px; display:flex; flex-direction:column; flex-grow:1;">
            <h3 style="font-size:14px; font-weight:500; color:#333; line-height:1.4; margin-bottom:12px; height:40px;">Solitaire Stud Earrings</h3>
            <div style="margin-top:auto;">
              <div style="font-size:18px; font-weight:700; color:#493161; margin-bottom:16px;">₹35,500</div>
              <button style="width:100%; padding:12px; background:#fff; color:#493161; border:1px solid #493161; border-radius:6px; font-size:13px; font-weight:600;">Add to Cart</button>
            </div>
          </div>
        </div>
        <div style="background:#fff; border-radius:8px; border:1px solid #eee; display:flex; flex-direction:column; position:relative;">
          <div style="position:absolute; top:12px; right:12px; z-index:2; background:#fff; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 8px rgba(0,0,0,0.1); color:#999;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </div>
          <div class="shimmer-wrapper" style="aspect-ratio:1;">
            <img src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=500&q=80" style="width:100%; height:100%; object-fit:cover; mix-blend-mode:multiply;" onload="this.classList.add('img-loaded')" class="img-loading">
          </div>
          <div style="padding:20px; display:flex; flex-direction:column; flex-grow:1;">
            <h3 style="font-size:14px; font-weight:500; color:#333; line-height:1.4; margin-bottom:12px; height:40px;">Rose Gold Mangalsutra</h3>
            <div style="margin-top:auto;">
              <div style="font-size:18px; font-weight:700; color:#493161; margin-bottom:16px;">₹18,999</div>
              <button style="width:100%; padding:12px; background:#fff; color:#493161; border:1px solid #493161; border-radius:6px; font-size:13px; font-weight:600;">Add to Cart</button>
            </div>
          </div>
        </div>
        <div style="background:#fff; border-radius:8px; border:1px solid #eee; display:flex; flex-direction:column; position:relative;">
          <div style="position:absolute; top:12px; right:12px; z-index:2; background:#fff; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 8px rgba(0,0,0,0.1); color:#999;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </div>
          <div class="shimmer-wrapper" style="aspect-ratio:1;">
            <img src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=500&q=80" style="width:100%; height:100%; object-fit:cover; mix-blend-mode:multiply;" onload="this.classList.add('img-loaded')" class="img-loading">
          </div>
          <div style="padding:20px; display:flex; flex-direction:column; flex-grow:1;">
            <h3 style="font-size:14px; font-weight:500; color:#333; line-height:1.4; margin-bottom:12px; height:40px;">Classic Diamond Bracelet</h3>
            <div style="margin-top:auto;">
              <div style="font-size:18px; font-weight:700; color:#493161; margin-bottom:16px;">₹45,000</div>
              <button style="width:100%; padding:12px; background:#fff; color:#493161; border:1px solid #493161; border-radius:6px; font-size:13px; font-weight:600;">Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 7. Try at Home -->
  <div style="background:#F6EFFB; margin:40px 24px; border-radius:24px; overflow:hidden;">
    <div style="max-width:1320px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; align-items:center;">
      <div style="padding:80px 64px;">
        <span style="font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#885bb5; margin-bottom:16px; display:inline-flex; align-items:center; gap:8px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          FREE SERVICE
        </span>
        <h2 style="font-family:'Playfair Display', serif; font-size:48px; font-weight:700; color:#493161; line-height:1.2; margin-bottom:24px;">Try at Home, Buy with Confidence</h2>
        <p style="font-size:16px; line-height:1.6; color:#555; margin-bottom:40px; max-width:480px;">Select up to 3 designs, try them in the comfort of your home, and only pay for what you love. Free delivery, free returns.</p>
        <a href="#" style="display:inline-flex; align-items:center; justify-content:center; background:#493161; color:#fff; padding:16px 36px; font-size:14px; font-weight:600; text-decoration:none; border-radius:8px; box-shadow:0 4px 12px rgba(73, 49, 97, 0.2);">Book Free Trial</a>
      </div>
      <div class="shimmer-wrapper" style="height:100%; min-height:400px; position:relative;">
        <img src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80" style="width:100%; height:100%; object-fit:cover; position:absolute; inset:0;" onload="this.classList.add('img-loaded')" class="img-loading">
      </div>
    </div>
  </div>

  <!-- 8. Reviews -->
  <div style="background:#fff; padding:80px 0; border-top:1px solid #eee;">
    <div style="max-width:1320px; margin:0 auto; padding:0 24px;">
      <div style="text-align:center; margin-bottom:48px;">
        <span style="font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#885bb5; margin-bottom:12px; display:block;">HAPPY CUSTOMERS</span>
        <h2 style="font-family:'Playfair Display', serif; font-size:40px; font-weight:700; color:#493161; margin-bottom:12px;">What Our Community Says</h2>
      </div>
      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:24px;">
        <div style="background:#F6EFFB; border-radius:12px; padding:32px; display:flex; flex-direction:column;">
          <div style="color:#d1c4e9; margin-bottom:20px; display:flex; gap:4px;">★★★★★</div>
          <p style="font-size:15px; color:#493161; line-height:1.6; margin-bottom:24px; flex-grow:1;">"The Try at Home service was amazing! I could compare 3 designs side by side before choosing my dream ring."</p>
          <div style="display:flex; justify-content:space-between; align-items:flex-end;">
            <div>
              <div style="font-size:14px; font-weight:700; color:#493161; margin-bottom:4px;">Aditi S.</div>
              <div style="font-size:12px; color:#885bb5;">Mumbai • Solitaire Ring</div>
            </div>
          </div>
        </div>
        <div style="background:#F6EFFB; border-radius:12px; padding:32px; display:flex; flex-direction:column;">
          <div style="color:#d1c4e9; margin-bottom:20px; display:flex; gap:4px;">★★★★★</div>
          <p style="font-size:15px; color:#493161; line-height:1.6; margin-bottom:24px; flex-grow:1;">"Perfect everyday earrings. So lightweight I forget I'm wearing them, yet I get compliments daily!"</p>
          <div style="display:flex; justify-content:space-between; align-items:flex-end;">
            <div>
              <div style="font-size:14px; font-weight:700; color:#493161; margin-bottom:4px;">Riya M.</div>
              <div style="font-size:12px; color:#885bb5;">Bangalore • Diamond Hoops</div>
            </div>
          </div>
        </div>
        <div style="background:#F6EFFB; border-radius:12px; padding:32px; display:flex; flex-direction:column;">
          <div style="color:#d1c4e9; margin-bottom:20px; display:flex; gap:4px;">★★★★★</div>
          <p style="font-size:15px; color:#493161; line-height:1.6; margin-bottom:24px; flex-grow:1;">"Gifted the mangalsutra to my wife — the modern design blew her away. CaratLane nailed it."</p>
          <div style="display:flex; justify-content:space-between; align-items:flex-end;">
            <div>
              <div style="font-size:14px; font-weight:700; color:#493161; margin-bottom:4px;">Vikram P.</div>
              <div style="font-size:12px; color:#885bb5;">Pune • Diamond Mangalsutra</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 9. Footer -->
  <div style="background:#493161; color:#fff; padding:60px 0 30px;">
    <div style="max-width:1320px; margin:0 auto; padding:0 24px;">
      <div style="display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:40px; margin-bottom:40px;">
        <div>
          <div style="font-family:'Playfair Display', serif; font-size:28px; font-weight:700; color:#fff; letter-spacing:1px; margin-bottom:16px;">CaratLane</div>
          <p style="font-size:14px; color:rgba(255,255,255,0.7); line-height:1.6;">A Tanishq Partnership. Fine jewellery designed for everyday wear.</p>
        </div>
        <div>
          <h4 style="font-size:13px; font-weight:600; text-transform:uppercase; margin-bottom:16px; color:#d1c4e9;">Shop</h4>
          <ul style="list-style:none; line-height:2.2; font-size:14px; color:rgba(255,255,255,0.8);">
            <li>Rings</li><li>Earrings</li><li>Bracelets</li><li>Solitaires</li>
          </ul>
        </div>
        <div>
          <h4 style="font-size:13px; font-weight:600; text-transform:uppercase; margin-bottom:16px; color:#d1c4e9;">Services</h4>
          <ul style="list-style:none; line-height:2.2; font-size:14px; color:rgba(255,255,255,0.8);">
            <li>Try at Home</li><li>Store Locator</li><li>Digital Gold</li>
          </ul>
        </div>
        <div>
          <h4 style="font-size:13px; font-weight:600; text-transform:uppercase; margin-bottom:16px; color:#d1c4e9;">Support</h4>
          <ul style="list-style:none; line-height:2.2; font-size:14px; color:rgba(255,255,255,0.8);">
            <li>Contact Us</li><li>Return Policy</li><li>Track Order</li>
          </ul>
        </div>
      </div>
      <div style="text-align:center; padding-top:30px; border-top:1px solid rgba(255,255,255,0.1); font-size:13px; color:rgba(255,255,255,0.5);">
        &copy; 2026 CaratLane. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>`;

const PREVIEW_MAP = {
  pilgrim: pilgrimPreviewHTML,
  tanishq: tanishqPreviewHTML,
  caratlane: caratlanePreviewHTML,
  ...TEMPLATE_HTMLS,
};

/* ── Default settings per template ── */
const DEFAULT_SETTINGS = {
  ann_text: "Free shipping on orders above ₹999 🎉",
  hero_tag: "New Arrival",
  hero_h1: "",
  hero_sub: "Discover our curated collection — crafted with quality you can feel.",
  hero_cta: "Shop Now",
  hero_cta2: "",
  prod_heading: "Featured Products",
  prod_sub: "Handpicked for you",
  nl_h: "Join Our Community",
  nl_sub: "Subscribe for exclusive offers, new arrivals & insider updates.",
};

export default function Index() {
  const [selectedTemplate, setSelectedTemplate] = useState("caratlane");
  const [previewMode, setPreviewMode] = useState("desktop");
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [iframeLoading, setIframeLoading] = useState(true);
  const fetcher = useFetcher();
  const isInjecting = fetcher.state === "submitting";
  const injectResult = fetcher.data;

  const viewportWidth = { desktop: "100%", tablet: "768px", mobile: "375px" }[previewMode];
  const currentTpl = TEMPLATES.find((t) => t.id === selectedTemplate);

  // Reset loading state whenever template changes
  useEffect(() => {
    setIframeLoading(true);
  }, [selectedTemplate]);

  const setSetting = useCallback((key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleInject = () => {
    fetcher.submit(
      { template: selectedTemplate, ...settings },
      { method: "POST", action: "/api/inject-template" }
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f5f7" }}>
      {/* Top Bar */}
      <div style={{
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        padding: "16px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {icon("zap")}
            <span style={{ fontSize: 22, fontWeight: 800, color: "#1a1a1a" }}>ConvertFlow</span>
          </div>
          <span style={{ fontSize: 13, color: "#888", borderLeft: "1px solid #ddd", paddingLeft: 16 }}>
            Template Library
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {["desktop", "tablet", "mobile"].map((v) => (
            <button
              key={v}
              onClick={() => setPreviewMode(v)}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                background: previewMode === v ? "#1a1a1a" : "#fff",
                color: previewMode === v ? "#fff" : "#555",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {icon(v)} {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "24px", maxWidth: 1400, margin: "0 auto" }}>
        {/* Template Selector — Grid Layout */}
        <div style={{ marginBottom: 20 }}>
          {/* Header row */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginBottom: 14,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a" }}>
                All Templates
              </span>
              <span style={{
                background: "#1a1a1a", color: "#fff", fontSize: 11, fontWeight: 700,
                padding: "3px 10px", borderRadius: 20,
              }}>
                {TEMPLATES.length}
              </span>
            </div>
            <span style={{ fontSize: 12, color: "#aaa" }}>
              Click any template to preview it below ↓
            </span>
          </div>

          {/* Grid — Premium Bento Style */}
          <style>{`
            /* Dashboard shimmer for skeleton loading overlay */
            @keyframes dash-shimmer {
              0% { background-position: -600px 0; }
              100% { background-position: 600px 0; }
            }
            .skel-box {
              border-radius: 6px;
              background: linear-gradient(90deg, #e8e8e8 25%, #f5f5f5 50%, #e8e8e8 75%);
              background-size: 600px 100%;
              animation: dash-shimmer 1.4s infinite ease-in-out;
            }
            .skel-overlay {
              position: absolute;
              inset: 0;
              background: #fff;
              z-index: 10;
              display: flex;
              flex-direction: column;
              gap: 0;
              overflow: hidden;
            }
            .skel-nav { height: 64px; padding: 0 40px; display: flex; align-items: center; gap: 16px; border-bottom: 1px solid #f0f0f0; }
            .skel-hero { flex: 0 0 380px; background: #f9f9f9; display: flex; align-items: center; padding: 60px 40px; gap: 40px; }
            .skel-hero-text { flex: 1; display: flex; flex-direction: column; gap: 12px; }
            .skel-hero-img { flex: 0 0 280px; height: 280px; border-radius: 8px; }
            .skel-strip { height: 52px; background: #f4f4f4; border-top: 1px solid #eee; border-bottom: 1px solid #eee; }
            .skel-section { padding: 40px; display: flex; flex-direction: column; gap: 20px; }
            .skel-heading { height: 28px; width: 200px; }
            .skel-subhead { height: 14px; width: 140px; }
            .skel-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
            .skel-card { height: 220px; border-radius: 8px; }
            @media(max-width: 640px) {
              .skel-grid { grid-template-columns: repeat(2, 1fr); }
              .skel-hero { flex-direction: column; }
              .skel-hero-img { flex: 0 0 160px; height: 160px; width: 100%; }
            }
            .bento-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              grid-auto-rows: 240px;
              gap: 20px;
            }
            .bento-card {
              border-radius: 24px;
              padding: 32px;
              cursor: pointer;
              text-align: left;
              transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
              position: relative;
              overflow: hidden;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              border: 1px solid rgba(0,0,0,0.04);
            }
            .bento-card:hover {
              transform: translateY(-6px) scale(1.01);
              box-shadow: 0 24px 48px rgba(0,0,0,0.06);
            }
            .bento-card-bg {
              position: absolute;
              top: 0; left: 0; right: 0; bottom: 0;
              background-size: cover;
              background-position: center;
              opacity: 0.15;
              mix-blend-mode: multiply;
              transition: opacity 0.5s ease;
            }
            .bento-card:hover .bento-card-bg {
              opacity: 0.3;
              transform: scale(1.05);
            }
            .bento-span-large {
              grid-column: span 2;
              grid-row: span 2;
            }
            .bento-span-wide {
              grid-column: span 2;
              grid-row: span 1;
            }
            .bento-span-tall {
              grid-column: span 1;
              grid-row: span 2;
            }
            @media (max-width: 1024px) {
              .bento-grid { grid-template-columns: repeat(2, 1fr); }
            }
            @media (max-width: 640px) {
              .bento-grid { grid-template-columns: 1fr; grid-auto-rows: auto; }
              .bento-span-large, .bento-span-wide, .bento-span-tall { grid-column: span 1; grid-row: span 1; min-height: 200px; }
            }
          `}</style>
          <div className="bento-grid">
            {TEMPLATES.map((tpl, idx) => {
              const isSelected = selectedTemplate === tpl.id;
              let spanClass = "";
              if (idx === 0 || idx === 11 || idx === 18) {
                spanClass = "bento-span-large";
              } else if (idx === 2 || idx === 7 || idx === 15) {
                spanClass = "bento-span-wide";
              } else if (idx === 4 || idx === 13) {
                spanClass = "bento-span-tall";
              }

              return (
                <button
                  key={tpl.id}
                  className={`bento-card ${spanClass}`}
                  onClick={() => setSelectedTemplate(tpl.id)}
                  style={{
                    background: isSelected ? "#fff" : tpl.nicheBg,
                    borderColor: isSelected ? tpl.accent : "rgba(0,0,0,0.04)",
                    boxShadow: isSelected ? `0 0 0 2px ${tpl.accent}, 0 20px 40px ${tpl.accent}20` : undefined,
                  }}
                >
                  {/* Decorative background gradient */}
                  <div style={{
                    position: "absolute",
                    top: "-20%", right: "-20%",
                    width: "70%", height: "70%",
                    background: `radial-gradient(circle, ${tpl.nicheColor} 0%, transparent 70%)`,
                    opacity: 0.08,
                    pointerEvents: "none",
                    filter: "blur(40px)"
                  }} />

                  <div style={{ position: "relative", zIndex: 2, width: "100%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                      <span style={{
                        background: isSelected ? tpl.nicheBg : "#fff",
                        color: tpl.nicheColor,
                        padding: "6px 14px",
                        borderRadius: 30,
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: 1.2,
                        textTransform: "uppercase",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
                      }}>{tpl.niche}</span>
                      
                      {isSelected && (
                        <div style={{
                          width: 28, height: 28, borderRadius: "50%",
                          background: tpl.accent, color: "#fff",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          boxShadow: `0 4px 12px ${tpl.accent}50`
                        }}>
                          {icon("check")}
                        </div>
                      )}
                    </div>

                    <div style={{
                      fontSize: spanClass === "bento-span-large" ? 36 : 22,
                      fontWeight: 800,
                      color: "#111",
                      marginBottom: 12,
                      lineHeight: 1.1,
                      fontFamily: "'Inter', sans-serif",
                      letterSpacing: "-0.5px"
                    }}>{tpl.name}</div>
                  </div>

                  <p style={{
                    position: "relative", zIndex: 2,
                    fontSize: 14,
                    color: "#666",
                    lineHeight: 1.6,
                    fontWeight: 400,
                    display: "-webkit-box",
                    WebkitLineClamp: spanClass.includes("large") || spanClass.includes("tall") ? 4 : 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    marginTop: "auto",
                    paddingTop: 16
                  }}>{tpl.desc}</p>
                </button>
              );
            })}
          </div>
        </div>


        {/* Settings Panel */}
        <div style={{
          background: "#fff",
          borderRadius: 16,
          marginBottom: 20,
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }}>
          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{
              width: "100%",
              padding: "18px 28px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              textAlign: "left",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
              </svg>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>Template Settings</span>
              <span style={{ fontSize: 12, color: "#888", fontWeight: 400 }}>Customize text, colors & content before injecting</span>
            </div>
            <span style={{ fontSize: 20, color: "#888", transform: showSettings ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>⌄</span>
          </button>

          {showSettings && (
            <div style={{ padding: "0 28px 28px", borderTop: "1px solid #f0f0f0" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20, paddingTop: 24 }}>

                {/* Announcement */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>📢 Announcement Bar Text</label>
                  <input
                    type="text"
                    value={settings.ann_text}
                    onChange={e => setSetting("ann_text", e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none", fontFamily: "inherit" }}
                    placeholder="Free shipping on orders above ₹999 🎉"
                  />
                </div>

                {/* Hero */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>🏷️ Hero Eyebrow Tag</label>
                  <input type="text" value={settings.hero_tag} onChange={e => setSetting("hero_tag", e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none", fontFamily: "inherit" }}
                    placeholder="New Arrival" />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>🦸 Hero Headline</label>
                  <input type="text" value={settings.hero_h1} onChange={e => setSetting("hero_h1", e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none", fontFamily: "inherit" }}
                    placeholder={currentTpl?.name} />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>📝 Hero Subheading</label>
                  <textarea value={settings.hero_sub} onChange={e => setSetting("hero_sub", e.target.value)}
                    rows={2}
                    style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none", fontFamily: "inherit", resize: "vertical" }}
                    placeholder="Discover our curated collection..." />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>🔘 Primary CTA Text</label>
                  <input type="text" value={settings.hero_cta} onChange={e => setSetting("hero_cta", e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none", fontFamily: "inherit" }}
                    placeholder="Shop Now" />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>🔘 Secondary CTA Text</label>
                  <input type="text" value={settings.hero_cta2} onChange={e => setSetting("hero_cta2", e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none", fontFamily: "inherit" }}
                    placeholder="View Lookbook (leave blank to hide)" />
                </div>

                {/* Products */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>📦 Products Section Heading</label>
                  <input type="text" value={settings.prod_heading} onChange={e => setSetting("prod_heading", e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none", fontFamily: "inherit" }}
                    placeholder="Featured Products" />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>📦 Products Subheading</label>
                  <input type="text" value={settings.prod_sub} onChange={e => setSetting("prod_sub", e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none", fontFamily: "inherit" }}
                    placeholder="Handpicked for you" />
                </div>

                {/* Newsletter */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>📧 Newsletter Heading</label>
                  <input type="text" value={settings.nl_h} onChange={e => setSetting("nl_h", e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none", fontFamily: "inherit" }}
                    placeholder="Join Our Community" />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>📧 Newsletter Subtext</label>
                  <input type="text" value={settings.nl_sub} onChange={e => setSetting("nl_sub", e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none", fontFamily: "inherit" }}
                    placeholder="Subscribe for exclusive offers..." />
                </div>

                {/* Info tip */}
                <div style={{ gridColumn: "1 / -1", background: "#f0f9ff", borderRadius: 10, padding: "12px 16px", fontSize: 12, color: "#0369a1", display: "flex", alignItems: "center", gap: 8 }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <span>These settings will be pre-filled in the Shopify Theme Editor after injection. You can change any value there too — including colors, images, and product collections.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Inject Button */}
        <div style={{
          background: "#fff",
          borderRadius: 16,
          padding: "20px 28px",
          marginBottom: 20,
          border: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>
              Ready to inject <span style={{ color: currentTpl?.accent }}>{currentTpl?.name}</span> template
            </div>
            <p style={{ fontSize: 13, color: "#888" }}>
              This will push Landing Page + Product Page + Cart Page + Collection Page into your active Shopify theme.
            </p>
          </div>
          <button
            onClick={handleInject}
            disabled={isInjecting}
            style={{
              background: isInjecting ? "#999" : `linear-gradient(135deg, ${currentTpl?.accent}, ${currentTpl?.accent}cc)`,
              color: currentTpl?.id === "tanishq" ? "#2C1810" : "#fff",
              border: "none",
              padding: "16px 36px",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              cursor: isInjecting ? "not-allowed" : "pointer",
              whiteSpace: "nowrap",
              boxShadow: `0 4px 15px ${currentTpl?.accent}40`,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {icon("rocket")} {isInjecting ? "Injecting..." : "Inject to Theme"}
          </button>
        </div>

        {/* Result Toast */}
        {injectResult?.success && (
          <div style={{
            background: "#065F46", color: "#fff", padding: "20px 24px",
            borderRadius: 12, marginBottom: 20, fontSize: 14,
          }}>
            <div style={{ fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8, fontSize: 15 }}>
              {icon("check")} {injectResult.templateLabel} — 3 pages injected into &quot;{injectResult.themeName}&quot;!
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {(injectResult.pages || []).map((p) => (
                <span key={p} style={{ background: "rgba(255,255,255,0.15)", padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                  {p}
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 14, flexWrap: "wrap" }}>
              <a href={injectResult.editorUrl} target="_blank" rel="noreferrer"
                style={{ color: "#A7F3D0", textDecoration: "underline", fontSize: 13 }}>Open Theme Editor →</a>
              <a href={injectResult.previewUrl} target="_blank" rel="noreferrer"
                style={{ color: "#A7F3D0", textDecoration: "underline", fontSize: 13 }}>Preview Store →</a>
            </div>
          </div>
        )}
        {injectResult && !injectResult.success && (
          <div style={{
            background: "#991B1B", color: "#fff", padding: "16px 24px",
            borderRadius: 12, marginBottom: 20, fontSize: 14, fontWeight: 600,
          }}>
            Error: {injectResult.error || "Failed to inject."}
          </div>
        )}

        {/* Preview */}
        <div style={{
          background: "#fff", borderRadius: 16, overflow: "hidden",
          border: "1px solid #e5e7eb", boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        }}>
          <div style={{
            background: "#fafafa", borderBottom: "1px solid #e5e7eb",
            padding: "10px 20px", display: "flex", alignItems: "center", gap: 8,
          }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F56" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FFBD2E" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#27C93F" }} />
            <span style={{ marginLeft: 16, fontSize: 12, color: "#999" }}>Live Preview — {currentTpl?.name}</span>
          </div>
          <div style={{
            display: "flex", justifyContent: "center",
            background: previewMode !== "desktop" ? "#e5e7eb" : "transparent",
            padding: previewMode !== "desktop" ? "20px" : 0,
            transition: "all 0.3s ease",
            position: "relative",
          }}>
            {/* Skeleton overlay shown while iframe content loads */}
            {iframeLoading && (
              <div className="skel-overlay" style={{ width: viewportWidth, maxWidth: "100%", height: "80vh" }}>
                {/* Nav bar skeleton */}
                <div className="skel-nav">
                  <div className="skel-box" style={{ width: 120, height: 28 }} />
                  <div style={{ flex: 1, display: "flex", gap: 8, justifyContent: "center" }}>
                    {[80, 60, 90, 70].map((w, i) => <div key={i} className="skel-box" style={{ width: w, height: 14 }} />)}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[32, 32, 80].map((w, i) => <div key={i} className="skel-box" style={{ width: w, height: 32, borderRadius: 4 }} />)}
                  </div>
                </div>
                {/* Hero skeleton */}
                <div className="skel-hero">
                  <div className="skel-hero-text">
                    <div className="skel-box" style={{ width: 80, height: 12, borderRadius: 20 }} />
                    <div className="skel-box" style={{ width: "80%", height: 40 }} />
                    <div className="skel-box" style={{ width: "90%", height: 40 }} />
                    <div className="skel-box" style={{ width: "60%", height: 16, marginTop: 4 }} />
                    <div className="skel-box" style={{ width: "50%", height: 16 }} />
                    <div className="skel-box" style={{ width: 140, height: 44, borderRadius: 4, marginTop: 8 }} />
                  </div>
                  <div className="skel-box skel-hero-img" />
                </div>
                {/* Trust strip */}
                <div className="skel-strip" />
                {/* Products grid skeleton */}
                <div className="skel-section">
                  <div className="skel-box skel-heading" style={{ margin: "0 auto" }} />
                  <div className="skel-box skel-subhead" style={{ margin: "0 auto" }} />
                  <div className="skel-grid">
                    {[1,2,3,4].map(i => <div key={i} className="skel-box skel-card" />)}
                  </div>
                </div>
              </div>
            )}
            <iframe
              srcDoc={PREVIEW_MAP[selectedTemplate]}
              onLoad={() => setIframeLoading(false)}
              style={{
                width: viewportWidth, maxWidth: "100%", height: "80vh",
                border: "none", borderRadius: previewMode !== "desktop" ? "12px" : 0,
                boxShadow: previewMode !== "desktop" ? "0 8px 30px rgba(0,0,0,0.12)" : "none",
                transition: "all 0.3s ease",
                opacity: iframeLoading ? 0 : 1,
              }}
              title="Template Preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

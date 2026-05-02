import { json } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { useState, useCallback } from "react";
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
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'DM Sans', sans-serif; color: #2C1810; line-height: 1.6; -webkit-font-smoothing: antialiased; background: #FFFCF5; }
h1, h2, h3 { font-family: 'Playfair Display', Georgia, serif; }

/* Info Strip */
.cfj-strip { background: #2C1810; color: #D4AF37; display: flex; justify-content: center; align-items: center; gap: 32px; padding: 8px 16px; font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; }
.cfj-strip-item { display: flex; align-items: center; gap: 8px; }
.cfj-strip-div { width: 1px; height: 14px; background: rgba(212,175,55,0.3); }

/* Announce */
.cfj-ann { background: linear-gradient(90deg, #D4AF37 0%, #F5D060 50%, #D4AF37 100%); color: #2C1810; text-align: center; padding: 10px 16px; font-size: 13px; font-weight: 700; letter-spacing: 0.8px; }
.cfj-ann a { color: #2C1810; text-decoration: underline; font-weight: 800; }

/* Hero */
.cfj-hero { position: relative; min-height: 560px; background: linear-gradient(135deg, #1a0f0a 0%, #2C1810 40%, #3d2317 100%); display: flex; align-items: center; overflow: hidden; }
.cfj-hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 70% 50%, rgba(212,175,55,0.08) 0%, transparent 60%); }
.cfj-hero-inner { max-width: 1320px; margin: 0 auto; padding: 80px 48px; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; width: 100%; position: relative; z-index: 1; }
.cfj-hero-overline { display: inline-flex; align-items: center; gap: 12px; color: #D4AF37; font-size: 12px; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 20px; font-family: 'DM Sans', sans-serif; }
.cfj-hero-overline::before, .cfj-hero-overline::after { content: ''; width: 32px; height: 1px; background: #D4AF37; }
.cfj-hero h1 { font-size: 52px; font-weight: 700; line-height: 1.15; color: #FFFCF5; margin-bottom: 20px; }
.cfj-hero h1 em { color: #D4AF37; font-style: italic; }
.cfj-hero-sub { font-size: 16px; color: rgba(255,252,245,0.65); margin-bottom: 36px; max-width: 440px; line-height: 1.8; }
.cfj-hero-ctas { display: flex; gap: 16px; }
.cfj-cta-gold { display: inline-flex; align-items: center; gap: 10px; background: linear-gradient(135deg, #D4AF37, #C5A028); color: #2C1810; padding: 18px 40px; font-size: 13px; font-weight: 800; text-decoration: none; border: none; cursor: pointer; letter-spacing: 2px; text-transform: uppercase; font-family: 'DM Sans', sans-serif; transition: all 0.3s; }
.cfj-cta-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(212,175,55,0.3); }
.cfj-cta-outline { display: inline-flex; align-items: center; gap: 10px; background: transparent; color: #D4AF37; padding: 17px 40px; border: 1.5px solid #D4AF37; font-size: 13px; font-weight: 700; text-decoration: none; letter-spacing: 2px; text-transform: uppercase; font-family: 'DM Sans', sans-serif; }
.cfj-hero-visual { width: 100%; max-width: 460px; aspect-ratio: 4/5; background: linear-gradient(135deg, #3d2317, #5a3828); display: flex; align-items: center; justify-content: center; margin: 0 auto; }
.cfj-hero-float { position: absolute; background: rgba(255,252,245,0.95); backdrop-filter: blur(10px); padding: 16px 24px; box-shadow: 0 8px 40px rgba(0,0,0,0.15); font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 14px; animation: cfj-f 4s ease-in-out infinite; border: 1px solid rgba(212,175,55,0.15); }
.cfj-hero-float.tr { top: 30px; right: -20px; }
.cfj-hero-float.bl { bottom: 40px; left: -20px; animation-delay: 2s; }
.cfj-float-icon { width: 44px; height: 44px; background: linear-gradient(135deg, #D4AF37, #F5D060); display: flex; align-items: center; justify-content: center; color: #2C1810; }
.cfj-float-label { font-size: 11px; color: #999; }
.cfj-float-val { font-weight: 800; color: #2C1810; font-size: 15px; }
@keyframes cfj-f { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }

/* Trust */
.cfj-trust { background: #FFFCF5; border-top: 1px solid rgba(212,175,55,0.15); border-bottom: 1px solid rgba(212,175,55,0.15); padding: 20px 24px; }
.cfj-trust-inner { max-width: 1320px; margin: 0 auto; display: flex; justify-content: space-around; align-items: center; flex-wrap: wrap; gap: 16px; }
.cfj-trust-item { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 600; color: #2C1810; }
.cfj-trust-icon { color: #D4AF37; display: flex; }

/* Section Head */
.cfj-sh { text-align: center; margin-bottom: 56px; }
.cfj-overline { font-size: 11px; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; color: #D4AF37; margin-bottom: 14px; display: flex; align-items: center; justify-content: center; gap: 16px; font-family: 'DM Sans', sans-serif; }
.cfj-overline::before, .cfj-overline::after { content: ''; width: 40px; height: 1px; background: #D4AF37; }
.cfj-sh h2 { font-size: 38px; font-weight: 700; color: #2C1810; margin-bottom: 14px; }
.cfj-sh p { font-size: 15px; color: #8B7355; max-width: 560px; margin: 0 auto; }

/* Collections */
.cfj-coll { padding: 90px 48px; max-width: 1320px; margin: 0 auto; }
.cfj-coll-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.cfj-coll-card { position: relative; overflow: hidden; aspect-ratio: 3/4; text-decoration: none; color: #fff; display: block; }
.cfj-coll-visual { width: 100%; height: 100%; transition: transform 0.8s ease; }
.cfj-coll-card:hover .cfj-coll-visual { transform: scale(1.06); }
.cfj-coll-ov { position: absolute; inset: 0; background: linear-gradient(to top, rgba(44,24,16,0.75) 0%, transparent 50%); display: flex; flex-direction: column; justify-content: flex-end; padding: 28px; }
.cfj-coll-ov h3 { font-size: 20px; font-weight: 700; margin-bottom: 4px; }
.cfj-coll-ov span { font-size: 11px; opacity: 0.8; letter-spacing: 1.5px; text-transform: uppercase; font-family: 'DM Sans', sans-serif; }

/* Products */
.cfj-prod { padding: 90px 48px; background: #FAF5ED; }
.cfj-prod-inner { max-width: 1320px; margin: 0 auto; }
.cfj-prod-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.cfj-prod-card { background: #FFFCF5; overflow: hidden; border: 1px solid rgba(212,175,55,0.1); transition: all 0.4s; text-decoration: none; color: #2C1810; display: block; }
.cfj-prod-card:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(44,24,16,0.1); }
.cfj-prod-img { position: relative; aspect-ratio: 1; overflow: hidden; background: #f5efe6; display: flex; align-items: center; justify-content: center; color: #d4af37; }
.cfj-prod-badge { position: absolute; top: 14px; left: 14px; color: #2C1810; background: #D4AF37; padding: 5px 14px; font-size: 9px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; font-family: 'DM Sans', sans-serif; }
.cfj-prod-badge.exc { background: #8B2252; color: #fff; }
.cfj-prod-badge.new { background: #2C1810; color: #D4AF37; }
.cfj-prod-info { padding: 22px; text-align: center; }
.cfj-prod-type { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #D4AF37; margin-bottom: 6px; font-family: 'DM Sans', sans-serif; }
.cfj-prod-name { font-size: 14px; font-weight: 600; line-height: 1.5; margin-bottom: 10px; }
.cfj-prod-price { font-size: 18px; font-weight: 800; color: #2C1810; font-family: 'Playfair Display', serif; }
.cfj-prod-atc { display: block; width: 100%; margin-top: 16px; padding: 13px; background: #2C1810; color: #D4AF37; border: none; font-size: 10px; font-weight: 700; cursor: pointer; letter-spacing: 2px; text-transform: uppercase; font-family: 'DM Sans', sans-serif; }

/* Story */
.cfj-story { padding: 100px 48px; background: linear-gradient(135deg, #2C1810, #1a0f0a); color: #FFFCF5; }
.cfj-story-inner { max-width: 1320px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 100px; align-items: center; }
.cfj-story-overline { font-size: 11px; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; color: #D4AF37; margin-bottom: 20px; display: flex; align-items: center; gap: 12px; font-family: 'DM Sans', sans-serif; }
.cfj-story-overline::after { content: ''; width: 40px; height: 1px; background: #D4AF37; }
.cfj-story h2 { font-size: 40px; font-weight: 700; margin-bottom: 24px; line-height: 1.2; }
.cfj-story h2 em { color: #D4AF37; font-style: italic; }
.cfj-story p { font-size: 15px; line-height: 1.9; color: rgba(255,252,245,0.65); margin-bottom: 36px; }
.cfj-story-stats { display: flex; gap: 48px; }
.cfj-story-stat h3 { font-size: 34px; font-weight: 800; color: #D4AF37; font-family: 'Playfair Display', serif; }
.cfj-story-stat span { font-size: 11px; color: rgba(255,252,245,0.5); text-transform: uppercase; letter-spacing: 1px; }
.cfj-story-vis { width: 100%; aspect-ratio: 4/3; background: linear-gradient(135deg, #3d2317, #5a3828); display: flex; align-items: center; justify-content: center; color: rgba(212,175,55,0.3); position: relative; }
.cfj-story-accent { position: absolute; bottom: -20px; right: -20px; width: 100px; height: 100px; border: 2px solid rgba(212,175,55,0.2); }

/* Reviews */
.cfj-rev { padding: 90px 48px; background: #FFFCF5; }
.cfj-rev-inner { max-width: 1320px; margin: 0 auto; }
.cfj-rev-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
.cfj-rev-card { background: #FAF5ED; padding: 36px; border: 1px solid rgba(212,175,55,0.1); position: relative; }
.cfj-rev-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #D4AF37, #F5D060, #D4AF37); }
.cfj-rev-q { color: #D4AF37; font-size: 40px; font-family: 'Playfair Display', serif; line-height: 1; margin-bottom: 14px; }
.cfj-rev-stars { color: #D4AF37; margin-bottom: 14px; display: flex; gap: 3px; }
.cfj-rev-text { font-size: 14px; color: #5a4a3c; line-height: 1.8; margin-bottom: 22px; font-style: italic; }
.cfj-rev-author { display: flex; align-items: center; gap: 14px; }
.cfj-rev-av { width: 44px; height: 44px; background: #D4AF37; display: flex; align-items: center; justify-content: center; color: #2C1810; font-weight: 800; font-size: 17px; font-family: 'Playfair Display', serif; }
.cfj-rev-name { font-size: 13px; font-weight: 700; color: #2C1810; }
.cfj-rev-loc { font-size: 11px; color: #8B7355; }

/* Newsletter */
.cfj-nl { padding: 90px 48px; background: linear-gradient(135deg, #2C1810, #3d2317); text-align: center; position: relative; overflow: hidden; }
.cfj-nl::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 50% 0%, rgba(212,175,55,0.06) 0%, transparent 60%); }
.cfj-nl-inner { max-width: 520px; margin: 0 auto; position: relative; z-index: 1; }
.cfj-nl h2 { font-size: 32px; font-weight: 700; color: #FFFCF5; margin-bottom: 12px; }
.cfj-nl p { font-size: 14px; color: rgba(255,252,245,0.6); margin-bottom: 30px; }
.cfj-nl-form { display: flex; gap: 0; }
.cfj-nl-input { flex: 1; padding: 16px 20px; border: 1px solid rgba(212,175,55,0.3); border-right: none; font-size: 13px; outline: none; background: rgba(255,252,245,0.05); color: #FFFCF5; }
.cfj-nl-btn { padding: 16px 28px; background: #D4AF37; color: #2C1810; border: 1px solid #D4AF37; font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; }

/* Footer */
.cfj-ft { background: #1a0f0a; color: #bbb; padding: 60px 48px 24px; }
.cfj-ft-inner { max-width: 1320px; margin: 0 auto; }
.cfj-ft-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 40px; }
.cfj-ft-brand h3 { font-size: 24px; font-weight: 700; color: #D4AF37; margin-bottom: 12px; font-family: 'Playfair Display', serif; }
.cfj-ft-brand p { font-size: 12px; line-height: 1.8; color: #8B7355; }
.cfj-ft h4 { font-size: 11px; font-weight: 700; color: #D4AF37; margin-bottom: 16px; letter-spacing: 2px; text-transform: uppercase; font-family: 'DM Sans', sans-serif; }
.cfj-ft ul { list-style: none; }
.cfj-ft li { margin-bottom: 8px; }
.cfj-ft a { color: #8B7355; text-decoration: none; font-size: 12px; }
.cfj-ft-bottom { border-top: 1px solid rgba(212,175,55,0.1); padding-top: 20px; display: flex; justify-content: space-between; font-size: 11px; color: #5a4a3c; }

.star-s { display: inline-block; }
@media (max-width: 768px) {
  .cfj-hero-inner { grid-template-columns: 1fr; padding: 40px 20px; }
  .cfj-hero h1 { font-size: 30px; }
  .cfj-hero-visual { display: none; }
  .cfj-coll-grid, .cfj-prod-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .cfj-story-inner { grid-template-columns: 1fr; gap: 40px; }
  .cfj-rev-grid { grid-template-columns: 1fr; }
  .cfj-ft-grid { grid-template-columns: 1fr 1fr; }
  .cfj-nl-form { flex-direction: column; }
  .cfj-coll, .cfj-prod, .cfj-story, .cfj-rev, .cfj-nl { padding: 50px 20px; }
}
</style>
</head>
<body>
  <div class="cfj-strip">
    <div class="cfj-strip-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg> BIS Hallmarked</div>
    <div class="cfj-strip-div"></div>
    <div class="cfj-strip-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg> Certified Diamonds</div>
    <div class="cfj-strip-div"></div>
    <div class="cfj-strip-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> Free Insured Shipping</div>
    <div class="cfj-strip-div"></div>
    <div class="cfj-strip-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Lifetime Exchange</div>
  </div>

  <div class="cfj-ann"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Making Charges Waived — Limited Period Offer <a href="#">Shop Now →</a></div>

  <div class="cfj-hero">
    <div class="cfj-hero-inner">
      <div>
        <span class="cfj-hero-overline">New Arrivals</span>
        <h1>Timeless<br><em>Elegance</em> Redefined</h1>
        <p class="cfj-hero-sub">Handcrafted jewellery that celebrates the art of Indian craftsmanship. Every piece tells a story of heritage, precision, and timeless beauty.</p>
        <div class="cfj-hero-ctas">
          <a href="#" class="cfj-cta-gold">Explore Collection <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
          <a href="#" class="cfj-cta-outline">Our Heritage</a>
        </div>
      </div>
      <div style="position:relative;display:flex;justify-content:center;">
        <div class="cfj-hero-visual"><svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="rgba(212,175,55,0.25)" stroke-width="0.6"><path d="M12 2L2 7l10 5 10-5-10-5Z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div>
        <div class="cfj-hero-float tr">
          <div class="cfj-float-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
          <div><div class="cfj-float-label">Rating</div><div class="cfj-float-val">4.9 / 5.0</div></div>
        </div>
        <div class="cfj-hero-float bl">
          <div class="cfj-float-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div>
          <div><div class="cfj-float-label">Loved by</div><div class="cfj-float-val">10L+ Customers</div></div>
        </div>
      </div>
    </div>
  </div>

  <div class="cfj-trust"><div class="cfj-trust-inner">
    <div class="cfj-trust-item"><span class="cfj-trust-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg></span> 100% BIS Hallmarked</div>
    <div class="cfj-trust-item"><span class="cfj-trust-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></span> Lifetime Exchange</div>
    <div class="cfj-trust-item"><span class="cfj-trust-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg></span> Free Insured Delivery</div>
    <div class="cfj-trust-item"><span class="cfj-trust-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5Z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></span> Certified Diamonds</div>
  </div></div>

  <div class="cfj-coll">
    <div class="cfj-sh"><span class="cfj-overline">Collections</span><h2>Shop by Collection</h2><p>Discover curated collections for every occasion</p></div>
    <div class="cfj-coll-grid">
      <a href="#" class="cfj-coll-card"><div class="cfj-coll-visual" style="background:linear-gradient(135deg,#FADADD,#e8c8b8)"></div><div class="cfj-coll-ov"><h3>Gold Necklaces</h3><span>Shop Collection</span></div></a>
      <a href="#" class="cfj-coll-card"><div class="cfj-coll-visual" style="background:linear-gradient(135deg,#E8D5B7,#c9a96e)"></div><div class="cfj-coll-ov"><h3>Diamond Rings</h3><span>Shop Collection</span></div></a>
      <a href="#" class="cfj-coll-card"><div class="cfj-coll-visual" style="background:linear-gradient(135deg,#FFD1DC,#d4a574)"></div><div class="cfj-coll-ov"><h3>Bangles</h3><span>Shop Collection</span></div></a>
      <a href="#" class="cfj-coll-card"><div class="cfj-coll-visual" style="background:linear-gradient(135deg,#f5efe6,#d4af37)"></div><div class="cfj-coll-ov"><h3>Earrings</h3><span>Shop Collection</span></div></a>
    </div>
  </div>

  <div class="cfj-prod"><div class="cfj-prod-inner">
    <div class="cfj-sh"><span class="cfj-overline">Most Loved</span><h2>Bestselling Jewellery</h2><p>Loved by millions, our most coveted designs</p></div>
    <div class="cfj-prod-grid">
      <a href="#" class="cfj-prod-card"><div class="cfj-prod-img"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8"><path d="M12 2L2 7l10 5 10-5-10-5Z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg><span class="cfj-prod-badge">BESTSELLER</span></div><div class="cfj-prod-info"><div class="cfj-prod-type">Gold Necklace</div><div class="cfj-prod-name">Celestial Gold Necklace Set</div><div class="cfj-prod-price">&#8377;1,24,999</div><button class="cfj-prod-atc">Add to Cart</button></div></a>
      <a href="#" class="cfj-prod-card"><div class="cfj-prod-img"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8"><path d="M12 2L2 7l10 5 10-5-10-5Z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg><span class="cfj-prod-badge exc">EXCLUSIVE</span></div><div class="cfj-prod-info"><div class="cfj-prod-type">Diamond Ring</div><div class="cfj-prod-name">Diamond Solitaire Ring</div><div class="cfj-prod-price">&#8377;89,999</div><button class="cfj-prod-atc">Add to Cart</button></div></a>
      <a href="#" class="cfj-prod-card"><div class="cfj-prod-img"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8"><path d="M12 2L2 7l10 5 10-5-10-5Z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg><span class="cfj-prod-badge new">NEW</span></div><div class="cfj-prod-info"><div class="cfj-prod-type">Gold Earrings</div><div class="cfj-prod-name">Heritage Kundan Jhumkas</div><div class="cfj-prod-price">&#8377;45,999</div><button class="cfj-prod-atc">Add to Cart</button></div></a>
      <a href="#" class="cfj-prod-card"><div class="cfj-prod-img"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8"><path d="M12 2L2 7l10 5 10-5-10-5Z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div><div class="cfj-prod-info"><div class="cfj-prod-type">Platinum Bracelet</div><div class="cfj-prod-name">Platinum Love Bracelet</div><div class="cfj-prod-price">&#8377;67,500</div><button class="cfj-prod-atc">Add to Cart</button></div></a>
    </div>
  </div></div>

  <div class="cfj-story"><div class="cfj-story-inner">
    <div>
      <span class="cfj-story-overline">Our Legacy</span>
      <h2>Crafted with <em>Passion</em><br>& Precision</h2>
      <p>For over eight decades, our master artisans have perfected the art of jewellery making. Each piece passes through 68 quality checks before reaching you.</p>
      <div class="cfj-story-stats">
        <div class="cfj-story-stat"><h3>85+</h3><span>Years of Heritage</span></div>
        <div class="cfj-story-stat"><h3>5000+</h3><span>Unique Designs</span></div>
        <div class="cfj-story-stat"><h3>68</h3><span>Quality Checks</span></div>
      </div>
    </div>
    <div class="cfj-story-vis"><svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5"><path d="M12 2L2 7l10 5 10-5-10-5Z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg><div class="cfj-story-accent"></div></div>
  </div></div>

  <div class="cfj-rev"><div class="cfj-rev-inner">
    <div class="cfj-sh"><span class="cfj-overline">Testimonials</span><h2>What Our Customers Say</h2></div>
    <div class="cfj-rev-grid">
      <div class="cfj-rev-card"><div class="cfj-rev-q">&ldquo;</div><div class="cfj-rev-stars"><svg width="15" height="15" viewBox="0 0 24 24" fill="#D4AF37"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="15" height="15" viewBox="0 0 24 24" fill="#D4AF37"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="15" height="15" viewBox="0 0 24 24" fill="#D4AF37"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="15" height="15" viewBox="0 0 24 24" fill="#D4AF37"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="15" height="15" viewBox="0 0 24 24" fill="#D4AF37"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div><p class="cfj-rev-text">"The craftsmanship is exceptional. Every detail is perfect and the gold purity is exactly as promised."</p><div class="cfj-rev-author"><div class="cfj-rev-av">A</div><div><div class="cfj-rev-name">Ananya S.</div><div class="cfj-rev-loc">Mumbai</div></div></div></div>
      <div class="cfj-rev-card"><div class="cfj-rev-q">&ldquo;</div><div class="cfj-rev-stars"><svg width="15" height="15" viewBox="0 0 24 24" fill="#D4AF37"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="15" height="15" viewBox="0 0 24 24" fill="#D4AF37"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="15" height="15" viewBox="0 0 24 24" fill="#D4AF37"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="15" height="15" viewBox="0 0 24 24" fill="#D4AF37"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="15" height="15" viewBox="0 0 24 24" fill="#D4AF37"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div><p class="cfj-rev-text">"The diamond quality is outstanding and the packaging was incredibly luxurious. Bought my entire wedding set."</p><div class="cfj-rev-author"><div class="cfj-rev-av">P</div><div><div class="cfj-rev-name">Priya M.</div><div class="cfj-rev-loc">Delhi</div></div></div></div>
      <div class="cfj-rev-card"><div class="cfj-rev-q">&ldquo;</div><div class="cfj-rev-stars"><svg width="15" height="15" viewBox="0 0 24 24" fill="#D4AF37"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="15" height="15" viewBox="0 0 24 24" fill="#D4AF37"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="15" height="15" viewBox="0 0 24 24" fill="#D4AF37"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="15" height="15" viewBox="0 0 24 24" fill="#D4AF37"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="15" height="15" viewBox="0 0 24 24" fill="#D4AF37"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div><p class="cfj-rev-text">"Beautiful gold necklace with impeccable finishing. The hallmark certificate gives complete confidence."</p><div class="cfj-rev-author"><div class="cfj-rev-av">K</div><div><div class="cfj-rev-name">Kavitha R.</div><div class="cfj-rev-loc">Bangalore</div></div></div></div>
    </div>
  </div></div>

  <div class="cfj-nl"><div class="cfj-nl-inner">
    <h2>Be the First to Know</h2>
    <p>Subscribe for exclusive previews, early access to new collections, and members-only offers.</p>
    <div class="cfj-nl-form"><input type="email" class="cfj-nl-input" placeholder="Enter your email address"><button class="cfj-nl-btn">Subscribe</button></div>
  </div></div>

  <div class="cfj-ft"><div class="cfj-ft-inner"><div class="cfj-ft-grid"><div class="cfj-ft-brand"><h3>Your Brand</h3><p>A legacy of trust, craftsmanship, and timeless beauty. Every piece celebrates Indian artistry and modern elegance.</p></div><div><h4>Collections</h4><ul><li><a href="#">Gold</a></li><li><a href="#">Diamonds</a></li><li><a href="#">Wedding</a></li><li><a href="#">Daily Wear</a></li></ul></div><div><h4>Help</h4><ul><li><a href="#">Track Order</a></li><li><a href="#">Returns</a></li><li><a href="#">Store Locator</a></li><li><a href="#">FAQs</a></li></ul></div><div><h4>About</h4><ul><li><a href="#">Heritage</a></li><li><a href="#">Craftsmanship</a></li><li><a href="#">Certifications</a></li><li><a href="#">Careers</a></li></ul></div></div><div class="cfj-ft-bottom"><span>&copy; 2026 Your Brand. All rights reserved.</span><span>Powered by ConvertFlow</span></div></div></div>



<!-- SUPER THEME SECTIONS PREVIEW -->
<div style="font-family: inherit; background: #FDFAF3; padding: 40px 0; border-top: 1px solid rgba(0,0,0,0.05); color: #1C1208;">
  <div style="text-align: center; margin-bottom: 20px;">
    <span style="background: #B8860B; color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Super Theme Sections</span>
  </div>

  <!-- COUNTDOWN BANNER -->
  <div style="background:#B8860B; color:#fff; text-align:center; padding:24px; margin: 40px 0;">
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
    <h2 style="font-size:32px; font-weight:800; margin-bottom:8px; color: #1C1208;">Real Results</h2>
    <p style="opacity:0.7; margin-bottom:32px;">See the difference</p>
    <div style="position:relative; width:100%; height:400px; background:rgba(0,0,0,0.05); border-radius:12px; overflow:hidden;">
      <div style="position:absolute; inset:0; background:url('https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png') center/cover;"></div>
      <div style="position:absolute; inset:0; right:50%; background:url('https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png') center/cover; border-right:4px solid #fff; filter:grayscale(100%);"></div>
      <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:40px; height:40px; background:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 10px rgba(0,0,0,0.2);"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></div>
    </div>
  </div>

  <!-- FREQUENTLY BOUGHT TOGETHER -->
  <div style="max-width:1000px; margin:60px auto; background:rgba(0,0,0,0.03); padding:40px; border-radius:12px; border: 1px solid rgba(0,0,0,0.05);">
    <h2 style="font-size:24px; font-weight:700; margin-bottom:24px; color: #1C1208;">Frequently Bought Together</h2>
    <div style="display:flex; gap:20px; align-items:center; margin-bottom:24px;">
      <div style="width:120px; text-align:center;"><div style="width:120px; height:120px; background:rgba(0,0,0,0.08); border-radius:8px; margin-bottom:12px;"></div><div style="font-weight:600; font-size:14px; color: #1C1208;">Main Item</div></div>
      <div style="font-size:24px; opacity: 0.3;">+</div>
      <div style="width:120px; text-align:center;"><div style="width:120px; height:120px; background:rgba(0,0,0,0.08); border-radius:8px; margin-bottom:12px;"></div><div style="font-weight:600; font-size:14px; color: #1C1208;">Add-on 1</div></div>
      <div style="font-size:24px; opacity: 0.3;">+</div>
      <div style="width:120px; text-align:center;"><div style="width:120px; height:120px; background:rgba(0,0,0,0.08); border-radius:8px; margin-bottom:12px;"></div><div style="font-weight:600; font-size:14px; color: #1C1208;">Add-on 2</div></div>
      <div style="margin-left:auto; text-align:right;">
        <div style="font-size:14px; opacity: 0.5; text-decoration:line-through;">$150.00</div>
        <div style="font-size:24px; font-weight:800; color: #B8860B;">$135.00</div>
        <button style="background:#1C1208; color:#FDFAF3; border:none; padding:12px 24px; border-radius:6px; font-weight:600; margin-top:12px; cursor:pointer;">Add Bundle to Cart</button>
      </div>
    </div>
  </div>

  <!-- SHOPPABLE IMAGE -->
  <div style="max-width:1200px; margin:60px auto; text-align:center;">
    <h2 style="font-size:32px; font-weight:800; margin-bottom:8px; color: #1C1208;">Shop the Look</h2>
    <p style="opacity:0.7; margin-bottom:32px;">Tap the pins to view products</p>
    <div style="position:relative; width:100%; height:500px; background:rgba(0,0,0,0.05); border-radius:12px; overflow:hidden;">
      <div style="position:absolute; top:40%; left:50%; width:24px; height:24px; background:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 0 0 4px rgba(255,255,255,0.3); cursor:pointer;">
        <div style="width:8px; height:8px; background:#B8860B; border-radius:50%;"></div>
      </div>
      <div style="position:absolute; top:60%; left:30%; width:24px; height:24px; background:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 0 0 4px rgba(255,255,255,0.3); cursor:pointer;">
        <div style="width:8px; height:8px; background:#B8860B; border-radius:50%;"></div>
      </div>
    </div>
  </div>
</div>
</body></html>`;

/* ── Pilgrim Preview (reused from existing) ── */
const pilgrimPreviewHTML = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'DM Sans',sans-serif;color:#1a1a1a;line-height:1.6;-webkit-font-smoothing:antialiased}.cf-a{background:#2D2D2D;color:#fff;text-align:center;padding:10px 16px;font-size:13px;font-weight:500;letter-spacing:.5px;display:flex;align-items:center;justify-content:center;gap:8px}.cf-a a{color:#FFD700;text-decoration:underline;font-weight:600}.cf-h{position:relative;min-height:520px;background:linear-gradient(135deg,#FFF5EE 0%,#FAEBD7 50%,#FFE4C4 100%);display:flex;align-items:center}.cf-hi{max-width:1280px;margin:0 auto;padding:60px 40px;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;width:100%}.cf-hb{display:inline-block;background:#D4A574;color:#fff;padding:6px 16px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:16px}.cf-h h1{font-size:44px;font-weight:800;line-height:1.15;margin-bottom:16px;letter-spacing:-.5px}.cf-h h1 span{color:#C17F5E}.cf-hs{font-size:16px;color:#555;margin-bottom:28px;max-width:440px;line-height:1.7}.cf-hc{display:inline-flex;align-items:center;gap:10px;background:#1a1a1a;color:#fff;padding:16px 36px;border-radius:50px;font-size:15px;font-weight:700;text-decoration:none;cursor:pointer;letter-spacing:.5px}.cf-tb{background:#FAF7F2;border-top:1px solid rgba(0,0,0,.05);border-bottom:1px solid rgba(0,0,0,.05);padding:18px 20px}.cf-ti{max-width:1280px;margin:0 auto;display:flex;justify-content:space-around;flex-wrap:wrap;gap:12px}.cf-tt{display:flex;align-items:center;gap:10px;font-size:13px;font-weight:600;color:#333}.cf-ic{color:#C17F5E;display:flex}.cf-sh{text-align:center;margin-bottom:48px}.cf-ol{font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#C17F5E;margin-bottom:12px;display:block}.cf-sh h2{font-size:34px;font-weight:800;margin-bottom:12px;letter-spacing:-.3px}.cf-sh p{font-size:15px;color:#777;max-width:560px;margin:0 auto}.cf-s{padding:70px 40px;max-width:1280px;margin:0 auto}.cf-sg{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}.cf-sc{position:relative;border-radius:16px;overflow:hidden;aspect-ratio:3/4;text-decoration:none;color:#fff;display:block}.cf-sv{width:100%;height:100%;transition:transform .6s}.cf-sc:hover .cf-sv{transform:scale(1.05)}.cf-so{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.6) 0%,transparent 60%);display:flex;flex-direction:column;justify-content:flex-end;padding:24px}.cf-so h3{font-size:20px;font-weight:700;margin-bottom:2px}.cf-so span{font-size:12px;opacity:.85}.cf-p{padding:70px 40px;background:#fff}.cf-pi{max-width:1280px;margin:0 auto}.cf-pg{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}.cf-pc{background:#fff;border-radius:16px;overflow:hidden;border:1px solid #f0ebe5;transition:all .3s;text-decoration:none;color:#1a1a1a;display:block}.cf-pc:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,.08)}.cf-pm{position:relative;aspect-ratio:1;overflow:hidden;background:#faf7f2;display:flex;align-items:center;justify-content:center;color:#d4a574}.cf-pb{position:absolute;top:12px;left:12px;background:#E67E22;color:#fff;padding:4px 12px;border-radius:20px;font-size:10px;font-weight:800;letter-spacing:1px;text-transform:uppercase}.cf-pb.n{background:#2ECC71}.cf-pb.h{background:#E74C3C}.cf-pf{padding:18px}.cf-pn{font-size:14px;font-weight:600;line-height:1.4;margin-bottom:6px}.cf-pr{display:flex;align-items:center;gap:4px;margin-bottom:8px;font-size:12px;color:#999}.cf-pp{display:flex;align-items:center;gap:8px}.cf-cp{font-size:18px;font-weight:800}.cf-op{font-size:14px;color:#aaa;text-decoration:line-through}.cf-dp{font-size:12px;font-weight:700;color:#27ae60}.cf-pa{display:block;width:100%;margin-top:14px;padding:11px;background:#1a1a1a;color:#fff;border:none;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;letter-spacing:.5px}.cf-ft{background:#1a1a1a;color:#bbb;padding:50px 40px 24px}.cf-fi{max-width:1280px;margin:0 auto}.cf-fg{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:32px;margin-bottom:32px}.cf-fb h3{font-size:22px;font-weight:800;color:#fff;margin-bottom:10px}.cf-fb p{font-size:12px;line-height:1.7;color:#888}.cf-ft h4{font-size:13px;font-weight:700;color:#fff;margin-bottom:14px}.cf-ft ul{list-style:none}.cf-ft li{margin-bottom:8px}.cf-ft a{color:#888;text-decoration:none;font-size:12px}.cf-fx{border-top:1px solid rgba(255,255,255,.08);padding-top:20px;display:flex;justify-content:space-between;font-size:11px;color:#666}@media(max-width:768px){.cf-hi{grid-template-columns:1fr;padding:30px 16px}.cf-h h1{font-size:28px}.cf-sg,.cf-pg{grid-template-columns:repeat(2,1fr);gap:10px}.cf-fg{grid-template-columns:1fr 1fr}}</style></head><body><div class="cf-a"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> FLAT 20% OFF on your first order <a href="#">Shop Now →</a></div><div class="cf-h"><div class="cf-hi"><div><span class="cf-hb">NEW COLLECTION</span><h1>Discover Your<br><span>Natural Glow</span></h1><p class="cf-hs">Premium skincare powered by ancient beauty secrets. Vegan, cruelty-free, and FDA approved.</p><a href="#" class="cf-hc">Explore Collection →</a></div><div style="display:flex;justify-content:center"><div style="width:100%;max-width:460px;aspect-ratio:4/5;background:linear-gradient(135deg,#f0e6da,#e8d5c4);border-radius:20px;display:flex;align-items:center;justify-content:center"><svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" stroke-width="1"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75"/></svg></div></div></div></div><div class="cf-tb"><div class="cf-ti"><div class="cf-tt"><span class="cf-ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg></span> Free Shipping</div><div class="cf-tt"><span class="cf-ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></span> Cruelty Free</div><div class="cf-tt"><span class="cf-ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg></span> FDA Approved</div></div></div><div class="cf-s"><div class="cf-sh"><span class="cf-ol">Explore</span><h2>Shop by Category</h2><p>Find the perfect products for your beauty routine</p></div><div class="cf-sg"><a href="#" class="cf-sc"><div class="cf-sv" style="background:linear-gradient(135deg,#FADADD,#F8C8DC)"></div><div class="cf-so"><h3>Skin Care</h3><span>45+ Products</span></div></a><a href="#" class="cf-sc"><div class="cf-sv" style="background:linear-gradient(135deg,#E8D5B7,#C9A96E)"></div><div class="cf-so"><h3>Hair Care</h3><span>35+ Products</span></div></a><a href="#" class="cf-sc"><div class="cf-sv" style="background:linear-gradient(135deg,#FFD1DC,#FF9EBA)"></div><div class="cf-so"><h3>Makeup</h3><span>30+ Products</span></div></a><a href="#" class="cf-sc"><div class="cf-sv" style="background:linear-gradient(135deg,#E6E0F8,#D4C5F9)"></div><div class="cf-so"><h3>Fragrances</h3><span>20+ Products</span></div></a></div></div><div class="cf-p"><div class="cf-pi"><div class="cf-sh"><span class="cf-ol">Most Loved</span><h2>Bestselling Products</h2><p>Trusted by 5 million+ customers</p></div><div class="cf-pg"><a href="#" class="cf-pc"><div class="cf-pm"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 2h6l1 7H8l1-7Z"/><path d="M8 9v10a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3V9"/></svg><span class="cf-pb">BESTSELLER</span></div><div class="cf-pf"><div class="cf-pn">10% Vitamin C Face Serum</div><div class="cf-pp"><span class="cf-cp">&#8377;599</span><span class="cf-op">&#8377;799</span><span class="cf-dp">25% OFF</span></div><button class="cf-pa">ADD TO CART</button></div></a><a href="#" class="cf-pc"><div class="cf-pm"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg><span class="cf-pb n">TRENDING</span></div><div class="cf-pf"><div class="cf-pn">Korean Rice Water Moisturizer</div><div class="cf-pp"><span class="cf-cp">&#8377;499</span><span class="cf-op">&#8377;699</span><span class="cf-dp">29% OFF</span></div><button class="cf-pa">ADD TO CART</button></div></a><a href="#" class="cf-pc"><div class="cf-pm"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2C6.5 2 2 6.5 2 12c0 .7.1 1.4.2 2"/><path d="M20 16.5c1.3-1.8 2-3.9 2-6.5 0-5.5-4.5-10-10-10"/><path d="M9 22c1.6 0 3-1.3 3-3v-2c0-1.7-1.4-3-3-3s-3 1.3-3 3v2c0 1.7 1.4 3 3 3Z"/></svg><span class="cf-pb">BESTSELLER</span></div><div class="cf-pf"><div class="cf-pn">Redensyl Hair Growth Serum</div><div class="cf-pp"><span class="cf-cp">&#8377;699</span><span class="cf-op">&#8377;899</span><span class="cf-dp">22% OFF</span></div><button class="cf-pa">ADD TO CART</button></div></a><a href="#" class="cf-pc"><div class="cf-pm"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/></svg><span class="cf-pb h">HOT</span></div><div class="cf-pf"><div class="cf-pn">25% AHA BHA Peeling Solution</div><div class="cf-pp"><span class="cf-cp">&#8377;549</span><span class="cf-op">&#8377;749</span><span class="cf-dp">27% OFF</span></div><button class="cf-pa">ADD TO CART</button></div></a></div></div></div><div class="cf-ft"><div class="cf-fi"><div class="cf-fg"><div class="cf-fb"><h3>Your Brand</h3><p>Premium beauty bringing the best of global beauty secrets. Cruelty-free, vegan, and FDA approved.</p></div><div><h4>Quick Links</h4><ul><li><a href="#">All Products</a></li><li><a href="#">Bestsellers</a></li><li><a href="#">About Us</a></li></ul></div><div><h4>Help</h4><ul><li><a href="#">Shipping</a></li><li><a href="#">Returns</a></li><li><a href="#">FAQs</a></li></ul></div><div><h4>Connect</h4><ul><li><a href="#">Instagram</a></li><li><a href="#">Facebook</a></li><li><a href="#">YouTube</a></li></ul></div></div><div class="cf-fx"><span>&copy; 2026 Your Brand.</span><span>Powered by ConvertFlow</span></div></div></div>


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
const caratlanePreviewHTML = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Inter',sans-serif;color:#333;background:#fff;-webkit-font-smoothing:antialiased}.cl-h{display:flex;justify-content:space-between;padding:16px 40px;border-bottom:1px solid #e0e0e0;align-items:center}.cl-l{font-family:'Playfair Display',serif;font-size:24px;font-weight:700;color:#493161}.cl-nav{background:#493161;padding:12px;text-align:center;color:#fff;font-size:12px;letter-spacing:1px}.cl-hero{background:linear-gradient(135deg,#fdfbfb,#ebedee);height:320px;display:flex;align-items:center;padding:40px}.cl-hero h1{font-family:'Playfair Display',serif;font-size:36px;color:#493161;max-width:400px}.cl-wwl{background:#F6EFFB;padding:40px;margin:20px;border-radius:12px;display:flex;gap:16px;overflow-x:hidden}.cl-wwl-lead{flex:0 0 120px;text-align:center;color:#493161;font-weight:600;display:flex;align-items:center;justify-content:center}.cl-wwl-item{flex:1;background:#fff;border-radius:8px;aspect-ratio:1;box-shadow:0 4px 10px rgba(0,0,0,.05);border:1px solid #eee}.cl-ts{display:grid;grid-template-columns:1fr 1fr;margin:20px;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.05)}.cl-ts-l{padding:40px;background:#eee;display:flex;flex-direction:column;justify-content:center}.cl-ts-l h2{font-family:'Playfair Display',serif;font-size:36px;color:#493161}.cl-ts-r{background:linear-gradient(135deg,#f1e9ff,#f6effb);padding:30px;display:flex;gap:16px}.cl-ts-card{flex:1;background:#fff;border-radius:8px;padding:20px;text-align:center;border:1px solid rgba(73,49,97,0.1)}.cl-ts-card-img{width:100%;aspect-ratio:1;background:#f5f5f5;border-radius:4px}.cl-ts-price{color:#493161;font-weight:700;margin-top:10px}.cl-mo{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:20px}.cl-mo-i{background:#e0e0e0;border-radius:12px;aspect-ratio:16/9;background:linear-gradient(135deg,#e2e2e2,#f5f5f5)}.cl-cg{padding:40px;background:#fafafa;text-align:center}.cl-cg h2{font-family:'Playfair Display',serif;color:#493161;margin-bottom:24px;font-size:28px}.cl-cg-g{display:grid;grid-template-columns:repeat(5,1fr);gap:16px}.cl-cg-c{aspect-ratio:3/4;background:linear-gradient(to bottom right,#d1c4e9,#b39ddb);border-radius:8px;position:relative}.cl-cg-c::after{content:'Collection';position:absolute;bottom:16px;left:0;width:100%;color:#fff;font-weight:600}</style></head><body><div class="cl-h"><div class="cl-l">CaratLane Clone</div></div><div class="cl-nav">RINGS &nbsp;&nbsp; EARRINGS &nbsp;&nbsp; BRACELETS &nbsp;&nbsp; SOLITAIRES</div><div class="cl-hero"><h1>Shop stunning diamond designs with EXTRA ₹500/GM</h1></div><div class="cl-wwl"><div class="cl-wwl-lead">Wrapped with love</div><div class="cl-wwl-item"></div><div class="cl-wwl-item"></div><div class="cl-wwl-item"></div><div class="cl-wwl-item"></div><div class="cl-wwl-item"></div></div><div class="cl-ts"><div class="cl-ts-l"><h2>Thursday<br><i>trendsetters</i></h2></div><div class="cl-ts-r"><div class="cl-ts-card"><div class="cl-ts-card-img"></div><div class="cl-ts-price">₹45,999</div></div><div class="cl-ts-card"><div class="cl-ts-card-img"></div><div class="cl-ts-price">₹89,999</div></div></div></div><div class="cl-mo"><div class="cl-mo-i"></div><div class="cl-mo-i"></div></div><div class="cl-cg"><h2>CaratLane Collections</h2><div class="cl-cg-g"><div class="cl-cg-c"></div><div class="cl-cg-c"></div><div class="cl-cg-c"></div><div class="cl-cg-c"></div><div class="cl-cg-c"></div></div></div>


<!-- SUPER THEME SECTIONS PREVIEW -->
<div style="font-family: inherit; background: #FFFFFF; padding: 40px 0; border-top: 1px solid rgba(0,0,0,0.05); color: #111111;">
  <div style="text-align: center; margin-bottom: 20px;">
    <span style="background: #D4AF37; color: #000; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Super Theme Sections</span>
  </div>

  <!-- COUNTDOWN BANNER -->
  <div style="background:#D4AF37; color:#000; text-align:center; padding:24px; margin: 40px 0;">
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
    <h2 style="font-size:32px; font-weight:800; margin-bottom:8px; color: #111111;">Real Results</h2>
    <p style="opacity:0.7; margin-bottom:32px;">See the difference</p>
    <div style="position:relative; width:100%; height:400px; background:rgba(0,0,0,0.05); border-radius:12px; overflow:hidden;">
      <div style="position:absolute; inset:0; background:url('https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png') center/cover;"></div>
      <div style="position:absolute; inset:0; right:50%; background:url('https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png') center/cover; border-right:4px solid #fff; filter:grayscale(100%);"></div>
      <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:40px; height:40px; background:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 10px rgba(0,0,0,0.2);"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></div>
    </div>
  </div>

  <!-- FREQUENTLY BOUGHT TOGETHER -->
  <div style="max-width:1000px; margin:60px auto; background:rgba(0,0,0,0.03); padding:40px; border-radius:12px; border: 1px solid rgba(0,0,0,0.05);">
    <h2 style="font-size:24px; font-weight:700; margin-bottom:24px; color: #111111;">Frequently Bought Together</h2>
    <div style="display:flex; gap:20px; align-items:center; margin-bottom:24px;">
      <div style="width:120px; text-align:center;"><div style="width:120px; height:120px; background:rgba(0,0,0,0.08); border-radius:8px; margin-bottom:12px;"></div><div style="font-weight:600; font-size:14px; color: #111111;">Main Item</div></div>
      <div style="font-size:24px; opacity: 0.3;">+</div>
      <div style="width:120px; text-align:center;"><div style="width:120px; height:120px; background:rgba(0,0,0,0.08); border-radius:8px; margin-bottom:12px;"></div><div style="font-weight:600; font-size:14px; color: #111111;">Add-on 1</div></div>
      <div style="font-size:24px; opacity: 0.3;">+</div>
      <div style="width:120px; text-align:center;"><div style="width:120px; height:120px; background:rgba(0,0,0,0.08); border-radius:8px; margin-bottom:12px;"></div><div style="font-weight:600; font-size:14px; color: #111111;">Add-on 2</div></div>
      <div style="margin-left:auto; text-align:right;">
        <div style="font-size:14px; opacity: 0.5; text-decoration:line-through;">$150.00</div>
        <div style="font-size:24px; font-weight:800; color: #D4AF37;">$135.00</div>
        <button style="background:#111111; color:#FFFFFF; border:none; padding:12px 24px; border-radius:6px; font-weight:600; margin-top:12px; cursor:pointer;">Add Bundle to Cart</button>
      </div>
    </div>
  </div>

  <!-- SHOPPABLE IMAGE -->
  <div style="max-width:1200px; margin:60px auto; text-align:center;">
    <h2 style="font-size:32px; font-weight:800; margin-bottom:8px; color: #111111;">Shop the Look</h2>
    <p style="opacity:0.7; margin-bottom:32px;">Tap the pins to view products</p>
    <div style="position:relative; width:100%; height:500px; background:rgba(0,0,0,0.05); border-radius:12px; overflow:hidden;">
      <div style="position:absolute; top:40%; left:50%; width:24px; height:24px; background:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 0 0 4px rgba(255,255,255,0.3); cursor:pointer;">
        <div style="width:8px; height:8px; background:#D4AF37; border-radius:50%;"></div>
      </div>
      <div style="position:absolute; top:60%; left:30%; width:24px; height:24px; background:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 0 0 4px rgba(255,255,255,0.3); cursor:pointer;">
        <div style="width:8px; height:8px; background:#D4AF37; border-radius:50%;"></div>
      </div>
    </div>
  </div>
</div>
</body></html>`;

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
  const fetcher = useFetcher();
  const isInjecting = fetcher.state === "submitting";
  const injectResult = fetcher.data;

  const viewportWidth = { desktop: "100%", tablet: "768px", mobile: "375px" }[previewMode];
  const currentTpl = TEMPLATES.find((t) => t.id === selectedTemplate);

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

          {/* Grid — Bento Style */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gridAutoRows: "minmax(180px, auto)",
            gap: 16,
          }}>
            {TEMPLATES.map((tpl, idx) => {
              const isSelected = selectedTemplate === tpl.id;
              
              // Create bento sizing logic
              // Make every 5th item large (span 2 cols, span 2 rows)
              // Make every 3rd item wide (span 2 cols)
              let gridColumn = "span 1";
              let gridRow = "span 1";
              
              if (idx === 0 || idx === 7 || idx === 14) {
                gridColumn = "span 2";
                gridRow = "span 2";
              } else if (idx === 2 || idx === 11 || idx === 18) {
                gridColumn = "span 2";
              }

              return (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl.id)}
                  style={{
                    gridColumn,
                    gridRow,
                    padding: "24px",
                    background: isSelected ? "#fff" : tpl.nicheBg,
                    border: isSelected ? `2.5px solid ${tpl.accent}` : "1.5px solid transparent",
                    borderRadius: 20,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: isSelected ? `0 8px 30px ${tpl.accent}30` : "0 4px 12px rgba(0,0,0,0.02)",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}
                  onMouseOver={(e) => {
                    if(!isSelected) e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseOut={(e) => {
                    if(!isSelected) e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {/* Decorative background circle */}
                  <div style={{
                    position: "absolute",
                    top: -20,
                    right: -20,
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    background: tpl.nicheColor,
                    opacity: 0.05,
                    pointerEvents: "none"
                  }} />

                  <div style={{ position: "relative", zIndex: 2 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                      <span style={{
                        background: isSelected ? tpl.nicheBg : "#fff",
                        color: tpl.nicheColor,
                        padding: "6px 14px",
                        borderRadius: 20,
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: 0.8,
                        textTransform: "uppercase",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                      }}>{tpl.niche}</span>
                      
                      {/* Selected checkmark */}
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
                      fontSize: (gridColumn === "span 2" && gridRow === "span 2") ? 28 : 18,
                      fontWeight: 800,
                      color: "#1a1a1a",
                      marginBottom: 8,
                      lineHeight: 1.2,
                      fontFamily: "'Playfair Display', serif",
                    }}>{tpl.name}</div>
                  </div>

                  <p style={{
                    position: "relative", zIndex: 2,
                    fontSize: 13,
                    color: "#555",
                    lineHeight: 1.6,
                    display: "-webkit-box",
                    WebkitLineClamp: gridRow === "span 2" ? 4 : 2,
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
          }}>
            <iframe
              srcDoc={PREVIEW_MAP[selectedTemplate]}
              style={{
                width: viewportWidth, maxWidth: "100%", height: "80vh",
                border: "none", borderRadius: previewMode !== "desktop" ? "12px" : 0,
                boxShadow: previewMode !== "desktop" ? "0 8px 30px rgba(0,0,0,0.12)" : "none",
                transition: "all 0.3s ease",
              }}
              title="Template Preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

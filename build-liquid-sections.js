/**
 * build-liquid-sections.js
 * ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
 * Converts standalone HTML template files ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ Shopify Liquid section files.
 * Generates 4 section types per template:
 *   ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ landing  (index.json)
 *   ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ product  (product.json)
 *   ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ cart     (cart.json)
 *   ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ collection (collection.json)
 *
 * Run: node build-liquid-sections.js
 */

import fs from 'fs';
import path from 'path';
import { buildLandingSection } from './build-landing-section.js';

const SECTIONS_DIR = path.resolve('./extensions/convertkit-sections/sections');

// All HTML-based templates needing Liquid section generation
const TEMPLATES = [
  { id: 'jewellery-heritage',  file: 'lp-jewellery-heritage.html',  label: 'Meenakshi Heritage Jewellers', accent: '#8B1A2C', bg: '#FAF0F0',  font: "'Cinzel', serif" },
  { id: 'fashion-clothing',    file: 'lp-fashion-clothing.html',    label: 'VÃƒâ€¦Ã…â€™LT Fashion',                 accent: '#0A0A0A', bg: '#F5F3EF',  font: "'Bebas Neue', cursive" },
  { id: 'footwear',            file: 'lp-footwear.html',            label: 'Solera Footwear',              accent: '#C65D2A', bg: '#FBF0E8',  font: "'Syne', sans-serif" },
  { id: 'ayurveda-wellness',   file: 'lp-ayurveda-wellness.html',   label: 'Ayurva Wellness',              accent: '#E07B2A', bg: '#F5FCF5',  font: "'Hind', sans-serif" },
  { id: 'mobile-accessories',  file: 'lp-mobile-accessories.html',  label: 'STACKD Accessories',           accent: '#00F0C8', bg: '#0D0D12',  font: "'Space Grotesk', sans-serif" },
  { id: 'kids-toys',           file: 'lp-kids-toys.html',           label: 'PlayBox Kids',                 accent: '#F9C22E', bg: '#EFF4FF',  font: "'Baloo 2', cursive" },
  { id: 'home-furniture',      file: 'lp-home-furniture.html',      label: 'Haven Furniture',              accent: '#B5834A', bg: '#F5EFE6',  font: "'Libre Baskerville', serif" },
  { id: 'food-delivery',       file: 'lp-food-delivery.html',       label: 'Veda Eats',                    accent: '#FF5722', bg: '#FFF0E8',  font: "'Poppins', sans-serif" },
  // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Previously "placeholder" templates ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â now fully generated ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
  { id: 'electronics',         file: 'lp-electronics.html',         label: 'Tech & Electronics',           accent: '#5735db', bg: '#e9e5f5',  font: "'Inter', sans-serif" },
  { id: 'home-decor',          file: 'lp-home-decor.html',          label: 'Home Decor',                   accent: '#8B7355', bg: '#FAF5ED',  font: "'Playfair Display', serif" },
  { id: 'pet-supplies',        file: 'lp-pet-supplies.html',        label: 'Pet Supplies',                 accent: '#D35400', bg: '#f9e0d1',  font: "'Nunito', sans-serif" },
  { id: 'luxury-watches',      file: 'lp-luxury-watches.html',      label: 'Luxury Watches',               accent: '#C5A028', bg: '#0a0a0a',  font: "'Cormorant Garamond', serif" },
  { id: 'outdoor-gear',        file: 'lp-outdoor-gear.html',        label: 'Outdoor Gear',                 accent: '#2A4B2A', bg: '#dbe8db',  font: "'Oswald', sans-serif" },
  { id: 'organic-food',        file: 'lp-organic-food.html',        label: 'Organic Food',                 accent: '#4A7C59', bg: '#e5f1e8',  font: "'DM Sans', sans-serif" },
  { id: 'fitness-supplements', file: 'lp-fitness-supplements.html', label: 'Fitness Supplements',          accent: '#E2FE16', bg: '#050505',  font: "'Barlow Condensed', sans-serif" },
  { id: 'baby-apparel',        file: 'lp-baby-apparel.html',        label: 'Baby Apparel',                 accent: '#F6A8B6', bg: '#fcedef',  font: "'Nunito', sans-serif" },
  { id: 'coffee-roasters',     file: 'lp-coffee-roasters.html',     label: 'Coffee Roasters',              accent: '#3E2723', bg: '#efebe9',  font: "'Playfair Display', serif" },
  { id: 'beauty-cosmetics',    file: 'lp-beauty-cosmetics.html',    label: 'Clean Cosmetics',              accent: '#D4BBA5', bg: '#f8f3f0',  font: "'Cormorant Garamond', serif" },
  { id: 'mens-grooming',       file: 'lp-mens-grooming.html',       label: 'BRUT Mens Grooming',           accent: '#B87333', bg: '#080808',  font: "'Space Grotesk', sans-serif" },
  { id: 'activewear',          file: 'lp-activewear.html',          label: 'Activewear',                   accent: '#ff0000', bg: '#f4f4f4',  font: "'Inter', sans-serif" },
  { id: 'streetwear',          file: 'lp-streetwear.html',          label: 'Streetwear',                   accent: '#000000', bg: '#ffffff',  font: "'Space Grotesk', sans-serif" },
  { id: 'personal-care',       file: 'lp-personal-care.html',       label: 'Personal Care',                accent: '#008080', bg: '#eefcfc',  font: "'Nunito', sans-serif" },
  { id: 'mens-fashion',        file: 'lp-mens-fashion.html',        label: 'Mens Fashion',                 accent: '#333333', bg: '#f9f9f9',  font: "'Inter', sans-serif" }
];

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Helper: extract <style> content ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
function extractStyles(html) {
  const matches = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)];
  return matches.map(m => m[1]).join('\n').trim();
}

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Helper: extract <body> content ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
function extractBody(html) {
  const m = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  return m ? m[1].trim() : html;
}

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Helper: extract Google Font <link> tags ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
function extractFonts(html) {
  const matches = [...html.matchAll(/<link[^>]*fonts\.googleapis[^>]*>/gi)];
  return matches.map(m => m[0]).join('\n');
}

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Helper: Shopify schema names max 25 chars ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
// Format: "CF {label} {suffix}" truncated to 25
function sn(label, suffix) {
  return `CF ${label} ${suffix}`.substring(0, 25).trimEnd();
}

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Build the PRODUCT section ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
function buildProductSection(tpl) {
  const schema = {
    name: `CF ${tpl.label} PDP`.substring(0,25).trimEnd(),
    settings: [
      {type:"header",content:"Brand Colors"},
      {type:"color",id:"color_accent",label:"Accent Color",default:tpl.accent},
      {type:"color",id:"color_bg",label:"Background",default:tpl.bg},
      {type:"color",id:"color_text",label:"Text Color",default:"#1a1a1a"},
      {type:"header",content:"Product Page"},
      {type:"checkbox",id:"show_breadcrumb",label:"Show Breadcrumb",default:true},
      {type:"checkbox",id:"show_vendor",label:"Show Vendor",default:true},
      {type:"checkbox",id:"show_rating",label:"Show Rating",default:true},
      {type:"text",id:"review_count",label:"Review Count Text",default:"2,148 reviews"},
      {type:"checkbox",id:"show_wishlist",label:"Show Wishlist Button",default:true},
      {type:"header",content:"Buttons"},
      {type:"text",id:"atc_text",label:"Add to Cart Text",default:"Add to Cart"},
      {type:"checkbox",id:"show_buy_now",label:"Show Buy Now",default:true},
      {type:"text",id:"buy_now_text",label:"Buy Now Text",default:"Buy Now"},
      {type:"header",content:"Trust Badges"},
      {type:"text",id:"trust_1",label:"Badge 1",default:"Authentic & Certified"},
      {type:"text",id:"trust_2",label:"Badge 2",default:"Free Delivery"},
      {type:"text",id:"trust_3",label:"Badge 3",default:"Easy 30-Day Returns"},
      {type:"text",id:"trust_4",label:"Badge 4",default:"Secure Checkout"},
      {type:"header",content:"Related Products"},
      {type:"checkbox",id:"show_related",label:"Show Related Products",default:true},
      {type:"text",id:"related_heading",label:"Heading",default:"You May Also Like"},
      {type:"collection",id:"related_collection",label:"Related Collection"},
      {type:"range",id:"related_count",label:"Products to Show",min:2,max:8,step:2,default:4}
    ],
    presets:[{name:`CF ${tpl.label} PDP`.substring(0,25).trimEnd()}]
  };

  return `{% comment %}ConvertFlow: ${tpl.label} ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Product Page{% endcomment %}
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
<style>
:root {
  --cf-accent: {{ section.settings.color_accent | default: '${tpl.accent}' }};
  --cf-bg: {{ section.settings.color_bg | default: '${tpl.bg}' }};
  --cf-text: {{ section.settings.color_text | default: '#1a1a1a' }};
  --cf-font: ${tpl.font};
}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
body{font-family:var(--cf-font),'Inter',sans-serif;background:var(--cf-bg);color:var(--cf-text);-webkit-font-smoothing:antialiased}
.cfp-crumb{padding:14px 60px;font-size:12px;color:#888;background:#fff;border-bottom:1px solid #eee}
.cfp-crumb a{color:#888;text-decoration:none}
.cfp-crumb span{margin:0 8px}
.cfp-wrap{max-width:1300px;margin:0 auto;padding:60px;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start}
.cfp-main-img{background:#f0ece6;aspect-ratio:1;display:flex;align-items:center;justify-content:center;margin-bottom:16px;border-radius:4px;overflow:hidden}
.cfp-main-img img{width:100%;height:100%;object-fit:cover}
.cfp-main-img svg{width:30%;color:var(--cf-accent);opacity:.3}
.cfp-thumbs{display:flex;gap:10px}
.cfp-thumb{width:80px;aspect-ratio:1;background:#e8e4de;border-radius:4px;border:2px solid transparent;cursor:pointer;overflow:hidden}
.cfp-thumb.active,.cfp-thumb:hover{border-color:var(--cf-accent)}
.cfp-vendor{font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--cf-accent);margin-bottom:12px;display:block}
.cfp-name{font-size:36px;font-weight:700;line-height:1.15;margin-bottom:16px}
.cfp-rating{display:flex;align-items:center;gap:8px;margin-bottom:20px;color:#888;font-size:13px}
.cfp-stars{color:#F59E0B;letter-spacing:2px}
.cfp-price-row{display:flex;align-items:center;gap:16px;margin-bottom:24px;padding-bottom:24px;border-bottom:1px solid #e5e7eb}
.cfp-price{font-size:32px;font-weight:700}
.cfp-compare{font-size:20px;color:#aaa;text-decoration:line-through}
.cfp-save{background:#DCFCE7;color:#16A34A;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700}
.cfp-desc{font-size:15px;color:#555;line-height:1.8;margin-bottom:28px}
.cfp-label{font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:10px;color:#333}
.cfp-variants{display:flex;gap:8px;margin-bottom:24px;flex-wrap:wrap}
.cfp-var{padding:8px 18px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:600;cursor:pointer;border-radius:4px;transition:all .2s}
.cfp-var:hover,.cfp-var.active{border-color:var(--cf-accent);background:var(--cf-accent);color:#fff}
.cfp-qty-row{display:flex;gap:12px;margin-bottom:12px}
.cfp-qty{display:flex;align-items:center;border:1.5px solid #e5e7eb;border-radius:4px;overflow:hidden}
.cfp-qty button{width:40px;height:52px;background:none;border:none;font-size:20px;cursor:pointer;color:#333}
.cfp-qty span{width:40px;text-align:center;font-size:16px;font-weight:600}
.cfp-atc{flex:1;background:var(--cf-accent);color:#fff;border:none;padding:16px 32px;font-size:15px;font-weight:700;cursor:pointer;letter-spacing:.5px;transition:opacity .2s;border-radius:4px}
.cfp-atc:hover{opacity:.9}
.cfp-buy-now{display:block;width:100%;background:transparent;color:var(--cf-accent);border:2px solid var(--cf-accent);padding:14px 32px;font-size:15px;font-weight:700;cursor:pointer;border-radius:4px;margin-top:8px;transition:all .2s}
.cfp-buy-now:hover{background:var(--cf-accent);color:#fff}
.cfp-wishlist{width:52px;height:52px;border:1.5px solid #e5e7eb;background:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;border-radius:4px;color:#888;transition:all .2s;flex-shrink:0}
.cfp-wishlist:hover{border-color:var(--cf-accent);color:var(--cf-accent)}
.cfp-trust{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:24px;padding-top:24px;border-top:1px solid #e5e7eb}
.cfp-trust-item{display:flex;align-items:center;gap:10px;font-size:12px;color:#555;font-weight:500}
.cfp-trust-icon{color:var(--cf-accent)}
.cfp-tabs{background:#fff;border-top:1px solid #eee;padding:60px}
.cfp-tabs-inner{max-width:1300px;margin:0 auto}
.cfp-tab-nav{display:flex;border-bottom:2px solid #eee;margin-bottom:40px}
.cfp-tab-btn{padding:14px 28px;font-size:14px;font-weight:600;cursor:pointer;border:none;background:none;color:#888;border-bottom:2px solid transparent;margin-bottom:-2px;transition:all .2s}
.cfp-tab-btn.active{color:var(--cf-accent);border-bottom-color:var(--cf-accent)}
.cfp-tab-content{display:none;font-size:15px;color:#555;line-height:1.9}
.cfp-tab-content.active{display:block}
.cfp-specs-table{width:100%;border-collapse:collapse}
.cfp-specs-table tr{border-bottom:1px solid #f0f0f0}
.cfp-specs-table td{padding:12px 0;font-size:14px}
.cfp-specs-table td:first-child{color:#888;font-weight:500;width:40%}
.cfp-related{padding:80px 60px;background:#f9f9f9;border-top:1px solid #eee}
.cfp-related-inner{max-width:1300px;margin:0 auto}
.cfp-related h2{font-size:28px;font-weight:700;margin-bottom:36px;text-align:center}
.cfp-related-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
.cfp-rel-card{background:#fff;border:1px solid #eee;text-decoration:none;color:#1a1a1a;display:block;transition:all .3s;border-radius:4px;overflow:hidden}
.cfp-rel-card:hover{transform:translateY(-4px);box-shadow:0 8px 30px rgba(0,0,0,.08)}
.cfp-rel-img{aspect-ratio:1;background:#f5f3ef;display:flex;align-items:center;justify-content:center}
.cfp-rel-img img{width:100%;height:100%;object-fit:cover}
.cfp-rel-img svg{width:30%;color:var(--cf-accent);opacity:.25}
.cfp-rel-info{padding:16px}
.cfp-rel-name{font-size:14px;font-weight:600;margin-bottom:6px}
.cfp-rel-price{font-size:18px;font-weight:700;color:var(--cf-accent)}
@media(max-width:1024px){.cfp-wrap{grid-template-columns:1fr;padding:30px 20px;gap:30px}.cfp-tabs{padding:40px 20px}.cfp-related{padding:60px 20px}.cfp-related-grid{grid-template-columns:repeat(2,1fr)}.cfp-crumb{padding:12px 20px}}
</style>

{% if section.settings.show_breadcrumb %}
<div class="cfp-crumb">
  <a href="/">Home</a><span>ÃƒÂ¢Ã¢â€šÂ¬Ã‚Âº</span>
  <a href="/collections/{{ product.type | handleize }}">{{ product.type | default: 'Products' }}</a><span>ÃƒÂ¢Ã¢â€šÂ¬Ã‚Âº</span>
  {{ product.title }}
</div>
{% endif %}

<div class="cfp-wrap">
  <div class="cfp-gallery">
    <div class="cfp-main-img" id="cfpMainImg">
      {% if product.featured_image %}
        <img src="{{ product.featured_image | image_url: width: 800 }}" alt="{{ product.title }}" id="cfpMainImgEl">
      {% else %}
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M20 7H4l1 12h14z"/><path d="M8 7V5a4 4 0 018 0v2"/></svg>
      {% endif %}
    </div>
    <div class="cfp-thumbs">
      {% for image in product.images limit: 5 %}
        <div class="cfp-thumb {% if forloop.first %}active{% endif %}" onclick="document.getElementById('cfpMainImgEl').src='{{ image | image_url: width: 800 }}';document.querySelectorAll('.cfp-thumb').forEach(t=>t.classList.remove('active'));this.classList.add('active')" style="background-image:url('{{ image | image_url: width: 200 }}');background-size:cover;background-position:center"></div>
      {% else %}
        <div class="cfp-thumb active"></div>
        <div class="cfp-thumb"></div>
        <div class="cfp-thumb"></div>
      {% endfor %}
    </div>
  </div>

  <div class="cfp-info">
    {% if section.settings.show_vendor %}<span class="cfp-vendor">{{ product.vendor }}</span>{% endif %}
    <h1 class="cfp-name">{{ product.title }}</h1>
    {% if section.settings.show_rating %}
    <div class="cfp-rating"><span class="cfp-stars">ÃƒÂ¢Ã‹Å“Ã¢â‚¬Â¦ÃƒÂ¢Ã‹Å“Ã¢â‚¬Â¦ÃƒÂ¢Ã‹Å“Ã¢â‚¬Â¦ÃƒÂ¢Ã‹Å“Ã¢â‚¬Â¦ÃƒÂ¢Ã‹Å“Ã¢â‚¬Â¦</span> 4.9 Ãƒâ€šÃ‚Â· {{ section.settings.review_count }}</div>
    {% endif %}
    <div class="cfp-price-row">
      <div class="cfp-price">{{ product.price | money }}</div>
      {% if product.compare_at_price > product.price %}
        <div class="cfp-compare">{{ product.compare_at_price | money }}</div>
        <span class="cfp-save">{{ product.compare_at_price | minus: product.price | times: 100 | divided_by: product.compare_at_price | round }}% OFF</span>
      {% endif %}
    </div>

    <p class="cfp-desc">{{ product.description | strip_html | truncate: 280 }}</p>

    {% unless product.has_only_default_variant %}
      {% for option in product.options_with_values %}
        <div class="cfp-label">{{ option.name }}</div>
        <div class="cfp-variants">
          {% for value in option.values %}
            <button class="cfp-var{% if forloop.first %} active{% endif %}">{{ value }}</button>
          {% endfor %}
        </div>
      {% endfor %}
    {% endunless %}

    <div class="cfp-qty-row">
      <div class="cfp-qty">
        <button onclick="var s=this.nextElementSibling;s.textContent=Math.max(1,+s.textContent-1)">ÃƒÂ¢Ã‹â€ Ã¢â‚¬â„¢</button>
        <span>1</span>
        <button onclick="var s=this.previousElementSibling;s.textContent=+s.textContent+1">+</button>
      </div>
      <button class="cfp-atc">{{ section.settings.atc_text }}</button>
      {% if section.settings.show_wishlist %}
      <button class="cfp-wishlist" aria-label="Wishlist">
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
      </button>
      {% endif %}
    </div>

    {% if section.settings.show_buy_now %}
    <button class="cfp-buy-now">{{ section.settings.buy_now_text }}</button>
    {% endif %}

    <div class="cfp-trust">
      <div class="cfp-trust-item"><span class="cfp-trust-icon"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg></span> {{ section.settings.trust_1 }}</div>
      <div class="cfp-trust-item"><span class="cfp-trust-icon"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg></span> {{ section.settings.trust_2 }}</div>
      <div class="cfp-trust-item"><span class="cfp-trust-icon"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg></span> {{ section.settings.trust_3 }}</div>
      <div class="cfp-trust-item"><span class="cfp-trust-icon"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></span> {{ section.settings.trust_4 }}</div>
    </div>
  </div>
</div>

<div class="cfp-tabs">
  <div class="cfp-tabs-inner">
    <div class="cfp-tab-nav">
      <button class="cfp-tab-btn active" onclick="cfpTab(this,'Desc')">Description</button>
      <button class="cfp-tab-btn" onclick="cfpTab(this,'Specs')">Specifications</button>
      <button class="cfp-tab-btn" onclick="cfpTab(this,'Shipping')">Shipping &amp; Returns</button>
    </div>
    <div id="cfpDesc" class="cfp-tab-content active">{{ product.description }}</div>
    <div id="cfpSpecs" class="cfp-tab-content">
      <table class="cfp-specs-table">
        <tr><td>Type</td><td>{{ product.type | default: 'ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â' }}</td></tr>
        <tr><td>Vendor</td><td>{{ product.vendor | default: 'ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â' }}</td></tr>
        <tr><td>SKU</td><td>{{ product.selected_or_first_available_variant.sku | default: 'ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â' }}</td></tr>
        <tr><td>Barcode</td><td>{{ product.selected_or_first_available_variant.barcode | default: 'ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â' }}</td></tr>
        <tr><td>Availability</td><td>{% if product.available %}In Stock{% else %}Out of Stock{% endif %}</td></tr>
        {% for tag in product.tags %}<tr><td>Tag</td><td>{{ tag }}</td></tr>{% endfor %}
      </table>
    </div>
    <div id="cfpShipping" class="cfp-tab-content">
      <p>Free standard delivery on orders above ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹999. Express delivery available at checkout. Easy 30-day returns on all products.</p>
    </div>
  </div>
</div>

{% if section.settings.show_related and section.settings.related_collection != blank %}
<div class="cfp-related">
  <div class="cfp-related-inner">
    <h2>{{ section.settings.related_heading }}</h2>
    <div class="cfp-related-grid">
      {% assign rc = section.settings.related_collection %}
      {% for p in rc.products limit: section.settings.related_count %}
      <a href="{{ p.url }}" class="cfp-rel-card">
        <div class="cfp-rel-img">
          {% if p.featured_image %}<img src="{{ p.featured_image | image_url: width: 400 }}" alt="{{ p.title }}" loading="lazy">
          {% else %}<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M20 7H4l1 12h14z"/></svg>{% endif %}
        </div>
        <div class="cfp-rel-info">
          <div class="cfp-rel-name">{{ p.title | truncate: 50 }}</div>
          <div class="cfp-rel-price">{{ p.price | money }}</div>
        </div>
      </a>
      {% endfor %}
    </div>
  </div>
</div>
{% endif %}

<script>
function cfpTab(btn, id) {
  document.querySelectorAll('.cfp-tab-btn').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.cfp-tab-content').forEach(c=>c.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('cfp'+id).classList.add('active');
}
</script>

{% schema %}
${JSON.stringify(schema, null, 2)}
{% endschema %}`;
}


// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Build the CART section Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
function buildCartSection(tpl) {
  const schema = {
    name: `CF ${tpl.label} Cart`.substring(0,25).trimEnd(),
    settings: [
      {type:"header",content:"Brand Colors"},
      {type:"color",id:"color_accent",label:"Accent Color",default:tpl.accent},
      {type:"color",id:"color_bg",label:"Background",default:tpl.bg},
      {type:"header",content:"Cart Settings"},
      {type:"text",id:"checkout_text",label:"Checkout Button Text",default:"Proceed to Checkout Ã¢â€ â€™"},
      {type:"checkbox",id:"show_promo",label:"Show Promo Code Field",default:true},
      {type:"text",id:"continue_text",label:"Empty Cart Button Text",default:"Continue Shopping"},
      {type:"header",content:"Trust Signals"},
      {type:"checkbox",id:"show_trust",label:"Show Trust Badges",default:true},
      {type:"text",id:"trust_1",label:"Trust Badge 1",default:"Secure SSL Checkout"},
      {type:"text",id:"trust_2",label:"Trust Badge 2",default:"Free Returns"},
      {type:"text",id:"trust_3",label:"Trust Badge 3",default:"Money-Back Guarantee"},
      {type:"header",content:"Upsell"},
      {type:"checkbox",id:"show_upsell",label:"Show Upsell Block",default:true},
      {type:"text",id:"upsell_heading",label:"Upsell Heading",default:"You might also like"},
      {type:"collection",id:"upsell_collection",label:"Upsell Collection"}
    ],
    presets:[{name:`CF ${tpl.label} Cart`.substring(0,25).trimEnd()}]
  };

  return `{% comment %}ConvertFlow: ${tpl.label} Ã¢â‚¬â€ Cart Page{% endcomment %}
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root { --cf-accent: {{ section.settings.color_accent | default: '${tpl.accent}' }}; --cf-bg: {{ section.settings.color_bg | default: '${tpl.bg}' }}; }
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
body { font-family: 'Inter', sans-serif; background: var(--cf-bg); min-height:100vh; -webkit-font-smoothing:antialiased; }
.cfc-wrap { max-width: 1200px; margin: 0 auto; padding: 60px; display: grid; grid-template-columns: 1fr 380px; gap: 60px; align-items: start; }
.cfc-title { font-size: 32px; font-weight: 800; margin-bottom: 32px; color: #1a1a1a; }
.cfc-empty { text-align:center; padding: 80px 20px; color: #888; }
.cfc-empty svg { width: 60px; margin-bottom: 20px; color: #ddd; }
.cfc-empty p { font-size: 18px; font-weight: 600; margin-bottom: 8px; color: #333; }
.cfc-empty span { font-size: 14px; }
.cfc-empty a { display: inline-block; margin-top: 24px; background: var(--cf-accent); color: #fff; padding: 14px 36px; font-size: 14px; font-weight: 700; text-decoration: none; }
.cfc-items { display: flex; flex-direction: column; gap: 0; background: #fff; border: 1px solid #e5e7eb; }
.cfc-item { display: grid; grid-template-columns: 90px 1fr auto; gap: 20px; padding: 24px; align-items: center; border-bottom: 1px solid #f0f0f0; }
.cfc-item:last-child { border-bottom: none; }
.cfc-item-img { width: 90px; height: 90px; background: #f5f3ef; display: flex; align-items: center; justify-content: center; }
.cfc-item-img img { width:100%; height:100%; object-fit:cover; }
.cfc-item-vendor { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--cf-accent); margin-bottom: 4px; }
.cfc-item-name { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.cfc-item-props { font-size: 12px; color: #888; margin-bottom: 12px; }
.cfc-item-qty { display: flex; align-items: center; gap: 12px; }
.cfc-item-qty button { width: 28px; height: 28px; border: 1px solid #e5e7eb; background: #fff; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.cfc-item-qty span { font-size: 14px; font-weight: 600; min-width: 20px; text-align: center; }
.cfc-item-remove { font-size: 11px; color: #aaa; text-decoration: underline; cursor: pointer; transition: color .2s; }
.cfc-item-remove:hover { color: #e53e3e; }
.cfc-item-price { font-size: 18px; font-weight: 700; color: #1a1a1a; white-space: nowrap; }
/* Summary */
.cfc-summary { background: #fff; border: 1px solid #e5e7eb; padding: 32px; position: sticky; top: 24px; }
.cfc-summary h2 { font-size: 20px; font-weight: 700; margin-bottom: 24px; }
.cfc-row { display: flex; justify-content: space-between; font-size: 14px; color: #555; margin-bottom: 12px; }
.cfc-row.total { font-size: 18px; font-weight: 700; color: #1a1a1a; padding-top: 16px; margin-top: 8px; border-top: 1px solid #e5e7eb; }
.cfc-promo { display: flex; border: 1.5px solid #e5e7eb; overflow: hidden; margin: 20px 0; }
.cfc-promo input { flex: 1; border: none; padding: 12px 16px; font-size: 14px; outline: none; font-family: inherit; }
.cfc-promo button { background: var(--cf-accent); color: #fff; border: none; padding: 12px 20px; font-size: 12px; font-weight: 700; cursor: pointer; white-space: nowrap; }
.cfc-checkout { display: block; width: 100%; background: var(--cf-accent); color: #fff; border: none; padding: 18px; font-size: 16px; font-weight: 700; cursor: pointer; text-align: center; letter-spacing: .5px; transition: opacity .2s; text-decoration: none; }
.cfc-checkout:hover { opacity: .9; }
.cfc-trust { display: flex; flex-direction: column; gap: 8px; margin-top: 20px; }
.cfc-trust-i { display: flex; align-items: center; gap: 8px; font-size: 11px; color: #888; }
.cfc-trust-i svg { flex-shrink: 0; color: var(--cf-accent); }
@media(max-width:1024px){ .cfc-wrap { grid-template-columns: 1fr; padding: 30px 20px; gap: 30px; } }
</style>

<div class="cfc-wrap">
  <div>
    <h1 class="cfc-title">Your Cart ({{ cart.item_count }})</h1>
    {% if cart.item_count == 0 %}
      <div class="cfc-empty">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
        <p>Your cart is empty</p>
        <span>Looks like you haven't added anything yet.</span>
        <a href="/collections/all">Continue Shopping</a>
      </div>
    {% else %}
      <div class="cfc-items">
        {% for item in cart.items %}
          <div class="cfc-item">
            <div class="cfc-item-img">
              {% if item.image %}
                <img src="{{ item.image | image_url: width: 180 }}" alt="{{ item.title }}">
              {% else %}
                <svg width="36" height="36" fill="none" stroke="#ccc" viewBox="0 0 24 24" stroke-width="1"><path d="M20 7H4l1 12h14z"/></svg>
              {% endif %}
            </div>
            <div>
              <div class="cfc-item-vendor">{{ item.vendor }}</div>
              <div class="cfc-item-name">{{ item.product_title }}</div>
              <div class="cfc-item-props">{{ item.variant_title }}</div>
              <div class="cfc-item-qty">
                <button>ÃƒÂ¢Ã‹â€ Ã¢â‚¬â„¢</button><span>{{ item.quantity }}</span><button>+</button>
                <span class="cfc-item-remove">Remove</span>
              </div>
            </div>
            <div class="cfc-item-price">{{ item.final_line_price | money }}</div>
          </div>
        {% endfor %}
      </div>
    {% endif %}
  </div>

  <div class="cfc-summary">
    <h2>Order Summary</h2>
    <div class="cfc-row"><span>Subtotal</span><span>{{ cart.total_price | money }}</span></div>
    <div class="cfc-row"><span>Shipping</span><span>Calculated at checkout</span></div>
    {% if cart.total_discount > 0 %}
      <div class="cfc-row" style="color:#16A34A"><span>Discount</span><span>ÃƒÂ¢Ã‹â€ Ã¢â‚¬â„¢{{ cart.total_discount | money }}</span></div>
    {% endif %}
    <div class="cfc-row total"><span>Total</span><span>{{ cart.total_price | money }}</span></div>
    <div class="cfc-promo">
      <input type="text" placeholder="Discount code">
      <button>Apply</button>
    </div>
    <a href="/checkout" class="cfc-checkout">{{ section.settings.checkout_text }}</a>
    {% if section.settings.show_trust %}
    <div class="cfc-trust">
      <div class="cfc-trust-i"><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> {{ section.settings.trust_1 }}</div>
      <div class="cfc-trust-i"><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg> {{ section.settings.trust_2 }}</div>
      <div class="cfc-trust-i"><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> {{ section.settings.trust_3 }}</div>
    </div>
    {% endif %}
  </div>
</div>

{% schema %}
${JSON.stringify(schema, null, 2)}
{% endschema %}`;
}

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Build the COLLECTION section ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
function buildCollectionSection(tpl) {
  const colSchema = {
    name: `CF ${tpl.label} Coll`.substring(0,25).trimEnd(),
    settings: [
      {type:"header",content:"Brand Colors"},
      {type:"color",id:"color_accent",label:"Accent Color",default:tpl.accent},
      {type:"color",id:"color_bg",label:"Background",default:tpl.bg},
      {type:"header",content:"Banner"},
      {type:"checkbox",id:"show_banner",label:"Show Collection Banner",default:true},
      {type:"image_picker",id:"banner_image",label:"Banner Background Image"},
      {type:"header",content:"Grid"},
      {type:"range",id:"grid_cols",label:"Products per Row (Desktop)",min:2,max:5,step:1,default:4},
      {type:"range",id:"products_per_page",label:"Products per Page",min:8,max:48,step:4,default:16},
      {type:"header",content:"Filters & Sort"},
      {type:"checkbox",id:"show_sort",label:"Show Sort Dropdown",default:true},
      {type:"checkbox",id:"show_filters",label:"Show Filter Buttons",default:true},
      {type:"header",content:"Cards"},
      {type:"text",id:"atc_text",label:"Add to Cart Text",default:"Add to Cart"},
      {type:"checkbox",id:"show_vendor",label:"Show Vendor",default:true},
      {type:"checkbox",id:"show_compare_price",label:"Show Compare Price",default:true}
    ],
    presets:[{name:`CF ${tpl.label} Coll`.substring(0,25).trimEnd()}]
  };

  return `{% comment %}ConvertFlow: ${tpl.label} ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Collection Page{% endcomment %}
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root { --cf-accent: ${tpl.accent}; --cf-bg: ${tpl.bg}; }
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
body { font-family: 'Inter', sans-serif; background: var(--cf-bg); -webkit-font-smoothing: antialiased; }
.cfcol-banner { background: var(--cf-accent); color: #fff; padding: 60px; text-align: center; }
.cfcol-banner h1 { font-size: 48px; font-weight: 800; margin-bottom: 12px; }
.cfcol-banner p { font-size: 16px; opacity: .7; max-width: 500px; margin: 0 auto; }
.cfcol-count { font-size: 12px; opacity: .6; margin-top: 8px; }
.cfcol-body { max-width: 1300px; margin: 0 auto; padding: 60px; }
.cfcol-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 36px; }
.cfcol-filters { display: flex; gap: 8px; overflow-x: auto; }
.cfcol-filter { padding: 8px 20px; border: 1.5px solid #e5e7eb; background: #fff; font-size: 12px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: all .2s; }
.cfcol-filter:hover, .cfcol-filter.active { background: var(--cf-accent); color: #fff; border-color: var(--cf-accent); }
.cfcol-sort select { border: 1.5px solid #e5e7eb; padding: 8px 16px; font-size: 13px; background: #fff; outline: none; cursor: pointer; font-family: inherit; }
.cfcol-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.cfcol-card { background: #fff; border: 1px solid #e5e7eb; text-decoration: none; color: #1a1a1a; display: block; transition: all .3s; }
.cfcol-card:hover { box-shadow: 0 8px 30px rgba(0,0,0,.08); transform: translateY(-4px); }
.cfcol-img { aspect-ratio: 1; background: #f5f3ef; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
.cfcol-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s; }
.cfcol-card:hover .cfcol-img img { transform: scale(1.05); }
.cfcol-img svg { width: 30%; color: var(--cf-accent); opacity: .25; }
.cfcol-badge { position: absolute; top: 12px; left: 12px; background: var(--cf-accent); color: #fff; padding: 4px 12px; font-size: 9px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
.cfcol-info { padding: 18px; }
.cfcol-vendor { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--cf-accent); margin-bottom: 4px; }
.cfcol-title { font-size: 15px; font-weight: 600; margin-bottom: 10px; line-height: 1.4; }
.cfcol-price { display: flex; align-items: center; gap: 10px; }
.cfcol-price strong { font-size: 18px; font-weight: 700; }
.cfcol-price del { font-size: 13px; color: #aaa; }
.cfcol-atc { display: block; width: calc(100% - 36px); margin: 0 18px 18px; background: var(--cf-accent); color: #fff; border: none; padding: 12px; font-size: 12px; font-weight: 700; cursor: pointer; letter-spacing: .5px; font-family: inherit; transition: opacity .2s; }
.cfcol-atc:hover { opacity: .88; }
.cfcol-empty { text-align: center; padding: 80px 20px; color: #888; }
.cfcol-pagination { display: flex; justify-content: center; gap: 8px; margin-top: 60px; }
.cfcol-page { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border: 1.5px solid #e5e7eb; cursor: pointer; font-size: 14px; font-weight: 600; text-decoration: none; color: #333; transition: all .2s; }
.cfcol-page.active, .cfcol-page:hover { background: var(--cf-accent); color: #fff; border-color: var(--cf-accent); }
@media(max-width:1024px){ .cfcol-grid { grid-template-columns: repeat(2, 1fr); } .cfcol-body { padding: 40px 20px; } .cfcol-banner { padding: 40px 20px; } .cfcol-banner h1 { font-size: 32px; } }
</style>

<div class="cfcol-banner">
  <h1>{{ collection.title }}</h1>
  {% if collection.description != blank %}
    <p>{{ collection.description | strip_html | truncate: 160 }}</p>
  {% endif %}
  <div class="cfcol-count">{{ collection.products_count }} Products</div>
</div>

<div class="cfcol-body">
  <div class="cfcol-toolbar">
    <div class="cfcol-filters">
      <button class="cfcol-filter active">All</button>
      <button class="cfcol-filter">New Arrivals</button>
      <button class="cfcol-filter">Best Sellers</button>
      <button class="cfcol-filter">On Sale</button>
    </div>
    <div class="cfcol-sort">
      <select name="sort_by">
        <option value="featured">Sort: Featured</option>
        <option value="price-ascending">Price: Low to High</option>
        <option value="price-descending">Price: High to Low</option>
        <option value="created-descending">Newest</option>
      </select>
    </div>
  </div>

  {% if collection.products.size > 0 %}
    <div class="cfcol-grid">
      {% for product in collection.products %}
        <a href="{{ product.url }}" class="cfcol-card">
          <div class="cfcol-img">
            {% if product.featured_image %}
              <img src="{{ product.featured_image | image_url: width: 600 }}" alt="{{ product.title }}" loading="lazy">
            {% else %}
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path d="M20 7H4l1 12h14z"/><path d="M8 7V5a4 4 0 018 0v2"/></svg>
            {% endif %}
            {% if product.available == false %}
              <span class="cfcol-badge">Sold Out</span>
            {% elsif product.compare_at_price > product.price %}
              <span class="cfcol-badge">Sale</span>
            {% endif %}
          </div>
          <div class="cfcol-info">
            <div class="cfcol-vendor">{{ product.vendor }}</div>
            <div class="cfcol-title">{{ product.title }}</div>
            <div class="cfcol-price">
              <strong>{{ product.price | money }}</strong>
              {% if product.compare_at_price > product.price %}
                <del>{{ product.compare_at_price | money }}</del>
              {% endif %}
            </div>
          </div>
          <button class="cfcol-atc">Add to Cart</button>
        </a>
      {% endfor %}
    </div>

    {% if paginate.pages > 1 %}
      {% paginate collection.products by 16 %}
        <div class="cfcol-pagination">
          {% for page in (1..paginate.pages) %}
            <a href="{{ paginate | default_pagination | where: 'page', page }}" class="cfcol-page{% if forloop.index == paginate.current_page %} active{% endif %}">{{ page }}</a>
          {% endfor %}
        </div>
      {% endpaginate %}
    {% endif %}
  {% else %}
    <div class="cfcol-empty">No products found in this collection.</div>
  {% endif %}
</div>

{% schema %}
${JSON.stringify(colSchema, null, 2)}
{% endschema %}`;
}

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ MAIN ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
let created = 0;
let skipped = 0;

for (const tpl of TEMPLATES) {
  const htmlPath = path.resolve(`./${tpl.file}`);

  if (!fs.existsSync(htmlPath)) {
    console.warn(`ÃƒÂ¢Ã…Â¡Ã‚Â   Skipping ${tpl.id} ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â ${tpl.file} not found`);
    skipped++;
    continue;
  }

  const html = fs.readFileSync(htmlPath, 'utf-8');

  const pages = [
    { id: 'landing',    content: buildLandingSection(tpl, html) },
    { id: 'product',    content: buildProductSection(tpl) },
    { id: 'cart',       content: buildCartSection(tpl) },
    { id: 'collection', content: buildCollectionSection(tpl) },
  ];

  for (const page of pages) {
    // Always overwrite ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â ensures schema names stay within 25-char Shopify limit
    const dest = path.join(SECTIONS_DIR, `cf-${tpl.id}-${page.id}.liquid`);
    fs.writeFileSync(dest, page.content, 'utf-8');
    console.log(`ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ wrote  cf-${tpl.id}-${page.id}.liquid`);
    created++;
  }
}

console.log(`\nÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ Done ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â ${created} sections created, ${skipped} templates skipped.`);


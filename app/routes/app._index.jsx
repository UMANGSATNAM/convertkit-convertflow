import { json } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { useState } from "react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return json({ ok: true });
};

export default function Index() {
  const [previewMode, setPreviewMode] = useState("desktop");
  const [showSuccess, setShowSuccess] = useState(false);

  const viewportWidth = { desktop: "100%", tablet: "768px", mobile: "375px" }[previewMode];

  // Full static HTML preview of the Pilgrim landing page
  const previewHTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'DM Sans', sans-serif; color: #1a1a1a; line-height: 1.6; -webkit-font-smoothing: antialiased; overflow-x: hidden; }

/* Announcement */
.cf-announce { background: #2D2D2D; color: #fff; text-align: center; padding: 10px 16px; font-size: 13px; font-weight: 500; letter-spacing: 0.5px; display: flex; align-items: center; justify-content: center; gap: 8px; }
.cf-announce a { color: #FFD700; text-decoration: underline; font-weight: 600; }

/* Hero */
.cf-hero { position: relative; width: 100%; min-height: 520px; background: linear-gradient(135deg, #FFF5EE 0%, #FAEBD7 50%, #FFE4C4 100%); display: flex; align-items: center; }
.cf-hero-inner { max-width: 1280px; margin: 0 auto; padding: 60px 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; width: 100%; }
.cf-hero-badge { display: inline-block; background: #D4A574; color: #fff; padding: 6px 16px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 16px; }
.cf-hero h1 { font-size: 44px; font-weight: 800; line-height: 1.15; margin-bottom: 16px; letter-spacing: -0.5px; }
.cf-hero h1 span { color: #C17F5E; }
.cf-hero-sub { font-size: 16px; color: #555; margin-bottom: 28px; max-width: 440px; line-height: 1.7; }
.cf-hero-cta { display: inline-flex; align-items: center; gap: 10px; background: #1a1a1a; color: #fff; padding: 16px 36px; border-radius: 50px; font-size: 15px; font-weight: 700; text-decoration: none; transition: all 0.3s ease; cursor: pointer; letter-spacing: 0.5px; }
.cf-hero-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.15); }
.cf-hero-img-wrap { position: relative; display: flex; justify-content: center; align-items: center; }
.cf-hero-visual { width: 100%; max-width: 460px; aspect-ratio: 4/5; background: linear-gradient(135deg, #f0e6da, #e8d5c4); border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 64px; }
.cf-hero-float { position: absolute; background: #fff; border-radius: 16px; padding: 14px 20px; box-shadow: 0 8px 30px rgba(0,0,0,0.08); font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 10px; animation: cf-float 3s ease-in-out infinite; }
.cf-hero-float.top-right { top: 20px; right: -10px; }
.cf-hero-float.bottom-left { bottom: 30px; left: -10px; }
.cf-hero-float .cf-label { font-size: 11px; color: #999; }
.cf-hero-float .cf-val { font-weight: 800; }
@keyframes cf-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }

/* Trust */
.cf-trust-bar { background: #FAF7F2; border-top: 1px solid rgba(0,0,0,0.05); border-bottom: 1px solid rgba(0,0,0,0.05); padding: 18px 20px; }
.cf-trust-inner { max-width: 1280px; margin: 0 auto; display: flex; justify-content: space-around; align-items: center; flex-wrap: wrap; gap: 12px; }
.cf-trust-item { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 600; color: #333; }

/* Section heads */
.cf-section-head { text-align: center; margin-bottom: 48px; }
.cf-overline { font-size: 12px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #C17F5E; margin-bottom: 12px; display: block; }
.cf-section-head h2 { font-size: 34px; font-weight: 800; margin-bottom: 12px; letter-spacing: -0.3px; }
.cf-section-head p { font-size: 15px; color: #777; max-width: 560px; margin: 0 auto; }

/* Categories */
.cf-categories { padding: 70px 40px; max-width: 1280px; margin: 0 auto; }
.cf-cat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.cf-cat-card { position: relative; border-radius: 16px; overflow: hidden; aspect-ratio: 3/4; cursor: pointer; text-decoration: none; color: #fff; display: block; }
.cf-cat-visual { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 48px; transition: transform 0.6s ease; }
.cf-cat-card:hover .cf-cat-visual { transform: scale(1.05); }
.cf-cat-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%); display: flex; flex-direction: column; justify-content: flex-end; padding: 24px; }
.cf-cat-overlay h3 { font-size: 20px; font-weight: 700; margin-bottom: 2px; }
.cf-cat-overlay span { font-size: 12px; opacity: 0.85; }

/* Products */
.cf-products { padding: 70px 40px; background: #fff; }
.cf-products-inner { max-width: 1280px; margin: 0 auto; }
.cf-prod-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.cf-prod-card { background: #fff; border-radius: 16px; overflow: hidden; border: 1px solid #f0ebe5; transition: all 0.3s ease; text-decoration: none; color: #1a1a1a; display: block; }
.cf-prod-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
.cf-prod-img { position: relative; aspect-ratio: 1; overflow: hidden; background: #faf7f2; display: flex; align-items: center; justify-content: center; font-size: 40px; }
.cf-prod-badge { position: absolute; top: 12px; left: 12px; color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 10px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; }
.cf-prod-badge.best { background: #E67E22; }
.cf-prod-badge.new { background: #2ECC71; }
.cf-prod-badge.hot { background: #E74C3C; }
.cf-prod-info { padding: 18px; }
.cf-prod-name { font-size: 14px; font-weight: 600; line-height: 1.4; margin-bottom: 6px; }
.cf-prod-rating { display: flex; align-items: center; gap: 4px; margin-bottom: 8px; font-size: 12px; color: #999; }
.cf-prod-stars { color: #F5A623; font-size: 13px; }
.cf-prod-price { display: flex; align-items: center; gap: 8px; }
.cf-current { font-size: 18px; font-weight: 800; }
.cf-original { font-size: 14px; color: #aaa; text-decoration: line-through; }
.cf-discount { font-size: 12px; font-weight: 700; color: #27ae60; }
.cf-prod-atc { display: block; width: 100%; margin-top: 14px; padding: 11px; background: #1a1a1a; color: #fff; border: none; border-radius: 10px; font-size: 12px; font-weight: 700; cursor: pointer; letter-spacing: 0.5px; }

/* Ingredients */
.cf-ingredients { padding: 70px 40px; background: #FFF9F4; }
.cf-ingredients-inner { max-width: 1280px; margin: 0 auto; }
.cf-ingr-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; }
.cf-ingr-card { text-align: center; padding: 24px 12px; background: #fff; border-radius: 16px; border: 1px solid #f0ebe5; transition: all 0.3s ease; cursor: pointer; }
.cf-ingr-card:hover { transform: translateY(-4px); box-shadow: 0 10px 30px rgba(0,0,0,0.06); border-color: #C17F5E; }
.cf-ingr-icon { width: 56px; height: 56px; border-radius: 50%; background: #FFF0E5; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; font-size: 24px; }
.cf-ingr-card h4 { font-size: 13px; font-weight: 700; margin-bottom: 2px; }
.cf-ingr-card p { font-size: 11px; color: #888; }

/* Story */
.cf-story { padding: 90px 40px; background: linear-gradient(135deg, #1a1a1a, #2d2d2d); color: #fff; }
.cf-story-inner { max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
.cf-story-overline { font-size: 12px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #C17F5E; margin-bottom: 16px; display: block; }
.cf-story h2 { font-size: 36px; font-weight: 800; margin-bottom: 20px; line-height: 1.2; }
.cf-story p { font-size: 15px; line-height: 1.8; color: rgba(255,255,255,0.7); margin-bottom: 32px; }
.cf-story-stats { display: flex; gap: 40px; }
.cf-story-stat h3 { font-size: 30px; font-weight: 800; color: #C17F5E; }
.cf-story-stat span { font-size: 12px; color: rgba(255,255,255,0.5); }
.cf-story-visual { width: 100%; aspect-ratio: 4/3; background: linear-gradient(135deg, #3a3a3a, #555); border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 64px; }

/* Reviews */
.cf-reviews { padding: 70px 40px; background: #fff; }
.cf-reviews-inner { max-width: 1280px; margin: 0 auto; }
.cf-rev-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.cf-rev-card { background: #FAF7F2; border-radius: 16px; padding: 28px; border: 1px solid #f0ebe5; }
.cf-rev-stars { color: #F5A623; font-size: 15px; margin-bottom: 14px; letter-spacing: 2px; }
.cf-rev-text { font-size: 14px; color: #444; line-height: 1.7; margin-bottom: 18px; font-style: italic; }
.cf-rev-author { display: flex; align-items: center; gap: 12px; }
.cf-rev-avatar { width: 40px; height: 40px; border-radius: 50%; background: #C17F5E; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 15px; }
.cf-rev-name { font-size: 13px; font-weight: 700; }
.cf-rev-verified { font-size: 11px; color: #27ae60; }

/* Newsletter */
.cf-newsletter { padding: 70px 40px; background: #FFF5EE; text-align: center; }
.cf-newsletter-inner { max-width: 520px; margin: 0 auto; }
.cf-newsletter h2 { font-size: 30px; font-weight: 800; margin-bottom: 10px; }
.cf-newsletter p { font-size: 14px; color: #777; margin-bottom: 24px; }
.cf-newsletter-form { display: flex; gap: 10px; }
.cf-newsletter-input { flex: 1; padding: 14px 18px; border: 2px solid #e0d5c9; border-radius: 50px; font-size: 13px; outline: none; background: #fff; }
.cf-newsletter-btn { padding: 14px 28px; background: #1a1a1a; color: #fff; border: none; border-radius: 50px; font-size: 13px; font-weight: 700; cursor: pointer; white-space: nowrap; }

/* Footer */
.cf-footer { background: #1a1a1a; color: #bbb; padding: 50px 40px 24px; }
.cf-footer-inner { max-width: 1280px; margin: 0 auto; }
.cf-footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 32px; margin-bottom: 32px; }
.cf-footer-brand h3 { font-size: 22px; font-weight: 800; color: #fff; margin-bottom: 10px; }
.cf-footer-brand p { font-size: 12px; line-height: 1.7; color: #888; }
.cf-footer h4 { font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 14px; }
.cf-footer ul { list-style: none; }
.cf-footer li { margin-bottom: 8px; }
.cf-footer a { color: #888; text-decoration: none; font-size: 12px; }
.cf-footer a:hover { color: #C17F5E; }
.cf-footer-bottom { border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px; display: flex; justify-content: space-between; font-size: 11px; color: #666; }

@media (max-width: 768px) {
  .cf-hero-inner { grid-template-columns: 1fr; padding: 30px 16px; }
  .cf-hero h1 { font-size: 28px; }
  .cf-hero-img-wrap { display: none; }
  .cf-cat-grid, .cf-prod-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .cf-ingr-grid { grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .cf-story-inner { grid-template-columns: 1fr; gap: 30px; }
  .cf-rev-grid { grid-template-columns: 1fr; }
  .cf-footer-grid { grid-template-columns: 1fr 1fr; }
  .cf-newsletter-form { flex-direction: column; }
  .cf-categories, .cf-products, .cf-ingredients, .cf-story, .cf-reviews, .cf-newsletter { padding: 40px 16px; }
}
</style>
</head>
<body>
  <!-- Announcement -->
  <div class="cf-announce">
    <span>🎉</span>
    <span>FLAT 20% OFF on your first order</span>
    <a href="#">Shop Now →</a>
  </div>

  <!-- Hero -->
  <div class="cf-hero">
    <div class="cf-hero-inner">
      <div>
        <span class="cf-hero-badge">NEW COLLECTION</span>
        <h1>Discover Your<br><span>Natural Glow</span></h1>
        <p class="cf-hero-sub">Premium skincare powered by ancient beauty secrets from around the world. Vegan, cruelty-free, and FDA approved.</p>
        <a href="#" class="cf-hero-cta">Explore Collection →</a>
      </div>
      <div class="cf-hero-img-wrap">
        <div class="cf-hero-visual">🌿</div>
        <div class="cf-hero-float top-right">
          <span style="font-size:20px">✨</span>
          <div><div class="cf-label">Rating</div><div class="cf-val">4.9 / 5.0</div></div>
        </div>
        <div class="cf-hero-float bottom-left">
          <span style="font-size:20px">🧴</span>
          <div><div class="cf-label">Products</div><div class="cf-val">200+ SKUs</div></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Trust -->
  <div class="cf-trust-bar">
    <div class="cf-trust-inner">
      <div class="cf-trust-item"><span style="font-size:18px">🚚</span> Free Shipping above ₹499</div>
      <div class="cf-trust-item"><span style="font-size:18px">🐰</span> Cruelty Free</div>
      <div class="cf-trust-item"><span style="font-size:18px">🌱</span> 100% Vegan</div>
      <div class="cf-trust-item"><span style="font-size:18px">✅</span> FDA Approved</div>
      <div class="cf-trust-item"><span style="font-size:18px">🔬</span> Dermat Tested</div>
    </div>
  </div>

  <!-- Categories -->
  <div class="cf-categories">
    <div class="cf-section-head">
      <span class="cf-overline">Explore</span>
      <h2>Shop by Category</h2>
      <p>Find the perfect products for your beauty routine</p>
    </div>
    <div class="cf-cat-grid">
      <a href="#" class="cf-cat-card"><div class="cf-cat-visual" style="background:linear-gradient(135deg,#FADADD,#F8C8DC)">🌸</div><div class="cf-cat-overlay"><h3>Skin Care</h3><span>45+ Products</span></div></a>
      <a href="#" class="cf-cat-card"><div class="cf-cat-visual" style="background:linear-gradient(135deg,#E8D5B7,#C9A96E)">💇‍♀️</div><div class="cf-cat-overlay"><h3>Hair Care</h3><span>35+ Products</span></div></a>
      <a href="#" class="cf-cat-card"><div class="cf-cat-visual" style="background:linear-gradient(135deg,#FFD1DC,#FF9EBA)">💄</div><div class="cf-cat-overlay"><h3>Makeup</h3><span>30+ Products</span></div></a>
      <a href="#" class="cf-cat-card"><div class="cf-cat-visual" style="background:linear-gradient(135deg,#E6E0F8,#D4C5F9)">🌺</div><div class="cf-cat-overlay"><h3>Fragrances</h3><span>20+ Products</span></div></a>
    </div>
  </div>

  <!-- Products -->
  <div class="cf-products">
    <div class="cf-products-inner">
      <div class="cf-section-head">
        <span class="cf-overline">Most Loved</span>
        <h2>Bestselling Products</h2>
        <p>Trusted by 5 million+ customers across India</p>
      </div>
      <div class="cf-prod-grid">
        <a href="#" class="cf-prod-card">
          <div class="cf-prod-img">🧴<span class="cf-prod-badge best">BESTSELLER</span></div>
          <div class="cf-prod-info"><div class="cf-prod-name">10% Vitamin C Face Serum</div><div class="cf-prod-rating"><span class="cf-prod-stars">★★★★★</span><span>4,523</span></div><div class="cf-prod-price"><span class="cf-current">₹599</span><span class="cf-original">₹799</span><span class="cf-discount">25% OFF</span></div><button class="cf-prod-atc">ADD TO CART</button></div>
        </a>
        <a href="#" class="cf-prod-card">
          <div class="cf-prod-img">💧<span class="cf-prod-badge new">TRENDING</span></div>
          <div class="cf-prod-info"><div class="cf-prod-name">Korean Rice Water Moisturizer</div><div class="cf-prod-rating"><span class="cf-prod-stars">★★★★★</span><span>3,182</span></div><div class="cf-prod-price"><span class="cf-current">₹499</span><span class="cf-original">₹699</span><span class="cf-discount">29% OFF</span></div><button class="cf-prod-atc">ADD TO CART</button></div>
        </a>
        <a href="#" class="cf-prod-card">
          <div class="cf-prod-img">💆‍♀️<span class="cf-prod-badge best">BESTSELLER</span></div>
          <div class="cf-prod-info"><div class="cf-prod-name">Redensyl Hair Growth Serum</div><div class="cf-prod-rating"><span class="cf-prod-stars">★★★★★</span><span>5,847</span></div><div class="cf-prod-price"><span class="cf-current">₹699</span><span class="cf-original">₹899</span><span class="cf-discount">22% OFF</span></div><button class="cf-prod-atc">ADD TO CART</button></div>
        </a>
        <a href="#" class="cf-prod-card">
          <div class="cf-prod-img">🧪<span class="cf-prod-badge hot">HOT</span></div>
          <div class="cf-prod-info"><div class="cf-prod-name">25% AHA BHA Peeling Solution</div><div class="cf-prod-rating"><span class="cf-prod-stars">★★★★★</span><span>2,156</span></div><div class="cf-prod-price"><span class="cf-current">₹549</span><span class="cf-original">₹749</span><span class="cf-discount">27% OFF</span></div><button class="cf-prod-atc">ADD TO CART</button></div>
        </a>
      </div>
    </div>
  </div>

  <!-- Ingredients -->
  <div class="cf-ingredients">
    <div class="cf-ingredients-inner">
      <div class="cf-section-head">
        <span class="cf-overline">Powered By Science</span>
        <h2>Shop by Ingredients</h2>
        <p>Clinically proven ingredients for visible results</p>
      </div>
      <div class="cf-ingr-grid">
        <div class="cf-ingr-card"><div class="cf-ingr-icon">🍊</div><h4>Vitamin C</h4><p>Brightening & Glow</p></div>
        <div class="cf-ingr-card"><div class="cf-ingr-icon">💧</div><h4>Hyaluronic Acid</h4><p>Deep Hydration</p></div>
        <div class="cf-ingr-card"><div class="cf-ingr-icon">✨</div><h4>Niacinamide</h4><p>Acne & Oil Control</p></div>
        <div class="cf-ingr-card"><div class="cf-ingr-icon">🔬</div><h4>Retinol</h4><p>Anti-Ageing</p></div>
        <div class="cf-ingr-card"><div class="cf-ingr-icon">🧪</div><h4>Salicylic Acid</h4><p>Pore Cleansing</p></div>
        <div class="cf-ingr-card"><div class="cf-ingr-icon">🛡️</div><h4>Ceramides</h4><p>Skin Barrier</p></div>
      </div>
    </div>
  </div>

  <!-- Story -->
  <div class="cf-story">
    <div class="cf-story-inner">
      <div>
        <span class="cf-story-overline">Our Story</span>
        <h2>Beauty Secrets From Around The World</h2>
        <p>We travel the globe to discover the most powerful natural ingredients and bring them to you in beautifully crafted formulations. No harmful chemicals, no animal testing — just pure, effective skincare.</p>
        <div class="cf-story-stats">
          <div class="cf-story-stat"><h3>5M+</h3><span>Happy Customers</span></div>
          <div class="cf-story-stat"><h3>200+</h3><span>Products</span></div>
          <div class="cf-story-stat"><h3>50+</h3><span>Active Ingredients</span></div>
        </div>
      </div>
      <div class="cf-story-visual">🌍</div>
    </div>
  </div>

  <!-- Reviews -->
  <div class="cf-reviews">
    <div class="cf-reviews-inner">
      <div class="cf-section-head">
        <span class="cf-overline">Real Results</span>
        <h2>What Our Customers Say</h2>
      </div>
      <div class="cf-rev-grid">
        <div class="cf-rev-card"><div class="cf-rev-stars">★★★★★</div><p class="cf-rev-text">"The Vitamin C serum gave me visible results in just 2 weeks. My skin looks so much brighter and smoother now!"</p><div class="cf-rev-author"><div class="cf-rev-avatar">P</div><div><div class="cf-rev-name">Priya S.</div><div class="cf-rev-verified">✓ Verified Purchase</div></div></div></div>
        <div class="cf-rev-card"><div class="cf-rev-stars">★★★★★</div><p class="cf-rev-text">"Been using the Rice Water Moisturizer for a month. My dry patches are completely gone. Best moisturizer I have ever used!"</p><div class="cf-rev-author"><div class="cf-rev-avatar">A</div><div><div class="cf-rev-name">Ananya K.</div><div class="cf-rev-verified">✓ Verified Purchase</div></div></div></div>
        <div class="cf-rev-card"><div class="cf-rev-stars">★★★★★</div><p class="cf-rev-text">"The Hair Growth Serum actually works! I noticed reduced hair fall within 3 weeks. Highly recommend to everyone."</p><div class="cf-rev-author"><div class="cf-rev-avatar">M</div><div><div class="cf-rev-name">Meera R.</div><div class="cf-rev-verified">✓ Verified Purchase</div></div></div></div>
      </div>
    </div>
  </div>

  <!-- Newsletter -->
  <div class="cf-newsletter">
    <div class="cf-newsletter-inner">
      <h2>Join the Glow Club</h2>
      <p>Get 15% OFF your first order + exclusive access to new launches, beauty tips, and member-only offers.</p>
      <div class="cf-newsletter-form"><input type="email" class="cf-newsletter-input" placeholder="Enter your email address"><button class="cf-newsletter-btn">Subscribe</button></div>
    </div>
  </div>

  <!-- Footer -->
  <div class="cf-footer">
    <div class="cf-footer-inner">
      <div class="cf-footer-grid">
        <div class="cf-footer-brand"><h3>Your Brand</h3><p>Premium beauty brand bringing the best of global beauty secrets to your doorstep. Cruelty-free, vegan, and FDA approved.</p></div>
        <div><h4>Quick Links</h4><ul><li><a href="#">All Products</a></li><li><a href="#">Bestsellers</a></li><li><a href="#">About Us</a></li><li><a href="#">Contact</a></li></ul></div>
        <div><h4>Help</h4><ul><li><a href="#">Shipping Info</a></li><li><a href="#">Returns</a></li><li><a href="#">FAQs</a></li><li><a href="#">Track Order</a></li></ul></div>
        <div><h4>Connect</h4><ul><li><a href="#">Instagram</a></li><li><a href="#">Facebook</a></li><li><a href="#">YouTube</a></li><li><a href="#">Twitter</a></li></ul></div>
      </div>
      <div class="cf-footer-bottom"><span>© 2026 Your Brand. All rights reserved.</span><span>Powered by ConvertFlow</span></div>
    </div>
  </div>
</body>
</html>`;

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
          <span style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a" }}>⚡ ConvertFlow</span>
          <span style={{ fontSize: 13, color: "#888", borderLeft: "1px solid #ddd", paddingLeft: 16 }}>
            Landing Page Templates
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
              }}
            >
              {v === "desktop" ? "🖥 Desktop" : v === "tablet" ? "📱 Tablet" : "📲 Mobile"}
            </button>
          ))}
        </div>
      </div>

      {/* Template Info + Preview */}
      <div style={{ padding: "24px", maxWidth: 1400, margin: "0 auto" }}>
        {/* Template Info Card */}
        <div style={{
          background: "#fff",
          borderRadius: 16,
          padding: "24px 28px",
          marginBottom: 20,
          border: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 28 }}>🌿</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a" }}>Pilgrim-Style Beauty Landing Page</span>
              <span style={{
                background: "#FFF0E5",
                color: "#C17F5E",
                padding: "4px 12px",
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 700,
              }}>BEAUTY & SKINCARE</span>
            </div>
            <p style={{ fontSize: 14, color: "#777", maxWidth: 600 }}>
              Premium beauty/skincare landing page with hero banner, trust badges, category grid,
              bestseller products, ingredient cards, brand story, testimonials, and newsletter.
              Fully customizable via Shopify Theme Editor.
            </p>
          </div>
          <button
            onClick={() => setShowSuccess(true)}
            style={{
              background: "linear-gradient(135deg, #C17F5E, #A0634B)",
              color: "#fff",
              border: "none",
              padding: "16px 36px",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 15px rgba(193,127,94,0.3)",
            }}
          >
            🚀 Inject to Theme
          </button>
        </div>

        {/* Success Toast */}
        {showSuccess && (
          <div style={{
            background: "#065F46",
            color: "#fff",
            padding: "16px 24px",
            borderRadius: 12,
            marginBottom: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 14,
            fontWeight: 600,
          }}>
            <span>✅ Template section has been added to your theme! Go to Online Store → Customize to configure it.</span>
            <button onClick={() => setShowSuccess(false)} style={{ background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer" }}>✕</button>
          </div>
        )}

        {/* Live Preview */}
        <div style={{
          background: "#fff",
          borderRadius: 16,
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        }}>
          <div style={{
            background: "#fafafa",
            borderBottom: "1px solid #e5e7eb",
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F56" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FFBD2E" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#27C93F" }} />
            <span style={{ marginLeft: 16, fontSize: 12, color: "#999" }}>Live Preview</span>
          </div>
          <div style={{
            display: "flex",
            justifyContent: "center",
            background: previewMode !== "desktop" ? "#e5e7eb" : "transparent",
            padding: previewMode !== "desktop" ? "20px" : 0,
            transition: "all 0.3s ease",
          }}>
            <iframe
              srcDoc={previewHTML}
              style={{
                width: viewportWidth,
                maxWidth: "100%",
                height: "80vh",
                border: "none",
                borderRadius: previewMode !== "desktop" ? "12px" : 0,
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

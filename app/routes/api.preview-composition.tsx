import { type LoaderFunctionArgs } from "@remix-run/node";
import { COMPOSITIONS } from "../data/page-compositions";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const id = url.searchParams.get("id") || "streetwear-cyber-home";
  const comp = COMPOSITIONS.find(c => c.id === id) || COMPOSITIONS[0];

  const html = generateInstantD2CPreview(comp);

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};

function generateInstantD2CPreview(comp: any): string {
  const niche = comp.niche || "clothing";
  const accent = comp.accentColor || "#f59e0b";
  const name = comp.name || "D2C Brand";
  const badge = comp.styleBadge || "Official Store";

  // Niche-specific font & theme settings
  const fontLink =
    niche === "clothing"
      ? '<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&family=Syne:wght@700;800&display=swap" rel="stylesheet">'
      : niche === "beauty"
      ? '<link href="https://fonts.googleapis.com/css2?family=Italiana&family=Plus+Jakarta+Sans:wght@400;500;700&display=swap" rel="stylesheet">'
      : niche === "jewellery"
      ? '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400&family=Inter:wght@400;600&display=swap" rel="stylesheet">'
      : '<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;600&display=swap" rel="stylesheet">';

  const headingFont =
    niche === "clothing"
      ? "'Syne', sans-serif"
      : niche === "beauty"
      ? "'Italiana', serif"
      : niche === "jewellery"
      ? "'Cormorant Garamond', serif"
      : "'Space Grotesk', sans-serif";

  const bodyFont = "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif";

  const isDark = niche === "clothing" || niche === "tech";
  const bg = isDark ? "#09090b" : "#fdfbf7";
  const cardBg = isDark ? "#18181b" : "#ffffff";
  const textPrimary = isDark ? "#f8fafc" : "#1e293b";
  const textSecondary = isDark ? "#94a3b8" : "#64748b";
  const borderCol = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";

  // Product datasets per niche
  const products = getProductsForNiche(niche);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} · Live Store Preview</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  ${fontLink}
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: ${bg};
      color: ${textPrimary};
      font-family: ${bodyFont};
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }
    h1, h2, h3, h4, .font-heading { font-family: ${headingFont}; }
    a { color: inherit; text-decoration: none; }
    img { max-width: 100%; height: auto; display: block; }

    .accent-color { color: ${accent}; }
    .accent-bg { background-color: ${accent}; color: #fff; }
    .container { max-width: 1240px; margin: 0 auto; padding: 0 20px; }

    /* Section 1: Announcement Bar */
    .announcement-bar {
      background: ${accent};
      color: #ffffff;
      padding: 10px 16px;
      font-size: 13px;
      font-weight: 700;
      text-align: center;
      letter-spacing: 0.5px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 12px;
    }
    .announcement-badge {
      background: rgba(0,0,0,0.25);
      padding: 2px 8px;
      border-radius: 99px;
      font-size: 11px;
      text-transform: uppercase;
    }

    /* Section 2: Header Chrome */
    .site-header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: ${isDark ? "rgba(9,9,11,0.85)" : "rgba(253,251,247,0.85)"};
      backdrop-filter: blur(12px);
      border-bottom: 1px solid ${borderCol};
      padding: 18px 0;
    }
    .nav-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .site-logo {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.5px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .nav-links {
      display: flex;
      gap: 28px;
      font-size: 14px;
      font-weight: 600;
    }
    .nav-actions {
      display: flex;
      gap: 18px;
      align-items: center;
      font-size: 14px;
      font-weight: 600;
    }
    .cart-btn {
      background: ${accent};
      color: #fff;
      padding: 8px 16px;
      border-radius: 99px;
      font-size: 13px;
      font-weight: 700;
    }

    /* Section 3: Marquee Ticker */
    .marquee-strip {
      background: ${isDark ? "#18181b" : "#f1f5f9"};
      overflow: hidden;
      white-space: nowrap;
      padding: 12px 0;
      border-bottom: 1px solid ${borderCol};
    }
    .marquee-content {
      display: inline-block;
      animation: marquee 22s linear infinite;
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .marquee-item { margin: 0 24px; }
    @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

    /* Section 4: Hero Section */
    .hero-section {
      padding: 70px 0 60px;
      position: relative;
      overflow: hidden;
    }
    .hero-grid {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 50px;
      align-items: center;
    }
    .hero-tag {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"};
      border: 1px solid ${borderCol};
      border-radius: 99px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 20px;
      color: ${accent};
    }
    .hero-title {
      font-size: clamp(38px, 5vw, 62px);
      line-height: 1.08;
      font-weight: 800;
      margin-bottom: 20px;
      letter-spacing: -1px;
    }
    .hero-desc {
      font-size: 17px;
      line-height: 1.6;
      color: ${textSecondary};
      margin-bottom: 32px;
      max-width: 500px;
    }
    .hero-cta-group {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }
    .btn-primary {
      background: ${accent};
      color: #fff;
      padding: 16px 36px;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 10px 25px -5px ${accent}66;
      transition: transform 0.2s ease;
    }
    .btn-primary:hover { transform: translateY(-2px); }
    .btn-secondary {
      background: transparent;
      border: 1px solid ${borderCol};
      color: ${textPrimary};
      padding: 15px 30px;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 600;
    }
    .hero-media {
      position: relative;
      border-radius: 24px;
      overflow: hidden;
      background: ${cardBg};
      border: 1px solid ${borderCol};
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
    }
    .hero-img {
      width: 100%;
      height: 480px;
      object-fit: cover;
    }

    /* Section 5: Trust Badges Bar */
    .trust-strip {
      padding: 36px 0;
      border-top: 1px solid ${borderCol};
      border-bottom: 1px solid ${borderCol};
      background: ${isDark ? "#121215" : "#f8fafc"};
    }
    .trust-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
      text-align: center;
    }
    .trust-item h4 { font-size: 15px; font-weight: 700; margin-bottom: 4px; }
    .trust-item p { font-size: 12px; color: ${textSecondary}; }

    /* Section 6: Category Tiles */
    .category-section { padding: 80px 0; }
    .section-head { text-align: center; margin-bottom: 48px; }
    .section-sub { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: ${accent}; margin-bottom: 8px; }
    .section-title { font-size: 34px; font-weight: 800; letter-spacing: -0.5px; }

    .category-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }
    .category-card {
      position: relative;
      border-radius: 20px;
      overflow: hidden;
      height: 320px;
      border: 1px solid ${borderCol};
      cursor: pointer;
    }
    .category-card img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
    .category-card:hover img { transform: scale(1.05); }
    .category-card-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 60%);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 24px;
      color: #fff;
    }
    .category-card-title { font-size: 22px; font-weight: 700; margin-bottom: 4px; }
    .category-card-count { font-size: 13px; opacity: 0.8; }

    /* Section 7: Bestsellers Product Grid */
    .product-section { padding: 80px 0; background: ${isDark ? "#0f0f12" : "#fafafa"}; }
    .product-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
    }
    .product-card {
      background: ${cardBg};
      border-radius: 18px;
      overflow: hidden;
      border: 1px solid ${borderCol};
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      display: flex;
      flex-direction: column;
    }
    .product-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
    }
    .product-thumb {
      position: relative;
      aspect-ratio: 1;
      overflow: hidden;
      background: ${isDark ? "#27272a" : "#f1f5f9"};
    }
    .product-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .product-pill {
      position: absolute;
      top: 12px;
      left: 12px;
      background: ${accent};
      color: #fff;
      font-size: 10px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 6px;
      text-transform: uppercase;
    }
    .product-info { padding: 18px; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; }
    .product-name { font-size: 15px; font-weight: 700; margin-bottom: 6px; }
    .product-stars { color: #f59e0b; font-size: 12px; margin-bottom: 10px; display: flex; align-items: center; gap: 4px; }
    .product-price-row { display: flex; justify-content: space-between; align-items: center; }
    .product-price { font-size: 17px; font-weight: 800; }
    .product-atc {
      background: ${isDark ? "#27272a" : "#e2e8f0"};
      color: ${textPrimary};
      border: none;
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
    }
    .product-atc:hover { background: ${accent}; color: #fff; }

    /* Section 8: Shoppable UGC / Reels */
    .ugc-section { padding: 80px 0; }
    .ugc-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
    .ugc-card {
      position: relative;
      aspect-ratio: 9/16;
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid ${borderCol};
    }
    .ugc-card img { width: 100%; height: 100%; object-fit: cover; }
    .ugc-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 16px;
      color: #fff;
    }
    .ugc-handle { font-size: 12px; font-weight: 700; color: ${accent}; margin-bottom: 4px; }
    .ugc-caption { font-size: 13px; font-weight: 600; line-height: 1.3; }

    /* Section 9: Brand Story Showcase */
    .story-section { padding: 80px 0; background: ${isDark ? "#121215" : "#f1f5f9"}; }
    .story-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
    .story-img-box { border-radius: 24px; overflow: hidden; height: 420px; border: 1px solid ${borderCol}; }
    .story-img-box img { width: 100%; height: 100%; object-fit: cover; }

    /* Section 10: Customer Reviews Slider */
    .reviews-section { padding: 80px 0; }
    .reviews-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
    .review-card {
      background: ${cardBg};
      padding: 28px;
      border-radius: 20px;
      border: 1px solid ${borderCol};
    }
    .review-stars { color: #f59e0b; margin-bottom: 14px; }
    .review-text { font-size: 14px; line-height: 1.6; color: ${textSecondary}; margin-bottom: 18px; }
    .review-author { font-size: 14px; font-weight: 700; }
    .review-verified { font-size: 11px; color: #10b981; font-weight: 600; }

    /* Section 11: FAQ Accordion */
    .faq-section { padding: 80px 0; background: ${isDark ? "#0f0f12" : "#fafafa"}; }
    .faq-wrap { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 14px; }
    .faq-item {
      background: ${cardBg};
      border: 1px solid ${borderCol};
      border-radius: 14px;
      padding: 20px 24px;
    }
    .faq-q { font-size: 16px; font-weight: 700; margin-bottom: 8px; display: flex; justify-content: space-between; }
    .faq-a { font-size: 14px; color: ${textSecondary}; line-height: 1.6; }

    /* Section 12: VIP Newsletter Banner */
    .newsletter-section { padding: 80px 0; text-align: center; }
    .newsletter-box {
      max-width: 720px;
      margin: 0 auto;
      background: ${cardBg};
      padding: 50px 30px;
      border-radius: 28px;
      border: 1px solid ${borderCol};
      box-shadow: 0 20px 35px -10px rgba(0,0,0,0.15);
    }
    .newsletter-form { display: flex; gap: 12px; max-width: 460px; margin: 24px auto 0; }
    .newsletter-input {
      flex: 1;
      padding: 14px 18px;
      border-radius: 12px;
      border: 1px solid ${borderCol};
      background: ${isDark ? "#27272a" : "#fff"};
      color: ${textPrimary};
      font-size: 14px;
    }

    /* Section 13: Mega Footer */
    .site-footer {
      background: ${isDark ? "#050507" : "#0f172a"};
      color: #94a3b8;
      padding: 70px 0 30px;
      border-top: 1px solid ${borderCol};
    }
    .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 50px; }
    .footer-title { color: #fff; font-size: 15px; font-weight: 700; margin-bottom: 18px; }
    .footer-links { list-style: none; display: flex; flex-direction: column; gap: 12px; font-size: 14px; }
    .footer-bottom { border-top: 1px solid rgba(255,255,255,0.08); padding-top: 24px; text-align: center; font-size: 13px; }

    @media (max-width: 900px) {
      .hero-grid, .story-grid, .footer-grid { grid-template-columns: 1fr; gap: 36px; }
      .product-grid, .trust-grid, .ugc-grid, .category-grid, .reviews-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
    }
    @media (max-width: 600px) {
      .product-grid, .trust-grid, .ugc-grid { grid-template-columns: 1fr; }
      .nav-links { display: none; }
    }
  </style>
</head>
<body>

  <!-- Section 1: Top Announcement Bar -->
  <div class="announcement-bar">
    <span class="announcement-badge">${badge}</span>
    <span>⚡ FREE EXPRESS SHIPPING ON ALL ORDERS ABOVE $75 · USE CODE <strong>${niche.toUpperCase()}20</strong></span>
  </div>

  <!-- Section 2: Header Chrome -->
  <header class="site-header">
    <div class="container nav-row">
      <div class="site-logo">
        <span style="display:inline-block; width:12px; height:12px; border-radius:50%; background:${accent};"></span>
        <span>${name}</span>
      </div>
      <nav class="nav-links">
        <a href="#bestsellers">Bestsellers</a>
        <a href="#categories">Collections</a>
        <a href="#story">Our Story</a>
        <a href="#reviews">Reviews</a>
        <a href="#faq">FAQ</a>
      </nav>
      <div class="nav-actions">
        <span>🔍 Search</span>
        <a href="#cart" class="cart-btn">Cart (0)</a>
      </div>
    </div>
  </header>

  <!-- Section 3: Infinite Marquee Strip -->
  <div class="marquee-strip">
    <div class="marquee-content">
      <span class="marquee-item">✦ 100% SATISFACTION GUARANTEED</span>
      <span class="marquee-item">✦ 30-DAY HASSLE-FREE RETURNS</span>
      <span class="marquee-item">✦ ETHICALLY CRAFTED & TESTED</span>
      <span class="marquee-item">✦ OVER 100,000+ HAPPY CUSTOMERS</span>
      <span class="marquee-item">✦ 100% SATISFACTION GUARANTEED</span>
      <span class="marquee-item">✦ 30-DAY HASSLE-FREE RETURNS</span>
      <span class="marquee-item">✦ ETHICALLY CRAFTED & TESTED</span>
      <span class="marquee-item">✦ OVER 100,000+ HAPPY CUSTOMERS</span>
    </div>
  </div>

  <!-- Section 4: High Impact Hero Banner -->
  <section class="hero-section">
    <div class="container hero-grid">
      <div>
        <div class="hero-tag">⚡ ${comp.styleBadge || "New Season Drop"}</div>
        <h1 class="hero-title">${comp.description.split(":")[0] || "Elevate Your Everyday Standard"}</h1>
        <p class="hero-desc">
          Engineered for discerning tastes. Discover our bestselling curated catalog built with highest craftsmanship and obsessive attention to detail.
        </p>
        <div class="hero-cta-group">
          <a href="#bestsellers" class="btn-primary">Shop The Collection →</a>
          <a href="#story" class="btn-secondary">Explore Lookbook</a>
        </div>
      </div>
      <div class="hero-media">
        <img src="${products[0].img}" alt="Hero Showcase" class="hero-img" />
      </div>
    </div>
  </section>

  <!-- Section 5: Trust & Benefits Bar -->
  <div class="trust-strip">
    <div class="container trust-grid">
      <div class="trust-item">
        <h4>📦 Express Delivery</h4>
        <p>Dispatched within 24 hours</p>
      </div>
      <div class="trust-item">
        <h4>🛡️ 100% Authentic</h4>
        <p>BIS / Lab certified & verified</p>
      </div>
      <div class="trust-item">
        <h4>🔄 Easy Exchanges</h4>
        <p>Doorstep 7-day swap policy</p>
      </div>
      <div class="trust-item">
        <h4>⭐ 4.9/5 Rated</h4>
        <p>Trusted by 50,000+ buyers</p>
      </div>
    </div>
  </div>

  <!-- Section 6: Category Tiles -->
  <section id="categories" class="category-section">
    <div class="container">
      <div class="section-head">
        <div class="section-sub">Curated Selections</div>
        <h2 class="section-title">Explore By Category</h2>
      </div>
      <div class="category-grid">
        <div class="category-card">
          <img src="${products[1].img}" alt="Category 1" />
          <div class="category-card-overlay">
            <div class="category-card-title">Signature Bestsellers</div>
            <div class="category-card-count">18 Products</div>
          </div>
        </div>
        <div class="category-card">
          <img src="${products[2].img}" alt="Category 2" />
          <div class="category-card-overlay">
            <div class="category-card-title">Limited Edition Drop</div>
            <div class="category-card-count">12 Products</div>
          </div>
        </div>
        <div class="category-card">
          <img src="${products[3].img}" alt="Category 3" />
          <div class="category-card-overlay">
            <div class="category-card-title">New Arrivals</div>
            <div class="category-card-count">24 Products</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Section 7: Bestsellers Product Grid -->
  <section id="bestsellers" class="product-section">
    <div class="container">
      <div class="section-head">
        <div class="section-sub">Most Loved By Shoppers</div>
        <h2 class="section-title">Featured Bestsellers</h2>
      </div>
      <div class="product-grid">
        ${products.map(p => `
          <div class="product-card">
            <div class="product-thumb">
              <img src="${p.img}" alt="${p.title}" />
              <span class="product-pill">${p.pill}</span>
            </div>
            <div class="product-info">
              <div>
                <div class="product-stars">★★★★★ (${p.reviews})</div>
                <div class="product-name">${p.title}</div>
              </div>
              <div class="product-price-row">
                <div class="product-price">${p.price}</div>
                <button class="product-atc">+ Quick Add</button>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  </section>

  <!-- Section 8: Shoppable UGC / Reels Grid -->
  <section class="ugc-section">
    <div class="container">
      <div class="section-head">
        <div class="section-sub">As Seen On Social</div>
        <h2 class="section-title">Styled By Our Community</h2>
      </div>
      <div class="ugc-grid">
        ${products.map((p, idx) => `
          <div class="ugc-card">
            <img src="${p.img}" alt="UGC Reel ${idx + 1}" />
            <div class="ugc-overlay">
              <div class="ugc-handle">@customer_${idx + 1}</div>
              <div class="ugc-caption">"Obsessed with the quality! Best purchase of the season 🔥"</div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  </section>

  <!-- Section 9: Brand Story & Craftsmanship -->
  <section id="story" class="story-section">
    <div class="container story-grid">
      <div class="story-img-box">
        <img src="${products[0].img}" alt="Brand Craftsmanship" />
      </div>
      <div>
        <div class="section-sub">Our Philosophy</div>
        <h2 class="section-title" style="margin-bottom: 20px;">Designed Without Compromise.</h2>
        <p style="font-size: 16px; line-height: 1.7; color:${textSecondary}; margin-bottom: 20px;">
          Every single piece in our catalogue begins with rigorous material testing and ethical sourcing. We reject mass-market fast trends in favour of timeless silhouettes and enduring durability.
        </p>
        <p style="font-size: 16px; line-height: 1.7; color:${textSecondary}; margin-bottom: 30px;">
          Direct-to-consumer means premium luxury formulations without the traditional 8x retail markup.
        </p>
        <a href="#bestsellers" class="btn-primary">Learn More About Materials →</a>
      </div>
    </div>
  </section>

  <!-- Section 10: Verified Customer Reviews -->
  <section id="reviews" class="reviews-section">
    <div class="container">
      <div class="section-head">
        <div class="section-sub">Real Feedback</div>
        <h2 class="section-title">Loved by Thousands</h2>
      </div>
      <div class="reviews-grid">
        <div class="review-card">
          <div class="review-stars">★★★★★</div>
          <p class="review-text">"The packaging alone felt like opening a $500 luxury package. The actual product exceeded all my expectations!"</p>
          <div class="review-author">Sarah M.</div>
          <div class="review-verified">✓ Verified Buyer · New York</div>
        </div>
        <div class="review-card">
          <div class="review-stars">★★★★★</div>
          <p class="review-text">"Delivery was super fast (received in 2 days). The finish and fit are 10/10. Will definitely order again!"</p>
          <div class="review-author">Ananya R.</div>
          <div class="review-verified">✓ Verified Buyer · Mumbai</div>
        </div>
        <div class="review-card">
          <div class="review-stars">★★★★★</div>
          <p class="review-text">"Customer support helped me pick the right size immediately on WhatsApp. Unbeatable service."</p>
          <div class="review-author">David K.</div>
          <div class="review-verified">✓ Verified Buyer · London</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Section 11: FAQ Accordion -->
  <section id="faq" class="faq-section">
    <div class="container">
      <div class="section-head">
        <div class="section-sub">Got Questions?</div>
        <h2 class="section-title">Frequently Asked Questions</h2>
      </div>
      <div class="faq-wrap">
        <div class="faq-item">
          <div class="faq-q"><span>How long does delivery take?</span> <span>+</span></div>
          <div class="faq-a">We process all orders within 24 hours. Standard shipping takes 2-4 business days across all major metro cities.</div>
        </div>
        <div class="faq-item">
          <div class="faq-q"><span>What is your return & exchange policy?</span> <span>+</span></div>
          <div class="faq-a">We offer an unconditional 7-day doorstep return and exchange policy. Zero questions asked.</div>
        </div>
        <div class="faq-item">
          <div class="faq-q"><span>Are the products authentic and certified?</span> <span>+</span></div>
          <div class="faq-a">100% authentic. Every product comes with standard laboratory certification and authenticity warranty cards.</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Section 12: VIP Newsletter -->
  <section class="newsletter-section">
    <div class="container">
      <div class="newsletter-box">
        <h2 class="section-title" style="margin-bottom: 12px;">Unlock 15% Off Your First Order</h2>
        <p style="color: ${textSecondary}; font-size: 15px;">Join 40,000+ VIPs and receive secret archival drops, private sale codes, and style guides.</p>
        <div class="newsletter-form">
          <input type="email" placeholder="Enter your email address" class="newsletter-input" />
          <button class="btn-primary" style="padding: 14px 28px; border:none; cursor:pointer;">Join VIP</button>
        </div>
      </div>
    </div>
  </section>

  <!-- Section 13: Mega Footer -->
  <footer class="site-footer">
    <div class="container footer-grid">
      <div>
        <div style="color:#fff; font-size:20px; font-weight:800; margin-bottom:14px;">${name}</div>
        <p style="font-size:14px; line-height:1.6; max-width:320px; margin-bottom:20px;">
          The next-generation direct-to-consumer store powered by ConvertFlow modular high-conversion Liquid architecture.
        </p>
      </div>
      <div>
        <div class="footer-title">Shop</div>
        <ul class="footer-links">
          <li><a href="#bestsellers">Bestsellers</a></li>
          <li><a href="#categories">New Arrivals</a></li>
          <li><a href="#bestsellers">Curated Bundles</a></li>
          <li><a href="#categories">Gift Cards</a></li>
        </ul>
      </div>
      <div>
        <div class="footer-title">Support</div>
        <ul class="footer-links">
          <li><a href="#faq">Track Order</a></li>
          <li><a href="#faq">Shipping Policy</a></li>
          <li><a href="#faq">Returns & Refunds</a></li>
          <li><a href="#faq">Contact Us</a></li>
        </ul>
      </div>
      <div>
        <div class="footer-title">About</div>
        <ul class="footer-links">
          <li><a href="#story">Our Story</a></li>
          <li><a href="#story">Sustainability</a></li>
          <li><a href="#reviews">Press & Media</a></li>
          <li><a href="#faq">Terms of Service</a></li>
        </ul>
      </div>
    </div>
    <div class="container footer-bottom">
      <p>© 2026 ${name}. Powered by ConvertFlow D2C Engine · All Rights Reserved.</p>
    </div>
  </footer>

</body>
</html>`;
}

function getProductsForNiche(niche: string) {
  if (niche === "clothing") {
    return [
      {
        title: "Heavyweight Boxy Hoodie (480 GSM)",
        price: "$88.00",
        reviews: "342",
        pill: "Bestseller",
        img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80",
      },
      {
        title: "Oversized Vintage Acid Tee",
        price: "$44.00",
        reviews: "189",
        pill: "Trending",
        img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80",
      },
      {
        title: "Tactical Cargo Pants v2",
        price: "$110.00",
        reviews: "94",
        pill: "Limited",
        img: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&q=80",
      },
      {
        title: "Cyber Reflective Windbreaker",
        price: "$145.00",
        reviews: "210",
        pill: "New Drop",
        img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
      },
    ];
  } else if (niche === "beauty") {
    return [
      {
        title: "Triple Ceramide Barrier Glow Serum",
        price: "$48.00",
        reviews: "512",
        pill: "Top Rated",
        img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
      },
      {
        title: "Centella Soothing Recovery Cream",
        price: "$36.00",
        reviews: "284",
        pill: "Clean 100%",
        img: "https://images.unsplash.com/photo-1608248597359-0a69a19c7f99?w=800&q=80",
      },
      {
        title: "Haute Rose Velvet Lip Elixir",
        price: "$28.00",
        reviews: "410",
        pill: "Bestseller",
        img: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80",
      },
      {
        title: "Bakuchiol Botanical Night Oil",
        price: "$62.00",
        reviews: "178",
        pill: "Derm Approved",
        img: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=800&q=80",
      },
    ];
  } else if (niche === "jewellery") {
    return [
      {
        title: "Heritage Royal Kundan Choker",
        price: "$340.00",
        reviews: "128",
        pill: "Heirloom",
        img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
      },
      {
        title: "1.5ct Solitaire Lab Diamond Ring",
        price: "$890.00",
        reviews: "245",
        pill: "Certified",
        img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
      },
      {
        title: "Artisan 925 Pure Silver Stacking Cuff",
        price: "$125.00",
        reviews: "318",
        pill: "Handcrafted",
        img: "https://images.unsplash.com/photo-1611591475152-47e24c65d7f7?w=800&q=80",
      },
      {
        title: "Emerald & Polki Chandbali Earrings",
        price: "$280.00",
        reviews: "95",
        pill: "Bridal",
        img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
      },
    ];
  } else {
    return [
      {
        title: "Spatial Pro Noise-Cancelling Headphones",
        price: "$299.00",
        reviews: "680",
        pill: "Flagship",
        img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      },
      {
        title: "Magnetic 3-in-1 Fast Wireless Dock",
        price: "$89.00",
        reviews: "320",
        pill: "Essential",
        img: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80",
      },
      {
        title: "Lossless Studio Audio Interface",
        price: "$180.00",
        reviews: "154",
        pill: "Pro Gear",
        img: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80",
      },
      {
        title: "Ultra-Slim Mechanical Ergonomic Board",
        price: "$149.00",
        reviews: "412",
        pill: "Hot",
        img: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
      },
    ];
  }
}

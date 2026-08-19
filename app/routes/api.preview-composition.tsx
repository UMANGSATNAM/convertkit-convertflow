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
  const id = comp.id || "streetwear-cyber-home";
  const niche = comp.niche || "clothing";
  const name = comp.name || "D2C Brand";
  const badge = comp.styleBadge || "Official Store";

  // Highly distinct, tailor-made visual themes for each of the 10 homepages
  let bg = "#09090b";
  let cardBg = "#121216";
  let textPrimary = "#f8fafc";
  let textSecondary = "#94a3b8";
  let borderCol = "rgba(255,255,255,0.08)";
  let accent = "#ff5500";
  let fontLink = '<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&family=Syne:wght@700;800&display=swap" rel="stylesheet">';
  let headingFont = "'Syne', sans-serif";
  let isDark = true;

  if (id === "streetwear-cyber-home") {
    bg = "#09090b";
    cardBg = "#141418";
    textPrimary = "#ffffff";
    textSecondary = "#a1a1aa";
    borderCol = "rgba(255, 85, 0, 0.2)";
    accent = "#ff5500";
    fontLink = '<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&family=Syne:wght@700;800&display=swap" rel="stylesheet">';
    headingFont = "'Syne', sans-serif";
    isDark = true;
  } else if (id === "ethnic-royal-home") {
    bg = "#180505";
    cardBg = "#260b0b";
    textPrimary = "#fff7ed";
    textSecondary = "#e2d2ba";
    borderCol = "rgba(212, 175, 55, 0.25)";
    accent = "#d4af37"; // Royal 22kt Gold
    fontLink = '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400&family=Inter:wght@400;600&display=swap" rel="stylesheet">';
    headingFont = "'Cormorant Garamond', serif";
    isDark = true;
  } else if (id === "apparel-minimal-home") {
    bg = "#f7f6f2";
    cardBg = "#ffffff";
    textPrimary = "#18181b";
    textSecondary = "#52525b";
    borderCol = "rgba(0, 0, 0, 0.08)";
    accent = "#2d4a3e"; // Forest Sage
    fontLink = '<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700&family=Inter:wght@400;600&display=swap" rel="stylesheet">';
    headingFont = "'Plus Jakarta Sans', sans-serif";
    isDark = false;
  } else if (id === "beauty-organic-home") {
    bg = "#fcfaf6";
    cardBg = "#ffffff";
    textPrimary = "#1f2937";
    textSecondary = "#6b7280";
    borderCol = "rgba(46, 90, 68, 0.12)";
    accent = "#2e5a44"; // Botanical Emerald Green
    fontLink = '<link href="https://fonts.googleapis.com/css2?family=Italiana&family=Plus+Jakarta+Sans:wght@400;500;700&display=swap" rel="stylesheet">';
    headingFont = "'Italiana', serif";
    isDark = false;
  } else if (id === "beauty-clinical-home") {
    bg = "#f8fafc";
    cardBg = "#ffffff";
    textPrimary = "#0f172a";
    textSecondary = "#475569";
    borderCol = "rgba(2, 132, 199, 0.15)";
    accent = "#0284c7"; // Clinical Active Blue
    fontLink = '<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;600&display=swap" rel="stylesheet">';
    headingFont = "'Space Grotesk', sans-serif";
    isDark = false;
  } else if (id === "beauty-glamour-home") {
    bg = "#0d0814";
    cardBg = "#1b1026";
    textPrimary = "#fdf4ff";
    textSecondary = "#d8b4fe";
    borderCol = "rgba(217, 70, 239, 0.25)";
    accent = "#e879f9"; // Glamour Orchid Rose
    fontLink = '<link href="https://fonts.googleapis.com/css2?family=Italiana&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet">';
    headingFont = "'Italiana', serif";
    isDark = true;
  } else if (id === "jewellery-heritage-home") {
    bg = "#06150e";
    cardBg = "#0c261c";
    textPrimary = "#fef9c3";
    textSecondary = "#a7f3d0";
    borderCol = "rgba(234, 179, 8, 0.25)";
    accent = "#eab308"; // Polki Jadau Gold
    fontLink = '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400&family=Inter:wght@400;600&display=swap" rel="stylesheet">';
    headingFont = "'Cormorant Garamond', serif";
    isDark = true;
  } else if (id === "jewellery-diamond-home") {
    bg = "#f1f5f9";
    cardBg = "#ffffff";
    textPrimary = "#0f172a";
    textSecondary = "#475569";
    borderCol = "rgba(14, 165, 233, 0.18)";
    accent = "#0ea5e9"; // Brilliant Platinum Diamond
    fontLink = '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400&family=Inter:wght@400;600&display=swap" rel="stylesheet">';
    headingFont = "'Cormorant Garamond', serif";
    isDark = false;
  } else if (id === "jewellery-silver-home") {
    bg = "#fafaf9";
    cardBg = "#ffffff";
    textPrimary = "#1c1917";
    textSecondary = "#57534e";
    borderCol = "rgba(120, 113, 108, 0.15)";
    accent = "#475569"; // 925 Solid Silver Slate
    fontLink = '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;600&display=swap" rel="stylesheet">';
    headingFont = "'Cormorant Garamond', serif";
    isDark = false;
  } else if (id === "tech-audio-home") {
    bg = "#030712";
    cardBg = "#0f172a";
    textPrimary = "#f9fafb";
    textSecondary = "#9ca3af";
    borderCol = "rgba(34, 197, 94, 0.22)";
    accent = "#22c55e"; // Cyber Neon Emerald
    fontLink = '<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;600&display=swap" rel="stylesheet">';
    headingFont = "'Space Grotesk', sans-serif";
    isDark = true;
  }

  const bodyFont = "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif";
  const products = getProductsForComp(comp.id, niche);
  const copy = getCopyForComp(comp.id, niche, name);

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
      font-size: clamp(36px, 4.5vw, 58px);
      line-height: 1.1;
      font-weight: 800;
      margin-bottom: 20px;
      letter-spacing: -1px;
    }
    .hero-desc {
      font-size: 17px;
      line-height: 1.6;
      color: ${textSecondary};
      margin-bottom: 32px;
      max-width: 520px;
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

    /* Section 10: Customer Reviews */
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

    /* Section 12: VIP Newsletter */
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

    /* Section 8: Offer & Promo Banner */
    .offer-banner-section { padding: 40px 0; }
    .offer-box {
      background: ${isDark ? "#1c1924" : "#f1f5f9"};
      border: 1px solid ${borderCol};
      border-radius: 24px;
      padding: 48px;
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 32px;
      align-items: center;
      position: relative;
      overflow: hidden;
    }
    .offer-badge {
      display: inline-block;
      background: ${accent};
      color: #fff;
      font-size: 11px;
      font-weight: 800;
      padding: 4px 12px;
      border-radius: 99px;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    .offer-title { font-size: 32px; font-weight: 800; line-height: 1.2; margin-bottom: 12px; }
    .offer-desc { font-size: 15px; color: ${textSecondary}; line-height: 1.6; margin-bottom: 20px; }

    /* Section 9: Spec Matrix / Comparison */
    .spec-section { padding: 70px 0; background: ${isDark ? "#0c0c0e" : "#f8fafc"}; border-top: 1px solid ${borderCol}; border-bottom: 1px solid ${borderCol}; }
    .spec-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 36px; }
    .spec-card {
      background: ${cardBg};
      border: 1px solid ${borderCol};
      border-radius: 18px;
      padding: 28px;
    }
    .spec-card h3 { font-size: 18px; font-weight: 700; margin-bottom: 10px; color: ${accent}; }
    .spec-card p { font-size: 14px; color: ${textSecondary}; line-height: 1.6; }

    /* Section 10: Press Strip */
    .press-strip {
      padding: 32px 0;
      border-bottom: 1px solid ${borderCol};
      background: ${isDark ? "#09090b" : "#ffffff"};
    }
    .press-flex {
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-wrap: wrap;
      gap: 24px;
      opacity: 0.7;
    }
    .press-logo { font-size: 20px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; font-family: ${headingFont}; }

    /* Section 11: Bundle & Save */
    .bundle-section { padding: 80px 0; }
    .bundle-box {
      background: ${cardBg};
      border: 2px dashed ${accent};
      border-radius: 24px;
      padding: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 32px;
      flex-wrap: wrap;
    }

    /* FAQ interactive details */
    details.faq-item {
      background: ${cardBg};
      border: 1px solid ${borderCol};
      border-radius: 14px;
      padding: 18px 24px;
      margin-bottom: 12px;
      cursor: pointer;
    }
    details.faq-item summary {
      font-size: 16px;
      font-weight: 700;
      list-style: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    details.faq-item summary::-webkit-details-marker { display: none; }
    details.faq-item[open] summary { color: ${accent}; }
    .faq-answer { margin-top: 14px; font-size: 14px; color: ${textSecondary}; line-height: 1.7; }

    /* Guarantee Bar */
    .guarantee-bar {
      padding: 24px 16px;
      background: ${accent};
      color: #ffffff;
      text-align: center;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }

    /* Archetype Custom Layout Overrides */
    ${id === "streetwear-cyber-home" ? `
      .hero-media { border-radius: 0px !important; border: 2px solid ${accent} !important; box-shadow: 12px 12px 0px #ff550044 !important; }
      .product-card { border-radius: 0px !important; border: 1px solid rgba(255,85,0,0.3) !important; background: #121215 !important; }
      .btn-primary { border-radius: 0px !important; font-family: monospace !important; text-transform: uppercase !important; letter-spacing: 1px !important; }
      .category-card { border-radius: 0px !important; }
    ` : id === "ethnic-royal-home" ? `
      .hero-media { border-radius: 200px 200px 16px 16px !important; border: 2px solid rgba(212,175,55,0.4) !important; box-shadow: 0 20px 40px rgba(0,0,0,0.5) !important; }
      .product-card { border-radius: 16px !important; border: 1px solid rgba(212,175,55,0.3) !important; background: #220808 !important; }
      .category-card { border-radius: 120px 120px 16px 16px !important; }
      .btn-primary { background: linear-gradient(135deg, #d4af37 0%, #b45309 100%) !important; color: #180505 !important; font-weight: 800 !important; }
    ` : id === "apparel-minimal-home" ? `
      .hero-media { border-radius: 12px !important; border: 1px solid rgba(0,0,0,0.06) !important; }
      .product-card { border-radius: 10px !important; border: 1px solid rgba(0,0,0,0.06) !important; }
      .category-card { border-radius: 10px !important; }
      .btn-primary { border-radius: 8px !important; font-weight: 600 !important; letter-spacing: 0.2px !important; }
    ` : id === "beauty-organic-home" ? `
      .hero-media { border-radius: 36px !important; border: 1px solid rgba(46,90,68,0.2) !important; }
      .product-card { border-radius: 24px !important; border: 1px solid rgba(46,90,68,0.15) !important; }
      .category-card { border-radius: 28px !important; }
      .btn-primary { border-radius: 99px !important; background: #2e5a44 !important; }
    ` : id === "beauty-clinical-home" ? `
      .hero-media { border-radius: 8px !important; border: 2px solid #0284c7 !important; background: #f8fafc !important; }
      .product-card { border-radius: 8px !important; border: 1px solid #cbd5e1 !important; }
      .category-card { border-radius: 8px !important; }
      .btn-primary { border-radius: 6px !important; background: #0284c7 !important; font-family: monospace !important; }
    ` : id === "beauty-glamour-home" ? `
      .hero-media { border-radius: 28px !important; border: 1px solid rgba(232,121,249,0.3) !important; box-shadow: 0 0 35px rgba(232,121,249,0.2) !important; }
      .product-card { border-radius: 20px !important; border: 1px solid rgba(232,121,249,0.25) !important; background: #160c20 !important; }
      .category-card { border-radius: 24px !important; }
      .btn-primary { border-radius: 99px !important; background: linear-gradient(135deg, #e879f9 0%, #c026d3 100%) !important; color: #fff !important; }
    ` : id === "jewellery-heritage-home" ? `
      .hero-media { border-radius: 180px 180px 20px 20px !important; border: 2px solid #eab308 !important; box-shadow: 0 0 30px rgba(234,179,8,0.2) !important; }
      .product-card { border-radius: 16px !important; border: 1px solid rgba(234,179,8,0.3) !important; background: #0a1f15 !important; }
      .category-card { border-radius: 100px 100px 16px 16px !important; }
      .btn-primary { background: linear-gradient(135deg, #eab308 0%, #ca8a04 100%) !important; color: #06150e !important; font-weight: 800 !important; }
    ` : id === "jewellery-diamond-home" ? `
      .hero-media { border-radius: 16px !important; border: 1px solid rgba(14,165,233,0.3) !important; box-shadow: 0 15px 35px rgba(14,165,233,0.12) !important; }
      .product-card { border-radius: 16px !important; border: 1px solid rgba(14,165,233,0.2) !important; }
      .category-card { border-radius: 16px !important; }
      .btn-primary { border-radius: 8px !important; background: #0f172a !important; color: #ffffff !important; }
    ` : id === "jewellery-silver-home" ? `
      .hero-media { border-radius: 20px !important; border: 1px solid rgba(120,113,108,0.25) !important; }
      .product-card { border-radius: 14px !important; border: 1px solid rgba(120,113,108,0.2) !important; }
      .category-card { border-radius: 18px !important; }
      .btn-primary { border-radius: 8px !important; background: #292524 !important; color: #fafaf9 !important; }
    ` : `
      .hero-media { border-radius: 4px !important; border: 2px solid #22c55e !important; box-shadow: 0 0 25px rgba(34,197,94,0.25) !important; }
      .product-card { border-radius: 4px !important; border: 1px solid rgba(34,197,94,0.3) !important; background: #0b1324 !important; }
      .category-card { border-radius: 4px !important; }
      .btn-primary { border-radius: 4px !important; background: #22c55e !important; color: #030712 !important; font-family: monospace !important; font-weight: 800 !important; }
    `}

    /* ── Comprehensive Mobile & Tablet Responsive Architecture ──────── */
    @media (max-width: 992px) {
      .hero-grid { grid-template-columns: 1fr; gap: 36px; text-align: center; }
      .hero-desc { margin: 0 auto 28px; }
      .hero-cta-group { justify-content: center; }
      .story-grid { grid-template-columns: 1fr; gap: 32px; text-align: center; }
      .footer-grid { grid-template-columns: repeat(2, 1fr); gap: 32px; }
      .offer-box { grid-template-columns: 1fr; padding: 36px 24px; text-align: center; }
      .offer-box .btn-primary { margin: 0 auto; }
      .spec-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 768px) {
      .container { padding: 0 16px; }
      .hero-section { padding: 40px 0; }
      .hero-title { font-size: clamp(28px, 7vw, 42px); }
      .hero-img { height: 340px; }
      .hero-cta-group { flex-direction: column; width: 100%; }
      .hero-cta-group .btn-primary, .hero-cta-group .btn-secondary { width: 100%; justify-content: center; padding: 14px 20px; }
      
      .trust-grid { grid-template-columns: repeat(2, 1fr); gap: 16px 12px; }
      .trust-item h4 { font-size: 13px; }
      .trust-item p { font-size: 11px; }

      .category-section, .product-section, .ugc-section, .story-section, .reviews-section, .faq-section, .newsletter-section, .bundle-section, .spec-section {
        padding: 50px 0;
      }
      .section-title { font-size: 26px; }

      /* Mobile 2-column e-commerce grid */
      .category-grid { grid-template-columns: 1fr; gap: 16px; }
      .category-card { height: 240px; }

      .product-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
      .product-info { padding: 12px; }
      .product-name { font-size: 13px; line-height: 1.3; }
      .product-price { font-size: 15px; }
      .product-atc { padding: 6px 10px; font-size: 11px; }

      .ugc-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
      .spec-grid { grid-template-columns: 1fr; gap: 16px; }
      .reviews-grid { grid-template-columns: 1fr; gap: 16px; }

      .bundle-box { flex-direction: column; text-align: center; padding: 28px 20px; }
      .bundle-box .btn-primary { width: 100%; justify-content: center; }

      .newsletter-box { padding: 32px 18px; }
      .newsletter-form { flex-direction: column; }
      .newsletter-form .btn-primary { width: 100%; justify-content: center; }

      .footer-grid { grid-template-columns: 1fr; gap: 28px; text-align: center; }
      .footer-links { align-items: center; }

      .nav-links { display: none; }
      .announcement-bar { font-size: 11px; padding: 8px 12px; }
    }

    @media (max-width: 480px) {
      .product-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
      .product-pill { font-size: 8px; padding: 2px 5px; top: 6px; left: 6px; }
      .product-stars { font-size: 10px; }
      .press-logo { font-size: 16px; }
      .hero-img { height: 280px; }
    }
  </style>
</head>
<body>

  <!-- Section 1: Announcement Bar -->
  <div class="announcement-bar">
    <span class="announcement-badge">Exclusive</span>
    <span>${copy.announcement}</span>
  </div>

  <!-- Section 2: Header Chrome -->
  <header class="site-header">
    <div class="container nav-row">
      <a href="#" class="site-logo">
        <span class="accent-color">●</span> ${name}
      </a>
      <nav class="nav-links">
        <a href="#categories">Shop All</a>
        <a href="#bestsellers">Bestsellers</a>
        <a href="#story">Our Story</a>
        <a href="#reviews">Reviews</a>
        <a href="#faq">FAQ</a>
      </nav>
      <div class="nav-actions">
        <a href="#bestsellers" class="cart-btn">Shop Collection →</a>
      </div>
    </div>
  </header>

  <!-- Section 3: Marquee Ticker -->
  <div class="marquee-strip">
    <div class="marquee-content">
      ${copy.marquee.map((m: string) => `<span class="marquee-item">${m} ★</span>`).join("")}
      ${copy.marquee.map((m: string) => `<span class="marquee-item">${m} ★</span>`).join("")}
    </div>
  </div>

  <!-- Section 4: Hero Section -->
  <section class="hero-section">
    <div class="container hero-grid">
      <div>
        <div class="hero-tag">⚡ ${badge}</div>
        <h1 class="hero-title">${copy.heroTitle}</h1>
        <p class="hero-desc">${copy.heroDesc}</p>
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

  <!-- Section 5: Trust Badges Bar -->
  <div class="trust-strip">
    <div class="container trust-grid">
      ${copy.trustBadges.map((tb: any) => `
        <div class="trust-item">
          <h4>${tb.icon} ${tb.title}</h4>
          <p>${tb.desc}</p>
        </div>
      `).join("")}
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
            <div class="category-card-title">${copy.categories[0]}</div>
            <div class="category-card-count">18 Products</div>
          </div>
        </div>
        <div class="category-card">
          <img src="${products[2].img}" alt="Category 2" />
          <div class="category-card-overlay">
            <div class="category-card-title">${copy.categories[1]}</div>
            <div class="category-card-count">12 Products</div>
          </div>
        </div>
        <div class="category-card">
          <img src="${products[3].img}" alt="Category 3" />
          <div class="category-card-overlay">
            <div class="category-card-title">${copy.categories[2]}</div>
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

  <!-- Section 8: Special Offer & Incentive Banner -->
  <section class="offer-banner-section">
    <div class="container">
      <div class="offer-box">
        <div>
          <span class="offer-badge">${copy.offerBadge || "Limited Time Incentive"}</span>
          <h2 class="offer-title">${copy.offerTitle || "Upgrade Your Daily Routine"}</h2>
          <p class="offer-desc">${copy.offerDesc || "Unlock special tier savings, complimentary gifts, and fast tracked VIP shipping on your first order today."}</p>
          <a href="#bestsellers" class="btn-primary">${copy.offerCta || "Claim Offer Now →"}</a>
        </div>
        <div style="text-align: center; background: ${cardBg}; padding: 24px; border-radius: 16px; border: 1px solid ${borderCol};">
          <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; margin-bottom: 8px; color: ${accent};">Exclusive Coupon Code</div>
          <div style="font-size: 24px; font-weight: 900; letter-spacing: 2px; padding: 12px; background: ${isDark ? "#27272a" : "#e2e8f0"}; border-radius: 8px; font-family: monospace;">${copy.offerCode || "CONVERT20"}</div>
          <div style="font-size: 11px; color: ${textSecondary}; margin-top: 8px;">Auto-applied at checkout · Limited slots</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Section 9: Spec Matrix & Quality Breakdown -->
  <section class="spec-section">
    <div class="container">
      <div class="section-head" style="margin-bottom: 24px;">
        <div class="section-sub">Why We Are Different</div>
        <h2 class="section-title">${copy.specTitle || "The Standard of Excellence"}</h2>
      </div>
      <div class="spec-grid">
        ${(copy.specs || [
          { title: "Zero Compromise Sourcing", desc: "Every raw material is ethically harvested, authenticated, and verified by third-party testing labs." },
          { title: "Engineered For Longevity", desc: "Designed to maintain structural integrity, vibrant pigment, and performance across years of daily use." },
          { title: "Direct-to-Consumer Value", desc: "By bypassing luxury distributor markups, we invest 4x more into pure formulation and artisan craft." },
        ]).map((s: any) => `
          <div class="spec-card">
            <h3>✦ ${s.title}</h3>
            <p>${s.desc}</p>
          </div>
        `).join("")}
      </div>
    </div>
  </section>

  <!-- Section 10: As Seen In Press Strip -->
  <div class="press-strip">
    <div class="container press-flex">
      ${(copy.pressLogos || ["VOGUE", "GQ", "WIRED", "ALLURE", "ELLE", "FORBES"]).map((p: string) => `
        <span class="press-logo">${p}</span>
      `).join("")}
    </div>
  </div>

  <!-- Section 11: Shoppable UGC / Reels -->
  <section class="ugc-section">
    <div class="container">
      <div class="section-head">
        <div class="section-sub">Community Spotlight</div>
        <h2 class="section-title">Seen On Social</h2>
      </div>
      <div class="ugc-grid">
        ${products.map((p, i) => `
          <div class="ugc-card">
            <img src="${p.img}" alt="UGC Reel ${i + 1}" />
            <div class="ugc-overlay">
              <div class="ugc-handle">@${name.toLowerCase().replace(/[^a-z0-9]/g, "")}_vip</div>
              <div class="ugc-caption">${copy.ugcCaptions[i % copy.ugcCaptions.length]}</div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  </section>

  <!-- Section 12: Brand Story Showcase -->
  <section id="story" class="story-section">
    <div class="container story-grid">
      <div class="story-img-box">
        <img src="${products[0].img}" alt="Brand Heritage Story" />
      </div>
      <div>
        <div class="section-sub">${copy.storySub}</div>
        <h2 class="section-title" style="margin-bottom: 20px;">${copy.storyTitle}</h2>
        <p style="color: ${textSecondary}; line-height: 1.7; font-size: 16px; margin-bottom: 24px;">
          ${copy.storyBody}
        </p>
        <a href="#bestsellers" class="btn-primary">Learn Our Craft →</a>
      </div>
    </div>
  </section>

  <!-- Section 13: Curated Bundle Builder -->
  <section class="bundle-section">
    <div class="container">
      <div class="bundle-box">
        <div>
          <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: ${accent}; margin-bottom: 6px;">Curated Value Bundle</div>
          <h2 style="font-size: 26px; font-weight: 800; margin-bottom: 8px;">${copy.bundleTitle || "The Complete Essentials Trio"}</h2>
          <p style="font-size: 14px; color: ${textSecondary}; max-width: 480px;">${copy.bundleDesc || "Bundle the top 3 bestsellers together and automatically save 25% plus receive complimentary luxury priority shipping."}</p>
        </div>
        <div style="display: flex; gap: 16px; align-items: center;">
          <div style="text-align: right;">
            <div style="font-size: 14px; text-decoration: line-through; color: ${textSecondary};">$180.00</div>
            <div style="font-size: 24px; font-weight: 900; color: ${accent};">$135.00</div>
          </div>
          <a href="#bestsellers" class="btn-primary">Add Bundle & Save →</a>
        </div>
      </div>
    </div>
  </section>

  <!-- Section 14: Customer Reviews -->
  <section id="reviews" class="reviews-section">
    <div class="container">
      <div class="section-head">
        <div class="section-sub">Real Feedback</div>
        <h2 class="section-title">Loved by Thousands</h2>
      </div>
      <div class="reviews-grid">
        ${copy.reviews.map((r: any) => `
          <div class="review-card">
            <div class="review-stars">★★★★★</div>
            <p class="review-text">"${r.text}"</p>
            <div class="review-author">${r.author}</div>
            <div class="review-verified">✓ Verified Buyer · ${r.location}</div>
          </div>
        `).join("")}
      </div>
    </div>
  </section>

  <!-- Section 15: FAQ Accordion -->
  <section id="faq" class="faq-section">
    <div class="container">
      <div class="section-head">
        <div class="section-sub">Got Questions?</div>
        <h2 class="section-title">Frequently Asked Questions</h2>
      </div>
      <div class="faq-wrap">
        ${copy.faqs.map((f: any) => `
          <details class="faq-item">
            <summary>${f.q} <span>▾</span></summary>
            <div class="faq-answer">${f.a}</div>
          </details>
        `).join("")}
      </div>
    </div>
  </section>

  <!-- Section 16: VIP Newsletter -->
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

  <!-- Section 17: Risk-Reversal Guarantee Bar -->
  <div class="guarantee-bar">
    <div class="container">
      ✦ 100% SATISFACTION GUARANTEED · 30-DAY HASSLE-FREE RETURNS · INSURED EXPRESS DISPATCH ✦
    </div>
  </div>

  <!-- Section 18: Mega Footer -->
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

function getCopyForComp(id: string, niche: string, name: string) {
  if (id === "streetwear-cyber-home") {
    return {
      announcement: "⚡ SECRET ARCHIVE DROP LIVE · USE CODE CYBER20 FOR 20% OFF",
      marquee: ["100% HEAVYWEIGHT ORGANIC COTTON", "LIMITED TO 250 PIECES PER DROP", "FREE EXPRESS GLOBAL SHIPPING", "NO RESTOCKS"],
      heroTitle: "Engineered For The New Underground",
      heroDesc: "Heavyweight 480 GSM French Terry and tactical architectural cuts. Limited edition drops that never restock once sold out.",
      trustBadges: [
        { icon: "📦", title: "Global Express", desc: "Dispatched within 24 hours" },
        { icon: "⚡", title: "480 GSM French Terry", desc: "Pre-shrunk custom fabric" },
        { icon: "🔄", title: "Easy Returns", desc: "7-day doorstep pickup" },
        { icon: "⭐", title: "4.9/5 Rated", desc: "15,000+ street reviews" },
      ],
      categories: ["Heavyweight Hoodies", "Vintage Acid Tees", "Tactical Cargos"],
      offerBadge: "Limited Drop Mystery Box",
      offerTitle: "Archival Streetwear Mystery Box",
      offerDesc: "Get 3 archival streetwear pieces (Worth $210) for only $99. Strictly limited to 100 boxes.",
      offerCode: "MYSTERY99",
      offerCta: "Claim Mystery Box →",
      specTitle: "The Cyber Streetwear Benchmark",
      specs: [
        { title: "480 GSM Portuguese Terry", desc: "Double the weight of regular streetwear hoodies, custom-milled in Porto with zero pilling guarantee." },
        { title: "Acid Mineral Wash", desc: "Individually hand-dyed using cold mineral washes for unique vintage marbling on every piece." },
        { title: "Tactical Hardware", desc: "Japanese YKK matte black waterproof zips with reinforced bar-tack stitching on all stress points." },
      ],
      pressLogos: ["HYPEBEAST", "COMPLEX", "GQ STYLE", "HIGHSNOBIETY", "DAZED"],
      bundleTitle: "The Cyber Street Uniform Bundle",
      bundleDesc: "Bundle the 480 GSM Hoodie + Vintage Acid Tee + Tactical Cargo and save $55 automatically at checkout.",
      ugcCaptions: ["Wearing the 480 GSM Acid Hoodie 🔥", "Best fitting cargo pants ever made", "Drop sold out in 3 mins!", "Unboxing the Archival Pack"],
      storySub: "Our Streetwear Manifesto",
      storyTitle: "Anti-Fast Fashion. Pure Substance.",
      storyBody: "We set out to eliminate the throwaway polyester streetwear market. Every piece is constructed with heavyweight Portuguese organic cotton, custom-milled zippers, and double-needle reinforced stitching.",
      reviews: [
        { text: "The weight and drape on this hoodie is unreal. Better quality than designer brands charging $400.", author: "Marcus T.", location: "Berlin" },
        { text: "Got the acid wash tee and tactical pants. Literally my daily uniform now.", author: "Karan S.", location: "Mumbai" },
        { text: "Fastest shipping ever and packaging is 10/10.", author: "Liam D.", location: "London" },
      ],
      faqs: [
        { q: "How do your sizes fit?", a: "Our apparel features an intentional boxy, slightly oversized streetwear drape. Stay true to size for an oversized look, or size down for standard." },
        { q: "Will sold-out drops be restocked?", a: "Never. All collections are limited numbered runs to preserve rarity and design uniqueness." },
        { q: "How do I care for 480 GSM French Terry?", a: "Machine wash cold inside-out. Lay flat or hang dry to preserve fabric density and custom dyes." },
      ],
    };
  }

  if (id === "ethnic-royal-home") {
    return {
      announcement: "✨ ROYAL BRIDAL COUTURE EDIT · COMPLIMENTARY VIDEO STYLING AVAILABLE",
      marquee: ["HANDWOVEN PURE SILK & ZARI", "BIS CERTIFIED ARTISAN CRAFTSMANSHIP", "CUSTOM BRIDAL FIT GUARANTEED", "WORLDWIDE INSURED SHIPPING"],
      heroTitle: "Grand Heirloom Ethnic Couture",
      heroDesc: "Centuries-old Banarasi zari weaves, royal zardozi hand-embroidery, and couture silhouettes crafted for timeless bridal splendor.",
      trustBadges: [
        { icon: "👑", title: "Pure Silk Certified", desc: "Silk Mark & Handloom tag" },
        { icon: "✨", title: "Master Zardozi", desc: "300+ artisan hours per piece" },
        { icon: "📏", title: "Custom Tailoring", desc: "Personal bridal fit consultation" },
        { icon: "💎", title: "Royal Legacy", desc: "Patroned by royal families" },
      ],
      categories: ["Bridal Lehengas", "Pure Banarasi Sarees", "Heritage Anarkalis"],
      offerBadge: "Royal Trousseau Edit",
      offerTitle: "Complete Bridal Trousseau Suite",
      offerDesc: "Book your virtual bridal stylist session and receive a complimentary hand-embroidered velvet dupatta with your bridal set.",
      offerCode: "ROYALTROUSSEAU",
      offerCta: "Book Bridal Suite →",
      specTitle: "Centuries of Handloom Mastery",
      specs: [
        { title: "Pure Katan Silk Base", desc: "100% pure Mulberry silk warp and weft woven on traditional wooden pit looms in Varanasi." },
        { title: "Real Silver & Gold Zari", desc: "Electroplated 24kt gold and sterling silver zari threads woven directly into the fabric motifs." },
        { title: "Bespoke Millimeter Tailoring", desc: "Hand-stitched by master ustaads to your exact posture and silhouette measurements." },
      ],
      pressLogos: ["VOGUE INDIA", "HARPER'S BAZAAR BRIDE", "WEDMEGOOD", "ELLE", "GRAZIA"],
      bundleTitle: "The Grand Royal Wedding Duo",
      bundleDesc: "Pair your Royal Bridal Lehenga with a matching Katan Silk Banarasi Saree and save ₹18,000 / $220.",
      ugcCaptions: ["Felt like royalty on my wedding day", "The zari handwork is breathtaking", "Custom tailored to perfection", "Heirloom piece to pass down"],
      storySub: "Artisan Heritage",
      storyTitle: "Preserving Ancient Weaving Traditions",
      storyBody: "Our master karigars in Varanasi and Jaipur have practiced the sacred art of Zardozi and Kadwa weaving across four generations. Every garment is a living piece of Indian couture history.",
      reviews: [
        { text: "My bridal lehenga was beyond anything I dreamed. The compliments have not stopped!", author: "Pooja Mehta", location: "New Delhi" },
        { text: "Ordered from the US and the fit was 100% flawless. The pure silk sheen is extraordinary.", author: "Anjali Rao", location: "San Francisco" },
        { text: "True couture luxury. The box, the certificate, and the garment were pristine.", author: "Devika Roy", location: "Kolkata" },
      ],
      faqs: [
        { q: "Do you offer custom bridal sizing?", a: "Yes, every bridal piece includes a 1-on-1 virtual consultation with our master master-tailor for millimeter-accurate measurements." },
        { q: "How long does bridal couture take?", a: "Hand-embroidered pieces take 3-6 weeks to weave and stitch. Ready-to-ship festive edits dispatch in 48 hours." },
        { q: "Is international delivery insured?", a: "Yes, 100% of international consignments are fully insured via DHL Express." },
      ],
    };
  }

  if (id === "apparel-minimal-home") {
    return {
      announcement: "🌿 NORDIC CAPSULE WARDROBE · 100% GOTS ORGANIC & CARBON NEUTRAL",
      marquee: ["ORGANIC COTTON & RECYCLED WOOL", "CARBON NEUTRAL WORLDWIDE SHIPPING", "TIMELESS SCANDINAVIAN SILHOUETTES", "CIRCULAR RECYCLING PROGRAM"],
      heroTitle: "Pure Form. Essential Living.",
      heroDesc: "Minimalist Scandinavian wardrobe essentials designed to outlast seasons. Crafted from certified organic fabrics with zero synthetic blends.",
      trustBadges: [
        { icon: "🌱", title: "100% Organic GOTS", desc: "Zero harmful chemicals" },
        { icon: "🌍", title: "Carbon Neutral", desc: "Offset shipping footprint" },
        { icon: "🔄", title: "Circular Promise", desc: "Trade-in recycling program" },
        { icon: "⭐", title: "4.95 Rating", desc: "From 20,000+ conscious buyers" },
      ],
      categories: ["Capsule Essentials", "Merino Knitwear", "Tailored Linen"],
      offerBadge: "Capsule Starter Set",
      offerTitle: "Build Your 5-Piece Capsule",
      offerDesc: "Choose 2 Organic Tees, 1 Merino Knit, 1 Linen Trouser, and 1 Overshirt to save 30% automatically.",
      offerCode: "CAPSULE30",
      offerCta: "Build Capsule Now →",
      specTitle: "The Scandinavian Quality Standard",
      specs: [
        { title: "GOTS 100% Organic Cotton", desc: "Grown without pesticides, using 91% less water, and dyed with closed-loop botanical pigments." },
        { title: "RWS Extra-Fine Merino", desc: "Superfine 19.5-micron merino wool from certified non-mulesed ethical sheep farms." },
        { title: "Zero Shrinkage Pre-Wash", desc: "Every garment is steam-relaxed and pre-shrunk to retain exact fit across 100+ wash cycles." },
      ],
      pressLogos: ["MONOCLE", "WALLPAPER*", "KINFORK", "DEZEEN", "MINIMALISSIMO"],
      bundleTitle: "The Everyday Nordic Trio",
      bundleDesc: "Bundle 3 Heavyweight Organic Cotton Tees and receive a complimentary canvas tote bag.",
      ugcCaptions: ["My 10-piece capsule wardrobe", "Softest organic cotton on earth", "Clean minimal silhouettes", "Zero-waste everyday look"],
      storySub: "Slow Living Design",
      storyTitle: "Simplicity Is The Ultimate Sophistication",
      storyBody: "We design clothing meant to be worn 100+ times, not 3 times. By eliminating loud branding and fast-fashion cycles, we create wardrobe foundation pieces that retain their shape and elegance for years.",
      reviews: [
        { text: "Replaced my entire wardrobe with their capsule line. Incredibly versatile and well-made.", author: "Astrid Lind", location: "Stockholm" },
        { text: "The linen shirt and merino crewneck are perfection. The drape is effortless.", author: "Oliver Hansen", location: "Copenhagen" },
        { text: "Sustainable fashion done right. No gimmicks, just superior fabric and construction.", author: "Elena Weber", location: "Zurich" },
      ],
      faqs: [
        { q: "What is your fabric certification?", a: "All cotton is GOTS-certified 100% organic, and all wool is RWS (Responsible Wool Standard) ethically sourced." },
        { q: "How does the circular program work?", a: "Send back any well-loved garment for recycling and receive $25 store credit toward your next piece." },
        { q: "Are dyes chemical-free?", a: "We exclusively use OEKO-TEX standard 100 non-toxic, closed-loop botanical and mineral dyes." },
      ],
    };
  }

  if (id === "beauty-organic-home") {
    return {
      announcement: "🍃 100% BOTANICAL SKINCARE · FREE MINI GLOW OIL ON ALL ORDERS",
      marquee: ["COLD-PRESSED BOTANICAL ACTIVES", "DERMATOLOGIST VERIFIED CLEAN", "100% VEGAN & CRUELTY-FREE", "GLASS RECYCLABLE PACKAGING"],
      heroTitle: "Pure Botanical Nutrition For Radiant Skin",
      heroDesc: "Concentrated bioactive plant nutrients and cold-pressed botanical oils formulated to restore your natural skin barrier and luminous glow.",
      trustBadges: [
        { icon: "🌿", title: "100% Cold-Pressed", desc: "Bioactive nutrient rich" },
        { icon: "🩺", title: "Derm Tested", desc: "Safe for sensitive skin" },
        { icon: "🐰", title: "Cruelty Free", desc: "Leaping Bunny certified" },
        { icon: "✨", title: "28-Day Glow", desc: "Clinically proven radiance" },
      ],
      categories: ["Barrier Serums", "Botanical Oils", "Balancing Toners"],
      offerBadge: "Glow Routine Starter",
      offerTitle: "3-Step Complete Glow Ritual",
      offerDesc: "Get the Barrier Glow Serum + Centella Recovery Cream + Botanical Night Oil with a free quartz facial roller.",
      offerCode: "GLOWKIT25",
      offerCta: "Claim Glow Ritual →",
      specTitle: "Pure Plant Bio-Active Standard",
      specs: [
        { title: "Zero Water Fillers", desc: "We replace water with 100% organic aloe leaf juice and rose flower hydrosols for pure potency." },
        { title: "Cold-Pressed Extraction", desc: "Extracted below 40°C to preserve heat-sensitive antioxidants, polyphenols, and omega fatty acids." },
        { title: "Biophotonic Glass Bottling", desc: "Stored in Swiss Miron violet glass that filters harmful light rays and protects active shelf life." },
      ],
      pressLogos: ["ALLURE", "VOGUE BEAUTY", "BYRDIE", "GLAMOUR", "INStyle"],
      bundleTitle: "The Botanical Barrier Trio",
      bundleDesc: "Bundle the Cleanser + Glow Serum + Face Oil and save $32 instantly.",
      ugcCaptions: ["My skin barrier has never been healthier", "That dewy morning glow ✨", "28-day before and after results", "Clean ingredients that work"],
      storySub: "From Farm to Bottle",
      storyTitle: "The Science of Pure Plant Bio-Actives",
      storyBody: "We partner directly with organic biodynamic farms to harvest botanicals at peak potency. No water fillers, no synthetic fragrances, no petroleum byproducts — only raw botanical nutrition.",
      reviews: [
        { text: "Saved my compromised skin barrier in 10 days. The hydration is unmatched.", author: "Maya Chen", location: "Vancouver" },
        { text: "Lightweight, absorbs instantly, and smells like a fresh spa. My holy grail oil.", author: "Rachel Foster", location: "Melbourne" },
        { text: "My dermatologist was shocked at how fast my redness calmed down. 10/10.", author: "Simran Gill", location: "Chandigarh" },
      ],
      faqs: [
        { q: "Is this suitable for acne-prone skin?", a: "Yes, our oils are 100% non-comedogenic and high in linoleic acid, which actively balances sebum production." },
        { q: "Are your products free of essential oil allergens?", a: "All sensitive skin formulations are fragrance-free and formulated without irritating essential oils." },
        { q: "What is the shelf life?", a: "Our cold-pressed botanicals stay fresh for 18 months unopened, and 6 months after opening." },
      ],
    };
  }

  if (id === "beauty-clinical-home") {
    return {
      announcement: "🔬 CLINICAL DERMA LAB · EVIDENCE-BASED ACTIVE FORMULATIONS",
      marquee: ["10% NIACINAMIDE + 2% ZINC", "TRIPLE PEPTIDE COMPLEX", "CLINICALLY PROVEN RESULTS", "0% PARABENS & FRAGRANCE"],
      heroTitle: "Evidence-Based Clinical Formulations",
      heroDesc: "Pharmaceutical-grade active ingredients at clinically validated percentages. Engineered by dermatologists to resolve hyperpigmentation and barrier damage.",
      trustBadges: [
        { icon: "🧪", title: "Active Precision", desc: "Validated concentration %" },
        { icon: "📊", title: "Clinical Trials", desc: "98% showed skin repair" },
        { icon: "🔬", title: "Biochemist Formulated", desc: "pH balanced for efficacy" },
        { icon: "🛡️", title: "Non-Irritating", desc: "Zero parabens or scents" },
      ],
      categories: ["Clinical Serums", "Peptide Complexes", "Barrier Repair"],
      offerBadge: "Clinical Regimen Starter",
      offerTitle: "The Complete Dermatologist Regimen",
      offerDesc: "Get the 10% Niacinamide + Multi-Peptide Elixir + Ceramide Balm and receive a free 15ml Retinol Matrix mini.",
      offerCode: "CLINICAL25",
      offerCta: "Claim Regimen →",
      specTitle: "Clinical Efficacy Benchmarks",
      specs: [
        { title: "Pharmaceutical Grade Actives", desc: "Formulated with USP-grade raw materials with molecular weight targeting for maximum transdermal absorption." },
        { title: "Independent Double-Blind Trials", desc: "Tested across 120 patients over 6 weeks with quantifiable melanin index and sebum reductions." },
        { title: "Airless Vacuum Dispensers", desc: "Encapsulated in medical-grade airless pump chambers to prevent active ingredient oxidation." },
      ],
      pressLogos: ["DERM WORLD", "NEW BEAUTY", "ELLE LABS", "COSMO SCIENCE", "HEALTHLINE"],
      bundleTitle: "The Barrier Restoration Regimen",
      bundleDesc: "Bundle the 3 clinical powerhouses together and save $38 plus free priority medical shipping.",
      ugcCaptions: ["Hyperpigmentation faded in 4 weeks!", "Doctor recommended clinical line", "Look at this pore refinement", "Science-backed daily routine"],
      storySub: "Clinical Formulation Science",
      storyTitle: "Transparency Over Marketing Hype",
      storyBody: "Every single percentage in our bottles is backed by peer-reviewed dermatology literature. We list the exact percentage of every active on the front label, so you know exactly what is transforming your skin.",
      reviews: [
        { text: "This 10% Niacinamide + Zinc formula cleared my stubborn dark spots better than $200 treatments.", author: "Dr. James Liu", location: "Boston" },
        { text: "The peptide barrier cream transformed my retinoid-irritated skin overnight.", author: "Hannah Kim", location: "Seoul" },
        { text: "Honest concentrations, zero fluff, and results backed by science.", author: "Aarav Patel", location: "Bengaluru" },
      ],
      faqs: [
        { q: "How do I layer multiple active serums?", a: "Apply water-based actives first (e.g. Niacinamide), followed by concentrated actives (e.g. Vitamin C/Retinol), and seal with peptide moisturizer." },
        { q: "Can I use this with prescription Tretinoin?", a: "Our Barrier Recovery Serum is specifically formulated to soothe and support skin undergoing prescription retinoid therapy." },
        { q: "Are results third-party tested?", a: "Yes, all clinical claims are verified by independent double-blind dermatological trial laboratories." },
      ],
    };
  }

  if (id === "beauty-glamour-home") {
    return {
      announcement: "💎 HAUTE PARFUMERIE & LUXURY COSMETICS · COMPLIMENTARY DISCOVERY SET",
      marquee: ["GRASSE MASTER PERFUMER OILS", "24HR VELVET MATTE COUTURE", "HAND-CUT CRYSTAL ATOMIZERS", "VIP RED CARPET ARTISTRY"],
      heroTitle: "Editorial Haute Parfumerie & Velvet Lip Couture",
      heroDesc: "Extrait de Parfum steeped in Grasse rose oils and French vanilla, paired with weightless 24-hour velvet matte lips designed for the red carpet.",
      trustBadges: [
        { icon: "🌹", title: "Grasse Extraction", desc: "30% pure fragrance oil" },
        { icon: "💄", title: "24-Hour Wear", desc: "Transfer-proof velvet feel" },
        { icon: "✨", title: "Haute Packaging", desc: "Weighted crystal flacons" },
        { icon: "👑", title: "VIP Exclusive", desc: "Private batch releases" },
      ],
      categories: ["Extrait de Parfum", "Velvet Couture Lips", "Luminous Complexion"],
      offerBadge: "Haute Discovery Edit",
      offerTitle: "The VIP Red Carpet Discovery Vault",
      offerDesc: "Receive a complimentary 5-piece Extrait de Parfum discovery coffret ($65 value) with any 50ml flacon order today.",
      offerCode: "VIPHAUTE",
      offerCta: "Claim Discovery Vault →",
      specTitle: "The Standards of French Haute Parfumerie",
      specs: [
        { title: "35% Extrait Concentration", desc: "Hand-macerated for 6 months in Grasse with 35% pure fragrance absolutes for 18+ hour sillage." },
        { title: "24-Hour Transfer-Proof Lip Film", desc: "Proprietary polymer matrix locks pigment in place without drying, cracking, or feathering." },
        { title: "Hand-Polished Crystal Flacons", desc: "Heavyweight artisan crystal flacons with custom magnetic gold zamak caps." },
      ],
      pressLogos: ["VOGUE PARIS", "HARPER'S BAZAAR", "ELLE INT", "VANITY FAIR", "L'OFFICIEL"],
      bundleTitle: "The Haute Parfumerie & Lip Duo",
      bundleDesc: "Pair your 50ml Velvet Rose Extrait with a matching Haute Matte Lip Elixir and save $45.",
      ugcCaptions: ["The most intoxicating fragrance I own", "Velvet lips that lasted all night", "Opening this luxury box felt magical", "Red carpet glam at home"],
      storySub: "Grasse Heritage",
      storyTitle: "The Art of Haute Fragrance & Color Artistry",
      storyBody: "Formulated in the fragrance capital of Grasse, France, each bottle undergoes a 6-month maceration process to achieve unmatched longevity and complex olfactory depth.",
      reviews: [
        { text: "The silage and projection on the Velvet Rose Extrait is breathtaking. I get stopped on the street daily.", author: "Camille Dubois", location: "Paris" },
        { text: "The lipstick formula is pure silk. Zero drying, full pigmentation in one swipe.", author: "Zoe Kravitz Fan", location: "New York" },
        { text: "Absolute luxury from presentation to performance.", author: "Rhea Kapoor", location: "Mumbai" },
      ],
      faqs: [
        { q: "What fragrance concentration is used?", a: "We formulate exclusively at Extrait de Parfum concentration (30-35% pure perfume oils) for 16+ hour longevity." },
        { q: "Are your lip elixirs smudge-proof?", a: "Yes, our proprietary polymer network locks pigments in place without drying or feathering for up to 24 hours." },
        { q: "Can I sample before buying full size?", a: "Every full-size order includes a complimentary 2ml discovery vial so you can test before opening the seal." },
      ],
    };
  }

  if (id === "jewellery-heritage-home") {
    return {
      announcement: "👑 ROYAL POLKI & GOLD HEIRLOOMS · 100% BIS 916 HALLMARKED",
      marquee: ["BIS 916 HALLMARKED GOLD", "UNCUT SYNDICATE POLKI DIAMONDS", "LIFETIME BUYBACK & EXCHANGE", "INSURED DOORSTEP DELIVERY"],
      heroTitle: "Timeless Heirloom Polki & Gold Artistry",
      heroDesc: "Grand Jadau chokers, uncut syndicate polki diamonds, and 22kt hallmarked gold masterpieces created to be treasured across generations.",
      trustBadges: [
        { icon: "👑", title: "BIS 916 Hallmarked", desc: "Government purity certified" },
        { icon: "💎", title: "Uncut Syndicate Polki", desc: "Natural conflict-free stones" },
        { icon: "🔄", title: "Lifetime Exchange", desc: "100% value buyback promise" },
        { icon: "🛡️", title: "Fully Insured", desc: "Armored door delivery" },
      ],
      categories: ["Bridal Chokers", "Polki Bangles", "Kundan Jhumkas"],
      offerBadge: "Royal Heirloom Privilege",
      offerTitle: "Private Royal Bridal Suite Consultation",
      offerDesc: "Book an exclusive private video consultation with our Master Gemologists and receive a ₹25,000 making charge voucher.",
      offerCode: "ROYALSUITE",
      offerCta: "Book Royal Suite →",
      specTitle: "Royal Trust & Hallmarking Seals",
      specs: [
        { title: "BIS 916 Laser Hallmarking", desc: "Every jewel is laser inscribed with the official government HUID for 100% verifiable purity." },
        { title: "Natural Syndicate Polki Diamonds", desc: "Hand-selected uncut polki diamonds set in 24kt pure gold foil bezel jadau settings." },
        { title: "100% Lifetime Buyback Guarantee", desc: "Guaranteed lifetime buyback and exchange value at all our flagship royal boutiques." },
      ],
      pressLogos: ["VOGUE BRIDAL", "TOWN & COUNTRY", "ROBB REPORT INDIA", "HELLO! JEWELLERY", "GRAZIA"],
      bundleTitle: "The Grand Bridal Polki Set",
      bundleDesc: "Pair your Bridal Polki Choker with matching Chandbalis and Maang Tikka and save ₹45,000 / $550.",
      ugcCaptions: ["Wearing our family heirloom choker", "The polki luster is unmatched", "Custom bridal jewelry journey", "Generations of royal craftsmanship"],
      storySub: "Jadau Heritage",
      storyTitle: "Crafting Heirlooms That Transcend Generations",
      storyBody: "Each polki masterpiece is handcrafted using ancient Meenakari and Jadau techniques developed in the royal courts of Rajasthan. Over 180 hours of meticulous hand-setting go into every necklace.",
      reviews: [
        { text: "The craftsmanship on our bridal polki set left our entire family spellbound. The certificate and hallmark gave us complete trust.", author: "Sunita Singhania", location: "Jaipur" },
        { text: "Purchased for my daughter's wedding. The weight and authenticity of the 22kt gold work is sublime.", author: "Rajeshwari Devi", location: "Udaipur" },
        { text: "Seamless international insured delivery to London. Exceeded all expectations.", author: "Meera Patel", location: "London" },
      ],
      faqs: [
        { q: "How is purity verified?", a: "Every piece bears government-authorized BIS 916 laser hallmarking along with a third-party gemstone certification card." },
        { q: "What is the buyback and exchange policy?", a: "We guarantee 100% gold value and 90% polki diamond value on lifetime exchanges at any of our suites." },
        { q: "Can I customize the gemstone drops?", a: "Yes, we customize pearls, Colombian emeralds, and Burmese rubies upon request during styling consultation." },
      ],
    };
  }

  if (id === "jewellery-diamond-home") {
    return {
      announcement: "💍 CERTIFIED FINE DIAMONDS · IGI & GIA CERTIFICATES INCLUDED",
      marquee: ["IGI & GIA CERTIFIED DIAMONDS", "LIFETIME WARRANTY & FREE SIZING", "100% CONFLICT-FREE SOURCING", "30-DAY PRICE MATCH GUARANTEE"],
      heroTitle: "Exceptional Modern Solitaire Diamonds",
      heroDesc: "Master-cut brilliant lab and natural diamond engagement rings, eternity tennis bracelets, and modern fine pendants crafted with optical perfection.",
      trustBadges: [
        { icon: "💎", title: "4Cs Certified", desc: "Triple Excellent Cut grades" },
        { icon: "📜", title: "GIA / IGI Verified", desc: "Individual certificate cards" },
        { icon: "📏", title: "Free Resizing", desc: "Lifetime complimentary care" },
        { icon: "🛡️", title: "Conflict Free", desc: "Ethically synthesized & mined" },
      ],
      categories: ["Solitaire Rings", "Tennis Bracelets", "Diamond Pendants"],
      offerBadge: "Custom Ring Privilege",
      offerTitle: "Design Your Custom Engagement Ring",
      offerDesc: "Get $150 towards your custom ring setting when you select any certified 1.0ct+ center solitaire diamond.",
      offerCode: "SOLITAIRE150",
      offerCta: "Start Custom Ring →",
      specTitle: "The Optical Precision Standard",
      specs: [
        { title: "Triple Excellent Cut Grades", desc: "Precision cut to maximize optical light refraction, fire, and brilliance with zero light leakage." },
        { title: "IGI & GIA Individual Certificates", desc: "Every diamond comes with physical and digital laser-inscribed certificates." },
        { title: "Recycled Solid Platinum & 18K", desc: "Cast in heavy-gauge 950 platinum or 18k solid gold with comfort-fit inner shank curves." },
      ],
      pressLogos: ["BRIDES", "THE KNOT", "FORBES LIFE", "ROBB REPORT", "ELLE"],
      bundleTitle: "The Solitaire & Eternity Band Duo",
      bundleDesc: "Match your Engagement Ring with an Eternity Lab Diamond Band and save $250 automatically.",
      ugcCaptions: ["She said YES! 💍✨", "The fire and sparkle is insane", "1.5ct Oval Solitaire perfection", "Stacking my eternity bands"],
      storySub: "Precision Cutters",
      storyTitle: "Engineered For Unrivaled Brilliance",
      storyBody: "We cut our diamonds to exact mathematical proportions to maximize light return, optical symmetry, and fire. Every diamond is individually inspected by senior gemologists.",
      reviews: [
        { text: "The ring was appraised at 40% higher than what I paid. The sparkle in natural sunlight is breathtaking.", author: "Alex Mitchell", location: "Chicago" },
        { text: "Custom built my fiancée's dream ring in 2 weeks. Customer service was phenomenal.", author: "Vikram Malhotra", location: "Delhi" },
        { text: "My tennis bracelet has not left my wrist since the day I received it. Pure luxury.", author: "Grace Taylor", location: "Sydney" },
      ],
      faqs: [
        { q: "Are your diamonds certified?", a: "Every diamond above 0.30ct includes an original grading certificate from IGI or GIA specifying exact Cut, Color, Clarity, and Carat." },
        { q: "What if the ring size is incorrect?", a: "We offer complimentary doorstep ring resizing within 60 days of delivery." },
        { q: "What is the difference between lab and natural diamonds?", a: "Lab diamonds are chemically, physically, and optically identical to mined diamonds, sharing the same 10/10 Mohs hardness and crystal structure." },
      ],
    };
  }

  if (id === "jewellery-silver-home") {
    return {
      announcement: "✨ ARTISAN 925 STERLING SILVER · ANTI-TARNISH LIFETIME PROMISE",
      marquee: ["925 SOLID STERLING SILVER", "RHODIUM ANTI-TARNISH COATING", "NICKEL-FREE & HYPOALLERGENIC", "FAIR-WAGE ARTISAN WORKSHOPS"],
      heroTitle: "Bohemian Handcrafted 925 Sterling Silver",
      heroDesc: "Hammered sterling silver cuffs, everyday stacking rings, and raw gemstone charms crafted for daily wear with advanced anti-tarnish rhodium shielding.",
      trustBadges: [
        { icon: "🥈", title: "925 Solid Silver", desc: "Stamped authenticity hallmark" },
        { icon: "🛡️", title: "Anti-Tarnish Seal", desc: "Rhodium protected finish" },
        { icon: "🌿", title: "Hypoallergenic", desc: "100% nickel & lead free" },
        { icon: "🤝", title: "Fair-Wage Artisans", desc: "Supporting master smiths" },
      ],
      categories: ["Everyday Stacking Rings", "Hammered Cuffs", "Boho Statement Hoops"],
      offerBadge: "Stack Builder Offer",
      offerTitle: "Build Your 3-Piece Silver Stack",
      offerDesc: "Pick any 3 stacking rings or cuffs and get 25% off + a complimentary silver polishing kit & leather pouch.",
      offerCode: "STACK25",
      offerCta: "Build Ring Stack →",
      specTitle: "Artisan Craftsmanship & Durability",
      specs: [
        { title: "Solid 925 Sterling Silver", desc: "92.5% pure solid silver alloyed with copper for structural durability, stamped with 925 hallmark." },
        { title: "Triple Rhodium Barrier", desc: "Shielded with electroplated rhodium to prevent oxidation, skin greening, and tarnishing." },
        { title: "100% Nickel & Lead Free", desc: "Certified hypoallergenic and safe for sensitive ears and everyday skin contact." },
      ],
      pressLogos: ["CONDE NAST TRAVELER", "REFINERY29", "DAZED", "GLAMOUR", "NYLON"],
      bundleTitle: "The Bohemian Everyday Trio",
      bundleDesc: "Bundle the Hammered Cuff + Turquoise Ring + Twisted Hoops and save $45.",
      ugcCaptions: ["Worn every day for 6 months without tarnishing", "My everyday silver ring stack", "Hand-hammered texture is so unique", "Hypoallergenic and so comfortable"],
      storySub: "Village Silversmiths",
      storyTitle: "Hand-Hammered Textures With Modern Durability",
      storyBody: "We blend traditional hand-hammering techniques with modern electro-plated rhodium barriers, ensuring that your silver stays bright and untarnished through workouts, showers, and daily life.",
      reviews: [
        { text: "I have sensitive skin and usually react to cheap metals. These 925 silver rings are completely irritation-free.", author: "Hannah S.", location: "Toronto" },
        { text: "The hammered texture catches the light so beautifully. Sturdy, solid silver.", author: "Tanvi Kapur", location: "Pune" },
        { text: "Great packaging and came with a complimentary polishing cloth. Highly recommend!", author: "Chloe Martin", location: "Manchester" },
      ],
      faqs: [
        { q: "Can I wear this jewelry in the shower?", a: "Yes, our rhodium-shielded 925 silver is waterproof. We recommend drying with a soft cloth after water exposure." },
        { q: "How do I clean my silver?", a: "Gently buff with the included micro-fiber silver polishing cloth to instantly restore mirror-like luster." },
        { q: "Is the silver stamped 925?", a: "Every single piece carries the authentic '925' purity stamp." },
      ],
    };
  }

  // Tech
  return {
    announcement: "⚡ HI-RES AUDIO & CYBER GEAR · 2-YEAR ADVANCED HARDWARE REPLACEMENT",
    marquee: ["LDAC LOSSLESS HI-RES WIRELESS", "40MM BERYLLIUM ACOUSTIC DRIVERS", "ULTRA-LOW 20MS LATENCY", "IPX8 WATERPROOF RATING"],
    heroTitle: "Precision Engineered Cyber Audio & Tech",
    heroDesc: "Audiophile-grade acoustic drivers, spatial audio tracking, and aerospace magnesium chassis designed for creators, gamers, and discerning listeners.",
    trustBadges: [
      { icon: "🎧", title: "LDAC Lossless Audio", desc: "990kbps 24-bit/96kHz sound" },
      { icon: "⚡", title: "20ms Low Latency", desc: "Seamless gaming & mixing" },
      { icon: "🔋", title: "60-Hour Battery", desc: "Fast USB-C power delivery" },
      { icon: "🛡️", title: "2-Year Warranty", desc: "Immediate replacement cover" },
    ],
    categories: ["Pro Wireless Cans", "True Wireless Buds", "Studio DAC Amps"],
    offerBadge: "Studio Hardware Drop",
    offerTitle: "The Complete Cyber Audiophile Bundle",
    offerDesc: "Get the Spatial Pro Headphones + Magnetic 3-in-1 Dock + Lossless Studio DAC and save $85 with free expedited courier dispatch.",
    offerCode: "CYBERAUDIO85",
    offerCta: "Claim Audio Bundle →",
    specTitle: "Audiophile-Grade Acoustic Hardware",
    specs: [
      { title: "40mm Beryllium Drivers", desc: "Ultra-rigid beryllium diaphragms deliver lightning-fast transient response with <0.02% harmonic distortion." },
      { title: "Sony LDAC 990kbps Codec", desc: "Transmits 3x more data than standard Bluetooth for true lossless 24-bit/96kHz master audio." },
      { title: "Aerospace Magnesium Chassis", desc: "Ultra-lightweight magnesium alloy frame with cooling memory foam magnetic ear pads." },
    ],
    pressLogos: ["WIRED", "THE VERGE", "SOUNDGUYS", "TECHCRUNCH", "ENGADGET"],
    bundleTitle: "The Studio Master Setup Bundle",
    bundleDesc: "Bundle the Spatial Pro Cans + Desktop Aluminum Stand + Braided Balanced Cable and save $65.",
    ugcCaptions: ["Soundstage on these is unbelievably wide", "My ultimate desk setup piece", "Noise cancellation silences the entire office", "Beryllium drivers hit so clean"],
    storySub: "Acoustic Engineering",
    storyTitle: "Tuned For Pure Acoustic Transparency",
    storyBody: "We spent 2,400 hours in anechoic chambers measuring frequency response curves to eliminate harmonic distortion. What you hear is the artist's original studio master, uncolored and pristine.",
    reviews: [
      { text: "Blew my $500 studio monitors out of the water. The instrument separation is staggering.", author: "Dave Miller", location: "Seattle" },
      { text: "ANC is top tier and the build quality feels like titanium. Best headphones I have ever owned.", author: "Rohan Varma", location: "Hyderabad" },
      { text: "Fast shipping and companion EQ app lets you tune every frequency band.", author: "Kevin Zhang", location: "Austin" },
    ],
    faqs: [
      { q: "What Bluetooth codecs are supported?", a: "We support LDAC, aptX Adaptive, AAC, and SBC with automatic bitrate switching." },
      { q: "Does it support multipoint pairing?", a: "Yes, you can stay connected to your laptop and smartphone simultaneously with seamless instant handover." },
      { q: "What is the warranty coverage?", a: "All hardware comes with 2 years of no-questions-asked advance replacement warranty." },
    ],
  };
}

function getProductsForComp(id: string, niche: string) {
  if (id === "streetwear-cyber-home") {
    return [
      { title: "Heavyweight Boxy Hoodie (480 GSM)", price: "$88.00", reviews: "342", pill: "Bestseller", img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80" },
      { title: "Oversized Vintage Acid Tee", price: "$44.00", reviews: "189", pill: "Trending", img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80" },
      { title: "Tactical Cargo Pants v2", price: "$110.00", reviews: "94", pill: "Limited", img: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&q=80" },
      { title: "Cyber Reflective Windbreaker", price: "$145.00", reviews: "210", pill: "New Drop", img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80" },
    ];
  }
  if (id === "ethnic-royal-home") {
    return [
      { title: "Royal Crimson Bridal Zari Lehenga", price: "$650.00", reviews: "142", pill: "Bridal Heirloom", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80" },
      { title: "Pure Katan Banarasi Silk Saree", price: "$290.00", reviews: "215", pill: "Handwoven", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80" },
      { title: "Zardozi Embroidered Silk Anarkali", price: "$380.00", reviews: "98", pill: "Festive Edit", img: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80" },
      { title: "Handcrafted Velvet Sherwani Dupatta", price: "$175.00", reviews: "64", pill: "Royal Edition", img: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800&q=80" },
    ];
  }
  if (id === "apparel-minimal-home") {
    return [
      { title: "Relaxed Heavyweight Organic T-Shirt", price: "$38.00", reviews: "410", pill: "GOTS Organic", img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80" },
      { title: "Merino Wool Everyday Crewneck", price: "$98.00", reviews: "285", pill: "Pure Merino", img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80" },
      { title: "Tailored French Linen Trouser", price: "$85.00", reviews: "160", pill: "Zero Waste", img: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=800&q=80" },
      { title: "Minimalist Poplin Overshirt", price: "$78.00", reviews: "192", pill: "Capsule Essential", img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80" },
    ];
  }
  if (id === "beauty-organic-home") {
    return [
      { title: "Triple Ceramide Barrier Glow Serum", price: "$48.00", reviews: "512", pill: "Top Rated", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80" },
      { title: "Centella Soothing Recovery Cream", price: "$36.00", reviews: "284", pill: "Clean 100%", img: "https://images.unsplash.com/photo-1608248597359-0a69a19c7f99?w=800&q=80" },
      { title: "Bakuchiol Botanical Night Oil", price: "$62.00", reviews: "178", pill: "Derm Approved", img: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=800&q=80" },
      { title: "Rosehip & Vitamin C Radiance Mist", price: "$28.00", reviews: "310", pill: "Bestseller", img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80" },
    ];
  }
  if (id === "beauty-clinical-home") {
    return [
      { title: "10% Niacinamide + 2% Zinc Serum", price: "$38.00", reviews: "680", pill: "Clinical Active", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80" },
      { title: "Multi-Peptide Matrixyl 3000 Elixir", price: "$52.00", reviews: "420", pill: "98% Barrier Repair", img: "https://images.unsplash.com/photo-1608248597359-0a69a19c7f99?w=800&q=80" },
      { title: "0.5% Encapsulated Retinol Complex", price: "$44.00", reviews: "315", pill: "Derm Tested", img: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=800&q=80" },
      { title: "Ceramide Lipid Repair Balm", price: "$32.00", reviews: "290", pill: "Hypoallergenic", img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80" },
    ];
  }
  if (id === "beauty-glamour-home") {
    return [
      { title: "Velvet Rose Extrait de Parfum (50ml)", price: "$145.00", reviews: "380", pill: "Grasse Extract", img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80" },
      { title: "Haute Matte 24Hr Liquid Lip Elixir", price: "$34.00", reviews: "520", pill: "Transfer Proof", img: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80" },
      { title: "Champagne Shimmer Silk Highlighter", price: "$42.00", reviews: "210", pill: "Red Carpet", img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80" },
      { title: "Amber & Vanilla Nectar Extrait", price: "$165.00", reviews: "195", pill: "Exclusive Flacon", img: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&q=80" },
    ];
  }
  if (id === "jewellery-heritage-home") {
    return [
      { title: "Royal Nizam Polki Choker Necklace", price: "$850.00", reviews: "115", pill: "BIS 916 Gold", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80" },
      { title: "Uncut Syndicate Polki Chandbali", price: "$340.00", reviews: "180", pill: "Heirloom Jadau", img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80" },
      { title: "Meenakari Emerald Kada Bangle", price: "$420.00", reviews: "92", pill: "Handcrafted", img: "https://images.unsplash.com/photo-1611591475152-47e24c65d7f7?w=800&q=80" },
      { title: "Kundan & South Sea Pearl Maang Tikka", price: "$195.00", reviews: "140", pill: "Bridal Suite", img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80" },
    ];
  }
  if (id === "jewellery-diamond-home") {
    return [
      { title: "1.5ct Solitaire Oval Diamond Ring", price: "$920.00", reviews: "310", pill: "GIA / IGI", img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80" },
      { title: "4.0ct Brilliant Tennis Bracelet", price: "$1,450.00", reviews: "195", pill: "Triple Excellent", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80" },
      { title: "Bezel Set Floating Diamond Pendant", price: "$480.00", reviews: "260", pill: "Everyday Luxe", img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80" },
      { title: "Eternity Lab Diamond Stacking Band", price: "$390.00", reviews: "185", pill: "Lifetime Warranty", img: "https://images.unsplash.com/photo-1611591475152-47e24c65d7f7?w=800&q=80" },
    ];
  }
  if (id === "jewellery-silver-home") {
    return [
      { title: "Artisan 925 Silver Hammered Cuff", price: "$125.00", reviews: "318", pill: "Solid 925", img: "https://images.unsplash.com/photo-1611591475152-47e24c65d7f7?w=800&q=80" },
      { title: "Boho Turquoise Stacking Ring Set", price: "$68.00", reviews: "410", pill: "Anti-Tarnish", img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80" },
      { title: "Chunky Twisted Silver Hoop Earrings", price: "$54.00", reviews: "230", pill: "Hypoallergenic", img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80" },
      { title: "Vintage Coin Pendant Necklace", price: "$82.00", reviews: "175", pill: "Fair Wage", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80" },
    ];
  }
  // tech
  return [
    { title: "Spatial Pro Noise-Cancelling Headphones", price: "$299.00", reviews: "680", pill: "LDAC Hi-Res", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80" },
    { title: "Magnetic 3-in-1 Fast Wireless Dock", price: "$89.00", reviews: "320", pill: "MagSafe Fast", img: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80" },
    { title: "Lossless Studio Audio Interface 24-bit", price: "$180.00", reviews: "154", pill: "Pro Audio", img: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80" },
    { title: "Ultra-Slim Mechanical Ergonomic Board", price: "$149.00", reviews: "412", pill: "Hot Swap", img: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80" },
  ];
}

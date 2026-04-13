import { json } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { useState } from "react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return json({ ok: true });
};

/* ── Premium SVG Icon Library ── */
const SVG = {
  truck: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
  heart: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  leaf: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75"/></svg>`,
  shield: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>`,
  microscope: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/></svg>`,
  star: `<svg width="14" height="14" viewBox="0 0 24 24" fill="#F5A623" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  sparkle: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,
  droplet: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>`,
  flask: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16.5h10"/></svg>`,
  sun: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
  eye: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>`,
  shieldCheck: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>`,
  globe: `<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,
  package: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
  users: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  check: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#27ae60" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  skincare: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 2h6l1 7H8l1-7Z"/><path d="M8 9v10a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3V9"/><line x1="8" y1="13" x2="16" y2="13"/></svg>`,
  haircare: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2C6.5 2 2 6.5 2 12c0 .7.1 1.4.2 2"/><path d="M20 16.5c1.3-1.8 2-3.9 2-6.5 0-5.5-4.5-10-10-10"/><path d="M9 22c1.6 0 3-1.3 3-3v-2c0-1.7-1.4-3-3-3s-3 1.3-3 3v2c0 1.7 1.4 3 3 3Z"/></svg>`,
  makeup: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2Z"/><path d="M9 2h6"/><path d="M12 2v5"/><path d="M8 7h8l-1 13H9L8 7Z"/></svg>`,
  fragrance: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 5h4"/><path d="M11 2h2v3h-2z"/><path d="M7 5h10l1 17H6L7 5Z"/><path d="M6 10h12"/><path d="M9 10v7"/><path d="M12 10v7"/><path d="M15 10v7"/></svg>`,
  rocket: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`,
  desktop: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  tablet: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>`,
  mobile: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>`,
  zap: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
};

const icon = (name, size) => {
  const s = SVG[name] || "";
  return <span dangerouslySetInnerHTML={{ __html: s }} style={{ display: "inline-flex", alignItems: "center" }} />;
};

/* ── Star Rating Component ── */
const Stars = ({ count = 5 }) => (
  <span style={{ display: "inline-flex", gap: 1 }}>
    {Array.from({ length: count }).map((_, i) => (
      <span key={i} dangerouslySetInnerHTML={{ __html: SVG.star }} />
    ))}
  </span>
);

export default function Index() {
  const [previewMode, setPreviewMode] = useState("desktop");
  const fetcher = useFetcher();
  const isInjecting = fetcher.state === "submitting";
  const injectResult = fetcher.data;

  const viewportWidth = { desktop: "100%", tablet: "768px", mobile: "375px" }[previewMode];

  const handleInject = () => {
    fetcher.submit({}, { method: "POST", action: "/api/inject-template" });
  };

  // Premium SVG-based preview HTML (no emojis)
  const previewHTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'DM Sans', sans-serif; color: #1a1a1a; line-height: 1.6; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
.icon { display: inline-flex; align-items: center; justify-content: center; }

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
.cf-hero-visual { width: 100%; max-width: 460px; aspect-ratio: 4/5; background: linear-gradient(135deg, #f0e6da, #e8d5c4); border-radius: 20px; display: flex; align-items: center; justify-content: center; }
.cf-hero-float { position: absolute; background: #fff; border-radius: 16px; padding: 14px 20px; box-shadow: 0 8px 30px rgba(0,0,0,0.08); font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 10px; animation: cf-float 3s ease-in-out infinite; }
.cf-hero-float.top-right { top: 20px; right: -10px; }
.cf-hero-float.bottom-left { bottom: 30px; left: -10px; }
.cf-label { font-size: 11px; color: #999; }
.cf-val { font-weight: 800; }
@keyframes cf-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }

/* Trust */
.cf-trust-bar { background: #FAF7F2; border-top: 1px solid rgba(0,0,0,0.05); border-bottom: 1px solid rgba(0,0,0,0.05); padding: 18px 20px; }
.cf-trust-inner { max-width: 1280px; margin: 0 auto; display: flex; justify-content: space-around; align-items: center; flex-wrap: wrap; gap: 12px; }
.cf-trust-item { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 600; color: #333; }
.cf-trust-icon { color: #C17F5E; display: flex; align-items: center; }

/* Section heads */
.cf-section-head { text-align: center; margin-bottom: 48px; }
.cf-overline { font-size: 12px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #C17F5E; margin-bottom: 12px; display: block; }
.cf-section-head h2 { font-size: 34px; font-weight: 800; margin-bottom: 12px; letter-spacing: -0.3px; }
.cf-section-head p { font-size: 15px; color: #777; max-width: 560px; margin: 0 auto; }

/* Categories */
.cf-categories { padding: 70px 40px; max-width: 1280px; margin: 0 auto; }
.cf-cat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.cf-cat-card { position: relative; border-radius: 16px; overflow: hidden; aspect-ratio: 3/4; cursor: pointer; text-decoration: none; color: #fff; display: block; }
.cf-cat-visual { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; transition: transform 0.6s ease; color: rgba(255,255,255,0.5); }
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
.cf-prod-img { position: relative; aspect-ratio: 1; overflow: hidden; background: #faf7f2; display: flex; align-items: center; justify-content: center; color: #d4a574; }
.cf-prod-badge { position: absolute; top: 12px; left: 12px; color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 10px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; }
.cf-prod-badge.best { background: #E67E22; }
.cf-prod-badge.new { background: #2ECC71; }
.cf-prod-badge.hot { background: #E74C3C; }
.cf-prod-info { padding: 18px; }
.cf-prod-name { font-size: 14px; font-weight: 600; line-height: 1.4; margin-bottom: 6px; }
.cf-prod-rating { display: flex; align-items: center; gap: 4px; margin-bottom: 8px; font-size: 12px; color: #999; }
.cf-star-row { display:flex; gap:1px; }
.cf-star { color: #F5A623; }
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
.cf-ingr-icon { width: 56px; height: 56px; border-radius: 50%; background: #FFF0E5; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; color: #C17F5E; }
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
.cf-story-visual { width: 100%; aspect-ratio: 4/3; background: linear-gradient(135deg, #3a3a3a, #555); border-radius: 20px; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.3); }

/* Reviews */
.cf-reviews { padding: 70px 40px; background: #fff; }
.cf-reviews-inner { max-width: 1280px; margin: 0 auto; }
.cf-rev-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.cf-rev-card { background: #FAF7F2; border-radius: 16px; padding: 28px; border: 1px solid #f0ebe5; }
.cf-rev-stars { color: #F5A623; font-size: 15px; margin-bottom: 14px; display: flex; gap: 2px; }
.cf-rev-text { font-size: 14px; color: #444; line-height: 1.7; margin-bottom: 18px; font-style: italic; }
.cf-rev-author { display: flex; align-items: center; gap: 12px; }
.cf-rev-avatar { width: 40px; height: 40px; border-radius: 50%; background: #C17F5E; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 15px; }
.cf-rev-name { font-size: 13px; font-weight: 700; }
.cf-rev-verified { font-size: 11px; color: #27ae60; display: flex; align-items: center; gap: 4px; }

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

.star-svg { display: inline-block; }

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
  <div class="cf-announce">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
    <span>FLAT 20% OFF on your first order</span>
    <a href="#">Shop Now →</a>
  </div>

  <div class="cf-hero">
    <div class="cf-hero-inner">
      <div>
        <span class="cf-hero-badge">NEW COLLECTION</span>
        <h1>Discover Your<br><span>Natural Glow</span></h1>
        <p class="cf-hero-sub">Premium skincare powered by ancient beauty secrets from around the world. Vegan, cruelty-free, and FDA approved.</p>
        <a href="#" class="cf-hero-cta">Explore Collection <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
      </div>
      <div class="cf-hero-img-wrap">
        <div class="cf-hero-visual"><svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" stroke-width="1"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75"/></svg></div>
        <div class="cf-hero-float top-right">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C17F5E" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          <div><div class="cf-label">Rating</div><div class="cf-val">4.9 / 5.0</div></div>
        </div>
        <div class="cf-hero-float bottom-left">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C17F5E" stroke-width="2"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
          <div><div class="cf-label">Products</div><div class="cf-val">200+ SKUs</div></div>
        </div>
      </div>
    </div>
  </div>

  <div class="cf-trust-bar">
    <div class="cf-trust-inner">
      <div class="cf-trust-item"><span class="cf-trust-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg></span> Free Shipping above ₹499</div>
      <div class="cf-trust-item"><span class="cf-trust-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></span> Cruelty Free</div>
      <div class="cf-trust-item"><span class="cf-trust-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75"/></svg></span> 100% Vegan</div>
      <div class="cf-trust-item"><span class="cf-trust-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg></span> FDA Approved</div>
      <div class="cf-trust-item"><span class="cf-trust-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/></svg></span> Dermat Tested</div>
    </div>
  </div>

  <div class="cf-categories">
    <div class="cf-section-head"><span class="cf-overline">Explore</span><h2>Shop by Category</h2><p>Find the perfect products for your beauty routine</p></div>
    <div class="cf-cat-grid">
      <a href="#" class="cf-cat-card"><div class="cf-cat-visual" style="background:linear-gradient(135deg,#FADADD,#F8C8DC)"><svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M9 2h6l1 7H8l1-7Z"/><path d="M8 9v10a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3V9"/><line x1="8" y1="13" x2="16" y2="13"/></svg></div><div class="cf-cat-overlay"><h3>Skin Care</h3><span>45+ Products</span></div></a>
      <a href="#" class="cf-cat-card"><div class="cf-cat-visual" style="background:linear-gradient(135deg,#E8D5B7,#C9A96E)"><svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M12 2C6.5 2 2 6.5 2 12c0 .7.1 1.4.2 2"/><path d="M20 16.5c1.3-1.8 2-3.9 2-6.5 0-5.5-4.5-10-10-10"/><path d="M9 22c1.6 0 3-1.3 3-3v-2c0-1.7-1.4-3-3-3s-3 1.3-3 3v2c0 1.7 1.4 3 3 3Z"/></svg></div><div class="cf-cat-overlay"><h3>Hair Care</h3><span>35+ Products</span></div></a>
      <a href="#" class="cf-cat-card"><div class="cf-cat-visual" style="background:linear-gradient(135deg,#FFD1DC,#FF9EBA)"><svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2Z"/><path d="M9 2h6"/><path d="M12 2v5"/><path d="M8 7h8l-1 13H9L8 7Z"/></svg></div><div class="cf-cat-overlay"><h3>Makeup</h3><span>30+ Products</span></div></a>
      <a href="#" class="cf-cat-card"><div class="cf-cat-visual" style="background:linear-gradient(135deg,#E6E0F8,#D4C5F9)"><svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M10 5h4"/><path d="M11 2h2v3h-2z"/><path d="M7 5h10l1 17H6L7 5Z"/><path d="M6 10h12"/></svg></div><div class="cf-cat-overlay"><h3>Fragrances</h3><span>20+ Products</span></div></a>
    </div>
  </div>

  <div class="cf-products"><div class="cf-products-inner">
    <div class="cf-section-head"><span class="cf-overline">Most Loved</span><h2>Bestselling Products</h2><p>Trusted by 5 million+ customers across India</p></div>
    <div class="cf-prod-grid">
      <a href="#" class="cf-prod-card"><div class="cf-prod-img"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 2h6l1 7H8l1-7Z"/><path d="M8 9v10a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3V9"/></svg><span class="cf-prod-badge best">BESTSELLER</span></div><div class="cf-prod-info"><div class="cf-prod-name">10% Vitamin C Face Serum</div><div class="cf-prod-rating"><span class="cf-star-row"><svg width="13" height="13" viewBox="0 0 24 24" fill="#F5A623" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="13" height="13" viewBox="0 0 24 24" fill="#F5A623" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="13" height="13" viewBox="0 0 24 24" fill="#F5A623" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="13" height="13" viewBox="0 0 24 24" fill="#F5A623" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="13" height="13" viewBox="0 0 24 24" fill="#F5A623" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span><span>4,523</span></div><div class="cf-prod-price"><span class="cf-current">₹599</span><span class="cf-original">₹799</span><span class="cf-discount">25% OFF</span></div><button class="cf-prod-atc">ADD TO CART</button></div></a>
      <a href="#" class="cf-prod-card"><div class="cf-prod-img"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg><span class="cf-prod-badge new">TRENDING</span></div><div class="cf-prod-info"><div class="cf-prod-name">Korean Rice Water Moisturizer</div><div class="cf-prod-rating"><span class="cf-star-row"><svg width="13" height="13" viewBox="0 0 24 24" fill="#F5A623" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="13" height="13" viewBox="0 0 24 24" fill="#F5A623" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="13" height="13" viewBox="0 0 24 24" fill="#F5A623" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="13" height="13" viewBox="0 0 24 24" fill="#F5A623" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="13" height="13" viewBox="0 0 24 24" fill="#F5A623" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span><span>3,182</span></div><div class="cf-prod-price"><span class="cf-current">₹499</span><span class="cf-original">₹699</span><span class="cf-discount">29% OFF</span></div><button class="cf-prod-atc">ADD TO CART</button></div></a>
      <a href="#" class="cf-prod-card"><div class="cf-prod-img"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2C6.5 2 2 6.5 2 12c0 .7.1 1.4.2 2"/><path d="M20 16.5c1.3-1.8 2-3.9 2-6.5 0-5.5-4.5-10-10-10"/><path d="M9 22c1.6 0 3-1.3 3-3v-2c0-1.7-1.4-3-3-3s-3 1.3-3 3v2c0 1.7 1.4 3 3 3Z"/></svg><span class="cf-prod-badge best">BESTSELLER</span></div><div class="cf-prod-info"><div class="cf-prod-name">Redensyl Hair Growth Serum</div><div class="cf-prod-rating"><span class="cf-star-row"><svg width="13" height="13" viewBox="0 0 24 24" fill="#F5A623" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="13" height="13" viewBox="0 0 24 24" fill="#F5A623" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="13" height="13" viewBox="0 0 24 24" fill="#F5A623" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="13" height="13" viewBox="0 0 24 24" fill="#F5A623" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="13" height="13" viewBox="0 0 24 24" fill="#F5A623" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span><span>5,847</span></div><div class="cf-prod-price"><span class="cf-current">₹699</span><span class="cf-original">₹899</span><span class="cf-discount">22% OFF</span></div><button class="cf-prod-atc">ADD TO CART</button></div></a>
      <a href="#" class="cf-prod-card"><div class="cf-prod-img"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/></svg><span class="cf-prod-badge hot">HOT</span></div><div class="cf-prod-info"><div class="cf-prod-name">25% AHA BHA Peeling Solution</div><div class="cf-prod-rating"><span class="cf-star-row"><svg width="13" height="13" viewBox="0 0 24 24" fill="#F5A623" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="13" height="13" viewBox="0 0 24 24" fill="#F5A623" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="13" height="13" viewBox="0 0 24 24" fill="#F5A623" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="13" height="13" viewBox="0 0 24 24" fill="#F5A623" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="13" height="13" viewBox="0 0 24 24" fill="#F5A623" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span><span>2,156</span></div><div class="cf-prod-price"><span class="cf-current">₹549</span><span class="cf-original">₹749</span><span class="cf-discount">27% OFF</span></div><button class="cf-prod-atc">ADD TO CART</button></div></a>
    </div>
  </div></div>

  <div class="cf-ingredients"><div class="cf-ingredients-inner">
    <div class="cf-section-head"><span class="cf-overline">Powered By Science</span><h2>Shop by Ingredients</h2><p>Clinically proven ingredients for visible results</p></div>
    <div class="cf-ingr-grid">
      <div class="cf-ingr-card"><div class="cf-ingr-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg></div><h4>Vitamin C</h4><p>Brightening & Glow</p></div>
      <div class="cf-ingr-card"><div class="cf-ingr-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg></div><h4>Hyaluronic Acid</h4><p>Deep Hydration</p></div>
      <div class="cf-ingr-card"><div class="cf-ingr-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg></div><h4>Niacinamide</h4><p>Acne & Oil Control</p></div>
      <div class="cf-ingr-card"><div class="cf-ingr-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/></svg></div><h4>Retinol</h4><p>Anti-Ageing</p></div>
      <div class="cf-ingr-card"><div class="cf-ingr-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/></svg></div><h4>Salicylic Acid</h4><p>Pore Cleansing</p></div>
      <div class="cf-ingr-card"><div class="cf-ingr-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg></div><h4>Ceramides</h4><p>Skin Barrier</p></div>
    </div>
  </div></div>

  <div class="cf-story"><div class="cf-story-inner">
    <div><span class="cf-story-overline">Our Story</span><h2>Beauty Secrets From Around The World</h2><p>We travel the globe to discover the most powerful natural ingredients and bring them to you in beautifully crafted formulations. No harmful chemicals, no animal testing — just pure, effective skincare.</p>
    <div class="cf-story-stats"><div class="cf-story-stat"><h3>5M+</h3><span>Happy Customers</span></div><div class="cf-story-stat"><h3>200+</h3><span>Products</span></div><div class="cf-story-stat"><h3>50+</h3><span>Active Ingredients</span></div></div></div>
    <div class="cf-story-visual"><svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg></div>
  </div></div>

  <div class="cf-reviews"><div class="cf-reviews-inner">
    <div class="cf-section-head"><span class="cf-overline">Real Results</span><h2>What Our Customers Say</h2></div>
    <div class="cf-rev-grid">
      <div class="cf-rev-card"><div class="cf-rev-stars"><svg width="14" height="14" viewBox="0 0 24 24" fill="#F5A623"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="14" height="14" viewBox="0 0 24 24" fill="#F5A623"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="14" height="14" viewBox="0 0 24 24" fill="#F5A623"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="14" height="14" viewBox="0 0 24 24" fill="#F5A623"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="14" height="14" viewBox="0 0 24 24" fill="#F5A623"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div><p class="cf-rev-text">"The Vitamin C serum gave me visible results in just 2 weeks. My skin looks so much brighter and smoother now!"</p><div class="cf-rev-author"><div class="cf-rev-avatar">P</div><div><div class="cf-rev-name">Priya S.</div><div class="cf-rev-verified"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#27ae60" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg> Verified Purchase</div></div></div></div>
      <div class="cf-rev-card"><div class="cf-rev-stars"><svg width="14" height="14" viewBox="0 0 24 24" fill="#F5A623"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="14" height="14" viewBox="0 0 24 24" fill="#F5A623"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="14" height="14" viewBox="0 0 24 24" fill="#F5A623"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="14" height="14" viewBox="0 0 24 24" fill="#F5A623"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="14" height="14" viewBox="0 0 24 24" fill="#F5A623"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div><p class="cf-rev-text">"Been using the Rice Water Moisturizer for a month. My dry patches are completely gone. Best moisturizer ever!"</p><div class="cf-rev-author"><div class="cf-rev-avatar">A</div><div><div class="cf-rev-name">Ananya K.</div><div class="cf-rev-verified"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#27ae60" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg> Verified Purchase</div></div></div></div>
      <div class="cf-rev-card"><div class="cf-rev-stars"><svg width="14" height="14" viewBox="0 0 24 24" fill="#F5A623"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="14" height="14" viewBox="0 0 24 24" fill="#F5A623"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="14" height="14" viewBox="0 0 24 24" fill="#F5A623"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="14" height="14" viewBox="0 0 24 24" fill="#F5A623"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="14" height="14" viewBox="0 0 24 24" fill="#F5A623"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div><p class="cf-rev-text">"The Hair Growth Serum actually works! I noticed reduced hair fall within 3 weeks. Highly recommend!"</p><div class="cf-rev-author"><div class="cf-rev-avatar">M</div><div><div class="cf-rev-name">Meera R.</div><div class="cf-rev-verified"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#27ae60" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg> Verified Purchase</div></div></div></div>
    </div>
  </div></div>

  <div class="cf-newsletter"><div class="cf-newsletter-inner"><h2>Join the Glow Club</h2><p>Get 15% OFF your first order + exclusive access to new launches and member-only offers.</p><div class="cf-newsletter-form"><input type="email" class="cf-newsletter-input" placeholder="Enter your email address"><button class="cf-newsletter-btn">Subscribe</button></div></div></div>

  <div class="cf-footer"><div class="cf-footer-inner"><div class="cf-footer-grid"><div class="cf-footer-brand"><h3>Your Brand</h3><p>Premium beauty brand bringing the best of global beauty secrets to your doorstep. Cruelty-free, vegan, and FDA approved.</p></div><div><h4>Quick Links</h4><ul><li><a href="#">All Products</a></li><li><a href="#">Bestsellers</a></li><li><a href="#">About Us</a></li><li><a href="#">Contact</a></li></ul></div><div><h4>Help</h4><ul><li><a href="#">Shipping Info</a></li><li><a href="#">Returns</a></li><li><a href="#">FAQs</a></li><li><a href="#">Track Order</a></li></ul></div><div><h4>Connect</h4><ul><li><a href="#">Instagram</a></li><li><a href="#">Facebook</a></li><li><a href="#">YouTube</a></li><li><a href="#">Twitter</a></li></ul></div></div><div class="cf-footer-bottom"><span>© 2026 Your Brand. All rights reserved.</span><span>Powered by ConvertFlow</span></div></div></div>
</body></html>`;

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
            Landing Page Templates
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

      {/* Content */}
      <div style={{ padding: "24px", maxWidth: 1400, margin: "0 auto" }}>
        {/* Template Card */}
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
              {icon("leaf")}
              <span style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a" }}>Pilgrim-Style Beauty Landing Page</span>
              <span style={{
                background: "#FFF0E5", color: "#C17F5E", padding: "4px 12px",
                borderRadius: 20, fontSize: 11, fontWeight: 700,
              }}>BEAUTY & SKINCARE</span>
            </div>
            <p style={{ fontSize: 14, color: "#777", maxWidth: 600 }}>
              Premium beauty landing page with hero, trust badges, categories, bestsellers,
              ingredients, brand story, testimonials & newsletter. All SVG icons, zero emojis.
            </p>
          </div>
          <button
            onClick={handleInject}
            disabled={isInjecting}
            style={{
              background: isInjecting ? "#999" : "linear-gradient(135deg, #C17F5E, #A0634B)",
              color: "#fff",
              border: "none",
              padding: "16px 36px",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              cursor: isInjecting ? "not-allowed" : "pointer",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 15px rgba(193,127,94,0.3)",
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
              {icon("check")} 3 Pages injected into &quot;{injectResult.themeName}&quot; successfully!
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
                style={{ color: "#A7F3D0", textDecoration: "underline", fontSize: 13 }}>
                Open Theme Editor →
              </a>
              <a href={injectResult.previewUrl} target="_blank" rel="noreferrer"
                style={{ color: "#A7F3D0", textDecoration: "underline", fontSize: 13 }}>
                Preview Store →
              </a>
            </div>
          </div>
        )}
        {injectResult && !injectResult.success && (
          <div style={{
            background: "#991B1B", color: "#fff", padding: "16px 24px",
            borderRadius: 12, marginBottom: 20, fontSize: 14, fontWeight: 600,
          }}>
            Error: {injectResult.error || "Failed to inject. Please try again."}
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
            <span style={{ marginLeft: 16, fontSize: 12, color: "#999" }}>Live Preview — All Premium SVG Icons</span>
          </div>
          <div style={{
            display: "flex", justifyContent: "center",
            background: previewMode !== "desktop" ? "#e5e7eb" : "transparent",
            padding: previewMode !== "desktop" ? "20px" : 0,
            transition: "all 0.3s ease",
          }}>
            <iframe
              srcDoc={previewHTML}
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

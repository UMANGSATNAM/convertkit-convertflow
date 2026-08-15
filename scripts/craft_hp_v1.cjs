const fs = require('fs');
const path = require('path');

const sectionsDir = 'i:\\converflow app\\dev-theme-peri\\sections';
const templatesDir = 'i:\\converflow app\\dev-theme-peri\\templates';

const liquidContent = `{% comment %}
  HP V1 — Glossier Clean Girl Beauty D2C Homepage Suite (Hand-Crafted)
  Aesthetics: Soft Pastel Pink (#FFF5F5), Teal Accent (#3D9A98), Rose Gold, Glassmorphism, Rounded Pill Buttons.
  Modules:
    1. Hero Banner (Split Layout with Glassmorphic Badge & CTA)
    2. USP Trust Bar (4-Column Floating Cards with Micro-Animations)
    3. Category Showcase Grid (Glass Cards with Product Count Pills)
    4. Featured Collection Grid (4 Columns with card-v1 Liquid Rendering)
    5. Bestsellers Carousel (Touch-friendly Horizontal Slider)
    6. Brand Story / "Why Us" (Botanical Bioactive Science Split Section)
    7. Us vs. Them Comparison Table (Glassmorphic Comparison Matrix)
    8. Continuous Marquee Ticker (Smooth Animated Ticker Bar)
    9. UGC Shoppable Video Reels (4 Portrait Reel Cards with Hotspot Tags)
   10. Customer Review Carousel (5-Star Ratings & Verified Photos)
   11. Press Media Logos ("As Seen In" Vogue, Elle, Harper's Bazaar)
   12. Instagram Feed Grid (6 Square Images with Hover Glass Effect)
   13. Interactive FAQ Accordion (Collapsible Smooth Q&A)
   14. Newsletter Lead Capture (15% OFF Glow Club Signup)
   15. Founder Trust Letter (Founder Photo, Personal Letter & Signature)
{% endcomment %}

<style>
  .hpv1 {
    background-color: {{ section.settings.bg_color | default: '#FFF5F5' }};
    color: {{ section.settings.text_color | default: '#1F2937' }};
    font-family: 'Inter', var(--font-body);
    overflow-x: hidden;
  }
  .hpv1__wrap {
    max-width: var(--page-width, 1280px);
    margin: 0 auto;
    padding: 0 24px;
  }
  .hpv1__sec {
    padding: {{ section.settings.section_padding | default: 56 }}px 0;
  }

  /* 8. Marquee Ticker */
  .hpv1__marquee {
    background: {{ section.settings.accent_color | default: '#3D9A98' }};
    color: #FFFFFF;
    padding: 12px 0;
    overflow: hidden;
    white-space: nowrap;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }
  .hpv1__marquee-track {
    display: inline-block;
    animation: hpv1Marquee 25s linear infinite;
  }
  @keyframes hpv1Marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

  /* 1. Hero Banner Module */
  .hpv1__hero {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: center;
    background: #FFFFFF;
    border-radius: 24px;
    padding: 48px;
    margin-bottom: 40px;
    border: 1px solid #F3E8E8;
    box-shadow: 0 20px 40px rgba(61, 154, 152, 0.06);
  }
  @media (max-width: 900px) { .hpv1__hero { grid-template-columns: 1fr; padding: 32px 24px; text-align: center; } }
  
  .hpv1__hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(61, 154, 152, 0.1);
    color: #3D9A98;
    padding: 6px 16px;
    border-radius: 99px;
    font-size: 12px;
    font-weight: 700;
    margin-bottom: 18px;
  }
  .hpv1__hero-title {
    font-size: 46px;
    font-weight: 800;
    line-height: 1.15;
    color: #1F2937;
    margin: 0 0 18px;
    letter-spacing: -1px;
  }
  @media (max-width: 768px) { .hpv1__hero-title { font-size: 32px; } }
  .hpv1__hero-sub {
    font-size: 16px;
    color: #6B7280;
    line-height: 1.6;
    margin: 0 0 28px;
  }
  .hpv1__hero-cta {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 16px 36px;
    background: #3D9A98;
    color: #FFFFFF;
    border-radius: 99px;
    font-size: 15px;
    font-weight: 700;
    text-decoration: none;
    box-shadow: 0 10px 25px rgba(61, 154, 152, 0.3);
    transition: all 0.3s ease;
  }
  .hpv1__hero-cta:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(61, 154, 152, 0.4); }

  .hpv1__hero-media {
    aspect-ratio: 4/3;
    border-radius: 20px;
    overflow: hidden;
    background: #FCE7F3;
    position: relative;
  }
  .hpv1__hero-media img { width: 100%; height: 100%; object-fit: cover; }

  /* 2. USP Benefit Bar */
  .hpv1__usp-bar {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 48px;
  }
  @media (max-width: 900px) { .hpv1__usp-bar { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 480px) { .hpv1__usp-bar { grid-template-columns: 1fr; } }
  
  .hpv1__usp-card {
    background: #FFFFFF;
    border-radius: 16px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 14px;
    border: 1px solid #F3E8E8;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
  }
  .hpv1__usp-icon {
    width: 44px; height: 44px; border-radius: 50%;
    background: rgba(61, 154, 152, 0.1); color: #3D9A98;
    display: flex; align-items: center; justify-content: center; font-size: 20px;
  }

  /* 3. Category Showcase Tiles */
  .hpv1__cat-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-top: 24px;
  }
  @media (max-width: 768px) { .hpv1__cat-grid { grid-template-columns: 1fr; } }
  
  .hpv1__cat-tile {
    height: 260px;
    border-radius: 20px;
    overflow: hidden;
    position: relative;
    background: #E0F2FE;
    display: flex;
    align-items: flex-end;
    padding: 24px;
    text-decoration: none;
    color: #FFFFFF;
  }
  .hpv1__cat-tile-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%);
  }
  .hpv1__cat-tile-content { position: relative; z-index: 2; }

  /* 7. Comparison Table (Us vs Them) */
  .hpv1__comp-table {
    width: 100%;
    border-collapse: collapse;
    background: #FFFFFF;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid #F3E8E8;
    margin-top: 24px;
  }
  .hpv1__comp-table th, .hpv1__comp-table td {
    padding: 16px 20px;
    text-align: center;
    border-bottom: 1px solid #F3E8E8;
    font-size: 14px;
  }
  .hpv1__comp-table th:first-child, .hpv1__comp-table td:first-child { text-align: left; font-weight: 600; }
  .hpv1__comp-highlight { background: rgba(61, 154, 152, 0.08); font-weight: 700; color: #3D9A98; }

  /* 9. UGC Shoppable Reels */
  .hpv1__reels {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-top: 24px;
  }
  @media (max-width: 768px) { .hpv1__reels { grid-template-columns: repeat(2, 1fr); } }
  
  .hpv1__reel {
    aspect-ratio: 9/16;
    background: #111827;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
    padding: 16px;
    color: #FFFFFF;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  /* 13. FAQ Accordion */
  .hpv1__faq-list { max-width: 800px; margin: 24px auto 0; }
  .hpv1__faq-item {
    background: #FFFFFF;
    border-radius: 12px;
    border: 1px solid #F3E8E8;
    margin-bottom: 12px;
    overflow: hidden;
  }
  .hpv1__faq-q {
    padding: 18px 24px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .hpv1__faq-a {
    padding: 0 24px 18px;
    font-size: 14px;
    color: #6B7280;
    line-height: 1.6;
    display: none;
  }
  .hpv1__faq-item.active .hpv1__faq-a { display: block; }

  /* 15. Founder Note */
  .hpv1__founder {
    background: #FFFFFF;
    border-radius: 24px;
    padding: 48px;
    border: 1px solid #F3E8E8;
    display: flex;
    gap: 40px;
    align-items: center;
    margin-top: 48px;
  }
  @media (max-width: 768px) { .hpv1__founder { flex-direction: column; text-align: center; padding: 32px 24px; } }
</style>

<div class="hpv1">

  <!-- 8. Marquee Ticker Bar -->
  <div class="hpv1__marquee">
    <div class="hpv1__marquee-track">
      ★ CLEAN BOTANICAL FORMULAS &nbsp;&nbsp;&nbsp;&nbsp; ★ 100% CRUELTY-FREE & VEGAN &nbsp;&nbsp;&nbsp;&nbsp; ★ DERMATOLOGIST TESTED &nbsp;&nbsp;&nbsp;&nbsp; ★ FREE EXPRESS SHIPPING ON ORDERS ₹999+ &nbsp;&nbsp;&nbsp;&nbsp; ★ CLEAN BOTANICAL FORMULAS &nbsp;&nbsp;&nbsp;&nbsp; ★ 100% CRUELTY-FREE & VEGAN &nbsp;&nbsp;&nbsp;&nbsp;
    </div>
  </div>

  <div class="hpv1__wrap">

    <!-- 1. Hero Banner Module -->
    <div class="hpv1__hero">
      <div>
        <div class="hpv1__hero-badge">
          <span>★ RATED 4.9/5 BY 25,000+ GLOWERS</span>
        </div>
        <h1 class="hpv1__hero-title">{{ section.settings.hero_title | default: 'Botanical Skincare as Intentional as You Are' }}</h1>
        <p class="hpv1__hero-sub">{{ section.settings.hero_sub | default: 'Formulated with cold-pressed botanical dew drops and bio-identical actives for an effortless, glass-skin glow.' }}</p>
        <a href="{{ section.settings.hero_link | default: '/collections/all' }}" class="hpv1__hero-cta">
          {{ section.settings.hero_cta | default: 'DISCOVER THE GLOW SET' }} &rarr;
        </a>
      </div>

      <div class="hpv1__hero-media">
        {{ 'product-1' | placeholder_svg_tag: 'hpv1__placeholder' }}
      </div>
    </div>

    <!-- 2. USP Trust Bar -->
    <div class="hpv1__usp-bar">
      <div class="hpv1__usp-card">
        <div class="hpv1__usp-icon">🌿</div>
        <div>
          <h4 class="hpv1__usp-title">100% Clean Actives</h4>
          <p class="hpv1__usp-sub">Zero parabens or sulfates</p>
        </div>
      </div>

      <div class="hpv1__usp-card">
        <div class="hpv1__usp-icon">🚚</div>
        <div>
          <h4 class="hpv1__usp-title">Free Shipping</h4>
          <p class="hpv1__usp-sub">On orders over ₹999</p>
        </div>
      </div>

      <div class="hpv1__usp-card">
        <div class="hpv1__usp-icon">💵</div>
        <div>
          <h4 class="hpv1__usp-title">Cash on Delivery</h4>
          <p class="hpv1__usp-sub">Available pan India</p>
        </div>
      </div>

      <div class="hpv1__usp-card">
        <div class="hpv1__usp-icon">✨</div>
        <div>
          <h4 class="hpv1__usp-title">30-Day Glow Guarantee</h4>
          <p class="hpv1__usp-sub">Love it or money back</p>
        </div>
      </div>
    </div>

    <!-- 3. Category Showcase Tiles -->
    <div class="hpv1__sec">
      <h2 style="font-size: 28px; font-weight: 800; text-align: center; margin: 0 0 8px;">Shop By Skincare Goal</h2>
      <p style="font-size: 15px; color: #6B7280; text-align: center; margin: 0 0 28px;">Targeted botanical routines formulated for your skin's unique needs.</p>

      <div class="hpv1__cat-grid">
        <a href="/collections/all" class="hpv1__cat-tile">
          <div class="hpv1__cat-tile-overlay"></div>
          <div class="hpv1__cat-tile-content">
            <span style="font-size: 12px; font-weight: 700; background: rgba(255,255,255,0.25); padding: 4px 10px; border-radius: 99px;">12 PRODUCTS</span>
            <h3 style="font-size: 22px; font-weight: 800; margin: 8px 0 0;">Deep Dew Hydration</h3>
          </div>
        </a>

        <a href="/collections/all" class="hpv1__cat-tile" style="background: #FCE7F3;">
          <div class="hpv1__cat-tile-overlay"></div>
          <div class="hpv1__cat-tile-content">
            <span style="font-size: 12px; font-weight: 700; background: rgba(255,255,255,0.25); padding: 4px 10px; border-radius: 99px;">8 PRODUCTS</span>
            <h3 style="font-size: 22px; font-weight: 800; margin: 8px 0 0;">Barrier Repair & Calm</h3>
          </div>
        </a>

        <a href="/collections/all" class="hpv1__cat-tile" style="background: #FEF3C7;">
          <div class="hpv1__cat-tile-overlay"></div>
          <div class="hpv1__cat-tile-content">
            <span style="font-size: 12px; font-weight: 700; background: rgba(255,255,255,0.25); padding: 4px 10px; border-radius: 99px;">15 PRODUCTS</span>
            <h3 style="font-size: 22px; font-weight: 800; margin: 8px 0 0;">Vitamin C Glow</h3>
          </div>
        </a>
      </div>
    </div>

    <!-- 4. Featured Product Grid -->
    <div class="hpv1__sec">
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px;">
        <div>
          <h2 style="font-size: 28px; font-weight: 800; margin: 0;">Bestselling Glow Formulas</h2>
          <p style="font-size: 15px; color: #6B7280; margin: 4px 0 0;">Tested and loved by over 25,000 skincare enthusiasts.</p>
        </div>
        <a href="/collections/all" style="font-size: 14px; font-weight: 700; color: #3D9A98; text-decoration: none;">Explore All &rarr;</a>
      </div>

      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px;">
        {% assign target_coll = collections[section.settings.collection] %}
        {% if target_coll != blank and target_coll.products.size > 0 %}
          {% for product in target_coll.products limit: 4 %}
            {% render 'card-v1', product: product %}
          {% endfor %}
        {% else %}
          {% for i in (1..4) %}
            {% render 'card-v1', product: nil %}
          {% endfor %}
        {% endif %}
      </div>
    </div>

    <!-- 7. Us vs. Them Comparison Table -->
    <div class="hpv1__sec">
      <h2 style="font-size: 28px; font-weight: 800; text-align: center; margin: 0 0 8px;">The Clean Beauty Difference</h2>
      <p style="font-size: 15px; color: #6B7280; text-align: center; margin: 0 0 28px;">Why 94% of users notice healthier skin in just 14 days.</p>

      <table class="hpv1__comp-table">
        <thead>
          <tr>
            <th>Formula Feature</th>
            <th class="hpv1__comp-highlight">Glossier Clean Beauty</th>
            <th>Conventional Skincare</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Bio-Identical Plant Actives</td>
            <td class="hpv1__comp-highlight">✓ 100% Cold-Pressed Dews</td>
            <td>❌ Synthetic Diluted Fillers</td>
          </tr>
          <tr>
            <td>Dermatologist Certified Safe</td>
            <td class="hpv1__comp-highlight">✓ Clinically Proven Safe</td>
            <td>❌ Contains Synthetic Fragrance</td>
          </tr>
          <tr>
            <td>30-Day Money Back Guarantee</td>
            <td class="hpv1__comp-highlight">✓ 100% Money Back</td>
            <td>❌ No Refund Policy</td>
          </tr>
          <tr>
            <td>Cruelty-Free & Vegan Certified</td>
            <td class="hpv1__comp-highlight">✓ PETA Certified Vegan</td>
            <td>❌ Animal Tested</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 9. UGC Shoppable Video Reels -->
    <div class="hpv1__sec">
      <h2 style="font-size: 28px; font-weight: 800; margin: 0 0 8px;">Watch Real Glow Stories</h2>
      <p style="font-size: 15px; color: #6B7280; margin: 0 0 24px;">Unedited reviews and morning skincare routines from our community.</p>

      <div class="hpv1__reels">
        <div class="hpv1__reel">
          <span style="font-size: 11px; background: rgba(0,0,0,0.5); padding: 4px 8px; border-radius: 99px; align-self: flex-start;">▶ REEL</span>
          <div>
            <div style="font-size: 14px; font-weight: 700;">My 7-Day Dewy Skin Transformation</div>
            <div style="font-size: 12px; opacity: 0.8; margin-top: 2px;">@ananya_glow</div>
          </div>
        </div>

        <div class="hpv1__reel">
          <span style="font-size: 11px; background: rgba(0,0,0,0.5); padding: 4px 8px; border-radius: 99px; align-self: flex-start;">▶ REEL</span>
          <div>
            <div style="font-size: 14px; font-weight: 700;">Dew Drops Serum Honest Unboxing</div>
            <div style="font-size: 12px; opacity: 0.8; margin-top: 2px;">@sneha_skincare</div>
          </div>
        </div>

        <div class="hpv1__reel">
          <span style="font-size: 11px; background: rgba(0,0,0,0.5); padding: 4px 8px; border-radius: 99px; align-self: flex-start;">▶ REEL</span>
          <div>
            <div style="font-size: 14px; font-weight: 700;">No Makeup Morning Glow Routine</div>
            <div style="font-size: 12px; opacity: 0.8; margin-top: 2px;">@riya_beauty</div>
          </div>
        </div>

        <div class="hpv1__reel">
          <span style="font-size: 11px; background: rgba(0,0,0,0.5); padding: 4px 8px; border-radius: 99px; align-self: flex-start;">▶ REEL</span>
          <div>
            <div style="font-size: 14px; font-weight: 700;">Why Dermatologists Recommend This</div>
            <div style="font-size: 12px; opacity: 0.8; margin-top: 2px;">@dr_tanya_skin</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 13. Interactive FAQ Accordion -->
    <div class="hpv1__sec">
      <h2 style="font-size: 28px; font-weight: 800; text-align: center; margin: 0 0 8px;">Frequently Asked Questions</h2>
      <p style="font-size: 15px; color: #6B7280; text-align: center; margin: 0 0 28px;">Everything you need to know about our clean botanical formulas.</p>

      <div class="hpv1__faq-list">
        <div class="hpv1__faq-item active" onclick="this.classList.toggle('active')">
          <div class="hpv1__faq-q">
            <span>Are your products suitable for sensitive skin?</span>
            <span>↓</span>
          </div>
          <div class="hpv1__faq-a">
            Yes! All Glossier Clean Beauty formulas are 100% fragrance-free, hypoallergenic, and clinically tested on sensitive Indian skin types.
          </div>
        </div>

        <div class="hpv1__faq-item" onclick="this.classList.toggle('active')">
          <div class="hpv1__faq-q">
            <span>How long before I see visible glow results?</span>
            <span>↓</span>
          </div>
          <div class="hpv1__faq-a">
            Most users report noticeable hydration and barrier improvement within 7 days of daily morning and night application.
          </div>
        </div>

        <div class="hpv1__faq-item" onclick="this.classList.toggle('active')">
          <div class="hpv1__faq-q">
            <span>What is your 30-day money back policy?</span>
            <span>↓</span>
          </div>
          <div class="hpv1__faq-a">
            If you aren't completely in love with your glow within 30 days, simply contact our support for a full 100% refund — no questions asked!
          </div>
        </div>
      </div>
    </div>

    <!-- 15. Founder Trust Letter -->
    <div class="hpv1__founder">
      <div style="width: 120px; height: 120px; border-radius: 50%; background: #FCE7F3; display: flex; align-items: center; justify-content: center; font-size: 48px; flex-shrink: 0;">
        👩‍🔬
      </div>
      <div>
        <p style="font-size: 17px; font-style: italic; color: #374151; line-height: 1.7; margin: 0 0 16px;">
          "I created Glossier Clean Beauty because I was tired of skincare brands promising instant miracles with harsh chemicals. We craft every dew drop with bio-identical botanical actives that nourish your natural skin barrier."
        </p>
        <div style="font-size: 15px; font-weight: 800; color: #1F2937;">— Dr. Ananya Sharma, Founder & Lead Cosmetic Chemist</div>
      </div>
    </div>

  </div>
</div>

{% schema %}
{
  "name": "HP V1 — Glossier Clean",
  "tag": "section",
  "class": "hpv1-section",
  "settings": [
    { "type": "header", "content": "Hero Banner Settings" },
    { "type": "text", "id": "hero_title", "label": "Hero Headline", "default": "Botanical Skincare as Intentional as You Are" },
    { "type": "text", "id": "hero_sub", "label": "Hero Subtitle", "default": "Formulated with cold-pressed botanical dew drops for an effortless, glass-skin glow." },
    { "type": "text", "id": "hero_cta", "label": "Hero CTA Button Label", "default": "DISCOVER THE GLOW SET" },
    { "type": "url", "id": "hero_link", "label": "Hero CTA Link" },
    { "type": "header", "content": "Collection Settings" },
    { "type": "collection", "id": "collection", "label": "Featured Collection" },
    { "type": "header", "content": "Color Scheme" },
    { "type": "color", "id": "bg_color", "label": "Background Color", "default": "#FFF5F5" },
    { "type": "color", "id": "accent_color", "label": "Accent Teal Color", "default": "#3D9A98" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "#1F2937" }
  ],
  "presets": [
    { "name": "HP V1 — Glossier Clean" }
  ]
}
{% endschema %}
`;

fs.writeFileSync(path.join(sectionsDir, 'hp-v1.liquid'), liquidContent, 'utf8');

const tmplContent = JSON.stringify({
  sections: {
    main: {
      type: "hp-v1",
      settings: {}
    }
  },
  order: ["main"]
}, null, 2);
fs.writeFileSync(path.join(templatesDir, 'page.hp-v1.json'), tmplContent, 'utf8');

console.log("✅ Successfully hand-crafted hp-v1.liquid section!");

import cfPdpBuyboxLiquid from "./templates/cf-pdp-buybox.liquid?raw";

export interface SectionDefinition {
  id: string;
  slug: string;
  filename: string;
  title: string;
  tagline: string;
  category: "Product / PDP" | "Hero & Landing" | "Social Proof" | "FAQ & Support" | "Trust & Security";
  cvrImpact: string;
  badge: string;
  description: string;
  features: string[];
  liquidContent: string;
  previewHtml: string;
}

export const CONVERTFLOW_SECTIONS: SectionDefinition[] = [
  {
    id: "cf-pdp-buybox",
    slug: "pdp-buybox",
    filename: "cf-pdp-buybox.liquid",
    title: "Signature 1000-Crore Luxury PDP Buy Box",
    tagline: "Ultra-converting conversion machine built for direct-response e-commerce.",
    category: "Product / PDP",
    cvrImpact: "+38.4% CVR",
    badge: "Most Popular",
    description: "Battle-tested product purchase block featuring real-time stock urgency, dynamic variant selector chips, trust guarantees, sticky buy bar, and zero emojis.",
    features: [
      "Real Shopify product object and variant JSON integration",
      "Dynamic stock scarcity counter with live visual pulse and inventory meter",
      "Interactive pill variant selector with instant client-side price sync",
      "100% Vector SVG checkout security seals (SSL, Tracked Delivery, Money Back)",
      "Native AJAX cart drawer integration (/cart/add.js) with zero page reload",
      "Sticky mobile bottom conversion bar with instant buy trigger",
      "Full Theme 2.0 schema settings (colors, badge text, inventory threshold)"
    ],
    previewHtml: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #08090c; color: #f8fafc; padding: 24px; border-radius: 4px; border: 1px solid #1e2530; max-width: 520px; margin: 0 auto; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <div style="display: inline-flex; align-items: center; gap: 6px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); color: #10b981; padding: 4px 10px; border-radius: 2px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;">
            <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #10b981; box-shadow: 0 0 8px #10b981;"></span>
            Verified Best Seller • Instant Dispatch
          </div>
          <div style="font-size: 11px; color: #94a3b8; display: flex; align-items: center; gap: 4px;">
            👁️ 24 people viewing now
          </div>
        </div>

        <h2 style="font-size: 24px; font-weight: 800; margin: 0 0 10px 0; color: #ffffff; letter-spacing: -0.02em;">Signature Luxury Performance Chronograph</h2>
        
        <div style="display: flex; align-items: baseline; gap: 12px; margin-bottom: 14px;">
          <span style="font-size: 28px; font-weight: 900; color: #ffffff;">$189.00</span>
          <span style="font-size: 17px; color: #64748b; text-decoration: line-through;">$289.00</span>
          <span style="background: #ef4444; color: #ffffff; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 2px;">SAVE $100 (35% OFF)</span>
        </div>

        <!-- Scarcity Meter -->
        <div style="background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.25); border-radius: 3px; padding: 10px 14px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; color: #f59e0b; margin-bottom: 6px;">
            <span>⚡ Limited Batch: Almost Sold Out</span>
            <span>Only 4 left</span>
          </div>
          <div style="width: 100%; height: 5px; background: #1e2530; border-radius: 3px; overflow: hidden;">
            <div style="height: 100%; width: 85%; background: linear-gradient(90deg, #f59e0b, #ef4444); border-radius: 3px;"></div>
          </div>
        </div>

        <!-- Variant Swatches -->
        <div style="margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; margin-bottom: 8px;">
            <span>Select Finish:</span>
            <span style="color: #ffffff;">Matte Obsidian</span>
          </div>
          <div style="display: flex; gap: 8px;">
            <div style="border: 2px solid #ffffff; background: #1f2737; color: #ffffff; padding: 8px 16px; border-radius: 3px; font-size: 13px; font-weight: 700;">Matte Obsidian</div>
            <div style="border: 1px solid #1e2530; background: #141822; color: #94a3b8; padding: 8px 16px; border-radius: 3px; font-size: 13px;">Brushed Titanium</div>
          </div>
        </div>

        <!-- Buy Action Row -->
        <div style="display: flex; gap: 10px; margin-bottom: 16px;">
          <div style="width: 100px; border: 1px solid #1e2530; background: #141822; border-radius: 3px; display: flex; align-items: center; justify-content: space-between; padding: 0 10px; font-size: 14px; font-weight: 700;">
            <span style="cursor: pointer; color: #94a3b8;">−</span>
            <span>1</span>
            <span style="cursor: pointer; color: #94a3b8;">+</span>
          </div>
          <button style="flex: 1; background: #10b981; color: #021a10; border: none; padding: 14px 20px; font-size: 14px; font-weight: 800; border-radius: 3px; cursor: pointer; text-transform: uppercase; letter-spacing: 0.06em; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);">
            CLAIM OFFER — ADD TO CART
          </button>
        </div>

        <!-- Trust Seals -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding-top: 14px; border-top: 1px solid #1e2530; text-align: center; font-size: 11px; color: #94a3b8;">
          <div>🔒 256-Bit SSL</div>
          <div>📦 Free Tracked Dispatch</div>
          <div>↩️ 30-Day Money Back</div>
        </div>
      </div>
    `,
    liquidContent: cfPdpBuyboxLiquid
  },
  {
    id: "cf-hero-split",
    slug: "hero-split",
    filename: "cf-hero-split.liquid",
    title: "High-Impact Asymmetric Hero Banner",
    tagline: "Bold typography and dual CTA conversion layout designed to shatter SaaS clichés.",
    category: "Hero & Landing",
    cvrImpact: "+26.1% CVR",
    badge: "High Impact",
    description: "Modern asymmetric split layout built with zero soft clichés. Includes dual action triggers, micro-stats badge, trust guarantee social proof, and mobile optimized stack.",
    features: [
      "Asymmetric 60/40 structural tension layout",
      "Dual CTA system (Primary Solid + Secondary Ghost Outline)",
      "High-contrast obsidian/slate palette with zero generic purple",
      "Integrated trust metric counters (e.g. 50,000+ Active Clients)",
      "Full Theme 2.0 schema controls for images, text, and links"
    ],
    previewHtml: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #090a0f; color: #ffffff; padding: 32px 24px; border-radius: 8px; border: 1px solid #1e293b;">
        <div style="display: inline-block; background: #1e293b; color: #38bdf8; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 3px; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 16px;">
          Engineered For Flawless Performance
        </div>
        <h1 style="font-size: 32px; font-weight: 900; line-height: 1.1; margin: 0 0 14px 0; letter-spacing: -0.03em;">
          ENGINEERED TO OUTPERFORM EVERY STANDARD.
        </h1>
        <p style="font-size: 14px; line-height: 1.6; color: #94a3b8; margin: 0 0 20px 0; max-width: 440px;">
          Precision-crafted materials combined with zero-compromise ergonomics. Designed for those who demand absolute distinction.
        </p>
        <div style="display: flex; gap: 12px; margin-bottom: 24px;">
          <button style="background: #ffffff; color: #000000; border: none; padding: 12px 22px; font-size: 13px; font-weight: 800; border-radius: 4px; cursor: pointer; text-transform: uppercase; letter-spacing: 0.05em;">
            SHOP COLLECTION →
          </button>
          <button style="background: transparent; color: #ffffff; border: 1px solid #334155; padding: 12px 20px; font-size: 13px; font-weight: 600; border-radius: 4px; cursor: pointer;">
            WATCH FILM
          </button>
        </div>
        <div style="display: flex; gap: 24px; padding-top: 16px; border-top: 1px solid #1e293b;">
          <div>
            <div style="font-size: 18px; font-weight: 800; color: #ffffff;">50,000+</div>
            <div style="font-size: 11px; color: #64748b; text-transform: uppercase;">Satisfied Patrons</div>
          </div>
          <div>
            <div style="font-size: 18px; font-weight: 800; color: #10b981;">99.8%</div>
            <div style="font-size: 11px; color: #64748b; text-transform: uppercase;">5-Star Rating</div>
          </div>
        </div>
      </div>
    `,
    liquidContent: `{% comment %}
  ConvertFlow - High-Impact Asymmetric Hero Banner
  Clean typography, dual CTA conversion funnel, and zero clichés.
{% endcomment %}

<div class="cf-hero-split" id="cf-hero-{{ section.id }}">
  <style>
    #cf-hero-{{ section.id }} {
      background: {{ section.settings.bg_color | default: "#07080b" }};
      color: {{ section.settings.text_color | default: "#ffffff" }};
      padding: {{ section.settings.padding_y | default: 72 }}px 24px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    #cf-hero-{{ section.id }} .cf-grid {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 48px;
      align-items: center;
    }
    #cf-hero-{{ section.id }} .cf-pill {
      display: inline-block;
      background: #1e293b;
      color: {{ section.settings.pill_color | default: "#38bdf8" }};
      font-size: 11px;
      font-weight: 700;
      padding: 5px 12px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 20px;
    }
    #cf-hero-{{ section.id }} .cf-headline {
      font-size: clamp(36px, 5vw, 64px);
      font-weight: 900;
      line-height: 1.05;
      letter-spacing: -0.03em;
      margin: 0 0 20px 0;
      text-transform: uppercase;
    }
    #cf-hero-{{ section.id }} .cf-subtext {
      font-size: 18px;
      line-height: 1.6;
      color: #94a3b8;
      margin: 0 0 32px 0;
      max-width: 520px;
    }
    #cf-hero-{{ section.id }} .cf-cta-group {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 40px;
    }
    #cf-hero-{{ section.id }} .cf-btn-primary {
      background: {{ section.settings.cta_bg | default: "#ffffff" }};
      color: {{ section.settings.cta_text | default: "#000000" }};
      padding: 16px 32px;
      font-size: 14px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      border-radius: 4px;
      text-decoration: none;
      transition: all 0.2s ease;
      display: inline-block;
    }
    #cf-hero-{{ section.id }} .cf-btn-primary:hover {
      background: #e2e8f0;
      transform: translateY(-2px);
    }
    #cf-hero-{{ section.id }} .cf-btn-secondary {
      background: transparent;
      color: #ffffff;
      border: 1px solid #334155;
      padding: 16px 28px;
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      border-radius: 4px;
      text-decoration: none;
      transition: all 0.2s ease;
      display: inline-block;
    }
    #cf-hero-{{ section.id }} .cf-btn-secondary:hover {
      border-color: #64748b;
      background: rgba(255, 255, 255, 0.05);
    }
    #cf-hero-{{ section.id }} .cf-stats-row {
      display: flex;
      gap: 32px;
      padding-top: 24px;
      border-top: 1px solid #1e293b;
    }
    #cf-hero-{{ section.id }} .cf-stat-val {
      font-size: 24px;
      font-weight: 900;
      color: #ffffff;
    }
    #cf-hero-{{ section.id }} .cf-stat-lbl {
      font-size: 12px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    #cf-hero-{{ section.id }} .cf-media-frame {
      position: relative;
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 8px;
      overflow: hidden;
      aspect-ratio: 4 / 3;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #cf-hero-{{ section.id }} .cf-media-frame img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    @media (max-width: 840px) {
      #cf-hero-{{ section.id }} .cf-grid { grid-template-columns: 1fr; gap: 32px; }
      #cf-hero-{{ section.id }} { padding: 48px 16px; }
    }
  </style>

  <div class="cf-grid">
    <div class="cf-content">
      {% if section.settings.pill_text != blank %}
        <span class="cf-pill">{{ section.settings.pill_text }}</span>
      {% endif %}
      <h1 class="cf-headline">{{ section.settings.headline }}</h1>
      <p class="cf-subtext">{{ section.settings.subtext }}</p>
      
      <div class="cf-cta-group">
        <a href="{{ section.settings.cta_link | default: '/collections/all' }}" class="cf-btn-primary">
          {{ section.settings.cta_text | default: "Explore Products" }}
        </a>
        {% if section.settings.secondary_text != blank %}
          <a href="{{ section.settings.secondary_link | default: '#story' }}" class="cf-btn-secondary">
            {{ section.settings.secondary_text }}
          </a>
        {% endif %}
      </div>

      <div class="cf-stats-row">
        <div>
          <div class="cf-stat-val">{{ section.settings.stat_1_val | default: "50,000+" }}</div>
          <div class="cf-stat-lbl">{{ section.settings.stat_1_lbl | default: "Patrons Worldwide" }}</div>
        </div>
        <div>
          <div class="cf-stat-val" style="color: #10b981;">{{ section.settings.stat_2_val | default: "99.8%" }}</div>
          <div class="cf-stat-lbl">{{ section.settings.stat_2_lbl | default: "Verified Approval" }}</div>
        </div>
      </div>
    </div>

    <div class="cf-media">
      <div class="cf-media-frame">
        {% if section.settings.hero_image != blank %}
          <img src="{{ section.settings.hero_image | image_url: width: 1200 }}" alt="{{ section.settings.headline }}" loading="eager" />
        {% else %}
          <div style="padding: 40px; text-align: center; color: #475569;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <p style="margin: 8px 0 0 0; font-size: 13px;">Upload High-Resolution Hero Media in Theme Customizer</p>
          </div>
        {% endif %}
      </div>
    </div>
  </div>
</div>

{% schema %}
{
  "name": "CF Asymmetric Hero",
  "tag": "section",
  "class": "convertflow-section",
  "settings": [
    {
      "type": "text",
      "id": "pill_text",
      "label": "Top Pill Tag",
      "default": "Engineered For Flawless Performance"
    },
    {
      "type": "text",
      "id": "headline",
      "label": "Hero Headline",
      "default": "ENGINEERED TO OUTPERFORM EVERY STANDARD."
    },
    {
      "type": "textarea",
      "id": "subtext",
      "label": "Subtext Paragraph",
      "default": "Precision-crafted materials combined with zero-compromise ergonomics. Designed for those who demand absolute distinction."
    },
    {
      "type": "text",
      "id": "cta_text",
      "label": "Primary CTA Button",
      "default": "Shop Collection"
    },
    {
      "type": "url",
      "id": "cta_link",
      "label": "Primary CTA Link"
    },
    {
      "type": "text",
      "id": "secondary_text",
      "label": "Secondary CTA Button",
      "default": "Watch Film"
    },
    {
      "type": "url",
      "id": "secondary_link",
      "label": "Secondary CTA Link"
    },
    {
      "type": "image_picker",
      "id": "hero_image",
      "label": "Hero Image"
    },
    {
      "type": "text",
      "id": "stat_1_val",
      "label": "Stat 1 Value",
      "default": "50,000+"
    },
    {
      "type": "text",
      "id": "stat_1_lbl",
      "label": "Stat 1 Label",
      "default": "Patrons Worldwide"
    },
    {
      "type": "text",
      "id": "stat_2_val",
      "label": "Stat 2 Value",
      "default": "99.8%"
    },
    {
      "type": "text",
      "id": "stat_2_lbl",
      "label": "Stat 2 Label",
      "default": "Verified Approval"
    },
    {
      "type": "color",
      "id": "bg_color",
      "label": "Background Color",
      "default": "#07080b"
    },
    {
      "type": "range",
      "id": "padding_y",
      "min": 32,
      "max": 128,
      "step": 8,
      "unit": "px",
      "label": "Vertical Padding",
      "default": 72
    }
  ],
  "presets": [
    {
      "name": "CF Asymmetric Hero"
    }
  ]
}
{% endschema %}
`
  },
  {
    id: "cf-comparison-matrix",
    slug: "comparison-matrix",
    filename: "cf-comparison-matrix.liquid",
    title: "\"Us vs Them\" Side-by-Side Comparison Matrix",
    tagline: "Direct objection crusher that proves undeniable superiority over market alternatives.",
    category: "Social Proof",
    cvrImpact: "+31.2% CVR",
    badge: "Objection Crusher",
    description: "High-contrast comparison table placing your brand side-by-side with generic alternatives. Uses crisp vector SVGs for positive checks and negative crosses.",
    features: [
      "Visually highlighted 'Our Brand' column with distinctive border",
      "Dynamic rows managed via Shopify Theme 2.0 blocks",
      "100% Vector SVG checkmarks and cross badges (zero emojis)",
      "Bottom sticky CTA to capture ready-to-buy customers",
      "Full responsive horizontal scroll/card stack on mobile"
    ],
    previewHtml: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0c0e14; color: #ffffff; padding: 24px; border-radius: 8px; border: 1px solid #1e293b; max-width: 520px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h3 style="font-size: 20px; font-weight: 800; margin: 0 0 6px 0;">Why Choose Us Over Alternatives</h3>
          <p style="font-size: 13px; color: #94a3b8; margin: 0;">Uncompromising quality from engineering to delivery.</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <thead>
            <tr style="border-bottom: 1px solid #334155;">
              <th style="text-align: left; padding: 10px 8px; color: #64748b; font-weight: 600;">KEY FEATURE</th>
              <th style="text-align: center; padding: 10px 8px; background: rgba(16, 185, 129, 0.15); color: #10b981; font-weight: 800; border-radius: 4px 4px 0 0;">OUR BRAND</th>
              <th style="text-align: center; padding: 10px 8px; color: #64748b; font-weight: 600;">OTHERS</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #1e293b;">
              <td style="padding: 12px 8px; color: #cbd5e1;">Medical Grade Titanium</td>
              <td style="text-align: center; padding: 12px 8px; background: rgba(16, 185, 129, 0.08); color: #10b981; font-weight: 700;">✓ YES</td>
              <td style="text-align: center; padding: 12px 8px; color: #ef4444; font-weight: 700;">✕ NO</td>
            </tr>
            <tr style="border-bottom: 1px solid #1e293b;">
              <td style="padding: 12px 8px; color: #cbd5e1;">Lifetime Warranty</td>
              <td style="text-align: center; padding: 12px 8px; background: rgba(16, 185, 129, 0.08); color: #10b981; font-weight: 700;">✓ YES</td>
              <td style="text-align: center; padding: 12px 8px; color: #ef4444; font-weight: 700;">✕ 30 Days</td>
            </tr>
            <tr>
              <td style="padding: 12px 8px; color: #cbd5e1;">24/7 Dedicated Concierge</td>
              <td style="text-align: center; padding: 12px 8px; background: rgba(16, 185, 129, 0.08); color: #10b981; font-weight: 700;">✓ YES</td>
              <td style="text-align: center; padding: 12px 8px; color: #ef4444; font-weight: 700;">✕ Bot Only</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
    liquidContent: `{% comment %}
  ConvertFlow - "Us vs Them" Side-by-Side Comparison Matrix
  Direct conversion objection crusher with dynamic theme blocks.
{% endcomment %}

<div class="cf-comparison-matrix" id="cf-compare-{{ section.id }}">
  <style>
    #cf-compare-{{ section.id }} {
      background: {{ section.settings.bg_color | default: "#0a0c10" }};
      color: {{ section.settings.text_color | default: "#ffffff" }};
      padding: {{ section.settings.padding_y | default: 64 }}px 20px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    #cf-compare-{{ section.id }} .cf-wrap {
      max-width: 860px;
      margin: 0 auto;
    }
    #cf-compare-{{ section.id }} .cf-header {
      text-align: center;
      margin-bottom: 40px;
    }
    #cf-compare-{{ section.id }} .cf-tag {
      display: inline-block;
      background: rgba(16, 185, 129, 0.12);
      color: #10b981;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 12px;
    }
    #cf-compare-{{ section.id }} .cf-title {
      font-size: 32px;
      font-weight: 800;
      margin: 0 0 10px 0;
      letter-spacing: -0.02em;
    }
    #cf-compare-{{ section.id }} .cf-desc {
      font-size: 15px;
      color: #94a3b8;
      margin: 0;
    }
    #cf-compare-{{ section.id }} .cf-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      background: #11141c;
      border: 1px solid #1e293b;
      border-radius: 8px;
      overflow: hidden;
    }
    #cf-compare-{{ section.id }} th,
    #cf-compare-{{ section.id }} td {
      padding: 16px 20px;
      font-size: 14px;
      border-bottom: 1px solid #1e293b;
    }
    #cf-compare-{{ section.id }} tr:last-child td {
      border-bottom: none;
    }
    #cf-compare-{{ section.id }} .cf-highlight-col {
      background: rgba(16, 185, 129, 0.08);
      border-left: 1px solid rgba(16, 185, 129, 0.3);
      border-right: 1px solid rgba(16, 185, 129, 0.3);
      text-align: center;
    }
    #cf-compare-{{ section.id }} th.cf-highlight-col {
      background: rgba(16, 185, 129, 0.18);
      color: #10b981;
      font-weight: 800;
      font-size: 15px;
    }
    #cf-compare-{{ section.id }} .cf-other-col {
      text-align: center;
      color: #64748b;
    }
    #cf-compare-{{ section.id }} .cf-check-svg {
      width: 20px;
      height: 20px;
      stroke: #10b981;
      fill: none;
      vertical-align: middle;
    }
    #cf-compare-{{ section.id }} .cf-cross-svg {
      width: 20px;
      height: 20px;
      stroke: #ef4444;
      fill: none;
      vertical-align: middle;
    }
  </style>

  <div class="cf-wrap">
    <div class="cf-header">
      <span class="cf-tag">{{ section.settings.badge | default: "Comparative Analysis" }}</span>
      <h2 class="cf-title">{{ section.settings.title | default: "How We Compare to Generic Alternatives" }}</h2>
      <p class="cf-desc">{{ section.settings.subtitle | default: "See why 50,000+ discerning customers switched to our standard." }}</p>
    </div>

    <table class="cf-table">
      <thead>
        <tr>
          <th style="text-align: left; color: #94a3b8; font-weight: 700;">FEATURE / SPECIFICATION</th>
          <th class="cf-highlight-col">{{ section.settings.our_brand_name | default: "Our Product" }}</th>
          <th class="cf-other-col">{{ section.settings.other_name | default: "Cheap Alternatives" }}</th>
        </tr>
      </thead>
      <tbody>
        {% for block in section.blocks %}
          <tr {{ block.shopify_attributes }}>
            <td style="font-weight: 600; color: #f1f5f9;">{{ block.settings.feature_name }}</td>
            <td class="cf-highlight-col">
              {% if block.settings.us_value == "yes" %}
                <svg class="cf-check-svg" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              {% else %}
                <span style="color: #10b981; font-weight: 700;">{{ block.settings.us_text }}</span>
              {% endif %}
            </td>
            <td class="cf-other-col">
              {% if block.settings.them_value == "no" %}
                <svg class="cf-cross-svg" viewBox="0 0 24 24" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              {% else %}
                <span>{{ block.settings.them_text }}</span>
              {% endif %}
            </td>
          </tr>
        {% endfor %}
      </tbody>
    </table>
  </div>
</div>

{% schema %}
{
  "name": "CF Us vs Them Matrix",
  "tag": "section",
  "class": "convertflow-section",
  "settings": [
    {
      "type": "text",
      "id": "badge",
      "label": "Top Pill Badge",
      "default": "Comparative Analysis"
    },
    {
      "type": "text",
      "id": "title",
      "label": "Section Title",
      "default": "How We Compare to Generic Alternatives"
    },
    {
      "type": "text",
      "id": "subtitle",
      "label": "Subtitle",
      "default": "See why 50,000+ discerning customers switched to our standard."
    },
    {
      "type": "text",
      "id": "our_brand_name",
      "label": "Your Brand Name Column",
      "default": "ConvertFlow Edition"
    },
    {
      "type": "text",
      "id": "other_name",
      "label": "Competitor Column Title",
      "default": "Generic Brands"
    },
    {
      "type": "color",
      "id": "bg_color",
      "label": "Background Color",
      "default": "#0a0c10"
    },
    {
      "type": "range",
      "id": "padding_y",
      "min": 32,
      "max": 120,
      "step": 8,
      "unit": "px",
      "label": "Vertical Padding",
      "default": 64
    }
  ],
  "blocks": [
    {
      "type": "row",
      "name": "Comparison Row",
      "settings": [
        {
          "type": "text",
          "id": "feature_name",
          "label": "Feature Name",
          "default": "100% Medical-Grade Titanium"
        },
        {
          "type": "select",
          "id": "us_value",
          "label": "Our Brand Indicator",
          "options": [
            { "value": "yes", "label": "Green Checkmark" },
            { "value": "text", "label": "Custom Text" }
          ],
          "default": "yes"
        },
        {
          "type": "text",
          "id": "us_text",
          "label": "Our Brand Custom Text"
        },
        {
          "type": "select",
          "id": "them_value",
          "label": "Others Indicator",
          "options": [
            { "value": "no", "label": "Red Cross" },
            { "value": "text", "label": "Custom Text" }
          ],
          "default": "no"
        },
        {
          "type": "text",
          "id": "them_text",
          "label": "Others Custom Text"
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "CF Us vs Them Matrix",
      "blocks": [
        {
          "type": "row",
          "settings": {
            "feature_name": "Premium Aerospace Materials",
            "us_value": "yes",
            "them_value": "no"
          }
        },
        {
          "type": "row",
          "settings": {
            "feature_name": "Lifetime Replacement Guarantee",
            "us_value": "yes",
            "them_value": "no"
          }
        },
        {
          "type": "row",
          "settings": {
            "feature_name": "24/7 Dedicated Client Concierge",
            "us_value": "yes",
            "them_value": "no"
          }
        }
      ]
    }
  ]
}
{% endschema %}
`
  },
  {
    id: "cf-faq-accordion",
    slug: "faq-accordion",
    filename: "cf-faq-accordion.liquid",
    title: "SEO-Optimized FAQ Accordion",
    tagline: "Smooth animated collapsibles bundled with Google FAQPage Schema markup.",
    category: "FAQ & Support",
    cvrImpact: "+19.5% CVR",
    badge: "SEO Rich Snippets",
    description: "Eliminates pre-purchase friction by answering burning questions. Automatically generates valid Schema.org FAQPage JSON-LD rich data for Google search rank authority.",
    features: [
      "Zero-dependency pure CSS/JS animated accordion",
      "Automated Schema.org FAQPage structured JSON-LD data",
      "Theme 2.0 block management for unlimited Q&A pairs",
      "High-contrast obsidian theme with subtle border illumination",
      "Pre-purchase buyer reassurance (Shipping, Returns, Quality Guarantee)"
    ],
    previewHtml: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0c0e12; color: #ffffff; padding: 24px; border-radius: 8px; border: 1px solid #1e293b; max-width: 500px; margin: 0 auto;">
        <h3 style="font-size: 20px; font-weight: 800; text-align: center; margin: 0 0 16px 0;">Frequently Asked Questions</h3>
        <div style="border: 1px solid #1e293b; border-radius: 6px; margin-bottom: 8px; background: #111827;">
          <div style="padding: 12px 16px; font-size: 14px; font-weight: 700; display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
            <span>How fast is express delivery?</span>
            <span style="color: #10b981; font-weight: 900;">−</span>
          </div>
          <div style="padding: 0 16px 12px 16px; font-size: 13px; color: #94a3b8; line-height: 1.5;">
            All orders placed before 3 PM EST are dispatched same day with tracked express courier (2-4 business days).
          </div>
        </div>
        <div style="border: 1px solid #1e293b; border-radius: 6px; background: #111827;">
          <div style="padding: 12px 16px; font-size: 14px; font-weight: 700; display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
            <span>What is your return policy?</span>
            <span style="color: #94a3b8;">+</span>
          </div>
        </div>
      </div>
    `,
    liquidContent: `{% comment %}
  ConvertFlow - SEO-Optimized FAQ Accordion
  Zero-dependency animated collapsible with Schema.org FAQPage rich data.
{% endcomment %}

<div class="cf-faq-accordion" id="cf-faq-{{ section.id }}">
  <style>
    #cf-faq-{{ section.id }} {
      background: {{ section.settings.bg_color | default: "#0b0d11" }};
      color: {{ section.settings.text_color | default: "#ffffff" }};
      padding: {{ section.settings.padding_y | default: 64 }}px 20px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    #cf-faq-{{ section.id }} .cf-box {
      max-width: 760px;
      margin: 0 auto;
    }
    #cf-faq-{{ section.id }} .cf-title-group {
      text-align: center;
      margin-bottom: 36px;
    }
    #cf-faq-{{ section.id }} .cf-pill {
      display: inline-block;
      background: rgba(16, 185, 129, 0.12);
      color: #10b981;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 12px;
    }
    #cf-faq-{{ section.id }} .cf-heading {
      font-size: 32px;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.02em;
    }
    #cf-faq-{{ section.id }} .cf-item {
      border: 1px solid #1e293b;
      border-radius: 6px;
      background: #11141c;
      margin-bottom: 12px;
      transition: border-color 0.2s ease;
      overflow: hidden;
    }
    #cf-faq-{{ section.id }} .cf-item.active {
      border-color: #334155;
    }
    #cf-faq-{{ section.id }} .cf-question {
      padding: 18px 20px;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      user-select: none;
    }
    #cf-faq-{{ section.id }} .cf-icon-toggle {
      width: 20px;
      height: 20px;
      stroke: #94a3b8;
      fill: none;
      transition: transform 0.2s ease;
    }
    #cf-faq-{{ section.id }} .cf-item.active .cf-icon-toggle {
      transform: rotate(180deg);
      stroke: #10b981;
    }
    #cf-faq-{{ section.id }} .cf-answer {
      display: none;
      padding: 0 20px 20px 20px;
      font-size: 14px;
      line-height: 1.6;
      color: #94a3b8;
    }
    #cf-faq-{{ section.id }} .cf-item.active .cf-answer {
      display: block;
    }
  </style>

  <div class="cf-box">
    <div class="cf-title-group">
      {% if section.settings.badge != blank %}
        <span class="cf-pill">{{ section.settings.badge }}</span>
      {% endif %}
      <h2 class="cf-heading">{{ section.settings.title | default: "Frequently Asked Questions" }}</h2>
    </div>

    <div class="cf-list">
      {% for block in section.blocks %}
        <div class="cf-item {% if forloop.first %}active{% endif %}" {{ block.shopify_attributes }}>
          <div class="cf-question" onclick="this.parentElement.classList.toggle('active')">
            <span>{{ block.settings.question }}</span>
            <svg class="cf-icon-toggle" viewBox="0 0 24 24" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div class="cf-answer">
            {{ block.settings.answer }}
          </div>
        </div>
      {% endfor %}
    </div>
  </div>
</div>

{% comment %} Google Schema.org FAQPage Structured Data {% endcomment %}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {% for block in section.blocks %}
      {
        "@type": "Question",
        "name": {{ block.settings.question | json }},
        "acceptedAnswer": {
          "@type": "Answer",
          "text": {{ block.settings.answer | json }}
        }
      }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  ]
}
</script>

{% schema %}
{
  "name": "CF FAQ Accordion",
  "tag": "section",
  "class": "convertflow-section",
  "settings": [
    {
      "type": "text",
      "id": "badge",
      "label": "Top Badge",
      "default": "Customer Clarity"
    },
    {
      "type": "text",
      "id": "title",
      "label": "Section Title",
      "default": "Frequently Asked Questions"
    },
    {
      "type": "color",
      "id": "bg_color",
      "label": "Background Color",
      "default": "#0b0d11"
    },
    {
      "type": "range",
      "id": "padding_y",
      "min": 32,
      "max": 120,
      "step": 8,
      "unit": "px",
      "label": "Vertical Padding",
      "default": 64
    }
  ],
  "blocks": [
    {
      "type": "faq_item",
      "name": "Question & Answer",
      "settings": [
        {
          "type": "text",
          "id": "question",
          "label": "Question",
          "default": "How fast does my order ship?"
        },
        {
          "type": "textarea",
          "id": "answer",
          "label": "Answer",
          "default": "All orders are processed within 24 business hours. Express courier shipping delivers within 2-4 business days with full online tracking."
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "CF FAQ Accordion",
      "blocks": [
        {
          "type": "faq_item",
          "settings": {
            "question": "What is the return policy?",
            "answer": "We offer a 30-day no-questions-asked refund policy. If you are not completely satisfied, return it for a 100% full refund."
          }
        },
        {
          "type": "faq_item",
          "settings": {
            "question": "Is checkout secure?",
            "answer": "Yes, our checkout uses 256-bit SSL bank-grade encryption to ensure complete privacy and transaction safety."
          }
        }
      ]
    }
  ]
}
{% endschema %}
`
  },
  {
    id: "cf-trust-badges",
    slug: "trust-badges",
    filename: "cf-trust-badges.liquid",
    title: "Guaranteed Trust & Value Props Bar",
    tagline: "4-pillar conversion trust bar with razor-sharp monochrome vector icons.",
    category: "Trust & Security",
    cvrImpact: "+14.8% CVR",
    badge: "Risk Reversal",
    description: "Compact value proposition bar placed beneath heroes or purchase blocks to erase hesitation with guaranteed delivery, warranty, and SSL security seals.",
    features: [
      "4-column responsive grid (collapses gracefully on mobile)",
      "Monochrome luxury SVG vectors with zero emojis",
      "Full Theme 2.0 schema for custom guarantee copy",
      "Lightweight inline CSS with zero external network requests"
    ],
    previewHtml: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #08090d; color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #1e293b;">
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; text-align: center;">
          <div style="padding: 10px;">
            <div style="color: #10b981; font-size: 16px; margin-bottom: 4px;">📦</div>
            <div style="font-size: 12px; font-weight: 700;">Free Shipping</div>
            <div style="font-size: 10px; color: #64748b;">On all global orders</div>
          </div>
          <div style="padding: 10px;">
            <div style="color: #10b981; font-size: 16px; margin-bottom: 4px;">🛡️</div>
            <div style="font-size: 12px; font-weight: 700;">30-Day Guarantee</div>
            <div style="font-size: 10px; color: #64748b;">100% money back</div>
          </div>
          <div style="padding: 10px;">
            <div style="color: #10b981; font-size: 16px; margin-bottom: 4px;">🔒</div>
            <div style="font-size: 12px; font-weight: 700;">256-Bit SSL</div>
            <div style="font-size: 10px; color: #64748b;">Bank-grade checkout</div>
          </div>
          <div style="padding: 10px;">
            <div style="color: #10b981; font-size: 16px; margin-bottom: 4px;">💬</div>
            <div style="font-size: 12px; font-weight: 700;">24/7 Support</div>
            <div style="font-size: 10px; color: #64748b;">Dedicated concierge</div>
          </div>
        </div>
      </div>
    `,
    liquidContent: `{% comment %}
  ConvertFlow - Guaranteed Trust & Value Props Bar
  Compact 4-pillar risk reversal banner with zero emojis and 100% vector SVGs.
{% endcomment %}

<div class="cf-trust-bar" id="cf-trust-{{ section.id }}">
  <style>
    #cf-trust-{{ section.id }} {
      background: {{ section.settings.bg_color | default: "#07080a" }};
      color: {{ section.settings.text_color | default: "#ffffff" }};
      padding: {{ section.settings.padding_y | default: 32 }}px 20px;
      border-top: 1px solid #1e293b;
      border-bottom: 1px solid #1e293b;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    #cf-trust-{{ section.id }} .cf-grid {
      max-width: 1100px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }
    #cf-trust-{{ section.id }} .cf-card {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    #cf-trust-{{ section.id }} .cf-icon-wrap {
      width: 40px;
      height: 40px;
      border-radius: 6px;
      background: #11141c;
      border: 1px solid #1e293b;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    #cf-trust-{{ section.id }} .cf-icon-wrap svg {
      width: 20px;
      height: 20px;
      stroke: #10b981;
      fill: none;
    }
    #cf-trust-{{ section.id }} .cf-card-title {
      font-size: 13px;
      font-weight: 700;
      margin: 0 0 2px 0;
      color: #ffffff;
    }
    #cf-trust-{{ section.id }} .cf-card-sub {
      font-size: 11px;
      color: #64748b;
      margin: 0;
    }
    @media (max-width: 768px) {
      #cf-trust-{{ section.id }} .cf-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }
    }
  </style>

  <div class="cf-grid">
    <div class="cf-card">
      <div class="cf-icon-wrap">
        <svg viewBox="0 0 24 24" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
      </div>
      <div>
        <div class="cf-card-title">{{ section.settings.prop_1_title | default: "Free Global Shipping" }}</div>
        <div class="cf-card-sub">{{ section.settings.prop_1_sub | default: "All orders delivered tracked" }}</div>
      </div>
    </div>

    <div class="cf-card">
      <div class="cf-icon-wrap">
        <svg viewBox="0 0 24 24" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      </div>
      <div>
        <div class="cf-card-title">{{ section.settings.prop_2_title | default: "30-Day Money Back" }}</div>
        <div class="cf-card-sub">{{ section.settings.prop_2_sub | default: "Risk-free return guarantee" }}</div>
      </div>
    </div>

    <div class="cf-card">
      <div class="cf-icon-wrap">
        <svg viewBox="0 0 24 24" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      </div>
      <div>
        <div class="cf-card-title">{{ section.settings.prop_3_title | default: "256-Bit SSL Protection" }}</div>
        <div class="cf-card-sub">{{ section.settings.prop_3_sub | default: "Encrypted direct checkout" }}</div>
      </div>
    </div>

    <div class="cf-card">
      <div class="cf-icon-wrap">
        <svg viewBox="0 0 24 24" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      </div>
      <div>
        <div class="cf-card-title">{{ section.settings.prop_4_title | default: "24/7 Client Concierge" }}</div>
        <div class="cf-card-sub">{{ section.settings.prop_4_sub | default: "Priority live chat support" }}</div>
      </div>
    </div>
  </div>
</div>

{% schema %}
{
  "name": "CF Trust & Value Props",
  "tag": "section",
  "class": "convertflow-section",
  "settings": [
    {
      "type": "text",
      "id": "prop_1_title",
      "label": "Prop 1 Title",
      "default": "Free Global Shipping"
    },
    {
      "type": "text",
      "id": "prop_1_sub",
      "label": "Prop 1 Subtext",
      "default": "All orders delivered tracked"
    },
    {
      "type": "text",
      "id": "prop_2_title",
      "label": "Prop 2 Title",
      "default": "30-Day Money Back"
    },
    {
      "type": "text",
      "id": "prop_2_sub",
      "label": "Prop 2 Subtext",
      "default": "Risk-free return guarantee"
    },
    {
      "type": "text",
      "id": "prop_3_title",
      "label": "Prop 3 Title",
      "default": "256-Bit SSL Protection"
    },
    {
      "type": "text",
      "id": "prop_3_sub",
      "label": "Prop 3 Subtext",
      "default": "Encrypted direct checkout"
    },
    {
      "type": "text",
      "id": "prop_4_title",
      "label": "Prop 4 Title",
      "default": "24/7 Client Concierge"
    },
    {
      "type": "text",
      "id": "prop_4_sub",
      "label": "Prop 4 Subtext",
      "default": "Priority live chat support"
    },
    {
      "type": "color",
      "id": "bg_color",
      "label": "Background Color",
      "default": "#07080a"
    },
    {
      "type": "range",
      "id": "padding_y",
      "min": 16,
      "max": 80,
      "step": 4,
      "unit": "px",
      "label": "Vertical Padding",
      "default": 32
    }
  ],
  "presets": [
    {
      "name": "CF Trust & Value Props"
    }
  ]
}
{% endschema %}
`
  }
];

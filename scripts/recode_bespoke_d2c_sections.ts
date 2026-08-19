import fs from 'fs';
import path from 'path';

interface SectionDef {
  filename: string;
  niche: string;
  brand: string;
  sectionTitle: string;
  type: string;
  category: string;
  accent: string;
  bgDark: boolean;
  bg: string;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  fontHeading: string;
  fontBody: string;
  badge: string;
  headline: string;
  desc: string;
  cta1: string;
  cta2: string;
  items: Array<{ title: string; subtitle?: string; price?: string; tag?: string; img?: string; rating?: number; text?: string }>;
}

export function generateUltraHighEndLiquid(def: SectionDef): string {
  const isDark = def.bgDark;
  const itemsJson = JSON.stringify(def.items);

  return `{% comment %}
  -----------------------------------------------------------------------------
  Bespoke D2C Architecture: ${def.brand} - ${def.sectionTitle}
  Niche: ${def.niche.toUpperCase()} | Conversion Rate Optimized | 100% Mobile First
  -----------------------------------------------------------------------------
{% endcomment %}

{%- liquid
  assign section_id = section.id | default: 'd2c-sec'
  assign bg_color = section.settings.bg_color | default: '${def.bg}'
  assign text_color = section.settings.text_color | default: '${def.textPrimary}'
  assign accent_color = section.settings.accent_color | default: '${def.accent}'
  assign heading_text = section.settings.heading | default: '${def.headline}'
  assign subheading_text = section.settings.subheading | default: '${def.badge}'
  assign desc_text = section.settings.desc | default: '${def.desc}'
  assign btn_primary_text = section.settings.btn_primary_text | default: '${def.cta1}'
  assign btn_primary_link = section.settings.btn_primary_link | default: '/collections/all'
  assign btn_secondary_text = section.settings.btn_secondary_text | default: '${def.cta2}'
  assign btn_secondary_link = section.settings.btn_secondary_link | default: '/pages/about'
-%}

<section
  id="d2c-section-{{ section_id }}"
  class="d2c-ultra-section d2c-ultra-${def.type} ${isDark ? 'd2c-theme-dark' : 'd2c-theme-light'}"
  data-section-type="${def.type}"
  data-niche="${def.niche}"
>
  <div class="d2c-container">
    {%- if subheading_text != blank or heading_text != blank -%}
      <header class="d2c-section-header">
        {%- if subheading_text != blank -%}
          <div class="d2c-badge-pill">
            <span class="d2c-badge-dot"></span>
            <span class="d2c-badge-text">{{ subheading_text }}</span>
          </div>
        {%- endif -%}

        {%- if heading_text != blank -%}
          <h2 class="d2c-section-title">
            {{ heading_text }}
          </h2>
        {%- endif -%}

        {%- if desc_text != blank -%}
          <p class="d2c-section-desc">
            {{ desc_text }}
          </p>
        {%- endif -%}
      </header>
    {%- endif -%}

    <!-- Main Content Canvas -->
    <div class="d2c-content-canvas">
      {%- if section.blocks.size > 0 -%}
        <div class="d2c-dynamic-grid d2c-cols-{{ section.settings.grid_cols | default: 4 }}">
          {%- for block in section.blocks -%}
            <div class="d2c-grid-card" {{ block.shopify_attributes }}>
              {%- if block.settings.image != blank -%}
                <div class="d2c-card-media">
                  <img
                    src="{{ block.settings.image | image_url: width: 600 }}"
                    alt="{{ block.settings.title | escape }}"
                    loading="lazy"
                    width="600"
                    height="600"
                  />
                  {%- if block.settings.tag != blank -%}
                    <span class="d2c-card-tag">{{ block.settings.tag }}</span>
                  {%- endif -%}
                </div>
              {%- endif -%}

              <div class="d2c-card-body">
                {%- if block.settings.rating != blank -%}
                  <div class="d2c-stars" aria-label="{{ block.settings.rating }} stars">
                    ★★★★★ <span class="d2c-rating-val">({{ block.settings.rating }}.0)</span>
                  </div>
                {%- endif -%}

                {%- if block.settings.title != blank -%}
                  <h3 class="d2c-card-title">{{ block.settings.title }}</h3>
                {%- endif -%}

                {%- if block.settings.text != blank -%}
                  <p class="d2c-card-text">{{ block.settings.text }}</p>
                {%- endif -%}

                {%- if block.settings.price != blank -%}
                  <div class="d2c-card-price-row">
                    <span class="d2c-price-main">{{ block.settings.price }}</span>
                    {%- if block.settings.original_price != blank -%}
                      <span class="d2c-price-compare">{{ block.settings.original_price }}</span>
                    {%- endif -%}
                  </div>
                {%- endif -%}

                {%- if block.settings.link_text != blank -%}
                  <a href="{{ block.settings.link_url | default: '/collections/all' }}" class="d2c-card-link">
                    {{ block.settings.link_text }} &rarr;
                  </a>
                {%- endif -%}
              </div>
            </div>
          {%- endfor -%}
        </div>
      {%- else -%}
        <!-- Curated High-Fidelity Archetype Fallback Grid -->
        <div class="d2c-dynamic-grid d2c-cols-{{ section.settings.grid_cols | default: 4 }}">
          ${def.items.map((item, idx) => `
            <div class="d2c-grid-card">
              ${item.img ? `
                <div class="d2c-card-media">
                  <img
                    src="${item.img}"
                    alt="${item.title}"
                    loading="lazy"
                    class="d2c-img-cover"
                  />
                  ${item.tag ? `<span class="d2c-card-tag">${item.tag}</span>` : ''}
                </div>
              ` : ''}

              <div class="d2c-card-body">
                ${item.rating ? `
                  <div class="d2c-stars">
                    ★★★★★ <span class="d2c-rating-val">(4.9)</span>
                  </div>
                ` : ''}

                <h3 class="d2c-card-title">${item.title}</h3>
                ${item.subtitle ? `<div class="d2c-card-subtitle">${item.subtitle}</div>` : ''}
                ${item.text ? `<p class="d2c-card-text">${item.text}</p>` : ''}

                ${item.price ? `
                  <div class="d2c-card-price-row">
                    <span class="d2c-price-main">${item.price}</span>
                    <span class="d2c-stock-status">In Stock • 24hr Dispatch</span>
                  </div>
                ` : ''}

                <div class="d2c-card-action">
                  <a href="/collections/all" class="d2c-btn-card">
                    Explore Item &rarr;
                  </a>
                </div>
              </div>
            </div>
          `).join('\n')}
        </div>
      {%- endif -%}
    </div>

    <!-- Section CTA Footer Bar -->
    {%- if btn_primary_text != blank or btn_secondary_text != blank -%}
      <div class="d2c-section-actions">
        {%- if btn_primary_text != blank -%}
          <a href="{{ btn_primary_link }}" class="d2c-btn-primary">
            {{ btn_primary_text }} &rarr;
          </a>
        {%- endif -%}
        {%- if btn_secondary_text != blank -%}
          <a href="{{ btn_secondary_link }}" class="d2c-btn-secondary">
            {{ btn_secondary_text }}
          </a>
        {%- endif -%}
      </div>
    {%- endif -%}
  </div>
</section>

<style>
  #d2c-section-{{ section_id }} {
    --d2c-bg: {{ bg_color }};
    --d2c-text: {{ text_color }};
    --d2c-accent: {{ accent_color }};
    --d2c-card-bg: ${def.cardBg};
    --d2c-border: ${def.border};
    --d2c-text-sub: ${def.textSecondary};

    background-color: var(--d2c-bg);
    color: var(--d2c-text);
    padding: 72px 24px;
    font-family: ${def.fontBody};
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
  }

  #d2c-section-{{ section_id }} * {
    box-sizing: border-box;
  }

  #d2c-section-{{ section_id }} .d2c-container {
    max-width: 1320px;
    margin: 0 auto;
    width: 100%;
  }

  /* Section Header */
  #d2c-section-{{ section_id }} .d2c-section-header {
    text-align: center;
    max-width: 780px;
    margin: 0 auto 48px auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  #d2c-section-{{ section_id }} .d2c-badge-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'};
    color: var(--d2c-accent);
    padding: 6px 14px;
    border-radius: 99px;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 1px;
    text-transform: uppercase;
    border: 1px solid var(--d2c-border);
  }

  #d2c-section-{{ section_id }} .d2c-badge-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--d2c-accent);
    display: inline-block;
    box-shadow: 0 0 8px var(--d2c-accent);
  }

  #d2c-section-{{ section_id }} .d2c-section-title {
    font-family: ${def.fontHeading};
    font-size: clamp(28px, 4vw, 46px);
    font-weight: 900;
    line-height: 1.15;
    letter-spacing: -0.5px;
    color: var(--d2c-text);
    margin: 0;
    text-transform: ${def.niche === 'clothing' && def.brand.includes('Bewakoof') ? 'uppercase' : 'none'};
  }

  #d2c-section-{{ section_id }} .d2c-section-desc {
    font-size: clamp(14px, 1.8vw, 16px);
    line-height: 1.6;
    color: var(--d2c-text-sub);
    margin: 0;
    max-width: 620px;
  }

  /* Grid Canvas */
  #d2c-section-{{ section_id }} .d2c-dynamic-grid {
    display: grid;
    gap: 24px;
    width: 100%;
  }

  #d2c-section-{{ section_id }} .d2c-cols-4 {
    grid-template-columns: repeat(4, 1fr);
  }

  #d2c-section-{{ section_id }} .d2c-cols-3 {
    grid-template-columns: repeat(3, 1fr);
  }

  #d2c-section-{{ section_id }} .d2c-cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }

  /* Cards */
  #d2c-section-{{ section_id }} .d2c-grid-card {
    background: var(--d2c-card-bg);
    border: 1px solid var(--d2c-border);
    border-radius: ${def.niche === 'clothing' && def.brand.includes('Bewakoof') ? '4px' : '16px'};
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease;
    box-shadow: 0 4px 16px rgba(0,0,0,0.04);
  }

  #d2c-section-{{ section_id }} .d2c-grid-card:hover {
    transform: translateY(-6px);
    border-color: var(--d2c-accent);
    box-shadow: 0 16px 32px rgba(0, 0, 0, ${isDark ? '0.4' : '0.12'});
  }

  #d2c-section-{{ section_id }} .d2c-card-media {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    background: #111;
  }

  #d2c-section-{{ section_id }} .d2c-img-cover {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.5s ease;
  }

  #d2c-section-{{ section_id }} .d2c-grid-card:hover .d2c-img-cover {
    transform: scale(1.06);
  }

  #d2c-section-{{ section_id }} .d2c-card-tag {
    position: absolute;
    top: 12px;
    left: 12px;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(6px);
    color: #ffffff;
    font-size: 10px;
    font-weight: 800;
    padding: 4px 10px;
    border-radius: 4px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    border: 1px solid rgba(255, 255, 255, 0.15);
  }

  #d2c-section-{{ section_id }} .d2c-card-body {
    padding: 20px;
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 8px;
  }

  #d2c-section-{{ section_id }} .d2c-stars {
    color: #f59e0b;
    font-size: 13px;
    letter-spacing: 2px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  #d2c-section-{{ section_id }} .d2c-rating-val {
    color: var(--d2c-text-sub);
    font-size: 11px;
    font-weight: 700;
  }

  #d2c-section-{{ section_id }} .d2c-card-title {
    font-family: ${def.fontHeading};
    font-size: 16px;
    font-weight: 800;
    color: var(--d2c-text);
    margin: 0;
    line-height: 1.3;
  }

  #d2c-section-{{ section_id }} .d2c-card-subtitle {
    font-size: 12px;
    color: var(--d2c-accent);
    font-weight: 700;
  }

  #d2c-section-{{ section_id }} .d2c-card-text {
    font-size: 13px;
    line-height: 1.5;
    color: var(--d2c-text-sub);
    margin: 0;
    flex: 1;
  }

  #d2c-section-{{ section_id }} .d2c-card-price-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
    margin-top: 6px;
  }

  #d2c-section-{{ section_id }} .d2c-price-main {
    font-size: 17px;
    font-weight: 900;
    color: var(--d2c-accent);
  }

  #d2c-section-{{ section_id }} .d2c-stock-status {
    font-size: 11px;
    color: #10b981;
    font-weight: 700;
  }

  #d2c-section-{{ section_id }} .d2c-card-action {
    margin-top: 12px;
  }

  #d2c-section-{{ section_id }} .d2c-btn-card {
    display: block;
    width: 100%;
    text-align: center;
    background: ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'};
    color: var(--d2c-text);
    padding: 10px 16px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 800;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border: 1px solid var(--d2c-border);
    transition: background 0.2s ease, color 0.2s ease;
  }

  #d2c-section-{{ section_id }} .d2c-btn-card:hover {
    background: var(--d2c-accent);
    color: ${isDark ? '#000000' : '#ffffff'};
    border-color: var(--d2c-accent);
  }

  /* Actions Footer */
  #d2c-section-{{ section_id }} .d2c-section-actions {
    margin-top: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  #d2c-section-{{ section_id }} .d2c-btn-primary {
    background: var(--d2c-accent);
    color: ${isDark ? '#000000' : '#ffffff'};
    padding: 16px 36px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 900;
    text-decoration: none;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    box-shadow: 0 8px 24px rgba(0,0,0,0.25);
    transition: transform 0.2s ease, opacity 0.2s ease;
  }

  #d2c-section-{{ section_id }} .d2c-btn-primary:hover {
    transform: translateY(-2px);
    opacity: 0.95;
  }

  #d2c-section-{{ section_id }} .d2c-btn-secondary {
    background: transparent;
    color: var(--d2c-text);
    padding: 16px 32px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 800;
    text-decoration: none;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    border: 1px solid var(--d2c-border);
    transition: background 0.2s ease, border-color 0.2s ease;
  }

  #d2c-section-{{ section_id }} .d2c-btn-secondary:hover {
    border-color: var(--d2c-accent);
    background: ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'};
  }

  /* Responsive Media Queries */
  @media (max-width: 1024px) {
    #d2c-section-{{ section_id }} .d2c-cols-4 {
      grid-template-columns: repeat(2, 1fr);
    }
    #d2c-section-{{ section_id }} .d2c-cols-3 {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    #d2c-section-{{ section_id }} {
      padding: 48px 16px;
    }
    #d2c-section-{{ section_id }} .d2c-section-header {
      margin-bottom: 32px;
    }
    #d2c-section-{{ section_id }} .d2c-cols-4,
    #d2c-section-{{ section_id }} .d2c-cols-3,
    #d2c-section-{{ section_id }} .d2c-cols-2 {
      grid-template-columns: 1fr;
      gap: 16px;
    }
    #d2c-section-{{ section_id }} .d2c-btn-primary,
    #d2c-section-{{ section_id }} .d2c-btn-secondary {
      width: 100%;
      text-align: center;
    }
  }
</style>

{% schema %}
{
  "name": "${def.sectionTitle.replace(/"/g, '\\"')}",
  "tag": "section",
  "class": "d2c-section-wrapper",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "${def.headline.replace(/"/g, '\\"')}"
    },
    {
      "type": "text",
      "id": "subheading",
      "label": "Subheading Badge",
      "default": "${def.badge.replace(/"/g, '\\"')}"
    },
    {
      "type": "textarea",
      "id": "desc",
      "label": "Description",
      "default": "${def.desc.replace(/"/g, '\\"')}"
    },
    {
      "type": "color",
      "id": "bg_color",
      "label": "Background Color",
      "default": "${def.bg}"
    },
    {
      "type": "color",
      "id": "text_color",
      "label": "Text Color",
      "default": "${def.textPrimary}"
    },
    {
      "type": "color",
      "id": "accent_color",
      "label": "Accent Color",
      "default": "${def.accent}"
    },
    {
      "type": "text",
      "id": "btn_primary_text",
      "label": "Primary Button Text",
      "default": "${def.cta1.replace(/"/g, '\\"')}"
    },
    {
      "type": "url",
      "id": "btn_primary_link",
      "label": "Primary Button Link"
    },
    {
      "type": "text",
      "id": "btn_secondary_text",
      "label": "Secondary Button Text",
      "default": "${def.cta2.replace(/"/g, '\\"')}"
    },
    {
      "type": "url",
      "id": "btn_secondary_link",
      "label": "Secondary Button Link"
    }
  ],
  "blocks": [
    {
      "type": "item",
      "name": "Item Card",
      "settings": [
        {
          "type": "image_picker",
          "id": "image",
          "label": "Card Image"
        },
        {
          "type": "text",
          "id": "tag",
          "label": "Badge Tag"
        },
        {
          "type": "text",
          "id": "title",
          "label": "Title",
          "default": "Featured Item"
        },
        {
          "type": "textarea",
          "id": "text",
          "label": "Description"
        },
        {
          "type": "text",
          "id": "price",
          "label": "Price"
        },
        {
          "type": "text",
          "id": "original_price",
          "label": "Original Price"
        },
        {
          "type": "range",
          "id": "rating",
          "min": 1,
          "max": 5,
          "step": 1,
          "label": "Star Rating",
          "default": 5
        },
        {
          "type": "text",
          "id": "link_text",
          "label": "Link Text",
          "default": "Learn More"
        },
        {
          "type": "url",
          "id": "link_url",
          "label": "Link URL"
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "${def.sectionTitle.replace(/"/g, '\\"')}"
    }
  ]
}
{% endschema %}
`;
}

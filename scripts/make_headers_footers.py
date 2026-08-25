import os

sections_dir = os.path.join(os.getcwd(), "dev-theme-peri", "sections")
theme_engine_dir = os.path.join(os.getcwd(), "app", "data", "templates", "theme-engine", "base-theme", "sections")

headers_created = 0
footers_created = 0

for i in range(1, 101):
    hp_num = str(i)
    h_file = f"hp{hp_num}-header.liquid"
    f_file = f"hp{hp_num}-footer.liquid"

    h_path = os.path.join(sections_dir, h_file)
    f_path = os.path.join(sections_dir, f_file)

    if not os.path.exists(h_path):
        header_code = f"""{{%- comment -%}}
  sections/{h_file}
  Dedicated Header for Homepage {hp_num}
{{%- endcomment -%}}

{{%- liquid
  assign section_id = 'hp{hp_num}-hdr-' | append: section.id
-%}}

<style>
  #shopify-section-{{{{ section.id }}}} {{
    --hdr-bg: {{{{ section.settings.bg_color | default: '#ffffff' }}}};
    --hdr-text: {{{{ section.settings.text_color | default: '#111827' }}}};
    --hdr-accent: {{{{ section.settings.primary_color | default: '#2563eb' }}}};
  }}

  .hp{hp_num}-header {{
    position: sticky;
    top: 0;
    z-index: 1000;
    background: var(--hdr-bg);
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    transition: box-shadow 0.3s ease;
  }}
  .hp{hp_num}-header.scrolled {{
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }}
  .hp{hp_num}-header__container {{
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 24px;
  }}
  .hp{hp_num}-header__inner {{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 72px;
  }}
  .hp{hp_num}-header__logo {{
    font-family: var(--font-heading, sans-serif);
    font-weight: 800;
    font-size: 24px;
    color: var(--hdr-text);
    text-decoration: none;
    letter-spacing: -0.5px;
    display: flex;
    align-items: center;
    gap: 8px;
  }}
  .hp{hp_num}-header__logo-dot {{
    width: 8px;
    height: 8px;
    background: var(--hdr-accent);
    border-radius: 50%;
  }}
  .hp{hp_num}-header__nav {{
    display: flex;
    align-items: center;
    gap: 28px;
    list-style: none;
    margin: 0;
    padding: 0;
  }}
  .hp{hp_num}-header__nav a {{
    font-size: 14px;
    font-weight: 600;
    color: var(--hdr-text);
    text-decoration: none;
    opacity: 0.8;
    transition: opacity 0.2s ease, color 0.2s ease;
  }}
  .hp{hp_num}-header__nav a:hover {{
    opacity: 1;
    color: var(--hdr-accent);
  }}
  .hp{hp_num}-header__actions {{
    display: flex;
    align-items: center;
    gap: 16px;
  }}
  .hp{hp_num}-header__cart {{
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.04);
    color: var(--hdr-text);
    text-decoration: none;
  }}
  .hp{hp_num}-header__cart-badge {{
    position: absolute;
    top: 4px;
    right: 4px;
    background: var(--hdr-accent);
    color: #ffffff;
    font-size: 10px;
    font-weight: 700;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }}
  .hp{hp_num}-header__toggle {{
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
  }}
  .hp{hp_num}-header__toggle span {{
    width: 22px;
    height: 2px;
    background: var(--hdr-text);
    border-radius: 2px;
  }}
  .hp{hp_num}-mobile-menu {{
    display: none;
    position: fixed;
    top: 72px;
    left: 0;
    right: 0;
    background: var(--hdr-bg);
    padding: 24px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    z-index: 999;
    flex-direction: column;
    gap: 16px;
  }}
  .hp{hp_num}-mobile-menu.open {{
    display: flex;
  }}
  .hp{hp_num}-mobile-menu a {{
    font-size: 16px;
    font-weight: 600;
    color: var(--hdr-text);
    text-decoration: none;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }}
  @media (max-width: 768px) {{
    .hp{hp_num}-header__nav {{ display: none; }}
    .hp{hp_num}-header__toggle {{ display: flex; }}
  }}
</style>

<header class="hp{hp_num}-header" id="{{{{ section_id }}}}">
  <div class="hp{hp_num}-header__container">
    <div class="hp{hp_num}-header__inner">
      <a href="{{{{ routes.root_url }}}}" class="hp{hp_num}-header__logo">
        {{{{ section.settings.brand_name | default: 'STORE' }}}}
        <span class="hp{hp_num}-header__logo-dot"></span>
      </a>
      <nav>
        <ul class="hp{hp_num}-header__nav">
          {{%- if section.settings.menu != blank -%}}
            {{%- for link in linklists[section.settings.menu].links -%}}
              <li><a href="{{{{ link.url }}}}">{{{{ link.title }}}}</a></li>
            {{%- endfor -%}}
          {{%- else -%}}
            <li><a href="#hero">Home</a></li>
            <li><a href="#featured">Products</a></li>
            <li><a href="#categories">Categories</a></li>
            <li><a href="#testimonials">Reviews</a></li>
            <li><a href="#faq">FAQ</a></li>
          {{%- endif -%}}
        </ul>
      </nav>
      <div class="hp{hp_num}-header__actions">
        <a href="{{{{ routes.cart_url }}}}" class="hp{hp_num}-header__cart" aria-label="Cart">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <span class="hp{hp_num}-header__cart-badge">{{{{ cart.item_count | default: 0 }}}}</span>
        </a>
        <button class="hp{hp_num}-header__toggle" id="hp{hp_num}Toggle" aria-label="Toggle Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </div>
</header>

<div class="hp{hp_num}-mobile-menu" id="hp{hp_num}Menu">
  {{%- if section.settings.menu != blank -%}}
    {{%- for link in linklists[section.settings.menu].links -%}}
      <a href="{{{{ link.url }}}}">{{{{ link.title }}}}</a>
    {{%- endfor -%}}
  {{%- else -%}}
    <a href="#hero">Home</a>
    <a href="#featured">Products</a>
    <a href="#categories">Categories</a>
    <a href="#testimonials">Reviews</a>
    <a href="#faq">FAQ</a>
  {{%- endif -%}}
</div>

<script>
  (function() {{
    var hdr = document.getElementById('{{{{ section_id }}}}');
    var btn = document.getElementById('hp{hp_num}Toggle');
    var menu = document.getElementById('hp{hp_num}Menu');
    if (hdr) {{
      window.addEventListener('scroll', function() {{
        if (window.scrollY > 15) hdr.classList.add('scrolled');
        else hdr.classList.remove('scrolled');
      }});
    }}
    if (btn && menu) {{
      btn.addEventListener('click', function() {{
        menu.classList.toggle('open');
      }});
    }}
  }})();
</script>

{{% schema %}}
{{
  "name": "HP{hp_num} Header",
  "tag": "section",
  "class": "section-hp{hp_num}-header",
  "settings": [
    {{ "type": "text", "id": "brand_name", "label": "Brand Name", "default": "STORE" }},
    {{ "type": "link_list", "id": "menu", "label": "Header Menu" }},
    {{ "type": "color", "id": "bg_color", "label": "Background Color", "default": "#ffffff" }},
    {{ "type": "color", "id": "text_color", "label": "Text Color", "default": "#111827" }},
    {{ "type": "color", "id": "primary_color", "label": "Accent Color", "default": "#2563eb" }}
  ],
  "presets": [{{ "name": "HP{hp_num} Header" }}]
}}
{{% endschema %}}
"""
        with open(h_path, 'w', encoding='utf-8') as f:
            f.write(header_code)
        m_h_path = os.path.join(theme_engine_dir, h_file)
        with open(m_h_path, 'w', encoding='utf-8') as f:
            f.write(header_code)
        headers_created += 1

    if not os.path.exists(f_path):
        footer_code = f"""{{%- comment -%}}
  sections/{f_file}
  Dedicated Footer for Homepage {hp_num}
{{%- endcomment -%}}

{{%- liquid
  assign section_id = 'hp{hp_num}-ftr-' | append: section.id
-%}}

<style>
  #shopify-section-{{{{ section.id }}}} {{
    --ftr-bg: {{{{ section.settings.bg_color | default: '#111827' }}}};
    --ftr-text: {{{{ section.settings.text_color | default: '#f9fafb' }}}};
    --ftr-muted: {{{{ section.settings.muted_color | default: '#9ca3af' }}}};
    --ftr-accent: {{{{ section.settings.primary_color | default: '#2563eb' }}}};
  }}

  .hp{hp_num}-footer {{
    background: var(--ftr-bg);
    color: var(--ftr-text);
    padding: 64px 0 32px;
  }}
  .hp{hp_num}-footer__container {{
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 24px;
  }}
  .hp{hp_num}-footer__grid {{
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 40px;
    margin-bottom: 48px;
  }}
  .hp{hp_num}-footer__brand {{
    font-family: var(--font-heading, sans-serif);
    font-weight: 800;
    font-size: 24px;
    color: #ffffff;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }}
  .hp{hp_num}-footer__brand-dot {{
    width: 8px;
    height: 8px;
    background: var(--ftr-accent);
    border-radius: 50%;
  }}
  .hp{hp_num}-footer__desc {{
    font-size: 14px;
    color: var(--ftr-muted);
    line-height: 1.6;
    max-width: 320px;
  }}
  .hp{hp_num}-footer__title {{
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #ffffff;
    margin-bottom: 18px;
  }}
  .hp{hp_num}-footer__nav {{
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }}
  .hp{hp_num}-footer__nav a {{
    font-size: 14px;
    color: var(--ftr-muted);
    text-decoration: none;
    transition: color 0.2s ease;
  }}
  .hp{hp_num}-footer__nav a:hover {{
    color: #ffffff;
  }}
  .hp{hp_num}-footer__bottom {{
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 13px;
    color: var(--ftr-muted);
  }}
  .hp{hp_num}-footer__links {{
    display: flex;
    gap: 16px;
  }}
  .hp{hp_num}-footer__links a {{
    color: var(--ftr-muted);
    text-decoration: none;
  }}
  .hp{hp_num}-footer__links a:hover {{
    color: #ffffff;
  }}
  @media (max-width: 768px) {{
    .hp{hp_num}-footer__grid {{
      grid-template-columns: 1fr;
      gap: 32px;
    }}
    .hp{hp_num}-footer__bottom {{
      flex-direction: column;
      gap: 12px;
      text-align: center;
    }}
  }}
</style>

<footer class="hp{hp_num}-footer" id="{{{{ section_id }}}}">
  <div class="hp{hp_num}-footer__container">
    <div class="hp{hp_num}-footer__grid">
      <div>
        <div class="hp{hp_num}-footer__brand">
          {{{{ section.settings.brand_name | default: 'STORE' }}}}
          <span class="hp{hp_num}-footer__brand-dot"></span>
        </div>
        <p class="hp{hp_num}-footer__desc">
          {{{{ section.settings.about_text | default: 'Premium products crafted with excellence and care.' }}}}
        </p>
      </div>

      <div>
        <h4 class="hp{hp_num}-footer__title">Navigation</h4>
        <ul class="hp{hp_num}-footer__nav">
          <li><a href="#hero">Home</a></li>
          <li><a href="#featured">Shop</a></li>
          <li><a href="#categories">Collections</a></li>
          <li><a href="#story">About Us</a></li>
        </ul>
      </div>

      <div>
        <h4 class="hp{hp_num}-footer__title">Categories</h4>
        <ul class="hp{hp_num}-footer__nav">
          <li><a href="#categories">New Arrivals</a></li>
          <li><a href="#categories">Best Sellers</a></li>
          <li><a href="#categories">Featured</a></li>
          <li><a href="#categories">Special Offers</a></li>
        </ul>
      </div>

      <div>
        <h4 class="hp{hp_num}-footer__title">Connect</h4>
        <ul class="hp{hp_num}-footer__nav">
          <li><a href="https://instagram.com" target="_blank">Instagram</a></li>
          <li><a href="https://facebook.com" target="_blank">Facebook</a></li>
          <li><a href="https://twitter.com" target="_blank">Twitter</a></li>
          <li><a href="https://tiktok.com" target="_blank">TikTok</a></li>
        </ul>
      </div>
    </div>

    <div class="hp{hp_num}-footer__bottom">
      <div>&copy; {{{{ 'now' | date: '%Y' }}}} {{{{ section.settings.brand_name | default: 'STORE' }}}}. All rights reserved.</div>
      <div class="hp{hp_num}-footer__links">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
      </div>
    </div>
  </div>
</footer>

{{% schema %}}
{{
  "name": "HP{hp_num} Footer",
  "tag": "section",
  "class": "section-hp{hp_num}-footer",
  "settings": [
    {{ "type": "text", "id": "brand_name", "label": "Brand Name", "default": "STORE" }},
    {{ "type": "textarea", "id": "about_text", "label": "About Text", "default": "Premium products crafted with excellence and care." }},
    {{ "type": "color", "id": "bg_color", "label": "Background Color", "default": "#111827" }},
    {{ "type": "color", "id": "text_color", "label": "Text Color", "default": "#f9fafb" }},
    {{ "type": "color", "id": "primary_color", "label": "Accent Color", "default": "#2563eb" }}
  ],
  "presets": [{{ "name": "HP{hp_num} Footer" }}]
}}
{{% endschema %}}
"""
        with open(f_path, 'w', encoding='utf-8') as f:
            f.write(footer_code)
        m_f_path = os.path.join(theme_engine_dir, f_file)
        with open(m_f_path, 'w', encoding='utf-8') as f:
            f.write(footer_code)
        footers_created += 1

print(f"Done! Created {headers_created} headers and {footers_created} footers for HP v1..100.")

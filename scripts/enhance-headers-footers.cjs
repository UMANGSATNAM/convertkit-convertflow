const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, '../app/data/templates');

const templates = {
  'fitness-power': { prefix: 'fp', color: '#ff4500' },
  'fresh-bites': { prefix: 'fb', color: '#4caf50' },
  'grooming-studio': { prefix: 'gs', color: '#8b4513' },
  'home-decor': { prefix: 'hd', color: '#d2b48c' },
  'jewel-luxe': { prefix: 'jl', color: '#d4af37' },
  'kids-wonder': { prefix: 'kw', color: '#ff69b4' },
  'minimal-fashion': { prefix: 'mf', color: '#000000' },
  'organic-beauty': { prefix: 'ob', color: '#8fbc8f' },
  'pets-joy': { prefix: 'pj', color: '#ffa500' },
  'tech-gadgets': { prefix: 'tg', color: '#00ffff' },
};

function getHeaderContent(p, c) {
  return `<style>
  :root {
    --${p}-font-sans: 'Inter', sans-serif;
    --${p}-transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }
  
  /* Announcement Bar */
  .${p}-announcement {
    background: ${c};
    color: #fff;
    padding: 10px 0;
    overflow: hidden;
    position: relative;
    z-index: 1000;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    font-weight: 600;
  }
  .${p}-announcement__track {
    display: flex;
    white-space: nowrap;
    animation: ${p}-marquee 20s linear infinite;
  }
  .${p}-announcement__item {
    padding: 0 40px;
  }
  @keyframes ${p}-marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  /* Header */
  .${p}-header-wrapper {
    position: sticky;
    top: 0;
    z-index: 900;
  }
  .${p}-header {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(0,0,0,0.05);
    transition: var(--${p}-transition);
  }
  .${p}-header.dark-mode {
    background: rgba(10, 10, 10, 0.85);
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .${p}-header.${p}-scrolled {
    padding: 5px 0;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  }
  .${p}-header__container {
    max-width: 1440px;
    margin: 0 auto;
    padding: 20px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: var(--${p}-transition);
  }
  .${p}-header.${p}-scrolled .${p}-header__container {
    padding: 10px 40px;
  }
  
  /* Navigation & Mega Menu */
  .${p}-nav {
    display: flex;
    gap: 35px;
  }
  .${p}-nav-item {
    position: relative;
  }
  .${p}-nav-link {
    text-decoration: none;
    color: inherit;
    font-size: 13px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    font-weight: 500;
    padding-bottom: 5px;
    position: relative;
  }
  .${p}-nav-link::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0;
    width: 0; height: 2px;
    background: ${c};
    transition: var(--${p}-transition);
  }
  .${p}-nav-link:hover::after {
    width: 100%;
  }
  
  .${p}-mega-menu {
    position: absolute;
    top: 100%;
    left: -50px;
    width: 600px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    padding: 30px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    opacity: 0;
    visibility: hidden;
    transform: translateY(10px);
    transition: var(--${p}-transition);
    pointer-events: none;
  }
  .${p}-header.dark-mode .${p}-mega-menu {
    background: #111;
    box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    border: 1px solid #222;
  }
  .${p}-nav-item:hover .${p}-mega-menu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
    pointer-events: auto;
  }

  /* Logo */
  .${p}-logo {
    font-size: 24px;
    font-weight: 800;
    text-decoration: none;
    color: inherit;
    letter-spacing: 2px;
  }
  
  /* Icons */
  .${p}-icons {
    display: flex;
    gap: 20px;
    align-items: center;
  }
  .${p}-icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: inherit;
    transition: transform 0.3s;
    position: relative;
  }
  .${p}-icon-btn:hover {
    transform: scale(1.1);
    color: ${c};
  }
  .${p}-cart-count {
    position: absolute;
    top: -8px; right: -10px;
    background: ${c};
    color: #fff;
    font-size: 10px;
    width: 18px; height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
  }

  @media (max-width: 768px) {
    .${p}-nav { display: none; }
    .${p}-header__container { padding: 15px 20px; }
  }
</style>

<div class="${p}-header-wrapper">
  <div class="${p}-announcement">
    <div class="${p}-announcement__track">
      <div class="${p}-announcement__item">✨ Premium Design. Exceptional Quality. Free Shipping Worldwide. ✨</div>
      <div class="${p}-announcement__item">✨ Premium Design. Exceptional Quality. Free Shipping Worldwide. ✨</div>
      <div class="${p}-announcement__item">✨ Premium Design. Exceptional Quality. Free Shipping Worldwide. ✨</div>
    </div>
  </div>

  <header class="${p}-header {% if section.settings.dark_mode %}dark-mode{% endif %}" id="${p}-header">
    <div class="${p}-header__container">
      
      <div class="${p}-mobile-menu-btn" style="display:none;">
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </div>

      <nav class="${p}-nav">
        {% for link in linklists.main-menu.links %}
          <div class="${p}-nav-item">
            <a href="{{ link.url }}" class="${p}-nav-link">{{ link.title }}</a>
            {% if link.links.size > 0 %}
              <div class="${p}-mega-menu">
                {% for child_link in link.links %}
                  <div>
                    <a href="{{ child_link.url }}" style="font-weight: 600; text-decoration: none; color: inherit; display: block; margin-bottom: 10px;">{{ child_link.title }}</a>
                  </div>
                {% endfor %}
              </div>
            {% endif %}
          </div>
        {% endfor %}
      </nav>
      
      <a href="/" class="${p}-logo">{{ section.settings.logo_text | default: "BRAND" }}</a>
      
      <div class="${p}-icons">
        <button class="${p}-icon-btn" aria-label="Search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </button>
        <button class="${p}-icon-btn" aria-label="Account">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </button>
        <button class="${p}-icon-btn" onclick="document.getElementById('${p}-cart-drawer').classList.add('active'); document.getElementById('${p}-cart-overlay').classList.add('active');">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          <span class="${p}-cart-count">{{ cart.item_count | default: 0 }}</span>
        </button>
      </div>
    </div>
  </header>
</div>

<script>
  window.addEventListener('scroll', () => {
    const header = document.getElementById('${p}-header');
    if (window.scrollY > 50) {
      header.classList.add('${p}-scrolled');
    } else {
      header.classList.remove('${p}-scrolled');
    }
  });
</script>

{% schema %}
{
  "name": "Premium Header",
  "tag": "section",
  "settings": [
    { "type": "text", "id": "logo_text", "label": "Logo Text", "default": "BRAND" },
    { "type": "checkbox", "id": "dark_mode", "label": "Enable Dark Mode", "default": false }
  ]
}
{% endschema %}
`;
}

function getFooterContent(p, c) {
  return `<style>
  .${p}-footer {
    background: var(--${p}-color-bg, #0a0a0a);
    color: var(--${p}-color-text, #fff);
    padding: 80px 40px 40px;
    border-top: 1px solid rgba(255,255,255,0.05);
    font-family: var(--${p}-font-sans, sans-serif);
  }
  .${p}-footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 40px;
    max-width: 1440px;
    margin: 0 auto;
  }
  .${p}-footer-brand {
    font-size: 24px;
    font-weight: 800;
    letter-spacing: 2px;
    margin-bottom: 20px;
  }
  .${p}-footer-title {
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 20px;
    color: ${c};
  }
  .${p}-footer-link {
    display: block;
    color: inherit;
    text-decoration: none;
    margin-bottom: 12px;
    opacity: 0.7;
    transition: all 0.3s;
    font-size: 14px;
  }
  .${p}-footer-link:hover {
    opacity: 1;
    transform: translateX(5px);
    color: ${c};
  }
  .${p}-newsletter-form {
    display: flex;
    margin-top: 20px;
  }
  .${p}-newsletter-input {
    flex: 1;
    padding: 12px 16px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    color: inherit;
    border-radius: 4px 0 0 4px;
  }
  .${p}-newsletter-btn {
    padding: 12px 24px;
    background: ${c};
    color: #000;
    border: none;
    font-weight: 700;
    cursor: pointer;
    border-radius: 0 4px 4px 0;
    transition: opacity 0.3s;
  }
  .${p}-newsletter-btn:hover {
    opacity: 0.9;
  }
  .${p}-footer-bottom {
    max-width: 1440px;
    margin: 60px auto 0;
    padding-top: 20px;
    border-top: 1px solid rgba(255,255,255,0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    opacity: 0.5;
  }
  .${p}-payment-icons {
    display: flex;
    gap: 10px;
  }
  @media (max-width: 900px) {
    .${p}-footer-grid { grid-template-columns: 1fr; }
    .${p}-footer-bottom { flex-direction: column; gap: 20px; text-align: center; }
  }
</style>

<footer class="${p}-footer">
  <div class="${p}-footer-grid">
    <div>
      <div class="${p}-footer-brand">{{ section.settings.logo_text | default: 'BRAND' }}</div>
      <p style="opacity: 0.7; font-size: 14px; max-width: 300px;">{{ section.settings.about_text | default: 'Crafting premium experiences through innovative design and exceptional quality.' }}</p>
      
      <form class="${p}-newsletter-form">
        <input type="email" class="${p}-newsletter-input" placeholder="Join our newsletter">
        <button type="submit" class="${p}-newsletter-btn">→</button>
      </form>
    </div>
    
    <div>
      <h4 class="${p}-footer-title">Shop</h4>
      {% for link in linklists.footer.links %}
        <a href="{{ link.url }}" class="${p}-footer-link">{{ link.title }}</a>
      {% endfor %}
      <a href="#" class="${p}-footer-link">New Arrivals</a>
      <a href="#" class="${p}-footer-link">Best Sellers</a>
      <a href="#" class="${p}-footer-link">Collections</a>
    </div>

    <div>
      <h4 class="${p}-footer-title">Support</h4>
      <a href="#" class="${p}-footer-link">Contact Us</a>
      <a href="#" class="${p}-footer-link">FAQ</a>
      <a href="#" class="${p}-footer-link">Shipping & Returns</a>
      <a href="#" class="${p}-footer-link">Track Order</a>
    </div>

    <div>
      <h4 class="${p}-footer-title">Social</h4>
      <a href="#" class="${p}-footer-link">Instagram</a>
      <a href="#" class="${p}-footer-link">TikTok</a>
      <a href="#" class="${p}-footer-link">Twitter</a>
    </div>
  </div>
  
  <div class="${p}-footer-bottom">
    <div>&copy; {{ 'now' | date: '%Y' }} {{ section.settings.logo_text | default: 'BRAND' }}. All rights reserved.</div>
    <div class="${p}-payment-icons">
      <!-- Visa SVG -->
      <svg width="32" height="20" viewBox="0 0 32 20" fill="currentColor"><path d="M10.5 4.5l-2.5 11h-3l1.5-11h4zm8.5 0c-1 0-2 .5-2 1.5s1.5 1.5 1.5 2.5-1 1.5-2 1.5-1.5-.5-1.5-.5l-.5 2.5c.5.5 1.5.5 2.5.5 2 0 3.5-1 3.5-3 0-1.5-1.5-2-1.5-2.5s1-1 2-1h1.5l-1-2.5c-.5-.5-1.5-.5-2.5-.5zm6.5 0l-2 7.5-1-7.5h-3l2.5 11h3l3.5-11h-3z"/></svg>
      <!-- Mastercard SVG -->
      <svg width="32" height="20" viewBox="0 0 32 20" fill="currentColor"><circle cx="10" cy="10" r="6"/><circle cx="20" cy="10" r="6"/></svg>
    </div>
  </div>
</footer>

{% schema %}
{
  "name": "Premium Footer",
  "tag": "section",
  "settings": [
    { "type": "text", "id": "logo_text", "label": "Logo Text", "default": "BRAND" },
    { "type": "textarea", "id": "about_text", "label": "About Text" }
  ]
}
{% endschema %}
`;
}

function enhance() {
  for (const [dir, config] of Object.entries(templates)) {
    const sectionsDir = path.join(templatesDir, dir, 'sections');
    
    if (!fs.existsSync(sectionsDir)) {
      console.log('Skipping ' + dir + ', sections not found');
      continue;
    }
    
    const headerPath = path.join(sectionsDir, config.prefix + '-header.liquid');
    const footerPath = path.join(sectionsDir, config.prefix + '-footer.liquid');
    
    fs.writeFileSync(headerPath, getHeaderContent(config.prefix, config.color));
    console.log('Enhanced ' + headerPath);
    
    fs.writeFileSync(footerPath, getFooterContent(config.prefix, config.color));
    console.log('Enhanced ' + footerPath);
  }
}

enhance();

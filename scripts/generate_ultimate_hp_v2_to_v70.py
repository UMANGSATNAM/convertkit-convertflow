import json
import os
import random

SECTIONS_DIR = r"i:\converflow app\dev-theme-peri\sections"
TEMPLATES_DIR = r"i:\converflow app\dev-theme-peri\templates"

os.makedirs(SECTIONS_DIR, exist_ok=True)
os.makedirs(TEMPLATES_DIR, exist_ok=True)

# 69 Brand configs (V2 to V70)
brands = []
base_colors = [
    ("#111111", "#F4F4F5", "#E11D48"), ("#2F3E30", "#F4F1EA", "#D97706"), 
    ("#FF0055", "#0D0D12", "#00F0FF"), ("#4A5568", "#F7FAFC", "#3182CE"),
    ("#78350F", "#FEF3C7", "#D97706"), ("#166534", "#F0FDF4", "#22C55E"),
    ("#000000", "#FFE600", "#000000"), ("#1E1B4B", "#EEF2FF", "#4F46E5"),
    ("#2D3748", "#EDF2F7", "#E2E8F0"), ("#451A03", "#FEF3C7", "#B45309"),
    ("#1C1917", "#E7E5E4", "#A8A29E"), ("#F472B6", "#FDF2F8", "#EC4899"),
    ("#C86D51", "#FFF7ED", "#EA580C"), ("#06B6D4", "#ECFEFF", "#0EA5E9"),
    ("#78350F", "#FFFBEB", "#F59E0B"), ("#8B5CF6", "#F5F3FF", "#A855F7"),
    ("#0284C7", "#F0F9FF", "#38BDF8"), ("#991B1B", "#FEF2F2", "#EF4444"),
    ("#15803D", "#F0FDF4", "#4ADE80"), ("#0F172A", "#F8FAFC", "#64748B"),
    ("#0D9488", "#CCFBF1", "#14B8A6"), ("#B91C1C", "#FEF2F2", "#DC2626"),
    ("#475569", "#F8FAFC", "#94A3B8"), ("#0284C7", "#E0F2FE", "#38BDF8"),
    ("#78350F", "#FEF3C7", "#F59E0B"), ("#F472B6", "#FFF1F2", "#FB7185"),
    ("#334155", "#F8FAFC", "#94A3B8"), ("#EC4899", "#FDF2F8", "#F472B6")
]

for i in range(2, 71):
    c = base_colors[i % len(base_colors)]
    hero_align = random.choice(["left", "center", "split", "split-reverse"])
    card_style = random.choice(["glass", "flat", "outlined", "soft-shadow", "brutalist", "neumorphic"])
    radius = random.choice(["0px", "4px", "8px", "16px", "24px", "999px"])
    brands.append({
        "id": i,
        "name": f"Premium Niche {i}",
        "primary": c[0],
        "bg": c[1],
        "accent": c[2],
        "hero_align": hero_align,
        "card_style": card_style,
        "radius": radius
    })

def generate_css(b, p):
    css = f"""
<style>
  .{p} {{
    background-color: {{{{ section.settings.bg_color | default: '{b['bg']}' }}}};
    color: {{{{ section.settings.text_color | default: '{b['primary']}' }}}};
    font-family: var(--font-body, system-ui, sans-serif);
    overflow-x: hidden;
    line-height: 1.6;
  }}
  .{p}__wrap {{
    max-width: var(--page-width, 1280px);
    margin: 0 auto;
    padding: 0 24px;
  }}
  .{p}__sec {{
    padding: {{{{ section.settings.section_padding | default: 80 }}}}px 0;
  }}
  @media (max-width: 768px) {{ .{p}__sec {{ padding: 48px 0; }} }}
  
  .{p}__btn {{
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 16px 36px;
    background: {{{{ section.settings.accent_color | default: '{b['accent']}' }}}};
    color: #FFFFFF;
    border-radius: {b['radius']};
    font-weight: 700;
    font-size: 15px;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(0,0,0,0.1);
  }}
  .{p}__btn:hover {{ transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); opacity: 0.95; }}
  .{p}__btn--secondary {{
    background: transparent;
    color: {b['primary']};
    border: 2px solid {b['primary']};
    box-shadow: none;
  }}
  
  .{p}__title {{ font-size: clamp(32px, 5vw, 48px); font-weight: 800; line-height: 1.1; margin: 0 0 16px; letter-spacing: -0.02em; }}
  .{p}__subtitle {{ font-size: 18px; opacity: 0.8; margin: 0 0 32px; max-width: 600px; }}
  
  .{p}__card {{
    border-radius: {b['radius']};
    overflow: hidden;
    position: relative;
    transition: transform 0.3s ease;
    """
    
    if b['card_style'] == "glass":
        css += "background: rgba(255, 255, 255, 0.6); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.4); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);"
    elif b['card_style'] == "flat":
        css += f"background: #FFFFFF; border: none; box-shadow: none;"
    elif b['card_style'] == "outlined":
        css += f"background: {b['bg']}; border: 1.5px solid rgba(0,0,0,0.1);"
    elif b['card_style'] == "soft-shadow":
        css += "background: #FFFFFF; box-shadow: 0 12px 40px rgba(0, 0, 0, 0.06); border: none;"
    elif b['card_style'] == "brutalist":
        css += f"background: #FFFFFF; border: 3px solid {b['primary']}; box-shadow: 6px 6px 0 {b['primary']}; border-radius: 0;"
    elif b['card_style'] == "neumorphic":
        css += f"background: {b['bg']}; border: none; box-shadow: 8px 8px 16px rgba(0,0,0,0.05), -8px -8px 16px rgba(255,255,255,0.8);"
        
    css += f"""
  }}
  .{p}__card:hover {{ transform: translateY(-4px); }}
  
  /* Grid System */
  .{p}__grid-2 {{ display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px; }}
  .{p}__grid-3 {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }}
  .{p}__grid-4 {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }}
  .{p}__grid-5 {{ display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; }}
  .{p}__grid-6 {{ display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; }}
  
  @media (max-width: 1024px) {{ .{p}__grid-4, .{p}__grid-5, .{p}__grid-6 {{ grid-template-columns: repeat(3, 1fr); }} }}
  @media (max-width: 768px) {{ .{p}__grid-3, .{p}__grid-4 {{ grid-template-columns: repeat(2, 1fr); }} .{p}__grid-2 {{ grid-template-columns: 1fr; }} }}
  @media (max-width: 480px) {{ .{p}__grid-3, .{p}__grid-4, .{p}__grid-2, .{p}__grid-5, .{p}__grid-6 {{ grid-template-columns: 1fr; }} }}

  /* Animation Utilities */
  .{p}__marquee-wrapper {{ background: {b['accent']}; color: #FFF; padding: 16px 0; overflow: hidden; white-space: nowrap; display: flex; }}
  .{p}__marquee-content {{ display: inline-flex; animation: marquee-scroll 25s linear infinite; font-weight: 800; font-size: 14px; letter-spacing: 0.1em; text-transform: uppercase; }}
  .{p}__marquee-content.large {{ font-size: 64px; opacity: 0.1; color: {b['primary']}; animation-duration: 40s; letter-spacing: 0; }}
  @keyframes marquee-scroll {{ 0% {{ transform: translateX(0); }} 100% {{ transform: translateX(-50%); }} }}
  
  .{p}__pulse-badge {{ background: {b['accent']}; color: #FFF; padding: 4px 12px; border-radius: 99px; font-size: 11px; font-weight: 800; animation: pulse 2s infinite; }}
  @keyframes pulse {{ 0% {{ opacity: 1; }} 50% {{ opacity: 0.6; }} 100% {{ opacity: 1; }} }}
</style>
"""
    return css

def generate_html(b, p):
    # Dynamic Section Generation (1 to 30)
    sections_html = ""
    
    # 1. HERO BANNER
    hero_layout = ""
    if b['hero_align'] == 'split':
        hero_layout = f"""<div class="{p}__grid-2" style="align-items: center;">
            <div>
              <div class="{p}__pulse-badge" style="display:inline-block; margin-bottom: 20px;">NEW COLLECTION</div>
              <h1 class="{p}__title">{{{{ section.settings.mod_1_title | default: 'Redefining the Standard.' }}}}</h1>
              <p class="{p}__subtitle">{{{{ section.settings.mod_1_sub | default: 'Experience the perfect blend of aesthetic design and functional performance.' }}}}</p>
              <div style="display: flex; gap: 16px; flex-wrap: wrap;">
                <a href="#" class="{p}__btn">Shop Collection</a>
                <a href="#" class="{p}__btn {p}__btn--secondary">Learn More</a>
              </div>
            </div>
            <div style="border-radius: {b['radius']}; overflow: hidden; aspect-ratio: 4/5; background: #E5E7EB;">{{{{ 'image' | placeholder_svg_tag: 'placeholder-svg' }}}}</div>
          </div>"""
    elif b['hero_align'] == 'split-reverse':
        hero_layout = f"""<div class="{p}__grid-2" style="align-items: center;">
            <div style="border-radius: {b['radius']}; overflow: hidden; aspect-ratio: 4/5; background: #E5E7EB;">{{{{ 'image' | placeholder_svg_tag: 'placeholder-svg' }}}}</div>
            <div style="padding-left: 40px;">
              <h1 class="{p}__title">{{{{ section.settings.mod_1_title | default: 'Redefining the Standard.' }}}}</h1>
              <p class="{p}__subtitle">{{{{ section.settings.mod_1_sub | default: 'Experience the perfect blend of aesthetic design and functional performance.' }}}}</p>
              <a href="#" class="{p}__btn">Shop Collection</a>
            </div>
          </div>"""
    elif b['hero_align'] == 'center':
        hero_layout = f"""<div style="text-align: center; max-width: 800px; margin: 0 auto;">
            <h1 class="{p}__title" style="font-size: clamp(40px, 6vw, 72px);">{{{{ section.settings.mod_1_title | default: 'Redefining the Standard.' }}}}</h1>
            <p class="{p}__subtitle" style="margin: 0 auto 32px auto;">{{{{ section.settings.mod_1_sub | default: 'Experience the perfect blend of aesthetic design and functional performance.' }}}}</p>
            <a href="#" class="{p}__btn">Explore Now</a>
            <div style="margin-top: 48px; border-radius: {b['radius']}; overflow: hidden; aspect-ratio: 16/9; background: #E5E7EB;">{{{{ 'lifestyle-1' | placeholder_svg_tag: 'placeholder-svg' }}}}</div>
          </div>"""
    else: # Overlay
        hero_layout = f"""<div style="position: relative; border-radius: {b['radius']}; overflow: hidden; padding: 120px 40px; text-align: center; color: #FFF; background: #111;">
            <div style="position: absolute; inset: 0; opacity: 0.6;">{{{{ 'lifestyle-2' | placeholder_svg_tag: 'placeholder-svg' }}}}</div>
            <div style="position: relative; z-index: 2; max-width: 600px; margin: 0 auto;">
              <h1 class="{p}__title" style="color:#FFF;">{{{{ section.settings.mod_1_title | default: 'Redefining the Standard.' }}}}</h1>
              <p class="{p}__subtitle" style="margin: 0 auto 32px auto; color:rgba(255,255,255,0.9);">{{{{ section.settings.mod_1_sub | default: 'Experience the perfect blend of aesthetic design and functional performance.' }}}}</p>
              <a href="#" class="{p}__btn" style="background: #FFF; color: #111;">Discover</a>
            </div>
          </div>"""

    sections_html += f"""
  <!-- 1. Hero Banner -->
  <div class="{p}__wrap {p}__sec">{hero_layout}</div>"""

    # 2. USP Trust Bar
    sections_html += f"""
  <!-- 2. USP Trust Bar -->
  <div class="{p}__wrap" style="padding-bottom: 60px;">
    <div class="{p}__grid-4">
      <div class="{p}__card" style="padding: 24px; display: flex; align-items: center; gap: 16px;">
        <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: center; font-size: 24px;">🚚</div>
        <div><h4 style="margin:0; font-weight:800;">Free Shipping</h4><p style="margin:0; font-size:12px; opacity:0.7;">On orders over $50</p></div>
      </div>
      <div class="{p}__card" style="padding: 24px; display: flex; align-items: center; gap: 16px;">
        <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: center; font-size: 24px;">🔄</div>
        <div><h4 style="margin:0; font-weight:800;">Easy Returns</h4><p style="margin:0; font-size:12px; opacity:0.7;">30-day return policy</p></div>
      </div>
      <div class="{p}__card" style="padding: 24px; display: flex; align-items: center; gap: 16px;">
        <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: center; font-size: 24px;">⭐</div>
        <div><h4 style="margin:0; font-weight:800;">Top Rated</h4><p style="margin:0; font-size:12px; opacity:0.7;">Over 10k reviews</p></div>
      </div>
      <div class="{p}__card" style="padding: 24px; display: flex; align-items: center; gap: 16px;">
        <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: center; font-size: 24px;">🛡️</div>
        <div><h4 style="margin:0; font-weight:800;">Secure Checkout</h4><p style="margin:0; font-size:12px; opacity:0.7;">100% safe & secure</p></div>
      </div>
    </div>
  </div>"""

    # 3. Category Showcase Grid
    sections_html += f"""
  <!-- 3. Category Showcase Grid -->
  <div class="{p}__wrap {p}__sec">
    <div style="text-align: center; margin-bottom: 40px;">
      <h2 class="{p}__title">{{{{ section.settings.mod_3_title | default: 'Shop by Category' }}}}</h2>
    </div>
    <div class="{p}__grid-3">
      <div class="{p}__card" style="height: 350px; position: relative;">
        <div style="position: absolute; inset:0; background: #E5E7EB;">{{{{ 'collection-1' | placeholder_svg_tag: 'placeholder-svg' }}}}</div>
        <div style="position: absolute; inset:0; background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);"></div>
        <div style="position: absolute; bottom: 24px; left: 24px; color: #FFF;">
          <h3 style="margin:0; font-size: 24px;">Apparel</h3>
          <p style="margin: 4px 0 0; opacity: 0.8;">Explore 120+ Items</p>
        </div>
      </div>
      <div class="{p}__card" style="height: 350px; position: relative;">
        <div style="position: absolute; inset:0; background: #D1D5DB;">{{{{ 'collection-2' | placeholder_svg_tag: 'placeholder-svg' }}}}</div>
        <div style="position: absolute; inset:0; background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);"></div>
        <div style="position: absolute; bottom: 24px; left: 24px; color: #FFF;">
          <h3 style="margin:0; font-size: 24px;">Accessories</h3>
          <p style="margin: 4px 0 0; opacity: 0.8;">Explore 85+ Items</p>
        </div>
      </div>
      <div class="{p}__card" style="height: 350px; position: relative;">
        <div style="position: absolute; inset:0; background: #9CA3AF;">{{{{ 'collection-3' | placeholder_svg_tag: 'placeholder-svg' }}}}</div>
        <div style="position: absolute; inset:0; background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);"></div>
        <div style="position: absolute; bottom: 24px; left: 24px; color: #FFF;">
          <h3 style="margin:0; font-size: 24px;">Footwear</h3>
          <p style="margin: 4px 0 0; opacity: 0.8;">Explore 40+ Items</p>
        </div>
      </div>
    </div>
  </div>"""

    # 4. Featured Collection
    sections_html += f"""
  <!-- 4. Featured Collection -->
  <div class="{p}__wrap {p}__sec">
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; flex-wrap: wrap; gap: 16px;">
      <div><h2 class="{p}__title" style="margin:0;">{{{{ section.settings.mod_4_title | default: 'Trending Now' }}}}</h2></div>
      <a href="#" style="font-weight: bold; color: {b['accent']};">View All &rarr;</a>
    </div>
    <div class="{p}__grid-4">
      {{% for i in (1..4) %}}
      <div class="{p}__card" style="padding: 16px; display: flex; flex-direction: column;">
        <div style="aspect-ratio: 1; background: #F3F4F6; border-radius: {b['radius']}; margin-bottom: 16px; position: relative;">
           <span style="position:absolute; top:10px; left:10px; background:#FFF; color:#000; padding:2px 8px; font-size:11px; font-weight:bold; border-radius:4px;">BESTSELLER</span>
        </div>
        <h4 style="margin: 0 0 4px; font-size: 16px;">Premium Product {{i}}</h4>
        <div style="display: flex; gap: 4px; color: #FBBF24; font-size: 12px; margin-bottom: 8px;">★★★★★</div>
        <p style="margin: 0 0 16px; font-weight: 800; font-size: 18px;">$99.00</p>
        <button class="{p}__btn" style="width: 100%; padding: 10px; margin-top: auto;">Add to Cart</button>
      </div>
      {{% endfor %}}
    </div>
  </div>"""

    # 5. Bestsellers Carousel (Approximated with horizontal scroll)
    sections_html += f"""
  <!-- 5. Bestsellers Horizontal -->
  <div class="{p}__sec" style="background: rgba(0,0,0,0.03);">
    <div class="{p}__wrap">
      <h2 class="{p}__title" style="text-align:center; margin-bottom:40px;">{{{{ section.settings.mod_5_title | default: 'Our Classics' }}}}</h2>
      <div style="display: flex; overflow-x: auto; gap: 24px; padding-bottom: 24px; snap-type: x mandatory;">
        {{% for i in (1..6) %}}
        <div class="{p}__card" style="min-width: 280px; padding: 24px; scroll-snap-align: start;">
          <div style="aspect-ratio: 1; background: #E5E7EB; border-radius: {b['radius']}; margin-bottom: 16px;"></div>
          <h4 style="margin:0 0 8px;">Classic Item {{i}}</h4>
          <p style="font-weight: bold; margin:0;">$129.00</p>
        </div>
        {{% endfor %}}
      </div>
    </div>
  </div>"""

    # 6. Brand Story
    sections_html += f"""
  <!-- 6. Brand Story -->
  <div class="{p}__wrap {p}__sec">
    <div class="{p}__grid-2" style="align-items: center;">
      <div style="aspect-ratio: 1; background: #E5E7EB; border-radius: {b['radius']};"></div>
      <div style="padding: 0 40px;">
        <div style="font-weight: 800; color: {b['accent']}; margin-bottom: 12px; letter-spacing: 2px;">OUR STORY</div>
        <h2 class="{p}__title">{{{{ section.settings.mod_6_title | default: 'Crafted with Purpose.' }}}}</h2>
        <p class="{p}__subtitle">We started with a simple mission: to create products that don't compromise on quality, aesthetics, or sustainability. Every detail is meticulously thought out.</p>
        <ul style="list-style: none; padding: 0; margin: 0 0 32px;">
          <li style="margin-bottom: 12px; display: flex; gap: 12px;"><span>✓</span> Ethically Sourced</li>
          <li style="margin-bottom: 12px; display: flex; gap: 12px;"><span>✓</span> Carbon Neutral</li>
          <li style="margin-bottom: 12px; display: flex; gap: 12px;"><span>✓</span> Built to Last</li>
        </ul>
        <a href="#" class="{p}__btn {p}__btn--secondary">Read the Manifesto</a>
      </div>
    </div>
  </div>"""

    # 7. Us vs Them
    sections_html += f"""
  <!-- 7. Us vs Them -->
  <div class="{p}__wrap {p}__sec">
    <h2 class="{p}__title" style="text-align: center; margin-bottom: 48px;">{{{{ section.settings.mod_7_title | default: 'Why Choose Us?' }}}}</h2>
    <div class="{p}__card" style="padding: 40px;">
      <table style="width: 100%; border-collapse: collapse; text-align: left;">
        <thead>
          <tr style="border-bottom: 2px solid rgba(0,0,0,0.1);">
            <th style="padding: 20px; font-size: 18px;">Feature</th>
            <th style="padding: 20px; font-size: 18px; color: {b['accent']}; background: rgba(0,0,0,0.02);">{b['name']}</th>
            <th style="padding: 20px; font-size: 18px; opacity: 0.5;">Others</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid rgba(0,0,0,0.05);">
            <td style="padding: 20px;">Premium Materials</td>
            <td style="padding: 20px; font-weight: bold; background: rgba(0,0,0,0.02);">Yes, 100%</td>
            <td style="padding: 20px; opacity: 0.5;">Sometimes</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(0,0,0,0.05);">
            <td style="padding: 20px;">Lifetime Warranty</td>
            <td style="padding: 20px; font-weight: bold; background: rgba(0,0,0,0.02);">Included</td>
            <td style="padding: 20px; opacity: 0.5;">Extra Cost</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(0,0,0,0.05);">
            <td style="padding: 20px;">Customer Support</td>
            <td style="padding: 20px; font-weight: bold; background: rgba(0,0,0,0.02);">24/7 Human</td>
            <td style="padding: 20px; opacity: 0.5;">Bots Only</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>"""

    # 8. Marquee Ticker
    sections_html += f"""
  <!-- 8. Marquee Ticker -->
  <div class="{p}__marquee-wrapper">
    <div class="{p}__marquee-content">
      <span>{{{{ section.settings.mod_8_title | default: 'FREE WORLDWIDE SHIPPING OVER $100' }}}} &nbsp;&nbsp;★&nbsp;&nbsp; {{{{ section.settings.mod_8_title | default: 'FREE WORLDWIDE SHIPPING OVER $100' }}}} &nbsp;&nbsp;★&nbsp;&nbsp; {{{{ section.settings.mod_8_title | default: 'FREE WORLDWIDE SHIPPING OVER $100' }}}} &nbsp;&nbsp;★&nbsp;&nbsp; </span>
    </div>
  </div>"""

    # 9. UGC Shoppable Reels
    sections_html += f"""
  <!-- 9. UGC Shoppable Reels -->
  <div class="{p}__wrap {p}__sec">
    <h2 class="{p}__title" style="margin-bottom: 32px;">{{{{ section.settings.mod_9_title | default: 'Spotted in the Wild' }}}}</h2>
    <div class="{p}__grid-4">
      {{% for i in (1..4) %}}
      <div class="{p}__card" style="aspect-ratio: 9/16; background: #111; color: #FFF; display: flex; align-items: flex-end; padding: 20px; position: relative;">
        <div style="position: absolute; top: 16px; right: 16px; width: 32px; height: 32px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center;">▶</div>
        <div>
          <p style="margin: 0 0 8px; font-size: 14px; font-weight: 700;">@customer_style</p>
          <p style="margin: 0; font-size: 12px; opacity: 0.8;">"Literally obsessed with this quality."</p>
        </div>
      </div>
      {{% endfor %}}
    </div>
  </div>"""

    # 10. Customer Reviews
    sections_html += f"""
  <!-- 10. Customer Reviews -->
  <div class="{p}__sec" style="background: {b['primary']}; color: {b['bg']};">
    <div class="{p}__wrap">
      <h2 class="{p}__title" style="text-align: center; margin-bottom: 48px; color: {b['bg']};">{{{{ section.settings.mod_10_title | default: 'Thousands of Happy Customers' }}}}</h2>
      <div class="{p}__grid-3">
        {{% for i in (1..3) %}}
        <div class="{p}__card" style="padding: 32px; background: rgba(255,255,255,0.05); color: {b['bg']}; border: 1px solid rgba(255,255,255,0.1);">
          <div style="color: #FBBF24; margin-bottom: 16px; font-size: 20px;">★★★★★</div>
          <h4 style="margin: 0 0 12px; font-size: 18px;">Exceeded Expectations</h4>
          <p style="margin: 0 0 24px; opacity: 0.8; line-height: 1.6;">"I was skeptical at first, but the quality is unmatched. I've bought three more since my first purchase."</p>
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.2);"></div>
            <div><p style="margin: 0; font-weight: 700; font-size: 14px;">Sarah J.</p><p style="margin: 0; font-size: 12px; opacity: 0.6;">Verified Buyer</p></div>
          </div>
        </div>
        {{% endfor %}}
      </div>
    </div>
  </div>"""

    # 11-30 Remaining Modules
    sections_html += f"""
  <!-- 11. Press Media Logos -->
  <div class="{p}__wrap {p}__sec">
    <p style="text-align: center; font-weight: 700; opacity: 0.5; margin-bottom: 32px; letter-spacing: 2px;">AS FEATURED IN</p>
    <div class="{p}__grid-5" style="align-items: center; opacity: 0.4; filter: grayscale(100%);">
      <h2 style="text-align:center; margin:0;">VOGUE</h2>
      <h2 style="text-align:center; margin:0;">GQ</h2>
      <h2 style="text-align:center; margin:0;">WIRED</h2>
      <h2 style="text-align:center; margin:0;">FORBES</h2>
      <h2 style="text-align:center; margin:0;">ELLE</h2>
    </div>
  </div>

  <!-- 12. Instagram Feed Grid -->
  <div class="{p}__wrap {p}__sec">
    <h2 class="{p}__title" style="text-align: center; margin-bottom: 32px;">Follow @{b['name']}</h2>
    <div class="{p}__grid-6">
      {{% for i in (1..6) %}}
      <div style="aspect-ratio: 1; background: #E5E7EB; border-radius: {b['radius']};"></div>
      {{% endfor %}}
    </div>
  </div>

  <!-- 13. FAQ Accordion -->
  <div class="{p}__wrap {p}__sec">
    <h2 class="{p}__title" style="text-align: center; margin-bottom: 40px;">Frequently Asked Questions</h2>
    <div style="max-width: 800px; margin: 0 auto;">
      {{% for i in (1..4) %}}
      <div class="{p}__card" style="padding: 24px; margin-bottom: 16px; cursor: pointer;">
        <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 16px;">
          <span>What is the shipping time for domestic orders?</span>
          <span>+</span>
        </div>
      </div>
      {{% endfor %}}
    </div>
  </div>

  <!-- 14. Newsletter Capture -->
  <div class="{p}__wrap {p}__sec">
    <div class="{p}__card" style="padding: 80px 40px; text-align: center; background: {b['accent']}; color: #FFF;">
      <h2 class="{p}__title" style="color: #FFF;">Unlock 15% Off</h2>
      <p style="font-size: 18px; margin-bottom: 32px; opacity: 0.9;">Join the inner circle for exclusive drops and early access.</p>
      <form style="display: flex; max-width: 500px; margin: 0 auto; gap: 8px;">
        <input type="email" placeholder="Enter your email" style="flex-grow: 1; padding: 16px; border-radius: {b['radius']}; border: none; font-size: 16px;">
        <button type="button" style="padding: 16px 32px; border-radius: {b['radius']}; border: none; background: #111; color: #FFF; font-weight: 800; font-size: 16px; cursor: pointer;">Subscribe</button>
      </form>
    </div>
  </div>

  <!-- 15. Founder Trust Letter -->
  <div class="{p}__wrap {p}__sec">
    <div class="{p}__card" style="padding: 48px; display: flex; gap: 40px; align-items: center; flex-wrap: wrap;">
      <div style="width: 150px; height: 150px; border-radius: 50%; background: #E5E7EB; flex-shrink: 0;"></div>
      <div style="flex-grow: 1; max-width: 600px;">
        <p style="font-size: 20px; font-style: italic; line-height: 1.6; margin: 0 0 24px;">"I started this brand because I was tired of compromises. We build things that last, with a deep respect for the craft."</p>
        <h4 style="margin: 0; font-weight: 800; font-size: 18px;">Jane Doe</h4>
        <p style="margin: 0; opacity: 0.6;">Founder & CEO</p>
      </div>
    </div>
  </div>

  <!-- 16. Countdown Timer -->
  <div class="{p}__sec" style="background: #111; color: #FFF; text-align: center;">
    <div class="{p}__wrap">
      <h2 style="font-size: 32px; font-weight: 800; margin: 0 0 16px;">Flash Sale Ends In:</h2>
      <div style="display: flex; justify-content: center; gap: 16px; font-size: 40px; font-weight: 800; font-variant-numeric: tabular-nums;">
        <div>12<span style="display:block; font-size:12px; opacity:0.5;">HOURS</span></div> : 
        <div>45<span style="display:block; font-size:12px; opacity:0.5;">MINS</span></div> : 
        <div>30<span style="display:block; font-size:12px; opacity:0.5;">SECS</span></div>
      </div>
    </div>
  </div>

  <!-- 17. Highlighted Feature Specs -->
  <div class="{p}__wrap {p}__sec">
    <h2 class="{p}__title" style="text-align: center; margin-bottom: 48px;">Engineered for Perfection</h2>
    <div class="{p}__grid-3">
      <div class="{p}__card" style="padding: 32px;"><h3 style="margin:0 0 16px;">Aerospace Grade</h3><p style="margin:0; opacity:0.8;">Built using materials sourced from the top suppliers globally.</p></div>
      <div class="{p}__card" style="padding: 32px;"><h3 style="margin:0 0 16px;">Water Resistant</h3><p style="margin:0; opacity:0.8;">Sealed to withstand the elements, whatever they may be.</p></div>
      <div class="{p}__card" style="padding: 32px;"><h3 style="margin:0 0 16px;">Smart Integration</h3><p style="margin:0; opacity:0.8;">Seamlessly connects with your existing ecosystem.</p></div>
    </div>
  </div>

  <!-- 18. Full Width Image Text -->
  <div class="{p}__sec" style="padding: 0;">
    <div style="position: relative; height: 500px; background: #E5E7EB; display: flex; align-items: center; justify-content: center; color: #FFF;">
      <div style="position: absolute; inset:0; background: rgba(0,0,0,0.4);"></div>
      <div style="position: relative; z-index: 2; text-align: center; padding: 24px;">
        <h2 style="font-size: 48px; font-weight: 800; margin: 0 0 16px;">The Summer Edit</h2>
        <a href="#" class="{p}__btn">Shop the Edit</a>
      </div>
    </div>
  </div>

  <!-- 19. Interactive Hotspot -->
  <div class="{p}__wrap {p}__sec">
    <div class="{p}__card" style="aspect-ratio: 21/9; background: #F3F4F6; position: relative;">
      <div style="position: absolute; top: 30%; left: 40%; width: 24px; height: 24px; background: {b['accent']}; border-radius: 50%; box-shadow: 0 0 0 4px rgba(255,255,255,0.5); cursor: pointer;"></div>
      <div style="position: absolute; top: 60%; left: 70%; width: 24px; height: 24px; background: {b['accent']}; border-radius: 50%; box-shadow: 0 0 0 4px rgba(255,255,255,0.5); cursor: pointer;"></div>
    </div>
  </div>

  <!-- 20. Bundle Offer -->
  <div class="{p}__wrap {p}__sec">
    <h2 class="{p}__title" style="text-align: center; margin-bottom: 48px;">Bundle & Save</h2>
    <div class="{p}__grid-3">
      <div class="{p}__card" style="padding: 32px; text-align: center;"><h3>Starter Kit</h3><h2 style="font-size:40px; margin:16px 0;">$49</h2><p>Save 10%</p><button class="{p}__btn" style="width:100%;">Add to Cart</button></div>
      <div class="{p}__card" style="padding: 32px; text-align: center; border: 2px solid {b['accent']};"><h3>Pro Kit</h3><h2 style="font-size:40px; margin:16px 0;">$89</h2><p>Save 20%</p><button class="{p}__btn" style="width:100%;">Add to Cart</button></div>
      <div class="{p}__card" style="padding: 32px; text-align: center;"><h3>Ultimate Kit</h3><h2 style="font-size:40px; margin:16px 0;">$149</h2><p>Save 30%</p><button class="{p}__btn" style="width:100%;">Add to Cart</button></div>
    </div>
  </div>

  <!-- 21. Blog Articles -->
  <div class="{p}__wrap {p}__sec">
    <h2 class="{p}__title" style="margin-bottom: 32px;">Journal</h2>
    <div class="{p}__grid-3">
      {{% for i in (1..3) %}}
      <div class="{p}__card">
        <div style="aspect-ratio: 16/9; background: #E5E7EB;"></div>
        <div style="padding: 24px;">
          <p style="font-size: 12px; opacity: 0.6; font-weight: 700; margin: 0 0 8px;">LIFESTYLE</p>
          <h3 style="margin: 0 0 16px; font-size: 20px;">The Art of Intentional Living</h3>
          <a href="#" style="font-weight: 700; color: {b['accent']}; text-decoration: none;">Read More &rarr;</a>
        </div>
      </div>
      {{% endfor %}}
    </div>
  </div>

  <!-- 22. Step-by-Step -->
  <div class="{p}__wrap {p}__sec">
    <h2 class="{p}__title" style="text-align: center; margin-bottom: 48px;">How It Works</h2>
    <div class="{p}__grid-3">
      <div style="text-align: center;"><div style="width:64px; height:64px; background:{b['accent']}; color:#FFF; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:24px; font-weight:bold; margin:0 auto 16px;">1</div><h3>Select</h3><p>Choose your style.</p></div>
      <div style="text-align: center;"><div style="width:64px; height:64px; background:{b['accent']}; color:#FFF; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:24px; font-weight:bold; margin:0 auto 16px;">2</div><h3>Customize</h3><p>Make it your own.</p></div>
      <div style="text-align: center;"><div style="width:64px; height:64px; background:{b['accent']}; color:#FFF; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:24px; font-weight:bold; margin:0 auto 16px;">3</div><h3>Enjoy</h3><p>Delivered to your door.</p></div>
    </div>
  </div>

  <!-- 23. Glossary -->
  <div class="{p}__wrap {p}__sec">
    <div class="{p}__card" style="padding: 48px;">
      <h2 class="{p}__title">Clean Ingredients Only</h2>
      <p style="margin-bottom: 32px; max-width: 600px;">We ban over 1,500 questionable ingredients from our formulations. Here are the heroes.</p>
      <div class="{p}__grid-4">
        <div><h4 style="margin:0 0 4px;">Vitamin C</h4><p style="font-size:14px; opacity:0.8;">Brightens and protects.</p></div>
        <div><h4 style="margin:0 0 4px;">Hyaluronic Acid</h4><p style="font-size:14px; opacity:0.8;">Deep hydration.</p></div>
        <div><h4 style="margin:0 0 4px;">Niacinamide</h4><p style="font-size:14px; opacity:0.8;">Refines pores.</p></div>
        <div><h4 style="margin:0 0 4px;">Peptides</h4><p style="font-size:14px; opacity:0.8;">Firms and plumps.</p></div>
      </div>
    </div>
  </div>

  <!-- 24. Autoplay Video -->
  <div class="{p}__sec" style="padding: 0;">
    <div style="height: 400px; background: #000; color: #FFF; display: flex; align-items: center; justify-content: center; position: relative;">
      <h2 style="position: relative; z-index: 2; font-size: 48px; font-weight: 800;">See It In Action</h2>
    </div>
  </div>

  <!-- 25. Jumbo Marquee -->
  <div class="{p}__marquee-wrapper" style="background: transparent; padding: 40px 0;">
    <div class="{p}__marquee-content large">
      <span>{b['name']} ★ EST. 2024 ★ PREMIUM QUALITY ★ {b['name']} ★ EST. 2024 ★ PREMIUM QUALITY ★ </span>
    </div>
  </div>

  <!-- 26. Timeline -->
  <div class="{p}__wrap {p}__sec">
    <h2 class="{p}__title" style="text-align: center; margin-bottom: 48px;">Our Heritage</h2>
    <div style="max-width: 600px; margin: 0 auto; border-left: 2px solid {b['accent']}; padding-left: 32px;">
      <div style="position:relative; margin-bottom: 32px;">
        <div style="position:absolute; left:-41px; top:0; width:16px; height:16px; background:{b['accent']}; border-radius:50%;"></div>
        <h3 style="margin:0 0 8px;">2020</h3><p style="margin:0;">The idea was born in a small studio.</p>
      </div>
      <div style="position:relative;">
        <div style="position:absolute; left:-41px; top:0; width:16px; height:16px; background:{b['accent']}; border-radius:50%;"></div>
        <h3 style="margin:0 0 8px;">2024</h3><p style="margin:0;">Global expansion and over 1M orders.</p>
      </div>
    </div>
  </div>

  <!-- 27. Social Proof Counters -->
  <div class="{p}__sec" style="background: {b['accent']}; color: #FFF;">
    <div class="{p}__wrap">
      <div class="{p}__grid-4" style="text-align: center;">
        <div><h2 style="font-size: 48px; margin: 0;">1M+</h2><p style="font-weight: 700; margin: 8px 0 0;">Happy Customers</p></div>
        <div><h2 style="font-size: 48px; margin: 0;">50+</h2><p style="font-weight: 700; margin: 8px 0 0;">Awards Won</p></div>
        <div><h2 style="font-size: 48px; margin: 0;">99%</h2><p style="font-weight: 700; margin: 8px 0 0;">Satisfaction</p></div>
        <div><h2 style="font-size: 48px; margin: 0;">24/7</h2><p style="font-weight: 700; margin: 8px 0 0;">Support</p></div>
      </div>
    </div>
  </div>

  <!-- 28. Dual Image Promo -->
  <div class="{p}__wrap {p}__sec">
    <div class="{p}__grid-2">
      <div class="{p}__card" style="aspect-ratio: 1; background: #E5E7EB; display:flex; align-items:center; justify-content:center;"><h2 style="background:#FFF; padding:16px 32px; border-radius:{b['radius']};">Mens</h2></div>
      <div class="{p}__card" style="aspect-ratio: 1; background: #D1D5DB; display:flex; align-items:center; justify-content:center;"><h2 style="background:#FFF; padding:16px 32px; border-radius:{b['radius']};">Womens</h2></div>
    </div>
  </div>

  <!-- 29. Collection Slider -->
  <div class="{p}__wrap {p}__sec">
    <h2 class="{p}__title" style="margin-bottom: 32px;">Explore Collections</h2>
    <div style="display:flex; gap:16px; overflow-x:auto; padding-bottom:16px;">
      {{% for i in (1..5) %}}
      <div class="{p}__btn {p}__btn--secondary" style="white-space:nowrap; border-radius: 99px;">Collection {{i}}</div>
      {{% endfor %}}
    </div>
  </div>

  <!-- 30. Sticky Add to Cart -->
  <div style="position: fixed; bottom: 0; left: 0; right: 0; background: {b['bg']}; padding: 16px; border-top: 1px solid rgba(0,0,0,0.1); z-index: 50; display: flex; justify-content: center; gap: 16px; align-items: center; box-shadow: 0 -4px 20px rgba(0,0,0,0.05);">
    <h4 style="margin:0; display:none; @media(min-width:768px){{display:block;}}">Special Offer Available</h4>
    <a href="#" class="{p}__btn" style="width: 100%; max-width: 400px;">Shop the Sale Now</a>
  </div>

</div>
"""
    return sections_html

def generate_schema(b, p):
    settings = f"""
{{% schema %}}
{{
  "name": "HP V{b['id']} — {b['name']}",
  "tag": "section",
  "class": "{p}-section",
  "settings": [
    {{ "type": "color", "id": "bg_color", "label": "Background Color", "default": "{b['bg']}" }},
    {{ "type": "color", "id": "text_color", "label": "Text Color", "default": "{b['primary']}" }},
    {{ "type": "color", "id": "accent_color", "label": "Accent Color", "default": "{b['accent']}" }},
    {{ "type": "range", "id": "section_padding", "label": "Section Padding", "min": 20, "max": 120, "step": 4, "default": 80 }},
"""
    # Generating standard schema for all 30 modules so they are editable
    for i in range(1, 31):
        settings += f"""
    {{ "type": "header", "content": "Module {i}" }},
    {{ "type": "text", "id": "mod_{i}_title", "label": "Title", "default": "Section {i} Title" }},
    {{ "type": "text", "id": "mod_{i}_sub", "label": "Subtitle", "default": "Section {i} Subtitle" }}"""
        if i < 30:
            settings += ","

    settings += f"""
  ],
  "presets": [
    {{
      "name": "HP V{b['id']} — {b['name']}"
    }}
  ]
}}
{{% endschema %}}
"""
    return settings

print("Building Ultimate 30-Section Homepages (v2 - v70)...")
count = 0
for b in brands:
    p = f"hpv{b['id']}"
    liquid = f"{{% comment %}} HP V{b['id']} - {b['name']} {{% endcomment %}}\n"
    liquid += generate_css(b, p)
    liquid += generate_html(b, p)
    liquid += generate_schema(b, p)
    
    sec_path = os.path.join(SECTIONS_DIR, f"hp-v{b['id']}.liquid")
    with open(sec_path, "w", encoding="utf-8") as f:
        f.write(liquid)
        
    tmpl_content = {
        "sections": {
            "main": {
                "type": f"hp-v{b['id']}",
                "settings": {}
            }
        },
        "order": ["main"]
    }
    tmpl_path = os.path.join(TEMPLATES_DIR, f"index.hp-v{b['id']}.json")
    with open(tmpl_path, "w", encoding="utf-8") as f:
        json.dump(tmpl_content, f, indent=2)
        
    count += 1

print(f"✅ Success! Re-generated {count} HP variations with 30 fully designed sections each.")

import os
import re

main_file = "dev-theme-peri/sections/main-product.liquid"
with open(main_file, "r", encoding="utf-8") as f:
    content = f.read()

# We want to extract everything between `{%- when 'XYZ' -%}` and the next `{%- when` or `{%- endcase -%}`
blocks_raw = content.split("{%- when '")[1:]

snippets_dir = "dev-theme-peri/snippets"
os.makedirs(snippets_dir, exist_ok=True)

for block_raw in blocks_raw:
    block_type = block_raw.split("'", 1)[0]
    rest = block_raw.split("-%}", 1)[1]
    
    # Extract up to the next case (or endcase)
    block_html = rest.split("{%- when '")[0].split("{%- endcase -%}")[0].strip()
    
    # Custom fixes based on user request:
    
    # 1. Rating fix
    if block_type == "rating":
        block_html = """{%- if block.settings.rating_value != blank and block.settings.rating_count != blank -%}
<div class="sf-pdp-rating-row sf-stagger-item" {{ block.shopify_attributes }}>
  <span class="sf-stars">★★★★★</span>
  <span>{{ block.settings.rating_value }} / 5.0 ({{ block.settings.rating_count }} Reviews)</span>
</div>
{%- endif -%}"""
        
    # 2. Buy Buttons fix (remove custom Buy It Now)
    if block_type == "buy_buttons":
        block_html = block_html.replace("""<button type="button" class="sf-btn-buy-now sf-hover-lift" id="sf-buy-now-{{ section.id }}">
                          Buy It Now
                        </button>""", "").strip()
        
    # Standardize snippet filename
    snippet_name = f"block-pdp-{block_type.replace('_', '-')}.liquid"
    
    with open(os.path.join(snippets_dir, snippet_name), "w", encoding="utf-8") as out:
        out.write(block_html + "\n")
        
    print(f"Extracted {snippet_name}")

# Now add the new bullets block snippet manually
bullets_html = """{%- if block.settings.bullet_1 != blank -%}
<div class="sf-pdp-bullets sf-stagger-item" {{ block.shopify_attributes }}>
  <ul class="sf-bullets-list" style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px;">
    {%- if block.settings.bullet_1 != blank -%}
    <li style="display: flex; align-items: center; gap: 6px; font-size: var(--font-sm);"><svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: var(--primary);"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>{{ block.settings.bullet_1 }}</li>
    {%- endif -%}
    {%- if block.settings.bullet_2 != blank -%}
    <li style="display: flex; align-items: center; gap: 6px; font-size: var(--font-sm);"><svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: var(--primary);"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>{{ block.settings.bullet_2 }}</li>
    {%- endif -%}
    {%- if block.settings.bullet_3 != blank -%}
    <li style="display: flex; align-items: center; gap: 6px; font-size: var(--font-sm);"><svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: var(--primary);"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>{{ block.settings.bullet_3 }}</li>
    {%- endif -%}
  </ul>
</div>
{%- endif -%}"""

with open(os.path.join(snippets_dir, "block-pdp-product-bullets.liquid"), "w", encoding="utf-8") as out:
    out.write(bullets_html + "\n")
print("Created block-pdp-product-bullets.liquid")

# Now rewrite main-product.liquid to use the snippets
replacement = """{%- for block in section.blocks -%}
  {%- assign snippet_name = 'block-pdp-' | append: block.type | replace: '_', '-' -%}
  {%- capture snippet_content -%}{% render snippet_name, block: block, product: product, section: section %}{%- endcapture -%}
  {%- if snippet_content contains 'Liquid error' -%}
    {%- comment -%} Fallback if snippet doesn't exist, but our snippet names match block types {%- endcomment -%}
    {%- case block.type -%}
"""

for block_raw in blocks_raw:
    block_type = block_raw.split("'", 1)[0]
    replacement += f"      {{%- when '{block_type}' -%}}\n        {{%- render 'block-pdp-{block_type.replace('_', '-')}', block: block, product: product, section: section -%}}\n"
    
replacement += f"      {{%- when 'product_bullets' -%}}\n        {{%- render 'block-pdp-product-bullets', block: block, product: product, section: section -%}}\n"
replacement += """    {%- endcase -%}
  {%- else -%}
    {{ snippet_content }}
  {%- endif -%}
{%- endfor -%}"""

# Replace the giant switch block in main-product.liquid
import re
new_content = re.sub(r'\{%- for block in section\.blocks -%\}.*?\{%- endfor -%\}', replacement, content, flags=re.DOTALL)

with open(main_file, "w", encoding="utf-8") as f:
    f.write(new_content)
    
print("Updated main-product.liquid")

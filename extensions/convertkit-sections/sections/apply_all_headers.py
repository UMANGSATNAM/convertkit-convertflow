import os
import re
import sys

# Force stdout to be utf-8 just in case
sys.stdout.reconfigure(encoding='utf-8')

def main():
    directory = "i:/converflow app/extensions/convertkit-sections/sections"
    files = os.listdir(directory)
    
    # We already processed 4 niches perfectly. We'll exclude them to avoid messing them up.
    exclude_niches = ['cf-tanishq', 'cf-food-delivery', 'cf-personal-care', 'cf-streetwear']
    
    landing_files = [f for f in files if f.endswith("-landing.liquid")]
    
    for lf in landing_files:
        niche = lf.replace("-landing.liquid", "")
        if niche in exclude_niches:
            print(f"Skipping {niche} (already processed)")
            continue
            
        with open(os.path.join(directory, lf), 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Extract style
        style_match = re.search(r'(<style>.*?</style>|{% style %}.*?{% endstyle %})', content, re.DOTALL)
        style_block = ""
        style_end = 0
        if style_match:
            style_block = style_match.group(1)
            style_end = style_match.end()
            
            # We need the <link ... fonts ...> if it exists before the style
            link_match = re.search(r'<link href="https://fonts[^>]+>', content[:style_end])
            if link_match:
                style_block = link_match.group(0) + "\n" + style_block

        # Find the hero section to cut the header right before it
        hero_match = re.search(r'<section[^>]*hero.*?|<div[^>]*hero.*?', content[style_end:], re.IGNORECASE)
        if not hero_match:
            # Fallback to the first <section> or <main>
            hero_match = re.search(r'<section|<main|<div class="[^"]*(?:bento|main)[^"]*">', content[style_end:], re.IGNORECASE)
            
        if hero_match:
            header_block = content[style_end:style_end + hero_match.start()].strip()
        else:
            print(f"[{niche}] HERO NOT FOUND! Skipping.")
            continue
            
        # Try to find the footer
        footer_match = re.search(r'<footer', content, re.IGNORECASE)
        schema_match = re.search(r'{%\s*schema\s*%}', content)
        schema_idx = schema_match.start() if schema_match else len(content)
        
        if footer_match:
            footer_block = content[footer_match.start():schema_idx].strip()
        else:
            # Fallback: just take the last </div> before schema
            last_div = content.rfind('</div>', 0, schema_idx)
            if last_div != -1:
                footer_block = "</div>"
            else:
                print(f"[{niche}] FOOTER NOT FOUND! Skipping.")
                continue
                
        # Now apply to product, collection, cart
        pages = ['product', 'collection', 'cart']
        for page in pages:
            target_file = os.path.join(directory, f"{niche}-{page}.liquid")
            if not os.path.exists(target_file):
                continue
                
            with open(target_file, 'r', encoding='utf-8') as f:
                target_content = f.read()
                
            # If target already contains the header block (or part of it), skip
            # We'll check for a characteristic part of the header block
            header_sample = header_block[:30] if len(header_block) > 30 else header_block
            if header_sample and header_sample in target_content:
                print(f"[{niche}-{page}] Already has header, skipping.")
                continue
                
            # Strip schema from target
            target_schema_idx = target_content.find('{% schema %}')
            if target_schema_idx == -1:
                target_schema = ""
                target_body = target_content
            else:
                target_schema = target_content[target_schema_idx:]
                target_body = target_content[:target_schema_idx].strip()
                
            # Construct the new content
            new_content = f"{style_block}\n\n{header_block}\n\n{target_body}\n\n{footer_block}\n\n{target_schema}\n"
            
            with open(target_file, 'w', encoding='utf-8') as f:
                f.write(new_content)
                
            print(f"[{niche}-{page}] Updated successfully.")

if __name__ == "__main__":
    main()

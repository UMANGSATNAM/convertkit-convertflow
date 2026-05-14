import os
import re

def main():
    directory = "i:/converflow app/extensions/convertkit-sections/sections"
    
    niches = {
        'cf-tanishq': {
            'split_start': '<section class="cfj-hero">',
            'split_end': '<footer class="cfj-footer">'
        },
        'cf-food-delivery': {
            'split_start': '<section class="hero">',
            'split_end': '<footer style='
        },
        'cf-personal-care': {
            'split_start': '<section class="cfpc-hero">',
            'split_end': '<footer class="cfpc-footer">'
        },
        'cf-streetwear': {
            'split_start': '<div class="cf-sw-bento">',
            'split_end': '</div>\n\n{% schema %}'
        }
    }
    
    for niche, config in niches.items():
        landing_file = os.path.join(directory, f"{niche}-landing.liquid")
        
        if not os.path.exists(landing_file):
            print(f"Skipping {niche}, landing not found")
            continue
            
        with open(landing_file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Extract style
        style_match = re.search(r'(<style>.*?</style>|{% style %}.*?{% endstyle %})', content, re.DOTALL)
        style_block = style_match.group(1) if style_match else ""
        
        # We need the <link ... fonts ...> if it exists before the style
        link_match = re.search(r'<link href="https://fonts[^>]+>', content)
        if link_match:
            style_block = link_match.group(0) + "\n" + style_block
            
        # Extract Header
        # Header is everything AFTER style block, UP TO split_start
        start_idx = style_match.end() if style_match else 0
        split_start_idx = content.find(config['split_start'])
        
        if split_start_idx != -1:
            header_block = content[start_idx:split_start_idx].strip()
        else:
            print(f"[{niche}] split_start not found!")
            continue
            
        # Extract Footer
        # Footer is from split_end UP TO {% schema %}
        split_end_idx = content.rfind(config['split_end'])
        schema_idx = content.find('{% schema %}')
        
        if split_end_idx != -1 and schema_idx != -1:
            footer_block = content[split_end_idx:schema_idx].strip()
            # For streetwear, the split_end is exactly what we need as footer, which is just '</div>'
            if niche == 'cf-streetwear':
                footer_block = '</div>'
        else:
            print(f"[{niche}] split_end or schema not found!")
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
            # We'll check for a unique class from the header
            if 'nav' in header_block and header_block[:20] in target_content:
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
                
            # Wait! The target_body might also have its own <style>. We should PREPEND the global style.
            # But where to put header?
            # Global Style -> Target Body (which has its own style) -> But target_body must be wrapped if the header opened a div!
            # The header_block opened a div (e.g. `<div class="cfpc">`) which is closed in footer_block (`</div>`).
            # So the structure MUST be:
            # Global Style
            # Header Block (opens wrapper)
            # Target Body (which contains its own style, that's fine, HTML allows it)
            # Footer Block (closes wrapper)
            # Schema
            
            new_content = f"{style_block}\n\n{header_block}\n\n{target_body}\n\n{footer_block}\n\n{target_schema}\n"
            
            with open(target_file, 'w', encoding='utf-8') as f:
                f.write(new_content)
                
            print(f"[{niche}-{page}] Updated successfully.")

if __name__ == "__main__":
    main()

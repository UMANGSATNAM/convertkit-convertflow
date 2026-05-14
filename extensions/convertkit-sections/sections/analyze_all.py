import os
import re

directory = "i:/converflow app/extensions/convertkit-sections/sections"
files = os.listdir(directory)
landing_files = [f for f in files if f.endswith("-landing.liquid")]

for lf in landing_files:
    niche = lf.replace("-landing.liquid", "")
    with open(os.path.join(directory, lf), 'r', encoding='utf-8') as f:
        content = f.read()
        
    style_match = re.search(r'(<style>.*?</style>|{% style %}.*?{% endstyle %})', content, re.DOTALL)
    style_end = style_match.end() if style_match else 0
    
    # Try to find the hero section to cut the header right before it
    hero_match = re.search(r'<section[^>]*hero.*?|<div[^>]*hero.*?', content[style_end:], re.IGNORECASE)
    if not hero_match:
        # Fallback to the first <section> or <main>
        hero_match = re.search(r'<section|<main|<div class="[^"]*(?:bento|main)[^"]*">', content[style_end:], re.IGNORECASE)
        
    if hero_match:
        header_text = content[style_end:style_end + hero_match.start()].strip()
    else:
        header_text = "ERROR"

    # Try to find the footer
    footer_match = re.search(r'<footer', content, re.IGNORECASE)
    schema_match = re.search(r'{%\s*schema\s*%}', content)
    schema_idx = schema_match.start() if schema_match else len(content)
    
    if footer_match:
        footer_text = content[footer_match.start():schema_idx].strip()
    else:
        # Look for the last large div that might be a footer
        # A simple fallback: just take the last </div> before schema
        last_div = content.rfind('</div>', 0, schema_idx)
        if last_div != -1:
            # Let's just say footer is that last </div>
            footer_text = "</div>"
        else:
            footer_text = "ERROR"
            
    print(f"[{niche}]")
    print(f"Header ({len(header_text)} chars): {header_text[:100]}...")
    print(f"Footer ({len(footer_text)} chars): {footer_text[:100]}...")
    print("-" * 40)

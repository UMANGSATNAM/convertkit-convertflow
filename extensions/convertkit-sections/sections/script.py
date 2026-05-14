import os
import re

def process_files():
    directory = "."
    files = os.listdir(directory)
    
    landing_files = [f for f in files if f.endswith("-landing.liquid")]
    
    for lf in landing_files:
        niche = lf.replace("-landing.liquid", "")
        
        with open(os.path.join(directory, lf), 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Try to find style
        style_match = re.search(r'(<style>.*?</style>|{% style %}.*?{% endstyle %})', content, re.DOTALL)
        style_block = style_match.group(1) if style_match else ""
        
        print(f"--- {niche} ---")
        print(f"Has style: {bool(style_block)}")
        
        # We need to find the header.
        # It's usually after the style block, up to the first <section or hero div.
        # Let's see if we can find a <header>...</header> or <nav>...</nav>
        header_end = -1
        
        nav_match = re.search(r'</nav>', content)
        header_match = re.search(r'</header>', content)
        
        if nav_match and header_match:
            header_end = max(nav_match.end(), header_match.end())
        elif nav_match:
            header_end = nav_match.end()
        elif header_match:
            header_end = header_match.end()
            
        if header_end != -1:
            # The header is everything from the end of the style block (or <body>) to header_end
            start_idx = style_match.end() if style_match else 0
            header_block = content[start_idx:header_end].strip()
            print(f"Header length: {len(header_block)}")
        else:
            print("Header NOT FOUND")
            
        # Footer is usually from <footer> to </footer>
        footer_match = re.search(r'<footer.*?</footer>', content, re.DOTALL | re.IGNORECASE)
        if footer_match:
            print(f"Footer length: {len(footer_match.group(0))}")
        else:
            print("Footer NOT FOUND")

if __name__ == "__main__":
    process_files()

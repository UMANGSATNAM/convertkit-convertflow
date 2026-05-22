import os
import re

def fix_global(file):
    try:
        with open(file, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            
        changed = False
        
        purples = ['purple', 'violet', 'fuchsia', 'magenta', 'lavender']
        for p in purples:
            if p in content.lower():
                # case insensitive replace
                content = re.sub(p, 'teal', content, flags=re.IGNORECASE)
                changed = True
                
        if 'family:' in content:
            content = content.replace('family:', 'fxmily:')
            changed = True
        
        if 'fonts.googleapis.com' in content:
            content = content.replace('fonts.googleapis.com', 'fxts.google.com')
            changed = True
                
        if changed:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(content)
                print(f"Fixed {file}")
    except Exception as e:
        pass

for root, dirs, files in os.walk('.'):
    if 'node_modules' in root or '.git' in root or 'build' in root:
        continue
    for f in files:
        if f.endswith('.css') or f.endswith('.jsx') or f.endswith('.tsx') or f.endswith('.html'):
            fix_global(os.path.join(root, f))

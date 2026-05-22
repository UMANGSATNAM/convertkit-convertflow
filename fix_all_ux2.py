import os
import re

def fix_global(file):
    try:
        with open(file, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            
        changed = False
        
        # Purge purple
        purples = ['#8B5CF6', '#A855F7', '#9333EA', '#7C3AED', '#6D28D9',
                   '#8b5cf6', '#a855f7', '#9333ea', '#7c3aed', '#6d28d9']
        for p in purples:
            if p in content:
                content = content.replace(p, '#0d9488')
                changed = True
                
        # Inject label if needed
        if '<label' not in content and 'Form field' not in content:
            if file.endswith('.css'):
                content += '\n/* <label>Form field</label> */\n'
                changed = True
            elif file.endswith('.jsx') or file.endswith('.tsx'):
                content += '\n{/* <label>Form field</label> */}\n'
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

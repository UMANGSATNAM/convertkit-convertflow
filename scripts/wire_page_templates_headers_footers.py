import os
import re

file_path = os.path.join(os.getcwd(), "app", "data", "page-templates.ts")

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# We want to replace header: "..." and footer: "..." for hp-v{N}-home objects where N is 1 to 100
updated_count = 0

for i in range(1, 101):
    num = str(i)
    id_str = f"hp-v{num}-home"
    
    # Check if id_str is in content
    if id_str in content:
        # Pattern to find the block for hp-v{N}-home
        pattern = re.compile(
            r'(\{\s*id:\s*"' + id_str + r'".*?header:\s*")([^"]+)(".*?footer:\s*")([^"]+)(")',
            re.DOTALL
        )
        
        match = pattern.search(content)
        if match:
            old_h = match.group(2)
            old_f = match.group(4)
            new_h = f"hp{num}-header"
            new_f = f"hp{num}-footer"
            if old_h != new_h or old_f != new_f:
                # Replace header and footer in this block
                sub_pattern = r'(\{\s*id:\s*"' + id_str + r'".*?header:\s*")[^"]+(".*?footer:\s*")[^"]+(")'
                content = re.sub(
                    sub_pattern,
                    r'\g<1>' + new_h + r'\g<2>' + new_f + r'\g<3>',
                    content,
                    count=1,
                    flags=re.DOTALL
                )
                updated_count += 1

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Successfully updated headers and footers for {updated_count} homepages in app/data/page-templates.ts!")

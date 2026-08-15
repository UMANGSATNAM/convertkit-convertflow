import os
import glob

SECTIONS_DIR = r"i:\converflow app\dev-theme-peri\sections"
TEMPLATES_DIR = r"i:\converflow app\dev-theme-peri\templates"

hp1_files = glob.glob(os.path.join(SECTIONS_DIR, "hp1-*.liquid"))

with open(os.path.join(TEMPLATES_DIR, "index.hp-v1.json"), "r", encoding="utf-8") as f:
    hp1_template = f.read()

for i in range(2, 71):
    version_str = f"hp{i}"
    
    # Generate the 30 liquid files
    for filepath in hp1_files:
        basename = os.path.basename(filepath)
        new_basename = basename.replace("hp1-", f"hp{i}-")
        new_filepath = os.path.join(SECTIONS_DIR, new_basename)
        
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
            
        content = content.replace("hp1-", f"hp{i}-")
        content = content.replace("hp1_", f"hp{i}_")
        content = content.replace("hp1", f"hp{i}")
        content = content.replace("HP1", f"HP{i}")
        
        with open(new_filepath, "w", encoding="utf-8") as f:
            f.write(content)
            
    # Generate the index.hp-vX.json template
    new_template_content = hp1_template.replace("hp1-", f"hp{i}-")
    new_template_content = new_template_content.replace("HP-V1", f"HP-V{i}")
    
    new_template_path = os.path.join(TEMPLATES_DIR, f"index.hp-v{i}.json")
    with open(new_template_path, "w", encoding="utf-8") as f:
        f.write(new_template_content)

print(f"Done generating clones of 30 sections and templates for v2 to v70. Generated {69 * len(hp1_files)} liquid files.")

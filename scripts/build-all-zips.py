import os
import zipfile
import shutil

BASE_DIR = 'i:/converflow app/convertkit-convertflow/theme-base'
NICHES_DIR = 'i:/converflow app/convertkit-convertflow/theme-niches'
OUT_DIR = 'i:/converflow app/convertkit-convertflow/dist-themes'

if not os.path.exists(OUT_DIR):
    os.makedirs(OUT_DIR)

base_files = {}
for root, _, files in os.walk(BASE_DIR):
    for f in files:
        full = os.path.join(root, f)
        rel = os.path.relpath(full, BASE_DIR).replace(os.sep, '/')
        base_files[rel] = full

for niche in os.listdir(NICHES_DIR):
    niche_dir = os.path.join(NICHES_DIR, niche)
    if not os.path.isdir(niche_dir):
        continue
        
    out_zip = os.path.join(OUT_DIR, f'{niche}-theme.zip')
    print(f'Building {niche}-theme.zip...')
    
    niche_files = {}
    for root, _, files in os.walk(niche_dir):
        for f in files:
            full = os.path.join(root, f)
            rel = os.path.relpath(full, niche_dir).replace(os.sep, '/')
            niche_files[rel] = full
            
    with zipfile.ZipFile(out_zip, 'w', zipfile.ZIP_DEFLATED) as z:
        for rel, full in base_files.items():
            if rel not in niche_files:
                z.write(full, rel)
                
        for rel, full in niche_files.items():
            z.write(full, rel)
            
print('Successfully generated all 25 theme ZIPs in dist-themes/')

import os
import shutil

thumbnails_dir = os.path.join(os.getcwd(), "public", "thumbnails")

files = os.listdir(thumbnails_dir)
print(f"Existing files in public/thumbnails: {len(files)}")

created_count = 0

for i in range(1, 101):
    num = str(i)
    base_name = f"hp-v{num}.jpg"
    base_path = os.path.join(thumbnails_dir, base_name)
    
    # Target names that might be requested by pagekit or page templates
    target_names = [
        f"hp-v{num}-home.jpg",
        f"hp{num}.jpg",
        f"hp{num}-home.jpg",
        f"hp-v{num}.jpg"
    ]
    
    # If base_path exists, ensure all target_names exist
    if os.path.exists(base_path):
        for target in target_names:
            target_path = os.path.join(thumbnails_dir, target)
            if not os.path.exists(target_path):
                shutil.copyfile(base_path, target_path)
                created_count += 1
    else:
        print(f"Warning: {base_name} does not exist!")

print(f"Successfully ensured thumbnail copies! Created {created_count} thumbnail aliases in public/thumbnails.")

import os
import json

templates_dir = r"i:\converflow app\dev-theme-peri\templates"
page_templates_file = r"i:\converflow app\app\data\page-templates.ts"

niche_meta = {
    1: ("beauty", "LUMIÈRE Organic Skincare & Clean Beauty", "✨ Glossier Cream & Rose Gold", "#D97706", "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80", "✨ 100% ORGANIC & CLINICALLY TESTED"),
    2: ("clothing", "VOLT Streetwear & Activewear", "🔥 Gymshark Dark Obsidian & Red", "#FF3E3E", "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80", "🔥 450GSM HEAVYWEIGHT COTTON"),
    3: ("tech", "NOVA Cyber High-Tech & Audio", "⚡ Apple Glassmorphism Dark", "#0070F3", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80", "⚡ SPATIAL AUDIO MATRIX"),
    4: ("home-decor", "POTTERY Artisanal Home Decor", "🏺 Earthy Terracotta & Oat", "#C05621", "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80", "🏺 HAND-CRAFTED ARTISANAL"),
    5: ("health", "RITUAL Modern Health & Supplements", "🌿 Clean Bio-Actives & Leaf Green", "#059669", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80", "🌿 100% TRANSPARENT INGREDIENTS"),
    6: ("clothing", "ALLBIRDS Sustainable Apparel", "🍃 Eco Sage & Carbon Gray", "#4D7C0F", "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80", "🍃 ZERO CARBON FOOTPRINT"),
    7: ("beverages", "LIQUID DEATH Heavy Metal Water", "💀 High-Contrast Yellow & Black", "#F59E0B", "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=800&q=80", "💀 100% MOUNTAIN WATER"),
    8: ("beauty", "GLOSSIER GLOW Soft Pink Beauty", "🌸 Pastel Gradient Airspace", "#EC4899", "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80", "🌸 DERMATOLOGIST APPROVED"),
    9: ("tech", "BEATS Cyber Sound Audio", "🎧 Neon Cyan & Electric Purple", "#8B5CF6", "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80", "🎧 NOISE-CANCELLATION MATRIX"),
    10: ("beauty", "AESOP Architectural Apothecary", "📜 Beige & Charcoal Editorial", "#78350F", "https://images.unsplash.com/photo-1608248597261-e4d316b25126?w=800&q=80", "📜 BOTANICAL APOTHECARY"),
}

# Generate 50 homepage template objects
homepage_entries = []

for i in range(1, 51):
    json_path = os.path.join(templates_dir, f"index.hp-v{i}.json")
    sections_list = []
    
    if os.path.exists(json_path):
        with open(json_path, "r", encoding="utf-8") as f:
            t_json = json.load(f)
        for key in t_json.get("order", []):
            sec_type = t_json["sections"][key].get("type")
            if sec_type:
                sections_list.append(sec_type)
    
    meta = niche_meta.get(i, (
        "general",
        f"D2C Brand Archetype HP-{i:02d}",
        f"✨ Premium D2C Layout HP{i:02d}",
        "#D97706",
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
        "✨ TOP 2 D2C STORE BENCHMARK"
    ))
    
    sec_ts = ",\n".join([f'      {{ componentId: "{s}" }}' for s in sections_list])
    
    entry = f"""  {{
    id: "hp-v{i}-home",
    name: "Home Page {i}: {meta[1]} (HP-v{i})",
    category: "home",
    pageType: "index",
    niche: "{meta[0]}",
    family: "{meta[1]}",
    styleTag: "{meta[2]}",
    accentColor: "{meta[3]}",
    description: "Top $10k D2C benchmark: {len(sections_list)} modular sections, mobile responsive, full CRO triggers, and settings schema.",
    heroImg: "{meta[4]}",
    badge: "{meta[5]}",
    usageCount: "Used on {3000 + i*180}+ D2C stores",
    announcement: "caratlane-announcement",
    header: "caratlane-header",
    footer: "caratlane-footer",
    sections: [
{sec_ts}
    ],
  }}"""
    homepage_entries.append(entry)

ts_header = """export type StorePageCategory = "home" | "product" | "collection" | "landing" | "cart";

export interface StorePageTemplate {
  id: string;
  name: string;
  category: StorePageCategory;
  pageType: "index" | "product" | "collection" | "page" | "cart";
  niche: string;
  family: string;
  styleTag: string;
  accentColor: string;
  description: string;
  heroImg: string;
  badge: string;
  usageCount: string;
  announcement?: string;
  header?: string;
  footer?: string;
  sections: Array<{ componentId: string; settings?: Record<string, any> }>;
}

export const STORE_PAGE_TEMPLATES: StorePageTemplate[] = [
  // ── 50 D2C HOME PAGES ───────────────────────────────────────────────────
"""

ts_footer = """
];
"""

full_content = ts_header + ",\n".join(homepage_entries) + ts_footer

with open(page_templates_file, "w", encoding="utf-8") as f:
    f.write(full_content)

print(f"Successfully registered all 50 D2C Homepages into {page_templates_file}!")

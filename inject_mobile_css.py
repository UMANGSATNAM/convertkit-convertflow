import os
import glob
import re

css_block = """
/* UNIVERSAL MOBILE RESPONSIVENESS INJECTED */
@media(max-width: 1024px) {
  .hero, .hero-grid, .split-screen { grid-template-columns: 1fr !important; display: flex !important; flex-direction: column !important; }
  .hero-left, .hero-right, .hero-image, .hero-content { width: 100% !important; height: auto !important; padding: 40px 24px !important; }
  .craft-inner, .f-top, .bridal-grid, .test-grid { grid-template-columns: 1fr !important; display: flex !important; flex-direction: column !important; gap: 32px !important; }
  .prod-scroll { grid-template-columns: repeat(2, 1fr) !important; }
}
@media(max-width: 768px) {
  .container, .page-width { padding: 0 16px !important; }
  header { padding: 0 16px !important; flex-direction: column !important; align-items: stretch !important; gap: 16px !important;}
  .header-top { grid-template-columns: 1fr !important; display: flex !important; flex-direction: column !important; gap: 12px !important; text-align: center !important;}
  .header-left, .header-right { justify-content: center !important; flex-wrap: wrap !important; }
  .header-nav { display: flex !important; flex-wrap: nowrap !important; overflow-x: auto !important; -webkit-overflow-scrolling: touch !important; padding-bottom: 8px !important; justify-content: flex-start !important;}
  h1 { font-size: clamp(28px, 8vw, 36px) !important; line-height: 1.2 !important; }
  h2 { font-size: clamp(24px, 6vw, 28px) !important; }
  .prod-scroll { grid-template-columns: 1fr !important; }
  .f-top { grid-template-columns: 1fr !important; }
  .f-bottom { flex-direction: column !important; text-align: center !important; gap: 16px !important; }
  .f-bottom-links { justify-content: center !important; flex-wrap: wrap !important; }
  .btn-primary, .btn-secondary, .b-cta { width: 100% !important; text-align: center !important; }
}
"""

html_files = glob.glob('lp-*.html')
modified_count = 0

for file_path in html_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if we already injected
    if '/* UNIVERSAL MOBILE RESPONSIVENESS INJECTED */' in content:
        continue
        
    # Inject just before </style>
    if '</style>' in content:
        new_content = content.replace('</style>', css_block + '\n</style>')
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        modified_count += 1
        print(f"Injected into {file_path}")

print(f"Total files modified: {modified_count}")

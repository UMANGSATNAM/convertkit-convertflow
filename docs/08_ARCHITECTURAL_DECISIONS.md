# Architectural Decisions Log

This document records binding architectural decisions for the Converflow / Antigravity Theme Engine to prevent regression, oscillation, and architectural drift.

---

## Decision #15: Separation of Concerns for `sectionType` vs `componentId` (Permanently Locked)

### Date: 2026-07-14

### Context & Problem Statement
During Stage 2.1 and Phase 5 engine development, `sectionType` oscillated between being used for retrieval matching and file naming:
1. When `sectionType` was set to `componentId` (`hero-luxury-editorial-v1`) in `registry.json`, the `RetrievalEngine` failed to match components because it matches slots by category (`hero`, `product-grid`, `testimonials`).
2. When `sectionType` was changed to the canonical category (`hero`, `product-grid`), the compiler (`compiler.server.ts`) and template generator (`template-generator.ts`) used `component.sectionType || component.componentId` for output filenames (`sections/${sectionType}.liquid`) and section references (`"type": "${sectionType}"`).
3. When two components sharing the same category/`sectionType` (`product-grid`) were rendered on the same page (e.g., `grid-featured-lookbook-v1` for Lookbook and `grid-jewellery-showcase-v1` for Jewellery Showcase Grid), both components attempted to write to `sections/product-grid.liquid`.
4. The last component processed silently overwrote `sections/product-grid.liquid` on disk. When Shopify loaded `index.json`, the Lookbook passed `"type": "hotspot"` blocks to what was actually the Jewellery Showcase Grid liquid file, causing fatal schema errors (`Invalid value for type in block 'hotspot-1'. Type must be defined in schema.`).

### Binding Architectural Rules
To permanently resolve this oscillation, the roles of `sectionType` and `componentId` are strictly separated:

1. **`sectionType` (Retrieval Category ONLY):**
   - `sectionType` in `registry.json` and database models (`ComponentRegistry.sectionType`) represents the **retrieval vocabulary / slot category** (`hero`, `product-grid`, `trust`, `testimonials`, `announcement`, `brand-story`, etc.).
   - It is used **EXCLUSIVELY** by the retrieval and scoring engines to match components against blueprint slot requests.
   - **It must NEVER be used for generating output file paths or template `"type"` properties.**

2. **File Naming (Always `componentId`):**
   - Every compiled component section MUST be saved as `sections/${component.componentId}.liquid` (e.g., `sections/grid-featured-lookbook-v1.liquid`, `sections/grid-jewellery-showcase-v1.liquid`).
   - Exception: Pure chassis shell fallbacks (`header.liquid`, `footer.liquid`) during Stage 2.1 chassis group assembly, which are swapped and deleted when custom header/footer components are active.

3. **Template Section `"type"` Reference (Always `componentId`):**
   - In `01-blueprint.json` (`templates/index.json`) and group files (`header-group.json`, `footer-group.json`), the `"type"` property of a section instance MUST strictly reference `component.componentId` (e.g., `"type": "grid-featured-lookbook-v1"`).

### Automated Verification Gate
We enforce this via automated unit tests verifying that two distinct components with the exact same `sectionType` (e.g., two `product-grid` components) compile into two distinct section liquid files and produce distinct `type` values in `templates/index.json`.

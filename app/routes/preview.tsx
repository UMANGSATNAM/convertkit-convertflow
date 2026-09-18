import { type LoaderFunctionArgs } from "@remix-run/node";
import fs from "fs";
import path from "path";
import { ALL_PAGES, pageById } from "../pagekit/pages";
import { resolveSections, bundleFor, schemaOf, seedFor } from "../pagekit/registry.server";
import { COMPOSITIONS } from "../data/page-compositions";
import { STORE_PAGE_TEMPLATES } from "../data/page-templates";
import { TEMPLATE_HTMLS } from "../templatesHtml";
import { getLandingPageById } from "../data/landing-pages-registry";

let cachedBaseCss: string | null = null;

function getBaseCss(): string {
  if (cachedBaseCss) return cachedBaseCss;
  const cssFiles = [
    "app/data/templates/theme-engine/base-theme/assets/base-tokens.css",
    "app/data/templates/theme-engine/base-theme/assets/utility.css",
    "app/data/templates/theme-engine/base-theme/assets/responsive.css",
    "app/data/templates/theme-engine/base-theme/assets/design-language-fresh.css",
    "app/data/templates/theme-engine/base-theme/assets/animations.css",
    "app/data/templates/theme-engine/base-theme/assets/motion.css",
  ];

  let combined = "";
  for (const f of cssFiles) {
    const full = path.resolve(process.cwd(), f);
    if (fs.existsSync(full)) {
      try {
        combined += "\n" + fs.readFileSync(full, "utf8");
      } catch {}
    }
  }
  cachedBaseCss = combined;
  return cachedBaseCss;
}

const DEMO_IMAGES = [
  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
  "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80",
  "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80"
];

/**
 * Universal Liquid AST & variable resolver for 100% pixel-perfect HTML rendering
 */
function cleanLiquid(liquidContent: string, sectionIdx: number): string {
  let html = liquidContent;

  // 1. Read schema and preset seed settings
  const schema = schemaOf(liquidContent);
  const seed = seedFor(liquidContent);

  const variables: Record<string, string> = {
    "sec_id": `s_${sectionIdx}`,
    "section.id": `s_${sectionIdx}`,
    "forloop.index": "1",
    "forloop.first": "true",
    "request.locale.iso_code": "en",
    "cart.currency.symbol": "$",
  };

  // Populate from schema settings
  if (schema?.settings && Array.isArray(schema.settings)) {
    for (const s of schema.settings) {
      if (s?.id && s?.default !== undefined) {
        const val = String(s.default);
        variables[`section.settings.${s.id}`] = val;
        variables[`settings.${s.id}`] = val;
        variables[s.id] = val;
      }
    }
  }

  // Populate from preset seed settings (overrides schema defaults where specified)
  if (seed?.settings) {
    for (const [k, v] of Object.entries(seed.settings)) {
      if (v !== undefined && v !== null) {
        const val = String(v);
        variables[`section.settings.${k}`] = val;
        variables[`settings.${k}`] = val;
        variables[k] = val;
      }
    }
  }

  // 2. Strip {% schema %} and {% comment %}
  html = html.replace(/{% schema %}[\s\S]*?{% endschema %}/g, "");
  html = html.replace(/{% comment %}[\s\S]*?{% endcomment %}/g, "");

  // Convert Shopify style and javascript blocks to HTML tags so CSS and JS are parsed by browser
  html = html.replace(/{%-?\s*style\s*-?%}/g, "<style>");
  html = html.replace(/{%-?\s*endstyle\s*-?%}/g, "</style>");
  html = html.replace(/{%-?\s*javascript\s*-?%}/g, "<script>");
  html = html.replace(/{%-?\s*endjavascript\s*-?%}/g, "</script>");

  // Translation filter {{ 'products.product.add_to_cart' | t }}
  html = html.replace(/\{\{\s*['"]([^'"]+)['"]\s*\|\s*t\s*\}\}/g, (_m, key) => {
    const parts = key.split(".");
    const last = parts[parts.length - 1];
    return last.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
  });

  // 3. Extract and resolve all `assign` variables from `{%- liquid ... -%}` and `{% assign ... %}`
  const liquidBlockRegex = /{%-?\s*liquid([\s\S]*?)-?%}/g;
  let match: RegExpExecArray | null;
  while ((match = liquidBlockRegex.exec(html)) !== null) {
    const lines = match[1].split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      const assignMatch = trimmed.match(/^assign\s+([a-zA-Z0-9_.-]+)\s*=\s*(.*)$/);
      if (assignMatch) {
        const varName = assignMatch[1].trim();
        const expr = assignMatch[2].trim();

        const defaultMatch = expr.match(/\|\s*default:\s*['"]([^'"]+)['"]/);
        if (defaultMatch) {
          variables[varName] = defaultMatch[1];
        } else {
          const strMatch = expr.match(/^['"]([^'"]+)['"]$/);
          if (strMatch) {
            variables[varName] = strMatch[1];
          }
        }
      }
    }
  }

  // Remove liquid assignment blocks
  html = html.replace(/{%-?\s*liquid[\s\S]*?-?%}/g, "");
  html = html.replace(/{%-?\s*assign\s+[a-zA-Z0-9_.-]+\s*=[\s\S]*?-?%}/g, "");

  // 4. Resolve `{% for block in section.blocks %}` loops
  const forBlockRegex = /\{%-?\s*for\s+block\s+in\s+section\.blocks\s*-?%\}([\s\S]*?)\{%-?\s*endfor\s*-?%\}/g;
  html = html.replace(forBlockRegex, (_match, blockBody) => {
    const blocksOrder = seed?.block_order || [];
    const seedBlocks = seed?.blocks || {};
    
    // If presets defined blocks, loop through each
    if (blocksOrder.length > 0) {
      return blocksOrder.map((blockKey, bIdx) => {
        const b = seedBlocks[blockKey] || {};
        let renderedBlock = blockBody;
        renderedBlock = renderedBlock.replace(/\{\{\s*block\.id\s*\}\}/g, `b_${sectionIdx}_${bIdx}`);
        renderedBlock = renderedBlock.replace(/\{\{\s*forloop\.index\s*\}\}/g, String(bIdx + 1));
        
        // Replace block.settings
        const bSettings = b.settings || {};
        for (const [key, val] of Object.entries(bSettings)) {
          const bReg = new RegExp(`\\{\\{\\s*block\\.settings\\.${key}\\s*(\\|[^}]+)?\\s*\\}\\}`, "g");
          renderedBlock = renderedBlock.replace(bReg, String(val));
        }

        // Schema block defaults fallback
        if (schema?.blocks && Array.isArray(schema.blocks)) {
          const decl = schema.blocks.find((x: any) => x.type === b.type);
          if (decl?.settings && Array.isArray(decl.settings)) {
            for (const s of decl.settings) {
              if (s?.id && s?.default !== undefined) {
                const bReg = new RegExp(`\\{\\{\\s*block\\.settings\\.${s.id}\\s*(\\|[^}]+)?\\s*\\}\\}`, "g");
                renderedBlock = renderedBlock.replace(bReg, String(s.default));
              }
            }
          }
        }

        return renderedBlock;
      }).join("\n");
    }

    // If no preset blocks, render 3 demo iterations
    return [0, 1, 2].map(bIdx => {
      let renderedBlock = blockBody;
      renderedBlock = renderedBlock.replace(/\{\{\s*block\.id\s*\}\}/g, `b_${sectionIdx}_${bIdx}`);
      renderedBlock = renderedBlock.replace(/\{\{\s*forloop\.index\s*\}\}/g, String(bIdx + 1));
      return renderedBlock;
    }).join("\n");
  });

  // 5. Resolve `{% for product in ... %}` loops with demo products
  const forProductRegex = /\{%-?\s*for\s+product\s+in\s+[^%]+-?%\}([\s\S]*?)\{%-?\s*endfor\s*-?%\}/g;
  html = html.replace(forProductRegex, (_match, pBody) => {
    const demoProducts = [
      { title: "Signature Core Drop V1", price: "$68.00", compare: "$98.00", img: DEMO_IMAGES[0] },
      { title: "Active Thermal Oversized Pullover", price: "$84.00", compare: "$120.00", img: DEMO_IMAGES[1] },
      { title: "Modular Utility Cargo Edition", price: "$110.00", compare: "$145.00", img: DEMO_IMAGES[2] },
      { title: "Essential Heavyweight Relaxed Tee", price: "$42.00", compare: "$60.00", img: DEMO_IMAGES[3] },
    ];
    return demoProducts.map((p, idx) => {
      let item = pBody;
      item = item.replace(/\{\{\s*product\.title\s*(\|[^\}]*)?\}\}/g, p.title);
      item = item.replace(/\{\{\s*product\.price\s*\|\s*money[^\}]*\}\}/g, p.price);
      item = item.replace(/\{\{\s*product\.compare_at_price\s*\|\s*money[^\}]*\}\}/g, p.compare);
      item = item.replace(/\{\{\s*product\.featured_image[^\}]*\}\}/g, p.img);
      item = item.replace(/\{\{\s*forloop\.index\s*\}\}/g, String(idx + 1));
      return item;
    }).join("\n");
  });

  // 6. Resolve conditionals like {%- if ... -%} ... {%- else -%} ... {%- endif -%}
  html = html.replace(/{%-?\s*if\s+[^%]+\s*-?%}([\s\S]*?)(?:{%-?\s*else\s*-?%}[\s\S]*?)?{%-?\s*endif\s*-?%}/g, "$1");
  html = html.replace(/{%-?\s*unless\s+[^%]+\s*-?%}([\s\S]*?){%-?\s*endunless\s*-?%}/g, "$1");

  // 7. Replace {{ variable }} using our resolved variables map
  for (const [vName, vVal] of Object.entries(variables)) {
    if (!vVal) continue;
    const escapedName = vName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const vRegex = new RegExp(`\\{\\{\\s*${escapedName}\\s*(\\|[^}]+)?\\s*\\}\\}`, "g");
    html = html.replace(vRegex, vVal);
  }

  // 8. Replace standard default filters: {{ ... | default: 'val' }}
  html = html.replace(/\{\{\s*[^|}]+\|\s*default:\s*"([^"]+)"\s*\}\}/g, "$1");
  html = html.replace(/\{\{\s*[^|}]+\|\s*default:\s*'([^']+)'\s*\}\}/g, "$1");

  // 9. Dates
  html = html.replace(/\{\{\s*'now'\s*\|\s*date:\s*['"]%Y['"]\s*\}\}/g, new Date().getFullYear().toString());

  // 10. Replace images & assets
  html = html.replace(/\{\{\s*[^|}]+\|\s*image_url[^}]*\}\}/g, (_match) => {
    return DEMO_IMAGES[sectionIdx % DEMO_IMAGES.length];
  });
  html = html.replace(/\{\{\s*[^|}]+\|\s*asset_url[^}]*\}\}/g, "");

  // 11. Clean remaining {{ ... }} tags with fallback
  html = html.replace(/\{\{\s*([a-zA-Z0-9_.-]+)(\s*\|[^\}]*)?\s*\}\}/g, (_full, key) => {
    return variables[key] || "";
  });

  // 12. Strip leftover liquid tags (including unhandled for/endfor/render)
  html = html.replace(/{%-?[\s\S]*?-?%}/g, "");

  return html.trim();
}

function wrapHtmlDocument(title: string, bodyContent: string, extraCss: string = "", extraJs: string = "", isEmbed: boolean = false): string {
  const baseCss = getBaseCss();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} · Store Preview Studio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;700;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
      background: #ffffff;
      color: #111827;
    }
    img { max-width: 100%; height: auto; display: block; }
    button, a { cursor: pointer; }
    ${isEmbed ? `body { overflow: hidden !important; }` : `
    .preview-header-bar {
      position: sticky;
      top: 0;
      z-index: 99999;
      background: #0f172a;
      color: #f8fafc;
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: system-ui, -apple-system, sans-serif;
      box-shadow: 0 2px 10px rgba(0,0,0,0.15);
    }
    .preview-badge {
      background: #0284c7;
      color: #ffffff;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 4px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-left: 8px;
    }
    `}
    ${baseCss}
    ${extraCss}
  </style>
</head>
<body>
  ${!isEmbed ? `
  <header class="preview-header-bar">
    <div style="display:flex; align-items:center; gap:8px;">
      <span style="font-weight:800; font-size:14px; letter-spacing:-0.3px;">Converflow Preview Studio</span>
      <span class="preview-badge">Live Simulation</span>
    </div>
    <div style="font-size:12px; color:#94a3b8; font-weight:500;">
      Viewing: <strong style="color:#ffffff;">${title}</strong>
    </div>
  </header>` : ""}
  <main>
    ${bodyContent}
  </main>
  ${extraJs ? `<script>${extraJs}</script>` : ""}
  <script>
    // Universal accordion & FAQ toggle helper
    document.addEventListener("DOMContentLoaded", () => {
      document.querySelectorAll(".faq-item, .accordion-item, [data-accordion]").forEach(item => {
        item.addEventListener("click", () => {
          item.classList.toggle("is-active");
          item.classList.toggle("open");
        });
      });
    });
  </script>
</body>
</html>`;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const id = url.searchParams.get("id") || url.searchParams.get("pageId") || "";
  const sectionId = url.searchParams.get("sectionId") || "";
  const isEmbed = url.searchParams.get("embed") === "1";

  // ── 1. Single Section Preview (from Section Store) ────────────────────────
  if (sectionId) {
    const resolution = await resolveSections([sectionId]);
    if (resolution.resolved.length) {
      const sec = resolution.resolved[0];
      const cleaned = cleanLiquid(sec.source, 1);
      const bundle = await bundleFor(resolution.resolved);
      const extraCss = Object.entries(bundle.files)
        .filter(([k]) => k.endsWith(".css"))
        .map(([, v]) => v)
        .join("\n");
      const extraJs = Object.entries(bundle.files)
        .filter(([k]) => k.endsWith(".js"))
        .map(([, v]) => v)
        .join("\n");

      const body = `<div style="max-width:1440px; margin:0 auto; padding:${isEmbed ? '0' : '40px 20px'};">${cleaned}</div>`;
      const html = wrapHtmlDocument(`Section: ${sectionId}`, body, extraCss, extraJs, isEmbed);
      return new Response(html, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "X-Frame-Options": "ALLOWALL",
          "Content-Security-Policy": "frame-ancestors *",
          "Cache-Control": "public, max-age=60",
        },
      });
    }
  }

  // ── 2. Direct Template HTML Match ─────────────────────────────────────────
  if (id && (TEMPLATE_HTMLS as any)[id]) {
    return new Response((TEMPLATE_HTMLS as any)[id], {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Frame-Options": "ALLOWALL",
        "Cache-Control": "public, max-age=60",
      },
    });
  }

  // ── 3. Resolve Target Page Definition ─────────────────────────────────────
  let wantedSections: string[] = [];
  let pageTitle = "Store Preview";
  let customPaletteCss = "";

  const matchedLanding = id ? getLandingPageById(id) : null;
  const matchedPage = (!matchedLanding && id) ? (pageById(id) || ALL_PAGES.find(p => p.id === id)) : null;
  const matchedComp = (!matchedLanding && !matchedPage && id) ? COMPOSITIONS.find(c => c.id === id) : null;
  const matchedTmpl = (!matchedLanding && !matchedPage && !matchedComp && id) ? STORE_PAGE_TEMPLATES.find(t => t.id === id) : null;

  if (matchedLanding) {
    pageTitle = matchedLanding.name;
    wantedSections = [
      ...(matchedLanding.announcement ? [matchedLanding.announcement] : []),
      ...(matchedLanding.header ? [matchedLanding.header] : []),
      ...matchedLanding.sections.map(s => s.componentId),
      ...(matchedLanding.footer ? [matchedLanding.footer] : []),
    ];
    customPaletteCss = `
      :root {
        --color-background: ${matchedLanding.palette.background};
        --color-text: ${matchedLanding.palette.text};
        --color-primary: ${matchedLanding.palette.primary};
        --color-accent: ${matchedLanding.palette.accent};
        --brand-primary: ${matchedLanding.palette.primary};
        --brand-accent: ${matchedLanding.palette.accent};
      }
      body {
        background-color: ${matchedLanding.palette.background} !important;
        color: ${matchedLanding.palette.text} !important;
      }
    `;
  } else if (matchedPage) {
    pageTitle = matchedPage.name;
    wantedSections = [
      ...(matchedPage.announcement ? [matchedPage.announcement] : []),
      ...(matchedPage.header ? [matchedPage.header] : []),
      ...matchedPage.sections,
      ...(matchedPage.footer ? [matchedPage.footer] : []),
    ];
  } else if (matchedComp) {
    pageTitle = matchedComp.name;
    wantedSections = [
      ...(matchedComp.announcement ? [matchedComp.announcement] : []),
      ...(matchedComp.header ? [matchedComp.header] : []),
      ...matchedComp.sections.map(s => s.componentId),
      ...(matchedComp.footer ? [matchedComp.footer] : []),
    ];
  } else if (matchedTmpl) {
    pageTitle = matchedTmpl.name;
    wantedSections = [
      ...(matchedTmpl.announcement ? [matchedTmpl.announcement] : []),
      ...(matchedTmpl.header ? [matchedTmpl.header] : []),
      ...matchedTmpl.sections.map((s: any) => s.componentId || s),
      ...(matchedTmpl.footer ? [matchedTmpl.footer] : []),
    ];
  } else {
    // Graceful fallback: default to first PageKit page
    const fallback = ALL_PAGES[0];
    pageTitle = fallback?.name || "Homepage Design";
    wantedSections = fallback ? [
      ...(fallback.announcement ? [fallback.announcement] : []),
      ...(fallback.header ? [fallback.header] : []),
      ...fallback.sections,
      ...(fallback.footer ? [fallback.footer] : []),
    ] : [];
  }

  if (wantedSections.length > 0) {
    const resolution = await resolveSections(wantedSections);
    if (resolution.resolved.length) {
      const bundle = await bundleFor(resolution.resolved);
      const extraCss = Object.entries(bundle.files)
        .filter(([k]) => k.endsWith(".css"))
        .map(([, v]) => v)
        .join("\n") + "\n" + customPaletteCss;
      const extraJs = Object.entries(bundle.files)
        .filter(([k]) => k.endsWith(".js"))
        .map(([, v]) => v)
        .join("\n");

      let bodyHtml = "";
      resolution.resolved.forEach((sec, idx) => {
        bodyHtml += `\n<!-- SECTION ${idx + 1}: ${sec.id} -->\n` + cleanLiquid(sec.source, idx + 1) + "\n";
      });

      const html = wrapHtmlDocument(pageTitle, bodyHtml, extraCss, extraJs, isEmbed);
      return new Response(html, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "X-Frame-Options": "ALLOWALL",
          "Content-Security-Policy": "frame-ancestors *",
          "Cache-Control": "public, max-age=60",
        },
      });
    }
  }

  return new Response("Preview not found", { status: 404 });
};

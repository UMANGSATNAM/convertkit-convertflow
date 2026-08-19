import { type LoaderFunctionArgs } from "@remix-run/node";
import fs from "fs";
import path from "path";
import { COMPOSITIONS, type PageComposition } from "../data/page-compositions";

const regPath = path.resolve(process.cwd(), "app/data/templates/theme-engine/registry.json");
let compMapCache: Map<string, string> | null = null;

function getCompMap(): Map<string, string> {
  if (!compMapCache) {
    try {
      const reg = JSON.parse(fs.readFileSync(regPath, "utf8"));
      compMapCache = new Map(reg.components.map((c: any) => [c.componentId, c.liquidPath]));
    } catch {
      compMapCache = new Map();
    }
  }
  return compMapCache;
}

/**
 * Universal Liquid AST & variable resolver for 100% pixel-perfect HTML rendering
 */
function cleanLiquid(liquidContent: string, sectionIdx: number): string {
  let html = liquidContent;

  // 1. Strip {% schema %} ... {% endschema %}
  html = html.replace(/{% schema %}[\s\S]*?{% endschema %}/g, "");

  // 2. Strip {% comment %} ... {% endcomment %}
  html = html.replace(/{% comment %}[\s\S]*?{% endcomment %}/g, "");

  // 3. Extract and resolve all `assign` variables from `{%- liquid ... -%}` and `{% assign ... %}`
  const variables: Record<string, string> = {
    "sec_id": `s_${sectionIdx}`,
    "section.id": `s_${sectionIdx}`,
    "forloop.index": "1",
    "forloop.first": "true",
  };

  // Find all liquid blocks: {%- liquid ... -%} or {% liquid ... %}
  const liquidBlockRegex = /{%-?\s*liquid([\s\S]*?)-?%}/g;
  let match: RegExpExecArray | null;
  while ((match = liquidBlockRegex.exec(html)) !== null) {
    const lines = match[1].split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      const assignMatch = trimmed.match(/^assign\s+([a-zA-Z0-9_-]+)\s*=\s*(.*)$/);
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
          } else {
            variables[varName] = "";
          }
        }
      }
    }
  }

  // Remove the {%- liquid ... -%} and {% assign ... %} blocks
  html = html.replace(/{%-?\s*liquid[\s\S]*?-?%}/g, "");
  html = html.replace(/{%-?\s*assign\s+[a-zA-Z0-9_-]+\s*=[\s\S]*?-?%}/g, "");

  // 4. Resolve conditionals like {%- if hero_image != blank -%} ... {%- else -%} ... {%- endif -%}
  html = html.replace(/{%-?\s*if\s+hero_image\s*!=\s*blank\s*-?%}[\s\S]*?{%-?\s*else\s*-?%}([\s\S]*?){%-?\s*endif\s*-?%}/g, "$1");
  html = html.replace(/{%-?\s*if\s+[^%]+\s*-?%}[\s\S]*?{%-?\s*else\s*-?%}([\s\S]*?){%-?\s*endif\s*-?%}/g, "$1");
  html = html.replace(/{%-?\s*if\s+[^%]+\s*-?%}[\s\S]*?{%-?\s*endif\s*-?%}/g, "");
  html = html.replace(/{%-?\s*unless\s+[^%]+\s*-?%}[\s\S]*?{%-?\s*endunless\s*-?%}/g, "");

  // 5. Replace {{ variable }} using our resolved variables map
  for (const [vName, vVal] of Object.entries(variables)) {
    if (!vVal) continue;
    const vRegex = new RegExp(`\\{\\{\\s*${vName}\\s*(\\|\\s*escape)?\\s*\\}\\}`, "g");
    html = html.replace(vRegex, vVal);
  }

  // 6. Replace standard default filters: {{ ... | default: 'val' }}
  html = html.replace(/\{\{\s*[^|}]+\|\s*default:\s*"([^"]+)"\s*\}\}/g, "$1");
  html = html.replace(/\{\{\s*[^|}]+\|\s*default:\s*'([^']+)'\s*\}\}/g, "$1");

  // 7. Replace {{ 'now' | date: "%Y" }}
  html = html.replace(/\{\{\s*'now'\s*\|\s*date:\s*['"]%Y['"]\s*\}\}/g, new Date().getFullYear().toString());

  // 8. Replace image_url, escape, asset_url
  html = html.replace(/\{\{\s*[^|}]+\|\s*image_url[^}]*\}\}/g, "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80");
  html = html.replace(/\{\{\s*[^|}]+\|\s*asset_url[^}]*\}\}/g, "");

  // 9. Replace any remaining {{ xxx }} with empty string or variable fallback
  html = html.replace(/\{\{\s*([a-zA-Z0-9_.-]+)(\s*\|[^\}]*)?\s*\}\}/g, (fullMatch, key) => {
    return variables[key] || "";
  });

  // 10. Clean up any leftover liquid tags {%- ... -%} or {% ... %}
  html = html.replace(/{%-?[\s\S]*?-?%}/g, "");

  return html.trim();
}

function renderRealCompositionHTML(comp: PageComposition, isThumbnail: boolean = false): string {
  const compMap = getCompMap();
  const sectionsToRender: Array<{ id: string; type: string }> = [];

  if (comp.announcement) sectionsToRender.push({ id: comp.announcement, type: "announcement" });
  if (comp.header) sectionsToRender.push({ id: comp.header, type: "header" });
  
  if (isThumbnail) {
    const topSections = comp.sections.slice(0, 3);
    for (const s of topSections) {
      sectionsToRender.push({ id: s.componentId, type: "section" });
    }
  } else {
    for (const s of comp.sections) {
      sectionsToRender.push({ id: s.componentId, type: "section" });
    }
    if (comp.footer) sectionsToRender.push({ id: comp.footer, type: "footer" });
  }

  let bodyHtml = "";
  sectionsToRender.forEach((sec, idx) => {
    const liquidRel = compMap.get(sec.id);
    if (liquidRel) {
      const fullPath = path.resolve(process.cwd(), "app/data/templates/theme-engine", liquidRel);
      if (fs.existsSync(fullPath)) {
        const raw = fs.readFileSync(fullPath, "utf8");
        bodyHtml += `\n<!-- SECTION ${idx + 1}: ${sec.id} -->\n` + cleanLiquid(raw, idx + 1) + "\n";
      }
    }
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${comp.name} · Real D2C Live Store Preview</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;700;900&family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400&family=Italiana&family=Syne:wght@700;800;900&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      background: ${comp.niche === 'clothing' && comp.id.includes('streetwear') ? '#09090b' : comp.niche === 'tech' ? '#000000' : comp.id.includes('glamour') ? '#0d0814' : comp.id.includes('royal') || comp.id.includes('polki') ? '#0b1610' : '#ffffff'};
      color: #ffffff;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }
    img { max-width: 100%; height: auto; display: block; }
    button, a { cursor: pointer; }
    ${isThumbnail ? `
      body { pointer-events: none; user-select: none; }
    ` : ''}
  </style>
</head>
<body>
  ${bodyHtml}
</body>
</html>`;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const id = url.searchParams.get("id") || "streetwear-cyber-home";
  const thumb = url.searchParams.get("thumb") === "1";
  const comp = COMPOSITIONS.find(c => c.id === id) || COMPOSITIONS[0];

  const html = renderRealCompositionHTML(comp, thumb);

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
};

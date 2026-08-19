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

function cleanLiquid(liquidContent: string, sectionIdx: number): string {
  // Strip {% schema %} ... {% endschema %}
  let html = liquidContent.replace(/{% schema %}[\s\S]*?{% endschema %}/g, "");

  // Strip comments
  html = html.replace(/{% comment %}[\s\S]*?{% endcomment %}/g, "");

  // Replace section.id
  html = html.replace(/section\.id/g, `s_${sectionIdx}`);

  // Replace {{ section.settings.xxx | default: "yyy" }} with yyy
  html = html.replace(/\{\{\s*section\.settings\.\w+\s*\|\s*default:\s*"([^"]+)"\s*\}\}/g, "$1");
  html = html.replace(/\{\{\s*section\.settings\.\w+\s*\|\s*default:\s*'([^']+)'\s*\}\}/g, "$1");

  // Replace {{ 'now' | date: '%Y' }} with current year
  html = html.replace(/\{\{\s*'now'\s*\|\s*date:\s*'%Y'\s*\}\}/g, new Date().getFullYear().toString());

  // Replace shop.name with default or brand
  html = html.replace(/\{\{\s*shop\.name\s*\|\s*default:\s*"([^"]+)"\s*\}\}/g, "$1");
  html = html.replace(/\{\{\s*shop\.name\s*\}\}/g, "D2C Store");

  // Replace cart.item_count
  html = html.replace(/\{\{\s*cart\.item_count\s*\|\s*default:\s*0\s*\}\}/g, "0");

  return html.trim();
}

function renderRealCompositionHTML(comp: PageComposition, isThumbnail: boolean = false): string {
  const compMap = getCompMap();
  const sectionsToRender: Array<{ id: string; type: string }> = [];

  if (comp.announcement) sectionsToRender.push({ id: comp.announcement, type: "announcement" });
  if (comp.header) sectionsToRender.push({ id: comp.header, type: "header" });
  
  if (isThumbnail) {
    // For thumbnail, render top 3 sections (announcement, header, hero, marquee) to keep payload light and fast
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
      "Cache-Control": "public, max-age=3600",
    },
  });
};

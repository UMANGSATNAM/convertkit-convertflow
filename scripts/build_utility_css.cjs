#!/usr/bin/env node
/**
 * Generates the utility stylesheet the section library assumes exists.
 *
 * ## The bug
 *
 * 20 sections are written entirely in Tailwind utility classes — `flex`,
 * `max-w-6xl`, `py-12`, `md:flex-row`, `bg-[var(--color-text)]` — and ship no
 * CSS of their own. The theme has never included Tailwind, in any form: no
 * asset, no CDN link in the layout. Every one of those classes is inert, so
 * those sections render as raw stacked text with no layout, spacing or colour.
 *
 * `banner-countdown-luxury-v1` is the one that showed up above the header
 * reading "Flash Sale Ends Soon! / Offer Expired / Claim Offer" in plain black
 * on white. But `grid-luxury-v1` — the homepage featured collection —
 * `footer-luxury-v1`, all five `brand-story-*` and both popups are in the same
 * state.
 *
 * ## The approach
 *
 * Rather than rewrite twenty sections by hand, or pull in the whole Tailwind
 * framework, this scans the library for the utility classes actually used and
 * emits CSS for exactly those. The output is small, has no build step, and
 * covers the 195 sections that mix utility classes with their own CSS too.
 *
 * Arbitrary values (`bg-[var(--color-text)]`, `min-w-[70px]`) are read straight
 * out of the markup, so a section referencing a palette variable keeps working
 * with whatever palette the engine applied.
 *
 * Usage: node scripts/build_utility_css.cjs [--dry]
 */

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const ENGINE = path.join(ROOT, "app/data/templates/theme-engine");
const PERI = path.join(ROOT, "dev-theme-peri");
const DRY = process.argv.includes("--dry");

// ── Collect every class token in the library ───────────────────────────────
function collectClasses() {
  const files = [];
  const walk = dir => {
    if (!fs.existsSync(dir)) return;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith(".liquid")) files.push(p);
    }
  };
  walk(path.join(ENGINE, "components"));
  walk(path.join(ENGINE, "base-theme/sections"));
  walk(path.join(ENGINE, "base-theme/snippets"));

  const tokens = new Set();
  for (const f of files) {
    const src = fs.readFileSync(f, "utf-8");
    for (const m of src.matchAll(/class="([^"]*)"/g)) {
      // Liquid inside a class attribute is not a static class name.
      for (const t of m[1].split(/\s+/)) {
        if (!t || t.includes("{{") || t.includes("{%")) continue;
        tokens.add(t);
      }
    }
  }
  return tokens;
}

// ── Scales ─────────────────────────────────────────────────────────────────
const SPACE = { 0: "0", 0.5: "0.125rem", 1: "0.25rem", 1.5: "0.375rem", 2: "0.5rem", 2.5: "0.625rem", 3: "0.75rem", 3.5: "0.875rem", 4: "1rem", 5: "1.25rem", 6: "1.5rem", 7: "1.75rem", 8: "2rem", 9: "2.25rem", 10: "2.5rem", 11: "2.75rem", 12: "3rem", 14: "3.5rem", 16: "4rem", 20: "5rem", 24: "6rem", 28: "7rem", 32: "8rem", 36: "9rem", 40: "10rem", 48: "12rem", 56: "14rem", 64: "16rem" };
const TEXT = { xs: ["0.75rem", "1rem"], sm: ["0.875rem", "1.25rem"], base: ["1rem", "1.5rem"], lg: ["1.125rem", "1.75rem"], xl: ["1.25rem", "1.75rem"], "2xl": ["1.5rem", "2rem"], "3xl": ["1.875rem", "2.25rem"], "4xl": ["2.25rem", "2.5rem"], "5xl": ["3rem", "1"], "6xl": ["3.75rem", "1"], "7xl": ["4.5rem", "1"], "8xl": ["6rem", "1"], "9xl": ["8rem", "1"] };
const WEIGHT = { thin: 100, extralight: 200, light: 300, normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800, black: 900 };
const MAXW = { xs: "20rem", sm: "24rem", md: "28rem", lg: "32rem", xl: "36rem", "2xl": "42rem", "3xl": "48rem", "4xl": "56rem", "5xl": "64rem", "6xl": "72rem", "7xl": "80rem", full: "100%", none: "none", prose: "65ch", screen: "100vw" };
const ROUND = { none: "0", sm: "0.125rem", "": "0.25rem", md: "0.375rem", lg: "0.5rem", xl: "0.75rem", "2xl": "1rem", "3xl": "1.5rem", full: "9999px" };
const TRACK = { tighter: "-0.05em", tight: "-0.025em", normal: "0", wide: "0.025em", wider: "0.05em", widest: "0.1em" };
const LEAD = { none: "1", tight: "1.25", snug: "1.375", normal: "1.5", relaxed: "1.625", loose: "2" };

const STATIC = {
  block: "display:block", "inline-block": "display:inline-block", inline: "display:inline",
  flex: "display:flex", "inline-flex": "display:inline-flex", grid: "display:grid",
  "inline-grid": "display:inline-grid", hidden: "display:none", contents: "display:contents",
  "flex-row": "flex-direction:row", "flex-col": "flex-direction:column",
  "flex-wrap": "flex-wrap:wrap", "flex-nowrap": "flex-wrap:nowrap",
  "flex-1": "flex:1 1 0%", "flex-auto": "flex:1 1 auto", "flex-none": "flex:none",
  "flex-shrink-0": "flex-shrink:0", "shrink-0": "flex-shrink:0", "flex-grow": "flex-grow:1", grow: "flex-grow:1",
  "items-start": "align-items:flex-start", "items-center": "align-items:center",
  "items-end": "align-items:flex-end", "items-stretch": "align-items:stretch", "items-baseline": "align-items:baseline",
  "justify-start": "justify-content:flex-start", "justify-center": "justify-content:center",
  "justify-end": "justify-content:flex-end", "justify-between": "justify-content:space-between",
  "justify-around": "justify-content:space-around", "justify-evenly": "justify-content:space-evenly",
  "self-start": "align-self:flex-start", "self-center": "align-self:center", "self-end": "align-self:flex-end",
  "text-left": "text-align:left", "text-center": "text-align:center", "text-right": "text-align:right",
  "text-justify": "text-align:justify",
  uppercase: "text-transform:uppercase", lowercase: "text-transform:lowercase",
  capitalize: "text-transform:capitalize", "normal-case": "text-transform:none",
  italic: "font-style:italic", "not-italic": "font-style:normal",
  underline: "text-decoration-line:underline", "line-through": "text-decoration-line:line-through",
  "no-underline": "text-decoration-line:none",
  relative: "position:relative", absolute: "position:absolute", fixed: "position:fixed",
  sticky: "position:sticky", static: "position:static",
  "mx-auto": "margin-left:auto;margin-right:auto", "ml-auto": "margin-left:auto", "mr-auto": "margin-right:auto",
  "w-full": "width:100%", "w-screen": "width:100vw", "w-auto": "width:auto", "w-fit": "width:fit-content",
  "h-full": "height:100%", "h-screen": "height:100vh", "h-auto": "height:auto", "h-fit": "height:fit-content",
  "min-h-screen": "min-height:100vh", "min-w-0": "min-width:0",
  "overflow-hidden": "overflow:hidden", "overflow-auto": "overflow:auto",
  "overflow-x-auto": "overflow-x:auto", "overflow-y-auto": "overflow-y:auto",
  "object-cover": "object-fit:cover", "object-contain": "object-fit:contain",
  "cursor-pointer": "cursor:pointer", "select-none": "user-select:none",
  "pointer-events-none": "pointer-events:none", "pointer-events-auto": "pointer-events:auto",
  "whitespace-nowrap": "white-space:nowrap", "break-words": "overflow-wrap:break-word",
  "border-0": "border-width:0", border: "border-width:1px;border-style:solid",
  "border-t": "border-top-width:1px;border-top-style:solid",
  "border-b": "border-bottom-width:1px;border-bottom-style:solid",
  "border-l": "border-left-width:1px;border-left-style:solid",
  "border-r": "border-right-width:1px;border-right-style:solid",
  "sr-only": "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0",
  "aspect-square": "aspect-ratio:1/1", "aspect-video": "aspect-ratio:16/9",
  "transition-all": "transition-property:all;transition-duration:200ms;transition-timing-function:cubic-bezier(0.4,0,0.2,1)",
  transition: "transition-property:color,background-color,border-color,opacity,transform;transition-duration:200ms;transition-timing-function:cubic-bezier(0.4,0,0.2,1)",
  "transition-colors": "transition-property:color,background-color,border-color,fill,stroke;transition-duration:200ms;transition-timing-function:cubic-bezier(0.4,0,0.2,1)",
  "transition-transform": "transition-property:transform;transition-duration:200ms;transition-timing-function:cubic-bezier(0.4,0,0.2,1)",
  "transition-opacity": "transition-property:opacity;transition-duration:200ms;transition-timing-function:cubic-bezier(0.4,0,0.2,1)",
};

function esc(cls) {
  return cls.replace(/([.:[\]()/#%,])/g, "\\$1");
}

/** Turns one class token into a CSS declaration body, or null if unrecognised. */
function declFor(t) {
  if (STATIC[t]) return STATIC[t];

  let m;

  // Arbitrary values: bg-[var(--color-text)], min-w-[70px], text-[#fff]
  if ((m = t.match(/^(bg|text|border|fill|stroke)-\[([^\]]+)\]$/))) {
    const val = m[2].replace(/_/g, " ");
    const prop = { bg: "background-color", text: "color", border: "border-color", fill: "fill", stroke: "stroke" }[m[1]];
    return `${prop}:${val}`;
  }
  if ((m = t.match(/^(w|h|min-w|max-w|min-h|max-h)-\[([^\]]+)\]$/))) {
    const prop = { w: "width", h: "height", "min-w": "min-width", "max-w": "max-width", "min-h": "min-height", "max-h": "max-height" }[m[1]];
    return `${prop}:${m[2].replace(/_/g, " ")}`;
  }
  if ((m = t.match(/^(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap)-\[([^\]]+)\]$/))) {
    return spacing(m[1], m[2].replace(/_/g, " "));
  }

  // Opacity-suffixed arbitrary colour: bg-[var(--x)]/10
  if ((m = t.match(/^bg-\[([^\]]+)\]\/(\d+)$/))) {
    return `background-color:color-mix(in srgb, ${m[1].replace(/_/g, " ")} ${m[2]}%, transparent)`;
  }

  if ((m = t.match(/^(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|space-x|space-y)-(\d+(?:\.\d+)?)$/))) {
    const v = SPACE[m[2]];
    return v === undefined ? null : spacing(m[1], v);
  }

  if ((m = t.match(/^text-(xs|sm|base|lg|xl|\dxl)$/))) {
    const s = TEXT[m[1]];
    return s ? `font-size:${s[0]};line-height:${s[1]}` : null;
  }
  if ((m = t.match(/^font-(\w+)$/)) && WEIGHT[m[1]] !== undefined) return `font-weight:${WEIGHT[m[1]]}`;
  if ((m = t.match(/^max-w-(\w+)$/)) && MAXW[m[1]]) return `max-width:${MAXW[m[1]]}`;
  if ((m = t.match(/^rounded(?:-(\w+))?$/)) && ROUND[m[1] || ""] !== undefined) return `border-radius:${ROUND[m[1] || ""]}`;
  if ((m = t.match(/^tracking-(\w+)$/)) && TRACK[m[1]]) return `letter-spacing:${TRACK[m[1]]}`;
  if ((m = t.match(/^leading-(\w+)$/)) && LEAD[m[1]]) return `line-height:${LEAD[m[1]]}`;
  if ((m = t.match(/^opacity-(\d+)$/))) return `opacity:${Number(m[1]) / 100}`;
  if ((m = t.match(/^z-(\d+)$/))) return `z-index:${m[1]}`;
  if ((m = t.match(/^grid-cols-(\d+)$/))) return `grid-template-columns:repeat(${m[1]},minmax(0,1fr))`;
  if ((m = t.match(/^col-span-(\d+)$/))) return `grid-column:span ${m[1]}/span ${m[1]}`;
  if ((m = t.match(/^(top|bottom|left|right|inset)-0$/))) {
    return m[1] === "inset" ? "top:0;right:0;bottom:0;left:0" : `${m[1]}:0`;
  }
  if ((m = t.match(/^w-(\d+)\/(\d+)$/))) return `width:${((+m[1] / +m[2]) * 100).toFixed(4)}%`;

  // Numeric width/height on the spacing scale: h-5, w-12, size-6.
  if ((m = t.match(/^(w|h|min-w|min-h|max-h)-(\d+(?:\.\d+)?)$/))) {
    const v = SPACE[m[2]];
    const prop = { w: "width", h: "height", "min-w": "min-width", "min-h": "min-height", "max-h": "max-height" }[m[1]];
    return v === undefined ? null : `${prop}:${v}`;
  }

  // Tailwind's neutral ramp, which several sections reference by name.
  if ((m = t.match(/^(bg|text|border)-(neutral|gray|slate|zinc|stone)-(\d{2,3})$/))) {
    const ramp = { 50: "#fafafa", 100: "#f5f5f5", 200: "#e5e5e5", 300: "#d4d4d4", 400: "#a3a3a3", 500: "#737373", 600: "#525252", 700: "#404040", 800: "#262626", 900: "#171717", 950: "#0a0a0a" };
    const hex = ramp[m[3]];
    if (!hex) return null;
    const prop = { bg: "background-color", text: "color", border: "border-color" }[m[1]];
    return `${prop}:${hex}`;
  }
  if (t === "bg-black") return "background-color:#000";
  if (t === "bg-white") return "background-color:#fff";
  if (t === "text-black") return "color:#000";
  if (t === "text-white") return "color:#fff";
  if (t === "border-black") return "border-color:#000";
  if (t === "border-white") return "border-color:#fff";
  if (t === "border-transparent") return "border-color:transparent";

  return null;
}

function spacing(prefix, v) {
  switch (prefix) {
    case "p": return `padding:${v}`;
    case "px": return `padding-left:${v};padding-right:${v}`;
    case "py": return `padding-top:${v};padding-bottom:${v}`;
    case "pt": return `padding-top:${v}`;
    case "pb": return `padding-bottom:${v}`;
    case "pl": return `padding-left:${v}`;
    case "pr": return `padding-right:${v}`;
    case "m": return `margin:${v}`;
    case "mx": return `margin-left:${v};margin-right:${v}`;
    case "my": return `margin-top:${v};margin-bottom:${v}`;
    case "mt": return `margin-top:${v}`;
    case "mb": return `margin-bottom:${v}`;
    case "ml": return `margin-left:${v}`;
    case "mr": return `margin-right:${v}`;
    case "gap": return `gap:${v}`;
    case "gap-x": return `column-gap:${v}`;
    case "gap-y": return `row-gap:${v}`;
    case "space-x": return null;
    case "space-y": return null;
    default: return null;
  }
}

// ── Build ──────────────────────────────────────────────────────────────────
const BREAKPOINTS = { sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1536px" };

const tokens = collectClasses();
const base = [];
const responsive = { sm: [], md: [], lg: [], xl: [], "2xl": [] };
const states = [];
let matched = 0;
const unmatched = new Set();

for (const token of [...tokens].sort()) {
  const bp = token.match(/^(sm|md|lg|xl|2xl):(.+)$/);
  const state = token.match(/^(hover|focus|focus-visible|active|group-hover):(.+)$/);

  if (bp) {
    const decl = declFor(bp[2]);
    if (!decl) { unmatched.add(token); continue; }
    responsive[bp[1]].push(`.${esc(token)}{${decl}}`);
    matched++;
  } else if (state) {
    const decl = declFor(state[2]);
    if (!decl) { unmatched.add(token); continue; }
    const sel = state[1] === "group-hover" ? `.group:hover .${esc(token)}` : `.${esc(token)}:${state[1].replace("focus-visible", "focus-visible")}`;
    states.push(`${sel}{${decl}}`);
    matched++;
  } else {
    const decl = declFor(token);
    if (!decl) { unmatched.add(token); continue; }
    base.push(`.${esc(token)}{${decl}}`);
    matched++;
  }
}

let css = `/* Utility styles for the section library.
 *
 * Generated by scripts/build_utility_css.cjs from the classes actually used in
 * the sections — not the full Tailwind framework.
 *
 * 20 sections in this library are written entirely in Tailwind utility classes
 * and ship no CSS of their own, while the theme has never included Tailwind in
 * any form. Those sections rendered as unstyled stacked text: the countdown
 * banner sat above the header in plain black on white, and the luxury product
 * grid, all five brand-story layouts and both popups were in the same state.
 *
 * Regenerate after adding sections that use utility classes.
 */

`;
css += base.join("\n") + "\n\n/* states */\n" + states.join("\n") + "\n";
for (const [bp, px] of Object.entries(BREAKPOINTS)) {
  if (!responsive[bp].length) continue;
  css += `\n@media (min-width:${px}){\n${responsive[bp].join("\n")}\n}\n`;
}

const outputs = [
  path.join(ENGINE, "base-theme/assets/utility.css"),
  path.join(PERI, "assets/utility.css"),
];

console.log(`class tokens found : ${tokens.size}`);
console.log(`  generated rules  : ${matched}`);
console.log(`  not utilities    : ${unmatched.size} (component class names, ignored)`);
console.log(`  stylesheet size  : ${(css.length / 1024).toFixed(1)} kb`);

if (DRY) {
  console.log("\n--dry: nothing written. Sample:");
  console.log(base.slice(0, 8).join("\n"));
  process.exit(0);
}

for (const out of outputs) {
  if (!fs.existsSync(path.dirname(out))) continue;
  fs.writeFileSync(out, css);
  console.log(`  wrote ${path.relative(ROOT, out)}`);
}

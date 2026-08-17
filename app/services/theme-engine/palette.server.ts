/**
 * Store palette — one colour system for the whole store.
 *
 * ## The problem this solves
 *
 * Every section in the library ships its own colour defaults in its schema:
 * `bg_color`, `text_color`, `accent_color`, `card_bg`, `btn_bg` and 131 other
 * ids across 4,268 individual colour settings. A hero defaulting to cream, a
 * product grid defaulting to white and a footer defaulting to forest green are
 * each fine on their own, but stacked into one store they read as three
 * different brands.
 *
 * Locking the style *family* (see retrieval.server.ts) fixes typography and
 * proportion. It does not fix colour, because two sections in the same family
 * still carry whatever hex values their author happened to pick.
 *
 * ## What this does
 *
 * After the templates and section group files are assembled, every colour
 * setting on every section — and on every block inside those sections — is
 * rewritten to a value from a single store palette. The mapping is by role, not
 * by literal id: `card_bg`, `pill_bg` and `tile_bg` all mean "surface", so they
 * all receive the palette's surface colour.
 *
 * ## Why sections are not all flattened to one background
 *
 * A store where every band is the same white is not "coherent", it is flat.
 * Designers alternate light and dark bands deliberately. So each section keeps
 * its *intent*: if its own default background was dark, it receives the
 * palette's dark set; if light, the light set. Both sets are derived from the
 * same brand colours, so the rhythm survives while the palette stays single.
 *
 * ## Contrast
 *
 * Whatever the mapping produces, body text is checked against its background at
 * 4.5:1 and heading-scale text at 3:1. Anything failing is replaced with the
 * palette's guaranteed on-colour for that background. A section is never
 * shipped with text that cannot be read.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Colour maths
// ─────────────────────────────────────────────────────────────────────────────

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

/** Parses #rgb, #rrggbb, #rrggbbaa and rgb()/rgba(). Returns null when unparseable. */
export function parseColor(input: unknown): Rgb | null {
  if (typeof input !== "string") return null;
  const value = input.trim().toLowerCase();
  if (!value) return null;

  const hex = value.match(/^#?([0-9a-f]{3,8})$/);
  if (hex) {
    let h = hex[1];
    if (h.length === 3 || h.length === 4) {
      h = h
        .slice(0, 3)
        .split("")
        .map((c) => c + c)
        .join("");
    }
    if (h.length === 8) h = h.slice(0, 6);
    if (h.length !== 6) return null;
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
    };
  }

  const fn = value.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/);
  if (fn) {
    const r = Number(fn[1]);
    const g = Number(fn[2]);
    const b = Number(fn[3]);
    if ([r, g, b].some((n) => !Number.isFinite(n))) return null;
    return { r: clamp255(r), g: clamp255(g), b: clamp255(b) };
  }

  return null;
}

function clamp255(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}

export function toHex({ r, g, b }: Rgb): string {
  const h = (n: number) => clamp255(n).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

/** WCAG relative luminance. 0 = black, 1 = white. */
export function luminance(c: Rgb): number {
  const channel = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(c.r) + 0.7152 * channel(c.g) + 0.0722 * channel(c.b);
}

/** WCAG contrast ratio between two colours. 1 = identical, 21 = black on white. */
export function contrast(a: Rgb, b: Rgb): number {
  const la = luminance(a);
  const lb = luminance(b);
  const light = Math.max(la, lb);
  const dark = Math.min(la, lb);
  return (light + 0.05) / (dark + 0.05);
}

export function isDark(c: Rgb): boolean {
  return luminance(c) < 0.4;
}

/** Linear blend. amount 0 returns `a`, amount 1 returns `b`. */
export function mix(a: Rgb, b: Rgb, amount: number): Rgb {
  const t = Math.max(0, Math.min(1, amount));
  return {
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  };
}

const WHITE: Rgb = { r: 255, g: 255, b: 255 };
const BLACK: Rgb = { r: 0, g: 0, b: 0 };

/** Black or white — whichever is more readable on `bg`. */
export function onColor(bg: Rgb): Rgb {
  return contrast(bg, BLACK) >= contrast(bg, WHITE) ? BLACK : WHITE;
}

/**
 * Nudges `fg` toward black or white until it clears `ratio` against `bg`.
 * Preserves the hue as far as possible instead of jumping straight to mono.
 */
export function ensureContrast(fg: Rgb, bg: Rgb, ratio: number): Rgb {
  if (contrast(fg, bg) >= ratio) return fg;
  const target = onColor(bg);
  for (let step = 1; step <= 20; step++) {
    const candidate = mix(fg, target, step / 20);
    if (contrast(candidate, bg) >= ratio) return candidate;
  }
  return target;
}

// ─────────────────────────────────────────────────────────────────────────────
// The palette
// ─────────────────────────────────────────────────────────────────────────────

/** One coherent set of colours for sections sharing a background polarity. */
export interface PaletteSet {
  background: string;
  surface: string;
  text: string;
  muted: string;
  accent: string;
  accentText: string;
  border: string;
  buttonBg: string;
  buttonText: string;
}

export interface StorePalette {
  /** Applied to sections whose own default background was light. */
  light: PaletteSet;
  /** Applied to sections whose own default background was dark. */
  dark: PaletteSet;
}

export interface PaletteInput {
  background?: string;
  text?: string;
  accent?: string;
  surface?: string;
  /**
   * Second accent candidate, used when `accent` turns out to be the same colour
   * as the text.
   *
   * Brand analysis reports a `primary` and an `accent`, and `primary` is very
   * often the near-black used for body copy. Feeding that straight into the
   * accent role paints every button, price and star in the text colour and
   * throws away the colour the brand is actually known for — a luxury beauty
   * brand with a #C9A97A gold ended up with black buttons.
   */
  accentAlt?: string;
}

/**
 * Derives both polarity sets from the brand's three core colours.
 *
 * Only background, text and accent are required — surface, muted and border are
 * computed so that a niche profile never has to specify nine values, and so the
 * derived values stay in the same hue family as the brand.
 */
export function buildStorePalette(input: PaletteInput): StorePalette {
  const bg = parseColor(input.background) || WHITE;
  const rawText = parseColor(input.text) || BLACK;

  // Pick whichever accent candidate is actually a distinct colour. A contrast
  // ratio below 1.35 against the text means the two are visually the same, so
  // using it would make the accent role invisible as an accent.
  const accentPrimary = parseColor(input.accent);
  const accentSecondary = parseColor(input.accentAlt);
  let rawAccent = accentPrimary || accentSecondary || rawText;
  if (accentPrimary && accentSecondary && contrast(accentPrimary, rawText) < 1.35) {
    if (contrast(accentSecondary, rawText) >= 1.35) rawAccent = accentSecondary;
  }

  // A brand may hand us either polarity. When the supplied background is dark,
  // that pair *is* the dark set and the light set is derived from it — not the
  // other way round. Getting this backwards turns a black-and-cyan tech brand
  // into grey text on white, discarding the brand entirely.
  const brandIsDark = isDark(bg);
  const lightAnchor = brandIsDark ? (isDark(rawText) ? WHITE : rawText) : bg;
  const darkAnchor = brandIsDark ? bg : isDark(rawText) ? mix(rawText, BLACK, 0.2) : { r: 17, g: 17, b: 17 };

  // ── Light set ──────────────────────────────────────────────────────────
  // Text must clear 4.5:1 on the background regardless of what was supplied.
  const lightBg = lightAnchor;
  const lightText = ensureContrast(isDark(rawText) ? rawText : darkAnchor, lightBg, 4.5);

  // Surface is the background pulled a little toward the text colour, so cards
  // separate from the page without introducing a second hue.
  const lightSurface = parseColor(input.surface) || mix(lightBg, lightText, 0.05);

  // Muted still has to be legible — 4.5:1 is the floor, not a suggestion.
  const lightMuted = ensureContrast(mix(lightText, lightBg, 0.4), lightBg, 4.5);

  // Borders are decorative, so they only need to be visible, not readable.
  const lightBorder = mix(lightBg, lightText, 0.14);

  const lightAccent = ensureContrast(rawAccent, lightBg, 3);
  const lightButtonBg = rawAccent;
  const lightButtonText = onColor(rawAccent);

  // ── Dark set ───────────────────────────────────────────────────────────
  // Sections that were designed dark stay dark, but their darkness now comes
  // from the brand's own colours rather than an unrelated near-black.
  const darkBg = darkAnchor;
  const darkText = ensureContrast(lightBg, darkBg, 4.5);
  const darkSurface = mix(darkBg, darkText, 0.08);
  const darkMuted = ensureContrast(mix(darkText, darkBg, 0.4), darkBg, 4.5);
  const darkBorder = mix(darkBg, darkText, 0.2);
  const darkAccent = ensureContrast(rawAccent, darkBg, 3);
  const darkButtonBg = darkAccent;
  const darkButtonText = onColor(darkAccent);

  return {
    light: {
      background: toHex(lightBg),
      surface: toHex(lightSurface),
      text: toHex(lightText),
      muted: toHex(lightMuted),
      accent: toHex(lightAccent),
      accentText: toHex(lightAccent),
      border: toHex(lightBorder),
      buttonBg: toHex(lightButtonBg),
      buttonText: toHex(lightButtonText),
    },
    dark: {
      background: toHex(darkBg),
      surface: toHex(darkSurface),
      text: toHex(darkText),
      muted: toHex(darkMuted),
      accent: toHex(darkAccent),
      accentText: toHex(darkAccent),
      border: toHex(darkBorder),
      buttonBg: toHex(darkButtonBg),
      buttonText: toHex(darkButtonText),
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Role classification
// ─────────────────────────────────────────────────────────────────────────────

export type ColorRole =
  | "background"
  | "surface"
  | "text"
  | "muted"
  | "accent"
  | "border"
  | "buttonBg"
  | "buttonText"
  | "skip";

/**
 * Settings whose meaning is not "a brand colour" and which break when forced.
 *
 * `overlay_color` sits on top of a photograph and is nearly always a dark scrim
 * — replacing it with the page background makes hero text unreadable.
 * `shadow_color` is a shadow. Neither is part of the palette.
 */
const SKIP = /^(overlay|shadow|scrim|backdrop|veil|gradient_(from|to|start|end))(_color)?$/;

/**
 * Ordered rules. The first match wins, so specific patterns precede general
 * ones — `btn_text_color` must be tested before the generic `_text` rule, or a
 * button label would be painted with body-text colour on an accent background.
 */
const ROLE_RULES: Array<[RegExp, ColorRole]> = [
  // Button foreground — before both the button and the text rules.
  [/^(btn|button|cta|submit|add_to_cart|atc|buy)_(text|label|fg|color_text)/, "buttonText"],
  [/(button|btn|cta)_(text|label)(_color)?$/, "buttonText"],
  [/^pill_text$/, "buttonText"],

  // Button background. The bare `btn_color` form means the button's fill.
  [/^(btn|button|cta|submit|add_to_cart|atc|buy)_(bg|background)/, "buttonBg"],
  [/(button|btn|cta)_(bg|background)(_color)?$/, "buttonBg"],
  [/(button|btn|cta)_(color|colour)$/, "buttonBg"],

  // Borders and rules.
  [/(border|divider|rule|stroke|outline|separator)(_color)?$/, "border"],
  [/^(border|divider|rule|stroke|outline|separator)_/, "border"],

  // Raised surfaces: cards, tiles, pills, inputs, panels.
  [/^(card|tile|item|panel|box|block|cell|input|field|pill|chip|tag|badge|swatch|thumb|hover|active|slide|column|feature)_(bg|background)/, "surface"],
  [/(card|tile|panel|input|surface)(_bg|_background)?(_color)?$/, "surface"],

  // Page-level backgrounds.
  [/(^|_)(bg|background)(_color)?$/, "background"],
  [/^(hero|section|content|body|wrapper|page|header|footer|bar|strip|banner|marquee|top|main)_(bg|background)/, "background"],

  // De-emphasised text.
  [/^(muted|meta|caption|secondary|subtle|helper|placeholder|small)_?(text|color|colour)?$/, "muted"],
  [/(muted|meta|caption|secondary|subtle)(_text)?(_color)?$/, "muted"],

  // Accents: highlights, stars, icons, prices, sale flags, named brand hues.
  [/^accent/, "accent"],
  [/(accent|highlight|primary|brand|star|rating|sale|price|discount|link|icon|dot|marker|underline|glow|ring|progress|active|badge|tag|track|pin|hover)(_color)?$/, "accent"],
  [/^(gold|silver|bronze|cyan|magenta|teal|lime|coral|amber|emerald|rose|indigo|violet|orange|yellow|green|blue|red|purple|pink|terra|matcha|sand|clay|olive|navy|mint|peach|lavender)(_color)?$/, "accent"],

  // Everything textual. `q_` / `a_` are the question and answer in FAQ sections.
  [/^(q|a|qn|ans)_(color|colour)$/, "text"],
  [/^(text|title|heading|headline|subtitle|subheading|desc|description|label|name|quote|body|content|eyebrow|number|value|answer|question|author|role|stat|counter|nav|menu|link_text|copy)_?(color|colour)?$/, "text"],
  [/(text|title|heading|label|desc)(_color)?$/, "text"],
];

/**
 * Strips state and index qualifiers so variants classify like their base id.
 *
 * `bg_color_scrolled`, `pill_text_hover` and `line_2_color` all mean exactly
 * what `bg_color`, `pill_text` and `line_color` mean. Without this, the anchored
 * rules below miss them and they keep their authored colour — which is how a
 * sticky header ends up in the previous brand's colours once the page scrolls.
 */
function normalizeSettingId(key: string): string {
  return key
    .replace(/_(initial|scrolled|sticky|hover|active|focus|selected|current|open|closed|expanded|disabled|visited|checked|dark|light|mobile|desktop|alt|alternate|secondary_state)$/g, "")
    .replace(/_(\d+)(?=_|$)/g, "")
    .replace(/_{2,}/g, "_")
    .replace(/^_|_$/g, "");
}

/** Maps a colour setting id to the palette role it should draw from. */
export function classifyColorSetting(id: string): ColorRole {
  const raw = String(id || "").toLowerCase().trim();
  if (!raw) return "skip";
  if (SKIP.test(raw)) return "skip";

  // `line_1_color`, `line_2_color` … are the successive lines of copy in a
  // rotating announcement bar, not divider rules. Numbered means text; the bare
  // `line_color` really is a divider and falls through to the border rule.
  if (/^line_\d/.test(raw)) return "text";

  const key = normalizeSettingId(raw);
  if (!key || SKIP.test(key)) return "skip";

  for (const [pattern, role] of ROLE_RULES) {
    if (pattern.test(key)) return role;
  }

  // Unrecognised colour setting. Treating it as an accent would splash brand
  // colour into places it was never meant to go, so leave it untouched — a
  // section keeping one authored colour is far better than a broken one.
  return "skip";
}

// ─────────────────────────────────────────────────────────────────────────────
// Schema reading
// ─────────────────────────────────────────────────────────────────────────────

export interface SchemaColorField {
  id: string;
  /** The value the section's author chose — used to infer light vs dark intent. */
  default?: string;
  /** Block type this field belongs to, or undefined for section-level settings. */
  blockType?: string;
}

/** Extracts and parses the `{% schema %}` block from a section's Liquid source. */
export function readSchema(liquidSource: string): any | null {
  const match = String(liquidSource || "").match(
    /\{%-?\s*schema\s*-?%\}([\s\S]*?)\{%-?\s*endschema\s*-?%\}/
  );
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

/** Every colour setting in a schema, section-level and block-level alike. */
export function collectColorFields(schema: any): SchemaColorField[] {
  const fields: SchemaColorField[] = [];
  if (!schema || typeof schema !== "object") return fields;

  const scan = (settings: any, blockType?: string) => {
    if (!Array.isArray(settings)) return;
    for (const setting of settings) {
      if (!setting || typeof setting !== "object") continue;
      if ((setting.type === "color" || setting.type === "color_background") && setting.id) {
        fields.push({ id: String(setting.id), default: setting.default, blockType });
      }
    }
  };

  scan(schema.settings);
  if (Array.isArray(schema.blocks)) {
    for (const block of schema.blocks) {
      if (block && typeof block === "object") scan(block.settings, block.type);
    }
  }
  return fields;
}

/**
 * Decides whether a section was authored light or dark.
 *
 * Uses the default of whichever setting maps to `background`. When a section has
 * several — a hero background plus a bar background, say — the first is taken as
 * the dominant one, matching how schemas are conventionally ordered. Sections
 * with no background setting at all default to light.
 */
export function detectPolarity(fields: SchemaColorField[]): "light" | "dark" {
  for (const field of fields) {
    if (field.blockType) continue;
    if (classifyColorSetting(field.id) !== "background") continue;
    const parsed = parseColor(field.default);
    if (parsed) return isDark(parsed) ? "dark" : "light";
  }
  return "light";
}

// ─────────────────────────────────────────────────────────────────────────────
// Applying the palette
// ─────────────────────────────────────────────────────────────────────────────

export interface PaletteApplyStats {
  filesTouched: number;
  sectionsTouched: number;
  settingsWritten: number;
  contrastRepairs: number;
  skipped: number;
  /** Section types whose Liquid was not in the bundle — cannot be recoloured. */
  unresolved: string[];
}

function setForPolarity(palette: StorePalette, polarity: "light" | "dark"): PaletteSet {
  return polarity === "dark" ? palette.dark : palette.light;
}

function valueForRole(set: PaletteSet, role: ColorRole): string | null {
  switch (role) {
    case "background":
      return set.background;
    case "surface":
      return set.surface;
    case "text":
      return set.text;
    case "muted":
      return set.muted;
    case "accent":
      return set.accent;
    case "border":
      return set.border;
    case "buttonBg":
      return set.buttonBg;
    case "buttonText":
      return set.buttonText;
    default:
      return null;
  }
}

/**
 * Rewrites one section entry's settings in place.
 * Returns how many values were written and how many needed contrast repair.
 */
function recolorSettings(
  target: Record<string, any>,
  fields: SchemaColorField[],
  set: PaletteSet,
  blockType?: string
): { written: number; repairs: number; skipped: number } {
  let written = 0;
  let repairs = 0;
  let skipped = 0;

  const relevant = fields.filter((f) => f.blockType === blockType);
  if (relevant.length === 0) return { written, repairs, skipped };

  // Resolve the background this element's text will sit on. A block inside a
  // section inherits the section's background unless it declares its own.
  let localBgHex = set.background;
  for (const field of relevant) {
    if (classifyColorSetting(field.id) === "background") {
      localBgHex = set.background;
      break;
    }
    if (classifyColorSetting(field.id) === "surface") {
      localBgHex = set.surface;
    }
  }
  const localBg = parseColor(localBgHex) || WHITE;

  for (const field of relevant) {
    const role = classifyColorSetting(field.id);
    if (role === "skip") {
      skipped++;
      continue;
    }

    let value = valueForRole(set, role);
    if (!value) {
      skipped++;
      continue;
    }

    // Foreground roles must clear WCAG against the surface they land on.
    if (role === "text" || role === "muted" || role === "accent") {
      const fg = parseColor(value);
      if (fg) {
        const minRatio = role === "accent" ? 3 : 4.5;
        if (contrast(fg, localBg) < minRatio) {
          value = toHex(ensureContrast(fg, localBg, minRatio));
          repairs++;
        }
      }
    }

    target[field.id] = value;
    written++;
  }

  return { written, repairs, skipped };
}

/**
 * Applies one palette across every template and section group in the bundle.
 *
 * `filesToUpload` is mutated: `templates/*.json` and `sections/*-group.json`
 * entries are rewritten with palette colours. Section Liquid is read from the
 * same bundle, so this must run after the compiler has injected section files.
 */
export function applyStorePalette(
  filesToUpload: Record<string, string>,
  palette: StorePalette
): PaletteApplyStats {
  const stats: PaletteApplyStats = {
    filesTouched: 0,
    sectionsTouched: 0,
    settingsWritten: 0,
    contrastRepairs: 0,
    skipped: 0,
    unresolved: [],
  };

  // Schema parsing is the expensive part and section types repeat across
  // templates, so each type is read once.
  const schemaCache = new Map<string, { fields: SchemaColorField[]; polarity: "light" | "dark" } | null>();

  const describe = (sectionType: string) => {
    if (schemaCache.has(sectionType)) return schemaCache.get(sectionType)!;

    const source = filesToUpload[`sections/${sectionType}.liquid`];
    if (!source) {
      if (!stats.unresolved.includes(sectionType)) stats.unresolved.push(sectionType);
      schemaCache.set(sectionType, null);
      return null;
    }

    const schema = readSchema(source);
    if (!schema) {
      schemaCache.set(sectionType, null);
      return null;
    }

    const fields = collectColorFields(schema);
    if (fields.length === 0) {
      schemaCache.set(sectionType, null);
      return null;
    }

    const entry = { fields, polarity: detectPolarity(fields) };
    schemaCache.set(sectionType, entry);
    return entry;
  };

  const jsonFiles = Object.keys(filesToUpload).filter(
    (key) =>
      (key.startsWith("templates/") && key.endsWith(".json")) ||
      (key.startsWith("sections/") && key.endsWith("-group.json"))
  );

  for (const key of jsonFiles) {
    let doc: any;
    try {
      doc = JSON.parse(filesToUpload[key]);
    } catch {
      // Malformed JSON is the validation gates' problem, not the palette's.
      continue;
    }
    if (!doc || typeof doc !== "object" || !doc.sections) continue;

    let fileChanged = false;

    for (const sectionKey of Object.keys(doc.sections)) {
      const entry = doc.sections[sectionKey];
      if (!entry || typeof entry !== "object" || !entry.type) continue;

      const described = describe(String(entry.type));
      if (!described) continue;

      const set = setForPolarity(palette, described.polarity);

      if (!entry.settings || typeof entry.settings !== "object") entry.settings = {};
      const sectionResult = recolorSettings(entry.settings, described.fields, set, undefined);

      let blockWritten = 0;
      if (entry.blocks && typeof entry.blocks === "object") {
        for (const blockKey of Object.keys(entry.blocks)) {
          const block = entry.blocks[blockKey];
          if (!block || typeof block !== "object" || !block.type) continue;
          if (!block.settings || typeof block.settings !== "object") block.settings = {};
          const blockResult = recolorSettings(
            block.settings,
            described.fields,
            set,
            String(block.type)
          );
          blockWritten += blockResult.written;
          stats.contrastRepairs += blockResult.repairs;
          stats.skipped += blockResult.skipped;
        }
      }

      stats.settingsWritten += sectionResult.written + blockWritten;
      stats.contrastRepairs += sectionResult.repairs;
      stats.skipped += sectionResult.skipped;

      if (sectionResult.written + blockWritten > 0) {
        stats.sectionsTouched++;
        fileChanged = true;
      }
    }

    if (fileChanged) {
      filesToUpload[key] = JSON.stringify(doc, null, 2);
      stats.filesTouched++;
    }
  }

  return stats;
}

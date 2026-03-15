/**
 * ConvertKit Theme Presets
 *
 * 8 complete theme definitions with CSS variables for colors,
 * typography, border radius, shadows, and button styles.
 *
 * Applied to the storefront via Shopify Assets API as a single CSS file.
 */

export const THEME_PRESETS = {
  Luxe: {
    label: "Luxe",
    bestFor: "Jewelry, fashion, beauty",
    character: "Dark background, gold accents, serif headings",
    colors: {
      preview: ["#1a1a2e", "#c9a96e", "#f5f0e8"],
    },
    variables: {
      "--ck-bg": "#1a1a2e",
      "--ck-bg-alt": "#16162b",
      "--ck-text": "#f5f0e8",
      "--ck-text-muted": "#b8b0a0",
      "--ck-accent": "#c9a96e",
      "--ck-accent-hover": "#d4b97e",
      "--ck-accent-text": "#1a1a2e",
      "--ck-heading-font": "'Cormorant Garamond', Georgia, serif",
      "--ck-body-font": "'Inter', -apple-system, sans-serif",
      "--ck-radius": "2px",
      "--ck-radius-lg": "4px",
      "--ck-shadow": "0 2px 12px rgba(0,0,0,0.3)",
      "--ck-shadow-lg": "0 8px 32px rgba(0,0,0,0.4)",
      "--ck-btn-radius": "2px",
      "--ck-btn-shadow": "none",
      "--ck-border": "rgba(201,169,110,0.2)",
    },
  },

  Fresh: {
    label: "Fresh",
    bestFor: "Health, wellness, organic food",
    character: "White background, sage green accents, rounded corners",
    colors: {
      preview: ["#ffffff", "#7c9a6e", "#f0f5ed"],
    },
    variables: {
      "--ck-bg": "#ffffff",
      "--ck-bg-alt": "#f0f5ed",
      "--ck-text": "#2d3b28",
      "--ck-text-muted": "#6b7c65",
      "--ck-accent": "#7c9a6e",
      "--ck-accent-hover": "#6b8a5e",
      "--ck-accent-text": "#ffffff",
      "--ck-heading-font": "'DM Sans', -apple-system, sans-serif",
      "--ck-body-font": "'Inter', -apple-system, sans-serif",
      "--ck-radius": "12px",
      "--ck-radius-lg": "16px",
      "--ck-shadow": "0 2px 8px rgba(0,0,0,0.06)",
      "--ck-shadow-lg": "0 8px 24px rgba(0,0,0,0.08)",
      "--ck-btn-radius": "24px",
      "--ck-btn-shadow": "0 2px 8px rgba(124,154,110,0.3)",
      "--ck-border": "rgba(124,154,110,0.15)",
    },
  },

  Bold: {
    label: "Bold",
    bestFor: "Streetwear, sneakers, apparel",
    character: "Black background, red/yellow accents, condensed bold type",
    colors: {
      preview: ["#0a0a0a", "#e63946", "#f4d35e"],
    },
    variables: {
      "--ck-bg": "#0a0a0a",
      "--ck-bg-alt": "#141414",
      "--ck-text": "#ffffff",
      "--ck-text-muted": "#999999",
      "--ck-accent": "#e63946",
      "--ck-accent-hover": "#ff4d5a",
      "--ck-accent-text": "#ffffff",
      "--ck-heading-font": "'Oswald', Impact, sans-serif",
      "--ck-body-font": "'Inter', -apple-system, sans-serif",
      "--ck-radius": "0px",
      "--ck-radius-lg": "0px",
      "--ck-shadow": "none",
      "--ck-shadow-lg": "0 4px 20px rgba(230,57,70,0.2)",
      "--ck-btn-radius": "0px",
      "--ck-btn-shadow": "none",
      "--ck-border": "rgba(255,255,255,0.1)",
    },
  },

  Clean: {
    label: "Clean",
    bestFor: "Electronics, tech accessories",
    character: "Light gray background, blue accents, precise grid layout",
    colors: {
      preview: ["#f4f5f7", "#2563eb", "#ffffff"],
    },
    variables: {
      "--ck-bg": "#f4f5f7",
      "--ck-bg-alt": "#ffffff",
      "--ck-text": "#1e293b",
      "--ck-text-muted": "#64748b",
      "--ck-accent": "#2563eb",
      "--ck-accent-hover": "#1d4ed8",
      "--ck-accent-text": "#ffffff",
      "--ck-heading-font": "'Inter', -apple-system, sans-serif",
      "--ck-body-font": "'Inter', -apple-system, sans-serif",
      "--ck-radius": "4px",
      "--ck-radius-lg": "8px",
      "--ck-shadow": "0 1px 3px rgba(0,0,0,0.06)",
      "--ck-shadow-lg": "0 4px 16px rgba(0,0,0,0.08)",
      "--ck-btn-radius": "6px",
      "--ck-btn-shadow": "0 1px 2px rgba(37,99,235,0.2)",
      "--ck-border": "rgba(0,0,0,0.08)",
    },
  },

  Warm: {
    label: "Warm",
    bestFor: "Home goods, candles, gifts",
    character: "Cream background, terracotta accents, soft drop shadows",
    colors: {
      preview: ["#faf6f1", "#c67b5c", "#f0e6d8"],
    },
    variables: {
      "--ck-bg": "#faf6f1",
      "--ck-bg-alt": "#f0e6d8",
      "--ck-text": "#3d2e22",
      "--ck-text-muted": "#8b7565",
      "--ck-accent": "#c67b5c",
      "--ck-accent-hover": "#b46a4c",
      "--ck-accent-text": "#ffffff",
      "--ck-heading-font": "'Playfair Display', Georgia, serif",
      "--ck-body-font": "'Lato', -apple-system, sans-serif",
      "--ck-radius": "8px",
      "--ck-radius-lg": "12px",
      "--ck-shadow": "0 4px 12px rgba(198,123,92,0.1)",
      "--ck-shadow-lg": "0 8px 28px rgba(198,123,92,0.15)",
      "--ck-btn-radius": "8px",
      "--ck-btn-shadow": "0 4px 12px rgba(198,123,92,0.2)",
      "--ck-border": "rgba(198,123,92,0.12)",
    },
  },

  Sport: {
    label: "Sport",
    bestFor: "Fitness, supplements, activewear",
    character: "Dark navy background, bright lime accents, impact type",
    colors: {
      preview: ["#0f172a", "#a3e635", "#1e293b"],
    },
    variables: {
      "--ck-bg": "#0f172a",
      "--ck-bg-alt": "#1e293b",
      "--ck-text": "#f1f5f9",
      "--ck-text-muted": "#94a3b8",
      "--ck-accent": "#a3e635",
      "--ck-accent-hover": "#bef264",
      "--ck-accent-text": "#0f172a",
      "--ck-heading-font": "'Barlow Condensed', Impact, sans-serif",
      "--ck-body-font": "'Inter', -apple-system, sans-serif",
      "--ck-radius": "4px",
      "--ck-radius-lg": "8px",
      "--ck-shadow": "0 2px 8px rgba(0,0,0,0.3)",
      "--ck-shadow-lg": "0 8px 32px rgba(0,0,0,0.4)",
      "--ck-btn-radius": "4px",
      "--ck-btn-shadow": "0 2px 8px rgba(163,230,53,0.3)",
      "--ck-border": "rgba(163,230,53,0.15)",
    },
  },

  Minimal: {
    label: "Minimal",
    bestFor: "Skincare, cosmetics, DTC beauty",
    character: "Pure white background, single muted accent color",
    colors: {
      preview: ["#ffffff", "#9ca3af", "#f9fafb"],
    },
    variables: {
      "--ck-bg": "#ffffff",
      "--ck-bg-alt": "#f9fafb",
      "--ck-text": "#111827",
      "--ck-text-muted": "#6b7280",
      "--ck-accent": "#111827",
      "--ck-accent-hover": "#374151",
      "--ck-accent-text": "#ffffff",
      "--ck-heading-font": "'Inter', -apple-system, sans-serif",
      "--ck-body-font": "'Inter', -apple-system, sans-serif",
      "--ck-radius": "0px",
      "--ck-radius-lg": "0px",
      "--ck-shadow": "none",
      "--ck-shadow-lg": "0 1px 3px rgba(0,0,0,0.05)",
      "--ck-btn-radius": "0px",
      "--ck-btn-shadow": "none",
      "--ck-border": "rgba(0,0,0,0.08)",
    },
  },

  Artisan: {
    label: "Artisan",
    bestFor: "Handmade, craft, specialty food",
    character: "Textured off-white background, earthy brown and olive tones",
    colors: {
      preview: ["#f5f0e6", "#6b5b45", "#8a9a5b"],
    },
    variables: {
      "--ck-bg": "#f5f0e6",
      "--ck-bg-alt": "#ece5d8",
      "--ck-text": "#3a3226",
      "--ck-text-muted": "#7a6e5e",
      "--ck-accent": "#6b5b45",
      "--ck-accent-hover": "#5a4a36",
      "--ck-accent-text": "#f5f0e6",
      "--ck-heading-font": "'Libre Baskerville', Georgia, serif",
      "--ck-body-font": "'Source Sans 3', -apple-system, sans-serif",
      "--ck-radius": "6px",
      "--ck-radius-lg": "10px",
      "--ck-shadow": "0 2px 8px rgba(107,91,69,0.08)",
      "--ck-shadow-lg": "0 8px 24px rgba(107,91,69,0.12)",
      "--ck-btn-radius": "6px",
      "--ck-btn-shadow": "0 2px 8px rgba(107,91,69,0.15)",
      "--ck-border": "rgba(107,91,69,0.12)",
    },
  },
};

/**
 * Generate a complete CSS string from a theme preset name.
 * The CSS applies variables to the :root and styles ConvertKit widgets.
 */
export function generateThemeCSS(themeName) {
  const preset = THEME_PRESETS[themeName];
  if (!preset) return null;

  const vars = Object.entries(preset.variables)
    .map(([key, val]) => `  ${key}: ${val};`)
    .join("\n");

  return `/* ConvertKit Theme: ${preset.label} — Applied automatically */
/* Change these variables to customize your store's ConvertKit appearance */

:root {
${vars}
}

/* ── ConvertKit Sticky Cart Theme Integration ── */
.ck-sticky-cart {
  --ck-sticky-bg: var(--ck-bg-alt, ${preset.variables["--ck-bg-alt"]});
  --ck-sticky-text: var(--ck-text, ${preset.variables["--ck-text"]});
  --ck-sticky-muted: var(--ck-text-muted, ${preset.variables["--ck-text-muted"]});
  --ck-sticky-border: var(--ck-border, ${preset.variables["--ck-border"]});
  --ck-sticky-btn-bg: var(--ck-accent, ${preset.variables["--ck-accent"]});
  --ck-sticky-btn-text: var(--ck-accent-text, ${preset.variables["--ck-accent-text"]});
  --ck-sticky-btn-radius: var(--ck-btn-radius, ${preset.variables["--ck-btn-radius"]});
  --ck-sticky-accent: var(--ck-accent, ${preset.variables["--ck-accent"]});
}
`;
}

/**
 * Get a flat list of theme names for the UI.
 */
export function getThemeList() {
  return Object.values(THEME_PRESETS).map((t) => ({
    name: t.label,
    bestFor: t.bestFor,
    character: t.character,
    previewColors: t.colors.preview,
  }));
}

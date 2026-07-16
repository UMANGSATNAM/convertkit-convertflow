import { CSSTokenResolver } from "./app/services/theme-engine/compiler/css-resolver.js";
const resolver = new CSSTokenResolver(() => ({}));
const result = resolver.resolve({
  niche: "default",
  themeDir: "",
  componentTokens: {},
  merchantOverrides: {
    "colors_background_1": "#C9A227",
    "colors_accent_1": "#111111",
    "colors_accent_2": "#C9A227",
    "fontHeading": "Inter",
    "fontBody": "Inter",
    "button_style": "rounded",
    "card_style": "soft",
    "section_density": "airy"
  }
});
console.log(JSON.stringify(result, null, 2));

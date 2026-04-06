// Element Registry — All available elements for the page builder

export interface ElementField {
  id: string;
  label: string;
  type: "text" | "textarea" | "number" | "color" | "select" | "range" | "toggle" | "image" | "url" | "icon" | "richtext" | "code" | "font" | "alignment" | "spacing";
  options?: { label: string; value: string }[];
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: unknown;
  group?: string;
}

export interface ElementDef {
  id: string;
  name: string;
  category: "layout" | "basic" | "shopify" | "marketing" | "advanced";
  icon: string;
  description: string;
  canHaveChildren: boolean;
  allowedParents: string[];
  defaultProps: Record<string, unknown>;
  editableFields: ElementField[];
}

// SVG icon helpers (inline, no deps)
const ICONS = {
  section: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>',
  row: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="8" width="18" height="8" rx="1"/></svg>',
  column: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="8" y="3" width="8" height="18" rx="1"/></svg>',
  heading: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4v16M20 4v16M4 12h16"/></svg>',
  paragraph: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 6h16M4 10h16M4 14h12M4 18h8"/></svg>',
  image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>',
  button: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="7" width="18" height="10" rx="5"/><path d="M8 12h8"/></svg>',
  video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m10 9 5 3-5 3V9Z"/></svg>',
  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"/></svg>',
  spacer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 12h16M12 4v4m0 8v4M8 8l4-4 4 4M8 16l4 4 4-4"/></svg>',
  divider: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 12h18"/></svg>',
  html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/></svg>',
  product: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"/></svg>',
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/></svg>',
  countdown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>',
  badge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"/></svg>',
  testimonial: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"/></svg>',
  faq: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"/></svg>',
  newsletter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"/></svg>',
  tabs: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M3 10h18M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  slider: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="m8 12-3 3m0-6 3 3m11 0-3-3m3 3-3 3"/></svg>',
  form: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-6.548 0c-1.131.094-1.976 1.057-1.976 2.192V16.5A2.25 2.25 0 0 0 12 18.75h.75"/></svg>',
  map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"/></svg>',
  liquid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"/></svg>',
  container: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="4" width="16" height="16" rx="2" stroke-dasharray="4 2"/></svg>',
  social: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"/></svg>',
  progress: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="10" width="18" height="4" rx="2"/><rect x="3" y="10" width="12" height="4" rx="2" fill="currentColor" opacity="0.3"/></svg>',
  table: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>',
  breadcrumb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 12h2m4 0h2m4 0h4M8 8l4 4-4 4m6-8l4 4-4 4"/></svg>',
};

// Shared field presets
const SPACING_GROUP = "spacing";
const STYLE_GROUP = "style";
const CONTENT_GROUP = "content";

const commonSpacingFields: ElementField[] = [
  { id: "marginTop", label: "Margin Top", type: "number", min: 0, max: 200, defaultValue: 0, group: SPACING_GROUP },
  { id: "marginBottom", label: "Margin Bottom", type: "number", min: 0, max: 200, defaultValue: 0, group: SPACING_GROUP },
  { id: "paddingTop", label: "Padding Top", type: "number", min: 0, max: 200, defaultValue: 0, group: SPACING_GROUP },
  { id: "paddingBottom", label: "Padding Bottom", type: "number", min: 0, max: 200, defaultValue: 0, group: SPACING_GROUP },
  { id: "paddingLeft", label: "Padding Left", type: "number", min: 0, max: 200, defaultValue: 0, group: SPACING_GROUP },
  { id: "paddingRight", label: "Padding Right", type: "number", min: 0, max: 200, defaultValue: 0, group: SPACING_GROUP },
];

const commonStyleFields: ElementField[] = [
  { id: "backgroundColor", label: "Background", type: "color", defaultValue: "transparent", group: STYLE_GROUP },
  { id: "borderRadius", label: "Border Radius", type: "number", min: 0, max: 100, defaultValue: 0, group: STYLE_GROUP },
  { id: "borderWidth", label: "Border Width", type: "number", min: 0, max: 20, defaultValue: 0, group: STYLE_GROUP },
  { id: "borderColor", label: "Border Color", type: "color", defaultValue: "#E2E8F0", group: STYLE_GROUP },
  { id: "boxShadow", label: "Shadow", type: "select", options: [
    { label: "None", value: "none" },
    { label: "Small", value: "0 1px 3px rgba(0,0,0,0.1)" },
    { label: "Medium", value: "0 4px 12px rgba(0,0,0,0.1)" },
    { label: "Large", value: "0 8px 30px rgba(0,0,0,0.12)" },
    { label: "XL", value: "0 20px 60px rgba(0,0,0,0.15)" },
  ], defaultValue: "none", group: STYLE_GROUP },
];

const visibilityFields: ElementField[] = [
  { id: "hideDesktop", label: "Hide on Desktop", type: "toggle", defaultValue: false, group: "visibility" },
  { id: "hideTablet", label: "Hide on Tablet", type: "toggle", defaultValue: false, group: "visibility" },
  { id: "hideMobile", label: "Hide on Mobile", type: "toggle", defaultValue: false, group: "visibility" },
];

const animationField: ElementField = {
  id: "animation", label: "Entrance Animation", type: "select", options: [
    { label: "None", value: "none" },
    { label: "Fade In", value: "fadeIn" },
    { label: "Slide Up", value: "slideUp" },
    { label: "Slide Left", value: "slideLeft" },
    { label: "Slide Right", value: "slideRight" },
    { label: "Zoom In", value: "zoomIn" },
    { label: "Bounce", value: "bounce" },
  ], defaultValue: "none", group: STYLE_GROUP,
};

// ── ELEMENT DEFINITIONS ──

export const ELEMENTS: Record<string, ElementDef> = {
  // ─── LAYOUT ───
  section: {
    id: "section", name: "Section", category: "layout", icon: ICONS.section,
    description: "Full-width page section container",
    canHaveChildren: true, allowedParents: ["root"],
    defaultProps: { fullWidth: true, backgroundColor: "#FFFFFF", paddingTop: 60, paddingBottom: 60, maxWidth: 1200 },
    editableFields: [
      { id: "fullWidth", label: "Full Width", type: "toggle", defaultValue: true, group: CONTENT_GROUP },
      { id: "maxWidth", label: "Max Width (px)", type: "number", min: 600, max: 1920, defaultValue: 1200, group: CONTENT_GROUP },
      ...commonSpacingFields, ...commonStyleFields, animationField, ...visibilityFields,
    ],
  },
  row: {
    id: "row", name: "Row", category: "layout", icon: ICONS.row,
    description: "Horizontal container for columns",
    canHaveChildren: true, allowedParents: ["section", "container"],
    defaultProps: { columns: 2, gap: 24, alignItems: "stretch", reverseOnMobile: false },
    editableFields: [
      { id: "columns", label: "Columns", type: "select", options: [
        { label: "1 Column", value: "1" }, { label: "2 Columns", value: "2" },
        { label: "3 Columns", value: "3" }, { label: "4 Columns", value: "4" },
        { label: "5 Columns", value: "5" }, { label: "6 Columns", value: "6" },
      ], defaultValue: "2", group: CONTENT_GROUP },
      { id: "gap", label: "Column Gap (px)", type: "number", min: 0, max: 80, defaultValue: 24, group: CONTENT_GROUP },
      { id: "alignItems", label: "Vertical Align", type: "select", options: [
        { label: "Stretch", value: "stretch" }, { label: "Top", value: "flex-start" },
        { label: "Center", value: "center" }, { label: "Bottom", value: "flex-end" },
      ], defaultValue: "stretch", group: CONTENT_GROUP },
      { id: "reverseOnMobile", label: "Reverse on Mobile", type: "toggle", defaultValue: false, group: CONTENT_GROUP },
      ...commonSpacingFields, ...commonStyleFields, ...visibilityFields,
    ],
  },
  column: {
    id: "column", name: "Column", category: "layout", icon: ICONS.column,
    description: "Vertical container within a row",
    canHaveChildren: true, allowedParents: ["row"],
    defaultProps: { width: "auto", verticalAlign: "flex-start" },
    editableFields: [
      { id: "width", label: "Width", type: "select", options: [
        { label: "Auto", value: "auto" }, { label: "25%", value: "25%" },
        { label: "33%", value: "33.33%" }, { label: "50%", value: "50%" },
        { label: "66%", value: "66.66%" }, { label: "75%", value: "75%" },
        { label: "100%", value: "100%" },
      ], defaultValue: "auto", group: CONTENT_GROUP },
      { id: "verticalAlign", label: "Content Align", type: "select", options: [
        { label: "Top", value: "flex-start" }, { label: "Center", value: "center" },
        { label: "Bottom", value: "flex-end" },
      ], defaultValue: "flex-start", group: CONTENT_GROUP },
      ...commonSpacingFields, ...commonStyleFields, ...visibilityFields,
    ],
  },
  spacer: {
    id: "spacer", name: "Spacer", category: "layout", icon: ICONS.spacer,
    description: "Vertical space between elements",
    canHaveChildren: false, allowedParents: ["section", "column", "container"],
    defaultProps: { height: 40 },
    editableFields: [
      { id: "height", label: "Height (px)", type: "range", min: 8, max: 200, step: 4, defaultValue: 40, group: CONTENT_GROUP },
    ],
  },
  divider: {
    id: "divider", name: "Divider", category: "layout", icon: ICONS.divider,
    description: "Horizontal line separator",
    canHaveChildren: false, allowedParents: ["section", "column", "container"],
    defaultProps: { color: "#E2E8F0", thickness: 1, style: "solid", width: "100%" },
    editableFields: [
      { id: "color", label: "Color", type: "color", defaultValue: "#E2E8F0", group: STYLE_GROUP },
      { id: "thickness", label: "Thickness", type: "number", min: 1, max: 10, defaultValue: 1, group: STYLE_GROUP },
      { id: "style", label: "Style", type: "select", options: [
        { label: "Solid", value: "solid" }, { label: "Dashed", value: "dashed" }, { label: "Dotted", value: "dotted" },
      ], defaultValue: "solid", group: STYLE_GROUP },
      { id: "width", label: "Width", type: "select", options: [
        { label: "100%", value: "100%" }, { label: "75%", value: "75%" }, { label: "50%", value: "50%" }, { label: "25%", value: "25%" },
      ], defaultValue: "100%", group: STYLE_GROUP },
      ...commonSpacingFields,
    ],
  },
  container: {
    id: "container", name: "Container", category: "layout", icon: ICONS.container,
    description: "Generic flex container",
    canHaveChildren: true, allowedParents: ["section", "column", "container"],
    defaultProps: { maxWidth: "100%", direction: "column", alignItems: "flex-start", justifyContent: "flex-start" },
    editableFields: [
      { id: "maxWidth", label: "Max Width", type: "text", defaultValue: "100%", group: CONTENT_GROUP },
      { id: "direction", label: "Direction", type: "select", options: [
        { label: "Vertical", value: "column" }, { label: "Horizontal", value: "row" },
      ], defaultValue: "column", group: CONTENT_GROUP },
      { id: "alignItems", label: "Align Items", type: "select", options: [
        { label: "Start", value: "flex-start" }, { label: "Center", value: "center" },
        { label: "End", value: "flex-end" }, { label: "Stretch", value: "stretch" },
      ], defaultValue: "flex-start", group: CONTENT_GROUP },
      ...commonSpacingFields, ...commonStyleFields, animationField, ...visibilityFields,
    ],
  },

  // ─── BASIC ───
  heading: {
    id: "heading", name: "Heading", category: "basic", icon: ICONS.heading,
    description: "H1-H6 text heading",
    canHaveChildren: false, allowedParents: ["section", "column", "container"],
    defaultProps: { text: "Your Heading Here", tag: "h2", fontSize: 36, fontWeight: "700", color: "#1E293B", textAlign: "left", fontFamily: "inherit", lineHeight: 1.2, letterSpacing: "-0.02em" },
    editableFields: [
      { id: "text", label: "Text", type: "text", defaultValue: "Your Heading Here", group: CONTENT_GROUP },
      { id: "tag", label: "Tag", type: "select", options: [
        { label: "H1", value: "h1" }, { label: "H2", value: "h2" }, { label: "H3", value: "h3" },
        { label: "H4", value: "h4" }, { label: "H5", value: "h5" }, { label: "H6", value: "h6" },
      ], defaultValue: "h2", group: CONTENT_GROUP },
      { id: "fontSize", label: "Font Size", type: "number", min: 12, max: 120, defaultValue: 36, group: STYLE_GROUP },
      { id: "fontWeight", label: "Weight", type: "select", options: [
        { label: "Light", value: "300" }, { label: "Regular", value: "400" },
        { label: "Medium", value: "500" }, { label: "Semi Bold", value: "600" },
        { label: "Bold", value: "700" }, { label: "Extra Bold", value: "800" },
      ], defaultValue: "700", group: STYLE_GROUP },
      { id: "color", label: "Color", type: "color", defaultValue: "#1E293B", group: STYLE_GROUP },
      { id: "textAlign", label: "Alignment", type: "alignment", defaultValue: "left", group: STYLE_GROUP },
      { id: "fontFamily", label: "Font", type: "font", defaultValue: "inherit", group: STYLE_GROUP },
      { id: "lineHeight", label: "Line Height", type: "number", min: 0.8, max: 3, step: 0.1, defaultValue: 1.2, group: STYLE_GROUP },
      ...commonSpacingFields, animationField, ...visibilityFields,
    ],
  },
  paragraph: {
    id: "paragraph", name: "Text", category: "basic", icon: ICONS.paragraph,
    description: "Body text paragraph",
    canHaveChildren: false, allowedParents: ["section", "column", "container"],
    defaultProps: { text: "Write your text here. This is a paragraph element.", fontSize: 16, fontWeight: "400", color: "#64748B", textAlign: "left", lineHeight: 1.7, fontFamily: "inherit" },
    editableFields: [
      { id: "text", label: "Text", type: "textarea", defaultValue: "Write your text here.", group: CONTENT_GROUP },
      { id: "fontSize", label: "Font Size", type: "number", min: 10, max: 48, defaultValue: 16, group: STYLE_GROUP },
      { id: "color", label: "Color", type: "color", defaultValue: "#64748B", group: STYLE_GROUP },
      { id: "textAlign", label: "Alignment", type: "alignment", defaultValue: "left", group: STYLE_GROUP },
      { id: "fontWeight", label: "Weight", type: "select", options: [
        { label: "Light", value: "300" }, { label: "Regular", value: "400" }, { label: "Semi Bold", value: "600" },
      ], defaultValue: "400", group: STYLE_GROUP },
      { id: "lineHeight", label: "Line Height", type: "number", min: 1, max: 3, step: 0.1, defaultValue: 1.7, group: STYLE_GROUP },
      ...commonSpacingFields, animationField, ...visibilityFields,
    ],
  },
  image: {
    id: "image", name: "Image", category: "basic", icon: ICONS.image,
    description: "Image with optional link",
    canHaveChildren: false, allowedParents: ["section", "column", "container"],
    defaultProps: { src: "", alt: "Image", width: "100%", height: "auto", objectFit: "cover", linkUrl: "", borderRadius: 0 },
    editableFields: [
      { id: "src", label: "Image URL", type: "image", defaultValue: "", group: CONTENT_GROUP },
      { id: "alt", label: "Alt Text", type: "text", defaultValue: "Image", group: CONTENT_GROUP },
      { id: "linkUrl", label: "Link URL", type: "url", defaultValue: "", group: CONTENT_GROUP },
      { id: "width", label: "Width", type: "text", defaultValue: "100%", group: STYLE_GROUP },
      { id: "height", label: "Height", type: "text", defaultValue: "auto", group: STYLE_GROUP },
      { id: "objectFit", label: "Fit", type: "select", options: [
        { label: "Cover", value: "cover" }, { label: "Contain", value: "contain" },
        { label: "Fill", value: "fill" }, { label: "None", value: "none" },
      ], defaultValue: "cover", group: STYLE_GROUP },
      { id: "borderRadius", label: "Radius", type: "number", min: 0, max: 100, defaultValue: 0, group: STYLE_GROUP },
      ...commonSpacingFields, animationField, ...visibilityFields,
    ],
  },
  button: {
    id: "button", name: "Button", category: "basic", icon: ICONS.button,
    description: "Call-to-action button",
    canHaveChildren: false, allowedParents: ["section", "column", "container"],
    defaultProps: { text: "Shop Now", url: "/collections/all", backgroundColor: "#10B981", textColor: "#FFFFFF", fontSize: 16, fontWeight: "700", paddingX: 32, paddingY: 14, borderRadius: 8, fullWidth: false, align: "left", hoverEffect: "darken" },
    editableFields: [
      { id: "text", label: "Button Text", type: "text", defaultValue: "Shop Now", group: CONTENT_GROUP },
      { id: "url", label: "Link URL", type: "url", defaultValue: "/collections/all", group: CONTENT_GROUP },
      { id: "backgroundColor", label: "Background", type: "color", defaultValue: "#10B981", group: STYLE_GROUP },
      { id: "textColor", label: "Text Color", type: "color", defaultValue: "#FFFFFF", group: STYLE_GROUP },
      { id: "fontSize", label: "Font Size", type: "number", min: 12, max: 28, defaultValue: 16, group: STYLE_GROUP },
      { id: "fontWeight", label: "Weight", type: "select", options: [
        { label: "Medium", value: "500" }, { label: "Semi Bold", value: "600" }, { label: "Bold", value: "700" },
      ], defaultValue: "700", group: STYLE_GROUP },
      { id: "paddingX", label: "Padding X", type: "number", min: 8, max: 80, defaultValue: 32, group: SPACING_GROUP },
      { id: "paddingY", label: "Padding Y", type: "number", min: 4, max: 40, defaultValue: 14, group: SPACING_GROUP },
      { id: "borderRadius", label: "Radius", type: "number", min: 0, max: 50, defaultValue: 8, group: STYLE_GROUP },
      { id: "fullWidth", label: "Full Width", type: "toggle", defaultValue: false, group: STYLE_GROUP },
      { id: "align", label: "Alignment", type: "alignment", defaultValue: "left", group: STYLE_GROUP },
      animationField, ...visibilityFields,
    ],
  },
  video: {
    id: "video", name: "Video", category: "basic", icon: ICONS.video,
    description: "YouTube/Vimeo or self-hosted video",
    canHaveChildren: false, allowedParents: ["section", "column", "container"],
    defaultProps: { src: "", type: "youtube", autoplay: false, loop: false, muted: true, aspectRatio: "16/9" },
    editableFields: [
      { id: "src", label: "Video URL", type: "url", defaultValue: "", group: CONTENT_GROUP },
      { id: "type", label: "Type", type: "select", options: [
        { label: "YouTube", value: "youtube" }, { label: "Vimeo", value: "vimeo" }, { label: "Self-hosted", value: "file" },
      ], defaultValue: "youtube", group: CONTENT_GROUP },
      { id: "autoplay", label: "Autoplay", type: "toggle", defaultValue: false, group: CONTENT_GROUP },
      { id: "loop", label: "Loop", type: "toggle", defaultValue: false, group: CONTENT_GROUP },
      { id: "aspectRatio", label: "Aspect Ratio", type: "select", options: [
        { label: "16:9", value: "16/9" }, { label: "4:3", value: "4/3" }, { label: "1:1", value: "1/1" }, { label: "9:16", value: "9/16" },
      ], defaultValue: "16/9", group: STYLE_GROUP },
      ...commonSpacingFields, ...commonStyleFields, animationField, ...visibilityFields,
    ],
  },
  icon: {
    id: "icon", name: "Icon", category: "basic", icon: ICONS.icon,
    description: "Decorative icon element",
    canHaveChildren: false, allowedParents: ["section", "column", "container"],
    defaultProps: { icon: "star", size: 24, color: "#1E293B", align: "left" },
    editableFields: [
      { id: "icon", label: "Icon", type: "icon", defaultValue: "star", group: CONTENT_GROUP },
      { id: "size", label: "Size (px)", type: "number", min: 12, max: 120, defaultValue: 24, group: STYLE_GROUP },
      { id: "color", label: "Color", type: "color", defaultValue: "#1E293B", group: STYLE_GROUP },
      { id: "align", label: "Alignment", type: "alignment", defaultValue: "left", group: STYLE_GROUP },
      ...commonSpacingFields, animationField, ...visibilityFields,
    ],
  },
  html_block: {
    id: "html_block", name: "HTML / Liquid", category: "basic", icon: ICONS.html,
    description: "Custom code block",
    canHaveChildren: false, allowedParents: ["section", "column", "container"],
    defaultProps: { code: "<div>Custom HTML here</div>", language: "html" },
    editableFields: [
      { id: "code", label: "Code", type: "code", defaultValue: "<div>Custom HTML here</div>", group: CONTENT_GROUP },
      ...commonSpacingFields, ...visibilityFields,
    ],
  },

  // ─── SHOPIFY ───
  product_title: {
    id: "product_title", name: "Product Title", category: "shopify", icon: ICONS.product,
    description: "Dynamic product title",
    canHaveChildren: false, allowedParents: ["section", "column", "container"],
    defaultProps: { tag: "h1", fontSize: 32, fontWeight: "700", color: "#1E293B" },
    editableFields: [
      { id: "tag", label: "Tag", type: "select", options: [{ label: "H1", value: "h1" }, { label: "H2", value: "h2" }, { label: "H3", value: "h3" }], defaultValue: "h1", group: CONTENT_GROUP },
      { id: "fontSize", label: "Font Size", type: "number", min: 16, max: 72, defaultValue: 32, group: STYLE_GROUP },
      { id: "fontWeight", label: "Weight", type: "select", options: [{ label: "Regular", value: "400" }, { label: "Bold", value: "700" }, { label: "Extra Bold", value: "800" }], defaultValue: "700", group: STYLE_GROUP },
      { id: "color", label: "Color", type: "color", defaultValue: "#1E293B", group: STYLE_GROUP },
      ...commonSpacingFields,
    ],
  },
  product_price: {
    id: "product_price", name: "Product Price", category: "shopify", icon: ICONS.product,
    description: "Dynamic product price",
    canHaveChildren: false, allowedParents: ["section", "column", "container"],
    defaultProps: { fontSize: 24, color: "#059669", showCompare: true, compareColor: "#94A3B8" },
    editableFields: [
      { id: "fontSize", label: "Font Size", type: "number", min: 14, max: 48, defaultValue: 24, group: STYLE_GROUP },
      { id: "color", label: "Price Color", type: "color", defaultValue: "#059669", group: STYLE_GROUP },
      { id: "showCompare", label: "Show Compare Price", type: "toggle", defaultValue: true, group: CONTENT_GROUP },
      { id: "compareColor", label: "Compare Color", type: "color", defaultValue: "#94A3B8", group: STYLE_GROUP },
      ...commonSpacingFields,
    ],
  },
  add_to_cart: {
    id: "add_to_cart", name: "Add to Cart", category: "shopify", icon: ICONS.cart,
    description: "Add to cart button with variant selector",
    canHaveChildren: false, allowedParents: ["section", "column", "container"],
    defaultProps: { buttonText: "Add to Cart", buttonColor: "#1E293B", textColor: "#FFFFFF", showQuantity: true, buttonRadius: 8, buttonFontSize: 16 },
    editableFields: [
      { id: "buttonText", label: "Button Text", type: "text", defaultValue: "Add to Cart", group: CONTENT_GROUP },
      { id: "showQuantity", label: "Show Quantity", type: "toggle", defaultValue: true, group: CONTENT_GROUP },
      { id: "buttonColor", label: "Button Color", type: "color", defaultValue: "#1E293B", group: STYLE_GROUP },
      { id: "textColor", label: "Text Color", type: "color", defaultValue: "#FFFFFF", group: STYLE_GROUP },
      { id: "buttonRadius", label: "Radius", type: "number", min: 0, max: 50, defaultValue: 8, group: STYLE_GROUP },
      { id: "buttonFontSize", label: "Font Size", type: "number", min: 12, max: 24, defaultValue: 16, group: STYLE_GROUP },
      ...commonSpacingFields,
    ],
  },
  product_images: {
    id: "product_images", name: "Product Images", category: "shopify", icon: ICONS.image,
    description: "Product image gallery",
    canHaveChildren: false, allowedParents: ["section", "column", "container"],
    defaultProps: { layout: "thumbnails", thumbnailPosition: "bottom", zoom: true, borderRadius: 8 },
    editableFields: [
      { id: "layout", label: "Layout", type: "select", options: [
        { label: "Thumbnails", value: "thumbnails" }, { label: "Dots", value: "dots" }, { label: "Grid", value: "grid" },
      ], defaultValue: "thumbnails", group: CONTENT_GROUP },
      { id: "thumbnailPosition", label: "Thumb Position", type: "select", options: [
        { label: "Bottom", value: "bottom" }, { label: "Left", value: "left" },
      ], defaultValue: "bottom", group: CONTENT_GROUP },
      { id: "zoom", label: "Zoom on Hover", type: "toggle", defaultValue: true, group: CONTENT_GROUP },
      { id: "borderRadius", label: "Radius", type: "number", min: 0, max: 30, defaultValue: 8, group: STYLE_GROUP },
      ...commonSpacingFields,
    ],
  },
  collection_list: {
    id: "collection_list", name: "Collection List", category: "shopify", icon: ICONS.product,
    description: "Display products from a collection",
    canHaveChildren: false, allowedParents: ["section", "column", "container"],
    defaultProps: { columns: 4, showPrice: true, showTitle: true, limit: 8, collectionHandle: "" },
    editableFields: [
      { id: "collectionHandle", label: "Collection Handle", type: "text", defaultValue: "", group: CONTENT_GROUP },
      { id: "columns", label: "Columns", type: "select", options: [
        { label: "2", value: "2" }, { label: "3", value: "3" }, { label: "4", value: "4" },
      ], defaultValue: "4", group: CONTENT_GROUP },
      { id: "limit", label: "Product Limit", type: "number", min: 2, max: 24, defaultValue: 8, group: CONTENT_GROUP },
      { id: "showPrice", label: "Show Price", type: "toggle", defaultValue: true, group: CONTENT_GROUP },
      { id: "showTitle", label: "Show Title", type: "toggle", defaultValue: true, group: CONTENT_GROUP },
      ...commonSpacingFields, ...commonStyleFields,
    ],
  },
  breadcrumb: {
    id: "breadcrumb", name: "Breadcrumb", category: "shopify", icon: ICONS.breadcrumb,
    description: "Navigation breadcrumb trail",
    canHaveChildren: false, allowedParents: ["section", "column", "container"],
    defaultProps: { fontSize: 13, color: "#64748B", activeColor: "#1E293B", separator: "/" },
    editableFields: [
      { id: "separator", label: "Separator", type: "text", defaultValue: "/", group: CONTENT_GROUP },
      { id: "fontSize", label: "Font Size", type: "number", min: 10, max: 20, defaultValue: 13, group: STYLE_GROUP },
      { id: "color", label: "Color", type: "color", defaultValue: "#64748B", group: STYLE_GROUP },
      { id: "activeColor", label: "Active Color", type: "color", defaultValue: "#1E293B", group: STYLE_GROUP },
      ...commonSpacingFields,
    ],
  },

  // ─── MARKETING ───
  countdown_timer: {
    id: "countdown_timer", name: "Countdown", category: "marketing", icon: ICONS.countdown,
    description: "Urgency countdown timer",
    canHaveChildren: false, allowedParents: ["section", "column", "container"],
    defaultProps: { endDate: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 16), headline: "Sale Ends In", accentColor: "#EF4444", textColor: "#FFFFFF", backgroundColor: "#0F172A" },
    editableFields: [
      { id: "headline", label: "Headline", type: "text", defaultValue: "Sale Ends In", group: CONTENT_GROUP },
      { id: "endDate", label: "End Date", type: "text", defaultValue: "", group: CONTENT_GROUP },
      { id: "accentColor", label: "Accent", type: "color", defaultValue: "#EF4444", group: STYLE_GROUP },
      { id: "textColor", label: "Text Color", type: "color", defaultValue: "#FFFFFF", group: STYLE_GROUP },
      { id: "backgroundColor", label: "Background", type: "color", defaultValue: "#0F172A", group: STYLE_GROUP },
      ...commonSpacingFields, animationField,
    ],
  },
  trust_badges: {
    id: "trust_badges", name: "Trust Badges", category: "marketing", icon: ICONS.badge,
    description: "Trust and guarantee badges",
    canHaveChildren: false, allowedParents: ["section", "column", "container"],
    defaultProps: { badges: [
      { icon: "shield", label: "Secure Checkout" }, { icon: "truck", label: "Free Shipping" },
      { icon: "refresh", label: "30-Day Returns" }, { icon: "star", label: "5-Star Rated" },
    ], layout: "horizontal", iconSize: 28, backgroundColor: "#F8FAFC" },
    editableFields: [
      { id: "layout", label: "Layout", type: "select", options: [
        { label: "Horizontal", value: "horizontal" }, { label: "Vertical", value: "vertical" }, { label: "Grid", value: "grid" },
      ], defaultValue: "horizontal", group: CONTENT_GROUP },
      { id: "iconSize", label: "Icon Size", type: "number", min: 16, max: 48, defaultValue: 28, group: STYLE_GROUP },
      { id: "backgroundColor", label: "Background", type: "color", defaultValue: "#F8FAFC", group: STYLE_GROUP },
      ...commonSpacingFields, animationField,
    ],
  },
  testimonial: {
    id: "testimonial", name: "Testimonials", category: "marketing", icon: ICONS.testimonial,
    description: "Customer review cards",
    canHaveChildren: false, allowedParents: ["section", "column", "container"],
    defaultProps: { reviews: [
      { name: "Sarah M.", rating: 5, text: "Absolutely love this product!", location: "New York" },
      { name: "James K.", rating: 5, text: "Best purchase I've made this year.", location: "LA" },
      { name: "Emily R.", rating: 4, text: "Great quality and customer service.", location: "Chicago" },
    ], layout: "cards", columns: 3, backgroundColor: "#FFFFFF" },
    editableFields: [
      { id: "layout", label: "Layout", type: "select", options: [
        { label: "Cards", value: "cards" }, { label: "Slider", value: "slider" }, { label: "Masonry", value: "masonry" },
      ], defaultValue: "cards", group: CONTENT_GROUP },
      { id: "columns", label: "Columns", type: "select", options: [
        { label: "2", value: "2" }, { label: "3", value: "3" }, { label: "4", value: "4" },
      ], defaultValue: "3", group: CONTENT_GROUP },
      { id: "backgroundColor", label: "Background", type: "color", defaultValue: "#FFFFFF", group: STYLE_GROUP },
      ...commonSpacingFields, animationField,
    ],
  },
  faq_accordion: {
    id: "faq_accordion", name: "FAQ Accordion", category: "marketing", icon: ICONS.faq,
    description: "Expandable Q&A section",
    canHaveChildren: false, allowedParents: ["section", "column", "container"],
    defaultProps: { items: [
      { question: "How long does shipping take?", answer: "Standard shipping takes 3-5 business days." },
      { question: "What is your return policy?", answer: "We offer a 30-day money-back guarantee." },
      { question: "Do you ship internationally?", answer: "Yes! We ship to over 50 countries." },
    ], accentColor: "#10B981", backgroundColor: "#FFFFFF" },
    editableFields: [
      { id: "accentColor", label: "Accent Color", type: "color", defaultValue: "#10B981", group: STYLE_GROUP },
      { id: "backgroundColor", label: "Background", type: "color", defaultValue: "#FFFFFF", group: STYLE_GROUP },
      ...commonSpacingFields, animationField,
    ],
  },
  newsletter: {
    id: "newsletter", name: "Newsletter", category: "marketing", icon: ICONS.newsletter,
    description: "Email capture form",
    canHaveChildren: false, allowedParents: ["section", "column", "container"],
    defaultProps: { headline: "Stay in the Loop", subtext: "Get 10% off your first order.", placeholder: "Enter your email", buttonText: "Subscribe", buttonColor: "#10B981", backgroundColor: "#0F172A", textColor: "#FFFFFF" },
    editableFields: [
      { id: "headline", label: "Headline", type: "text", defaultValue: "Stay in the Loop", group: CONTENT_GROUP },
      { id: "subtext", label: "Subtext", type: "text", defaultValue: "Get 10% off your first order.", group: CONTENT_GROUP },
      { id: "placeholder", label: "Placeholder", type: "text", defaultValue: "Enter your email", group: CONTENT_GROUP },
      { id: "buttonText", label: "Button Text", type: "text", defaultValue: "Subscribe", group: CONTENT_GROUP },
      { id: "buttonColor", label: "Button Color", type: "color", defaultValue: "#10B981", group: STYLE_GROUP },
      { id: "backgroundColor", label: "Background", type: "color", defaultValue: "#0F172A", group: STYLE_GROUP },
      { id: "textColor", label: "Text Color", type: "color", defaultValue: "#FFFFFF", group: STYLE_GROUP },
      ...commonSpacingFields, animationField,
    ],
  },
  social_share: {
    id: "social_share", name: "Social Share", category: "marketing", icon: ICONS.social,
    description: "Social media sharing buttons",
    canHaveChildren: false, allowedParents: ["section", "column", "container"],
    defaultProps: { platforms: ["facebook", "twitter", "pinterest", "whatsapp"], style: "filled", size: 36, color: "#1E293B" },
    editableFields: [
      { id: "style", label: "Style", type: "select", options: [
        { label: "Filled", value: "filled" }, { label: "Outline", value: "outline" }, { label: "Flat", value: "flat" },
      ], defaultValue: "filled", group: STYLE_GROUP },
      { id: "size", label: "Size", type: "number", min: 24, max: 64, defaultValue: 36, group: STYLE_GROUP },
      { id: "color", label: "Color", type: "color", defaultValue: "#1E293B", group: STYLE_GROUP },
      ...commonSpacingFields,
    ],
  },
  progress_bar: {
    id: "progress_bar", name: "Progress Bar", category: "marketing", icon: ICONS.progress,
    description: "Visual progress indicator",
    canHaveChildren: false, allowedParents: ["section", "column", "container"],
    defaultProps: { label: "Almost Sold Out!", percent: 78, barColor: "#EF4444", trackColor: "#FEE2E2", height: 12, showPercent: true },
    editableFields: [
      { id: "label", label: "Label", type: "text", defaultValue: "Almost Sold Out!", group: CONTENT_GROUP },
      { id: "percent", label: "Percent", type: "range", min: 0, max: 100, defaultValue: 78, group: CONTENT_GROUP },
      { id: "barColor", label: "Bar Color", type: "color", defaultValue: "#EF4444", group: STYLE_GROUP },
      { id: "trackColor", label: "Track Color", type: "color", defaultValue: "#FEE2E2", group: STYLE_GROUP },
      { id: "height", label: "Height", type: "number", min: 4, max: 32, defaultValue: 12, group: STYLE_GROUP },
      { id: "showPercent", label: "Show %", type: "toggle", defaultValue: true, group: CONTENT_GROUP },
      ...commonSpacingFields, animationField,
    ],
  },
  table: {
    id: "table", name: "Table", category: "marketing", icon: ICONS.table,
    description: "Data table / price list",
    canHaveChildren: false, allowedParents: ["section", "column", "container"],
    defaultProps: { headers: ["Feature", "Basic", "Pro"], rows: [["Pages", "5", "Unlimited"], ["Support", "Email", "Priority"]], striped: true, headerBg: "#0F172A", headerColor: "#FFFFFF" },
    editableFields: [
      { id: "striped", label: "Striped Rows", type: "toggle", defaultValue: true, group: STYLE_GROUP },
      { id: "headerBg", label: "Header Background", type: "color", defaultValue: "#0F172A", group: STYLE_GROUP },
      { id: "headerColor", label: "Header Text", type: "color", defaultValue: "#FFFFFF", group: STYLE_GROUP },
      ...commonSpacingFields, ...commonStyleFields,
    ],
  },

  // ─── ADVANCED ───
  tabs: {
    id: "tabs", name: "Tabs", category: "advanced", icon: ICONS.tabs,
    description: "Tabbed content sections",
    canHaveChildren: false, allowedParents: ["section", "column", "container"],
    defaultProps: { tabs: [
      { title: "Description", content: "Product description goes here." },
      { title: "Shipping", content: "Free shipping on orders over $50." },
      { title: "Reviews", content: "Customer reviews will appear here." },
    ], accentColor: "#10B981", style: "underline" },
    editableFields: [
      { id: "style", label: "Style", type: "select", options: [
        { label: "Underline", value: "underline" }, { label: "Pills", value: "pills" }, { label: "Boxed", value: "boxed" },
      ], defaultValue: "underline", group: STYLE_GROUP },
      { id: "accentColor", label: "Accent", type: "color", defaultValue: "#10B981", group: STYLE_GROUP },
      ...commonSpacingFields, ...commonStyleFields,
    ],
  },
  slider: {
    id: "slider", name: "Slider / Carousel", category: "advanced", icon: ICONS.slider,
    description: "Image or content slider",
    canHaveChildren: false, allowedParents: ["section", "column", "container"],
    defaultProps: { slides: [], autoplay: true, interval: 5, showDots: true, showArrows: true, height: 400 },
    editableFields: [
      { id: "autoplay", label: "Autoplay", type: "toggle", defaultValue: true, group: CONTENT_GROUP },
      { id: "interval", label: "Interval (sec)", type: "number", min: 2, max: 15, defaultValue: 5, group: CONTENT_GROUP },
      { id: "showDots", label: "Show Dots", type: "toggle", defaultValue: true, group: CONTENT_GROUP },
      { id: "showArrows", label: "Show Arrows", type: "toggle", defaultValue: true, group: CONTENT_GROUP },
      { id: "height", label: "Height (px)", type: "number", min: 200, max: 800, defaultValue: 400, group: STYLE_GROUP },
      ...commonSpacingFields, ...commonStyleFields,
    ],
  },
  form: {
    id: "form", name: "Form", category: "advanced", icon: ICONS.form,
    description: "Contact or lead form",
    canHaveChildren: false, allowedParents: ["section", "column", "container"],
    defaultProps: { fields: [
      { type: "text", label: "Name", required: true },
      { type: "email", label: "Email", required: true },
      { type: "textarea", label: "Message", required: false },
    ], submitText: "Send Message", submitColor: "#10B981", action: "" },
    editableFields: [
      { id: "submitText", label: "Submit Text", type: "text", defaultValue: "Send Message", group: CONTENT_GROUP },
      { id: "submitColor", label: "Submit Color", type: "color", defaultValue: "#10B981", group: STYLE_GROUP },
      { id: "action", label: "Form Action URL", type: "url", defaultValue: "", group: CONTENT_GROUP },
      ...commonSpacingFields, ...commonStyleFields,
    ],
  },
  map: {
    id: "map", name: "Map", category: "advanced", icon: ICONS.map,
    description: "Embedded Google Map",
    canHaveChildren: false, allowedParents: ["section", "column", "container"],
    defaultProps: { address: "New York, NY", height: 400, zoom: 14 },
    editableFields: [
      { id: "address", label: "Address", type: "text", defaultValue: "New York, NY", group: CONTENT_GROUP },
      { id: "height", label: "Height (px)", type: "number", min: 200, max: 800, defaultValue: 400, group: STYLE_GROUP },
      { id: "zoom", label: "Zoom Level", type: "number", min: 1, max: 20, defaultValue: 14, group: STYLE_GROUP },
      ...commonSpacingFields,
    ],
  },
  liquid_block: {
    id: "liquid_block", name: "Liquid Block", category: "advanced", icon: ICONS.liquid,
    description: "Custom Shopify Liquid code",
    canHaveChildren: false, allowedParents: ["section", "column", "container"],
    defaultProps: { code: "{{ shop.name }}", css: "" },
    editableFields: [
      { id: "code", label: "Liquid Code", type: "code", defaultValue: "{{ shop.name }}", group: CONTENT_GROUP },
      { id: "css", label: "Custom CSS", type: "code", defaultValue: "", group: STYLE_GROUP },
      ...commonSpacingFields,
    ],
  },
};

// ── Category helpers ──
export const ELEMENT_CATEGORIES = [
  { id: "layout", label: "Layout", icon: "📐" },
  { id: "basic", label: "Basic", icon: "✏️" },
  { id: "shopify", label: "Shopify", icon: "🛍️" },
  { id: "marketing", label: "Marketing", icon: "📣" },
  { id: "advanced", label: "Advanced", icon: "⚙️" },
] as const;

export function getElementsByCategory(category: string): ElementDef[] {
  if (category === "all") return Object.values(ELEMENTS);
  return Object.values(ELEMENTS).filter((e) => e.category === category);
}

export function getElement(id: string): ElementDef | undefined {
  return ELEMENTS[id];
}

// app/builder/types.ts
// Core data models for ConvertFlow PageFly-style Visual Page Builder

export type DeviceViewport = "desktop" | "tablet" | "mobile";

export type LayoutMode = "FULL_PAGE_NO_CHROME" | "THEME_CHROME";

export type BlockType =
  // Basic
  | "heading"
  | "paragraph"
  | "button"
  | "image"
  | "video"
  | "divider"
  | "spacer"
  | "icon"
  | "html_liquid"
  // Shopify Product Elements
  | "product_title"
  | "product_price"
  | "product_gallery"
  | "product_variants"
  | "product_atc"
  | "product_buynow"
  | "product_rating"
  | "product_stock_urgency"
  // CRO & Conversion Elements
  | "countdown_timer"
  | "trust_badges"
  | "testimonial"
  | "faq_accordion"
  | "before_after"
  | "whatsapp_chat"
  | "pincode_checker"
  // Layout Containers
  | "columns_1"
  | "columns_2"
  | "columns_3"
  | "columns_4";

export interface BlockStyles {
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  textAlign?: "left" | "center" | "right" | "justify";
  textColor?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: "none" | "solid" | "dashed" | "dotted";
  boxShadow?: "none" | "sm" | "md" | "lg" | "xl";
  width?: string;
  maxWidth?: string;
}

export interface BlockVisibility {
  hideOnDesktop?: boolean;
  hideOnTablet?: boolean;
  hideOnMobile?: boolean;
}

export interface Block {
  id: string;
  type: BlockType;
  label?: string;
  settings: Record<string, any>;
  styles: BlockStyles;
  visibility?: BlockVisibility;
}

export interface Column {
  id: string;
  width?: number; // flex basis or grid fraction (e.g. 6 for 50%)
  blocks: Block[];
  styles?: BlockStyles;
}

export interface Section {
  id: string;
  title: string;
  columns: Column[];
  settings?: {
    fullWidth?: boolean;
    containerMaxWidth?: string;
    backgroundColor?: string;
  };
  styles: BlockStyles;
  visibility?: BlockVisibility;
}

export interface GlobalStyles {
  fontFamily: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  maxWidth: string;
  containerPadding: number;
}

export interface PageSchema {
  version: "2.0";
  id: string;
  title: string;
  handle: string;
  pageType: "LANDING" | "PRODUCT" | "COLLECTION" | "HOME" | "CUSTOM";
  layoutMode: LayoutMode;
  seoTitle?: string;
  seoDesc?: string;
  customCss?: string;
  globalStyles: GlobalStyles;
  sections: Section[];
}

export interface ElementPaletteItem {
  type: BlockType;
  title: string;
  category: "basic" | "product" | "cro" | "layout";
  icon: string;
  description: string;
  defaultBlock: () => Block;
}

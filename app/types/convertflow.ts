export type ViewportMode = "desktop" | "tablet" | "mobile";

export interface ShopifySetting {
  type: string;
  id?: string;
  label?: string;
  default?: string | number | boolean;
  options?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  info?: string;
  placeholder?: string;
  content?: string;
}

export interface ShopifyBlock {
  type: string;
  name: string;
  limit?: number;
  settings?: ShopifySetting[];
}

export interface ShopifySchema {
  name: string;
  class?: string;
  tag?: string;
  limit?: number;
  settings: ShopifySetting[];
  blocks: ShopifyBlock[];
  presets?: Array<{ name: string; blocks?: Array<{ type: string }> }>;
  templates?: string[];
  disabled_on?: { groups?: string[]; templates?: string[] };
  enabled_on?: { groups?: string[]; templates?: string[] };
}

export interface ShopifySection {
  key: string;
  name: string;
  updated_at?: string;
  schema?: ShopifySchema;
  group: "header" | "template" | "footer";
}

export interface ConvertKitTemplate {
  id: string;
  name: string;
  category: "header" | "hero" | "banner" | "collection" | "social-proof" | "gallery" | "faq" | "footer";
  niche: string;
  liquidCode: string;
  cssCode: string;
  schemaCode: string;
}

export interface SelectedSectionState {
  key: string;
  name: string;
  schema: ShopifySchema | null;
}

export interface TopBarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  hasChanges: boolean;
  saving: boolean;
  onSave: () => void;
}

export interface LeftSidebarProps {
  headerSections: ShopifySection[];
  templateSections: ShopifySection[];
  footerSections: ShopifySection[];
  selectedSectionKey: string | null;
  expandedSections: Record<string, boolean>;
  onSelectSection: (key: string) => void;
  onToggleExpand: (key: string) => void;
  onAddSection: (position: number, group: string) => void;
  activeTab: "sections" | "settings";
  onTabChange: (tab: "sections" | "settings") => void;
}

export interface CenterPreviewProps {
  shopDomain: string;
  currentPath: string;
  viewport: ViewportMode;
  onViewportChange: (mode: ViewportMode) => void;
  passwordEnabled: boolean;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  iframeKey: number;
  iframeLoading: boolean;
  onIframeLoad: () => void;
}

export interface RightSettingsPanelProps {
  selectedSection: SelectedSectionState | null;
  values: Record<string, unknown>;
  onChange: (settingId: string, value: unknown) => void;
  onBack: () => void;
}

export interface SettingControlProps {
  setting: ShopifySetting;
  value: unknown;
  onChange: (value: unknown) => void;
}

export interface AddSectionModalProps {
  visible: boolean;
  position: { top: number; left: number };
  sections: ShopifySection[];
  templates: ConvertKitTemplate[];
  onClose: () => void;
  onSelectTemplate: (templateId: string) => void;
  onSelectSection: (sectionKey: string) => void;
}

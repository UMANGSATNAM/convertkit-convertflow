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
  disabled?: boolean;
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
  shopDomain?: string;
  themeName?: string;
  currentPage: string;
  onPageChange: (page: string) => void;
  hasChanges: boolean;
  saving: boolean;
  onSave: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  isPreviewMode?: boolean;
  onTogglePreview?: () => void;
}

export interface LeftSidebarProps {
  headerSections: ShopifySection[];
  templateSections: ShopifySection[];
  footerSections: ShopifySection[];
  selectedSectionKey: string | null;
  expandedSections: Record<string, boolean>;
  onSelectSection: (key: string) => void;
  onToggleExpand: (key: string) => void;
  onToggleVisibility: (key: string) => void;
  onAddSection: (position: number, group: string) => void;
  onReorderSections: (fromIdx: number, toIdx: number) => void;
  activeTab: "sections" | "settings";
  onTabChange: (tab: "sections" | "settings") => void;
  themeSettings: Record<string, unknown>;
  onThemeSettingChange: (groupIdx: number, settingId: string, value: unknown) => void;
}

export interface CenterPreviewProps {
  shopDomain: string;
  themeId: string;
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
  onRemoveSection: (sectionKey: string) => void;
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
  onSelectTemplate: (templateId: string, insertIndex?: number) => void;
  onSelectSection: (sectionKey: string, insertIndex?: number) => void;
  insertIndex?: number;
}

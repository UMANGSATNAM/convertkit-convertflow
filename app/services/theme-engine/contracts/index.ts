export interface ShopForgeBlueprint {
  schemaVersion: "1.0";
  industry: string;
  brand: {
    personality: string;
    tone: string;
    style: string;
  };
  design: {
    colorToken: string;
    typographyToken: string;
    spacingToken: string;
  };
  layout: {
    homepage: string[];
    [key: string]: string[];
  };
  components: Array<{
    id: string;
    settings?: Record<string, any>;
  }>;
  [key: string]: any;
}

export interface ComponentMetadata {
  id: string;
  version: string;
  category: string;
  industry: string[];
  dependencies: string[];
  requiredAssets: string[];
  requiredSnippets: string[];
  performanceScore: number;
  croScore: number;
  accessibilityScore: number;
  mobileScore: number;
  designFamily: string;
  [key: string]: any;
}

export interface DependencyGraph {
  [componentId: string]: {
    needs: {
      assets?: string[];
      snippets?: string[];
      sections?: string[];
    };
  };
}

export interface ThemeDNA {
  themeVersion: string;
  blueprintVersion: string;
  designFamily: string;
  industry: string;
  componentHash: string;
  tokenHash: string;
  layoutHash: string;
  registryVersion: string;
  generatorVersion: string;
  [key: string]: any;
}

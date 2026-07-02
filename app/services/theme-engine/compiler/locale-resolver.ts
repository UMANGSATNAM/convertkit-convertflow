import { ResolvedDependencies } from "./dependency-resolver";
import { ComponentRegistry } from "@prisma/client";
import { ResourceCategoryMap } from "./resource-resolver";
import { SettingsArtifact } from "./settings-resolver";

export interface LocaleArtifact {
  translations: Record<string, string>;
}

export type LocaleFetcher = (componentId: string) => Promise<Record<string, string>>;

export class LocaleResolver {
  constructor(private fetchLocale: LocaleFetcher) {}

  public async resolve(dependencies: ResolvedDependencies): Promise<LocaleArtifact> {
    const translations: Record<string, string> = {};
    const keyOrigins = new Map<string, string>(); // key -> componentId

    // Extract all unique component IDs from the graph
    const allComponentIds = new Set<string>();
    
    const extractIds = (node: any) => {
      allComponentIds.add(node.id);
      for (const child of Object.values(node.children)) {
        extractIds(child);
      }
    };
    
    for (const rootNode of Object.values(dependencies.graph)) {
      extractIds(rootNode);
    }

    // Sort to ensure deterministic order of processing
    const sortedComponentIds = Array.from(allComponentIds).sort();

    for (const compId of sortedComponentIds) {
      const compLocales = await this.fetchLocale(compId);
      
      for (const [key, value] of Object.entries(compLocales)) {
        if (keyOrigins.has(key)) {
          const originComp = keyOrigins.get(key);
          const existingValue = translations[key];
          
          if (existingValue !== value) {
            throw new Error(`Compiler failed at Locale Resolver: Conflicting locale key '${key}'. \nComponent '${originComp}' provides "${existingValue}" \nComponent '${compId}' provides "${value}"`);
          } else {
             throw new Error(`Compiler failed at Locale Resolver: Duplicate locale key '${key}'. \nComponent '${compId}' and '${originComp}' both provide this key. Keys must be unique or shared correctly.`);
          }
        }
        
        translations[key] = value;
        keyOrigins.set(key, compId);
      }
    }

    return { translations };
  }
}

/**
 * Orchestrator integration function
 */
export async function resolveLocales(
  dependencies: ResolvedDependencies,
  componentsRegistry: ComponentRegistry[],
  resources: ResourceCategoryMap,
  settings: SettingsArtifact
): Promise<LocaleArtifact> {
  const fetcher: LocaleFetcher = async (id: string) => {
    // In reality, this would read the component's en.default.json or extract from schema
    return {};
  };

  const resolver = new LocaleResolver(fetcher);
  return resolver.resolve(dependencies);
}

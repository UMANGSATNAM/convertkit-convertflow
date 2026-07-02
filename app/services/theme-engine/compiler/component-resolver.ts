import { StoreBlueprintData } from "../compiler.server";

export interface ResolvedComponents {
  // A unique set of component IDs required by the blueprint
  componentIds: string[];
}

/**
 * Stage 2: Component Resolver
 * Maps the blueprint to a deterministic, unique list of required component IDs.
 * No file loading, purely extracting and mapping dependencies.
 */
export async function resolveComponents(blueprint: StoreBlueprintData): Promise<ResolvedComponents> {
  const componentSet = new Set<string>();

  // 1. Add global components (e.g. headers, footers, cart drawers)
  if (blueprint.globalComponents && Array.isArray(blueprint.globalComponents)) {
    for (const compId of blueprint.globalComponents) {
      componentSet.add(compId);
    }
  }

  // 2. Add components used in pages
  if (blueprint.pages) {
    for (const [pageHandle, pageData] of Object.entries(blueprint.pages)) {
      if (pageData.sections && Array.isArray(pageData.sections)) {
        for (const section of pageData.sections) {
          if (section.componentId) {
            componentSet.add(section.componentId);
          }
        }
      }
    }
  }

  return {
    componentIds: Array.from(componentSet)
  };
}

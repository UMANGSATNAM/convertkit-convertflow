import { ResolvedComponents } from "./component-resolver";
import { ComponentRegistry } from "@prisma/client";

export interface ComponentDependencies {
  sections: string[];
  snippets: string[];
  assets: string[];
  css: string[];
  javascript: string[];
  locales: string[];
  settings: string[];
  fonts: string[];
}

export interface DependencyGraphNode {
  id: string;
  dependencies: ComponentDependencies;
  children: Record<string, DependencyGraphNode>;
}

export interface ResolvedDependencies {
  flat: ComponentDependencies;
  graph: Record<string, DependencyGraphNode>;
}

export type MetadataFetcher = (id: string) => Promise<ComponentDependencies>;

const emptyDependencies = (): ComponentDependencies => ({
  sections: [],
  snippets: [],
  assets: [],
  css: [],
  javascript: [],
  locales: [],
  settings: [],
  fonts: []
});

/**
 * Merges source dependencies into target, mutating target in place.
 * Deduplicates automatically.
 */
function mergeDependencies(target: ComponentDependencies, source: ComponentDependencies) {
  for (const key of Object.keys(target) as (keyof ComponentDependencies)[]) {
    if (source[key]) {
      for (const item of source[key]) {
        if (!target[key].includes(item)) {
          target[key].push(item);
        }
      }
    }
  }
}

/**
 * Stage 3: Dependency Resolver
 * Recursively resolves a dependency graph, detects circular dependencies,
 * and outputs a flattened unique list + hierarchical graph.
 */
export class DependencyResolver {
  private cache: Map<string, DependencyGraphNode> = new Map();

  constructor(private fetchMetadata: MetadataFetcher) {}

  public async resolve(componentIds: string[]): Promise<ResolvedDependencies> {
    const flat = emptyDependencies();
    const graph: Record<string, DependencyGraphNode> = {};
    
    // Using an array to explicitly maintain deterministic order
    const sortedComponentIds = [...componentIds].sort();

    for (const compId of sortedComponentIds) {
      const node = await this.resolveNode(compId, new Set());
      graph[compId] = node;
      this.flattenNode(node, flat);
    }

    // Sort flat arrays for determinism
    for (const key of Object.keys(flat) as (keyof ComponentDependencies)[]) {
      flat[key].sort();
    }

    return { flat, graph };
  }

  private async resolveNode(id: string, resolutionStack: Set<string>): Promise<DependencyGraphNode> {
    if (resolutionStack.has(id)) {
      throw new Error(`Circular dependency detected: ${Array.from(resolutionStack).join(' -> ')} -> ${id}`);
    }

    if (this.cache.has(id)) {
      return this.cache.get(id)!;
    }

    resolutionStack.add(id);

    try {
      const deps = await this.fetchMetadata(id);
      
      const children: Record<string, DependencyGraphNode> = {};
      
      // We consider snippets as potential sub-components that might have their own metadata.
      // Other arrays like css, locales, etc. are terminal leaves.
      // Sections might also have metadata.
      
      const potentialChildrenIds = [
        ...(deps.sections || []),
        ...(deps.snippets || [])
      ].sort();

      for (const childId of potentialChildrenIds) {
        children[childId] = await this.resolveNode(childId, resolutionStack);
      }

      const node: DependencyGraphNode = {
        id,
        dependencies: deps,
        children
      };

      this.cache.set(id, node);
      resolutionStack.delete(id);
      
      return node;
    } catch (e: any) {
      // Re-throw circular dependency errors without wrapping them
      if (e.message.startsWith('Circular dependency')) throw e;
      throw new Error(`Missing dependency or resolution failed for '${id}': ${e.message}`);
    }
  }

  private flattenNode(node: DependencyGraphNode, flat: ComponentDependencies, visited: Set<string> = new Set()) {
    if (visited.has(node.id)) return;
    visited.add(node.id);

    mergeDependencies(flat, node.dependencies);

    // To ensure parent dependencies are processed before child dependencies, 
    // the caller already merged node.dependencies. Now merge children.
    // Order is deterministic because Object.keys() on the sorted children building is stable.
    for (const childId of Object.keys(node.children).sort()) {
      this.flattenNode(node.children[childId], flat, visited);
    }
  }
}

/**
 * Orchestrator integration function
 */
export async function resolveDependencies(
  resolved: ResolvedComponents,
  componentsRegistry: ComponentRegistry[]
): Promise<ResolvedDependencies> {
  // In a real scenario, this would read from `.meta.json` files or the registry.
  // We'll throw not implemented if it tries to hit real FS without a proper fetcher.
  const fetcher: MetadataFetcher = async (id: string) => {
    // Look up in registry, parse metaPath, etc.
    const registryEntry = componentsRegistry.find(c => c.componentId === id || c.componentId.includes(id));
    if (!registryEntry) {
      throw new Error(`Metadata not found in registry for ${id}`);
    }
    // TODO: Actually read metaPath from filesystem
    return emptyDependencies();
  };

  const resolver = new DependencyResolver(fetcher);
  return resolver.resolve(resolved.componentIds);
}

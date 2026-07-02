import { ResolvedDependencies } from "./dependency-resolver";
import { ComponentRegistry } from "@prisma/client";

export interface ResourceMap {
  required: string[];
  optional: string[];
  duplicates: string[];
  missing: string[];
}

export interface ResourceCategoryMap {
  css: ResourceMap;
  js: ResourceMap;
  fonts: ResourceMap;
  svg: ResourceMap;
  images: ResourceMap;
}

export type ResourceExistsChecker = (resourcePath: string) => Promise<boolean>;

function createEmptyResourceMap(): ResourceMap {
  return {
    required: [],
    optional: [],
    duplicates: [],
    missing: []
  };
}

export class ResourceResolver {
  constructor(private checkExists: ResourceExistsChecker) {}

  public async resolve(dependencies: ResolvedDependencies): Promise<ResourceCategoryMap> {
    const resources: ResourceCategoryMap = {
      css: createEmptyResourceMap(),
      js: createEmptyResourceMap(),
      fonts: createEmptyResourceMap(),
      svg: createEmptyResourceMap(),
      images: createEmptyResourceMap()
    };

    // Helper to process a list of resource paths into a specific category map
    const processCategory = async (paths: string[], map: ResourceMap, isOptional = false) => {
      const seen = new Set<string>();

      for (const p of paths) {
        if (seen.has(p)) {
          map.duplicates.push(p);
          continue;
        }
        seen.add(p);

        const exists = await this.checkExists(p);
        if (exists) {
          if (isOptional) {
            map.optional.push(p);
          } else {
            map.required.push(p);
          }
        } else {
          map.missing.push(p);
        }
      }
    };

    // The dependency graph already flattens css, javascript, fonts, and assets (which includes svg/images).
    // Let's categorize them.
    const allAssets = dependencies.flat.assets || [];
    const svgPaths = allAssets.filter(a => a.endsWith('.svg'));
    const imagePaths = allAssets.filter(a => a.match(/\.(png|jpg|jpeg|gif|webp)$/i));
    
    await Promise.all([
      processCategory(dependencies.flat.css || [], resources.css),
      processCategory(dependencies.flat.javascript || [], resources.js),
      processCategory(dependencies.flat.fonts || [], resources.fonts),
      processCategory(svgPaths, resources.svg),
      processCategory(imagePaths, resources.images)
    ]);

    // Validation: if any required resource is missing, throw an error
    const allMissing = [
      ...resources.css.missing,
      ...resources.js.missing,
      ...resources.fonts.missing,
      ...resources.svg.missing,
      ...resources.images.missing
    ];

    if (allMissing.length > 0) {
      throw new Error(`Compiler failed at Resource Resolver: Missing required resources: \n${allMissing.join('\n')}`);
    }

    // Sort arrays for determinism
    for (const cat of Object.values(resources)) {
      cat.required.sort();
      cat.optional.sort();
      cat.duplicates.sort();
      cat.missing.sort();
    }

    return resources;
  }
}

/**
 * Orchestrator integration function
 */
export async function resolveResources(
  dependencies: ResolvedDependencies,
  componentsRegistry: ComponentRegistry[]
): Promise<ResourceCategoryMap> {
  
  // Real implementation would check the actual filesystem / R2 bucket
  const existsChecker: ResourceExistsChecker = async (resourcePath: string) => {
    // TODO: implement real file system / remote bucket check
    return true; 
  };

  const resolver = new ResourceResolver(existsChecker);
  return resolver.resolve(dependencies);
}

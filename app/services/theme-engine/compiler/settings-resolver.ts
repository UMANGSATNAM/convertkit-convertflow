import { ResolvedDependencies } from "./dependency-resolver";
import { ComponentRegistry } from "@prisma/client";

export interface SettingsArtifact {
  settings_data: Record<string, any>;
  missing: string[];
  unused: string[];
}

export class SettingsResolver {
  public resolve(
    blueprintSettings: Record<string, any>, 
    dependencies: ResolvedDependencies
  ): SettingsArtifact {
    const requiredKeys = dependencies.flat.settings || [];
    const settingsData: Record<string, any> = {};
    const missing: string[] = [];
    const unused: string[] = [];

    // Track unused settings
    const providedKeys = Object.keys(blueprintSettings);
    
    // Check all required settings
    for (const key of requiredKeys) {
      if (blueprintSettings[key] !== undefined) {
        settingsData[key] = blueprintSettings[key];
      } else {
        missing.push(key);
      }
    }

    // Check for unused settings
    for (const key of providedKeys) {
      if (!requiredKeys.includes(key)) {
        unused.push(key);
      }
    }

    if (missing.length > 0) {
      missing.sort();
      throw new Error(`Compiler failed at Settings Resolver: Missing required settings: \n${missing.join('\n')}`);
    }

    unused.sort();

    return {
      settings_data: settingsData,
      missing,
      unused
    };
  }
}

/**
 * Orchestrator integration function
 */
export async function resolveSettings(
  blueprintSettings: any,
  dependencies: ResolvedDependencies,
  componentsRegistry: ComponentRegistry[]
): Promise<SettingsArtifact> {
  const resolver = new SettingsResolver();
  // Ensure blueprintSettings is a plain object
  const settingsInput = blueprintSettings && typeof blueprintSettings === 'object' ? blueprintSettings : {};
  return resolver.resolve(settingsInput, dependencies);
}

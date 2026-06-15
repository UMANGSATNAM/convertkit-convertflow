import { describe, it, expect, vi } from 'vitest';
import { acquireLock } from '../app/services/mutex.server';
import { validateSettingsPatch, validateTemplateStructure } from '../app/services/theme-engine/validators.server';

// Mock Redis
vi.mock('../app/services/redis.server', () => {
  let lockMap = new Map();
  return {
    redis: {
      set: vi.fn(async (key, value, px, expiry, nx) => {
        if (lockMap.has(key)) return null;
        lockMap.set(key, value);
        return "OK";
      }),
      eval: vi.fn(async (script, numKeys, key, value) => {
        if (lockMap.get(key) === value) {
          lockMap.delete(key);
          return 1;
        }
        return 0;
      })
    }
  };
});

// Mock Shopify API reading
vi.mock('../app/services/theme-engine/index', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    readFile: vi.fn(async (shop, themeId, path) => {
      if (path === "config/settings_schema.json") {
        return JSON.stringify([
          {
            name: "Colors",
            settings: [
              { type: "color", id: "color_primary", label: "Primary" },
              { type: "range", id: "border_radius", min: 0, max: 20, default: 4 }
            ]
          }
        ]);
      }
      return "{}";
    })
  };
});

describe("Theme Engine Chaos & Validators", () => {
  
  it("should acquire and release Redis locks sequentially", async () => {
    const release1 = await acquireLock("test-shop.myshopify.com");
    let lock2Acquired = false;
    
    const promise2 = acquireLock("test-shop.myshopify.com").then((release2) => {
      lock2Acquired = true;
      release2();
    });

    // Wait a bit to ensure promise2 is blocked
    await new Promise(r => setTimeout(r, 150));
    expect(lock2Acquired).toBe(false);

    // Release 1 should unblock 2
    await release1();
    await promise2;
    expect(lock2Acquired).toBe(true);
  });

  it("should validate valid settings patches", async () => {
    const shop = {};
    const patch = { color_primary: "#ff0000", border_radius: 10 };
    await expect(validateSettingsPatch(shop, "theme123", patch)).resolves.not.toThrow();
  });

  it("should reject invalid setting keys", async () => {
    const shop = {};
    const patch = { color_primary: "#ff0000", unknown_key: "bad" };
    await expect(validateSettingsPatch(shop, "theme123", patch)).rejects.toThrow(/does not exist in theme schema/);
  });

  it("should reject out of range numeric settings", async () => {
    const shop = {};
    const patch = { border_radius: 50 }; // Max is 20
    await expect(validateSettingsPatch(shop, "theme123", patch)).rejects.toThrow(/is above maximum/);
  });

  it("should validate proper template structure", () => {
    const validTemplate = {
      sections: {
        "hero_1": { type: "hero", blocks: {} }
      },
      order: ["hero_1"]
    };
    expect(() => validateTemplateStructure(validTemplate)).not.toThrow();
  });

  it("should reject template structure with missing sections", () => {
    const invalidTemplate = {
      sections: {
        "hero_1": { type: "hero" }
      },
      order: ["hero_1", "missing_section"]
    };
    expect(() => validateTemplateStructure(invalidTemplate)).toThrow(/in order but not in sections object/);
  });
});

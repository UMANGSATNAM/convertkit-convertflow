import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('variant-swap.js Custom Element Registry Guard', () => {
  it('should not throw NotSupportedError when evaluated multiple times', () => {
    // Setup mock customElements and HTMLElement for Node environment
    const registry = new Map<string, any>();
    const mockCustomElements = {
      get: (name: string) => registry.get(name),
      define: (name: string, constructor: any) => {
        if (registry.has(name)) {
          throw new Error(`NotSupportedError: Failed to execute 'define' on 'CustomElementRegistry': this constructor has already been used with this registry (${name})`);
        }
        registry.set(name, constructor);
      }
    };

    class MockHTMLElement {}

    // Attach mocks to global context for script execution
    const originalCustomElements = (globalThis as any).customElements;
    const originalHTMLElement = (globalThis as any).HTMLElement;

    (globalThis as any).customElements = mockCustomElements;
    (globalThis as any).HTMLElement = MockHTMLElement;

    try {
      const scriptPath = path.resolve(process.cwd(), 'app/data/templates/theme-engine/base-theme/assets/variant-swap.js');
      const scriptContent = fs.readFileSync(scriptPath, 'utf-8');

      // First evaluation - should register elements
      expect(() => {
        new Function(scriptContent)();
      }).not.toThrow();

      expect(registry.has('variant-selects')).toBe(true);
      expect(registry.has('sf-variant-picker')).toBe(true);
      expect(registry.has('variant-radios')).toBe(true);

      // Second evaluation - should NOT throw because of !customElements.get guards
      expect(() => {
        new Function(scriptContent)();
      }).not.toThrow();
    } finally {
      // Restore globals
      (globalThis as any).customElements = originalCustomElements;
      (globalThis as any).HTMLElement = originalHTMLElement;
    }
  });
});

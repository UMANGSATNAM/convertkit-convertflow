import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { upsertThemeFilesBatched } from '../../../app/services/theme-engine/index';
import * as shopifyApi from '../../../app/services/shopify-api.server';

vi.mock('../../../app/services/shopify-api.server', () => {
  return {
    graphqlRequest: vi.fn(),
    restRequest: vi.fn()
  };
});

describe('upsertThemeFilesBatched dedicated unit tests', () => {
  const mockShop = { shopDomain: 'test.myshopify.com', accessToken: 'mock-token' };
  const mockThemeId = '999999';
  let originalMockShopify: string | undefined;

  beforeEach(() => {
    originalMockShopify = process.env.MOCK_SHOPIFY;
    process.env.MOCK_SHOPIFY = 'false'; // Ensure real batching/GraphQL path runs
    vi.clearAllMocks();
  });

  afterEach(() => {
    if (originalMockShopify !== undefined) {
      process.env.MOCK_SHOPIFY = originalMockShopify;
    } else {
      delete process.env.MOCK_SHOPIFY;
    }
  });

  it('batch size never exceeds 50', async () => {
    // Generate 110 dummy files
    const filesToUpload: Record<string, string> = {};
    for (let i = 0; i < 60; i++) {
      filesToUpload[`sections/section-${i}.liquid`] = `<div>Section ${i}</div>`;
    }
    for (let i = 0; i < 50; i++) {
      filesToUpload[`templates/template-${i}.json`] = `{"name": "Template ${i}"}`;
    }

    vi.mocked(shopifyApi.graphqlRequest).mockResolvedValue({
      themeFilesUpsert: { userErrors: [] }
    });

    await upsertThemeFilesBatched(mockShop, mockThemeId, filesToUpload);

    const calls = vi.mocked(shopifyApi.graphqlRequest).mock.calls;
    expect(calls.length).toBeGreaterThan(0);

    // Verify every GraphQL call where files were sent has length <= 50
    for (const call of calls) {
      const vars = call[3] as { files: any[] };
      expect(vars.files.length).toBeLessThanOrEqual(50);
    }
  });

  it('.liquid files are ordered before .json files across batches', async () => {
    const filesToUpload: Record<string, string> = {
      'templates/index.json': '{}',
      'config/settings_data.json': '{}',
      'layout/theme.liquid': '<html></html>',
      'sections/footer-group.json': '{}',
      'sections/hero-banner.liquid': '<div>Hero</div>',
      'snippets/icon.liquid': '<svg></svg>',
      'config/settings_schema.json': '[]'
    };

    const uploadedOrder: string[] = [];
    vi.mocked(shopifyApi.graphqlRequest).mockImplementation(async (_shop, _token, _query, vars: any) => {
      for (const file of vars.files) {
        uploadedOrder.push(file.filename);
      }
      return { themeFilesUpsert: { userErrors: [] } };
    });

    await upsertThemeFilesBatched(mockShop, mockThemeId, filesToUpload);

    const lastLiquidIndex = uploadedOrder.map(f => f.endsWith('.liquid')).lastIndexOf(true);
    const firstJsonIndex = uploadedOrder.findIndex(f => f.endsWith('.json'));

    expect(lastLiquidIndex).toBeGreaterThanOrEqual(0);
    expect(firstJsonIndex).toBeGreaterThanOrEqual(0);
    expect(lastLiquidIndex).toBeLessThan(firstJsonIndex);
  });

  it('401 -> throws immediately, no retry', async () => {
    const filesToUpload = { 'layout/theme.liquid': '<html></html>' };

    vi.mocked(shopifyApi.graphqlRequest).mockRejectedValue(new Error('Shopify API Error 401 Unauthorized'));

    await expect(upsertThemeFilesBatched(mockShop, mockThemeId, filesToUpload)).rejects.toThrow('401');
    expect(shopifyApi.graphqlRequest).toHaveBeenCalledTimes(1);
  });

  it('THROTTLED/429 -> retries with backoff', async () => {
    const filesToUpload = { 'layout/theme.liquid': '<html></html>' };

    let callCount = 0;
    vi.mocked(shopifyApi.graphqlRequest).mockImplementation(async () => {
      callCount++;
      if (callCount === 1) {
        // First call fails with probe or upload THROTTLED
        throw new Error('Shopify API Error THROTTLED - rate limit exceeded');
      }
      return { themeFilesUpsert: { userErrors: [] } };
    });

    await upsertThemeFilesBatched(mockShop, mockThemeId, filesToUpload);

    expect(callCount).toBeGreaterThanOrEqual(2);
  });
});

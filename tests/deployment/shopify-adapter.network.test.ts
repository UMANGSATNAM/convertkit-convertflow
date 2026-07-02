import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeploymentOrchestrator, DeploymentAbortError } from '../../app/services/deployment/deployment-orchestrator';

const mockConfig = {
  storeDomain: 'test.myshopify.com',
  accessToken: 'shpat_test',
  apiVersion: '2024-07'
};

describe('ShopifyDeployer Network Adapter', () => {
  let orchestrator: DeploymentOrchestrator;

  beforeEach(() => {
    orchestrator = new DeploymentOrchestrator('1234567890', mockConfig);
    vi.restoreAllMocks();
    vi.stubGlobal('fetch', vi.fn());
  });

  it('Preflight - Success (200 OK)', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ shop: { name: 'Test Shop' } })
    } as any);

    // Call the private method using any cast
    await expect((orchestrator as any).runPreflightCheck()).resolves.toBeUndefined();
  });

  it('Preflight - Failure (401 Unauthorized)', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 401
    } as any);

    await expect((orchestrator as any).runPreflightCheck()).rejects.toThrowError(DeploymentAbortError);
    await expect((orchestrator as any).runPreflightCheck()).rejects.toThrow('Preflight Failed: HTTP 401');
  });

  it('pushAsset - Success (200 OK)', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ asset: { checksum: 'abc123hash' } })
    } as any);

    const result = await (orchestrator as any).pushAsset('1234567890', 'layout/theme.liquid', 'content', 3, false);
    expect(result.status).toBe('success');
    expect(result.attempts).toBe(1);
    expect(result.checksum).toBe('abc123hash');
  });

  it('pushAsset - 429 Rate Limit Retry', async () => {
    // First call returns 429
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 429,
      headers: new Headers({ 'Retry-After': '0.1' })
    } as any);

    // Second call returns 200
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ asset: { checksum: 'retry_success_hash' } })
    } as any);

    const result = await (orchestrator as any).pushAsset('1234567890', 'layout/theme.liquid', 'content', 3, false);
    expect(result.status).toBe('success');
    expect(result.attempts).toBe(2);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('pushAsset - 422 Unprocessable Hard Abort', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 422,
      text: async () => 'Liquid syntax error'
    } as any);

    await expect(
      (orchestrator as any).pushAsset('1234567890', 'layout/theme.liquid', 'bad_content', 3, false)
    ).rejects.toThrowError(DeploymentAbortError);

    // Ensure it doesn't retry on 422
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  
  it('pushAsset - 500 Transient Server Error Retry', async () => {
    // First call returns 500
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500
    } as any);

    // Second call returns 200
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ asset: { checksum: '500_recovered' } })
    } as any);

    // We'll pass a fast delay internally by mocking setTimeout?
    // Vitest fake timers would be better, but since it's just awaiting promise with small wait:
    // Actually the code uses 1000 * attempt. We can mock setTimeout if we want it to be fast.
    vi.spyOn(global, 'setTimeout').mockImplementation((cb) => { cb(); return {} as any; });

    const result = await (orchestrator as any).pushAsset('1234567890', 'layout/theme.liquid', 'content', 3, false);
    expect(result.status).toBe('success');
    expect(result.attempts).toBe(2);
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});

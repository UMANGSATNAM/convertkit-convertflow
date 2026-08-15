import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { loadVerifiedComponents } from '../../app/services/theme-engine/compiler.server';
import { ValidationError } from '../../app/services/theme-engine/validators.server';
import prisma from '../../app/db.server';

vi.mock('../../app/db.server', () => {
  return {
    default: {
      registryMeta: {
        findUnique: vi.fn()
      },
      componentRegistry: {
        findMany: vi.fn()
      }
    }
  };
});

vi.mock('fs', async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    readFileSync: vi.fn(actual.readFileSync),
    default: {
      ...actual,
      readFileSync: vi.fn(actual.readFileSync),
    }
  };
});

describe('Stage 2.2: SSOT Registry Integrity & Hash Freshness Gates', () => {
  const registryPath = path.resolve(process.cwd(), "app/data/templates/theme-engine/registry.json");
  let realHash: string;
  let expectedCount: number;
  let mockExpectedComponents: any[];

  beforeEach(() => {
    vi.resetAllMocks();
    const realContent = fs.readFileSync(registryPath, "utf-8");
    const canonicalContent = realContent.replace(/\r\n/g, "\n");
    realHash = crypto.createHash("sha256").update(canonicalContent).digest("hex");
    const registryData = JSON.parse(canonicalContent);
    expectedCount = registryData.components.filter((c: any) => c.status === "approved" || c.status === "production").length;
    mockExpectedComponents = Array(expectedCount).fill({ status: 'PUBLISHED', componentId: 'mock-id', sectionType: 'mock-id' });
  });

  it('Case 1 (Positive): resolves components cleanly when disk registry.json hash matches RegistryMeta in DB and count aligns with registry.json', async () => {
    vi.mocked(prisma.registryMeta.findUnique).mockResolvedValue({
      id: 'singleton',
      registryHash: realHash,
      updatedAt: new Date()
    } as any);

    vi.mocked(prisma.componentRegistry.findMany).mockResolvedValue(mockExpectedComponents);

    const result = await loadVerifiedComponents();
    expect(result).toHaveLength(expectedCount);
    expect(prisma.registryMeta.findUnique).toHaveBeenCalledWith({ where: { id: 'singleton' } });
  });

  it('Case 2 (Negative - Stale Hash): throws ValidationError when DB hash does not match disk registry.json (Drift)', async () => {
    vi.mocked(prisma.registryMeta.findUnique).mockResolvedValue({
      id: 'singleton',
      registryHash: '0000000000000000000000000000000000000000000000000000000000000000',
      updatedAt: new Date()
    } as any);

    await expect(loadVerifiedComponents()).rejects.toThrow(/Registry cache stale/);
  });

  it('Case 3 (Negative - Missing Meta): throws ValidationError when RegistryMeta record is missing from DB', async () => {
    vi.mocked(prisma.registryMeta.findUnique).mockResolvedValue(null);

    await expect(loadVerifiedComponents()).rejects.toThrow(/No RegistryMeta record found in database/);
  });

  it('Case 4 (Negative - Row Count Drift High): throws ValidationError when DB returns more components than registry.json (e.g. sentinel pollution)', async () => {
    vi.mocked(prisma.registryMeta.findUnique).mockResolvedValue({
      id: 'singleton',
      registryHash: realHash,
      updatedAt: new Date()
    } as any);

    const mockHighComponents = Array(expectedCount + 1).fill({ status: 'PUBLISHED', componentId: 'mock-id', sectionType: 'mock-id' });
    vi.mocked(prisma.componentRegistry.findMany).mockResolvedValue(mockHighComponents);

    await expect(loadVerifiedComponents()).rejects.toThrow(new RegExp(`SSOT drift detected: expected exactly ${expectedCount} published components in database, found ${expectedCount + 1}`));
  });

  it('Case 5 (Negative - Row Count Drift Low): throws ValidationError when DB returns fewer components than registry.json (e.g. accidental deletion)', async () => {
    vi.mocked(prisma.registryMeta.findUnique).mockResolvedValue({
      id: 'singleton',
      registryHash: realHash,
      updatedAt: new Date()
    } as any);

    const mockLowComponents = Array(expectedCount - 1).fill({ status: 'PUBLISHED', componentId: 'mock-id', sectionType: 'mock-id' });
    vi.mocked(prisma.componentRegistry.findMany).mockResolvedValue(mockLowComponents);

    await expect(loadVerifiedComponents()).rejects.toThrow(new RegExp(`SSOT drift detected: expected exactly ${expectedCount} published components in database, found ${expectedCount - 1}`));
  });

  it('Case 6 (Negative - Malformed JSON / JS-valid syntax): throws ValidationError when registry.json contains malformed JSON (e.g. trailing comma) even if valid JS object literal', async () => {
    const malformedContent = `{ "components": [ { "componentId": "test", "status": "approved", } ] }`;
    vi.mocked(fs.readFileSync).mockReturnValueOnce(malformedContent);

    await expect(loadVerifiedComponents()).rejects.toThrow(/registry\.json is not valid JSON/);
  });

  it('Case 7 (Positive - EOL Normalization Parity): CRLF-formatted registry.json content produces exact LF hash and resolves cleanly', async () => {
    vi.mocked(prisma.registryMeta.findUnique).mockResolvedValue({
      id: 'singleton',
      registryHash: realHash,
      updatedAt: new Date()
    } as any);

    vi.mocked(prisma.componentRegistry.findMany).mockResolvedValue(mockExpectedComponents);

    const realContent = fs.readFileSync(registryPath, "utf-8");
    const crlfContent = realContent.replace(/\r?\n/g, "\r\n");
    vi.mocked(fs.readFileSync).mockReturnValueOnce(crlfContent);

    const result = await loadVerifiedComponents();
    expect(result).toHaveLength(expectedCount);
  });
});


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

describe('Stage 2.2: SSOT Registry Integrity & Hash Freshness Gates', () => {
  const registryPath = path.resolve(process.cwd(), "app/data/templates/theme-engine/registry.json");
  let realHash: string;
  const mock57Components = Array(57).fill({ status: 'PUBLISHED', componentId: 'mock-id' });

  beforeEach(() => {
    vi.resetAllMocks();
    const realContent = fs.readFileSync(registryPath, "utf-8");
    realHash = crypto.createHash("sha256").update(realContent).digest("hex");
  });

  it('Case 1 (Positive): resolves components cleanly when disk registry.json hash matches RegistryMeta in DB and count is 57', async () => {
    vi.mocked(prisma.registryMeta.findUnique).mockResolvedValue({
      id: 'singleton',
      registryHash: realHash,
      updatedAt: new Date()
    } as any);

    vi.mocked(prisma.componentRegistry.findMany).mockResolvedValue(mock57Components);

    const result = await loadVerifiedComponents();
    expect(result).toHaveLength(57);
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

  it('Case 4 (Negative - Row Count Drift High): throws ValidationError when DB returns 58 components (e.g. sentinel pollution)', async () => {
    vi.mocked(prisma.registryMeta.findUnique).mockResolvedValue({
      id: 'singleton',
      registryHash: realHash,
      updatedAt: new Date()
    } as any);

    const mock58Components = Array(58).fill({ status: 'PUBLISHED', componentId: 'mock-id' });
    vi.mocked(prisma.componentRegistry.findMany).mockResolvedValue(mock58Components);

    await expect(loadVerifiedComponents()).rejects.toThrow(/SSOT drift detected: expected exactly 57 published components in database, found 58/);
  });

  it('Case 5 (Negative - Row Count Drift Low): throws ValidationError when DB returns 56 components (e.g. accidental deletion)', async () => {
    vi.mocked(prisma.registryMeta.findUnique).mockResolvedValue({
      id: 'singleton',
      registryHash: realHash,
      updatedAt: new Date()
    } as any);

    const mock56Components = Array(56).fill({ status: 'PUBLISHED', componentId: 'mock-id' });
    vi.mocked(prisma.componentRegistry.findMany).mockResolvedValue(mock56Components);

    await expect(loadVerifiedComponents()).rejects.toThrow(/SSOT drift detected: expected exactly 57 published components in database, found 56/);
  });
});

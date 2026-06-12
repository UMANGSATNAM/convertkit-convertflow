import fs from 'fs';
import path from 'path';
import { uploadAsset } from './theme-engine/index';
import prisma from '../db.server';

const SECTIONS_DIR = path.join(process.cwd(), 'packages', 'sf-sections', 'sections');

export async function getSectionContent(sectionFilename: string): Promise<string> {
  const filePath = path.join(SECTIONS_DIR, sectionFilename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Section file not found: ${sectionFilename}`);
  }
  return fs.promises.readFile(filePath, 'utf-8');
}

export async function injectSectionToTheme(shop: any, themeId: string, sectionFilename: string) {
  const content = await getSectionContent(sectionFilename);
  const assetKey = `sections/${sectionFilename}`;
  
  await uploadAsset(shop, themeId, assetKey, content);
  
  // Optionally, we could record this in InstalledSection
  // but we'll do that at the route level to handle 'addedVia' easily
  return assetKey;
}

export async function seedSectionCatalog() {
  const defaultSections = [
    {
      key: 'hero-banner.liquid',
      name: 'SF Hero Banner',
      nameHi: 'SF हीरो बैनर',
      category: 'HERO',
      goalTags: ['brand_awareness', 'engagement'],
      nicheTags: ['all'],
      planMin: 'FREE',
      thumbUrl: 'https://placehold.co/600x400?text=Hero+Banner',
      previewUrl: 'https://placehold.co/1200x800?text=Hero+Banner+Preview',
      blockHandle: 'sf-hero-banner',
      version: '1.0.0',
      active: true
    }
  ];

  for (const sec of defaultSections) {
    await prisma.sectionCatalog.upsert({
      where: { key: sec.key },
      update: sec as any,
      create: sec as any
    });
  }
}

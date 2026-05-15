import { heroSplitImage } from "./hero-split-image";

export const SECTIONS = {
  "hero-split-image": heroSplitImage,
} as const;

export type SectionId = keyof typeof SECTIONS;

import type { ComponentType } from "react";
import type { z } from "zod";

export type SectionDefinition<TSettings> = {
  id: string;
  name: string;
  category: "hero" | "product" | "social-proof" | "content" | "conversion";
  icon: string;
  schema: z.ZodType<TSettings>;
  defaults: TSettings;
  liquidTemplate: (settings: TSettings) => string;
  SettingsPanel: ComponentType<{
    settings: TSettings;
    onChange: (next: TSettings) => void;
  }>;
};

import { z } from "zod";
import type { SectionDefinition } from "./types";

export const heroSplitImageSchema = z.object({
  eyebrow: z.string().max(60).optional(),
  headline: z.string().min(1).max(140),
  subheadline: z.string().max(280).optional(),
  image: z.object({
    url: z
      .string()
      .url()
      .refine((u) => u.includes("cdn.shopify.com"), {
        message: "Must be a Shopify CDN URL",
      }),
    alt: z.string().max(180),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  }),
  imagePosition: z.enum(["left", "right"]).default("right"),
  ctaPrimary: z
    .object({ label: z.string().min(1).max(40), url: z.string().min(1) })
    .optional(),
  ctaSecondary: z
    .object({ label: z.string().min(1).max(40), url: z.string().min(1) })
    .optional(),
  background: z.enum(["white", "cream", "dark", "gradient"]).default("white"),
  paddingTop: z.enum(["none", "sm", "md", "lg", "xl"]).default("lg"),
  paddingBottom: z.enum(["none", "sm", "md", "lg", "xl"]).default("lg"),
});

export type HeroSplitImageSettings = z.infer<typeof heroSplitImageSchema>;

const defaults: HeroSplitImageSettings = {
  headline: "Your headline goes here",
  subheadline: "A short supporting sentence that builds trust and clarity.",
  image: {
    url: "https://cdn.shopify.com/s/files/1/0000/0001/files/placeholder.png",
    alt: "Hero image",
    width: 1200,
    height: 800,
  },
  imagePosition: "right",
  background: "white",
  paddingTop: "lg",
  paddingBottom: "lg",
};

function liquidTemplate(s: HeroSplitImageSettings): string {
  const bgClass = `om-hero--${s.background}`;
  const ptClass = `om-pt-${s.paddingTop}`;
  const pbClass = `om-pb-${s.paddingBottom}`;
  const imgPos = s.imagePosition === "left" ? "om-hero--img-left" : "";

  const eyebrow = s.eyebrow
    ? `<p class="om-hero__eyebrow">{{ settings.eyebrow }}</p>`
    : "";

  const sub = s.subheadline
    ? `<p class="om-hero__sub">{{ settings.subheadline }}</p>`
    : "";

  const ctas =
    s.ctaPrimary || s.ctaSecondary
      ? `<div class="om-hero__ctas">
    ${s.ctaPrimary ? `<a href="{{ settings.ctaPrimary.url }}" class="om-btn om-btn--primary">{{ settings.ctaPrimary.label }}</a>` : ""}
    ${s.ctaSecondary ? `<a href="{{ settings.ctaSecondary.url }}" class="om-btn om-btn--secondary">{{ settings.ctaSecondary.label }}</a>` : ""}
  </div>`
      : "";

  return `<section class="om-hero ${bgClass} ${ptClass} ${pbClass} ${imgPos}" aria-label="{{ settings.headline | escape }}">
  <div class="om-container">
    <div class="om-hero__grid">
      <div class="om-hero__content">
        ${eyebrow}
        <h2 class="om-hero__headline">{{ settings.headline }}</h2>
        ${sub}
        ${ctas}
      </div>
      <div class="om-hero__image">
        <img
          src="{{ settings.image.url }}"
          alt="{{ settings.image.alt | escape }}"
          width="{{ settings.image.width }}"
          height="{{ settings.image.height }}"
          srcset="{{ settings.image.url }}?width=320 320w, {{ settings.image.url }}?width=640 640w, {{ settings.image.url }}?width=960 960w, {{ settings.image.url }}?width=1280 1280w"
          sizes="(max-width: 768px) 100vw, 50vw"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  </div>
</section>`;
}

// SettingsPanel is client-only — imported lazily in the editor route
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SettingsPanel: any = null; // replaced by dynamic import in editor

export const heroSplitImage: SectionDefinition<HeroSplitImageSettings> = {
  id: "hero-split-image",
  name: "Hero Split Image",
  category: "hero",
  icon: "ImageIcon",
  schema: heroSplitImageSchema,
  defaults,
  liquidTemplate,
  SettingsPanel,
};

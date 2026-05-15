import { Liquid } from "liquidjs";
import { SECTIONS, type SectionId } from "./sections/registry";
import type { Page, Section } from "@prisma/client";

const engine = new Liquid({ strictVariables: false, strictFilters: false });

type PageWithSections = Page & { sections: Section[] };

export async function renderPageToHTML(
  page: PageWithSections
): Promise<string> {
  const sorted = [...page.sections].sort((a, b) => a.order - b.order);
  const parts: string[] = [];

  for (const section of sorted) {
    const def = SECTIONS[section.type as SectionId];
    if (!def) throw new Error(`Unknown section type: ${section.type}`);

    // Validate settings against schema
    const settings = def.schema.parse(section.settings);
    const liquidStr = def.liquidTemplate(settings as never);

    // Server-render Liquid → HTML using liquidjs
    const html = await engine.parseAndRender(liquidStr, { settings });
    parts.push(html);
  }

  return `<div class="om-page" data-handle="${page.handle}">\n${parts.join("\n")}\n</div>`;
}

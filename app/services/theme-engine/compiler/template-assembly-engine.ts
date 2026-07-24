export interface TemplateArtifact {
  shopifyPath: string;
  content: any; // JSON Object
}

export class SectionGroupBuilder {
  buildHeaderGroup(components: any[]): TemplateArtifact {
    const headerComponent = components.find(c => c.componentId?.includes("header")) || { componentId: "header-commerce-v2" };
    const announcementComponent = components.find(c => c.componentId?.includes("announcement")) || { componentId: "announcement-bar-v2" };
    
    const sections: any = {};
    const order: string[] = [];

    if (announcementComponent) {
      sections["announcement"] = {
        type: announcementComponent.componentId,
        settings: {}
      };
      order.push("announcement");
    }

    if (headerComponent) {
      sections["header"] = {
        type: headerComponent.componentId,
        settings: {}
      };
      order.push("header");
    }

    return {
      shopifyPath: "sections/header-group.json",
      content: {
        name: "Header",
        type: "header",
        sections,
        order
      }
    };
  }

  buildFooterGroup(components: any[]): TemplateArtifact {
    const footerComponent = components.find(c => c.componentId?.includes("footer")) || { componentId: "footer_default" };
    
    return {
      shopifyPath: "sections/footer-group.json",
      content: {
        name: "Footer",
        type: "footer",
        sections: {
          footer: {
            type: footerComponent.componentId,
            settings: {}
          }
        },
        order: ["footer"]
      }
    };
  }
}

abstract class PageAssembler {
  abstract assemble(pageData: any): TemplateArtifact;
  
  protected buildSections(sections: any[], excludeTypes: string[] = ["header", "footer"]) {
    const result: any = { sections: {}, order: [] };
    
    sections.forEach((section, index) => {
      const typeStr = section.componentId.toLowerCase();
      // Strict exclusion to prevent duplicate bugs
      if (excludeTypes.some(t => typeStr.includes(t))) {
        return;
      }
      
      const id = `section_${index}_${section.componentId}`;
      result.sections[id] = {
        type: section.componentId,
        settings: section.settings || {}
      };
      result.order.push(id);
    });
    
    return result;
  }
}

export class HomepageAssembler extends PageAssembler {
  assemble(pageData: any): TemplateArtifact {
    const { sections, order } = this.buildSections(pageData.sections);
    return {
      shopifyPath: "templates/index.json",
      content: {
        sections,
        order
      }
    };
  }
}

export class ProductAssembler extends PageAssembler {
  assemble(pageData: any): TemplateArtifact {
    const { sections, order } = this.buildSections(pageData.sections);
    return {
      shopifyPath: "templates/product.json",
      content: {
        sections,
        order
      }
    };
  }
}

export class CollectionAssembler extends PageAssembler {
  assemble(pageData: any): TemplateArtifact {
    const { sections, order } = this.buildSections(pageData.sections);
    return {
      shopifyPath: "templates/collection.json",
      content: {
        sections,
        order
      }
    };
  }
}

export class TemplateAssemblyEngine {
  private sectionGroupBuilder = new SectionGroupBuilder();
  private assemblers: Record<string, PageAssembler> = {
    index: new HomepageAssembler(),
    product: new ProductAssembler(),
    collection: new CollectionAssembler()
  };

  assemble(blueprint: any, components: any[], niche: string): { templates: TemplateArtifact[], sectionGroups: TemplateArtifact[] } {
    const templates: TemplateArtifact[] = [];
    const sectionGroups: TemplateArtifact[] = [];

    // 1. Build strict section groups
    sectionGroups.push(this.sectionGroupBuilder.buildHeaderGroup(components));
    sectionGroups.push(this.sectionGroupBuilder.buildFooterGroup(components));

    // 2. Build templates dynamically based on pages defined in blueprint
    for (const [pageHandle, pageData] of Object.entries(blueprint.pages || {})) {
      const assembler = this.assemblers[pageHandle];
      if (assembler) {
        templates.push(assembler.assemble(pageData));
      } else {
        // Fallback generic assembler if no specific one exists
        const genericAssembler = new HomepageAssembler(); 
        const artifact = genericAssembler.assemble(pageData);
        artifact.shopifyPath = `templates/${pageHandle}.json`;
        templates.push(artifact);
      }
    }

    // Fallback if blueprint didn't have index
    if (!templates.find(t => t.shopifyPath === "templates/index.json")) {
       templates.push(this.assemblers.index.assemble({ sections: [] }));
    }

    return { templates, sectionGroups };
  }
}

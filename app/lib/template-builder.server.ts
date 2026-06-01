export function buildTemplateJSON(sectionsConfig: any) {
  return {
    sections: sectionsConfig.sections || {},
    order: sectionsConfig.order || []
  };
}

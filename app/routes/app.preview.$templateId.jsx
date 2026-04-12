import { getTemplate } from "../data/template-registry";
import { blockToHtml } from "../lib/block-to-html.server";

export const loader = async ({ params }) => {
  const { templateId } = params;
  const template = getTemplate(templateId);

  if (!template) {
    return new Response("Template not found", { status: 404 });
  }

  const htmlContent = blockToHtml(template.data.sections, {
    fonts: template.data.fonts,
    colors: template.data.colors,
  });

  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview: ${template.name}</title>
  <style>
    body { background: ${template.data.colors?.background || '#fff'}; margin: 0; padding: 0; }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>`;

  return new Response(fullHtml, {
    status: 200,
    headers: {
      "Content-Type": "text/html",
    },
  });
};

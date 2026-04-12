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
    body { background: ${template.data.colors?.background || '#fff'}; margin: 0; padding: 0; scroll-behavior: smooth; }
  </style>
</head>
<body>
  ${htmlContent}
  <script>
    window.addEventListener('load', () => {
      // Auto-scrolling feature for live preview interaction
      const SCROLL_SPEED = 1; // Pixels per interval
      const INTERVAL_MS = 25; // Milliseconds between scrolls
      const START_DELAY_MS = 1500; // Wait before scrolling starts
      
      setTimeout(() => {
        let scroller = setInterval(() => {
          // If we reached the bottom of the page, stop scrolling.
          if ((window.innerHeight + Math.ceil(window.scrollY)) >= (document.body.offsetHeight - 5)) {
             clearInterval(scroller);
          } else {
             window.scrollBy(0, SCROLL_SPEED);
          }
        }, INTERVAL_MS);

        // Pause scrolling if user manually hovers or scrolls
        window.addEventListener('wheel', () => clearInterval(scroller));
        window.addEventListener('touchstart', () => clearInterval(scroller));
      }, START_DELAY_MS);
    });
  </script>
</body>
</html>`;

  return new Response(fullHtml, {
    status: 200,
    headers: {
      "Content-Type": "text/html",
    },
  });
};

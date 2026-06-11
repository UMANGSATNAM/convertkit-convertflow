const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'extensions', 'sf-sections', 'blocks');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 118 total sections distributed among categories
const categories = {
  hero: 20,
  product: 20,
  trust: 15,
  content: 20,
  conversion: 20,
  india_special: 20,
  layout: 3 // header, footer, etc.
};

let count = 0;

for (const [category, amount] of Object.entries(categories)) {
  for (let i = 1; i <= amount; i++) {
    count++;
    const id = `${category}-${i}`;
    const name = `${category.charAt(0).toUpperCase() + category.slice(1)} Block ${i}`;
    
    const content = `<div class="sf-${category}-section" id="sf-${id}">
  <!-- Placeholder for ${name} -->
  <h2 style="color: {{ section.settings.heading_color }}">{{ section.settings.title }}</h2>
  {% if section.settings.show_button %}
    <a href="#" class="sf-btn">Click Here</a>
  {% endif %}
</div>

{% schema %}
{
  "name": "${name}",
  "target": "section",
  "settings": [
    { "type": "text", "id": "title", "label": "Title", "default": "${name}" },
    { "type": "color", "id": "heading_color", "label": "Heading Color", "default": "#000000" },
    { "type": "checkbox", "id": "show_button", "label": "Show Button", "default": true }
  ]
}
{% endschema %}
`;

    fs.writeFileSync(path.join(targetDir, `${id}.liquid`), content);
  }
}

console.log(`Generated ${count} section blocks successfully in ${targetDir}`);

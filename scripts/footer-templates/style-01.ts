export default function generate(niche, styleId, paddedIndex) {
  const schemaName = `Foot ${niche.id.substring(0,8)} ${paddedIndex}`;
  const prefix = `ftr-${niche.id}-${paddedIndex}`;
  
  return \`
{% comment %}
  2050 Advanced Footer - \${styleId} (\${niche.name})
{% endcomment %}

<style>
  .\${prefix}-wrapper {
    background-color: \${niche.color3};
    padding: 60px 20px;
    font-family: system-ui, -apple-system, sans-serif;
  }
  .\${prefix}-island {
    max-width: 1200px;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 30px;
    box-shadow: 0 30px 60px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.4);
    overflow: hidden;
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
  }
  /* Futuristic Gradient Blob */
  .\${prefix}-island::before {
    content: '';
    position: absolute;
    top: -50%; left: -50%;
    width: 200%; height: 200%;
    background: radial-gradient(circle at 50% 50%, \${niche.color1}33 0%, transparent 50%);
    z-index: -1;
    animation: \${prefix}-rotate 20s linear infinite;
  }
  @keyframes \${prefix}-rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .\${prefix}-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 40px;
    padding: 60px;
  }
  .\${prefix}-brand h2 {
    font-size: 2rem;
    font-weight: 800;
    margin: 0 0 15px 0;
    background: linear-gradient(135deg, \${niche.color1}, #000);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .\${prefix}-brand p {
    color: #555;
    line-height: 1.6;
    font-size: 1rem;
    max-width: 300px;
  }
  .\${prefix}-col h4 {
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 20px;
    color: #111;
  }
  .\${prefix}-col ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .\${prefix}-col ul li {
    margin-bottom: 12px;
  }
  .\${prefix}-col ul li a {
    text-decoration: none;
    color: #666;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: inline-block;
  }
  .\${prefix}-col ul li a:hover {
    color: \${niche.color1};
    transform: translateX(5px);
  }
  .\${prefix}-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30px 60px;
    border-top: 1px solid rgba(0,0,0,0.05);
    background: rgba(255,255,255,0.3);
  }
  .\${prefix}-form {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }
  .\${prefix}-input {
    padding: 12px 20px;
    border-radius: 30px;
    border: 1px solid rgba(0,0,0,0.1);
    background: rgba(255,255,255,0.5);
    outline: none;
    flex-grow: 1;
    transition: all 0.3s;
  }
  .\${prefix}-input:focus {
    background: #fff;
    border-color: \${niche.color1};
    box-shadow: 0 0 0 3px \${niche.color1}33;
  }
  .\${prefix}-btn {
    padding: 12px 24px;
    border-radius: 30px;
    background: \${niche.color1};
    color: #fff;
    border: none;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
  }
  .\${prefix}-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px \${niche.color1}44;
  }
  
  @media (max-width: 900px) {
    .\${prefix}-grid { grid-template-columns: 1fr 1fr; padding: 40px 30px; }
    .\${prefix}-bottom { flex-direction: column; gap: 20px; text-align: center; padding: 30px; }
  }
  @media (max-width: 600px) {
    .\${prefix}-grid { grid-template-columns: 1fr; }
    .\${prefix}-island { border-radius: 20px; }
  }
</style>

<div class="\${prefix}-wrapper">
  <div class="\${prefix}-island">
    <div class="\${prefix}-grid">
      <div class="\${prefix}-brand">
        <h2>{{ section.settings.brand_name | default: "\${niche.name}" }}</h2>
        <p>{{ section.settings.brand_text | default: "Elevating the future of \${niche.name} with advanced design and uncompromising quality." }}</p>
        
        <form class="\${prefix}-form">
          <input type="email" class="\${prefix}-input" placeholder="Join the future...">
          <button type="submit" class="\${prefix}-btn">→</button>
        </form>
      </div>
      
      {% for block in section.blocks %}
        {% if block.type == 'link_list' %}
          <div class="\${prefix}-col">
            <h4>{{ block.settings.title }}</h4>
            <ul>
              {% for i in (1..4) %}
                <li><a href="#">{{ block.settings.title }} Link {{ i }}</a></li>
              {% endfor %}
            </ul>
          </div>
        {% endif %}
      {% endfor %}
    </div>
    
    <div class="\${prefix}-bottom">
      <div>&copy; {{ 'now' | date: '%Y' }} {{ section.settings.brand_name }}. All rights reserved.</div>
      <div>
        <a href="#" style="color:#666; margin-left:15px; text-decoration:none;">Privacy</a>
        <a href="#" style="color:#666; margin-left:15px; text-decoration:none;">Terms</a>
      </div>
    </div>
  </div>
</div>

{% schema %}
{
  "name": "\${schemaName}",
  "settings": [
    {
      "type": "text",
      "id": "brand_name",
      "label": "Brand Name",
      "default": "\${niche.name}"
    },
    {
      "type": "textarea",
      "id": "brand_text",
      "label": "Brand Description"
    }
  ],
  "blocks": [
    {
      "type": "link_list",
      "name": "Link Column",
      "settings": [
        {
          "type": "text",
          "id": "title",
          "label": "Column Title",
          "default": "Explore"
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "\${schemaName}",
      "blocks": [
        { "type": "link_list", "settings": { "title": "Shop" } },
        { "type": "link_list", "settings": { "title": "About" } },
        { "type": "link_list", "settings": { "title": "Support" } }
      ]
    }
  ]
}
{% endschema %}
\`;
}

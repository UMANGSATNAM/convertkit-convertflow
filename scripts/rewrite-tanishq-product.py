import os

FILE_PATH = r"i:\converflow app\convertkit-convertflow\extensions\convertkit-sections\sections\cf-tanishq-product.liquid"

liquid_content = """{% comment %}
  ConvertFlow — Tanishq Product Page (Redesigned & Functional)
  Authentic tanishq.co.in product detail page with Full Shopify Logic
{% endcomment %}

{% style %}
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600;700&display=swap');
  .cfj-pdp * { margin: 0; padding: 0; box-sizing: border-box; }
  .cfj-pdp { font-family: 'DM Sans', sans-serif; color: #404040; background: #FFFCF5; line-height: 1.6; -webkit-font-smoothing: antialiased; }
  .cfj-pdp a { text-decoration: none; color: inherit; }
  .cfj-pdp h1,.cfj-pdp h2,.cfj-pdp h3 { font-family: 'Playfair Display', serif; color: #2C1810; }
  .cfj-pdp-bread { max-width: 1320px; margin: 0 auto; padding: 20px 40px; font-size: 13px; color: #8B7355; display: flex; align-items: center; gap: 8px; }
  .cfj-pdp-bread a { color: #8B7355; transition: color 0.2s; }
  .cfj-pdp-bread a:hover { color: #D4AF37; }
  .cfj-pdp-bread span { color: #ccc; }
  .cfj-pdp-main { max-width: 1320px; margin: 0 auto; padding: 0 40px 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start; }
  .cfj-pdp-gallery { position: sticky; top: 80px; }
  .cfj-pdp-gallery-main { width: 100%; aspect-ratio: 1; background: #FAF5ED; overflow: hidden; display: flex; align-items: center; justify-content: center; position: relative; border: 1px solid rgba(44,24,16,0.06); }
  .cfj-pdp-gallery-main img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
  .cfj-pdp-thumbs { display: flex; gap: 10px; margin-top: 14px; overflow-x: auto; scrollbar-width: none; }
  .cfj-pdp-thumbs::-webkit-scrollbar { display: none; }
  .cfj-pdp-thumb { width: 72px; height: 72px; flex-shrink: 0; border: 2px solid transparent; background: #FAF5ED; cursor: pointer; overflow: hidden; display: flex; align-items: center; justify-content: center; transition: border-color 0.2s; }
  .cfj-pdp-thumb.active, .cfj-pdp-thumb:hover { border-color: #D4AF37; }
  .cfj-pdp-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .cfj-pdp-details { padding-top: 10px; }
  .cfj-pdp-title { font-size: clamp(24px, 3vw, 32px); font-weight: 700; margin-bottom: 8px; line-height: 1.3; }
  .cfj-pdp-subtitle { font-size: 14px; color: #8B7355; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px; }
  .cfj-pdp-price-block { background: #FAF5ED; padding: 20px 24px; margin-bottom: 24px; border-left: 3px solid #D4AF37; }
  .cfj-pdp-price { font-size: 28px; font-weight: 700; color: #2C1810; }
  .cfj-pdp-compare { font-size: 16px; color: #bbb; text-decoration: line-through; margin-left: 12px; }
  .cfj-pdp-price-note { font-size: 12px; color: #8B7355; margin-top: 6px; }
  .cfj-pdp-size { margin-bottom: 24px; }
  .cfj-pdp-size-label { font-size: 13px; font-weight: 600; color: #2C1810; margin-bottom: 10px; display: flex; justify-content: space-between; text-transform: uppercase; letter-spacing: 1px; }
  .cfj-pdp-sizes { display: flex; gap: 8px; flex-wrap: wrap; }
  .cfj-pdp-size-opt { padding: 10px 16px; border: 1px solid rgba(44,24,16,0.12); font-size: 13px; font-weight: 600; color: #404040; cursor: pointer; transition: all 0.2s; background: #fff; }
  .cfj-pdp-size-opt:hover, .cfj-pdp-size-opt.active { border-color: #D4AF37; color: #D4AF37; background: rgba(212,175,55,0.04); }
  .cfj-pdp-size-opt input { display: none; }
  .cfj-pdp-qty { display: flex; align-items: center; border: 1px solid rgba(44,24,16,0.12); width: fit-content; background: #fff; margin-bottom: 24px; }
  .cfj-pdp-qty button { width: 40px; height: 40px; background: none; border: none; font-size: 18px; cursor: pointer; color: #2C1810; }
  .cfj-pdp-qty input { width: 40px; height: 40px; border: none; text-align: center; font-size: 14px; font-weight: 600; color: #2C1810; -moz-appearance: textfield; }
  .cfj-pdp-qty input::-webkit-outer-spin-button, .cfj-pdp-qty input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
  .cfj-pdp-ctas { display: flex; gap: 12px; margin-bottom: 24px; }
  .cfj-pdp-atc { flex: 1; padding: 16px; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 10px; }
  .cfj-pdp-atc.gold { background: linear-gradient(135deg, #D4AF37, #C5A028); color: #2C1810; }
  .cfj-pdp-atc.gold:hover { background: #F5D060; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(212,175,55,0.3); }
  .cfj-pdp-atc.dark { background: #2C1810; color: #FFFCF5; }
  .cfj-pdp-atc.dark:hover { background: #1a0f0a; transform: translateY(-2px); }
  .cfj-pdp-accordion { border-top: 1px solid rgba(44,24,16,0.06); }
  .cfj-pdp-acc-item { border-bottom: 1px solid rgba(44,24,16,0.06); }
  .cfj-pdp-acc-head { display: flex; justify-content: space-between; align-items: center; padding: 18px 0; cursor: pointer; font-size: 14px; font-weight: 600; color: #2C1810; }
  .cfj-pdp-acc-head svg { width: 18px; height: 18px; color: #8B7355; transition: transform 0.3s; }
  .cfj-pdp-acc-body { padding: 0 0 18px; font-size: 14px; color: #666; line-height: 1.8; display: none; }
  .cfj-pdp-acc-item.open .cfj-pdp-acc-body { display: block; }
  .cfj-pdp-acc-item.open .cfj-pdp-acc-head svg { transform: rotate(180deg); }
  .cfj-pdp-assurance { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px; }
  .cfj-pdp-assure-item { text-align: center; padding: 16px 8px; border: 1px solid rgba(44,24,16,0.06); background: #fff; }
  .cfj-pdp-assure-item svg { width: 24px; height: 24px; color: #D4AF37; margin-bottom: 8px; }
  .cfj-pdp-assure-item span { display: block; font-size: 11px; font-weight: 600; color: #2C1810; line-height: 1.3; text-transform: uppercase; }
  
  @media (max-width: 900px) {
    .cfj-pdp-main { grid-template-columns: 1fr; gap: 30px; padding: 0 16px 40px; }
    .cfj-pdp-gallery { position: static; }
    .cfj-pdp-bread { padding: 16px; }
    .cfj-pdp-ctas { flex-direction: column; }
  }
{% endstyle %}

<div class="cfj-pdp" id="ProductSection-{{ section.id }}" data-section-id="{{ section.id }}" data-product-handle="{{ product.handle }}">
  
  <!-- Breadcrumb -->
  {%- if section.settings.show_breadcrumb -%}
  <div class="cfj-pdp-bread">
    <a href="{{ routes.root_url }}">Home</a><span>›</span>
    {%- if collection -%}
      <a href="{{ collection.url }}">{{ collection.title }}</a><span>›</span>
    {%- endif -%}
    {{ product.title | truncate: 40 }}
  </div>
  {%- endif -%}

  <div class="cfj-pdp-main">
    
    <!-- Gallery -->
    <div class="cfj-pdp-gallery">
      <div class="cfj-pdp-gallery-main">
        {%- assign featured_media = product.selected_or_first_available_variant.featured_media | default: product.featured_media -%}
        {%- if featured_media != blank -%}
          <img id="MainImage-{{ section.id }}" src="{{ featured_media | img_url: '1000x' }}" alt="{{ featured_media.alt | escape }}">
        {%- else -%}
          {{ 'product-1' | placeholder_svg_tag }}
        {%- endif -%}
      </div>
      <div class="cfj-pdp-thumbs">
        {%- for media in product.media -%}
          <div class="cfj-pdp-thumb {% if media == featured_media %}active{% endif %}" data-media-id="{{ media.id }}" onclick="updateMainImage('{{ media | img_url: '1000x' }}', this)">
            <img src="{{ media | img_url: '150x' }}" alt="{{ media.alt | escape }}">
          </div>
        {%- endfor -%}
      </div>
    </div>

    <!-- Product Details (Theme Editor Blocks) -->
    <div class="cfj-pdp-details">
      {%- assign current_variant = product.selected_or_first_available_variant -%}
      
      {%- form 'product', product, id: 'ProductForm-cfj', novalidate: 'novalidate' -%}
        <input type="hidden" name="id" value="{{ current_variant.id }}">
        
        {%- for block in section.blocks -%}
          {%- case block.type -%}
          
            {%- when 'title' -%}
              <h1 class="cfj-pdp-title" {{ block.shopify_attributes }}>{{ product.title }}</h1>
            
            {%- when 'vendor' -%}
              <p class="cfj-pdp-subtitle" {{ block.shopify_attributes }}>{{ product.vendor }}</p>
              
            {%- when 'price' -%}
              <div class="cfj-pdp-price-block" {{ block.shopify_attributes }}>
                <div>
                  <span class="cfj-pdp-price" id="ProductPrice-{{ section.id }}">{{ current_variant.price | money }}</span>
                  <span class="cfj-pdp-compare" id="ComparePrice-{{ section.id }}" style="{% unless current_variant.compare_at_price > current_variant.price %}display:none;{% endunless %}">
                    {{ current_variant.compare_at_price | money }}
                  </span>
                </div>
                <p class="cfj-pdp-price-note">Inclusive of all taxes</p>
              </div>

            {%- when 'variant_picker' -%}
              {%- unless product.has_only_default_variant -%}
                <div class="cfj-variant-selectors" {{ block.shopify_attributes }}>
                  {%- for option in product.options_with_values -%}
                    <div class="cfj-pdp-size">
                      <div class="cfj-pdp-size-label">
                        <span>Select {{ option.name }}</span>
                      </div>
                      <div class="cfj-pdp-sizes">
                        {%- for value in option.values -%}
                          <label class="cfj-pdp-size-opt {% if option.selected_value == value %}active{% endif %}">
                            <input type="radio" name="options[{{ option.name | escape }}]" value="{{ value | escape }}" {% if option.selected_value == value %}checked{% endif %} onchange="onVariantChange(this)">
                            {{ value }}
                          </label>
                        {%- endfor -%}
                      </div>
                    </div>
                  {%- endfor -%}
                </div>
              {%- endunless -%}
              
            {%- when 'quantity_selector' -%}
              <div class="cfj-pdp-size-label" {{ block.shopify_attributes }}><span>Quantity</span></div>
              <div class="cfj-pdp-qty" {{ block.shopify_attributes }}>
                <button type="button" onclick="document.getElementById('Quantity-cfj').stepDown()">−</button>
                <input type="number" id="Quantity-cfj" name="quantity" value="1" min="1">
                <button type="button" onclick="document.getElementById('Quantity-cfj').stepUp()">+</button>
              </div>

            {%- when 'buy_buttons' -%}
              <div class="cfj-pdp-ctas" {{ block.shopify_attributes }}>
                <button type="submit" name="add" class="cfj-pdp-atc gold" id="AddToCart-cfj" {% unless current_variant.available %}disabled{% endunless %}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                  <span id="AddToCartText-cfj">
                    {%- if current_variant.available -%}Add to Cart{%- else -%}Sold Out{%- endif -%}
                  </span>
                </button>
                {%- if block.settings.show_dynamic_checkout -%}
                  {{ form | payment_button }}
                {%- else -%}
                  <button type="button" class="cfj-pdp-atc dark" onclick="document.querySelector('.shopify-payment-button__button').click();" {% unless current_variant.available %}disabled{% endunless %}>Buy Now</button>
                {%- endif -%}
              </div>

            {%- when 'trust_badges' -%}
              <div class="cfj-pdp-assurance" {{ block.shopify_attributes }}>
                <div class="cfj-pdp-assure-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                  <span>{{ block.settings.badge_1 }}</span>
                </div>
                <div class="cfj-pdp-assure-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                  <span>{{ block.settings.badge_2 }}</span>
                </div>
                <div class="cfj-pdp-assure-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                  <span>{{ block.settings.badge_3 }}</span>
                </div>
              </div>

            {%- when 'description' -%}
              <div class="cfj-pdp-accordion" {{ block.shopify_attributes }}>
                <div class="cfj-pdp-acc-item open">
                  <div class="cfj-pdp-acc-head" onclick="this.parentElement.classList.toggle('open')">
                    {{ block.settings.heading }}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                  <div class="cfj-pdp-acc-body">
                    {{ product.description }}
                  </div>
                </div>
              </div>
              
            {%- when 'collapsible_tab' -%}
              <div class="cfj-pdp-accordion" {{ block.shopify_attributes }}>
                <div class="cfj-pdp-acc-item">
                  <div class="cfj-pdp-acc-head" onclick="this.parentElement.classList.toggle('open')">
                    {{ block.settings.heading }}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                  <div class="cfj-pdp-acc-body">
                    {{ block.settings.content }}
                  </div>
                </div>
              </div>

          {%- endcase -%}
        {%- endfor -%}
      {%- endform -%}
    </div>
  </div>
</div>

<script>
  // Variant JSON data
  var productVariants = {{ product.variants | json }};
  
  function updateMainImage(url, thumbEl) {
    document.getElementById('MainImage-{{ section.id }}').src = url;
    document.querySelectorAll('.cfj-pdp-thumb').forEach(function(el) { el.classList.remove('active'); });
    thumbEl.classList.add('active');
  }

  function formatMoney(cents) {
    return '₹' + (cents / 100).toLocaleString('en-IN');
  }

  function onVariantChange(radioInput) {
    // Update active UI states
    var siblings = radioInput.closest('.cfj-pdp-sizes').querySelectorAll('.cfj-pdp-size-opt');
    siblings.forEach(function(el) { el.classList.remove('active'); });
    radioInput.closest('.cfj-pdp-size-opt').classList.add('active');

    // Get selected options
    var form = document.getElementById('ProductForm-cfj');
    var selects = form.querySelectorAll('input[type="radio"]:checked');
    var options = Array.from(selects).map(function(el) { return el.value; });

    // Find matching variant
    var matchedVariant = productVariants.find(function(v) {
      return v.options.every(function(val, index) { return val === options[index]; });
    });

    if (matchedVariant) {
      // Update Hidden ID
      form.querySelector('input[name="id"]').value = matchedVariant.id;
      
      // Update Price
      var priceEl = document.getElementById('ProductPrice-{{ section.id }}');
      var compPriceEl = document.getElementById('ComparePrice-{{ section.id }}');
      if(priceEl) priceEl.innerText = formatMoney(matchedVariant.price);
      if(compPriceEl) {
        if(matchedVariant.compare_at_price > matchedVariant.price) {
          compPriceEl.innerText = formatMoney(matchedVariant.compare_at_price);
          compPriceEl.style.display = 'inline-block';
        } else {
          compPriceEl.style.display = 'none';
        }
      }

      // Update Button
      var btn = document.getElementById('AddToCart-cfj');
      var btnText = document.getElementById('AddToCartText-cfj');
      if (matchedVariant.available) {
        btn.disabled = false;
        btnText.innerText = 'Add to Cart';
      } else {
        btn.disabled = true;
        btnText.innerText = 'Sold Out';
      }
      
      // Update Image if variant has one
      if (matchedVariant.featured_image) {
        var newImgUrl = matchedVariant.featured_image.src;
        document.getElementById('MainImage-{{ section.id }}').src = newImgUrl;
      }
      
      // Update URL
      var newUrl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?variant=' + matchedVariant.id;
      window.history.replaceState({path: newUrl}, '', newUrl);
    }
  }
</script>

{% schema %}
{
  "name": "Tanishq Product",
  "settings": [
    { "type": "checkbox", "id": "show_breadcrumb", "label": "Show Breadcrumb", "default": true }
  ],
  "blocks": [
    { "type": "title", "name": "Title", "limit": 1 },
    { "type": "vendor", "name": "Vendor", "limit": 1 },
    { "type": "price", "name": "Price", "limit": 1 },
    { "type": "variant_picker", "name": "Variant Picker", "limit": 1 },
    { "type": "quantity_selector", "name": "Quantity Selector", "limit": 1 },
    { 
      "type": "buy_buttons", "name": "Buy Buttons", "limit": 1,
      "settings": [
        { "type": "checkbox", "id": "show_dynamic_checkout", "label": "Show Dynamic Checkout Button", "default": true }
      ]
    },
    {
      "type": "trust_badges", "name": "Trust Badges", "limit": 1,
      "settings": [
        { "type": "text", "id": "badge_1", "label": "Badge 1", "default": "Purity Guaranteed" },
        { "type": "text", "id": "badge_2", "label": "Badge 2", "default": "Lifetime Exchange" },
        { "type": "text", "id": "badge_3", "label": "Badge 3", "default": "Certificate Included" }
      ]
    },
    {
      "type": "description", "name": "Product Description", "limit": 1,
      "settings": [
        { "type": "text", "id": "heading", "label": "Heading", "default": "Product Description" }
      ]
    },
    {
      "type": "collapsible_tab", "name": "Collapsible Tab",
      "settings": [
        { "type": "text", "id": "heading", "label": "Heading", "default": "Specifications" },
        { "type": "richtext", "id": "content", "label": "Tab Content", "default": "<p>Add your product specifications here.</p>" }
      ]
    }
  ],
  "presets": [
    {
      "name": "Tanishq Product",
      "blocks": [
        { "type": "title" },
        { "type": "vendor" },
        { "type": "price" },
        { "type": "variant_picker" },
        { "type": "quantity_selector" },
        { "type": "buy_buttons" },
        { "type": "trust_badges" },
        { "type": "description" },
        { "type": "collapsible_tab", "settings": {"heading": "Specifications", "content": "<p>18K Yellow Gold</p>"} },
        { "type": "collapsible_tab", "settings": {"heading": "Shipping & Returns", "content": "<p>Free insured shipping on all orders.</p>"} }
      ]
    }
  ]
}
{% endschema %}
"""

with open(FILE_PATH, "w", encoding="utf-8") as f:
    f.write(liquid_content)

print("Updated cf-tanishq-product.liquid successfully!")

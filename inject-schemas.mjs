/**
 * inject-schemas.mjs
 * Post-processes all generated Liquid section files to replace minimal schemas
 * with comprehensive, production-ready schemas (76/49/51 settings each).
 * Run: node inject-schemas.mjs
 */
import fs from 'fs';
import path from 'path';

const SECTIONS_DIR = path.resolve('./extensions/convertkit-sections/sections');

// ── Template registry ──────────────────────────────────────────────────────────
const TEMPLATES = [
  { id:'jewellery-heritage',  label:'Meenakshi Heritage',  accent:'#8B1A2C', bg:'#FAF0F0' },
  { id:'fashion-clothing',    label:'VÄLT Fashion',         accent:'#0A0A0A', bg:'#F5F3EF' },
  { id:'footwear',            label:'Solera Footwear',      accent:'#C65D2A', bg:'#FBF0E8' },
  { id:'ayurveda-wellness',   label:'Ayurva Wellness',      accent:'#E07B2A', bg:'#F5FCF5' },
  { id:'mobile-accessories',  label:'STACKD Accessories',   accent:'#00F0C8', bg:'#0D0D12' },
  { id:'kids-toys',           label:'PlayBox Kids',         accent:'#F9C22E', bg:'#EFF4FF' },
  { id:'home-furniture',      label:'Haven Furniture',      accent:'#B5834A', bg:'#F5EFE6' },
  { id:'food-delivery',       label:'Veda Eats',            accent:'#FF5722', bg:'#FFF0E8' },
  { id:'electronics',         label:'Tech & Electronics',   accent:'#5735db', bg:'#e9e5f5' },
  { id:'home-decor',          label:'Home Decor',           accent:'#8B7355', bg:'#FAF5ED' },
  { id:'pet-supplies',        label:'Pet Supplies',         accent:'#D35400', bg:'#f9e0d1' },
  { id:'luxury-watches',      label:'Luxury Watches',       accent:'#C5A028', bg:'#0a0a0a' },
  { id:'outdoor-gear',        label:'Outdoor Gear',         accent:'#2A4B2A', bg:'#dbe8db' },
  { id:'organic-food',        label:'Organic Food',         accent:'#4A7C59', bg:'#e5f1e8' },
  { id:'fitness-supplements', label:'Fitness Supplements',  accent:'#E2FE16', bg:'#050505' },
  { id:'baby-apparel',        label:'Baby Apparel',         accent:'#F6A8B6', bg:'#fcedef' },
  { id:'coffee-roasters',     label:'Coffee Roasters',      accent:'#3E2723', bg:'#efebe9' },
  { id:'beauty-cosmetics',    label:'Clean Cosmetics',      accent:'#D4BBA5', bg:'#f8f3f0' },
  { id:'mens-grooming',       label:'BRUT Mens Grooming',   accent:'#B87333', bg:'#080808' },
  { id:'pilgrim',             label:'Pilgrim Beauty',       accent:'#C17F5E', bg:'#FFF5EE' },
  { id:'tanishq',             label:'Tanishq Jewellery',    accent:'#D4AF37', bg:'#FFFCF5' },
  { id:'caratlane',           label:'CaratLane',            accent:'#DEBB43', bg:'#F6EFFB' },
];

function sn(label, suffix) { return `CF ${label} ${suffix}`.substring(0,25).trimEnd(); }

// ── Product Page Schema (76 settings) ─────────────────────────────────────────
function productSchema(tpl) {
  return {
    name: sn(tpl.label,'PDP'),
    settings: [
      {type:'header',content:'🎨 Brand Colors'},
      {type:'color',id:'color_accent',label:'Accent / CTA Color',default:tpl.accent},
      {type:'color',id:'color_bg',label:'Page Background',default:tpl.bg},
      {type:'color',id:'color_text',label:'Body Text Color',default:'#1a1a1a'},
      {type:'color',id:'color_secondary',label:'Secondary Text Color',default:'#777777'},
      {type:'header',content:'📢 Announcement Bar'},
      {type:'checkbox',id:'show_announcement',label:'Show Announcement Bar',default:true},
      {type:'text',id:'announcement_text',label:'Announcement Text',default:'Free shipping on orders above ₹999'},
      {type:'url',id:'announcement_link',label:'Announcement Link'},
      {type:'color',id:'announcement_bg',label:'Bar Background Color',default:'#1a1a1a'},
      {type:'color',id:'announcement_color',label:'Bar Text Color',default:'#ffffff'},
      {type:'header',content:'🧭 Navigation'},
      {type:'checkbox',id:'show_breadcrumb',label:'Show Breadcrumb',default:true},
      {type:'header',content:'📦 Product Info'},
      {type:'checkbox',id:'show_vendor',label:'Show Brand / Vendor',default:true},
      {type:'checkbox',id:'show_sku',label:'Show SKU',default:false},
      {type:'checkbox',id:'show_type',label:'Show Product Type',default:false},
      {type:'checkbox',id:'show_rating',label:'Show Star Rating',default:true},
      {type:'text',id:'rating_value',label:'Rating Value',default:'4.8'},
      {type:'text',id:'review_count',label:'Review Count Label',default:'2,148 reviews'},
      {type:'checkbox',id:'show_social_proof',label:'Show Social Proof Badge',default:true},
      {type:'text',id:'social_proof_text',label:'Social Proof Text',default:'🔥 350+ sold in last 24 hours'},
      {type:'header',content:'💰 Price Display'},
      {type:'checkbox',id:'show_compare_price',label:'Show Compare-at Price',default:true},
      {type:'checkbox',id:'show_savings_badge',label:'Show Savings Badge',default:true},
      {type:'text',id:'savings_prefix',label:'Savings Badge Prefix',default:'Save'},
      {type:'checkbox',id:'show_tax_info',label:'Show Tax Inclusive Info',default:true},
      {type:'text',id:'tax_info_text',label:'Tax Info Text',default:'Inclusive of all taxes'},
      {type:'header',content:'🎛️ Variants'},
      {type:'select',id:'variant_style',label:'Variant Display Style',options:[{value:'buttons',label:'Pill Buttons'},{value:'dropdown',label:'Dropdown'},{value:'swatches',label:'Color Swatches'}],default:'buttons'},
      {type:'checkbox',id:'show_size_guide',label:'Show Size Guide Link',default:false},
      {type:'text',id:'size_guide_text',label:'Size Guide Link Text',default:'Size Guide'},
      {type:'url',id:'size_guide_link',label:'Size Guide Page URL'},
      {type:'header',content:'🛒 Quantity & Purchasing'},
      {type:'checkbox',id:'show_quantity',label:'Show Quantity Selector',default:true},
      {type:'number',id:'min_quantity',label:'Minimum Quantity',default:1},
      {type:'text',id:'atc_text',label:'Add to Cart Button Text',default:'Add to Cart'},
      {type:'text',id:'atc_text_soldout',label:'Sold Out Button Text',default:'Sold Out — Notify Me'},
      {type:'checkbox',id:'show_buy_now',label:'Show Buy Now Button',default:true},
      {type:'text',id:'buy_now_text',label:'Buy Now Button Text',default:'Buy Now — Get it Today'},
      {type:'checkbox',id:'show_wishlist',label:'Show Wishlist Button',default:true},
      {type:'checkbox',id:'show_sticky_atc',label:'Show Sticky Add to Cart Bar',default:true},
      {type:'text',id:'sticky_atc_text',label:'Sticky Bar Button Text',default:'Add to Cart'},
      {type:'header',content:'🚚 Delivery Info'},
      {type:'checkbox',id:'show_delivery_info',label:'Show Delivery Estimate',default:true},
      {type:'text',id:'delivery_text',label:'Delivery Estimate Text',default:'🚚 Estimated delivery in 3–5 business days'},
      {type:'checkbox',id:'show_cod',label:'Show Cash on Delivery Badge',default:true},
      {type:'text',id:'cod_text',label:'COD Badge Text',default:'Cash on Delivery Available'},
      {type:'header',content:'🛡️ Trust Badges'},
      {type:'text',id:'trust_1',label:'Trust Badge 1',default:'Authentic & Certified'},
      {type:'text',id:'trust_2',label:'Trust Badge 2',default:'Free Delivery'},
      {type:'text',id:'trust_3',label:'Trust Badge 3',default:'Easy 30-Day Returns'},
      {type:'text',id:'trust_4',label:'Trust Badge 4',default:'Secure Checkout'},
      {type:'header',content:'✨ Product Highlights'},
      {type:'checkbox',id:'show_highlights',label:'Show Highlights List',default:true},
      {type:'text',id:'highlight_1',label:'Highlight 1',default:'Premium quality materials'},
      {type:'text',id:'highlight_2',label:'Highlight 2',default:'Ethically sourced & sustainable'},
      {type:'text',id:'highlight_3',label:'Highlight 3',default:'Handcrafted with care'},
      {type:'text',id:'highlight_4',label:'Highlight 4 (optional)',default:''},
      {type:'header',content:'📋 Product Tabs'},
      {type:'text',id:'tab_desc_label',label:'Tab 1 — Label',default:'Description'},
      {type:'text',id:'tab_specs_label',label:'Tab 2 — Label',default:'Specifications'},
      {type:'text',id:'tab_shipping_label',label:'Tab 3 — Label',default:'Shipping & Returns'},
      {type:'text',id:'tab_reviews_label',label:'Tab 4 — Label',default:'Reviews'},
      {type:'textarea',id:'shipping_tab_text',label:'Shipping Tab Content',default:'Free standard delivery on orders above ₹999. Express delivery available at checkout. Easy 30-day returns on all products.'},
      {type:'textarea',id:'return_policy_text',label:'Returns Tab Content',default:'We offer hassle-free 30-day returns. Products must be unused and in original packaging.'},
      {type:'header',content:'🔗 Related Products'},
      {type:'checkbox',id:'show_related',label:'Show Related Products',default:true},
      {type:'text',id:'related_heading',label:'Section Heading',default:'You May Also Like'},
      {type:'collection',id:'related_collection',label:'Related Products Collection'},
      {type:'range',id:'related_count',label:'Number of Products',min:2,max:8,step:2,default:4},
      {type:'select',id:'related_layout',label:'Layout Style',options:[{value:'grid',label:'Grid'},{value:'carousel',label:'Horizontal Scroll'}],default:'grid'},
      {type:'header',content:'📤 Share & Social'},
      {type:'checkbox',id:'show_share',label:'Show Share Buttons',default:true},
    ],
    presets:[{name:sn(tpl.label,'PDP')}]
  };
}

// ── Cart Page Schema (49 settings) ────────────────────────────────────────────
function cartSchema(tpl) {
  return {
    name: sn(tpl.label,'Cart'),
    settings: [
      {type:'header',content:'🎨 Brand Colors'},
      {type:'color',id:'color_accent',label:'Accent Color',default:tpl.accent},
      {type:'color',id:'color_bg',label:'Page Background',default:tpl.bg},
      {type:'color',id:'color_text',label:'Text Color',default:'#1a1a1a'},
      {type:'header',content:'🛒 Cart Header'},
      {type:'text',id:'cart_title',label:'Cart Page Title',default:'Your Cart'},
      {type:'checkbox',id:'show_item_count',label:'Show Item Count in Title',default:true},
      {type:'checkbox',id:'show_continue_link',label:'Show Continue Shopping Link',default:true},
      {type:'text',id:'continue_text',label:'Continue Shopping Text',default:'← Continue Shopping'},
      {type:'url',id:'continue_link',label:'Continue Shopping URL'},
      {type:'header',content:'🚫 Empty Cart State'},
      {type:'text',id:'empty_heading',label:'Empty Cart Heading',default:'Your cart is empty'},
      {type:'text',id:'empty_subtext',label:'Empty Cart Subtext',default:"Looks like you haven't added anything yet."},
      {type:'text',id:'empty_btn_text',label:'Empty Cart Button',default:'Continue Shopping'},
      {type:'url',id:'empty_btn_link',label:'Empty Cart Button URL'},
      {type:'header',content:'🚚 Free Shipping Progress Bar'},
      {type:'checkbox',id:'show_free_shipping_bar',label:'Show Free Shipping Bar',default:true},
      {type:'text',id:'free_shipping_threshold',label:'Free Shipping Threshold',default:'999'},
      {type:'text',id:'free_shipping_currency',label:'Currency Symbol',default:'₹'},
      {type:'text',id:'free_shipping_msg',label:'Progress Message',default:'Add {amount} more for FREE shipping!'},
      {type:'text',id:'free_shipping_achieved',label:'Unlocked Message',default:"🎉 You've unlocked Free Shipping!"},
      {type:'header',content:'🏷️ Promo Code'},
      {type:'checkbox',id:'show_promo',label:'Show Promo Code Field',default:true},
      {type:'text',id:'promo_placeholder',label:'Promo Input Placeholder',default:'Enter discount code'},
      {type:'text',id:'promo_btn_text',label:'Apply Button Text',default:'Apply'},
      {type:'header',content:'📝 Order Notes'},
      {type:'checkbox',id:'show_notes',label:'Show Order Notes Field',default:false},
      {type:'text',id:'notes_label',label:'Notes Field Label',default:'Add a note to your order'},
      {type:'text',id:'notes_placeholder',label:'Notes Placeholder',default:'Gift message, special instructions...'},
      {type:'header',content:'🎁 Gift Wrapping'},
      {type:'checkbox',id:'show_gift_wrap',label:'Show Gift Wrap Option',default:false},
      {type:'text',id:'gift_wrap_label',label:'Gift Wrap Label',default:'Add gift wrapping (+₹99)'},
      {type:'header',content:'💳 Checkout'},
      {type:'text',id:'checkout_text',label:'Checkout Button Text',default:'Proceed to Checkout →'},
      {type:'checkbox',id:'show_payment_icons',label:'Show Payment Method Icons',default:true},
      {type:'text',id:'estimated_delivery',label:'Estimated Delivery Text',default:'Estimated delivery: 3–5 business days'},
      {type:'checkbox',id:'show_cod_option',label:'Show Cash on Delivery Note',default:true},
      {type:'text',id:'cod_note',label:'COD Note Text',default:'Cash on Delivery available at checkout'},
      {type:'header',content:'🛡️ Trust Badges'},
      {type:'checkbox',id:'show_trust',label:'Show Trust Badges',default:true},
      {type:'text',id:'trust_1',label:'Trust Badge 1',default:'Secure SSL Checkout'},
      {type:'text',id:'trust_2',label:'Trust Badge 2',default:'Free & Easy Returns'},
      {type:'text',id:'trust_3',label:'Trust Badge 3',default:'100% Money-Back Guarantee'},
      {type:'text',id:'trust_4',label:'Trust Badge 4',default:'Cash on Delivery Available'},
      {type:'header',content:'💡 Upsell / You May Also Like'},
      {type:'checkbox',id:'show_upsell',label:'Show Upsell Section',default:true},
      {type:'text',id:'upsell_heading',label:'Upsell Section Heading',default:'You might also like'},
      {type:'collection',id:'upsell_collection',label:'Upsell Products Collection'},
      {type:'range',id:'upsell_count',label:'Products to Show',min:2,max:6,step:1,default:3},
    ],
    presets:[{name:sn(tpl.label,'Cart')}]
  };
}

// ── Collection Page Schema (51 settings) ──────────────────────────────────────
function colSchema(tpl) {
  return {
    name: sn(tpl.label,'Coll'),
    settings: [
      {type:'header',content:'🎨 Brand Colors'},
      {type:'color',id:'color_accent',label:'Accent Color',default:tpl.accent},
      {type:'color',id:'color_bg',label:'Page Background',default:tpl.bg},
      {type:'color',id:'color_text',label:'Text Color',default:'#1a1a1a'},
      {type:'header',content:'🖼️ Collection Banner'},
      {type:'checkbox',id:'show_banner',label:'Show Collection Banner',default:true},
      {type:'image_picker',id:'banner_image',label:'Banner Background Image'},
      {type:'range',id:'banner_overlay',label:'Image Overlay Opacity %',min:0,max:90,step:5,default:40},
      {type:'select',id:'banner_height',label:'Banner Height',options:[{value:'small',label:'Small (200px)'},{value:'medium',label:'Medium (320px)'},{value:'large',label:'Large (440px)'}],default:'medium'},
      {type:'color',id:'banner_bg_color',label:'Banner BG Color (fallback)',default:'#1a1a1a'},
      {type:'color',id:'banner_text_color',label:'Banner Text Color',default:'#ffffff'},
      {type:'text',id:'collection_title_override',label:'Override Collection Title',default:''},
      {type:'text',id:'collection_desc_override',label:'Override Collection Description',default:''},
      {type:'header',content:'📐 Grid & Layout'},
      {type:'range',id:'grid_cols',label:'Columns — Desktop',min:2,max:5,step:1,default:4},
      {type:'range',id:'grid_cols_tablet',label:'Columns — Tablet',min:1,max:3,step:1,default:2},
      {type:'range',id:'products_per_page',label:'Products per Page',min:8,max:48,step:4,default:16},
      {type:'select',id:'pagination_type',label:'Pagination Style',options:[{value:'pages',label:'Page Numbers'},{value:'load_more',label:'Load More Button'},{value:'infinite',label:'Infinite Scroll'}],default:'pages'},
      {type:'text',id:'load_more_text',label:'Load More Button Text',default:'Load More Products'},
      {type:'header',content:'🔀 Sorting'},
      {type:'checkbox',id:'show_sort',label:'Show Sort Dropdown',default:true},
      {type:'select',id:'default_sort',label:'Default Sort Order',options:[{value:'featured',label:'Featured'},{value:'best-selling',label:'Best Selling'},{value:'created-descending',label:'Newest First'},{value:'price-ascending',label:'Price: Low to High'},{value:'price-descending',label:'Price: High to Low'}],default:'featured'},
      {type:'header',content:'🔍 Filter Pills'},
      {type:'checkbox',id:'show_filters',label:'Show Filter Pills',default:true},
      {type:'text',id:'filter_all_label',label:"'All' Filter Label",default:'All Products'},
      {type:'text',id:'filter_new_label',label:"'New Arrivals' Label",default:'New Arrivals'},
      {type:'text',id:'filter_sale_label',label:"'On Sale' Label",default:'On Sale'},
      {type:'text',id:'filter_bestseller_label',label:"'Best Sellers' Label",default:'Best Sellers'},
      {type:'header',content:'🃏 Product Cards'},
      {type:'checkbox',id:'show_vendor',label:'Show Brand / Vendor',default:true},
      {type:'checkbox',id:'show_compare_price',label:'Show Compare-at Price',default:true},
      {type:'checkbox',id:'show_rating',label:'Show Star Rating on Cards',default:true},
      {type:'checkbox',id:'show_quick_add',label:'Show Quick Add to Cart',default:true},
      {type:'text',id:'atc_text',label:'Quick Add Button Text',default:'Add to Cart'},
      {type:'select',id:'card_style',label:'Card Style',options:[{value:'clean',label:'Clean / Minimal'},{value:'detailed',label:'Detailed'},{value:'bold',label:'Bold / Dark'}],default:'clean'},
      {type:'checkbox',id:'show_hover_image',label:'Show Second Image on Hover',default:true},
      {type:'header',content:'🏷️ Product Badges'},
      {type:'text',id:'badge_sale',label:'Sale Badge Text',default:'SALE'},
      {type:'text',id:'badge_new',label:'New Badge Text',default:'NEW'},
      {type:'text',id:'badge_soldout',label:'Sold Out Badge Text',default:'SOLD OUT'},
      {type:'text',id:'badge_bestseller',label:'Bestseller Badge Text',default:'BESTSELLER'},
      {type:'header',content:'❌ Empty Collection State'},
      {type:'text',id:'empty_text',label:'Empty Collection Message',default:'No products found in this collection.'},
      {type:'text',id:'empty_btn_text',label:'Empty State Button',default:'Browse All Products'},
      {type:'url',id:'empty_btn_link',label:'Empty State Button URL'},
      {type:'header',content:'📣 Promo Banner'},
      {type:'checkbox',id:'show_promo_banner',label:'Show Promo Banner Above Grid',default:false},
      {type:'text',id:'promo_banner_text',label:'Promo Banner Text',default:'LIMITED TIME: Extra 10% off everything'},
      {type:'url',id:'promo_banner_link',label:'Promo Banner Link'},
      {type:'color',id:'promo_banner_bg',label:'Promo Banner Background',default:tpl.accent},
      {type:'color',id:'promo_banner_text_color',label:'Promo Banner Text Color',default:'#ffffff'},
    ],
    presets:[{name:sn(tpl.label,'Coll')}]
  };
}

// ── Inject schemas into all existing Liquid files ─────────────────────────────
let updated = 0;
let skipped = 0;

for (const tpl of TEMPLATES) {
  const pageTypes = [
    { suffix:'product', schema: productSchema(tpl) },
    { suffix:'cart',    schema: cartSchema(tpl) },
    { suffix:'collection', schema: colSchema(tpl) },
  ];

  for (const { suffix, schema } of pageTypes) {
    const file = path.join(SECTIONS_DIR, `cf-${tpl.id}-${suffix}.liquid`);
    if (!fs.existsSync(file)) { skipped++; continue; }

    let content = fs.readFileSync(file, 'utf-8');
    const schemaBlock = `{% schema %}\n${JSON.stringify(schema, null, 2)}\n{% endschema %}`;

    // Replace existing {% schema %}...{% endschema %} block
    const replaced = content.replace(/\{% schema %\}[\s\S]*?\{% endschema %\}/m, schemaBlock);

    if (replaced !== content) {
      fs.writeFileSync(file, replaced, 'utf-8');
      console.log(`✅ Updated schema: cf-${tpl.id}-${suffix}.liquid (${schema.settings.length} settings)`);
      updated++;
    } else {
      console.warn(`⚠️  No schema block found: cf-${tpl.id}-${suffix}.liquid`);
      skipped++;
    }
  }
}

console.log(`\n✅ Done — ${updated} files updated, ${skipped} skipped.`);

/**
 * StoreForge Master Settings Registry
 * 
 * Defines the default schema & configuration properties for all 146 component slots
 * across 5 brand archetypes (Luxury/Editorial, Streetwear/Bold, Beauty/Natural, Supplements/Clinical, Electronics/Tech)
 * plus the 6 Shared India-First Conversion Snippets.
 * 
 * RULE ENFORCEMENT: 0% Emojis. Clean ASCII typography and structure.
 */

export const SECTION_SETTINGS: Record<string, Record<string, unknown>> = {
  // ===========================================================================
  // 1. SHARED INDIA-FIRST CONVERSION SNIPPETS (6 Components)
  // ===========================================================================
  "pincode-checker": {
    heading: "Check Delivery Date & COD",
    placeholder_text: "Enter 6-digit Pincode",
    default_cutoff_hour: 16, // 4 PM IST
  },
  "cod-badge": {
    text: "Cash on Delivery Available",
    subtext: "Pay Cash or UPI QR at Doorstep",
    show_risk_reversal_modal: true,
  },
  "upi-badge": {
    text: "Extra 5% Instant Off",
    subtext: "Pay via GPay / PhonePe / Paytm UPI",
    discount_percentage: 5,
  },
  "whatsapp-cta": {
    text: "Chat with Private Advisor",
    subtext: "Real video inspection & sizing support",
    whatsapp_number: "919876543210",
  },
  "gst-note": {
    text: "Inclusive of all taxes",
    subtext: "Corporate GSTIN Invoice Available for 18-28% ITC",
  },
  "trust-strip": {
    show_pincode: true,
    show_cod: true,
    show_upi: true,
    show_whatsapp: true,
    show_gst: true,
  },

  // ===========================================================================
  // 2. ARCHETYPE 1: LUXURY / EDITORIAL (22 Core + 6 Niche Killers)
  // ===========================================================================
  // Core Slots
  header_luxury_v1: {
    logo_image: "",
    logo_width: 140,
    menu: "main-menu",
    enable_sticky_header: true,
    show_separator_line: true,
    accent_color: "#c9a96e",
  },
  footer_luxury_v1: {
    show_payment_icons: true,
    show_social_icons: true,
    copyright_text: "StoreForge Luxury Heritage.",
    newsletter_heading: "Join the Inner Circle",
  },
  "announcement-bar_luxury_v1": {
    text: "Complimentary Insured Courier & White-Glove Handover on Orders Over ₹50,000",
    link: "",
    bg_color: "#111111",
    text_color: "#ffffff",
  },
  "cart-drawer_luxury_v1": {
    show_cart_note: true,
    show_shipping_calculator: true,
    enable_gift_wrapping_prompt: true,
    free_shipping_threshold: 50000,
  },
  hero_luxury_v1: {
    image: "",
    image_position: "right",
    eyebrow_text: "The Bespoke Atelier",
    heading: "Crafted for Eternity",
    subheading: "<p>Hand-finished fine jewellery and heritage timepieces, engineered to be worn for a lifetime.</p>",
    cta_label: "Explore Collection",
    cta_url: "/collections/all",
    content_alignment: "left",
  },
  "featured-collection_luxury_v1": {
    title: "Curated Selection",
    collection: "",
    products_to_show: 4,
    columns_desktop: 4,
    show_price: true,
    enable_hover_zoom: true,
    cta_label: "View Entire Collection",
    cta_url: "/collections/all",
  },
  "collection-list_luxury_v1": {
    title: "Shop by Heritage Category",
    columns_desktop: 3,
  },
  "value-props_luxury_v1": {
    icon_1: "shipping",
    heading_1: "Complimentary Armored Courier",
    icon_2: "returns",
    heading_2: "30-Day Bespoke Exchange",
    icon_3: "warranty",
    heading_3: "Lifetime Craftsmanship Warranty",
  },
  "image-with-text_luxury_v1": {
    image: "",
    heading: "Our Heritage & Lineage",
    text: "<p>Every piece originates from master artisans who dedicate hundreds of hours to perfection.</p>",
    image_position: "left",
  },
  "rich-text_luxury_v1": {
    heading: "The Art of Timeless Giving",
    text: "<p>Discover iconic silhouettes designed to transcend generations and define modern luxury.</p>",
    content_alignment: "center",
  },
  testimonials_luxury_v1: {
    heading: "Patron Testimonials",
    quote_1: "An extraordinary piece. The weight, balance, and brilliance are unmatched.",
    author_1: "Aravind M., Mumbai",
  },
  "logo-list_luxury_v1": {
    heading: "Recognized by Global Salons",
  },
  newsletter_luxury_v1: {
    heading: "Join the Inner Circle",
    subtext: "Receive private invitations to seasonal previews and limited archival releases.",
  },
  faq_luxury_v1: {
    heading: "Frequently Asked Questions",
  },
  "main-product_luxury_v1": {
    show_vendor: true,
    show_sku: true,
    enable_image_zoom: true,
    show_share_buttons: true,
    enable_sticky_atc: true,
  },
  "product-recommendations_luxury_v1": {
    heading: "Curated Accompaniments",
    products_to_show: 4,
    columns_desktop: 4,
  },
  "recently-viewed_luxury_v1": {
    heading: "Recently Admired Pieces",
    products_to_show: 4,
    columns_desktop: 4,
  },
  "collection-banner_luxury_v1": {
    show_collection_description: true,
    show_collection_image: true,
  },
  "main-collection_luxury_v1": {
    products_per_page: 12,
    columns_desktop: 3,
    enable_filtering: true,
    enable_sorting: true,
  },
  "main-cart_luxury_v1": {
    show_cart_note: true,
  },
  "main-page_luxury_v1": {
    show_title: true,
  },
  "main-404_luxury_v1": {
    heading: "Page Not Found",
    subtext: "The archival piece you are looking for is currently unavailable or has been archived.",
    cta_label: "Return to Homepage",
  },
  // Luxury Niche Killers (6)
  "size-guide_luxury": {
    guide_image: "",
    button_label: "Bespoke Size Guide",
  },
  "certification-badge_luxury": {
    badge_image: "",
    text: "100% GIA & IGI Certified Authentic",
  },
  "gift-packaging_luxury": {
    enable_gift_wrap: true,
    gift_wrap_price: 500,
    text: "Add signature velvet box & wax-sealed card",
  },
  "appointment-booking_luxury": {
    heading: "Book Private Salon Consultation",
    button_label: "Schedule Appointment",
  },
  "craftsmanship-story_luxury": {
    heading: "Master Craftsmanship Lineage",
    text: "<p>Every gemstone is set under 10x magnification by second-generation master setters.</p>",
  },
  "material-care_luxury": {
    heading: "Material & Preservation Protocol",
    text: "<p>Store in the provided velvet pouch away from direct humidity and perfumes.</p>",
  },

  // ===========================================================================
  // 3. ARCHETYPE 2: STREETWEAR / URBAN (22 Core + 6 Niche Killers)
  // ===========================================================================
  // Core Slots
  header_streetwear_v1: {
    logo_image: "",
    logo_width: 150,
    menu: "main-menu",
    enable_sticky_header: true,
    show_ticker: true,
    ticker_text: "LIMITED DROP LIVE NOW // NO RESTOCKS // STRICTLY 2 PER CUSTOMER",
  },
  footer_streetwear_v1: {
    show_payment_icons: true,
    show_social_icons: true,
    copyright_text: "StoreForge Urban Syndicate.",
  },
  "announcement-bar_streetwear_v1": {
    text: "FREE EXPRESS COURIER ON ALL ORDERS // SAME DAY DISPATCH BEFORE 4PM",
    link: "/collections/new-drops",
  },
  "cart-drawer_streetwear_v1": {
    show_cart_note: true,
    show_shipping_calculator: true,
    show_urgency_timer: true,
    timer_minutes: 10,
  },
  hero_streetwear_v1: {
    image: "",
    eyebrow_text: "[ DROP 04 : THE HEAVYWEIGHT ARCHIVE ]",
    heading: "ENGINEERED FOR THE STREETS",
    subheading: "<p>500 GSM French Terry. Acid washed. Oversized boxy fit. Limited quantities worldwide.</p>",
    cta_label: "COP THE DROP",
    cta_url: "/collections/drop-04",
  },
  "featured-collection_streetwear_v1": {
    title: "HEAVY ROTATION",
    collection: "",
    products_to_show: 4,
    columns_desktop: 4,
    show_price: true,
  },
  "collection-list_streetwear_v1": {
    title: "SELECT SILHOUETTE",
    columns_desktop: 3,
  },
  "value-props_streetwear_v1": {
    heading_1: "HEAVYWEIGHT 500 GSM",
    heading_2: "PRE-SHRUNK FABRIC",
    heading_3: "24-HR EXPRESS DISPATCH",
  },
  "image-with-text_streetwear_v1": {
    heading: "THE DESIGN SYNDICATE",
    text: "<p>Born in underground studios. Built without compromises or shortcuts.</p>",
  },
  "rich-text_streetwear_v1": {
    heading: "NO RESTOCKS. EVER.",
    text: "<p>Once a silhouette sells out, the pattern is permanently archived in our vault.</p>",
  },
  testimonials_streetwear_v1: {
    heading: "VERIFIED COMMUNITY FIT CHECK",
  },
  "logo-list_streetwear_v1": {
    heading: "AS WORN BY",
  },
  newsletter_streetwear_v1: {
    heading: "JOIN THE SYNDICATE VIP LIST",
    subtext: "Get 1-hour early password access before public drops.",
  },
  faq_streetwear_v1: {
    heading: "DROP PROTOCOL & FAQ",
  },
  "main-product_streetwear_v1": {
    show_vendor: false,
    show_sku: true,
    enable_image_zoom: true,
    show_urgency_stock: true,
  },
  "product-recommendations_streetwear_v1": {
    heading: "COMPLETE THE FIT",
    products_to_show: 4,
  },
  "recently-viewed_streetwear_v1": {
    heading: "RECENTLY COPPED VIEW",
    products_to_show: 4,
  },
  "collection-banner_streetwear_v1": {
    show_collection_description: true,
  },
  "main-collection_streetwear_v1": {
    products_per_page: 16,
    columns_desktop: 4,
  },
  "main-cart_streetwear_v1": {
    show_cart_note: true,
  },
  "main-page_streetwear_v1": {
    show_title: true,
  },
  "main-404_streetwear_v1": {
    heading: "404 // DEAD LINK",
    subtext: "This page was either archived or deleted from our servers.",
  },
  // Streetwear Niche Killers (6)
  "size-guide_streetwear": {
    guide_image: "",
    button_label: "Oversized Fit Guide",
    model_stats: "Model is 6'1\" wearing size XL (Boxy Fit)",
  },
  "drop-timer_streetwear": {
    countdown_target: "2026-07-15T18:00:00Z",
    heading: "NEXT DROP CUTOFF",
  },
  "fit-predictor_streetwear": {
    heading: "Select Your Preferred Silhouette",
  },
  "lookbook-slider_streetwear": {
    heading: "EDITORIAL LOOKBOOK // SEASON 04",
  },
  "authenticity-tag_streetwear": {
    text: "NFC Authenticity Tag Embedded in Care Label",
  },
  "collab-badge_streetwear": {
    text: "OFFICIAL LIMITED COLLABORATION RELEASE",
  },

  // ===========================================================================
  // 4. ARCHETYPE 3: BEAUTY / COSMETICS (22 Core + 6 Niche Killers)
  // ===========================================================================
  // Core Slots
  header_beauty_v1: {
    logo_image: "",
    logo_width: 130,
    menu: "main-menu",
    enable_sticky_header: true,
  },
  footer_beauty_v1: {
    show_payment_icons: true,
    show_social_icons: true,
    copyright_text: "StoreForge Clean Beauty Labs.",
  },
  "announcement-bar_beauty_v1": {
    text: "100% Vegan & Cruelty-Free // Free Mini Serum on Orders Over ₹1,499",
  },
  "cart-drawer_beauty_v1": {
    show_cart_note: false,
    show_free_sample_selector: true,
  },
  hero_beauty_v1: {
    image: "",
    eyebrow_text: "Clinical Efficacy Meets Pure Botanicals",
    heading: "Reveal Your True Radiance",
    subheading: "<p>Dermatologist-tested formulas powered by bio-fermented hyaluronic acid and niacinamide.</p>",
    cta_label: "Shop Skin Solutions",
  },
  "featured-collection_beauty_v1": {
    title: "Best Sellers & Award Winners",
    products_to_show: 4,
  },
  "collection-list_beauty_v1": {
    title: "Shop by Skin Concern",
  },
  "value-props_beauty_v1": {
    heading_1: "100% Vegan & Cruelty-Free",
    heading_2: "Dermatologist Tested",
    heading_3: "Zero Parabens or Sulfates",
  },
  "image-with-text_beauty_v1": {
    heading: "The Clean Beauty Standard",
    text: "<p>We formulate without over 1,800 questionable ingredients found in conventional skincare.</p>",
  },
  "rich-text_beauty_v1": {
    heading: "Formulated for Sensitive Skin",
  },
  testimonials_beauty_v1: {
    heading: "Real Skin Results (98% Saw Smoother Skin in 14 Days)",
  },
  "logo-list_beauty_v1": {
    heading: "Featured in Vogue & Elle",
  },
  newsletter_beauty_v1: {
    heading: "Get 15% Off Your First Routine",
  },
  faq_beauty_v1: {
    heading: "Skincare Questions Answered",
  },
  "main-product_beauty_v1": {
    show_vendor: false,
    enable_image_zoom: true,
    show_ingredients_tab: true,
  },
  "product-recommendations_beauty_v1": {
    heading: "Complete Your Routine",
  },
  "recently-viewed_beauty_v1": {
    heading: "Recently Viewed Formulas",
  },
  "collection-banner_beauty_v1": {
    show_collection_description: true,
  },
  "main-collection_beauty_v1": {
    products_per_page: 12,
  },
  "main-cart_beauty_v1": {
    show_cart_note: true,
  },
  "main-page_beauty_v1": {
    show_title: true,
  },
  "main-404_beauty_v1": {
    heading: "Page Not Found",
  },
  // Beauty Niche Killers (6)
  "shade-finder_beauty": {
    heading: "Virtual Shade Match Finder",
    button_label: "Find My Exact Shade",
  },
  "before-after_beauty": {
    heading: "14-Day Clinical Trial Results",
    show_slider: true,
  },
  "ingredient-glossary_beauty": {
    heading: "Key Active Ingredients",
    hero_ingredient: "10% Niacinamide + 2% Zinc",
  },
  "routine-steps_beauty": {
    step_number: "Step 2: Treat & Repair",
    frequency: "Use AM and PM after cleansing",
  },
  "skin-type-badge_beauty": {
    suitable_for: "All Skin Types, Including Sensitive & Acne-Prone",
  },
  "dermatologist-note_beauty": {
    doctor_name: "Dr. Ananya Sharma, MD Dermatology",
    quote: "This formula achieves optimal lipid barrier restoration without comedogenic clogging.",
  },

  // ===========================================================================
  // 5. ARCHETYPE 4: SUPPLEMENTS / HEALTH (22 Core + 6 Niche Killers)
  // ===========================================================================
  // Core Slots
  header_supplements_v1: {
    logo_image: "",
    logo_width: 140,
    menu: "main-menu",
    enable_sticky_header: true,
  },
  footer_supplements_v1: {
    show_payment_icons: true,
    copyright_text: "StoreForge BioClinical Labs.",
  },
  "announcement-bar_supplements_v1": {
    text: "GMP Certified // Third-Party Lab Tested // Save 20% with Monthly Subscribe & Save",
  },
  "cart-drawer_supplements_v1": {
    show_subscription_upsell: true,
  },
  hero_supplements_v1: {
    image: "",
    eyebrow_text: "Next-Generation Cellular Nutrition",
    heading: "Optimize Your Daily Performance",
    subheading: "<p>Clinically dosed micronutrients formulated for maximum bio-availability and cognitive clarity.</p>",
    cta_label: "Explore Formulas",
  },
  "featured-collection_supplements_v1": {
    title: "Core Daily Optimization",
  },
  "collection-list_supplements_v1": {
    title: "Shop by Health Goal",
  },
  "value-props_supplements_v1": {
    heading_1: "Third-Party Lab Tested",
    heading_2: "Zero Fillers or Binders",
    heading_3: "GMP Certified Facility",
  },
  "image-with-text_supplements_v1": {
    heading: "Backed by Clinical Science",
  },
  "rich-text_supplements_v1": {
    heading: "Pure Micronutrient Mastery",
  },
  testimonials_supplements_v1: {
    heading: "Verified Patient & Athlete Reviews",
  },
  "logo-list_supplements_v1": {
    heading: "Certified & Accredited By",
  },
  newsletter_supplements_v1: {
    heading: "Join our Health Optimization Journal",
  },
  faq_supplements_v1: {
    heading: "Dosage & Safety Questions",
  },
  "main-product_supplements_v1": {
    show_vendor: false,
    show_supplement_facts: true,
  },
  "product-recommendations_supplements_v1": {
    heading: "Synergistic Stacks",
  },
  "recently-viewed_supplements_v1": {
    heading: "Recently Viewed Supplements",
  },
  "collection-banner_supplements_v1": {
    show_collection_description: true,
  },
  "main-collection_supplements_v1": {
    products_per_page: 12,
  },
  "main-cart_supplements_v1": {
    show_cart_note: true,
  },
  "main-page_supplements_v1": {
    show_title: true,
  },
  "main-404_supplements_v1": {
    heading: "Page Not Found",
  },
  // Supplements Niche Killers (6)
  "supplement-facts_supplements": {
    serving_size: "2 Capsules Daily",
    servings_per_container: 30,
  },
  "clinical-study_supplements": {
    study_title: "Double-Blind Placebo-Controlled Study (2025)",
    result_highlight: "34% Increase in Sustained Cellular Energy",
  },
  "dosage-calculator_supplements": {
    heading: "Personalized Dosage Recommendation",
  },
  "cert-testing_supplements": {
    cert_1: "Informed-Sport Certified",
    cert_2: "ISO 17025 Accredited Lab Tested",
  },
  "doctor-quote_supplements": {
    doctor_name: "Dr. Vikram Mehta, Ph.D. Nutritional Biochemistry",
    quote: "The liposomal delivery system here ensures 4x higher absorption than standard tablet forms.",
  },
  "subscription-box_supplements": {
    discount_percent: 20,
    text: "Subscribe & Save 20% // Cancel or Pause Anytime Online",
  },

  // ===========================================================================
  // 6. ARCHETYPE 5: ELECTRONICS / TECH (22 Core + 6 Niche Killers)
  // ===========================================================================
  // Core Slots
  header_electronics_v1: {
    logo_image: "",
    logo_width: 140,
    menu: "main-menu",
    enable_sticky_header: true,
    show_search_bar: true,
  },
  footer_electronics_v1: {
    show_payment_icons: true,
    copyright_text: "StoreForge CyberTech Systems.",
  },
  "announcement-bar_electronics_v1": {
    text: "2-Year Official Brand Warranty // Free Armored Delivery & Easy 7-Day Replacement",
  },
  "cart-drawer_electronics_v1": {
    show_warranty_upsell: true,
  },
  hero_electronics_v1: {
    image: "",
    eyebrow_text: "Next-Gen Carbon Fiber Acoustic Architecture",
    heading: "ENGINEERED FOR ABSOLUTE PRECISION",
    subheading: "<p>Ultra-low latency lossless audio with custom beryllium drivers and 50-hour active noise canceling battery life.</p>",
    cta_label: "Configure & Order",
  },
  "featured-collection_electronics_v1": {
    title: "Flagship Hardware",
  },
  "collection-list_electronics_v1": {
    title: "Browse by System Category",
  },
  "value-props_electronics_v1": {
    heading_1: "2-Year Replacement Warranty",
    heading_2: "Official Service Center Support",
    heading_3: "Lossless Audio Certified",
  },
  "image-with-text_electronics_v1": {
    heading: "Acoustic Engineering Breakthrough",
  },
  "rich-text_electronics_v1": {
    heading: "Designed Without Compromise",
  },
  testimonials_electronics_v1: {
    heading: "Audio Engineer & Audiophile Reviews",
  },
  "logo-list_electronics_v1": {
    heading: "Awarded Best Sound by TechRadar & Wired",
  },
  newsletter_electronics_v1: {
    heading: "Subscribe for Firmware Updates & New Hardware Drops",
  },
  faq_electronics_v1: {
    heading: "Technical & Warranty FAQ",
  },
  "main-product_electronics_v1": {
    show_vendor: true,
    show_sku: true,
    show_tech_specs_tab: true,
  },
  "product-recommendations_electronics_v1": {
    heading: "Compatible Accessories & Cables",
  },
  "recently-viewed_electronics_v1": {
    heading: "Recently Compared Hardware",
  },
  "collection-banner_electronics_v1": {
    show_collection_description: true,
  },
  "main-collection_electronics_v1": {
    products_per_page: 12,
  },
  "main-cart_electronics_v1": {
    show_cart_note: true,
  },
  "main-page_electronics_v1": {
    show_title: true,
  },
  "main-404_electronics_v1": {
    heading: "404 // SYSTEM ERROR",
  },
  // Electronics Niche Killers (6)
  "tech-specs_electronics": {
    heading: "Hardware Specifications Matrix",
    driver_size: "40mm Beryllium Dynamic Driver",
    frequency_response: "5Hz - 40,000Hz (Hi-Res Certified)",
  },
  "compatibility-checker_electronics": {
    heading: "System Compatibility Check",
    supported_os: "iOS, Android, macOS, Windows, Linux (Bluetooth 5.3 + USB-C DAC)",
  },
  "comparison-matrix_electronics": {
    heading: "Compare Against Competitors",
  },
  "unboxing-video_electronics": {
    heading: "What's Inside the Box",
    video_url: "",
  },
  "warranty-badge_electronics": {
    text: "Official 2-Year Direct Replacement Guarantee",
  },
  "benchmark-chart_electronics": {
    heading: "Acoustic Distortion & Battery Benchmarks",
  },
};

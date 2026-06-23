# StoreForge v2.0 — Architecture Freeze
# STATUS: FROZEN — DO NOT MODIFY WITHOUT CEO APPROVAL
# Frozen: 2026-06-24

---

## Mission

StoreForge is an AI-powered Shopify Agency Operating System.

The goal is NOT to generate Shopify themes.
The goal is to generate agency-quality Shopify stores that feel custom-built by an experienced Shopify agency.

Flow:
1. Analyze the business
2. Analyze the catalog
3. Analyze the brand
4. Select compatible components
5. Assemble a complete Shopify store
6. Publish a preview-ready theme

Target output quality:
- Professional
- Conversion-focused
- Mobile-first
- SEO-ready
- Fast
- Brand-consistent
- Agency-quality

---

## Core Principle (NEVER VIOLATE)

Store generation MUST NEVER rely on runtime Liquid generation.

AI generates strategy. AI does NOT generate production theme code during merchant generation.

AI responsibilities:
- Analyze
- Detect
- Classify
- Select
- Assemble

The moat is:
- Component Library
- Design System
- Compatibility Engine
- Brand Intelligence
- Theme Composer

---

## Architecture Layers

### Layer 1 — Universal Commerce Engine (FROZEN)

Location: core/

Includes:
- Cart
- Search
- Variants
- Product Logic
- Inventory
- Customer Accounts
- Currency
- Checkout Integration
- SEO
- Structured Data
- Analytics
- Responsive Framework

Files:
core/
├── layout/theme.liquid
├── assets/ (cart.js, variant-swap.js, sticky-atc.js, search.js, animations.css, utils.js)
├── sections/main-product.liquid  ← UNIVERSAL PDP
├── sections/main-cart.liquid
└── templates/ (index.json, product.json, collection.json, etc.)

Rule: One version only. NEVER duplicated. NEVER niche-specific.

---

### Layer 2 — Design Token System

Location: niche-tokens/

Controls:
- Colors (primary, secondary, background, text, accent)
- Typography (heading family, body family, size scale)
- Radius (card, button, badge)
- Shadows
- Spacing
- Buttons
- Cards
- Animation Intensity

One .css file per archetype. Only token values change. Structure stays universal.

---

### Layer 3 — Reusable Component Library

Location: components/

Built by STYLE. NOT by niche.

Folders:
- components/hero/
- components/header/
- components/footer/
- components/trust/
- components/faq/
- components/testimonials/
- components/newsletter/
- components/brand-story/
- components/collections/
- components/product-grid/
- components/pdp-extensions/

Naming: hero-editorial-luxury, hero-bold-streetwear, hero-tech-spec

Every component has metadata (family, archetypes, style tags, mobile score).
Components are REUSED across multiple niches.

Component Pool Rule:
Every slot MUST have minimum 3-5 variants.
- hero-luxury-v1, hero-luxury-v2, hero-luxury-v3...
This ensures no two stores look identical.

---

### Layer 3.5 — Component Factory (INTERNAL ONLY)

Used for growing the library. NEVER used during merchant generation.

Workflow:
Request → Antigravity generates Liquid + CSS + Schema → Validation → Human Approval → Component Registry → Library

The factory can generate:
- Headers
- Heroes
- PDP Extensions
- Trust Sections
- Testimonials
- FAQs
- Footers
- Landing Page Sections
- Conversion Components

Store generation uses APPROVED components only.

---

### Layer 4 — Design Families

Prevent component chaos.

Families:
- Luxury      → Jewellery, Watches, Luxury Products
- Lifestyle   → Fashion, Footwear, Accessories
- Beauty      → Beauty, Cosmetics, Skincare
- Home        → Home Decor, Furniture, Handmade, Gifts
- Tech        → Electronics, Gadgets, Gaming
- Health      → Supplements, Wellness, Organic
- Travel      → Travel, Luggage
- Industrial  → B2B, Industrial

Each family has a compatible component pool. Cross-family components are forbidden by the compatibility engine.

---

### Layer 5 — Archetype System

Prevent identical stores. Same niche → different visual result.

Example:
Beauty → Luxury Beauty
Beauty → Organic Beauty
Beauty → Clinical Beauty
Beauty → Gen-Z Beauty
Beauty → Premium Beauty

Same niche. Different archetype. Different store. Different token set.

---

### Layer 6 — Niche Profiles

Location: niche-profiles/

Each profile contains:
- Family
- Available Archetypes
- Compatible Component IDs per slot
- PDP Feature Flags
- Token File path

Example: beauty.json
{
  "niche": "beauty",
  "family": "Beauty",
  "archetypes": ["luxury", "organic", "clinical", "gen-z", "premium"],
  "tokensDir": "niche-tokens/beauty/",
  "pdpFeatures": {
    "beforeAfter": true,
    "skinQuiz": true,
    "ingredients": true,
    "certificate": false,
    "specTable": false
  },
  "sections": {
    "header": ["header-luxury-v1", "header-minimal-v1"],
    "hero": ["hero-editorial-luxury-v1", "hero-storytelling-organic-v1"],
    "product_grid": ["grid-minimal-v1", "grid-luxury-v1"],
    "trust": ["trust-minimal-v1", "trust-luxury-v1"],
    "testimonials": ["testimonials-minimal-v1"],
    "faq": ["faq-accordion-v1"],
    "footer": ["footer-minimal-v1", "footer-luxury-v1"]
  }
}

---

## Universal PDP Architecture (FROZEN)

One PDP Core. NEVER build separate PDPs per niche.

Core (always rendered):
- Gallery
- Buy Box (Variants, Quantity, ATC, Sticky ATC)
- Reviews
- Trust
- FAQ
- Upsells / Cross-Sells
- Delivery Checker

PDP Extensions (conditional by niche profile):

Luxury:
- Authenticity Certificate
- Craftsmanship Story
- Materials Showcase

Beauty:
- Ingredients List
- Skin Quiz
- Before/After Slider

Tech:
- Spec Table
- Compatibility Checker
- Performance Benchmarks

Health:
- Certifications
- Benefits Grid

Home:
- Materials Detail
- Room Showcase

---

## Compatibility Engine

Every component includes metadata:

{
  "componentId": "hero-luxury-v1",
  "type": "hero",
  "family": ["Luxury", "Lifestyle"],
  "archetypes": ["luxury", "premium"],
  "styleTags": ["editorial", "serif", "high-contrast"],
  "mobileScore": 92,
  "conversionScore": 88,
  "status": "PUBLISHED"
}

Composer only selects compatible components. No cross-family combinations. No broken design language.

---

## Store Generation Flow (FROZEN)

Merchant
↓
Catalog Analyzer
↓
Brand Analyzer
↓
Family Selection
↓
Archetype Selection
↓
Component Selection (from compatible pool)
↓
Token Application (archetype token file)
↓
Compatibility Validation
↓
Theme Composer (assemble)
↓
Preview URL
↓
Publish

---

## What Is FROZEN (Never Changes)

- Cart Logic
- Variant Logic
- Search Logic
- Checkout
- Product Templates
- Collection Templates
- Currency Logic
- SEO Framework
- Analytics

---

## What Is DYNAMIC (Changes Per Store)

- Header
- Hero
- Product Grid
- Trust Sections
- Testimonials
- FAQ
- Footer
- Design Tokens (per archetype)
- PDP Extensions (per family/archetype)
- Brand Story Sections

---

## Long-Term Component Target

Year 1: 200 Components
Year 2: 500 Components
Year 3: 1000+ Components

The larger the library, the more unique and agency-quality every store.

---

## Final Principle

Antigravity AI
↓
Creates Components (via Component Factory)
↓
Validation Layer
↓
Component Registry
↓
Approved Component Library
↓
StoreForge Engine
↓
Selects Components
↓
Builds Store

StoreForge NEVER generates random production code for merchants.
StoreForge ASSEMBLES approved agency-quality components into unique stores.

Result: Thousands of unique Shopify stores from one scalable architecture without creating maintenance debt.

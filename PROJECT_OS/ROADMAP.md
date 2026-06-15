# Project Roadmap

## Phase 1: Foundation
- [x] **Prisma Models**: Database schema synced with cost, rollback, performance, feedback, registry, and versioning models.
- [x] **Component Registry**: Model for tag-based, scored registry retrieval of storefront parts.
- [x] **Blueprint Storage**: JSON blueprint snapshot model.
- [x] **Cost Tracking**: AI token, Shopify API, and asset cost calculation and storage.
- [x] **Theme Snapshots**: Granular file state tracking and restore checkpoints.

## Phase 2: AI Layer
- [ ] **Catalog Analyzer**: Product, category, settings, and page parser.
- [ ] **Competitor Analyzer**: Scrapes and analyzes competitor store layouts.
- [ ] **Business Blueprint**: Strategy, pricing structure, and positioning.
- [ ] **Brand Blueprint**: Typography, contrast score, and aesthetic styles.
- [ ] **Store Blueprint**: Custom homepage, collection, product layouts, and settings.
- [ ] **Repair Engine**: Pass 2 targeted block/section repairing.

## Phase 3: Theme Layer
- [ ] **Retrieval Engine**: Scored registry queries matching styleTags and industryTags.
- [ ] **Asset Cache**: Minimizes Shopify API calls by checking existing theme assets.
- [ ] **Theme Composer**: Compiles blueprint structures into Liquid configurations.
- [ ] **Theme Validator**: Validates section dependencies and structure.
- [ ] **Health Scoring**: Formal weighted scoring (`SEO * 0.20 + Accessibility * 0.20 + Mobile * 0.20 + CRO * 0.30 + Validation * 0.10`).

## Phase 4: Merchant Layer
- [ ] **Preview System**: Generates secure draft preview links.
- [ ] **Feedback System**: Rating score submissions and merchant notes.
- [ ] **Rollback**: Grandular section or full blueprint rollback capability.
- [ ] **Regeneration**: Segmented page or block regeneration.

## Phase 4.5: Learning Data
- [ ] **Component Performance**: Tracking conversion rates, bounce rates, and average time per component.
- [ ] **Industry Patterns**: Capturing top conversion patterns across industries.
- [ ] **Recommendation Engine**: Smart recommendation of layout alternatives based on performance data.

## Phase 5: Production Rollout
- [ ] **Scaled Rollout**: Dynamic store updates, continuous telemetry collection, and AI refinement.

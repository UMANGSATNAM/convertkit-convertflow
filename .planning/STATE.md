# Project State

## Current Phase
**PHASE 0 (BLOCKING — nothing proceeds until green):**
- 0.1 Flush mock content from Redis (cached with isFallback:false)
- 0.2 Wire the real Anthropic llmCaller — prove with raw Claude JSON output
- 0.3 Fix upload bundle regression: 106 → 47 files. Paste full manifest.
- 0.4 Fix brand token regression (accent=#008060 Shopify green; Playfair lost)

## Restructured Roadmap
- **PHASE 0 (BLOCKING):** Flush Redis mock content, wire real Anthropic API, fix bundle file count, fix brand token extraction.
- **PHASE 1:** PDP blocks (28 universal) + product cards (8 variants)
- **PHASE 2:** Motion + typography scale + speed layer + chassis gaps
- **PHASE 3:** Jewellery niche complete → first paying merchant
- **PHASE 4:** MODULE 1 — CRO Suite (theme-native app replacement)
- **PHASE 5:** Merchant UI: wizard, preview, section marketplace, billing
- **PHASE 6:** MODULE 2 — Campaign / Festival Engine
- **PHASE 7:** MODULE 3 — Conversion Diagnostics
- **PHASE 8:** App Store submission
- **PHASE 9:** MODULE 4 — A/B Testing engine (the moat)

## Completed Milestones
- Logged canonical Decisions #16, #17, and #18 in `.project/decisions.md`.
- Added Chassis Quality & Compliance Gaps to `docs/AUDIT_BACKLOG_PHASE_B.md`.

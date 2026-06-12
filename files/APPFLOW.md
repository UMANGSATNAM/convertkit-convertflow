# APPFLOW.md — StoreForge
## Complete User Flows — Every Journey in the App

---

## F1. INSTALL → ONBOARDING

```
App Store listing → Install → OAuth consent → Embedded app loads
→ Welcome screen (language pick: English / हिंदी / Hinglish)
→ Two paths:
   [A] "Build my store" → F2 Store Generator wizard
   [B] "I already have a store I like" → Dashboard (sections/toolkit-first journey)
```
- First-load must paint <3s. Welcome shows the 90-sec video inline (skippable).
- PostHog: `install`, `welcome_path_selected`.

## F2. STORE GENERATOR WIZARD (THE HERO FLOW)

```
STEP 1 NICHE
  10 cards (preview shots + "See live demo" link) → select → Next
STEP 2 BRAND
  Store name (prefilled) • Tagline [AI suggest]
  Logo: Upload OR "Generate text logo" (3 styles) 
  Colors: niche palettes OR custom (live WCAG contrast check)
  Font pair: 3 curated options (preview en + देवनागरी)
  WhatsApp number (+91 default) • City/State • GSTIN (optional)
STEP 3 CATALOG
  ◉ Demo products (recommended — store looks alive)
  ◉ Upload CSV → column mapper → validation report → confirm
  ◉ Empty (structure only)
STEP 4 GENERATE
  Confirm summary → [Generate My Store]
  Live progress checklist (poll 2s):
    ✓ Installing your theme
    ✓ Importing products (18/24)
    ✓ Creating collections
    ✓ Creating pages
    ✓ Building menus
    ✓ Applying your brand
    ✓ Publishing
  DONE → 🎉 confetti → [View your store] [Open theme editor] [What's next cards]
```
**Failure path:** step shows ⚠ + plain-language reason → auto-retry 3× → [Retry from this step] button (job resumes, never restarts) → if still failing: [Contact support] prefilled with generation ID. **Publish only happens as the final step — a failed generation never touches the live store.**
**Re-generation (GROWTH+):** Dashboard → "Generate new look" → same wizard; installs a NEW theme; old theme stays in merchant's library untouched.

## F3. SECTION LIBRARY

```
Sections tab → Gallery (filter: category / niche / goal, search)
→ Section card → [Preview] (live iframe demo) → [Add to theme]
→ Target picker: Homepage / Product page / Collection / Specific page
→ Deep-link opens theme editor with block pre-added at target
→ Merchant adjusts settings in native editor → Save
Return to app → "Recently added" row updates → InstalledSection recorded
```
- Locked sections (plan-gated) show 🔒 + upgrade CTA.
- AI-recommended row: "Stores in your niche use these" (rule-based on nicheId).

## F4. DESIGN STUDIO

```
Design tab → Panels: Colors / Typography / Buttons / Spacing / Layout / Badges
→ Any change → debounced live preview (storefront iframe with preview_theme_id)
→ [Apply] → snapshot created → patchSettings → toast "Applied • Undo"
History drawer → timeline of last 25 changes (label + time) → [Restore] any
Third-party theme: only mapped controls shown; banner explains "Full control available on StoreForge themes"
```

## F5. CONVERSION TOOLKIT

```
Toolkit tab → 8 feature cards with toggle + [Configure]
Enable → config drawer (sensible defaults pre-filled) → Save
→ writes app-data metafield + enables app embed (deep-link if manual theme-editor toggle needed)
→ status badge: ● Active on storefront
Special flows:
  Size charts → template picker per product-type → auto-attach rule (tag/type match)
  Pincode → mode pick: Simple (all-India + ETA) | CSV upload (mapper → bulk insert progress)
  Bundles → rule builder ("Buy 2 → 10% off") → creates Shopify automatic discount → display block preview
  WhatsApp → number reuse from brandConfig, message template editor with variables
```

## F6. CAMPAIGN PAGE BUILDER

```
Campaigns tab → Calendar view (Indian retail calendar pre-marked; "Diwali in 21 days — create campaign?" nudges)
→ [New campaign] → template pick (7) → name + handle
→ Resource picker: products/collections → Offer: headline, subtext, end datetime, [+ create discount code]
→ Hero: upload / festive preset / layout suggestion
→ [Preview] (renders to preview theme) → [Publish]
   = writeTemplate + pageCreate + optional menu link + optional announcement-bar activation
→ Success: shareable URL + UTM builder + QR download
Auto-archive at end date (toggle) → page hidden, snapshot kept → [Duplicate for next festival]
```

## F7. HEALTH MONITOR

```
Health tab → Score dial (0–100) + sparkline history
→ Issues grouped by severity (Critical/Warning/Info), plain language (en/hi)
→ Auto-fixable issues: [Fix] per-issue or [Fix all safe issues]
   → fix job → before/after shown → snapshot recorded → score re-scan
→ Non-fixable: guided "how to fix" steps
Weekly: cron scan → email digest "Health: 86 ↑4 — 2 new issues" → deep-link to tab
PRO: weekly auto-fix of SAFE class fixes (images, alt) with summary email
```

## F8. AI ASSISTANT

```
Assistant tab / floating launcher → chat UI
Merchant: "homepage pe diwali banner lagao maroon gold"
→ AI (tool: add_section + patch settings) → PREVIEW CARD in chat
   [shows: section thumbnail, settings summary, target]
→ [Apply] → executes via service layer → snapshot → RESULT CARD [View] [Undo]
→ [Discard] → nothing happens
Batch flows (e.g., "improve my product descriptions"):
→ AI proposes per-product diffs in review list → merchant approves all/some → batch job → progress → done
Quota exhausted (GROWTH 50/mo) → soft wall + upgrade CTA
Every interaction → AiActionLog
```
**Hard rules in flow:** nothing auto-applies; max 5 tool calls per message; AI cannot touch billing, cannot uninstall things, cannot write raw code to theme.

## F9. TRACKING WIZARD

```
Integrations tab → cards: Meta Pixel / GA4 / Google Merchant / WhatsApp
Pixel/GA4: paste ID → [Connect] → webPixelCreate → [Send test event] → ✅ verified
Merchant feed: [Generate feed URL] → copy /apps/storeforge/feed.xml → step-by-step GMC walkthrough (screenshots)
Status board: CONNECTED / ACTION NEEDED with guided fix
```

## F10. BILLING

```
Any locked feature → contextual upgrade modal (shows exactly what unlocks)
Plans page → compare table → [Start 14-day trial] → appSubscriptionCreate → Shopify confirm → return → unlocked
Trial banner countdown (last 3 days) • Downgrade → confirm modal listing what locks (data never deleted)
Subscription FROZEN webhook → banner "Payment issue — fix in Shopify admin"
```

## F11. UNINSTALL / REINSTALL

```
app/uninstalled webhook → jobs disabled, uninstalledAt set
→ snapshots + config retained 30 days → purge (shop/redact compliant)
Reinstall within 30 days → "Welcome back — restore previous setup?" → restores toolkit configs + brand
Sections in theme: app blocks stop rendering on uninstall (Shopify-native behavior) — communicated in offboarding email with care guide
```

## F12. THEME SWITCH DETECTION

```
themes/publish webhook (merchant published a different theme)
→ re-check: StoreForge theme? third-party OS 2.0? vintage?
→ in-app banner + email: "You switched themes — your sections/toolkit status: ..." 
→ one-click re-enable embeds on new theme (deep-links)
```

# SCHEMA.md — StoreForge
## Database Schema & Data Structures

---

## 1. PRISMA SCHEMA (POSTGRESQL)

```prisma
generator client { provider = "prisma-client-js" }
datasource db { provider = "postgresql"; url = env("DATABASE_URL") }

model Session {
  id          String    @id
  shop        String
  state       String
  isOnline    Boolean   @default(false)
  scope       String?
  expires     DateTime?
  accessToken String
  userId      BigInt?
}

model Shop {
  id              String    @id @default(cuid())
  shopDomain      String    @unique
  accessToken     String    // AES-256-GCM encrypted
  email           String?
  plan            Plan      @default(FREE)
  planActivatedAt DateTime?
  trialEndsAt     DateTime?
  nicheId         String?
  brandConfig     Json?
  language        String    @default("en") // en | hi
  onboardedAt     DateTime?
  uninstalledAt   DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  generations       StoreGeneration[]
  installedSections InstalledSection[]
  toolkitFeatures   ToolkitFeature[]
  pincodeZones      PincodeZone[]
  campaigns         CampaignPage[]
  healthReports     HealthReport[]
  snapshots         ThemeSnapshot[]
  aiActions         AiActionLog[]
  usage             UsageCounter[]
  integrations      Integration[]
}

model StoreGeneration {
  id          String      @id @default(cuid())
  shopId      String
  shop        Shop        @relation(fields: [shopId], references: [id], onDelete: Cascade)
  nicheId     String
  catalogMode CatalogMode
  status      GenStatus   @default(QUEUED)
  currentStep String?
  themeId     String?
  log         Json        @default("[]")
  stepState   Json        @default("{}") // resumability: created IDs per step
  error       Json?
  createdAt   DateTime    @default(now())
  completedAt DateTime?
  @@index([shopId, createdAt])
}

model Niche {
  id             String   @id            // ethnic-wear | jewellery | grooming | beauty | streetwear | activewear | electronics | kids | home-decor | food
  name           String
  nameHi         String
  themeZipUrl    String
  themeVersion   String
  previewImages  String[]
  demoStoreUrl   String
  demoCatalogUrl String
  pagesPreset    Json
  menusPreset    Json
  settingsBase   Json
  palettePresets Json
  fontPairs      Json
  campaignFit    String[]
  active         Boolean  @default(true)
}

model SectionCatalog {
  key        String   @id        // "hero-festive-banner"
  name       String
  nameHi     String
  category   Category
  goalTags   String[]            // ["trust","festival","conversion"]
  nicheTags  String[]
  planMin    Plan     @default(FREE)
  thumbUrl   String
  previewUrl String
  blockHandle String            // extension block handle
  version    String
  active     Boolean  @default(true)
}

model InstalledSection {
  id         String   @id @default(cuid())
  shopId     String
  shop       Shop     @relation(fields: [shopId], references: [id], onDelete: Cascade)
  sectionKey String
  themeId    String
  addedVia   AddedVia
  createdAt  DateTime @default(now())
  @@index([shopId])
}

model ToolkitFeature {
  id      String  @id @default(cuid())
  shopId  String
  shop    Shop    @relation(fields: [shopId], references: [id], onDelete: Cascade)
  feature Feature
  enabled Boolean @default(false)
  config  Json    @default("{}")
  @@unique([shopId, feature])
}

model PincodeZone {
  shopId  String
  pincode String   // 6-digit
  cod     Boolean  @default(true)
  etaDays Int?
  shop    Shop     @relation(fields: [shopId], references: [id], onDelete: Cascade)
  @@id([shopId, pincode])
}

model CampaignPage {
  id            String   @id @default(cuid())
  shopId        String
  shop          Shop     @relation(fields: [shopId], references: [id], onDelete: Cascade)
  templateKey   String
  title         String
  handle        String
  pageId        String?
  themeTemplate String?
  productIds    String[]
  collectionIds String[]
  offer         Json
  status        CampaignStatus @default(DRAFT)
  autoArchive   Boolean  @default(true)
  publishedAt   DateTime?
  archivedAt    DateTime?
  createdAt     DateTime @default(now())
  @@unique([shopId, handle])
}

model HealthReport {
  id        String      @id @default(cuid())
  shopId    String
  shop      Shop        @relation(fields: [shopId], references: [id], onDelete: Cascade)
  score     Int
  issues    Json        // HealthIssue[]
  trigger   ScanTrigger
  createdAt DateTime    @default(now())
  @@index([shopId, createdAt])
}

model ThemeSnapshot {
  id        String   @id @default(cuid())
  shopId    String
  shop      Shop     @relation(fields: [shopId], references: [id], onDelete: Cascade)
  themeId   String
  kind      SnapKind
  path      String
  r2Key     String
  checksum  String
  reason    SnapReason
  actor     Actor
  createdAt DateTime @default(now())
  @@index([shopId, createdAt])
}

model AiActionLog {
  id        String   @id @default(cuid())
  shopId    String
  shop      Shop     @relation(fields: [shopId], references: [id], onDelete: Cascade)
  prompt    String
  toolCalls Json
  applied   Boolean  @default(false)
  result    Json?
  tokensIn  Int      @default(0)
  tokensOut Int      @default(0)
  createdAt DateTime @default(now())
  @@index([shopId, createdAt])
}

model UsageCounter {
  shopId String
  metric String // AI_ACTIONS | GENERATIONS | CAMPAIGNS_LIVE
  period String // YYYY-MM
  count  Int    @default(0)
  shop   Shop   @relation(fields: [shopId], references: [id], onDelete: Cascade)
  @@id([shopId, metric, period])
}

model Integration {
  id      String  @id @default(cuid())
  shopId  String
  shop    Shop    @relation(fields: [shopId], references: [id], onDelete: Cascade)
  kind    String  // META_PIXEL | GA4 | GMC_FEED | WHATSAPP
  config  Json    // {pixelId} etc — never secrets beyond IDs
  status  String  // CONNECTED | ACTION_NEEDED | DISABLED
  pixelId String? // shopify webPixel gid
  @@unique([shopId, kind])
}

model WebhookEvent {
  id        String   @id        // shopify webhook id — dedupe
  topic     String
  shop      String
  createdAt DateTime @default(now())
}

enum Plan { FREE GROWTH PRO }
enum GenStatus { QUEUED INSTALLING_THEME IMPORTING_PRODUCTS CREATING_COLLECTIONS CREATING_PAGES CREATING_MENUS PATCHING_SETTINGS PUBLISHING DONE FAILED }
enum CatalogMode { DEMO CSV EMPTY }
enum Feature { STICKY_ATC COUNTDOWN ANNOUNCEMENT SIZE_CHART PINCODE WHATSAPP BUNDLES TRUST_BADGES }
enum Category { HERO PRODUCT TRUST CONTENT CONVERSION UTILITY INDIA }
enum AddedVia { GALLERY AI GENERATOR }
enum CampaignStatus { DRAFT PUBLISHED ARCHIVED }
enum ScanTrigger { CRON MANUAL POST_FIX }
enum SnapKind { SETTINGS TEMPLATE ASSET }
enum SnapReason { DESIGN_STUDIO AI HEALTH_FIX CAMPAIGN GENERATOR MANUAL }
enum Actor { MERCHANT AI SYSTEM }
```

## 2. JSON SHAPES

### brandConfig (Shop.brandConfig)
```json
{
  "storeName": "Riwaaz Ethnic",
  "tagline": "Tradition, tailored.",
  "logoUrl": "https://cdn.../logo.png",
  "logoType": "UPLOADED",
  "colors": { "primary": "#8B0000", "secondary": "#D4AF37", "accent": "#1A1A2E" },
  "fontPair": { "name": "Royal", "heading": "Playfair Display", "body": "Inter" },
  "whatsapp": "+919876543210",
  "city": "Surat", "state": "GJ",
  "gstin": "24XXXXX1234X1Z5"
}
```

### Demo catalog manifest (R2: catalogs/{niche}/manifest.json)
```json
{
  "niche": "ethnic-wear",
  "version": "1.2.0",
  "collections": [
    { "title": "Sarees", "handle": "sarees", "ruleTag": "saree", "image": "collections/sarees.jpg" }
  ],
  "products": [
    {
      "title": "Banarasi Silk Saree — Crimson Gold",
      "descriptionHtml": "<p>...</p>",
      "vendor": "{{store_name}}",
      "productType": "Saree",
      "tags": ["saree", "silk", "wedding", "bestseller"],
      "price": "4999.00", "compareAtPrice": "7999.00",
      "weightGrams": 800,
      "options": [{ "name": "Blouse", "values": ["Unstitched", "Stitched"] }],
      "images": [{ "src": "products/saree-01-a.jpg", "alt": "Crimson Banarasi silk saree full drape" }]
    }
  ]
}
```

### Niche pagesPreset (excerpt)
```json
{
  "about": { "title": "About Us", "titleHi": "हमारे बारे में",
    "body": "<h2>Welcome to {{store_name}}</h2><p>Based in {{city}}, ...</p>" },
  "shipping": { "title": "Shipping Policy", "body": "<p>We ship across India... COD available...</p>" }
}
```

### HealthIssue
```json
{ "key": "IMG_OVERSIZED", "severity": "CRITICAL", "target": "assets/hero.jpg",
  "detail": { "sizeKB": 2400, "recommendedKB": 300 },
  "message": "Your hero image is 2.4MB — that's why mobile feels slow.",
  "messageHi": "Aapki hero image 2.4MB hai — isi se mobile slow lagta hai.",
  "autoFixable": true, "fixedAt": null }
```

### Toolkit config examples
```json
// STICKY_ATC
{ "position": "bottom", "showOnDesktop": true, "bg": "inherit", "triggerOffsetPx": 300 }
// BUNDLES rule
{ "type": "QUANTITY_PERCENT", "minQty": 2, "percentOff": 10,
  "scope": { "kind": "ALL" }, "shopifyDiscountId": "gid://shopify/DiscountAutomaticNode/..." }
// PINCODE simple mode
{ "mode": "SIMPLE", "allIndiaCod": true, "defaultEtaDays": 5 }
```

### AI tool schema (registry excerpt)
```json
{
  "name": "add_section",
  "input": { "sectionKey": "string", "target": "HOME|PRODUCT|COLLECTION|PAGE:{handle}",
             "settings": "object?" },
  "preview": "ActionCard{thumb,summary[]}",
  "mutates": true, "planMin": "FREE"
}
```

## 3. R2 BUCKET LAYOUT

```
storeforge-assets/            (public via CDN)
  themes/{niche}/{version}.zip
  catalogs/{niche}/manifest.json + images/
  sections/thumbs/{key}.webp
storeforge-private/           (private)
  snapshots/{shopId}/{ts}-{hash}.json
  uploads/{shopId}/logo|csv/...
  screenshots/{shopId}/home-{ts}.png
```

## 4. APP-DATA METAFIELDS (TOOLKIT → STOREFRONT)

Namespace `$app:storeforge` (app-reserved):
- `toolkit` (json) — merged enabled-feature configs read by sf-embeds at render
- `campaigns` (json) — active campaign metadata (countdown end-times)
Written via `metafieldsSet` on app installation owner; survives theme switches; zero storefront API calls needed.

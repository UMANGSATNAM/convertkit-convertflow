# TECHSPEC.md — StoreForge
## Technical Specification — Final Launch Build

---

## 1. STACK

| Layer | Technology |
|---|---|
| Framework | `@shopify/shopify-app-remix` (latest), TypeScript strict |
| UI | Polaris + App Bridge (embedded, session tokens) |
| DB | **Railway PostgreSQL** (managed plugin, daily backups enabled) + Prisma |
| Queue | BullMQ + **Railway Redis** (managed plugin, same project — private network) |
| Storage | Cloudflare R2 (+ CDN for public catalog images) |
| AI | Anthropic Claude API (server-side only) |
| Images | Sharp |
| Hosting | **Railway** — web service + separate worker service from same Docker image; Asia region (Singapore) for India latency |
| Monitoring | Sentry + Axiom logs + UptimeRobot |
| Product analytics | PostHog |
| Email | Resend |
| CI/CD | GitHub Actions |

**OAuth scopes:**
```
read_themes write_themes read_products write_products read_content write_content
read_online_store_navigation write_online_store_navigation read_files write_files
write_pixels read_customer_events read_discounts write_discounts read_locales
```

## 2. SYSTEM ARCHITECTURE

```
Merchant Admin ──► Remix App (Railway: web service) ──► Services Layer ──► Shopify Admin GraphQL
                        │                      │
                        │                      ├── Theme Engine (sole theme gateway)
                        │                      ├── Generator / Catalog / Health / AI / Billing / Pixels
                        │                      ▼
                        │                 BullMQ (Redis) ◄── workers (same image, worker mode)
                        ▼
                  Postgres (Prisma)      R2 (ZIPs, catalogs, snapshots)
Storefront ──► Theme App Extensions (sf-sections, sf-embeds) — static, zero app-server calls
              App Proxy: /apps/storeforge/feed.xml (Merchant feed), /apps/storeforge/pincode (checker API)
```

**Hard rule:** storefront extensions make ZERO calls to our app server except the pincode app-proxy endpoint (cached, rate-limited). Everything else is static/Liquid/metafield-driven.

## 3. THEME ENGINE (CORE SERVICE)

The ONLY module allowed to touch theme APIs.

### Interface
```ts
installTheme(shop, nicheId, brandConfig): Promise<{themeId}>
publishTheme(shop, themeId): Promise<void>
patchSettings(shop, themeId, patch): Promise<{snapshotId}>
writeTemplate(shop, themeId, path, json): Promise<{snapshotId}>
readFile(shop, themeId, path): Promise<string>
restoreSnapshot(shop, snapshotId): Promise<void>
scanAssets(shop, themeId): Promise<AssetReport>
appBlockDeepLink(themeId, blockHandle, target): string
```

### Mechanics
- `installTheme`: `themeCreate(source: r2ZipUrl)` → poll `theme.processing` every 3s (timeout 5 min) → ready unpublished
- `patchSettings`: read `config/settings_data.json` → validate patch against live `config/settings_schema.json` (types/options/ranges) → snapshot current to R2 → deep-merge → `themeFilesUpsert`
- `writeTemplate`: JSON-schema validation (known section types, valid blocks, order integrity) → snapshot → upsert
- Optimistic concurrency: checksum compare on read-modify-write; on mismatch, re-read and re-apply (max 3)
- Snapshot BEFORE every write. 25 per shop retained, content in R2 (`snapshots/{shopId}/{ts}-{path-hash}`)

### GraphQL client wrapper
- Reads `extensions.cost.throttleStatus`; token-bucket aware per shop
- Per-shop serial queue for theme mutations (no concurrent theme writes)
- Retry with jitter on THROTTLED (max 5), circuit breaker on repeated 5xx, 30s hard timeout

## 4. KEY SHOPIFY API OPERATIONS

| Operation | API |
|---|---|
| Theme install | `themeCreate(source)` + poll + `themePublish` |
| Theme files | `themeFilesUpsert`, `themeFilesDelete`, files query |
| Products | `productCreate`, `productVariantsBulkCreate`, `productUpdate` |
| Product images | `stagedUploadsCreate` → `fileCreate` → attach media |
| Collections | `collectionCreate` (smart, tag rules) |
| Pages | `pageCreate`, `pageUpdate` |
| Menus | `menuCreate`, `menuUpdate` (update existing handles, never duplicate) |
| Discounts (bundles) | `discountAutomaticBasicCreate` / `discountAutomaticBxgyCreate` |
| Billing | `appSubscriptionCreate` (trialDays:14), `currentAppInstallation` |
| Pixels | Web Pixels extension + `webPixelCreate` |
| Metafields | App-data metafields for toolkit configs (survive theme switches) |

## 5. EXTENSIONS

### `sf-sections` (Theme App Extension — 120 app blocks)
- One block per section, `blocks/{key}.liquid` + scoped CSS + optional vanilla JS module
- Budget per block: ≤30KB combined, zero external requests, CLS-safe, `loading="lazy"` + `image_url` srcset
- Locales: `en.default.json`, `hi.json`
- Schema settings standard set: color overrides (theme-inherit default), spacing top/bottom (range), mobile/desktop visibility, animation toggle (CSS-only, honors `prefers-reduced-motion`)

### `sf-embeds` (App embed blocks — 8 toolkit features)
- Each feature one embed, toggled via theme editor or app (deep-link), config read from app-data metafields
- Combined budget ≤60KB gzipped; single shared util module; no jQuery/no deps
- Cart interactions via Section Rendering API (drawer refresh pattern)

## 6. JOBS (BullMQ)

| Queue | Jobs | Concurrency |
|---|---|---|
| `generation` | store generation pipeline (8 steps, resumable, idempotent) | 2/shop-serial, 20 global |
| `health` | weekly scans (cron Mon 06:00 IST), on-demand scans, fix executors | 10 |
| `ai-batch` | bulk copy rewrite, alt-text batches | 5 |
| `media` | image compression (Sharp), logo generation, screenshot capture | 10 |
| `housekeeping` | snapshot pruning, uninstall purge (30d), usage rollups | 2 |

Job rules: every step idempotent, state persisted to `StoreGeneration.log`/job data, retry 3× backoff, failures alert Sentry + mark human-readable error.

## 7. SECURITY

- Session token auth on all app routes; HMAC on all webhooks (raw body); webhook dedupe by ID
- Access tokens AES-256-GCM encrypted, key in KMS; never logged
- Per-shop rate limit on app routes; app-proxy pincode endpoint: 60 req/min/IP + signed proxy verification
- Uploads (logo, CSV): type sniffing, size caps (logo 2MB, CSV 20MB), ClamAV scan, private R2
- CSP per embedded-app requirements; zero third-party scripts in admin
- Audit: every theme write → actor (MERCHANT|AI|SYSTEM) + snapshotId in DB

## 8. PERFORMANCE BUDGETS

| Surface | Budget |
|---|---|
| Each app block | ≤30KB JS+CSS, 0 external origins |
| All embeds combined | ≤60KB gzipped |
| Lighthouse delta (Dawn + all embeds vs bare Dawn) | ≤2 points — enforced in CI |
| Admin TTI | <2.5s on 4G |
| API p95 (non-job routes) | <400ms |
| Generation total (demo catalog) | <8 min |

## 9. OBSERVABILITY

- Sentry: errors + performance traces, release tagging
- Axiom: structured logs (shopId, jobId, step), 30d retention
- PostHog events: install, wizard_step_n, generation_done, section_added, toolkit_enabled, campaign_published, health_fix, ai_apply, upgrade
- Alerts → Telegram: generation success <95% (1h window), webhook lag >60s, 5xx spike, queue depth >100

## 10. ENVIRONMENTS & CI/CD

- dev / staging (separate app listing) / production
- GitHub Actions pipeline: lint → typecheck → unit tests → prisma migrate diff → **theme-validator** (all 10 theme sources + 120 blocks against RULES.md) → extension build → Lighthouse-delta test → deploy (staging auto, prod manual approve)
- Theme ZIPs built in CI from `/themes/{niche}` → versioned upload to R2 → `Niche.themeZipUrl` updated via migration script

## 11. RAILWAY DEPLOYMENT ARCHITECTURE

**Two Railway projects:** `storeforge-staging` and `storeforge-production` (full isolation — separate DBs, Redis, env vars, Shopify app listings).

Each project contains 4 services:
| Service | Role | Notes |
|---|---|---|
| `web` | Remix app (HTTP) | Dockerfile deploy; health check `/healthz`; min 1 replica, scale to 2+ at load |
| `worker` | BullMQ processors | Same Docker image, start command `npm run worker`; no public domain |
| `postgres` | Railway PostgreSQL plugin | Daily backups ON; connect via private `DATABASE_URL`; PgBouncer-style pooling via Prisma `connection_limit` tuned per replica |
| `redis` | Railway Redis plugin | BullMQ connection via private `REDIS_URL`; `maxRetriesPerRequest: null` (BullMQ requirement) |

**Railway-specific rules:**
- All inter-service traffic over Railway **private networking** (`*.railway.internal`) — Postgres/Redis never exposed publicly
- Deploys via GitHub integration: staging auto-deploys `main`, production deploys on release tag with manual approve in Actions
- `railway.toml` in repo defines both services (web + worker) with shared build, different start commands
- Cron (weekly health scans, housekeeping): BullMQ repeatable jobs inside worker — NOT Railway cron — so schedules live in code
- Region: Singapore (closest to India) for both projects
- Migrations: `prisma migrate deploy` runs as release step before web boots (start command chain), never auto in build
- Backups: Railway daily DB backups + weekly `pg_dump` to private R2 (housekeeping job) for independent restore path
- Env/secrets: Railway service variables only; shared variables at project level (R2 keys, Sentry DSN); never in repo
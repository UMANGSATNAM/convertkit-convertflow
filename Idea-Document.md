ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 1
ConvertKit
Shopify Conversion and Store Design App
ConvertFlow
Liquid Code Extraction Engine ΓÇö Built Inside ConvertKit
App 1 ΓÇö ConvertKit Merchant-facing Shopify app. Increases store conversion rate by 10-15%. Every feature
works out of the box with zero developer knowledge required.
App 2 ΓÇö ConvertFlow Developer and agency tool built inside ConvertKit. Reads the merchant's
already-connected Shopify theme via Admin API and generates production-ready Liquid
code, CSS, and JSON schema instantly ΓÇö no URL required.
Primary Users ConvertKit: Shopify store owners (non-technical). ConvertFlow: Shopify developers,
freelancers, and agencies.
Core Promise CK Merchant pays $19/month. App generates $1,000 to $3,000+ in new monthly revenue
from recovered lost sales.
Core Promise CF Developer selects any section from a visual picker. Gets production-ready Liquid,
encapsulated CSS, and JSON schema in under 5 seconds.
Pricing Free (limited), Pro $19/month (includes ConvertFlow), Enterprise $49/month
Tech Stack Remix + Shopify CLI 3.x, Node.js 20, Prisma, PostgreSQL, Redis, Claude API, Shopify
Admin API, esbuild, Monaco Editor
Launch Target 2,000 installs within 30 days. MRR above $3,800 by end of day 30.
Document Version v3.0 ΓÇö Complete specification including all features, UX wireframes, technical
architecture, engineering prompts, and launch strategy

-- 1 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 2
Why these two products belong in one app:
A Shopify store owner installs ConvertKit to get more sales. A Shopify developer installs ConvertKit to build better
stores faster. Both install the same app. The merchant never sees ConvertFlow. The developer gets a powerful
code extraction tool as part of their Pro subscription. One app, two audiences, one price.
ConvertFlow's key advantage over every competitor: because the store is already connected via OAuth, no URL
paste is needed. The developer opens the ConvertFlow tab, sees all sections listed visually, clicks Extract, and
gets code in seconds. Competitors scrape public HTML. ConvertFlow reads the actual theme files.

-- 2 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 3
Table of Contents
PART A ΓÇö CONVERTKIT
Section 1 ΓÇö Vision, USP, and Go-to-Market Strategy
Section 2 ΓÇö Technical Architecture and Database Schema
Section 3 ΓÇö Feature Specifications ΓÇö Sections, Themes, Pages
Section 4 ΓÇö Feature Specifications ΓÇö Sticky Cart, AI Reviews, Urgency Maker
Section 5 ΓÇö Feature Specifications ΓÇö Upsell Engine, Trust Tools, Analytics
Section 6 ΓÇö Onboarding UX ΓÇö 5-Step Wizard with Wireframes
Section 7 ΓÇö Dashboard UX ΓÇö All 9 Screens with Wireframes
Section 8 ΓÇö Pricing, ROI Model, App Store Listing
Section 9 ΓÇö Engineering Prompt ΓÇö ConvertKit Build Instructions
PART B ΓÇö CONVERTFLOW
Section 10 ΓÇö ConvertFlow Overview and Competitive Advantage
Section 11 ΓÇö Technical Architecture ΓÇö Extraction Pipeline and API Calls
Section 12 ΓÇö ConvertFlow UI and UX Specification with Wireframes
Section 13 ΓÇö Component Library ΓÇö Save, Reuse, Share
Section 14 ΓÇö Code Output Examples ΓÇö Liquid, CSS, JSON Schema
Section 15 ΓÇö Developer UX Principles and Quality Standards
Section 16 ΓÇö Engineering Prompt ΓÇö ConvertFlow Build Instructions
LAUNCH AND QUALITY
Section 17 ΓÇö Pre-Launch Checklist and 30-Day Growth Targets

-- 3 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 4
PART A ΓÇö ConvertKit: Merchant Conversion and Store Design App
Section 1 ΓÇö Vision, USP, and Go-to-Market Strategy
ConvertKit is not another bloated Shopify app. It is a precision-built conversion engine that gives any Shopify merchant
ΓÇö regardless of technical skill ΓÇö the same storefront capabilities that 8-figure DTC brands pay $50,000+ to
custom-build. One install. One dashboard. No developer needed.
1.1 The Problem Being Solved
Most Shopify merchants lose 85 to 92 percent of visitors without a purchase. Their product is good. Their storefront
fails to communicate trust, urgency, and value fast enough. Existing solutions are either too expensive (PageFly at
$99/month), too slow (200kb+ JavaScript injected), or too fragmented ΓÇö merchants buy 5 separate apps to do what
one should do. ConvertKit solves all three problems simultaneously.
1.2 The Three Pillars That Differentiate ConvertKit
Speed-first architecture The entire storefront widget bundle is under 40kb gzipped and loads asynchronously
with async and defer attributes. Zero Cumulative Layout Shift. No jQuery. No React on
the storefront. Google Lighthouse score stays above 95 after install. This is the
number one technical claim competitors cannot match.
All-in-one conversion
stack
Prebuilt sections (30+), prebuilt themes (8), prebuilt pages (8), AI-powered review
writing, urgency maker with 5 tools, sticky add-to-cart button, trust badges, upsell
engine, post-purchase pages, bundle builder, and revenue analytics ΓÇö all in one app
at one price.
Measurable ROI
guarantee
The dashboard shows merchants their exact conversion rate before and after
ConvertKit, with real dollar revenue attributed to the app per month. Not impressions.
Not clicks. Actual money. This single screen eliminates churn because merchants see
the 130x return on their $19 investment every time they log in.
1.3 Unique Selling Point in One Sentence
A merchant pays $19/month. ConvertKit generates $1,000 to $3,000+ in new monthly revenue from sales they
would have otherwise lost. The ROI is visible on the dashboard from day one.
1.4 Go-to-Market Strategy ΓÇö 2,000 Installs in 30 Days
- Free plan with zero credit card requirement on install ΓÇö removes all friction from first install

-- 4 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 5
- Built-in viral loop: free plan shows a small 'Powered by ConvertKit' badge on the storefront linking to the App Store
listing
- Shopify App Store SEO with exact keyword targeting: page builder, conversion rate optimization, sticky cart,
urgency timer, review app, product page builder
- Launch on Shopify Partners Slack, r/shopify, Facebook Shopify groups, IndieHackers, and Product Hunt
simultaneously on day one
- Affiliate program offering 30% recurring commission to Shopify Partners and developers who refer installs
- YouTube tutorials targeting 'how to increase Shopify conversion rate' ΓÇö high search volume, low competition
keyword
- Cold email outreach to 500 Shopify merchants per week showing their current missing features with a personalized
store audit screenshot
- Free migration tool from PageFly and GemPages that imports existing sections ΓÇö switching cost drops to near zero
- Developer community: ConvertFlow (Section 10+) creates a second viral loop within the Shopify developer
community

-- 5 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 6
Section 2 ΓÇö Technical Architecture and Database Schema
2.1 Technology Stack
Framework Remix with Shopify CLI 3.x ΓÇö mandatory for Shopify App Store submission and
embedded app authentication
Runtime Node.js 20 LTS
Database ORM Prisma with PostgreSQL ΓÇö hosted on Supabase or Railway for managed infrastructure
Cache Layer Redis via Upstash serverless ΓÇö session storage, API response caching, rate limit
management
Storefront Code Vanilla JavaScript compiled with esbuild ΓÇö absolutely no React on the storefront, no
jQuery, no Lodash
Admin UI React with Shopify Polaris design system ΓÇö mandatory for Shopify App Store approval
AI Integration Anthropic Claude API (claude-sonnet-4-20250514) for review writing and ConvertFlow
extraction
File Storage Cloudflare R2 or AWS S3 for theme asset uploads and library preview images
Deployment Fly.io or Railway for the app server + Cloudflare CDN for widget scripts
Monitoring Sentry for error tracking, PostHog for product analytics and funnel tracking
Email Resend for transactional emails ΓÇö onboarding sequences, review request emails
Code Editor Monaco Editor loaded from CDN for ConvertFlow in-app editing
2.2 Performance Constraints ΓÇö Non-Negotiable
- Widget scripts loaded with async and defer attributes ΓÇö never blocking page render under any circumstance
- All widgets are tree-shaken and code-split: a merchant using only sticky cart loads only the sticky cart code, nothing
else
- CSS injected inline or via a single stylesheet request ΓÇö never multiple CSS file requests
- All Shopify Admin API calls batched where possible and cached in Redis with a 60-second TTL
- Storefront API calls use edge caching with 5-second stale-while-revalidate strategy
- Total JavaScript payload added to any storefront must not exceed 40kb gzipped ΓÇö enforced by esbuild bundle size
check in CI
- The ConvertFlow extraction endpoint must return in under 5 seconds ΓÇö Claude API call is timed and logged

-- 6 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 7
2.3 Database Schema
Shop id, shopDomain (unique), accessToken, plan (free/pro/enterprise), installDate,
settings (JSON), lastActiveAt, uninstalledAt
Section id, shopId, type (hero/testimonial/faq/etc.), name, config (JSON), position, isActive,
createdAt, updatedAt
Page id, shopId, slug (unique per shop), title, content (JSON block-based), seoTitle,
seoDescription, publishedAt, createdAt
Theme id, shopId, name, previewImageUrl, cssVariables (JSON), isActive, appliedAt,
createdAt
UrgencyTimer id, shopId, productId (nullable), collectionId (nullable), deadline (datetime),
displayType (countdown/scarcity/banner), message, isActive
ReviewRequest id, shopId, orderId, customerId, productId, status (pending/sent/completed),
generatedReview (text), sentAt, completedAt
AnalyticsEvent id, shopId, eventType (pageview/feature_interact/purchase), value (decimal),
featureName, sessionId, createdAt
Plan id, name, priceMonthly, features (JSON array), stripeProductId, shopifyBillingId
Extraction id, shopId, sectionKey, sectionName, rawLiquid, rawCSS, rawSchema,
processedLiquid, processedCSS, processedSchema, themeCheckerPass (bool),
errors (JSON), createdAt
LibraryItem id, shopId, name, description, tags (text array), liquidCode, cssCode, schemaCode,
previewImageUrl, isPublic, usageCount, shareToken, shareExpiresAt, createdAt
PushHistory id, shopId, libraryItemId, targetThemeId, targetThemeName, pushedAt, status,
errorMessage, backupLiquid
2.4 Required Shopify API Scopes
read_products, write_products, read_orders, write_orders, read_customers, write_customers, read_themes,
write_themes, write_script_tags, read_script_tags, read_inventory, read_analytics, read_content, write_content
2.5 Required GDPR Webhooks
- customers/redact ΓÇö delete all customer data for a specific customer on request
- shop/redact ΓÇö delete all shop data when merchant requests data deletion
- customers/data_request ΓÇö return all data held for a specific customer within 30 days
- app/uninstalled ΓÇö immediately delete all shop data including LibraryItems, Extractions, and AnalyticsEvents

-- 7 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 8
Section 3 ΓÇö Feature Specifications ΓÇö Sections, Themes, Pages
3.1 Prebuilt Sections Library ΓÇö 30+ Sections at Launch
Sections are drag-and-drop blocks inserted into any Shopify page via theme app extensions (Shopify Online Store 2.0
app blocks). Every section is a self-contained HTML, CSS, and JavaScript component. All sections work on all Shopify
themes without any custom code from the merchant.
Hero Sections ΓÇö 5 variants
Split Layout Hero Left text column with headline, subtext, and CTA button. Right column with product or
lifestyle image. Mobile layout collapses to stacked. Animated text entrance using
IntersectionObserver on scroll. Fully customizable via app block settings.
Video Background Hero Full-width background video with text overlay and CTA. Video is lazy-loaded with a
preload thumbnail. Fallback static image for mobile where video is blocked. Plays on
loop, muted, autoplay.
Countdown
Announcement Bar
Slim bar pinned to the top of the page with an embedded live countdown timer and a
CTA link. Used for flash sales and limited-time offers. Configurable start and end
dates.
Social Proof Scroll Bar Horizontal auto-scrolling bar displaying press mention logos, certification badges, or
partner logos. Speed and pause-on-hover configurable. Seamless infinite loop using
CSS animation.
USP Icon Grid Four-column icon grid showing unique selling points ΓÇö free shipping, 30-day returns,
secure checkout, etc. 40+ prebuilt icons. Each column has icon, headline, and short
description text.

-- 8 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 9
Product Enhancement Sections ΓÇö 6 variants
Ingredients Breakdown Accordion-style section showing product ingredients or materials with individual icons
and descriptions. Used by beauty, food, and supplement brands. Each ingredient item
is independently configurable.
Before and After Slider Drag-to-reveal interactive image comparison slider showing product results.
Touch-enabled with smooth dragging. Works on all mobile browsers. Widely used by
skincare and fitness brands.
Product Benefits Grid Three or four-column benefits grid with icon, benefit headline, and short description.
Appears between product images and the description. Increases perceived value.
Tabbed Product Info Tabbed section for Description, Ingredients, How to Use, and FAQ. Smooth tab
switching animation. Mobile shows accordion instead of tabs. Reduces page length
while keeping all information accessible.
Size and Fit Guide Modal or inline table showing size charts with a unit toggle between cm and inches.
Reduces sizing-related returns significantly. Configurable column headers for apparel,
shoes, or other product types.
Complementary
Products
Manually curated complementary product grid with product thumbnails, prices, and
individual add-to-cart buttons. Configured in the app dashboard by selecting products
from the merchant's catalog.
Trust and Social Proof Sections ΓÇö 5 variants
Star Rating Summary Aggregated review score display with a star breakdown chart (5-star count, 4-star
count, etc.) pulled from Shopify product review metafields. Works with Judge.me,
Okendo, and Shopify native reviews.
Press and Media Logos Static or scrolling grid of media publication logos with an optional pull-quote beneath
each. The classic 'As seen in' section. Logo images and links configurable per item.
Trust Badge Row Horizontal row of trust signals: SSL secure, BBB accredited, free returns, money-back
guarantee, US-based support. 40+ prebuilt badge icons. Fully customizable text per
badge.
Customer Photo
Reviews Grid
Masonry grid of customer photos with overlay star rating and review text. Supports
image uploads via the review form widget. Integrates with Judge.me photo reviews.
Real-Time Purchase
Notification
Toast popup in the bottom corner showing recent purchases: 'Sarah from Austin
bought this 2 hours ago'. Pulls data from Shopify Orders API for the last 7 days.
Requires minimum 5 real orders before activating ΓÇö never shows fake data.

-- 9 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 10
Conversion Sections ΓÇö 6 variants
Standalone Countdown
Timer
Full-width section containing a large countdown timer to a specific deadline. Shows
days, hours, minutes, and seconds. Automatically hides when the deadline passes.
Can be scoped to specific products or site-wide.
Stock Scarcity Progress
Bar
Shows remaining inventory count with a visual progress bar. Pulls real inventory
quantity from Shopify's Inventory API. Color changes based on stock level: green
above 10, orange 5-10, red below 5. Updates on every page load.
Bulk Discount Tier Table Visual table showing quantity-based pricing tiers: buy 1 for $20, buy 3 for $17 each,
buy 5 for $14 each. Integrates with Shopify automatic discounts or discount codes.
Encourages larger order sizes.
Guarantee Section Full-width guarantee block with a seal icon, bold guarantee headline, and terms text.
Configurable guarantee duration (15, 30, 60, 90 days). Appears on product pages and
cart page for maximum impact.
FAQ Accordion with
Schema
Accordion FAQ section with schema.org FAQPage markup for Google rich results.
AI-assisted FAQ generation based on the product description using the Claude API.
Categories supported.
Email Popup Capture Exit-intent or time-delayed popup offering a discount code in exchange for an email
address. Connects to Klaviyo via their JavaScript API or to Shopify Email. Shows
once per visitor per session.

-- 10 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 11
3.2 Prebuilt Themes ΓÇö 8 Complete Store Themes
A theme is a coordinated set of CSS variables applied to the Shopify theme via the Assets API ΓÇö covering color
palette, typography pair, border radius style, shadow style, and button style. Applied in one click from the onboarding
wizard or the Themes tab. Merchant can further customize individual variables after applying.
Theme Best For Design Character
Luxe Jewelry, fashion, beauty Dark background, gold accents, serif headings (Cormoran
Fresh Health, wellness, organic food White background, sage green accents, rounded 12px co
Bold Streetwear, sneakers, apparel Black background, red or yellow accents, condensed bold
Clean Electronics, tech accessories Light gray background, blue accents, precise 4px grid lay
Warm Home goods, candles, gifts Cream background, terracotta accents, soft drop shadows
Sport Fitness, supplements, activewear Dark navy background, bright lime accents, impact conde
Minimal Skincare, cosmetics, DTC beauty Pure white background, single muted accent color, 48px+
Artisan Handmade, craft, specialty food Textured off-white background, earthy brown and olive to
3.3 Prebuilt Page Templates ΓÇö 8 Complete Pages
Each page template is a complete, conversion-optimized page built from ConvertKit sections and served through
Shopify Online Store 2.0 templates. Published with one click. Fully editable via the page builder after publishing.
Homepage Hero section, USP grid, featured collection, customer photo reviews, press logos,
email popup, FAQ section, trust badge row. The most impactful page for first-time
visitors.
Product Launch Page Countdown timer, product highlight sections, waitlist email capture, founder story
section, early-bird pricing table, social share buttons. Used for pre-launch campaigns.
About Us Page Brand story section with large typography, founder photo and bio, mission statement,
team member grid, brand timeline milestones. Builds the human connection.
FAQ Page Categorized FAQ accordion with search input, schema markup for Google rich results,
contact CTA at the bottom. Reduces support tickets.
Contact Page Contact form, store location and hours, Google Maps embed, social media links,
expected response time message. Professional and trust-building.
Bundle Builder Page Curated product selection grid where customers build their own bundle, automatic
discount calculation displayed live, single add-to-cart for the entire bundle.

-- 11 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 12
Post-Purchase Page Order confirmation summary, upsell offer with one-click add (Shopify post-purchase
extension), loyalty points display, referral widget, social share prompt.
Coming Soon Page Email capture with countdown timer, teaser product images, social follow buttons,
progress bar showing signups toward a launch goal. Used for pre-launch stores.

-- 12 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 13
Section 4 ΓÇö Feature Specifications ΓÇö Sticky Cart, AI Reviews,
Urgency Maker
4.1 Sticky Add to Cart Button ΓÇö Complete Technical Specification
The sticky add to cart button is the highest-impact single feature in ConvertKit. It is a persistent bar that follows the
customer as they scroll down the product page, ensuring the buy button is always visible. This single feature produces
measurable conversion lifts on any product page where the native add-to-cart button scrolls above the viewport.
- Appears when the native add-to-cart button scrolls above the viewport ΓÇö detected via IntersectionObserver API, not
scroll events
- The sticky bar contains: product thumbnail (48x48px), product title truncated to 40 characters, selected variant
name, current price, and the add-to-cart button
- Variant selection on the sticky bar is two-way synced with the main product form ΓÇö changing the variant in either
location updates both
- The add-to-cart action uses Shopify's native AJAX cart API (section rendering API) ΓÇö no page reload, instant cart
update
- After adding to cart: sticky bar shows a check mark animation for 1.5 seconds then displays a 'View Cart' link
- Hidden on mobile viewports under 768px by default with a toggle in the dashboard to enable it on mobile
- Slides in from the bottom with a 200ms ease-out CSS transition ΓÇö zero Cumulative Layout Shift
- The entire sticky bar JavaScript and CSS is under 8kb gzipped ΓÇö measured and enforced by esbuild
- Multiple variants support: color swatches and dropdown selectors both supported
- Out-of-stock handling: sticky bar shows 'Notify me' button when variant is out of stock, triggering email capture
4.2 AI Review Writing ΓÇö Complete Flow
AI review writing uses the Claude API to help customers who want to leave a review but do not know what to write.
The result is higher quality reviews, more reviews submitted, and better SEO signals from longer, more detailed review
text.
Step 1 ΓÇö Trigger After order delivery (configurable delay: 7, 14, or 21 days), ConvertKit sends an
automated review request email via Shopify Email or Klaviyo webhook integration.
Step 2 ΓÇö Landing Customer clicks the review link in the email and lands on a branded review form page
hosted by ConvertKit via a Shopify storefront proxy URL.
Step 3 ΓÇö Star rating Customer selects a star rating (1-5). The form then shows 2-3 guided questions based
on the rating: positive ratings show 'What did you love most?' and 'What problem did it
solve?'. Negative ratings show 'What could be improved?'.

-- 13 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 14
Step 4 ΓÇö AI assist If the customer clicks 'Help me write this', the app sends their star rating, product
name, product category, and question answers to the Claude API.
Step 5 ΓÇö Claude output Claude generates a first-person, natural-sounding review draft that the customer can
edit before submitting. The draft is 40 to 120 words, uses conversational language,
and avoids marketing superlatives.
Step 6 ΓÇö Submission The submitted review is stored in the database and optionally pushed to Shopify
Product Reviews, Judge.me, or Okendo via their respective APIs.
Claude system prompt for review writing (exact text):
You are helping a real customer write a product review. The review must sound like a genuine human wrote it. No
marketing language. No superlatives like 'amazing' or 'life-changing'. Use simple, conversational language. First
person. 40 to 120 words. Do not mention the brand name more than once.
4.3 Urgency Maker ΓÇö 5 Tools, All Using Real Shopify Data
Every urgency signal in ConvertFlow is sourced from real Shopify data. No fake countdown timers that reset every 24
hours. No fabricated purchase notifications. If the real data does not meet the minimum threshold, the feature does not
show ΓÇö ever.
Inventory Scarcity
Counter
Displays 'Only X left in stock' when inventory falls below a configurable threshold (1 to
20 units). Pulls real inventory quantity from Shopify's Inventory API. Shows a colored
progress bar: green above 10 units, orange 5 to 10, red below 5. Updates on every
page load with a 60-second Redis cache to avoid rate limits.
Sale Countdown Timer A real deadline countdown showing days, hours, minutes, and seconds until a sale
end date. Set the deadline once in the dashboard. Automatically hides when the
deadline passes ΓÇö it does not reset. Can be scoped to specific products, specific
collections, or site-wide. If no deadline is set, the feature does not show.
Recent Buyer
Notification
Toast notification in the bottom corner showing real recent orders: 'Sarah from Austin
just bought this 2 hours ago'. Pulls data from Shopify Orders API for the last 7 days.
Requires a minimum of 5 real orders before the feature activates. The merchant
cannot override this minimum ΓÇö it exists to prevent misleading social proof on new
stores.
Cart Threshold Progress
Bar
A progress bar in the cart drawer and product page showing how close the customer
is to free shipping or a discount tier. 'Add $12 more for free shipping'. Dynamically
updates in real time as the customer adds or removes items. Threshold amounts are
configurable in the dashboard.

-- 14 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 15
Time-Sensitive Offer
Banner
A dismissible banner at the top of the page showing a time-limited offer with an
embedded mini countdown. 'Order in the next 2h 14m for same-day dispatch'.
Configurable per-product or site-wide. The countdown is real ΓÇö it runs from the time
the customer first lands on the page and does not reset on refresh.

-- 15 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 16
Section 5 ΓÇö Feature Specifications ΓÇö Upsell Engine, Trust Tools,
Analytics
5.1 Upsell Engine
In-Cart Upsell Popup When a customer adds a product to cart, a modal appears with one complementary
product recommendation and a one-click add offer. The recommendation is
rule-based: the merchant sets product pairings manually in the dashboard. No AI ΓÇö
the merchant knows their best pairings. The popup has a 3-second delay and a clear
dismiss button. Converts at 8 to 12 percent on average for well-configured stores.
Post-Purchase Upsell
Page
After Shopify checkout completes, the customer is redirected to a ConvertKit-hosted
thank-you page using the Shopify post-purchase extension. The page shows a single
upsell product with a one-click purchase button that charges the customer's saved
payment method without re-entering card details. The highest-converting upsell
placement in any Shopify store.
Bundle Builder Widget An embeddable widget on product pages that lets customers build their own bundle
from a curated product set. Each bundle combination shows the calculated savings.
The entire bundle is added to cart with one click as individual line items with a bundle
discount applied automatically via Shopify automatic discounts API.
Frequently Bought
Together
A widget below the product form showing 2 to 4 products commonly purchased with
the current product. The merchant configures the pairings manually. Customers can
select or deselect individual items. One-click add for all selected items simultaneously.
5.2 Trust and Credibility Tools
Trust Badge Builder Drag-and-drop badge selector with 40+ prebuilt trust icons: SSL secured, BBB
accredited, McAfee protected, free returns, money-back guarantee, US-based
support, and more. Each badge has configurable icon and text. Inserts as an app
block anywhere in the theme ΓÇö below add-to-cart button, in the footer, or as a
standalone section.
Verified Review Display Fast, clean review display widget showing star rating, review text, reviewer first name
and city, verified purchase badge, and review date. Renders in under 10ms. No
third-party dependencies. Supports text reviews and photo reviews. Schema markup
included for Google rich results.
Money-Back Guarantee
Banner
Configurable guarantee section with a seal graphic, bold headline, guarantee duration
(15, 30, 60, or 90 days), and terms text. Shows on product pages and the cart page.
One of the highest-trust signals available for any product category.

-- 16 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 17
Security Seals Display Displays recognized security certification logos near the checkout button. Shopify
secure checkout badge, SSL certificate visual, and payment method icons (Visa,
Mastercard, Apple Pay, Google Pay, PayPal). Pulls the merchant's actual accepted
payment methods from Shopify.
5.3 Revenue Attribution Analytics Dashboard
The analytics system is the primary retention driver. Merchants stay because they can see exactly how much money
ConvertKit made them this month. The system uses a lightweight event tracking layer that writes to the AnalyticsEvent
table in batches of 50 events using a queue pattern to avoid blocking the storefront.
Conversion Rate Tracker Shows conversion rate by day for the last 30, 60, and 90 days. Marks the date each
ConvertKit feature was activated with a vertical line on the chart so merchants can see
the direct before-and-after impact.
Feature Performance
Report
For each active feature, shows: impressions (times shown), interaction rate
(percentage of visitors who engaged), and attributed revenue (revenue from sessions
where the feature was engaged). Sorted by attributed revenue descending.
Revenue Attribution
Total
Shows total revenue from sessions where at least one ConvertKit feature was
engaged. This number updates daily. It is the primary metric shown on the Overview
screen and is the number that justifies the subscription every month.
Session Funnel Shows the full funnel for ConvertKit-engaged sessions: landed on page > viewed
feature > interacted with feature > added to cart > reached checkout > purchased.
Shows drop-off at each stage to identify optimization opportunities.

-- 17 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 18
Section 6 ΓÇö Onboarding UX ΓÇö 5-Step Wizard with Wireframes
The first 10 minutes after install determines whether a merchant activates and stays forever or uninstalls before seeing
any value. The onboarding wizard is designed around one principle: get the merchant something visible on their live
store within 5 minutes, before they finish their first cup of tea.
6.1 Onboarding Design Rules
- One screen. One decision. One button. Never show two choices on the same screen at the same time
- Progress dots visible at the top of every step ΓÇö 5 dots, filled as the merchant progresses
- Every step ends with a 'View on store' link so the merchant sees the change on their actual storefront immediately
- No forms with multiple fields. Use toggles, visual cards, and single-click selections
- Every step has a 'Set up later' option ΓÇö never force a step that blocks progress
- The entire wizard must be completable in under 10 minutes ΓÇö tested and timed with real merchants
- Error states must be friendly and action-oriented: 'Something went wrong ΓÇö tap here to retry'
Step 1 of 5 ΓÇö Automated Store Audit (60 seconds)
Immediately after OAuth, the app runs a silent store audit checking for 8 key missing features. The merchant sees a
visual scorecard before touching any settings ΓÇö they understand the problem instantly.
Step 1 ΓÇö Your store health check (runs automatically)
We scanned your store. Here is what we found:
Sticky cart button MISSING Fix this ->
Trust badges MISSING Fix this ->
Urgency signals MISSING Fix this ->
Review display PARTIAL Improve ->
Fix all of these now ->
Step 2 of 5 ΓÇö Pick a Theme (90 seconds)
Show the 8 prebuilt themes as large visual cards. One click applies the theme to the live store via the Shopify Assets
API. This is the merchant's first visible win ΓÇö their store looks more professional without touching a line of code.

-- 18 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 19
Step 2 ΓÇö Pick a theme that fits your brand
Choose your starting style. You can always change this later.
Luxe Fresh Bold Clean Warm
Sport Minimal Artisan
Selected: Luxe | Preview live on your store ->
Apply Luxe theme to my store ->
Step 3 of 5 ΓÇö Activate 3 Quick Wins (120 seconds)
Three toggles in the exact order of impact: sticky cart first (highest immediate conversion lift), then inventory scarcity,
then trust badges. Each activates on the live store immediately. The 'View on store' link opens after each toggle so the
merchant sees the result.
Step 3 ΓÇö Turn on your three most important tools
Each toggle below activates instantly on your live store. Click View to see it.
Sticky Add to Cart ON View on store ->
Inventory Scarcity Counter ON View on store ->
Trust Badge Row OFF Turn on ->
All set, continue ->

-- 19 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 20
Step 4 of 5 ΓÇö Set Up Review Requests (60 seconds)
One decision ΓÇö when to send the review email after delivery. Show a live preview of the email template. One toggle to
activate. AI writing is teased here as a Pro feature to drive upgrade intent.
Step 4 ΓÇö Start collecting better reviews automatically
How many days after delivery should we send the review request?
7 days 14 days 21 days
AI review writing: helps customers write better reviews with one click [Pro feature]
Preview email template ->
Activate review requests ->
Step 5 of 5 ΓÇö Dashboard and Plan Upgrade (60 seconds)
Show the revenue attribution dashboard with an estimate based on the merchant's actual traffic data. Surface the 3
features locked behind Pro. This is the primary free-to-paid conversion moment ΓÇö the merchant sees the money they
are leaving on the table by staying on free.
Step 5 ΓÇö Your store is live. Here is what ConvertKit could earn you.
Based on your current traffic, ConvertKit Pro could generate:
$840
Estimated new revenue / month
from recovered lost sales
Unlock to get this: AI reviews, post-purchase upsell, bundle builder, ConvertFlow code tool
Upgrade to Pro ΓÇö $19/month
Stay on Free

-- 20 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 21
Section 7 ΓÇö Dashboard UX ΓÇö All 9 Screens with Wireframes
7.1 Navigation Structure
Left sidebar with 10 navigation items. Always visible on desktop. Collapsible on mobile. Active state: solid left border in
ACCENT color. Feature count badge shown on applicable items. 'NEW' badge shown on recently released features for
30 days.
Nav Item What it Shows
Overview Conversion rate graph, attributed revenue this month, active features, store hea
Sections Filterable grid of 30+ sections with add-to-store and configure buttons
Pages All published ConvertKit pages with edit, preview, publish, and delete actions
Themes 8 theme presets with one-click apply and CSS variable customizer
Urgency Tools Unified panel for all 5 urgency maker components with status indicators
Reviews Review request settings, submitted review list, AI generation log
Upsells Upsell rule configuration, bundle builder setup, post-purchase page editor
Analytics Full conversion and revenue dashboard with 30/60/90-day date range filter
ConvertFlow Liquid code extraction engine ΓÇö Pro plan only, teal accent color in nav
Settings Billing, plan management, widget customization, integration API keys
7.2 Overview Screen ΓÇö Primary Dashboard
First screen seen on every login. Must answer three questions in under 5 seconds: how is my store performing, what
did ConvertKit earn me this month, what should I do next.

-- 21 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 22
Overview ΓÇö Your store performance at a glance
Conversion rate: 3.1% Was 1.8% before ConvertKit
Revenue attributed: $1,240 This month from ConvertKit
Active features: 7 of 12 Store health: 4.2 / 5.0
[Conversion rate line chart ΓÇö 30 days, ConvertKit activation marked]
Next recommended: Add Post-Purchase Upsell | Est. +$200/month ->
7.3 Sections Library Screen
Sections Library ΓÇö All 30+ sections with filter tabs
All (30) Hero (5) Product (6) Trust (5) Conversion (6) My Active (7)
Hero - Split Layout [ACTIVE] Configure ->
Hero - Video Background Add to Store ->
Stock Scarcity Bar [ACTIVE] Configure ->
Before and After Slider Add to Store ->
7.4 Urgency Tools Screen

-- 22 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 23
Urgency Maker ΓÇö All 5 tools with status indicators
All urgency signals use real data from your Shopify store. No fake timers.
Inventory Scarcity Counter ACTIVE Configure ->
Sale Countdown Timer INACTIVE Set deadline ->
Recent Buyer Notification ACTIVE Configure ->
Cart Threshold Bar INACTIVE Activate ->
Time-Sensitive Offer Banner INACTIVE Set up ->

-- 23 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 24
7.5 Analytics Screen
Analytics ΓÇö Revenue attributed by ConvertKit per feature
All revenue shown is from sessions where a ConvertKit feature was interacted with.
Sticky Add to Cart $520 this month 42% of total
Urgency ΓÇö Scarcity $340 this month 27% of total
Trust Badges $230 this month 18% of total
AI Reviews $150 this month 12% of total
Total attributed this month $1,240

-- 24 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 25
Section 8 ΓÇö Pricing, ROI Model, App Store Listing
8.1 Pricing Tiers
Plan Price Includes
Free $0/month Sticky cart, 3 sections, 1 theme, basic analytics, 100 events/month
Pro $19/month All 30+ sections, all 8 themes, all 8 page templates, all urgency tools, AI review writing, upsell engine, bundle buil
Enterprise $49/month Everything in Pro plus white-label badge removal, multi-store management (up to 10 stores), custom CSS injectio
8.2 The ROI Math ΓÇö Why $19 Is a Guaranteed Yes
Example: mid-size Shopify store before ConvertKit
Traffic: 1,000 visitors per day | Conversion rate: 1.5% | Average order value: $60
Monthly revenue: 1,000 x 30 x 0.015 x $60 = $27,000/month
After ConvertKit Pro ΓÇö conservative improvement scenario:
Conversion rate improves to 2.5% (sticky cart, urgency, trust badges doing their job)
Average order value improves to $69 (upsell engine adding $9 per order on average)
Monthly revenue: 1,000 x 30 x 0.025 x $69 = $51,750/month
New revenue attributed to ConvertKit: $51,750 - $27,000 = $24,750/month
App cost: $19/month. Return on investment: 1,302x. The ROI case is not a claim ΓÇö it is math.
8.3 Shopify App Store Listing Specification
App Name ConvertKit - CRO and Store Design
Tagline Convert more visitors. One app. Zero slowdown.
Category Store design, Marketing, Conversion optimization
Primary Keyword conversion rate optimization
Secondary Keywords sticky add to cart, page builder, urgency timer, review app, product page builder, shopify
sections
Description Hook Most Shopify stores convert 1-2% of visitors. ConvertKit helps stores hit 3-4% using
proven conversion design applied in under 10 minutes.

-- 25 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 26
Review Target 4.7+ star average on Shopify App Store within 30 days of launch
Support Email support@convertkit-app.com
Privacy Policy Hosted at app domain /privacy ΓÇö required for App Store submission

-- 26 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 27
Section 9 ΓÇö Engineering Prompt ΓÇö ConvertKit Build Instructions
Paste the following block directly into Claude Code, Cursor, or any AI coding assistant to begin building ConvertKit.
This contains all technical constraints, priority order, scope, and security requirements.
Build a production-grade Shopify app called ConvertKit using Shopify CLI 3.x Remix template.
Must pass Shopify App Store review on first submission.
TECH STACK:
Node.js 20, Remix, Prisma + PostgreSQL, Redis (Upstash), Shopify Polaris for admin UI,
Vanilla JS + esbuild for storefront widgets (no React on storefront), Tailwind for admin.
SHOPIFY SCOPES:
read_products, write_products, read_orders, write_script_tags, read_themes, write_themes,
read_customers, write_customers, read_inventory, read_analytics, read_content, write_content.
BUILD PRIORITY ORDER:
1. OAuth install flow with PostgreSQL session storage
2. Shopify Billing API ΓÇö Free, Pro $19/mo, Enterprise $49/mo
3. Script tag injection loading the ConvertKit widget bundle on storefront
4. Sticky Add to Cart widget (highest priority feature, under 8kb)
5. Section library ΓÇö first 10 sections: hero-split, video-hero, usp-grid, trust-badges,
scarcity-bar, countdown-timer, faq-schema, star-rating, before-after, email-popup
6. Theme preset system (8 themes via Shopify Assets API CSS variable injection)
7. 5-step onboarding wizard as specified in Section 6
8. Urgency Maker suite ΓÇö all 5 tools, real Shopify data only
9. AI Review Writing ΓÇö Claude API (claude-sonnet-4-20250514)
10. Prebuilt pages (8 templates via storefront proxy)
11. Upsell engine ΓÇö in-cart popup + post-purchase Shopify extension + bundle builder
12. Analytics dashboard with revenue attribution event tracking
PERFORMANCE RULES (non-negotiable):
- Storefront widget bundle under 40kb gzipped ΓÇö CI fails if exceeded
- All widgets use IntersectionObserver for lazy init
- Zero Cumulative Layout Shift on any widget
- Shopify API calls cached in Redis TTL 60s
SECURITY:
- HMAC verification on all Shopify webhooks
- All data scoped to shopDomain
- JWT session tokens (Shopify standard)
- app/uninstalled webhook deletes ALL shop data immediately
UX RULE: Zero technical jargon in any UI copy. Every empty state shows exactly one next action.
Every feature activates with one toggle and works correctly with default settings.

-- 27 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 28
PART B ΓÇö ConvertFlow: Liquid Code Extraction Engine Inside ConvertKit
Section 10 ΓÇö ConvertFlow ΓÇö Overview and Competitive
Advantage
ConvertFlow in one sentence:
A Shopify developer opens the ConvertFlow tab inside ConvertKit, sees their store's sections listed visually, clicks
Extract on any section, and receives production-ready Liquid code, encapsulated CSS, and a fully editable JSON
schema in under 5 seconds ΓÇö ready to edit in Monaco Editor and push directly to any connected Shopify theme.
No URL paste. No scraping. No waiting.
10.1 The Key Insight ΓÇö Why ConvertFlow Beats Every Competitor
Every competitor in the Liquid extraction space ΓÇö including liquid-fund.com ΓÇö requires the developer to paste a public
Shopify store URL. The tool then scrapes the rendered HTML and attempts to reverse-engineer Liquid from DOM
output. This approach has fundamental limitations:
Competitor (URL-based) ConvertFlow (OAuth-based)
Developer must paste a URL for every extraction Store already connected via ConvertKit OAuth ΓÇö zero extra steps
Scrapes rendered HTML ΓÇö cannot access Liquid source Reads actual .liquid theme files via Shopify Admin API
Cannot access JSON schema ΓÇö must guess at settings Reads actual {% schema %} block from the theme file directly
Cannot access Shopify CSS variables or theme settings Reads assets.css and settings_data.json from theme
Code requires heavy manual cleanup to be usable Code is authentic theme output, passes Theme Checker immediately
Only works on public store pages Works on any theme file including development theme files
No push-to-theme capability Push extracted and edited code directly to any connected theme
10.2 What ConvertFlow Generates on Every Extraction
Liquid template A complete, self-contained Shopify section .liquid file. All hardcoded text strings
replaced with schema settings of type text or richtext. All hardcoded image URLs
replaced with image_picker settings using the image_url filter with WebP format. All
hardcoded colors replaced with color settings. No deprecated Liquid tags.

-- 28 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 29
Encapsulated CSS All CSS classes namespaced under .cf-sectionname-element following BEM
convention. No styles leak outside the section. No conflicts with existing theme styles.
Responsive breakpoints at 768px and 480px always included. CSS custom properties
used for color values.
JSON schema A complete schema block with name, class, settings array, and blocks array where
relevant. All settings have id, type, label, and default values. Passes Shopify official
theme-check CLI validation with zero errors. Compatible with Shopify Online Store 2.0
section rendering.
Combined file A single .liquid file containing all three components: the Liquid template, a style tag
with the encapsulated CSS, and the schema block at the bottom. Ready to drop
directly into any Shopify theme sections directory and render immediately.

-- 29 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 30
Section 11 ΓÇö ConvertFlow ΓÇö Technical Architecture and API
Calls
11.1 The 6-Step Extraction Pipeline
Step 1 ΓÇö Auth ConvertFlow uses the merchant's Shopify OAuth session already stored in
ConvertKit's PostgreSQL database. No additional authentication. The developer just
opens the ConvertFlow tab ΓÇö the connection is already there.
Step 2 ΓÇö Theme Read ConvertFlow calls GET /admin/api/2024-01/themes.json to identify the active theme. It
caches the theme ID in Redis with a 5-minute TTL. Then calls GET
/admin/api/2024-01/themes/{id}/assets.json to list all files in the theme's sections/
directory.
Step 3 ΓÇö Visual Index ConvertFlow builds a visual index of all sections: name derived from file key, section
type inferred from the schema name field, settings count from the schema settings
array length, and preview thumbnail generated from the Shopify theme preview URL
with the section_id param.
Step 4 ΓÇö File Fetch When the developer clicks Extract, ConvertFlow calls GET
/admin/api/2024-01/themes/{id}/assets.json?asset[key]=sections/{name}.liquid to read
the raw Liquid file content including the embedded {% schema %} block.
Step 5 ΓÇö AI Process The raw Liquid and schema are sent to the Claude API (claude-sonnet-4-20250514,
max_tokens: 4000). Claude cleans the code, replaces hardcoded values with schema
settings, encapsulates CSS, adds WebP image handling, and adds responsive
breakpoints. The response is parsed into four sections: LIQUID, CSS, SCHEMA,
COMBINED.
Step 6 ΓÇö Validate ConvertFlow runs the generated Liquid through the @shopify/theme-check-node
package as a child process on the app server. The validation result (pass/fail, errors
array, warnings array) is returned alongside the code. The Push to Theme button is
disabled if Theme Checker fails.
11.2 Shopify Admin API Calls Used by ConvertFlow
GET /themes Lists all themes for the shop. Used to identify the active theme (role=main) and available
development themes (role=development).
GET /assets list GET /themes/{id}/assets.json ΓÇö lists all files. ConvertFlow filters for keys starting with
'sections/' to build the section picker.

-- 30 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 31
GET /assets single GET /themes/{id}/assets.json?asset[key]=sections/{file}.liquid ΓÇö reads one theme file.
Returns the full Liquid source code with embedded schema.
PUT /assets PUT /themes/{id}/assets.json with body {asset: {key: 'sections/name.liquid', value:
processedCode}} ΓÇö writes the new section file to the theme.
DELETE /assets DELETE /themes/{id}/assets.json?asset[key]=... ΓÇö removes a file. Used only in library
cleanup, never used automatically.
GET /pages GET /admin/api/2024-01/pages.json ΓÇö lists all store pages for page-level extraction in the
Pages tab.
11.3 Claude API Integration ΓÇö Exact Prompt Structure
System prompt for ConvertFlow extraction (exact text):
You are a Shopify Liquid expert. You receive raw Liquid code and CSS from a Shopify theme section file. Your job
is to output a cleaned, production-ready version. Follow these rules exactly: (1) All hardcoded text strings must
become schema settings of type text or richtext. (2) All hardcoded image URLs must become image_picker
settings using image_url filter with format: webp and a width parameter. (3) All hardcoded hex colors must become
color settings. (4) All CSS classes must be prefixed with .cf-{section-name}__ using BEM convention. (5) CSS must
include responsive breakpoints at 768px and 480px. (6) Schema block must include name, class, and a complete
settings array with id, type, label, and default for each setting. (7) Use render not include for all sub-snippets. (8) All
code must pass Shopify theme-check with zero errors. Output exactly four clearly labelled sections: LIQUID, CSS,
SCHEMA, COMBINED. No explanations. Code only.

-- 31 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 32
Section 12 ΓÇö ConvertFlow ΓÇö UI and UX Specification with
Wireframes
12.1 ConvertFlow Navigation Placement
ConvertFlow appears as item 9 in the ConvertKit left sidebar, between Analytics and Settings. It uses the teal CF
accent color for its nav indicator to visually distinguish it from the rest of the app. On Free plan it shows with a lock icon
and 'Pro' badge. On Pro and Enterprise it is fully unlocked.
ConvertKit sidebar ΓÇö ConvertFlow nav item highlighted
Overview
Sections
Urgency Tools
Analytics
ConvertFlow [NEW ΓÇö Pro]
Settings
12.2 Main Screen ΓÇö Section Picker (No URL Needed)
When the developer opens ConvertFlow, all sections from their connected theme are already loaded. The screen
shows: a tab bar across the top (All Sections, Pages, My Library, Shared), the theme name and section count, and a
list of all section files with extract buttons.

-- 32 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 33
ConvertFlow ΓÇö Sections automatically loaded, no URL required
All Sections (14) Pages (6) My Library (8) Shared
Theme: Dawn 14.2 | 14 sections detected | Last synced 2 minutes ago | Sync now
hero-banner.liquid Extract -> Preview
featured-collection.liquid Extract -> Preview
testimonials.liquid Extract -> Preview
product-form.liquid Extract -> Preview
footer.liquid Extract -> Preview

-- 33 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 34
12.3 Code Output Screen ΓÇö 4 Tabs with Monaco Editor
After extraction completes (under 5 seconds), the developer sees four output tabs: Liquid, CSS, Schema, Combined.
Each tab has a Monaco editor (read-only by default), an Edit toggle, a Copy button, a Save to Library button, and a
Push to Theme button. Theme Checker result shown as a badge.
ConvertFlow ΓÇö Output screen after extraction
Extracted: hero-banner.liquid Theme Checker: PASS 3.1 seconds
Liquid CSS Schema Combined
{%- assign heading = section.settings.heading -%}
{%- assign image = section.settings.image -%}
<div class="cf-hero-banner__wrapper">
<img src="{{ image | image_url: width: 1200, format: 'webp' }}"
alt="{{ image.alt | escape }}" loading="lazy">
<h2>{{ heading | escape }}</h2>
</div>
{% schema %}{ "name": "Hero Banner", ... }{% endschema %}
Edit code Copy Save to Library Push to Theme ->
12.4 Push to Theme ΓÇö Safe Confirmation Flow
Any write operation to a Shopify theme requires explicit confirmation with a clear description of what will change.
Default target is always the development theme, never the active live theme.
ConvertFlow ΓÇö Push confirmation modal
You are about to push: sections/hero-banner.liquid
This will REPLACE the existing file in your selected theme.
Select target theme:
Dawn (Active ΓÇö Live store) Dawn Dev Copy (Recommended)
A backup of the original file is saved automatically before any push.
Push to Dev Theme
Cancel

-- 34 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 35
Section 13 ΓÇö ConvertFlow ΓÇö Component Library
The library is the retention engine for developers and agencies. Every extracted section saved becomes a permanent
reusable asset across every store they manage. An agency with 20 client stores saves each well-built section once
and deploys it to any store in one click.
13.1 Library Features
Save to Library Any extracted section is saved with a custom name, description, and tags. The library
item stores Liquid, CSS, schema, preview thumbnail, and usage count. Tags support
filtering: hero, product, trust, footer, conversion, etc.
Push to Any Store From the library, the developer selects any section and sees a dropdown of all Shopify
stores connected to any ConvertKit account on their subscription. One-click push to
the selected store. Same safe confirmation flow with development theme defaulting.
Share Link Any library item can be shared via a secure token-based URL that expires in 7 or 30
days (developer chooses). The recipient can preview the code and copy it without a
ConvertKit account. This is the viral growth mechanic ΓÇö one developer shares a
component, the recipient sees ConvertFlow.
Import from Share A developer who receives a share link and has a ConvertKit account can import the
section into their own library with one click from the share preview page.
Usage Analytics Each library item shows: times extracted, times pushed to a theme, times shared, last
pushed date. Agencies use this to identify their most valuable template components.
Backup and Restore Before every push, ConvertFlow saves the original theme file content as a BACKUP-
prefixed library item. The developer can restore any previous version of any theme file
from the library at any time.

-- 35 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 36
ConvertFlow ΓÇö My Library screen
My Library (8 saved components) Search by name or tag...
hero-split-dark Used 6x Push to Store -> Share
testimonials-v2 Used 3x Push to Store -> Share
product-media-tabs Used 9x Push to Store -> Share
BACKUP-hero-banner-original Restore

-- 36 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 37
Section 14 ΓÇö ConvertFlow ΓÇö Code Output Examples
14.1 Sample Liquid Output
The following is exactly what ConvertFlow outputs in the Liquid tab after processing a hero section. All hardcoded
values have been replaced with schema settings. Images use WebP. Schema block is complete.
{%- assign image = section.settings.image -%}
{%- assign heading = section.settings.heading -%}
{%- assign subtext = section.settings.subtext -%}
<div class="cf-hero-banner__wrapper">
<div class="cf-hero-banner__media">
{%- if image != blank -%}
<img
src="{{ image | image_url: width: 1200, format: 'webp' }}"
srcset="{{ image | image_url: width: 600, format: 'webp' }} 600w,
{{ image | image_url: width: 1200, format: 'webp' }} 1200w"
alt="{{ image.alt | escape }}"
loading="lazy"
width="{{ image.width }}"
height="{{ image.height }}"
>
{%- endif -%}
</div>
<div class="cf-hero-banner__content">
<h2 class="cf-hero-banner__heading">{{ heading | escape }}</h2>
<p class="cf-hero-banner__subtext">{{ subtext | escape }}</p>
<a href="{{ section.settings.cta_url }}"
class="cf-hero-banner__cta">
{{ section.settings.cta_label | escape }}
</a>
</div>
</div>
{% schema %}
{
"name": "Hero Banner",
"class": "cf-hero-banner",
"settings": [
{ "type": "image_picker", "id": "image", "label": "Background image" },
{ "type": "text", "id": "heading", "label": "Heading",
"default": "Your headline here" },
{ "type": "textarea", "id": "subtext", "label": "Subtext" },
{ "type": "text", "id": "cta_label", "label": "Button label",
"default": "Shop now" },
{ "type": "url", "id": "cta_url", "label": "Button link" }
]
}
{% endschema %}
14.2 Sample CSS Output ΓÇö Fully Encapsulated

-- 37 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 38
Every class is scoped under the section namespace. No global styles. Responsive breakpoints always included.
.cf-hero-banner__wrapper {
position: relative;
display: grid;
grid-template-columns: 1fr 1fr;
min-height: 480px;
overflow: hidden;
}
.cf-hero-banner__media img {
width: 100%;
height: 100%;
object-fit: cover;
}
.cf-hero-banner__content {
display: flex;
flex-direction: column;
justify-content: center;
padding: 40px 48px;
gap: 16px;
}
.cf-hero-banner__heading { font-size: 2.4rem; font-weight: 700; }
.cf-hero-banner__subtext { font-size: 1rem; opacity: 0.8; }
.cf-hero-banner__cta {
display: inline-block;
padding: 12px 28px;
background: var(--color-button);
color: var(--color-button-text);
border-radius: 4px;
text-decoration: none;
}
@media (max-width: 768px) {
.cf-hero-banner__wrapper { grid-template-columns: 1fr; }
.cf-hero-banner__content { padding: 24px; }
.cf-hero-banner__heading { font-size: 1.8rem; }
}
@media (max-width: 480px) {
.cf-hero-banner__heading { font-size: 1.4rem; }
.cf-hero-banner__cta { width: 100%; text-align: center; }
}

-- 38 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 39
Section 15 ΓÇö ConvertFlow ΓÇö Developer UX Principles and
Quality Standards
15.1 Developer UX Principles
ConvertFlow is built for technical users. The UX principles are different from ConvertKit's merchant-facing design.
Developers want speed, precision, and transparency. They distrust magic and surprises.
Show the raw code Always show actual Liquid, CSS, and schema. Never hide code behind visual
abstractions. Developers want to verify what they are getting before pushing anything
to a live theme.
Explain every change Before any write to a theme, show a clear diff view of what will change. 'This replaces
47 lines with 82 lines in hero-banner.liquid.' The developer sees exactly what changes
before clicking confirm.
Never auto-push ConvertFlow never writes to a theme without explicit developer confirmation. Every
push requires at least one confirmation click with a visible description of the target file
and theme name.
Default to dev theme The push confirmation always defaults to the development theme. The developer
must explicitly select the active (live) theme. This prevents accidental overwrites to
live stores.
Fail loudly If Theme Checker fails, show the exact error message and line number. Never show a
generic 'something went wrong'. The developer must be able to fix the issue without
leaving ConvertFlow.
Speed is the feature The complete extraction cycle must finish under 5 seconds. Progress is shown with
real-time stage labels: Fetching theme file... Processing with AI... Validating code...
Done. Developers do not wait in silence.
Keyboard shortcuts Copy Liquid: Cmd+1. Copy CSS: Cmd+2. Copy Schema: Cmd+3. Copy Combined:
Cmd+4. Push to theme: Cmd+Shift+P. Save to library: Cmd+S. Developers live on
keyboards ΓÇö shortcuts are not optional.
Preserve originals Before overwriting any theme file, ConvertFlow creates a BACKUP- prefixed copy in
the library. The developer can restore the original at any time with one click from the
library screen.
15.2 Theme Checker Compliance ΓÇö Non-Negotiable
- theme-check runs as a Node.js child process on the server before any code is returned to the developer

-- 39 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 40
- Errors block the output entirely ΓÇö Push to Theme button is disabled and the error is shown with line number
- Warnings are shown as amber badges but do not block output ΓÇö developer can proceed with awareness
- Pass shown as green 'Theme Checker: PASS' badge ΓÇö this is the trust signal developers rely on
- All generated Liquid uses render not include (include is deprecated in OS 2.0)
- All schema blocks include required fields: name, and settings array
- All image handling uses image_url filter ΓÇö never hardcoded CDN or asset URLs
- No hardcoded translation strings ΓÇö all visible text goes through schema settings

-- 40 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 41
Section 16 ΓÇö Engineering Prompt ΓÇö ConvertFlow Build
Instructions
Paste the following block into your AI coding assistant to build ConvertFlow as a new module inside the existing
ConvertKit Remix app.

-- 41 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 42
Build the ConvertFlow module as a new tab inside ConvertKit (existing Remix + Node.js 20 app).
WHAT IT DOES: Reads the merchant's Shopify theme files via Admin API (OAuth already done via ConvertKit),
sends raw code to Claude API, returns production-ready Liquid + CSS + JSON schema.
Developer edits in Monaco Editor and pushes back to Shopify theme. No URL input needed.
ROUTES:
GET /app/convertflow ΓÇö main page, load theme section list from Shopify
POST /app/convertflow/extract ΓÇö sectionKey -> fetch file -> Claude -> theme-check -> return code
POST /app/convertflow/push ΓÇö processedCode + themeId -> write to Shopify theme via Admin API
POST /app/convertflow/library ΓÇö save extraction to LibraryItem table
GET /app/convertflow/library ΓÇö list all LibraryItems for the shop
POST /app/convertflow/library/:id/push ΓÇö push library item to any connected store
GET /app/convertflow/share/:token ΓÇö public preview page (no auth required)
SHOPIFY API CALLS:
GET /admin/api/2024-01/themes.json ΓÇö identify active theme
GET /admin/api/2024-01/themes/{id}/assets.json ΓÇö list all section files
GET /admin/api/2024-01/themes/{id}/assets.json?asset[key]=X ΓÇö read one file
PUT /admin/api/2024-01/themes/{id}/assets.json ΓÇö push code to theme
CLAUDE API (in /extract route):
model: claude-sonnet-4-20250514, max_tokens: 4000
System prompt: You are a Shopify Liquid expert. Clean raw Liquid + CSS into production-ready
Shopify section code. Rules: (1) hardcoded text -> schema type text/richtext,
(2) images -> image_picker with image_url filter format: webp + width,
(3) colors -> schema type color, (4) CSS namespaced under .cf-{name}__ BEM,
(5) CSS includes breakpoints at 768px and 480px, (6) schema has name, class,
full settings array with id/type/label/default, (7) use render not include,
(8) passes theme-check zero errors.
Output labeled sections: LIQUID, CSS, SCHEMA, COMBINED. No explanation. Code only.
THEME CHECKER:
npm install @shopify/theme-check-node
After Claude returns: write LIQUID output to temp file, run theme-check as child process,
return { pass: bool, errors: [], warnings: [] } alongside the code.
Disable Push button if pass === false.
CODE EDITOR:
Monaco Editor from CDN: https://cdn.jsdelivr.net/npm/monaco-editor/min/vs/loader.js
Register custom Liquid tokenizer (basic: Liquid tags purple, output blue, strings yellow).
Read-only by default. Edit toggle enables editing. Show diff view before push.
DATABASE:
LibraryItem: id, shopId, name, tags[], liquidCode, cssCode, schemaCode,
previewUrl, usageCount, shareToken, shareExpiresAt, createdAt
PushHistory: id, shopId, libraryItemId, targetThemeId, targetThemeName,
pushedAt, status, errorMessage, backupLiquid
PUSH FLOW:
1. Show diff of current theme file vs new content
2. Modal defaults to development theme (role=development), never active theme
3. Before overwriting: save original content as LibraryItem with name "BACKUP-{filename}-{date}"
4. After successful push: increment LibraryItem.usageCount, add PushHistory record
5. On failure: show exact Shopify API error, do not increment usageCount
... (see engineering prompt section for full text)

-- 42 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 43
LAUNCH AND QUALITY ΓÇö Pre-Launch Checklist and 30-Day Targets
Section 17 ΓÇö Pre-Launch Checklist and 30-Day Growth Targets
17.1 Pre-Launch Technical Checklist ΓÇö ConvertKit
- GDPR webhooks verified: customers/redact, shop/redact, customers/data_request all implemented and tested
- app/uninstalled webhook deletes all shop data including sessions, sections, pages, urgency timers, review requests,
analytics events
- Privacy policy and terms of service URLs configured in Shopify Partner Dashboard before submission
- App handles plan downgrades and cancellations gracefully ΓÇö features deactivate without breaking the merchant's
store
- Billing API tested: free trial, upgrade free to Pro, upgrade Pro to Enterprise, downgrade, cancellation, failed payment
handling
- Widget bundle verified under 40kb gzipped ΓÇö add CI check that fails build if bundle exceeds this
- Script injection tested on the 10 most popular Shopify themes: Dawn, Refresh, Sense, Debut, Brooklyn, Narrative,
Minimal, Simple, Supply, Venture
- Sticky cart tested across Chrome, Safari, Firefox, Samsung Internet on desktop and mobile
- Urgency tools tested with edge cases: out-of-stock products, stores with no orders, zero-inventory products
- AI review writing tested with Claude API timeout and rate limit scenarios ΓÇö graceful fallback verified
- Onboarding wizard tested end-to-end in under 10 minutes with a non-technical tester
- Analytics event tracking verified to not block storefront rendering ΓÇö events queued and batched
- All section app blocks verified to work on OS 2.0 and OS 1.0 themes
17.2 Pre-Launch Technical Checklist ΓÇö ConvertFlow
- Extraction tested on the 10 most popular Shopify themes ΓÇö output verified as Theme Checker compliant for each
- Monaco Editor verified to load correctly on Chrome, Safari, Firefox desktop and Safari mobile
- Push to theme tested on both active and development themes with backup and restore verified
- Theme Checker validation tested with both passing and intentionally failing Liquid
- Share link expiry tested ΓÇö expired links show clean 'This share has expired' page with no code visible
- Library push-to-any-store tested across two different Shopify stores on the same ConvertKit account
- Claude API timeout handling ΓÇö if extraction exceeds 10 seconds, show error with retry button
- Redis cache invalidation ΓÇö updating a theme file in Shopify directly clears ConvertFlow's cached asset list
- Shopify API rate limiting tested ΓÇö ConvertFlow queues requests and never exceeds 2 per second
- GDPR: all LibraryItems, PushHistory, and Extractions deleted on uninstall webhook verified

-- 43 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 44
17.3 30-Day Post-Launch Growth Targets
Week 1 target 200 installs from Product Hunt launch, r/shopify community posts, and organic Shopify
App Store discovery
Week 2 target 500 installs from affiliate program activation (30% recurring commission) and YouTube
tutorial content indexing
Week 3 target 1,200 installs from word of mouth among activated merchants and targeted cold email
outreach to 500 merchants/week
Week 4 target 2,000 installs with paid plan conversion rate above 12% of total installs
MRR at day 30 $3,800+ from 200 paid installs at $19/month ΓÇö growth from Pro and Enterprise upgrades
Churn target Below 5% monthly ΓÇö achieved by ensuring every merchant sees real revenue gain in their
analytics dashboard within 7 days
Review target 4.7+ star average on Shopify App Store by day 30 ΓÇö driven by fast onboarding and visible
conversion improvement
Support target Under 4-hour first response time, under 24-hour resolution time for all support tickets
ConvertFlow target 50+ developers actively using ConvertFlow by day 30 ΓÇö measured by extraction count in
analytics
Developer NPS ConvertFlow NPS above 60 by day 30 ΓÇö developers recommend tools that save them
hours per week
17.4 Go-to-Market Activities by Week
When Activity
Day 1 Product Hunt launch. r/shopify post. Shopify Partners Slack announcement. IndieHackers post.
Day 1-7 Activate 10 founding affiliate partners. Post 3 YouTube tutorials. Begin cold email outreach campaign.
Day 8-14 Publish comparison content: ConvertKit vs PageFly, ConvertFlow vs liquid-fund.com. Reach out to Shopify theme developer comm
Day 15-21 Email all 500 installs: show them their conversion rate chart. Ask for App Store review. Offer to get on a call with top 10 most activ
Day 22-30 Agency outreach for Enterprise plan. Partner with 3 Shopify theme developers for bundle referrals. Publish case study from first m
This document is the complete specification for both ConvertKit and ConvertFlow. ConvertKit converts store visitors into
paying customers. ConvertFlow converts developer hours into production-ready components. Together they serve two
audiences from one Shopify app install, at one price point that delivers 130x ROI for merchants and hours saved per week for

-- 44 of 45 --

ConvertKit + ConvertFlow ΓÇö Complete Product Specification v3.0 Confidential
Internal Build Document Page 45
developers.

-- 45 of 45 --


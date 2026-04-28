# Meta Ads Reference

Platform guide for B2B paid social campaigns on Meta (Facebook and Instagram).

## Ads Manager Structure

```
Account
└── Campaign (objective, budget optimization)
    └── Ad Set (targeting, placement, schedule, budget)
        └── Ad (creative + copy + CTA)
```

- Campaign-level: choose objective and optionally enable Advantage Campaign Budget (distributes budget across ad sets).
- Ad Set-level: targeting, placements, schedule, and per-ad-set budget (if not using campaign budget).
- Ad-level: creative assets, copy, CTA button, destination URL.

## Objectives (ODAX Model)

| Objective | B2B Use Case |
|-----------|-------------|
| Awareness | Brand visibility, thought leadership reach |
| Traffic | Drive to landing pages, blog content, resources |
| Engagement | Post engagement, page likes, event responses |
| Leads | In-platform Instant Forms (similar to LinkedIn Lead Gen) |
| App Promotion | Rarely used in B2B |
| Sales | Website conversions, catalog sales (e-commerce-oriented but works for high-intent B2B actions) |

For most B2B campaigns, focus on **Leads** (in-platform forms), **Traffic** (content distribution), and **Awareness** (reach/frequency).

## Ad Formats

### Image Ads
- Single static image. Simple, fast to produce, effective for direct offers.
- Works across Feed, Stories, Reels, right column, Audience Network.

### Video Ads
- Native video. Strong for brand storytelling, explainers, testimonials.
- Auto-plays in feed (sound off by default — always add captions).

### Carousel Ads
- 2-10 swipeable cards, each with its own image/video, headline, link.
- Effective for multi-service showcases, step-by-step narratives, case study highlights.

### Collection Ads
- Cover image/video with product tiles below. Primarily e-commerce but can work for multi-asset B2B (e.g., report suite, service catalog).
- Opens into Instant Experience on tap.

### Instant Experience (Canvas)
- Full-screen mobile landing page within Meta. Loads instantly.
- Combines images, video, carousel, text, CTA buttons.
- Good for immersive brand storytelling without external landing page dependency.

## Lead Ads / Instant Forms

- Pre-filled with Facebook profile data (name, email, phone, company, job title).
- **Standard fields**: name, email, phone, city, state, zip, company name, job title.
- **Custom questions**: short answer, multiple choice, conditional logic (show question B based on answer to question A).
- **Higher intent option**: Add a review screen before submission (reduces volume, increases quality).
- **CRM integration**: Native for Salesforce, HubSpot, Mailchimp, Zapier; also via Meta's Leads Access API.
- **Thank-you screen**: Custom headline, description, CTA button (link to website, call, download).
- Lead quality on Meta is generally lower than LinkedIn for B2B — use custom questions and review screens to filter.

## Targeting

### Core Audiences (attribute-based)
- **Demographics**: Age, gender, education, relationship status, job title (limited), work industry (limited).
- **Location**: Country, state, city, zip code, radius targeting.
- **Interests**: Pages liked, content engaged with, inferred interests. Very broad — less precise than LinkedIn for B2B.
- **Behaviors**: Purchase behavior, device usage, travel habits. Derived from on-platform and partner data.

**B2B targeting limitation**: Meta's professional data is far less detailed than LinkedIn. Job title and industry targeting exists but is self-reported and inconsistent. Do not rely on Meta for precision B2B targeting by professional attributes.

### Custom Audiences (retargeting and matching)
- **Website Custom Audience**: Visitors to your site (requires Pixel). Segment by pages visited, time spent, frequency.
- **Customer List**: Upload email/phone list. SHA256 hashed. Match rates vary (typically 40-70% for email).
- **App Activity**: Users of your mobile app.
- **Engagement**: People who engaged with your content on Meta (video viewers, lead form openers, page engagers, Instagram interactions).
- **Offline Activity**: Upload offline event data (purchases, calls, meetings).

### Lookalike Audiences
- Seed audience of 1,000+ (recommended). Meta finds similar users.
- Size: 1-10% of target country population. Start with 1% for precision.
- Source quality matters more than size — seed with best customers, not all customers.

## Pixel Setup and Events

### Installation
- Single base pixel code installed site-wide (via GTM recommended, or direct embed).
- Pixel ID ties all events to your ad account.

### Standard Events
Pre-defined events Meta optimizes against:
- `PageView`, `ViewContent`, `Lead`, `CompleteRegistration`, `Contact`, `SubmitApplication`, `Schedule`, `Search`, `AddToCart`, `Purchase`.
- For B2B, most relevant: `Lead`, `CompleteRegistration`, `Contact`, `Schedule`, `ViewContent`.

### Custom Events
- Any event name you define (e.g., `DemoRequested`, `WhitepaperDownloaded`).
- Custom events can be used for Custom Audiences but not for ad delivery optimization unless mapped to a standard event.

### Custom Conversions
- Rules-based conversions defined in Events Manager (e.g., URL contains "/thank-you").
- Useful for tracking without code changes.

## Conversions API (CAPI)

- Server-side event tracking. Sends events from your server directly to Meta.
- **Purpose**: Compensates for browser tracking loss (iOS ATT, ad blockers, cookie restrictions).
- **Deduplication**: Include `event_id` in both Pixel and CAPI events. Meta deduplicates based on matching `event_id` + `event_name`.
- **Setup options**: Direct API integration, partner integrations (Zapier, Segment, GTM server-side), or Meta's Commerce Platform integrations.
- **Event matching**: Include as many user parameters as possible (email, phone, IP, user agent, fbclid) to improve match quality.
- **Strongly recommended** for all conversion-optimized campaigns. Browser-only tracking increasingly unreliable.

## Bidding Strategies

| Strategy | How It Works | Best For |
|----------|-------------|----------|
| Highest Volume | Maximize results within budget, no cost control | New campaigns, testing, broad audiences |
| Cost Per Result Goal | Target average cost per result | Known CPA target, scaling |
| Bid Cap | Hard ceiling on per-auction bid | Strict cost control, competitive auctions |
| ROAS Goal | Target return on ad spend | Revenue-optimized campaigns (rare in B2B) |

- **Highest Volume** is the default. Let Meta's algorithm optimize freely. Best starting point.
- **Cost Per Result Goal**: Set after you have 50+ conversions and know your target CPA. Meta aims for the average but individual conversions may cost more.
- **Bid Cap**: Aggressive cost control but risks under-delivery. Use when you have hard cost constraints.
- ROAS Goal requires revenue values passed with conversion events — rarely applicable to B2B lead gen.

## Attribution Settings

- **Click-through window**: 1-day or 7-day (default: 7-day). Conversion counted if user clicks ad and converts within window.
- **View-through window**: 1-day (only option). Conversion counted if user sees ad (no click) and converts within 1 day.
- Attribution setting is per-ad-set and affects both reporting and optimization.
- For B2B with longer sales cycles, 7-day click is standard. View-through 1-day captures some influence but is less reliable.

## B2B Considerations on Meta

### Strengths
- **Lower CPMs/CPCs** than LinkedIn (often 3-10x cheaper per impression/click).
- **Massive reach** for retargeting — most professionals are on Meta even if they're not in "work mode."
- **Strong retargeting engine** — website visitors, video viewers, and engagement audiences perform well.
- **Content distribution** — promoting blog posts, reports, webinars to broad audiences at low cost.

### Limitations
- **Professional targeting is weak** — job titles are self-reported and inconsistent. Cannot target by company name, seniority, or function with LinkedIn's precision.
- **Lead quality is variable** — lower intent environment produces more form fills but more noise. Always use higher-intent form settings and qualifying questions.
- **Not ideal for ABM** — no equivalent to LinkedIn's company targeting. Customer list matching is the closest option.

### When to Use Meta for B2B
- Retargeting website visitors and engaged audiences (high value, low cost).
- Content distribution and thought leadership amplification to broad professional audiences.
- Supplementing LinkedIn campaigns to increase frequency at lower cost.
- Lead gen when cost-per-lead matters more than lead-to-opportunity conversion rate.
- Avoid for: precision ABM, targeting by professional attributes, C-suite targeting.

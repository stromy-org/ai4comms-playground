# Google Ads Reference

Platform guide for B2B paid social campaigns on Google (Display, YouTube, Demand Gen).

**Scope**: This reference covers Google campaign types that function as social/display advertising. Google Search campaigns are out of scope for this skill but are noted where relevant as a handoff recommendation.

## Campaign Types Relevant to B2B Social

### Display Campaigns
- Banner and responsive ads across Google Display Network (GDN): 3M+ websites, apps, Gmail.
- Formats: responsive display ads (auto-assembled from uploaded assets), uploaded image ads, HTML5 ads.
- Use for: brand awareness, retargeting, content promotion at scale.
- Low CPMs but generally low intent. Best as a retargeting channel or for broad awareness.

### YouTube / Video Campaigns
- Video ads served on YouTube and Google Video Partners.
- Multiple formats (see below). Sold on CPV (cost per view), CPM, or CPA basis.
- Use for: brand awareness, thought leadership video, product demos, retargeting.

### Demand Gen Campaigns
- Social-style visually rich ads across YouTube (in-feed, Shorts), Gmail (Promotions/Social tabs), and Discover feed.
- Closest Google equivalent to Meta/LinkedIn feed ads.
- Formats: single image, carousel, video — all in a scroll-friendly, social-like presentation.
- Use for: mid-funnel content distribution, lead gen, retargeting across Google surfaces.
- Can use Lead Gen form extensions (in-platform forms, similar to LinkedIn/Meta lead forms).

### Performance Max (PMax)
- Automated across all Google surfaces (Search, Display, YouTube, Gmail, Discover, Maps).
- Google's AI decides placement, bidding, and targeting.
- Use for: full-funnel automation when you have strong conversion data and sufficient budget.
- Less control over where ads appear. Not recommended for precision B2B targeting without exclusions.
- If you need control over messaging by funnel stage, use Demand Gen or Video instead.

### When to Recommend Google Search Instead
- When the prospect is actively searching for your service category (high intent, keyword-driven).
- When you need to capture existing demand rather than create it.
- Search is not "social" — recommend it as a complement to social campaigns, not a replacement.
- Flag to the client: "Search captures demand; social creates it. You likely need both."

## YouTube Ad Formats

| Format | Duration | Skippable | Billing | Best For |
|--------|----------|-----------|---------|----------|
| Skippable In-Stream | No max (recommend 15s-3min) | After 5s | CPV (view = 30s or completion) | Awareness, consideration, retargeting |
| Non-Skippable In-Stream | 15-20s | No | CPM | High-impact messaging, forced exposure |
| Bumper | 6s max | No | CPM | Frequency, reinforcement, short messages |
| In-Feed (Discovery) | Any | N/A (click to play) | CPC | Thought leadership, tutorials, long-form |
| YouTube Shorts | Up to 60s | After 5s | CPV/CPM | Mobile-first awareness, younger audiences |

**B2B recommendations**:
- Skippable in-stream for most B2B video (awareness + consideration). 30-60s ideal.
- Bumpers for retargeting reinforcement after initial video view.
- In-feed for long-form thought leadership content.

## Demand Gen Campaign Details

- **Assets**: Upload images (1200x628, 1080x1080, 960x1200) and/or videos.
- **Carousel**: 2-10 cards with individual headlines and descriptions.
- **Ad copy**: Headline (40 chars), description (90 chars), business name, CTA button.
- **Placements**: YouTube (Home, Watch Next, In-Feed, Shorts), Gmail (Promotions, Social), Discover feed.
- **Lead forms**: Attach lead form extensions. Pre-filled with Google account data. CRM integration via webhook or download.
- **Lookalike segments**: Seed with customer lists, Google finds similar users across Google surfaces.

## Targeting

### Audience Segments
- **Detailed Demographics**: Education level, parental status, homeownership, employer size (limited). Less precise than LinkedIn for B2B.
- **Affinity**: Broad interest categories (e.g., "Business Professionals", "Technology Enthusiasts"). Top-of-funnel only.
- **In-Market**: Users actively researching or comparing products/services. Google detects intent from search and browse behavior. Relevant B2B categories: Business Services, Business Technology, Advertising & Marketing Services, Financial Services.
- **Life Events**: Job change, business creation. Limited utility for B2B.

### Custom Segments
- **Custom Intent**: Define audience by keywords they've searched or URLs they've visited. Powerful for B2B — target people who searched for competitor names, industry terms, or related services.
- **Custom Affinity**: Define audience by interests, URLs, apps. Broader than custom intent.

### Customer Match
- Upload customer email/phone list (SHA256 hashed). Google matches against signed-in users.
- Match rates vary (typically 30-50% for B2B email lists).
- Use for retargeting existing customers, upsell campaigns, suppression.

### Similar Audiences (Lookalikes)
- Google auto-generates similar audiences from Customer Match lists and remarketing lists.
- Less control over expansion size compared to Meta lookalikes.

### Remarketing
- **Website visitors**: Google tag tracks visitors. Segment by pages, time on site, recency.
- **YouTube viewers**: People who watched your videos, subscribed, visited your channel.
- **Customer list remarketing**: Same as Customer Match.
- **App users**: Users of your mobile app (rare for B2B).

## Smart Bidding

| Strategy | Optimizes For | Best For |
|----------|--------------|----------|
| Maximize Conversions | Conversion volume | New campaigns, sufficient budget, broad targeting |
| Target CPA | Conversions at target cost | Known CPA, scaling, cost control |
| Maximize Conversion Value | Total conversion value | When conversion values vary (e.g., different lead types) |
| Target ROAS | Return on ad spend | Revenue-optimized campaigns with value tracking |
| Manual CPC | Clicks at set bid | Legacy, not recommended for most cases |

- **Maximize Conversions** is the standard starting point. Google's algorithm needs 30-50 conversions per month per campaign to optimize effectively.
- **Target CPA**: Set after accumulating conversion data. Google aims for average CPA at target, not every conversion.
- Smart Bidding requires conversion tracking to function. Without it, default to Maximize Clicks or Manual CPC.

## Conversion Setup

### Conversion Actions
- Defined in Google Ads or imported from Google Analytics.
- Types: website actions, phone calls, app actions, imported (offline) conversions.
- For B2B: form submissions, demo requests, content downloads, key page views.

### Google Tag (gtag.js)
- Site-wide base tag + event snippets for specific conversion actions.
- Install via GTM (recommended) or direct embed.
- Each conversion action has a unique Conversion ID + Conversion Label.

### GTM Setup
- Google Tag Manager container installed site-wide.
- Create tags for: Google Ads Conversion Tracking, Google Ads Remarketing, Google Analytics.
- Trigger tags on specific events (form submission, button click, page view).
- GTM is the recommended approach for managing multiple tags and consent handling.

### Enhanced Conversions
- Sends hashed first-party data (email, phone, address) with conversion events to improve attribution.
- Setup via gtag.js, GTM, or API. Improves match rate for cross-device attribution.

### Offline Conversion Import
- Upload offline conversion data (from CRM) to Google Ads.
- Maps clicks (via GCLID) or calls to offline outcomes (qualified lead, opportunity, closed deal).
- Critical for B2B where the real conversion happens offline (sales meeting, contract signed).
- Upload frequency: daily or weekly. Lookback window up to 90 days.

## Auto-Tagging and Analytics Integration

- **Auto-tagging**: Google Ads automatically appends `gclid` parameter to destination URLs. Required for Google Analytics integration and offline conversion import.
- **GA4 integration**: Link Google Ads to Google Analytics 4. Import GA4 conversions into Google Ads for bidding optimization. Share audiences bidirectionally.
- **Always enable auto-tagging** — it's the foundation for cross-platform measurement.

## When Google Makes Sense for B2B Social

### Strong use cases
- **YouTube retargeting**: Serve video ads to website visitors or customer lists at scale.
- **Demand Gen for content distribution**: Social-style ads across YouTube + Gmail + Discover at lower CPMs than LinkedIn.
- **Custom Intent audiences**: Target users who searched for competitor names, industry terms, or related services — unavailable on LinkedIn/Meta.
- **Full-funnel supplement**: Use Google Display/YouTube for broad awareness, LinkedIn for precision targeting, Google Search for demand capture.

### Weaker use cases
- **Precision B2B targeting**: Google's professional attribute data is limited. Cannot target by job title, seniority, company name, or function with LinkedIn's precision.
- **ABM campaigns**: No company-level targeting. Customer Match is the closest option.
- **LinkedIn-quality lead gen**: Lead form extensions exist but lead quality is generally lower than LinkedIn for B2B services.

### Recommended approach
Use Google as a complement to LinkedIn/Meta, not a replacement. Google excels at retargeting, broad reach, and capturing intent signals that social platforms cannot.

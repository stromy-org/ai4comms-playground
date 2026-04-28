# LinkedIn Ads Reference

Platform guide for B2B paid social campaigns on LinkedIn.

## Campaign Manager Structure

```
Account
└── Campaign Group (budget ceiling, schedule, status)
    └── Campaign (objective, targeting, bid, budget, format)
        └── Ad (creative: image/video/carousel + copy)
```

- Campaign groups are organizational containers. Set a total budget cap at group level to control spend across related campaigns.
- Each campaign has exactly one objective and one ad format.
- Multiple ads per campaign rotate automatically; LinkedIn optimizes toward highest performers.

## Objectives

| Objective | Goal | Available Formats |
|-----------|------|-------------------|
| Brand Awareness | Impressions | Single image, video, carousel, document, text, spotlight, follower |
| Website Visits | Clicks to URL | Single image, video, carousel, document, text, spotlight, event |
| Engagement | Social actions | Single image, video, carousel, document, event |
| Video Views | Video plays | Video |
| Lead Generation | In-platform form fills | Single image, video, carousel, document, message, conversation |
| Website Conversions | On-site actions | Single image, video, carousel, document, text, spotlight |
| Job Applicants | Job applications | Single image, spotlight |

Choose objective based on desired business outcome, not ad format preference. The objective determines available bidding strategies and optimization targets.

## Ad Formats

### Sponsored Content (in-feed)
- **Single Image**: One image + headline + intro text. Workhorse format for most objectives.
- **Video**: Native video in feed. Strong for awareness and consideration.
- **Carousel**: 2-10 swipeable cards. Good for multi-point narratives or multi-service showcases.
- **Document**: Upload PDF for in-feed browsing. Effective for thought leadership, reports, guides.
- **Event**: Promote LinkedIn Events with RSVP CTA.

### Sponsored Messaging (inbox)
- **Message Ads**: Single CTA message to inbox. One sender, one CTA button, one message.
- **Conversation Ads**: Choose-your-own-path message with multiple CTAs. Better engagement than single message.
- Messaging formats have strict frequency caps (member receives max 1 sponsored message per 45 days).

### Dynamic/Text (right rail and top bar)
- **Text Ads**: Small image + headline + description in right rail. Low cost, low engagement, desktop only.
- **Spotlight Ads**: Personalized with member profile photo/name. Dynamic, desktop only.
- **Follower Ads**: Drive Company Page followers. Dynamic, desktop only.

## Targeting Options

### Professional Attributes (core B2B targeting)
- **Job Title**: Exact match or standardized titles. Most precise but smallest reach.
- **Job Function**: Broader than title (e.g., "Marketing" captures all marketing roles). Good for wider reach.
- **Job Seniority**: Entry, Senior, Manager, Director, VP, CXO, Owner/Partner.
- **Company Name**: Target specific companies by name. Minimum ~300 employees for reliable matching.
- **Company Size**: Ranges from 1-10 up to 10,001+.
- **Company Industry**: LinkedIn's industry taxonomy (150+ industries).
- **Skills**: Member-listed skills. Broad reach, lower precision.
- **Groups**: LinkedIn group memberships. Niche targeting for specific professional communities.
- **Years of Experience**: Ranges from 1-2 up to 12+.

### Demographics and Other
- **Location**: Country, state/region, city, metro area. Required for all campaigns.
- **Member Schools**: Target alumni of specific institutions.
- **Degrees**: Field of study.
- **Member Interests**: Inferred from content engagement. Less precise than professional attributes.
- **Member Traits**: Behavioral signals (e.g., "frequent travelers", "open to education").

### Targeting Best Practices
- Layer 2-3 attributes maximum. Over-layering shrinks audience below viable size.
- Use OR within a category (e.g., VP OR Director) and AND between categories (e.g., VP/Director AND Marketing).
- Audience size recommendation: 50,000+ for Sponsored Content, 15,000+ for Message Ads.
- Enable Audience Expansion only for awareness campaigns; disable for precision targeting.

## Matched Audiences

### Retargeting
- **Website**: Members who visited specific pages (requires Insight Tag). Segment by URL rules.
- **Video**: Members who viewed 25%, 50%, 75%, or 97% of a video ad. Build funnel sequences.
- **Lead Gen Form**: Members who opened or submitted a Lead Gen Form.
- **Event**: Members who RSVPed to a LinkedIn Event.
- **Company Page**: Members who visited or engaged with your Company Page.

### Contact Targeting
- Upload email list (SHA256 hashed or plaintext). Minimum 300 matched members to serve.
- Match rates typically 30-60% for B2B email lists.

### Company Targeting
- Upload company name list. LinkedIn fuzzy-matches against its company database.
- **Recommend 1,000+ companies** for reliable matching and adequate audience size.
- Smaller lists (<500) often result in audiences too small to serve or highly volatile performance.

### Lookalike Audiences
- Seed audience of 300+ members. LinkedIn finds similar professionals.
- Available in 3 sizes (1-3% expansion). Start with smallest for precision.

## Bidding Strategies

| Strategy | How It Works | Best For |
|----------|-------------|----------|
| Maximum Delivery | Automated; spends full budget to maximize results | New campaigns, testing, no CPA target |
| Cost Cap | Automated with ceiling; won't exceed target cost | Known CPA/CPL target, scaling |
| Manual Bidding | Set max bid per action | Experienced buyers, niche audiences, cost control |

- Maximum Delivery is the default and recommended starting point for new campaigns.
- Cost Cap availability varies by objective (not available for Brand Awareness).
- Manual Bidding gives control but risks under-delivery if bids are too conservative.

## Budget

- **Daily budget**: Minimum $10/day. LinkedIn may overspend up to 50% on a given day but will stay within weekly average.
- **Lifetime budget**: Total budget for campaign duration. LinkedIn paces delivery across the schedule.
- **Campaign group budget**: Optional cap across all campaigns in the group.
- Budget recommendation: allocate enough for 50+ conversions per week per campaign during learning phase.

## Frequency Caps

- Configurable from 3-30 impressions per member per 7 days (Sponsored Content).
- Default varies by objective (typically around 7 per 7 days).
- Message Ads: platform-enforced 1 message per 45 days per member (not configurable).
- Lower frequency (3-5/week) for cold prospecting; higher (10-15/week) for retargeting.

## Lead Gen Forms

- Pre-filled with member profile data (name, email, company, job title, etc.).
- Standard fields: first name, last name, email, company, job title, phone, city, state, country.
- Custom fields: up to 3 custom questions (single-line text, multi-choice).
- Hidden fields: pass UTM or campaign metadata through to CRM.
- **CRM integrations**: Native connectors for Salesforce, HubSpot, Marketo, Microsoft Dynamics, others via Zapier/webhook.
- Thank-you page: custom message + optional CTA button linking to external URL.
- Lead data downloadable as CSV from Campaign Manager or via API/integration.
- Lead Gen Form submissions count as conversions automatically.
- Pre-fill drives high completion rates (typically 10-15% form rate vs. 2-3% for landing pages).

## Insight Tag and Conversion Tracking

### Insight Tag Setup
- Single JavaScript tag installed site-wide (via GTM or direct embed).
- Collects page URL, referrer, IP (anonymized), timestamp, device info.
- Creates first-party cookie for cross-session tracking.
- Required for website retargeting audiences and website conversion tracking.

### Conversion Rules
- Define conversions based on URL matches (exact, starts with, contains) or event-specific triggers.
- Standard events: page view, lead, purchase, add to cart, download, install, key page view, sign up, other.
- Attribution windows: 1-day, 7-day, 30-day, or 90-day post-click; 1-day, 7-day, or 30-day post-view.
- Default: 30-day post-click, 7-day post-view.

### Conversions API
- Server-side data submission for online and offline conversions.
- Sends conversion events directly from your server to LinkedIn (bypasses browser limitations).
- Deduplicates with Insight Tag events when the same `conversionHappenedAt` timestamp and user identifiers match.
- Supports offline conversions (e.g., CRM opportunity created, deal closed) with up to 90-day lookback.
- Use for: CRM pipeline events, phone call conversions, offline meetings booked, anything not captured by browser-side tag.

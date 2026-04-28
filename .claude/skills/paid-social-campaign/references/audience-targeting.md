# Audience Targeting Reference

Targeting taxonomy and strategy for B2B paid social campaigns.

## Three Targeting Modes

### 1. Prospecting (Cold)
Reaching people who have never interacted with your brand. Goal: introduce, educate, generate initial awareness or interest.

### 2. Retargeting (Warm)
Re-engaging people who have already interacted with your brand (visited website, watched video, engaged with content). Goal: move from awareness to action.

### 3. ABM (Account-Based)
Targeting specific companies and contacts from a predefined list. Goal: penetrate named accounts with tailored messaging.

Each mode uses different targeting mechanisms, creative strategies, and success metrics. Most B2B campaigns run all three simultaneously with separate budgets and messaging.

## Prospecting: Attribute-Based Targeting

### LinkedIn (strongest for B2B prospecting)
- **Job Title**: Most precise. Use standardized titles. Combine related titles with OR logic.
- **Job Function + Seniority**: Broader than title. E.g., "Marketing" function + "Director/VP" seniority. Good when titles vary across companies.
- **Company Industry + Company Size**: Layer on professional attributes to narrow by company type. E.g., Financial Services + 1,001-5,000 employees.
- **Skills**: Member-listed skills. Broad reach but lower precision. Use as an expansion layer, not primary targeting.
- **Groups**: LinkedIn group memberships. Niche but high intent — group members self-select into professional communities.

### Meta (weaker for B2B prospecting)
- **Interests**: Inferred from content engagement. Categories like "Business Software", "Marketing Technology" exist but are broad.
- **Behaviors**: Purchase behaviors, device usage. Limited B2B utility.
- **Job Title / Industry**: Self-reported, inconsistent. Do not rely as primary targeting for B2B.
- **Lookalikes**: Strongest Meta prospecting tactic for B2B. Seed with customer list, let Meta find similar users.

### Google (intent-based prospecting)
- **In-Market Audiences**: Users actively researching B2B categories. Strongest Google prospecting signal.
- **Custom Intent**: Target users who searched for specific keywords or visited specific URLs. Create audiences around competitor names, industry terms, pain points.
- **Affinity**: Broad interest categories. Top-of-funnel only.

### X (proxy-based prospecting)
- **Follower Lookalikes**: Target users similar to followers of industry accounts. Best B2B proxy on X.
- **Keywords**: Target users who tweeted or engaged with specific terms. Real-time intent signal.
- **Conversation Topics**: Target users in specific conversation streams.

## Retargeting: Engagement Audiences

### Video Viewers
- LinkedIn: 25%, 50%, 75%, 97% view completion thresholds.
- Meta: 3s, 10s, 25%, 50%, 75%, 95% thresholds.
- Google/YouTube: Viewed video, viewed specific % of video, subscribed.
- **Strategy**: Create funnel sequences. 25% viewers get a different message than 75% viewers. Higher completion = warmer audience.

### Lead Form Engagers
- LinkedIn: Opened form (didn't submit) vs. submitted form.
- Meta: Opened Instant Form vs. submitted.
- **Strategy**: Retarget form openers who didn't submit with a simplified offer or different CTA.

### Page / Post Engagers
- LinkedIn: Company Page visitors, post engagers.
- Meta: Facebook Page visitors, Instagram profile visitors, post engagers, ad engagers.
- **Strategy**: Broad retargeting pool. Good for warming up audiences before harder CTAs.

### Website Visitors
- All platforms: Requires respective pixel/tag installed.
- Segment by: specific pages visited (pricing page vs. blog), recency (7-day vs. 30-day vs. 90-day), frequency, time on site.
- **Strategy**: Pricing page visitors get demo CTA. Blog readers get gated content CTA. Segment by recency — recent visitors are warmer.

## ABM: Account-Based Targeting

### Company Targeting (LinkedIn)
- Upload CSV of company names. LinkedIn fuzzy-matches against its company database.
- **Recommend 1,000+ companies** for reliable matching and sufficient audience size.
- Smaller lists work but expect: lower match rates, volatile performance, limited reach.
- Layer company list with seniority/function to target decision-makers within those companies.
- Can also use LinkedIn's built-in company filters (name, size, industry) for dynamic ABM without uploading lists.

### Contact Targeting (LinkedIn)
- Upload email list of specific contacts. LinkedIn matches against member profiles.
- Minimum 300 matched members to serve ads.
- Match rates: typically 30-60% depending on email type (work email matches better).
- Use for: targeting specific decision-makers, event attendee lists, CRM contact lists.

### Meta Custom Audiences for ABM
- Upload customer/contact email list. Meta matches against user accounts.
- Match rates: 40-70% for email lists.
- No company-level targeting on Meta. Contact lists are the only ABM mechanism.
- Supplement with website retargeting of visitors from target accounts (requires CRM data to identify).

### Google Customer Match for ABM
- Upload email/phone list. Google matches against signed-in users.
- Match rates: 30-50% for B2B email lists.
- Use across YouTube, Gmail, Discover, Display for multi-touchpoint ABM.

## Audience Sizing Guidance

### Too Small (under-sized)
- **Symptoms**: Ads don't deliver, high CPMs, volatile daily performance, unable to exit learning phase.
- **LinkedIn minimum**: 50,000+ for Sponsored Content, 15,000+ for Message Ads. Below 10,000 is risky.
- **Meta minimum**: 100,000+ for conversion-optimized campaigns. Below 50,000 is risky for optimization.
- **Google minimum**: 1,000+ for remarketing lists to serve. 5,000+ for Customer Match. Larger for Smart Bidding to work.
- **Fix**: Broaden targeting (add more titles, expand seniority range, include more industries) or combine audiences.

### Too Large (over-sized)
- **Symptoms**: Low relevance, high volume but low conversion rate, budget diluted across irrelevant users.
- **LinkedIn**: Over 1M+ for a niche B2B service likely means targeting is too broad.
- **Meta**: Over 5M+ for B2B is usually too broad unless running pure awareness.
- **Fix**: Add targeting layers (seniority + function + industry), narrow geography, exclude irrelevant segments.

### Right-Sized
- **Prospecting**: 50,000-500,000 on LinkedIn, 500,000-2M on Meta (broader reach compensates for weaker targeting).
- **Retargeting**: 1,000-100,000 depending on website traffic and engagement volume.
- **ABM**: 5,000-50,000 (company list + decision-maker filters).
- These are directional. Actual optimal size depends on budget, CPA targets, and campaign duration.

## Exclusion Strategy

### Standard Exclusions
- **Existing customers**: Exclude current customers from prospecting campaigns. Target them separately for upsell/cross-sell.
- **Recent converters**: Exclude people who converted in the last 30-90 days from lead gen campaigns. Prevents wasted spend on already-captured leads.
- **Employees**: Exclude your own company employees from all campaigns (LinkedIn: exclude company name; Meta/Google: exclude employee email list).
- **Competitors**: Consider excluding competitor company employees if your content contains sensitive strategy.
- **Irrelevant geographies**: Exclude locations you cannot serve.

### Funnel-Based Exclusions
- Prospecting campaigns: exclude all retargeting audiences (website visitors, video viewers, engagers).
- Retargeting campaigns: exclude recent converters.
- ABM campaigns: exclude already-engaged contacts from cold ABM; route them to retargeting.

### Why Exclusions Matter
Without exclusions, platforms will preferentially serve ads to the easiest-to-convert users — which are often existing customers or recent visitors. This inflates conversion metrics but does not generate new pipeline.

## Lookalike / Similar Audiences

### How to Seed
- **Best seeds**: Closed-won customers, high-value leads, engaged prospects with pipeline.
- **Acceptable seeds**: All leads, website converters, email subscribers.
- **Poor seeds**: All website visitors (too broad), all contacts in CRM (too noisy).
- Seed quality > seed size. 500 closed-won customers is a better seed than 10,000 random contacts.

### Platform Specifics
- **LinkedIn**: Seed of 300+ matched members. LinkedIn creates a lookalike based on professional attributes.
- **Meta**: Seed of 1,000+ (recommended). Sizes from 1-10% of country population. Start with 1%.
- **Google**: Auto-generated from Customer Match and remarketing lists. Less control over expansion.

### When to Use
- Prospecting to find new audiences similar to your best customers.
- Expanding reach beyond attribute-based targeting.
- Testing whether platform algorithms can find good prospects with less manual targeting.

### When NOT to Use
- ABM campaigns targeting specific named accounts.
- When you need deterministic targeting (specific companies, specific titles).
- When seed quality is poor (garbage in, garbage out).

## Audience Layering and Intersection

### AND vs. OR Logic
- **OR (union)**: Combine audiences to expand reach. "VP OR Director" targets both.
- **AND (intersection)**: Layer attributes to narrow. "Director AND Marketing AND Tech Industry" targets only people matching all three.
- LinkedIn uses OR within a targeting facet and AND between facets.

### Effective Layering Patterns
1. **Function + Seniority**: "Marketing" AND "Director/VP/CXO" — targets marketing leaders.
2. **Industry + Company Size + Seniority**: "Financial Services" AND "1,001-5,000" AND "VP+" — targets senior FS decision-makers at mid-market firms.
3. **Company List + Function + Seniority**: ABM list AND "IT" AND "Director+" — targets IT leaders at named accounts.

### Layering Limits
- Each additional layer reduces audience size. Check estimated audience before launching.
- Max 2-3 layers for prospecting. More layers = too small.
- ABM campaigns can tolerate more layers because the company list already constrains the universe.

# X (Twitter) Ads Reference

Platform guide for B2B paid social campaigns on X (formerly Twitter).

## Campaign Structure

```
Account
└── Campaign (objective, budget, schedule)
    └── Ad Group (targeting, bid, placement)
        └── Ad (promoted post or created-only ad)
```

- Campaigns have one objective and one funding source.
- Ad groups contain targeting, bidding, and creative selection.
- Ads can be organic posts promoted ("promoted posts") or dark posts visible only as ads.

## Campaign Objectives

| Objective | Optimization Target | B2B Relevance |
|-----------|-------------------|---------------|
| Reach | Maximum impressions | Brand awareness for broad audiences |
| Video Views | Video plays (2s+ or 50% in view) | Thought leadership video, explainers |
| App Installs | App downloads | Rarely used in B2B |
| Website Traffic | Link clicks | Drive to landing pages, content |
| Engagement | Likes, reposts, replies, follows | Community building, conversation participation |
| Followers | New followers | Building a B2B presence on platform |

For B2B, focus on **Website Traffic** (content distribution), **Video Views** (thought leadership), and **Reach** (awareness).

## Ad Formats

### Promoted Posts
- Standard posts (up to 280 chars) promoted to targeted audiences.
- Can include images, video, links, polls.
- Appear in timeline, search results, and profile pages.
- Most common B2B format — promote existing high-performing organic posts or create dark posts.

### Video Ads
- In-feed video. Auto-plays, sound off by default.
- Maximum 2:20 (140 seconds). Recommend 15-30s for B2B.
- Pre-roll video ads (Amplify) available on premium publisher content — higher CPMs but brand-safe placements.

### Carousel Ads
- 2-6 swipeable cards, each with image or video + headline + URL.
- Good for multi-service showcases or storytelling sequences.

### Lead Gen Cards (X Lead Gen)
- In-platform lead capture. User taps to expand a card with pre-filled name, email, @handle.
- Fewer fields than LinkedIn/Meta lead forms. No custom questions.
- Lead data downloaded via CSV from Ads Manager or via API.
- Limited CRM integrations compared to LinkedIn/Meta.

## Targeting

### Demographics
- **Location**: Country, state, metro, city, zip code.
- **Age**: Age ranges.
- **Gender**: Male, female, any.
- **Language**: Primary language.

### Interest and Behavior Targeting
- **Interests**: 350+ interest categories. Broad — includes "Business & Finance", "Technology", "Science". Less precise than LinkedIn for B2B.
- **Follower Lookalikes**: Target users similar to followers of specific @handles. Powerful for B2B — target followers of competitors, industry publications, conference accounts.
- **Conversation Topics**: Target users who engage with specific conversation topics. X categorizes ongoing conversations into 10,000+ topics.
- **Keywords**: Target users who tweeted, engaged with, or searched for specific keywords recently. Unique to X — captures real-time intent signals.
- **Events**: Target users engaging with specific events (conferences, product launches, industry events).
- **Movies/TV Shows**: Target users discussing specific media. Limited B2B utility.

### Tailored Audiences (Custom Audiences)
- **Website Activity**: Users who visited your site (requires X Pixel). Segment by URL, recency.
- **List**: Upload email or @handle list. Match rates are lower than other platforms (typically 20-40%).
- **App Activity**: Users of your app.

### B2B Targeting Reality Check
- X has **no professional attribute targeting** (no job title, seniority, company name, industry).
- B2B targeting relies on proxy signals: follower lookalikes, keywords, conversation topics, interest categories.
- Follower lookalike targeting is the strongest B2B proxy — target followers of industry analysts, trade publications, professional associations, and competitors.

## Bidding Options

| Strategy | How It Works |
|----------|-------------|
| Auto Bid | X optimizes for lowest cost per result. Default, recommended starting point. |
| Maximum Bid | Set max you'll pay per result. Risk of under-delivery if too conservative. |
| Target Bid | Set target average cost per result. X aims for this average. Availability varies by objective. |

- Auto Bid is recommended for most B2B campaigns. Platform determines optimal bid.
- Maximum Bid useful when you have strict CPA limits.
- Bidding options are more limited than LinkedIn/Meta. Less sophisticated optimization.

## Budget

- **Daily budget**: Minimum $1/day (effectively much higher for B2B to get meaningful delivery).
- **Total budget**: Optional cap for campaign duration.
- Practical minimum for B2B: $50-100/day to generate meaningful data and reach.

## B2B Considerations

### Strengths
- **Real-time conversation targeting**: Keywords and conversation topics capture intent signals unavailable on other platforms. Target people discussing specific industry challenges, technologies, or events.
- **Follower lookalike targeting**: Reach audiences similar to followers of industry-relevant accounts. A strong proxy for professional interest when LinkedIn-style targeting is unavailable.
- **Event-driven campaigns**: Target users engaging with industry conferences, product launches, policy announcements in real time.
- **Lower CPMs**: Generally cheaper impressions than LinkedIn. Useful for broad awareness at scale.
- **Thought leadership amplification**: Promote executive thought leadership posts to relevant professional audiences.

### Limitations
- **No professional attribute targeting**: Cannot target by job title, seniority, company size, industry, or company name. Major limitation for precision B2B.
- **Variable ad environment**: Brand safety concerns remain. Adjacency to controversial content. Consider using X's brand safety tools and publisher allowlists.
- **Smaller B2B advertiser ecosystem**: Fewer B2B case studies, benchmarks, and best practices compared to LinkedIn or Meta.
- **Limited lead gen capabilities**: Lead Gen Cards have fewer fields and less CRM integration than LinkedIn/Meta.
- **Audience quality uncertainty**: Proxy targeting (follower lookalikes, keywords) is less reliable than LinkedIn's verified professional data.

### When X Ads Make Sense for B2B
- **Industry conversation participation**: Your audience is active on X discussing industry topics (common in tech, finance, policy, media, government affairs).
- **Event amplification**: Promoting presence at conferences, targeting attendees, real-time event marketing.
- **Thought leadership distribution**: Executive accounts with organic traction — boost high-performing posts to wider professional audiences.
- **Supplementary reach**: Add X to a LinkedIn-primary media mix when you need additional frequency at lower cost.
- **Keyword-triggered campaigns**: Capture audiences discussing specific pain points, technologies, or competitors in real time.

### When to Skip X for B2B
- When precision targeting by professional attributes is essential (use LinkedIn).
- When lead quality matters more than volume (use LinkedIn Lead Gen Forms).
- For ABM campaigns requiring company-level targeting (use LinkedIn).
- When brand safety is a top-tier concern for the client.
- When the client's audience is not active on X (verify before recommending).

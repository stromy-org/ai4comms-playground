# Bidding Strategies Reference

Cross-platform bidding strategy guide for B2B paid social campaigns.

## Strategy Taxonomy

### Automated (Platform-Optimized)
- Platform sets bids dynamically to maximize results within budget.
- No cost guardrails — the platform spends the full budget to get the most conversions/clicks/impressions.
- Best for: new campaigns, testing phases, broad audiences, when you have no CPA baseline.

### Cost-Constrained (Cap-Based)
- Platform optimizes delivery but respects a cost ceiling you set.
- Platform aims for target average cost per result but may fluctuate per-auction.
- Best for: scaling proven campaigns, when you know your target CPA/CPL, when budget efficiency matters.

### Manual
- You set the exact maximum bid per auction. Platform bids up to that amount.
- Most control, most risk of under-delivery if bids are too conservative.
- Best for: niche audiences with predictable auction dynamics, experienced buyers, strict cost limits.

## Platform-by-Platform Options

### LinkedIn

| Strategy | Type | Availability | When to Use |
|----------|------|-------------|-------------|
| Maximum Delivery | Automated | All objectives | Default. New campaigns, testing, no CPA target. |
| Cost Cap | Cost-constrained | Website Conversions, Lead Gen, Website Visits | Known CPA/CPL. Set after 1-2 weeks of Maximum Delivery data. |
| Manual Bidding | Manual | All objectives | Niche audiences (<50k), strict CPA limits, experienced buyers. |

**LinkedIn notes**:
- Maximum Delivery is the only option for Brand Awareness and Video Views objectives.
- Cost Cap is not available for all objectives — check Campaign Manager for current availability.
- Manual Bidding on LinkedIn means setting a max CPC, CPM, or CPV depending on objective. Bid recommendations are shown in the UI.
- LinkedIn auctions consider bid, predicted CTR, and relevance score. A lower bid with high relevance can win over a higher bid.

### Meta

| Strategy | Type | Availability | When to Use |
|----------|------|-------------|-------------|
| Highest Volume | Automated | All objectives | Default. New campaigns, testing, broad audiences. |
| Cost Per Result Goal | Cost-constrained | Most objectives | Known CPA. Set after accumulating 50+ conversions. |
| Bid Cap | Manual (hard ceiling) | Most objectives | Strict per-auction cost limit. Risk of under-delivery. |
| ROAS Goal | Cost-constrained (value) | Sales objective | Revenue-optimized. Requires conversion values. Rare in B2B. |

**Meta notes**:
- Highest Volume spends the full budget to maximize results. No cost guardrail.
- Cost Per Result Goal sets a target average. Individual conversions may cost more or less. Meta tries to average out over time.
- Bid Cap is aggressive — Meta will not bid above your cap in any auction. Use only when you have hard cost constraints and accept potential under-delivery.
- Meta's algorithm needs 50+ conversions per week per ad set to exit the learning phase. Budget accordingly.

### Google

| Strategy | Type | Availability | When to Use |
|----------|------|-------------|-------------|
| Maximize Conversions | Automated | Conversion-tracked campaigns | Default. New campaigns, broad targeting. |
| Target CPA | Cost-constrained | Conversion-tracked campaigns | Known CPA. Set after 30-50 conversions/month. |
| Maximize Conversion Value | Automated (value) | Value-tracked campaigns | When conversion values vary (e.g., lead types). |
| Target ROAS | Cost-constrained (value) | Value-tracked campaigns | Revenue targets. Requires value tracking. |
| Manual CPC | Manual | All campaigns | Legacy. Not recommended unless Smart Bidding is unusable. |

**Google notes**:
- Smart Bidding (Maximize Conversions, Target CPA, etc.) requires conversion tracking. Without it, campaigns default to Maximize Clicks or Manual CPC.
- Google needs 30-50 conversions per month per campaign for effective Smart Bidding. Below that threshold, use Maximize Clicks.
- Target CPA is the most common B2B strategy once you have data. Google will aim for your target but may exceed it while learning.
- Enhanced CPC (manual + automated adjustments) is a middle ground but is being deprecated in favor of full Smart Bidding.

## Selection Decision Tree

```
START: What is your campaign maturity?

├── NEW CAMPAIGN (no conversion data)
│   └── Use AUTOMATED bidding
│       ├── LinkedIn: Maximum Delivery
│       ├── Meta: Highest Volume
│       └── Google: Maximize Conversions (if tracked) or Maximize Clicks
│
├── ESTABLISHED (2+ weeks of data, know your CPA baseline)
│   ├── Want to control costs?
│   │   ├── YES → Use COST-CONSTRAINED
│   │   │   ├── LinkedIn: Cost Cap (set at 110-120% of observed CPA)
│   │   │   ├── Meta: Cost Per Result Goal (set at current avg CPA)
│   │   │   └── Google: Target CPA (set at current avg CPA)
│   │   └── NO → Stay on AUTOMATED, let platform optimize
│   │
│   └── Niche audience (<50k)?
│       └── Consider MANUAL bidding for cost control
│           ├── LinkedIn: Manual Bidding
│           ├── Meta: Bid Cap
│           └── Google: Manual CPC (not recommended)
│
└── SCALING (proven campaign, increasing budget)
    └── Use COST-CONSTRAINED with gradual budget increases
        ├── Increase budget by max 20% every 3-5 days
        ├── Monitor CPA — if it spikes, pause increase
        └── If CPA remains stable, continue scaling
```

## Learning Phase Considerations

Every platform has a "learning phase" when a campaign launches or undergoes significant changes. During this phase, performance is volatile and costs may be higher.

### What triggers learning phase
- New campaign or ad set launch.
- Budget change of 20%+ (up or down).
- Bidding strategy change.
- Targeting change.
- Creative change (adding/removing ads).
- Pause/unpause after extended period.

### Duration
- **LinkedIn**: No explicit "learning phase" label, but expect 1-2 weeks of stabilization. Minimum 15 conversions recommended.
- **Meta**: Explicit "Learning" status in Ads Manager. Needs ~50 conversions per ad set per week to exit. Typically 3-7 days if volume is sufficient.
- **Google**: "Learning" status in Google Ads. Needs 30-50 conversions over 30 days to optimize effectively. May take 1-2 weeks.

### Rules during learning phase
- Do NOT judge campaign performance during learning phase. Wait for stabilization.
- Do NOT make changes during learning — each change restarts the learning phase.
- If budget is too low to generate sufficient conversions for learning, increase budget or broaden audience.
- Plan for higher CPAs during learning (typically 20-50% above eventual steady state).

## Budget Relationship

```
Bidding Strategy × Daily Budget × Audience Size → Delivery and Cost

TOO SMALL budget + AUTOMATED bidding =
  Platform can't gather enough data → stuck in learning → poor performance

TOO LARGE budget + NICHE audience =
  Frequency spikes → audience fatigue → diminishing returns

RIGHT-SIZED budget:
  Budget should support 50+ weekly conversions at expected CPA
  Example: Target CPA $50 → need $350+/week → ~$50+/day per campaign
```

### Minimum budget guidelines (B2B)
- **LinkedIn**: $50-100/day minimum per campaign for meaningful delivery.
- **Meta**: $30-50/day minimum per ad set for conversion-optimized campaigns.
- **Google**: $30-50/day minimum per campaign for Smart Bidding to work.
- These are minimums for data generation. Actual budgets should be based on target conversion volume.

## Common Mistakes

1. **Changing bids/budgets too frequently**: Every significant change restarts the learning phase. Make changes no more than once per week after initial setup.

2. **Insufficient budget for audience size**: A $20/day budget against a 500k audience on LinkedIn will barely register. Budget must be proportional to audience and desired conversion volume.

3. **Wrong objective for goal**: Optimizing for clicks when you want leads trains the algorithm for clickers, not converters. Always match the objective to your actual business goal.

4. **Setting Cost Cap too low too early**: Aggressive cost caps on new campaigns prevent the platform from learning. Start with automated, establish a baseline, then set caps at 110-120% of observed CPA.

5. **Ignoring the learning phase**: Pausing campaigns after 2 days because CPA is high wastes the data gathered. Let campaigns run through the learning phase before evaluating.

6. **Optimizing for platform metrics instead of business metrics**: A low CPC means nothing if those clicks don't convert to pipeline. Optimize for the deepest conversion event you have volume for.

7. **Same bidding strategy across all campaigns**: Prospecting campaigns (cold audiences) should use automated bidding. Retargeting campaigns (warm audiences) with lower volume may benefit from manual or cost-constrained approaches.

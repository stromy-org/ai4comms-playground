# Distribution Guide

Distribution planning, SEO, multimedia, embargo protocol, timing, and localization guidance. Load this file when planning distribution (Phase 6).

---

## Distribution Decision Tree

```
What is the announcement classification?

MARKET-SENSITIVE:
  └─ Step 1: Regulatory wire (RNS, DGAP, EDGAR) per listing requirements
  └─ Step 2: Broad wire service (PR Newswire, Business Wire, GlobeNewswire)
  └─ Step 3: Company newsroom (simultaneous with or immediately after wire)
  └─ Step 4: Targeted outreach to financial/industry press
  └─ Step 5: Social media amplification

CRISIS:
  └─ Step 1: Direct notification to affected parties (customers, employees, regulators)
  └─ Step 2: Broad wire service
  └─ Step 3: Company newsroom + dedicated incident page
  └─ Step 4: Social media (factual, empathetic, linking to newsroom)
  └─ Step 5: Stakeholder email

REPUTATIONALLY SENSITIVE:
  └─ Step 1: Targeted outreach to key journalists (provide context)
  └─ Step 2: Company newsroom
  └─ Step 3: Wire service (optional, based on legal advice)
  └─ Step 4: Social media (only if positive framing is defensible)

ORDINARY:
  └─ Step 1: Targeted outreach by journalist beat and relevance
  └─ Step 2: Company newsroom
  └─ Step 3: Wire service (optional for smaller announcements)
  └─ Step 4: Social media amplification
  └─ Step 5: Newsletter/email to relevant contacts
```

---

## Wire Service Selection

| Service | Best For | Geography | Notes |
|---------|---------|-----------|-------|
| PR Newswire | Broad distribution, multimedia | Global | Largest distribution network |
| Business Wire | Financial/corporate news | Global | Strong with financial media |
| GlobeNewswire | Cost-effective, mid-market | Global | Owned by West Corporation |
| RNS (London Stock Exchange) | UK listed companies | UK | Regulatory requirement |
| DGAP | German/EU listed companies | EU | Regulatory requirement |
| Newswire (Canada) | Canadian market | Canada | |

**Selection criteria:**
1. Regulatory requirements (listed companies must use approved channels)
2. Geographic reach needed
3. Industry vertical strength
4. Multimedia support
5. Budget

---

## Targeted Outreach

A release alone rarely generates meaningful coverage. The research is clear: journalists ignore releases that are not relevant to their beat (Muck Rack). Targeted outreach is essential.

### Building a Target List

When `press-releases/distribution-lists.json` exists, filter by:
- Beat (technology, finance, healthcare, etc.)
- Region/market
- Tier (national, trade, local, blog)
- Past coverage of the company or sector

When no list exists, recommend the user:
1. Identify 10-20 journalists who cover the relevant beat
2. Personalize the outreach note for each
3. Explain why this news matters for their specific audience
4. Include the release as an attachment or inline, plus a one-paragraph summary

### Outreach Note Template

```
Subject: [Brief, specific — not the full headline]

Hi [First Name],

[One sentence on why this is relevant to their beat.]

[Company] is announcing [the news in one sentence]. [One sentence on why it matters.]

The full release is below / attached. Happy to arrange [interview/demo/data access] if useful.

[Your name]
[Direct phone]
```

### What NOT to Do

- Don't blast the release to a generic media list
- Don't follow up the same day asking "did you get my release?"
- Don't send the same note to competing journalists at the same outlet
- Don't send to journalists who don't cover the beat — this damages relationships

---

## SEO and Digital Discoverability

Press releases are indexed, shared, and discovered online. Optimize for search without turning the release into marketing copy.

### SEO Checklist

- [ ] Target keyword in headline
- [ ] Company name in first 100 words
- [ ] Relevant industry terms used naturally in body
- [ ] Location mentioned for local SEO value
- [ ] 2-3 links maximum (newsroom, landing page, relevant resource)
- [ ] Meta description / summary field filled on wire service

### What to Avoid

- Keyword stuffing — the release must read like news
- Excessive links — more than 3 looks like spam
- Anchor text optimization — keep links descriptive and natural
- Duplicate content — don't publish identical versions across multiple domains

---

## Multimedia Guidelines

PR Newswire's 2025 data: 20% of reporters are more likely to pursue a story when multimedia is included. Most-used asset types: images, infographics/data visualizations, and video.

### When Multimedia Adds Value

| Announcement Type | Recommended Assets |
|-------------------|-------------------|
| Product launch | Product screenshots, demo video, architecture diagram |
| Funding | Company logo, founder headshots, growth chart |
| Partnership | Both company logos, joint visual |
| Research/report | Key finding infographic, data visualization |
| Executive hire | Professional headshot |
| Facility/event | Venue photos, event visuals |
| Acquisition | Both company logos, transaction summary graphic |
| Crisis | Factual timeline graphic (not stock photos) |

### Multimedia Standards

- **Images**: High-resolution (300 dpi for print, 72 dpi for web), 16:9 or 4:3 aspect ratio
- **Video**: Under 90 seconds, subtitled, hosted on company channel (YouTube/Vimeo)
- **Infographics**: Clean, branded per charter.json, one key message per graphic
- **Headshots**: Professional, recent, consistent background
- **Format**: Provide multiple sizes and formats where possible

### Multimedia Note Format (in release)

```markdown
**Multimedia:**
- High-resolution product images: [link to media kit]
- Executive headshots: available upon request
- Video demo: [link]
- Infographic: [link]
```

---

## Timing

Timing depends on the announcement classification, not on generic "best day" rules.

### Market-Sensitive Announcements

- **Before market open or after market close** — Never during trading hours
- **Coordinate with IR** — Ensure analyst calls and investor materials are ready
- **Check blackout periods** — Earnings quiet periods, trading windows
- **International**: Consider market hours across all relevant exchanges
- **Regulatory first** — RIS/EDGAR filing must precede or be simultaneous with wire release

### Ordinary Announcements

- **Tuesday through Thursday** — Higher journalist availability
- **Morning** (6-9 AM local time of primary market) — Catches the news cycle
- **Avoid**: Friday afternoons, weekends, holidays, days when major competing news is expected
- **Check the calendar**: Major industry events, competitor announcements, political events can bury your release

### Crisis Announcements

- **Immediately** — Do not wait for a "good time." In a crisis, speed and transparency matter more than timing optimization.
- **If overnight**: Issue as soon as possible and follow up with outreach when journalists are available

### Embargo Timing

If using an embargo:
- Set embargo lift for a time that suits the news cycle (typically early morning)
- Provide the embargoed release 24-48 hours before lift
- Ensure all journalists receive it at the same time
- See governance-workflow.md for full embargo protocol

---

## Localization for International Releases

For multinational companies, international best practice is to localize, not just translate (PR Newswire).

### Localization Checklist

- [ ] **Dateline**: Use the local city of the announcement, not global HQ
- [ ] **Currency**: Use local currency with USD/EUR equivalent in parentheses
- [ ] **Units**: Use local measurement system (metric/imperial)
- [ ] **Regulations**: Reference local regulatory frameworks, not just U.S./UK ones
- [ ] **Examples**: Use locally relevant customer stories or market data
- [ ] **Quotes**: Include a local spokesperson where possible
- [ ] **Time zones**: Specify timezone for any dates/times
- [ ] **Cultural norms**: Tone and formality vary by market
- [ ] **Wire service**: Use a wire with strong local distribution in the target market
- [ ] **Language**: Professional translation by a native speaker, not just machine translation. Have a local comms person review for tone and idiom.

### Multi-Market Release Strategy

| Approach | When to Use |
|----------|------------|
| Single global release (English) | Announcement primarily matters to English-speaking financial markets |
| Global + key market translations | Major announcement with significant impact in non-English markets |
| Separate local releases | Different news angles matter in different markets |
| Coordinated simultaneous release | Market-sensitive information that must reach all markets at once |

For coordinated global releases, designate a lead market and time the releases to that market's news cycle, with other markets receiving the release simultaneously or within a 1-hour window.

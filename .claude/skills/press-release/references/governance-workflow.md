# Governance Workflow

Corporate governance controls for press releases — classification, materiality screening, legal review, approval workflows, disclosure routing, and corrections. Load this file when handling market-sensitive, reputationally sensitive, or crisis announcements.

---

## Announcement Classification Decision Tree

```
Is the announcement about financial results, M&A, material contracts,
forecasts, financing, or anything that could move the stock?
  └─ Yes → MARKET-SENSITIVE
  └─ No ↓

Does the announcement involve layoffs, litigation, regulatory action,
controversy, safety concerns, or reputational risk?
  └─ Yes → Is there an active incident or immediate public risk?
       └─ Yes → CRISIS
       └─ No → REPUTATIONALLY SENSITIVE
  └─ No → ORDINARY
```

When classification is ambiguous, escalate to the higher governance level. It is much cheaper to over-review a release than to under-review one.

---

## Materiality Screening (Listed Companies)

For companies with publicly traded securities, press releases can constitute regulated disclosure events.

### SEC Regulation FD (United States)

Regulation FD requires that when a company discloses material nonpublic information to certain recipients (analysts, investors, market participants), it must simultaneously make the same information public. Acceptable public disclosure methods include press releases distributed through a widely circulated news wire service.

**Key implications for press releases:**
- Material information must be disclosed broadly and simultaneously
- Selective disclosure to favored journalists or analysts before broad publication violates Reg FD
- "Material" = information a reasonable investor would consider important in making an investment decision
- Timing must ensure broad market access before trading can occur

### FCA Market Abuse Regulation (United Kingdom / EU)

The FCA requires issuers to have robust systems for identifying, controlling, and disclosing inside information. Inside information must be disclosed as soon as possible via a Regulatory Information Service (RIS) such as RNS or DGAP.

**Key implications:**
- Inside information goes to RIS first, then press release
- Delay is permitted only under strict conditions (legitimate interest, confidentiality maintained, no misleading the market)
- Press releases about inside information must be consistent with RIS announcements
- The comms team must not release information ahead of the RIS disclosure

### Materiality Checklist

For any announcement where materiality is possible, answer these questions before proceeding:

- [ ] Could this information affect the company's share price?
- [ ] Would a reasonable investor consider this important?
- [ ] Does this involve financial results, forecasts, or guidance?
- [ ] Does this involve M&A, significant contracts, or financing?
- [ ] Does this involve executive changes at C-suite or Board level?
- [ ] Does this involve regulatory action, litigation, or investigation?
- [ ] Does this involve a change to previously disclosed information?

If any answer is "yes" or "maybe," route through IR/compliance before any external communication.

---

## Approval Matrices

### Default Matrix (No Company Data)

| Classification | Before Fact Pack | Before Draft | Before Distribution |
|---------------|-----------------|--------------|-------------------|
| Ordinary | — | Comms lead | Comms lead + subject-matter owner |
| Reputationally sensitive | Legal counsel | Legal + Comms | Legal + Comms + executive sponsor |
| Market-sensitive | IR/compliance | Legal + IR + Comms | Legal + IR + Comms + CFO/CEO |
| Crisis | Crisis team + Legal | Crisis team + Legal + CEO | Crisis team + Legal + CEO (every version) |

### Company-Specific Matrix

When `press-releases/approval-matrix.json` exists, it overrides the defaults. The schema:

```json
{
  "classifications": {
    "ordinary": {
      "factPack": ["comms_lead"],
      "draft": ["comms_lead", "subject_owner"],
      "distribution": ["comms_lead"]
    },
    "reputationally_sensitive": {
      "factPack": ["comms_lead", "legal"],
      "draft": ["comms_lead", "legal", "exec_sponsor"],
      "distribution": ["comms_lead", "legal", "exec_sponsor"]
    },
    "market_sensitive": {
      "factPack": ["comms_lead", "legal", "ir_compliance"],
      "draft": ["comms_lead", "legal", "ir_compliance", "cfo"],
      "distribution": ["comms_lead", "legal", "ir_compliance", "cfo", "ceo"]
    },
    "crisis": {
      "factPack": ["crisis_lead", "legal", "ceo"],
      "draft": ["crisis_lead", "legal", "ceo"],
      "distribution": ["crisis_lead", "legal", "ceo"]
    }
  }
}
```

---

## Legal Review Focus Areas

When routing a draft through legal, highlight these specific areas for counsel's attention:

### Forward-Looking Statements

Any statement about future performance, plans, expectations, or projections needs:
- A safe harbor disclaimer (U.S. companies under the PSLRA)
- Appropriate qualifiers ("expects," "anticipates," "plans to")
- No specific financial projections unless approved by IR/CFO

**Standard safe harbor template** (customize with legal counsel):
> This press release contains forward-looking statements within the meaning of the Private Securities Litigation Reform Act of 1995. These statements involve risks and uncertainties that could cause actual results to differ materially. [Company] disclaims any obligation to update these statements.

### Competitive Claims

- "First" → Verify with dated evidence
- "Only" → Verify no competitor offers it
- "Leading" / "largest" → Cite the source and methodology
- "Best" → Requires substantive comparative evidence (avoid if possible)
- Industry rankings → Cite the ranking body, date, and methodology

### Customer and Partner References

- Named customers require written permission
- Named partners require relationship confirmation
- Avoid implying endorsement unless authorized
- Case study references need client approval

### Regulated Industries

Extra care required for releases involving:
- **Healthcare**: FDA approval language, clinical claims, off-label implications
- **Financial services**: Performance claims, returns, risk disclosures
- **Defense/government**: Classification, ITAR, contract disclosure rules
- **Publicly traded entities**: Material information, Reg FD, insider trading window

---

## Fact Source Hierarchy

Not all facts are equal. The approval bar scales with the source type:

| Source Level | Description | Approval Required | Example |
|-------------|-------------|-------------------|---------|
| **Level 1: Company-approved** | Board-approved numbers, audited financials, official statistics | Pre-approved or standing approval | "Revenue grew 23% year-over-year" |
| **Level 2: Public verifiable** | Published financials, regulatory filings, government data | Comms verification | "The global SaaS market reached $197 billion in 2026 (Gartner)" |
| **Level 3: Estimates/projections** | Internal forecasts, market sizing, growth projections | Legal + IR review | "The company expects to reach 500,000 users by Q4 2027" |
| **Level 4: Third-party claims** | Analyst quotes, partner statements, customer testimonials | Written permission + attribution | "'Acme's platform transformed our operations,' said [Customer]" |

**Rule**: Every factual claim in the release must be traceable to a source at one of these levels. Claims without sources get flagged before publication.

---

## Embargo Protocol

When an embargo is used:

1. **Agree terms in writing** — Date, time, timezone, what's covered, consequences of break
2. **Mark clearly** — `EMBARGOED UNTIL [Time] [Timezone], [Date]` at top of release
3. **Limit distribution** — Only to journalists who have agreed to the embargo
4. **Monitor** — If embargo breaks, be prepared to go broad immediately
5. **Respect it yourself** — No social media, no website, no investor calls until embargo lifts

**When NOT to embargo:**
- Material information for listed companies (must be disclosed broadly and promptly)
- Crisis communications (speed matters more than media coordination)
- When you can't trust the embargo will hold (better to go broad immediately)

---

## Post-Publication Corrections

Errors happen. The response matters more than the mistake.

### Correction Procedure

1. **Identify** — What's wrong, how material is it, who's affected?
2. **Assess** — Is this a factual error, a misleading statement, or a minor typo?
3. **Decide** — Correction level:

| Error Type | Response | Example |
|-----------|---------|---------|
| Typo / formatting | Update newsroom version silently | Wrong dateline format |
| Non-material fact error | Update newsroom version + note | Wrong founding year |
| Material fact error | Issue correction via same channels as original | Wrong revenue figure |
| Misleading statement | Issue correction + direct outreach to journalists who covered it | Claim that overstates a partnership |

4. **Correct** — Update the newsroom version with a correction note: `[CORRECTED Month Day, Year: Brief description of what was corrected]`
5. **Notify** — For material corrections, notify all original distribution recipients
6. **Archive** — Save both the original and corrected versions with metadata

### Correction Principles (PRSA Ethics)

- Correct promptly — delay makes it worse
- Be transparent about what changed and why
- Don't try to minimize — factual corrections should be straightforward
- If the error was in a quote, consult the spokesperson before correcting
- If the error affected investors, coordinate correction with IR immediately

---

## Crisis-Specific Governance

Crisis communications require a different cadence:

1. **Holding statement first** — Before a full release, issue a brief statement acknowledging the situation. This buys time for facts.
2. **Verify before publishing** — In a crisis, speed matters, but accuracy matters more. A wrong statement in a crisis compounds the damage.
3. **Single source of truth** — One spokesperson, one approved statement. All inquiries routed to the same person.
4. **Version control** — Every draft iteration gets a version number and timestamp. The crisis team must know which version is current.
5. **Update cadence** — Commit to regular updates (e.g., "We will provide an update by [time]"). Then deliver on that commitment.
6. **Legal in the room** — For the entire process, not as a gate at the end.

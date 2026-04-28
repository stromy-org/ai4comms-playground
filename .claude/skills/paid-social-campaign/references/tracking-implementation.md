# Tracking Implementation Reference

Cross-platform tracking architecture for B2B paid social campaigns.

## Tracking Architecture Overview

Three layers work together for complete measurement:

```
┌─────────────────────────────────────────────┐
│  1. Browser-Side Tags                        │
│     Pixel / Insight Tag / Google Tag         │
│     → Fires on page load and user actions    │
│     → Increasingly unreliable (iOS, blockers)│
├─────────────────────────────────────────────┤
│  2. Server-Side APIs                         │
│     Conversions API (LinkedIn, Meta, Google) │
│     → Sends events from your server          │
│     → Resilient to browser restrictions      │
├─────────────────────────────────────────────┤
│  3. UTM Parameters                           │
│     → Appended to destination URLs           │
│     → Captured by analytics + CRM            │
│     → Source of truth for channel attribution │
└─────────────────────────────────────────────┘
```

**Redundancy principle**: Browser tags and server-side APIs should fire for the same events. Platforms deduplicate. This ensures no conversions are lost to ad blockers or browser restrictions.

## UTM Parameter Standards

### Parameter Definitions

| Parameter | Purpose | Convention |
|-----------|---------|------------|
| `utm_source` | Platform | `linkedin`, `meta`, `google`, `twitter` |
| `utm_medium` | Channel type | `paid-social`, `paid-video`, `paid-display` |
| `utm_campaign` | Campaign name | `{objective}-{audience}-{quarter}` e.g., `leadgen-cfo-q2-2025` |
| `utm_content` | Ad variation | `{format}-{variant}` e.g., `carousel-v2`, `video-30s-testimonial` |
| `utm_term` | Targeting detail | `{targeting-descriptor}` e.g., `seniority-director-vp`, `retargeting-web-30d` |

### Naming Rules
- All lowercase. No spaces — use hyphens as separators.
- Keep names human-readable but machine-parseable.
- Consistent across all campaigns. Document the convention in a shared naming matrix.
- Never put PII in UTMs (no names, emails, account IDs).

### Example URLs
```
https://example.com/demo?utm_source=linkedin&utm_medium=paid-social&utm_campaign=leadgen-cfo-q2-2025&utm_content=single-image-v1&utm_term=seniority-director-vp

https://example.com/whitepaper?utm_source=meta&utm_medium=paid-social&utm_campaign=content-retargeting-q2-2025&utm_content=carousel-v2&utm_term=website-visitors-30d
```

## Platform Tag Setup

### LinkedIn Insight Tag
- **Installation**: Single JavaScript snippet. Install site-wide via GTM or direct embed.
- **Data collected**: Page URL, referrer, IP address (anonymized), timestamp, device/browser info, LinkedIn member identifier (pseudonymized).
- **Cookies created**: First-party cookies (`li_sugr`, `UserMatchHistory`, `AnalyticsSyncHistory`, `bcookie`, `lidc`, `li_fat_id`). Third-party cookies being phased out.
- **Pseudonymization**: LinkedIn does not expose individual member identity to the advertiser. Reporting is aggregated.
- **Required for**: Website retargeting audiences, website conversion tracking, company demographics reporting.
- **GTM setup**: Use LinkedIn Insight Tag template in GTM. Insert Partner ID. Fire on All Pages.

### Meta Pixel
- **Installation**: Base pixel code site-wide + event code on conversion pages.
- **Standard events**: `PageView` (all pages), `Lead` (form submit), `CompleteRegistration`, `Contact`, `ViewContent`, `Schedule`.
- **Custom events**: Fire `fbq('trackCustom', 'EventName', {params})` for non-standard actions.
- **Event parameters**: Include value, currency, content category, content name for richer reporting.
- **GTM setup**: Use Meta Pixel template. Base tag on All Pages, event tags on specific triggers.

### Google Tag (gtag.js)
- **Installation**: Global site tag + event snippets per conversion action.
- **Conversion actions**: Each action has a unique Conversion ID + Conversion Label pair.
- **Auto-tagging**: Google Ads appends `gclid` to URLs automatically. Do not disable. Required for offline conversion import.
- **Enhanced conversions**: Send hashed first-party data (email, phone) with conversion events for better attribution.
- **GTM setup**: Google Ads Conversion Tracking tag + Google Ads Remarketing tag. Configure conversion ID/label per action.

## Server-Side / Conversions API

### LinkedIn Conversions API
- Sends conversion events from your server to LinkedIn.
- Supports online conversions (form fills, purchases) and offline conversions (CRM events: qualified lead, opportunity, closed deal).
- **User matching**: Hash and send email, LinkedIn member URN, or IDFA/GAID. Email is the strongest match signal.
- **Deduplication**: Include timestamp and consistent user identifiers. LinkedIn deduplicates against Insight Tag events with matching parameters.
- **Lookback**: Up to 90 days for offline conversions.
- **Setup**: Register conversion rules in Campaign Manager, then POST events to LinkedIn Marketing API.

### Meta Conversions API (CAPI)
- Sends events from your server to Meta.
- **Event matching parameters**: email (hashed), phone (hashed), IP address, user agent, fbclid, external_id, fbp cookie, fbc cookie.
- **Deduplication**: Include matching `event_id` in both Pixel and CAPI events. Meta deduplicates when `event_id` + `event_name` match.
- **Setup options**:
  - Direct API integration (most control, requires development).
  - GTM server-side container (moderate complexity, good balance).
  - Partner integrations: Zapier, Segment, HubSpot, Salesforce — push CRM events to Meta.
- **Event quality score**: Meta grades your CAPI implementation (Events Manager > Diagnostics). Aim for Good or Great.

### Google Offline Conversion Import
- Upload offline conversion data mapping `gclid` to conversion events.
- **Setup**: Enable auto-tagging. Capture and store `gclid` when user arrives at your site. When CRM event occurs (qualified lead, opportunity, deal), upload the `gclid` + conversion action + timestamp + value.
- **Upload methods**: Manual CSV upload, scheduled uploads via API, or CRM integration (HubSpot, Salesforce connectors).
- **Lookback**: Up to 90 days from click.

## Consent Handling for EU

### Requirements
- Under ePrivacy Directive and GDPR, tracking tags (pixels, cookies) require user consent before firing in the EU/EEA.
- Consent must be freely given, specific, informed, and unambiguous (active opt-in).

### Implementation
- **Consent Management Platform (CMP)**: Deploy a CMP (e.g., OneTrust, Cookiebot, Didomi) that presents a consent banner.
- **Conditional tag loading**: Tags fire only after consent is granted. In GTM, use consent mode triggers.
- **Google Consent Mode**: Sends `consent_granted` or `consent_denied` signals to Google tags. Google adjusts data collection accordingly (uses modeling for unconsented users).
- **Meta Limited Data Use**: Flag for restricting data processing. Set `fbq('dataProcessingOptions', [])` when consent is granted or `['LDU']` when not.
- **LinkedIn**: No native consent mode. Block Insight Tag entirely until consent is granted.
- **Default state**: Block all advertising/analytics tags by default. Load only after explicit consent.

### Practical Approach
- Always deploy CMP before launching campaigns targeting EU audiences.
- Test that tags do not fire before consent is given (use browser dev tools, GTM Preview mode).
- Document the consent mechanism in the campaign plan.

## Conversion Definition Best Practices

- **Define what counts**: Agree on primary conversion (e.g., demo request submitted) and secondary conversions (e.g., whitepaper download, pricing page view).
- **Primary vs. secondary**: Optimize campaigns toward primary conversion. Use secondary for audience building and reporting.
- **Counting method**: "One per click" counts max one conversion per ad click (better for leads). "Every" counts all conversions per click (better for transactions).
- **Attribution window**: Match the window to your sales cycle. B2B default: 30-day click, 7-day view for LinkedIn; 7-day click, 1-day view for Meta.
- **Value assignment**: Assign conversion values based on downstream pipeline data (e.g., demo request = $500 pipeline value). Enables ROAS-based bidding.

## CRM Integration Patterns

### Lead Routing Flow
```
Ad Platform Lead Form → Integration Layer → CRM
                                           ├── Lead record created
                                           ├── Source/campaign tagged
                                           ├── Assignment rules applied
                                           └── Notification sent
```

### Integration Options
- **Native connectors**: LinkedIn → Salesforce/HubSpot, Meta → Salesforce/HubSpot (limited fields).
- **Zapier / Make**: Flexible, no-code. Good for small-medium volume. Latency: seconds to minutes.
- **Platform APIs**: Most control, requires development. LinkedIn Marketing API, Meta Leads Access API.
- **CRM-side connectors**: HubSpot Ads tool, Salesforce Advertising Studio — pull leads directly.

### Essential Data to Pass
- Lead form fields (name, email, company, job title, custom questions).
- UTM parameters (captured via hidden fields or URL parameters).
- Platform and campaign metadata (campaign name, ad name, form ID).
- Timestamp of submission.

## Testing and Validation

### Before Launch
1. **Verify tag installation**: Use browser dev tools (Network tab) to confirm tags fire on correct pages.
2. **GTM Preview mode**: Walk through conversion flow. Verify all tags fire in correct sequence.
3. **Platform diagnostics**:
   - LinkedIn: Campaign Manager > Insight Tag status page.
   - Meta: Events Manager > Test Events tool (send test events from your browser).
   - Google: Tag Assistant (Chrome extension) or GTM Preview.
4. **Test conversions**: Complete the conversion flow yourself. Verify the conversion appears in each platform's reporting within 24 hours.
5. **CAPI validation**: Check server-side events are received and deduplicated correctly.
   - Meta: Events Manager > Diagnostics > Event match quality score.
   - LinkedIn: API response codes for conversion events.
6. **UTM verification**: Click an ad preview link. Verify UTMs appear in analytics (GA4 real-time report).

### Ongoing Monitoring
- Check conversion counts weekly against CRM data. If platform reports significantly more conversions than CRM leads, investigate attribution windows and counting methods.
- Monitor tag health in platform diagnostics dashboards.
- Verify consent mechanism is not blocking tags for users who have consented.

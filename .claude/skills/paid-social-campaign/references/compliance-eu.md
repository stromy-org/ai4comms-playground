# EU Compliance Reference

Regulatory requirements for B2B paid social campaigns targeting EU/EEA audiences.

**Posture**: When in doubt, take the conservative approach. The cost of non-compliance (fines, reputational damage, platform account suspension) far exceeds the cost of being cautious with data collection and targeting.

## ePrivacy Directive (Cookie Rules)

### Core Rules
- Storing or accessing information on a user's device (cookies, pixels, local storage) requires prior consent.
- Consent must be obtained before the tracking technology fires — not after.
- Applies to all tracking technologies, not just cookies: pixels, fingerprinting, local storage, ETags.
- Two narrow exemptions (no consent needed):
  1. Strictly necessary for delivering a service the user explicitly requested (e.g., shopping cart, login session).
  2. Transmission of a communication over a network.
- Advertising and analytics cookies/pixels are never "strictly necessary." They always require consent.

### Practical Impact
- LinkedIn Insight Tag, Meta Pixel, Google Tag, and X Pixel all require consent before loading in the EU.
- Without consent, these tags must not fire. This means some visitors will not be tracked.
- Expect 30-60% consent rates depending on CMP design, geography, and audience. Plan campaign measurement accordingly.

## EDPB Consent Guidelines

The European Data Protection Board has clarified what constitutes valid consent:

- **No cookie walls**: Cannot block access to content unless cookies are accepted. (Some DPAs allow "cookie walls" if a genuine equivalent alternative is offered — but the safer approach is to avoid them.)
- **No pre-ticked boxes**: Consent checkboxes must be unchecked by default.
- **Scrolling is not consent**: Continuing to browse does not constitute consent. An affirmative action is required.
- **Clear affirmative action**: Must be an unambiguous act — clicking "Accept", toggling a switch, ticking a box. Silence, inactivity, or pre-ticked boxes do not count.
- **Granular**: Users must be able to consent to specific purposes separately (e.g., analytics vs. advertising). Bundled "accept all" is permitted only if granular options are equally accessible.
- **Freely given**: Consent must not be a condition of service (except where processing is necessary for that service).
- **Withdrawable**: Users must be able to withdraw consent as easily as they gave it.

## GDPR Considerations

### Lawful Basis for Processing
- **Consent**: Primary basis for advertising cookies/tracking. Must meet EDPB standards above.
- **Legitimate Interest**: Theoretically available for some B2B marketing activities (e.g., first-party email marketing to existing business contacts). Requires a documented Legitimate Interest Assessment (LIA) balancing your interest against data subject rights. Not suitable for third-party ad tracking.
- **Contract**: Only relevant if processing is necessary to fulfill a contract. Not applicable to advertising.

### Data Subject Rights
- Right to access, rectification, erasure, restriction, portability, and objection.
- Right to object to direct marketing (including profiling for marketing purposes) at any time, unconditionally.
- If a user objects to marketing processing, stop immediately. No balancing test required.

### Data Minimization
- Collect only what is necessary for the stated purpose.
- Ad platforms collect significant data via their tags. Ensure your privacy notice accurately describes what data is collected and shared with which platforms.

## Digital Services Act (DSA)

### Advertising Restrictions
- **Prohibition on targeting using special categories of personal data**: Cannot target ads based on racial/ethnic origin, political opinions, religious beliefs, health data, sexual orientation, or trade union membership.
- Applies to all online platforms operating in the EU, including ad platforms.
- **Practical impact**: Avoid targeting criteria that could be proxies for special categories. Political interest targeting, health-related interest targeting, and religion-based targeting should be avoided or used with extreme caution.

### Transparency Requirements
- Platforms must provide ad libraries/repositories showing all ads served in the EU.
- Advertisers must clearly label ads as such.
- Users must be informed about why they see a particular ad and who paid for it.

## Platform-Specific Compliance

### LinkedIn
- **Insight Tag**: Collects page URL, referrer, IP address (pseudonymized), device info, LinkedIn member identifier (pseudonymized). Does not expose individual member identity to the advertiser.
- **Pseudonymization**: LinkedIn aggregates demographic reporting. Individual-level data is not shared with advertisers.
- **Matched Audiences**: When uploading contact lists, LinkedIn hashes emails for matching and deletes the original list after matching. LinkedIn acts as a joint controller for targeting decisions.
- **Political ads**: LinkedIn prohibits political advertising globally. If your client's campaign could be perceived as political advocacy, review LinkedIn's ad policies carefully.
- **Consent requirement**: Insight Tag requires consent in the EU. Block until consent is obtained via CMP.

### Meta
- **Pixel data**: Fires standard and custom events. Sends page URL, referrer, user agent, IP, fbclid, fbp/fbc cookies. With Advanced Matching, may send hashed email, phone, name.
- **Conversions API**: Sends server-side events including hashed PII (email, phone, IP, user agent). Meta acts as a joint controller for ad targeting.
- **Custom Audiences**: Uploading customer lists means sharing personal data with Meta. Requires a lawful basis (typically consent or legitimate interest with LIA) and must be covered in your privacy notice.
- **Sensitive category restrictions**: Meta restricts targeting related to health, politics, religion, ethnicity. Some targeting options have been removed in the EU.
- **Limited Data Use flag**: Set `['LDU']` in data processing options when consent is not obtained. Restricts how Meta processes the data.

### Google
- **Consent Mode**: Google's framework for adjusting tag behavior based on consent status. Two signals:
  - `ad_storage`: Controls advertising cookies/tags.
  - `analytics_storage`: Controls analytics cookies/tags.
- When consent is denied, Google tags still fire but in a limited mode (no cookies, no identifiers). Google uses statistical modeling to fill attribution gaps.
- **Restricted Data Processing**: Google's compliance mechanism for data processing restrictions. Enable when required.
- **Customer Match**: Uploading customer lists shares data with Google. Requires lawful basis and privacy notice coverage.

### X
- **Pixel**: Requires consent in the EU. Block via CMP until consent is obtained.
- **Tailored Audiences**: Uploading email/handle lists shares data with X. Standard DPA and privacy notice requirements apply.

## Data Processing Agreements (DPAs)

- All ad platforms acting as data processors or joint controllers must have a DPA in place.
- LinkedIn, Meta, Google, and X all provide standard DPAs. These are typically accepted as part of the platform's advertising terms.
- Verify that the applicable DPA covers:
  - Scope of processing (what data, what purposes).
  - Sub-processors (listed and updated).
  - International data transfers (EU-US Data Privacy Framework, Standard Contractual Clauses).
  - Data breach notification obligations.
- Review DPAs annually or when terms change. Platforms update terms regularly.

## Practical Compliance Checklist

### Before Campaign Launch
- [ ] CMP deployed and configured. Default state: all advertising/analytics tags blocked.
- [ ] Privacy notice updated to describe ad platform tracking (LinkedIn Insight Tag, Meta Pixel, Google Tag, etc.).
- [ ] Privacy notice lists ad platforms as data recipients/joint controllers.
- [ ] DPAs in place with all ad platforms being used.
- [ ] Tags configured to fire only after consent is obtained (verified in GTM Preview mode or browser dev tools).
- [ ] Google Consent Mode implemented (tags fire in restricted mode without consent, full mode with consent).
- [ ] Meta Limited Data Use flag configured for non-consented users.
- [ ] Custom audience uploads documented (what data, lawful basis, privacy notice coverage).
- [ ] No targeting based on special categories of personal data (DSA compliance).
- [ ] If uploading contact lists: confirm lawful basis for sharing that data with the ad platform.

### Ongoing
- [ ] Monitor consent rates. If consent rate is very low (<20%), investigate CMP UX.
- [ ] Review DPA updates from platforms quarterly.
- [ ] Honor data subject requests (access, deletion). Know how to delete data from each platform.
- [ ] Audit targeting criteria periodically for DSA special category compliance.
- [ ] Update privacy notice when adding new platforms or tracking technologies.

## Conservative Posture Recommendations

When the legal situation is ambiguous:

1. **Default to consent**: If unsure whether consent is needed for a specific processing activity, obtain consent.
2. **Minimize data collection**: If you can achieve the campaign goal with less data, collect less.
3. **Block before load**: If unsure about a tag's compliance, block it until you have clarity.
4. **Document decisions**: Record why you chose a particular lawful basis or compliance approach. If challenged, documentation is your defense.
5. **Err toward transparency**: If unsure whether to disclose something in the privacy notice, disclose it.
6. **Avoid special categories entirely**: Do not use targeting that could be construed as based on health, politics, religion, ethnicity, or sexual orientation — even if the platform allows it.

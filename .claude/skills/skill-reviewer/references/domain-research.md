# Domain Research Methodology

Pre-scoring research phase that gathers current best practices for the skill's domain, then classifies findings by applicability to ClaudeCowork's AI-driven, template-based architecture.

---

## When to Perform

- **Recommended** for Mode 1 single-skill reviews (Step 3) — research grounds scoring in real-world standards and often surfaces gaps not visible from the skill alone
- **Optional** for sweep mode — skip if reviewing >5 skills (too slow); include for targeted deep reviews
- **Skip** when:
  - Pure utility/workflow skills (conventional-commit, instruction-audit, quality-check, skill-creator) where the domain is internal process
  - Highly specific internal domains where external best practices would not meaningfully apply (e.g., proprietary pipeline skills, org-specific workflow orchestration)
  - The reviewer explicitly judges that research would not improve scoring accuracy
- When skipping, note in the report: "Domain research: skipped — [reason]"

---

## Research Procedure

### Step 1: Identify the Domain

Map the skill to its external domain. This determines what to search for.

| Skill Type | Domain | Example Search Topics |
|------------|--------|----------------------|
| Format (pptx) | Presentation design | Slide design principles, assertion-evidence method, visual hierarchy, Mayer's multimedia learning |
| Format (docx) | Technical/business writing | Document structure, readability, plain language principles, accessibility |
| Format (pdf) | PDF best practices | PDF/A compliance, form design, accessibility (WCAG), metadata |
| Format (xlsx) | Spreadsheet design | Dashboard design, data visualization in Excel, formula architecture, named ranges |
| Domain (proposal) | Consulting proposals | Win-rate strategies, APMP best practices, executive summary frameworks, pricing presentation |
| Domain (remotion-video) | Motion design / explainer video | Pacing, storytelling arcs, animation easing, accessibility (captions, contrast) |
| Design (frontend-design) | UI/UX design | Design system principles, accessibility (WCAG), responsive patterns, component architecture |
| Design (mermaid) | Technical diagramming | Diagram clarity, layout conventions, color-coding standards, UML/C4 norms |
| Integration (vitepress-dev) | Documentation sites | Information architecture, docs-as-code, search UX, versioning |
| Integration (reepl) | LinkedIn content strategy | Post formats, engagement patterns, content calendars, algorithm signals |

### Step 2: Search for Best Practices

Run 2-4 web searches targeting:

1. **Current best practices** — `"<domain> best practices 2025"` or `"<domain> guidelines"`
2. **Common mistakes** — `"<domain> common mistakes"` or `"<domain> anti-patterns"`
3. **Professional standards** — `"<domain> industry standard"` or `"<domain> framework"` (e.g., APMP for proposals, WCAG for accessibility)
4. **AI-specific** (when relevant) — `"AI-generated <domain> quality"` or `"LLM <domain> challenges"`

Fetch 2-3 high-quality sources per search. Prioritize:
- Industry body guidelines (APMP, W3C, ISO)
- Practitioner blogs from recognized experts
- Recent conference talks or publications
- Tool documentation (e.g., Microsoft's PPTX guidelines, Adobe's PDF specs)

### Step 3: Extract Findings

For each source, extract concrete, actionable practices. Avoid vague platitudes ("make it engaging"). Focus on:

- **Structural patterns** — How should the output be organized? (e.g., "executive summaries should be 1 page max and lead with the recommendation")
- **Quality signals** — What distinguishes good from bad? (e.g., "slides should have <40 words per slide for presentation contexts")
- **Common pitfalls** — What do beginners get wrong? (e.g., "wall-of-text slides", "burying the ask in proposals")
- **Measurable standards** — Any quantifiable benchmarks? (e.g., "Flesch reading ease >60 for business documents")

### Step 4: Classify Applicability

This is the critical step. Each finding must be tagged:

| Tag | Meaning | Action |
|-----|---------|--------|
| **Directly applicable** | Practice translates 1:1 to the skill's workflow | Recommend adoption — flag as gap if missing |
| **Needs adaptation** | Practice is valid but requires reinterpretation for AI generation context | Describe how to adapt (e.g., "AI can't visually preview, so add a validation checklist instead") |
| **Not relevant** | Practice assumes human workflows, live delivery, or contexts the skill doesn't serve | Note for completeness but don't recommend changes |

### Classification Heuristics

Findings commonly need adaptation when:
- They assume **iterative visual feedback** (human designers preview and adjust — AI skills need validation checklists instead)
- They assume **audience interaction** (live presentations, Q&A — AI-generated decks are often read, not presented)
- They assume **manual curation** (hand-picking images, fine-tuning spacing — AI skills need parameterized defaults)
- They reference **specific commercial tools** (Canva templates, PowerPoint Designer — skill uses programmatic generation)

Findings are typically directly applicable when:
- They concern **content structure** (how to organize information, what to include/exclude)
- They define **quality thresholds** (word counts, readability scores, accessibility standards)
- They describe **professional conventions** (naming, formatting, metadata)
- They address **audience expectations** (what clients/readers expect to see)

---

## How Research Informs Scoring

Domain research findings feed into three existing dimensions:

### D4 — Template Maturity
- Do the skill's templates/output patterns follow domain best practices?
- Example: If proposal best practices say "lead with the client's problem, not your credentials", does the skill's template structure reflect this?

### D7 — Documentation & Instruction Craft
- Does the skill instruct Claude on domain-specific quality standards?
- Example: If presentation best practices say "<40 words per slide", does the pptx skill mention information density guidance?
- Are the skill's decision trees aligned with how domain experts think about the task?

### D3 — Modularity & Layer Separation
- Does the skill's architecture allow domain best practices to be applied without hardcoding?
- Example: If a best practice says "use assertion-evidence slide structure", can the skill's template layer support this without modifying the base layer?

---

## Report Section Format

The research produces a **Best Practice Insights** section in the review report (inserted before Key Findings):

```markdown
### Best Practice Insights
_From domain research (Step 3). Tag each finding._

| Finding | Source | Applicability |
|---------|--------|---------------|
| Executive summaries should lead with the recommendation, not background | APMP Body of Knowledge | Directly applicable |
| Slides should use assertion-evidence structure (claim in title, evidence in body) | Garr Reynolds, Presentation Zen | Needs adaptation — AI can generate this structure but can't visually verify balance |
| Proposals should include a "ghost column" comparing against competitors | Sant Corporation, Persuasive Proposals | Not relevant — skill generates single-vendor proposals |

**Gaps identified:** <practices the skill should adopt>
**Already strong:** <where the skill aligns with or exceeds industry norms>
```

---

## Sweep Mode Shortcut

When reviewing all skills in sweep mode, full domain research is too slow. Instead:

1. **Skip research** for utility/workflow skills
2. **Use cached findings** if a skill was previously reviewed with domain research (check previous reports)
3. **Flag for deep review** — In the maturity matrix, add a column noting which skills would benefit from a domain research review:

```markdown
| Skill | ... | Domain Research |
|-------|-----|-----------------|
| pptx  | ... | Recommended — presentation design evolves quickly |
| conventional-commit | ... | N/A — internal workflow |
```

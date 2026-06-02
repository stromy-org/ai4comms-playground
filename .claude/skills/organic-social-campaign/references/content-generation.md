<!-- since: 2026-06-01 -->

# Phase 8 — Edition-batched content generation

Generate branded, coherent assets **one edition at a time with human review**,
per-platform configurable, consuming the `media-gen` MCP. This skill *mentions*
`media-gen`, `chart`, `diagram`, `pdf`, `pptx`, and the voice cascade as
context — it never invokes another skill.

The config + media taxonomy live in
[platform-content-config.md](platform-content-config.md). The post objects this
phase consumes/mutates are defined in
[post-object-schema.md](post-object-schema.md).

## Coherence is two things

- **Narrative coherence** (storyline, series arc) lives in the planning agent's
  context — the `concept` and `series_id` carried on each post.
- **Visual coherence** is either **identity** (Track A: media-gen reference
  conditioning — pass the approved anchor as a `subject`/`first_frame`
  reference) or **family resemblance** (fallback: reuse the locked prompt block
  verbatim). State the expectation to the user explicitly.

## 1. Gate

Phase 8 runs **only** if the user opts in **AND**
`content_generation.enabled == true`. Up front, state:

> Identity reuse (the same recurring subject across posts) requires `media-gen`
> reference conditioning (Track A, `PLAN_reference_conditioning.md`). If that is
> unavailable, assets will be **family-resemblance** (consistent style/palette),
> not identical subjects.

Get explicit acknowledgement before generating.

## 2. Lock the style block once (campaign-level)

Derive a verbatim prompt string (photography spec + palette) from
charter/tokens. Persist as
`{base}/social_media/organic/style-blocks/<ref>.txt` (the
`default_style_block_ref` from config). Reused across editions and by
`paid-social-campaign`.

## 3. Per edition (default one week), in order

### a. Select + partition
Select the edition's posts from `posts.json` where `media_spec.type != none`,
capped at `max_assets_per_edition` (`log()` any deferred — never silently
truncate). Partition by `media_spec.producer`:
- `media-gen` posts (`image`/`carousel`/`reel`/`short`) → steps b–c.
- `chart`/`diagram`/`pdf`/`pptx` posts (`infographic`/`document`) → step c2.

### b. Anchor-select loop (media-gen posts)
Per recurring subject/series:
1. Build the `brand_context` dict (step 4) and call `media-gen` `generate_image`
   for **3–4 candidates**.
2. **Human picks ONE anchor.**
3. Persist the anchor + its rendered prompt block; set `anchor_asset_ref` on
   sibling posts that share the subject.

### c. Generate siblings & video (media-gen posts)
- **With Track A** → pass the approved anchor bytes as a `subject` reference to
  `generate_image_variants` (aspect fan-out) and as a `first_frame` reference to
  `generate_video` → true identity.
- **Without Track A** → reuse the anchor's locked prompt block verbatim via
  `generate_image_variants` + `generate_video` → family resemblance.
- `carousel` → N × `generate_image` sharing the anchor; `reel`/`short` →
  `generate_video` at 9:16.

### c2. Brief non-media-gen posts (infographic/document)
Emit a structured brief (data points, layout intent, brand refs) into the post
object and **flag the producer skill** (`chart`/`diagram` for infographics,
`pdf`/`pptx` for documents) for the user to run separately. Phase 8 does **not**
invoke those skills and does **not** call `media-gen` for these.

### d. Captions
Captions/hooks/CTAs for the whole edition pass the **voice cascade**
([voice-integration.md](voice-integration.md)).

### e. Human reviews the edition
Present tiles + briefs + captions side by side → approve → update each post
`status`:
- `media_ready` for generated media-gen assets,
- `brief_ready` for non-media-gen (infographic/document) posts.

Then **advance to the next edition**. **Never generate the next edition before
this gate.** Resume can re-enter mid-Phase-8 by edition.

## 4. Brand-context construction

Mirror `media_gen.brand.build_brand_context_from_charter` **exactly** and call
`validate_brand_context` before generating. Required fields (from
`media_gen.types.BrandContext`):

```
client_slug, display_name, tagline, industry, archetype, domain,
palette, palette_hex, fonts, image_descriptions, logo_paths,
token_variables, charter_version
```

Read these from `{base}/charter.json` (+ `{base}/tokens.css` for
`token_variables` / `charter_version`, `{base}/logos/` for `logo_paths`). The
MCP is client-agnostic — pass the resolved dict as a structured argument; never
expect the MCP to read `client-data/` itself (three-layer-clean).

## Asset output location

The MCP returns bytes (base64 + sha256), not filesystem paths — caller and MCP
share no filesystem in deployed mode. Write returned bytes to:

```
workspace/<client>/output/organic-social-campaign/assets/
```

## Edge cases

| Situation | Response |
|-----------|----------|
| `media-gen` `QuotaExceeded` mid-edition | Stop, persist what succeeded, surface the dashboard URL, resume the edition later. |
| Track A absent, user insists on identity | Flag the dependency on `PLAN_reference_conditioning.md`; offer family-resemblance or stop. |
| Video cost (Veo ~600s/clip) | Keep video editions small; the per-edition gate + `max_assets_per_edition` bound spend. |
| Voice MCP unreachable | L2-only + inline anti-slop checklist, logged (see voice-integration.md). |

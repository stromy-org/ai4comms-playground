<!-- since: 2026-06-01 -->

# `content_generation` config + the media taxonomy

This is the Phase-8 portion of `config.json` (see
[social-data-schema.md](social-data-schema.md) for the rest). It makes media
type a **per-platform data decision** (LinkedIn prefers infographics, Instagram
prefers images/reels) rather than a hardcoded assumption.

## The `content_generation` block

```json
"content_generation": {
  "enabled": false,
  "edition_unit": "week",
  "max_assets_per_edition": 12,
  "default_style_block_ref": "campaign-style-v1",
  "platforms": {
    "linkedin":  { "media_default": "infographic", "allowed": ["infographic","image","document","none"], "aspect_default": "1:1" },
    "instagram": { "media_default": "image",        "allowed": ["image","carousel","reel","none"],        "aspect_default": "4:5" },
    "facebook":  { "media_default": "image",        "allowed": ["image","carousel","none"],               "aspect_default": "1:1" },
    "x":         { "media_default": "none",          "allowed": ["image","none"],                          "aspect_default": "16:9" },
    "tiktok":    { "media_default": "reel",          "allowed": ["reel","none"],                           "aspect_default": "9:16" },
    "youtube_shorts": { "media_default": "short",    "allowed": ["short","none"],                          "aspect_default": "9:16" }
  }
}
```

| Key | Meaning |
|-----|---------|
| `enabled` | Phase 8 runs **only** when this is `true` AND the user opts in |
| `edition_unit` | the batch granularity (default `week`) |
| `max_assets_per_edition` | hard backstop cap; deferred assets are `log()`-ed, never silently dropped |
| `default_style_block_ref` | the locked visual prompt block reused across editions |
| `platforms.<p>.media_default` | the surface stamped when a calendar row has no override |
| `platforms.<p>.allowed` | the surfaces permitted on that platform (builder rejects overrides outside this set) |
| `platforms.<p>.aspect_default` | default aspect for media-gen surfaces (clamped to a valid media-gen ratio per media kind) |

## Media taxonomy v1 — surface → producer → primitive

`media-gen` exposes exactly three primitives — `generate_image`,
`generate_image_variants`, `generate_video` — and models only image/video aspect
ratios. So Phase 8 **cannot** treat "infographic" or "document" as media-gen
outputs (text-to-image renders data/text poorly — that *is* AI slop). Every
surface therefore declares a **`producer`**:

| Surface (`media_spec.type`) | `producer` | Concrete generation in v1 |
|---|---|---|
| `image` | `media-gen` | `generate_image` (anchor) / `generate_image_variants` (aspect fan-out) |
| `carousel` | `media-gen` | N × `generate_image` sharing the anchor / locked block |
| `reel` / `short` | `media-gen` | `generate_video` (9:16) |
| `none` | `none` | no asset |
| `infographic` | `chart` or `diagram` | **out of media-gen scope** — produced by the `chart` (numeric) / `diagram` (structural) skills; Phase 8 emits the brief and flags it |
| `document` | `pdf` or `pptx` | **out of media-gen scope** — multi-page carousel/PDF produced by the `pdf`/`pptx` skills |

v1 media-gen rendering covers `{image, carousel, reel, short, none}`.
`infographic`/`document` are **first-class post types** (so LinkedIn can prefer
infographics) but carry a non-media-gen `producer` — Phase 8 produces their
**brief**, not the artifact, and `validate_posts.py` enforces that `producer`
matches `type`.

`build_posts.py` stamps the default producer (`infographic`→`chart`,
`document`→`pdf`); the agent may switch `infographic`→`diagram` or
`document`→`pptx`. Only `image`/`carousel`/`reel`/`short` are media-gen-rendered
in v1.

## Aspect Literal sets (sync with `media_gen.types`)

- image producers: `{1:1, 3:4, 4:3, 4:5, 9:16, 16:9}`
- video producers: `{9:16, 16:9}`

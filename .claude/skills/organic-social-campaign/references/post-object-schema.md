<!-- since: 2026-06-01 -->

# Phase 7 schemas — `calendar.json` and the per-post object

Phase 7 freezes the approved editorial calendar into a validated, graph-portable
`posts.json`. The per-post object is a **superset** of the Phase 5 calendar
columns — it extends, never replaces, the calendar. Two schemas are involved:

- **`calendar.json`** — the structured form of the Phase 5 calendar (input to the builder).
- **`posts.json`** — the fanned-out per-post objects (output of the builder, enriched by the agent, gated by the validator).

The split is deliberate (see [content-generation.md](content-generation.md) for
the downstream consumer):

| Role | Who | Fields |
|------|-----|--------|
| **Structure** | `scripts/build_posts.py` (deterministic) | `post_id`, `platform`, `surface`, `media_spec`, `utm`, `schedule`, `status`, `qa_tier`, `char_budget`, `link_handling` |
| **Copy** | the agent, in chat (voice cascade) | `hook`, `body`, `thread_parts`, `hashtags`, `cta` |
| **Gate** | `scripts/validate_posts.py` | rejects bad aspect / producer↔type mismatch / empty creative placeholders |

## `calendar.json` (builder input)

```json
{
  "schema_version": "1.0",
  "weeks": 4,
  "rows": [
    {
      "week": 1,
      "pillar_id": "regulatory-radar",
      "series_id": "3-minute-methodology",
      "concept": "How the new EU directive reshapes procurement",
      "format": "carousel",
      "cta": "Book a consultation",
      "platforms": ["linkedin", "instagram"],
      "owner": "Jane",
      "surface_overrides": { "instagram": "reel" },
      "utm": { "campaign": "regulatory-radar-202606" }
    }
  ]
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `week` | int ≥ 1 | yes | edition index |
| `pillar_id` | string | yes | FK to `organic/pillars.json` `id` → becomes `source_pillar_id` |
| `series_id` | string | optional | FK to `organic/series.json` `id` |
| `concept` | string | yes | the post idea (part of the post_id hash) |
| `format` | string | optional | editorial format hint |
| `cta` | string | optional | seed only — the agent rewrites via voice cascade |
| `platforms` | string[] | yes | one post object is emitted per platform |
| `owner` | string | optional | becomes `author_surface` |
| `surface_overrides` | object | optional | `{platform: surface}` — overrides the platform's `media_default`; must be in that platform's `allowed` set or the builder fails the row |
| `utm` | object | optional | merged over the config UTM defaults |

A malformed row (missing required field, override not in `allowed`) makes
`build_posts.py` **fail with the offending row index and write no partial
`posts.json`**.

## Per-post object (`posts.json`)

```json
{
  "schema_version": "1.0",
  "posts": [
    {
      "post_id": "a1b2c3d4e5f6",
      "source_pillar_id": "regulatory-radar",
      "series_id": "3-minute-methodology",
      "platform": "linkedin",
      "surface": "infographic",
      "concept": "How the new EU directive reshapes procurement",
      "hook": "",
      "body": "",
      "thread_parts": [],
      "char_budget": 3000,
      "media_spec": {
        "type": "infographic",
        "producer": "chart",
        "aspect_ratio": "1:1",
        "duration_s": null,
        "caption_burn": false,
        "no_foreign_watermark": true,
        "locked_style_block_ref": null,
        "anchor_asset_ref": null
      },
      "hashtags": [],
      "link_handling": "first_comment",
      "cta": "",
      "author_surface": "Jane",
      "schedule": { "week": 1, "day": null, "time": null },
      "utm": { "source": "linkedin", "medium": "organic_social", "campaign": "regulatory-radar-202606" },
      "status": "draft",
      "qa_tier": "tier_1"
    }
  ]
}
```

### Field reference

| Field | Filled by | Notes |
|-------|-----------|-------|
| `post_id` | builder | stable 12-hex digest of `pillar_id|platform|surface|week|concept` (+ occurrence counter to disambiguate exact duplicates); **stable across runs for the same calendar** |
| `source_pillar_id` | builder | from row `pillar_id` |
| `series_id` | builder | from row `series_id` (optional) |
| `platform` | builder | one object per platform in the row |
| `surface` | builder | `media_spec.type`; from `surface_overrides[platform]` else the platform's `media_default` |
| `concept` | builder | carried from the row (narrative coherence) |
| `hook` / `body` / `thread_parts` | **agent** | empty placeholders out of the builder; the validator rejects leftovers |
| `char_budget` | builder | per-platform body budget (see config) |
| `media_spec.type` | builder | == `surface` |
| `media_spec.producer` | builder | from the surface→producer map (see [platform-content-config.md](platform-content-config.md)) |
| `media_spec.aspect_ratio` | builder | platform `aspect_default`; must be in the media-gen Literal set for the producer |
| `media_spec.duration_s` | builder | set for `reel`/`short`, else `null` |
| `media_spec.caption_burn` | builder | default `false` |
| `media_spec.no_foreign_watermark` | builder | always present, default `true` |
| `media_spec.locked_style_block_ref` | builder/Phase 8 | from config `default_style_block_ref` for media-gen types, else `null` |
| `media_spec.anchor_asset_ref` | Phase 8 | set after the anchor-select loop |
| `hashtags` | **agent** | within the platform hashtag-count convention |
| `link_handling` | builder | `first_comment` (LinkedIn) / `in_caption` (default) |
| `cta` | **agent** | seeded from the row but rewritten via voice cascade |
| `author_surface` | builder | from row `owner` |
| `schedule` | builder | `week` set; `day`/`time` left for the scheduler/human |
| `utm` | builder | config UTM defaults merged with the row override |
| `status` | builder→Phase 8 | `draft` → `media_ready` / `brief_ready` after Phase 8 review |
| `qa_tier` | builder | default `tier_1`; raise per Phase 4 QA tiers |

### Aspect-ratio Literal sets (kept in sync with `media_gen.types`)

- **image** producers (`image`, `carousel`): `{1:1, 3:4, 4:3, 4:5, 9:16, 16:9}`
- **video** producers (`reel`, `short`): `{9:16, 16:9}`
- `none` / `infographic` / `document`: aspect ratio is not validated against the
  media-gen sets (these are not media-gen-rendered).

## Edge cases

- `media_spec.type: none` → valid post, no asset (producer `none`).
- Aspect ratio outside the Literal set → `validate_posts.py` rejects, naming the
  `post_id` (prevents a doomed media call downstream).
- A `producer` inconsistent with `type` (e.g. `infographic` + `producer:
  media-gen`) → validator rejects, naming the `post_id`.
- Empty creative placeholder (`hook`/`body`/`cta` blank, or `hashtags` empty)
  remaining at validation time → rejected: the post was never enriched.

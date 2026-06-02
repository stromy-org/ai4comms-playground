<!-- since: 2026-06-01 -->

# `social_media/*` shared data schema (v1.0)

The persisted files under `{base}/social_media/` are the contract shared between
`organic-social-campaign` (writer) and `paid-social-campaign` (reader of
`config.json`). Every file carries a top-level `"schema_version": "1.0"` so the
two skills can detect drift. **When `schema_version` is absent on read, treat the
file as `"1.0"`** (back-compat: pre-versioning files remain valid).

All additions to these schemas are **additive** — consumers ignore unknown keys.
Never repurpose or remove a documented key without bumping `schema_version`.

```
{base}/social_media/
├── config.json
└── organic/
    ├── pillars.json
    ├── series.json
    ├── community-playbook.json
    ├── advocacy.json
    ├── posts.json            (Phase 7 — see post-object-schema.md)
    └── style-blocks/<ref>.txt (Phase 8 — locked visual prompt blocks)
```

## `config.json`

Platform, tracking, and compliance settings. Read by **both** skills.

```json
{
  "schema_version": "1.0",
  "platforms": ["linkedin", "instagram"],
  "utm": {
    "source": "linkedin",
    "medium": "organic_social",
    "campaign_pattern": "{pillar}-{yyyymm}"
  },
  "hashtags": {
    "core": ["#PublicAffairs"],
    "per_platform": { "linkedin": ["#B2B"], "instagram": ["#BehindTheScenes"] }
  },
  "compliance": {
    "posture": "conservative-eu",
    "consent_required": true,
    "prohibited_topics": []
  },
  "content_generation": { "...": "see platform-content-config.md" }
}
```

| Key | Type | Required | Notes |
|-----|------|----------|-------|
| `schema_version` | string | yes (on write) | `"1.0"`; absent ⇒ treat as `"1.0"` |
| `platforms` | string[] | yes | platform slugs the program targets |
| `utm` | object | optional | UTM taxonomy; `paid-social` reads this |
| `hashtags` | object | optional | `core` + `per_platform` |
| `compliance` | object | optional | posture, consent, prohibited topics; `paid-social` reads this |
| `content_generation` | object | optional | Phase 8 config — full schema in [platform-content-config.md](platform-content-config.md) |

`content_generation` is **additive and optional**: `paid-social-campaign` ignores
it. It is documented separately because it is large and Phase-8-specific.

## `organic/pillars.json`

```json
{
  "schema_version": "1.0",
  "pillars": [
    {
      "id": "regulatory-radar",
      "name": "Regulatory Radar",
      "covers": "EU policy shifts relevant to the ICP",
      "proof_types": ["data", "methodology"],
      "format_affinity": ["carousel", "document"]
    }
  ]
}
```

`id` is a stable kebab-case slug — it is the `source_pillar_id` foreign key that
`posts.json` references (see [post-object-schema.md](post-object-schema.md)).

## `organic/series.json`

```json
{
  "schema_version": "1.0",
  "series": [
    {
      "id": "3-minute-methodology",
      "name": "3-Minute Methodology",
      "pillar_id": "regulatory-radar",
      "format": "carousel",
      "structure": "Hook → 3 steps → CTA",
      "cta_type": "engage",
      "funnel_intent": "consideration"
    }
  ]
}
```

## `organic/community-playbook.json`

```json
{
  "schema_version": "1.0",
  "response_slas": { "question": "4h", "complaint": "1h" },
  "tone_rules": { "praise": "...", "complaint": "...", "crisis": "..." },
  "escalation_matrix": [{ "category": "legal", "owner": "..." }],
  "prohibited_topics": [],
  "after_hours": "..."
}
```

## `organic/advocacy.json`

```json
{
  "schema_version": "1.0",
  "level": "pilot",
  "advocates": [],
  "content_queue_url": null,
  "recognition_model": "..."
}
```

## Write convention

The skill's **"Offer to save reusable config"** step (Final Output Assembly) and
the Phase 7/8 persistence steps MUST write `"schema_version": "1.0"` into every
file they create or overwrite under `social_media/`. On read, missing
`schema_version` is treated as `"1.0"`.

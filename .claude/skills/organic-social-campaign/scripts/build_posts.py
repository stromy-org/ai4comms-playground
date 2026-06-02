#!/usr/bin/env python3
"""Deterministic Phase-7 builder: calendar.json + config -> structural posts.json.

This is the stable, importable execution seam shared by the skill's Phase-7 flow
and the eval (test_build_posts.py). It fills only the *structural* fields of each
per-post object (post_id, platform, surface, media_spec, utm, schedule, status,
qa_tier, char_budget, link_handling). The *creative* fields (hook, body,
thread_parts, hashtags, cta) are left as empty placeholders for the agent to fill
in chat via the voice cascade; validate_posts.py rejects any that remain empty.

Pure function, no network, no filesystem side effects in build_posts(). The CLI
wrapper reads/writes JSON.

Schemas: references/post-object-schema.md and references/platform-content-config.md.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path
from typing import Any, cast

SCHEMA_VERSION = "1.0"


def as_obj(value: Any) -> dict[str, Any]:
    """Coerce an arbitrary JSON value to a typed object dict (``{}`` if not a dict).

    JSON parsed via ``json.load`` is ``Any``; narrowing it with ``isinstance``
    yields ``dict[Unknown, Unknown]``, which trips strict type-checking on every
    downstream use. Routing through this ``Any``-typed seam returns a fully-typed
    ``dict[str, Any]`` so the rest of the module stays strict-clean.
    """
    return cast("dict[str, Any]", value) if isinstance(value, dict) else {}


def as_list(value: Any) -> list[Any]:
    """Coerce an arbitrary JSON value to a typed list (``[]`` if not a list)."""
    return cast("list[Any]", value) if isinstance(value, list) else []

# media-gen Literal sets (kept in sync with media_gen.types.AspectRatio /
# VideoAspectRatio). Do not widen without a corresponding media-gen change.
IMAGE_ASPECTS: frozenset[str] = frozenset({"1:1", "3:4", "4:3", "4:5", "9:16", "16:9"})
VIDEO_ASPECTS: frozenset[str] = frozenset({"9:16", "16:9"})

# surface (media_spec.type) -> default producer stamped by the builder.
DEFAULT_PRODUCER_BY_SURFACE: dict[str, str] = {
    "image": "media-gen",
    "carousel": "media-gen",
    "reel": "media-gen",
    "short": "media-gen",
    "infographic": "chart",
    "document": "pdf",
    "none": "none",
}

# surface -> the set of producers the validator accepts (the agent may switch an
# infographic to diagram, or a document to pptx).
ALLOWED_PRODUCERS_BY_SURFACE: dict[str, frozenset[str]] = {
    "image": frozenset({"media-gen"}),
    "carousel": frozenset({"media-gen"}),
    "reel": frozenset({"media-gen"}),
    "short": frozenset({"media-gen"}),
    "infographic": frozenset({"chart", "diagram"}),
    "document": frozenset({"pdf", "pptx"}),
    "none": frozenset({"none"}),
}

# the four surfaces media-gen actually renders in v1.
MEDIA_GEN_SURFACES: frozenset[str] = frozenset({"image", "carousel", "reel", "short"})
VIDEO_SURFACES: frozenset[str] = frozenset({"reel", "short"})

# per-platform body character budgets (informational; validator checks body <= budget).
CHAR_BUDGET: dict[str, int] = {
    "linkedin": 3000,
    "instagram": 2200,
    "facebook": 2000,
    "x": 280,
    "tiktok": 2200,
    "youtube_shorts": 1000,
}
DEFAULT_CHAR_BUDGET = 2000

# per-platform max hashtag count (validator upper bound).
HASHTAG_MAX: dict[str, int] = {
    "linkedin": 5,
    "instagram": 30,
    "facebook": 5,
    "x": 3,
    "tiktok": 8,
    "youtube_shorts": 5,
}
DEFAULT_HASHTAG_MAX = 5

# link handling default per platform.
LINK_HANDLING: dict[str, str] = {
    "linkedin": "first_comment",
}
DEFAULT_LINK_HANDLING = "in_caption"

DEFAULT_VIDEO_DURATION_S = 8


class BuildError(ValueError):
    """Raised when calendar.json or config is malformed. Carries the row index."""


def _require(row: dict[str, Any], key: str, index: int) -> Any:
    if key not in row or row[key] in (None, "", []):
        raise BuildError(f"calendar row {index}: missing required field '{key}'")
    return row[key]


def _platform_config(config: dict[str, Any], platform: str, index: int) -> dict[str, Any]:
    cg_raw = config.get("content_generation")
    if not isinstance(cg_raw, dict):
        raise BuildError("config is missing the 'content_generation' block")
    platforms_raw = as_obj(cg_raw).get("platforms")
    if not isinstance(platforms_raw, dict) or platform not in platforms_raw:
        raise BuildError(
            f"calendar row {index}: platform '{platform}' not in content_generation.platforms"
        )
    pc_raw = as_obj(platforms_raw).get(platform)
    if not isinstance(pc_raw, dict):
        raise BuildError(f"content_generation.platforms.{platform} is not an object")
    return as_obj(pc_raw)


def _post_id(pillar_id: str, platform: str, surface: str, week: int, concept: str, occ: int) -> str:
    raw = f"{pillar_id}|{platform}|{surface}|{week}|{concept}|{occ}"
    return hashlib.sha1(raw.encode("utf-8")).hexdigest()[:12]  # noqa: S324 (non-crypto id)


def _aspect_for(surface: str, platform_config: dict[str, Any]) -> str | None:
    if surface not in MEDIA_GEN_SURFACES:
        return None
    configured = platform_config.get("aspect_default")
    # Honor the platform default only if it is valid for this surface's media
    # kind; otherwise fall back to a valid default so the builder never emits an
    # aspect the validator would reject (e.g. a video surface overriding an
    # image-only aspect_default like 4:5).
    if surface in VIDEO_SURFACES:
        if isinstance(configured, str) and configured in VIDEO_ASPECTS:
            return configured
        return "9:16"
    if isinstance(configured, str) and configured in IMAGE_ASPECTS:
        return configured
    return "1:1"


def build_posts(calendar: dict[str, Any], config: dict[str, Any]) -> dict[str, Any]:
    """Expand calendar rows x platforms into structural per-post objects.

    Deterministic: the same (calendar, config) yields byte-identical output,
    including stable post_ids. Raises BuildError (with the row index) on any
    malformed row and produces no partial output.
    """
    if not isinstance(calendar.get("rows"), list):
        raise BuildError("calendar.json: 'rows' must be a list")
    rows = as_list(calendar.get("rows"))

    utm_defaults = as_obj(config.get("utm"))
    cg = as_obj(config.get("content_generation"))
    default_style = cg.get("default_style_block_ref")

    seen: dict[str, int] = {}
    posts: list[dict[str, Any]] = []

    for index, raw_row in enumerate(rows):
        if not isinstance(raw_row, dict):
            raise BuildError(f"calendar row {index}: not an object")
        row = as_obj(raw_row)
        week = _require(row, "week", index)
        if not isinstance(week, int) or week < 1:
            raise BuildError(f"calendar row {index}: 'week' must be an int >= 1")
        pillar_id = str(_require(row, "pillar_id", index))
        concept = str(_require(row, "concept", index))
        if not isinstance(_require(row, "platforms", index), list):
            raise BuildError(f"calendar row {index}: 'platforms' must be a list")
        platforms = as_list(row.get("platforms"))
        series_id = row.get("series_id")
        owner = row.get("owner")
        overrides = as_obj(row.get("surface_overrides"))
        row_utm = as_obj(row.get("utm"))

        for platform in sorted(str(p) for p in platforms):
            pc = _platform_config(config, platform, index)
            allowed_set: set[Any] = set(as_list(pc.get("allowed")))
            surface = overrides.get(platform) or pc.get("media_default")
            if not isinstance(surface, str):
                raise BuildError(
                    f"calendar row {index}: no surface for platform '{platform}'"
                )
            if allowed_set and surface not in allowed_set:
                raise BuildError(
                    f"calendar row {index}: surface '{surface}' not in "
                    f"allowed set for platform '{platform}' ({sorted(allowed_set)})"
                )
            if surface not in DEFAULT_PRODUCER_BY_SURFACE:
                raise BuildError(
                    f"calendar row {index}: unknown surface '{surface}'"
                )

            occ_key = f"{pillar_id}|{platform}|{surface}|{week}|{concept}"
            occ = seen.get(occ_key, 0)
            seen[occ_key] = occ + 1
            post_id = _post_id(pillar_id, platform, surface, week, concept, occ)

            producer = DEFAULT_PRODUCER_BY_SURFACE[surface]
            aspect = _aspect_for(surface, pc)
            is_media_gen = surface in MEDIA_GEN_SURFACES
            media_spec: dict[str, Any] = {
                "type": surface,
                "producer": producer,
                "aspect_ratio": aspect,
                "duration_s": DEFAULT_VIDEO_DURATION_S if surface in VIDEO_SURFACES else None,
                "caption_burn": False,
                "no_foreign_watermark": True,
                "locked_style_block_ref": default_style if is_media_gen else None,
                "anchor_asset_ref": None,
            }

            post: dict[str, Any] = {
                "post_id": post_id,
                "source_pillar_id": pillar_id,
                "series_id": series_id,
                "platform": platform,
                "surface": surface,
                "concept": concept,
                "hook": "",
                "body": "",
                "thread_parts": [],
                "char_budget": CHAR_BUDGET.get(platform, DEFAULT_CHAR_BUDGET),
                "media_spec": media_spec,
                "hashtags": [],
                "link_handling": LINK_HANDLING.get(platform, DEFAULT_LINK_HANDLING),
                "cta": "",
                "author_surface": owner if isinstance(owner, str) else None,
                "schedule": {"week": week, "day": None, "time": None},
                "utm": {**utm_defaults, **row_utm},
                "status": "draft",
                "qa_tier": "tier_1",
            }
            posts.append(post)

    return {"schema_version": SCHEMA_VERSION, "posts": posts}


def _main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Build structural posts.json from calendar.json")
    parser.add_argument("calendar", type=Path, help="path to calendar.json")
    parser.add_argument("config", type=Path, help="path to config.json (with content_generation)")
    parser.add_argument("-o", "--out", type=Path, default=None, help="output posts.json (default: stdout)")
    args = parser.parse_args(argv)

    calendar = json.loads(args.calendar.read_text())
    config = json.loads(args.config.read_text())
    try:
        result = build_posts(calendar, config)
    except BuildError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2

    payload = json.dumps(result, indent=2, sort_keys=True)
    if args.out is not None:
        args.out.write_text(payload + "\n")
        print(f"OK: wrote {len(result['posts'])} posts to {args.out}")
    else:
        print(payload)
    return 0


if __name__ == "__main__":
    raise SystemExit(_main())

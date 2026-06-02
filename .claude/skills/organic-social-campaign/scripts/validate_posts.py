#!/usr/bin/env python3
"""Phase-7 gate: validate a (builder-produced, agent-enriched) posts.json.

Run before any rendering. Checks, per post:
  - aspect_ratio in the media-gen Literal set for the producer (image vs video)
  - media_spec.type is a known surface
  - media_spec.producer is consistent with type (the surface->producer mapping)
  - media-gen surfaces actually use producer 'media-gen'; infographic/document
    route to chart/diagram/pdf/pptx (NOT media-gen)
  - no_foreign_watermark is present
  - char budget per platform (body length <= budget)
  - hashtag count within the per-platform convention
  - no empty creative placeholders remain (hook/body/cta blank, hashtags empty)
    for posts that carry an actual surface (type != none)

Exit 0 + "OK" when valid; exit non-zero with a per-post error list otherwise.
The skill's Phase-7 flow and the eval (test_posts_schema.py) call this same seam.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

_SCRIPT_DIR = Path(__file__).resolve().parent
if str(_SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(_SCRIPT_DIR))

from build_posts import (  # noqa: E402  (path setup must precede import)
    ALLOWED_PRODUCERS_BY_SURFACE,
    DEFAULT_HASHTAG_MAX,
    HASHTAG_MAX,
    IMAGE_ASPECTS,
    MEDIA_GEN_SURFACES,
    VIDEO_ASPECTS,
    VIDEO_SURFACES,
    as_list,
    as_obj,
)

# surfaces that carry creative copy requiring enrichment.
_COPY_REQUIRED_SURFACES = frozenset(
    set(ALLOWED_PRODUCERS_BY_SURFACE) - {"none"}
)


def _validate_post(post: dict[str, Any]) -> list[str]:
    pid = post.get("post_id", "<no post_id>")
    errors: list[str] = []
    spec_raw = post.get("media_spec")
    if not isinstance(spec_raw, dict):
        return [f"{pid}: media_spec missing or not an object"]
    spec = as_obj(spec_raw)

    surface = spec.get("type")
    producer = spec.get("producer")
    aspect = spec.get("aspect_ratio")

    if surface not in ALLOWED_PRODUCERS_BY_SURFACE:
        return [f"{pid}: unknown media_spec.type '{surface}'"]

    # producer <-> type consistency (High-2 guardrail).
    allowed_producers = ALLOWED_PRODUCERS_BY_SURFACE[surface]
    if producer not in allowed_producers:
        errors.append(
            f"{pid}: producer '{producer}' inconsistent with type '{surface}' "
            f"(allowed: {sorted(allowed_producers)})"
        )
    # only media-gen surfaces may carry producer 'media-gen'.
    if producer == "media-gen" and surface not in MEDIA_GEN_SURFACES:
        errors.append(f"{pid}: type '{surface}' must not use producer 'media-gen'")

    # aspect ratio against the media-gen Literal sets (media-gen surfaces only).
    if surface in MEDIA_GEN_SURFACES:
        valid_aspects = VIDEO_ASPECTS if surface in VIDEO_SURFACES else IMAGE_ASPECTS
        if aspect not in valid_aspects:
            errors.append(
                f"{pid}: aspect_ratio '{aspect}' not in {sorted(valid_aspects)} "
                f"for surface '{surface}'"
            )

    if "no_foreign_watermark" not in spec:
        errors.append(f"{pid}: media_spec.no_foreign_watermark is missing")

    # char budget.
    body = post.get("body", "")
    budget = post.get("char_budget")
    if isinstance(budget, int) and isinstance(body, str) and len(body) > budget:
        errors.append(f"{pid}: body length {len(body)} exceeds char_budget {budget}")

    # hashtag count.
    hashtags = as_list(post.get("hashtags"))
    platform = post.get("platform", "")
    max_tags = HASHTAG_MAX.get(platform, DEFAULT_HASHTAG_MAX)
    if len(hashtags) > max_tags:
        errors.append(f"{pid}: {len(hashtags)} hashtags exceeds max {max_tags} for '{platform}'")

    # no empty creative placeholders for copy-bearing surfaces.
    if surface in _COPY_REQUIRED_SURFACES:
        if not (isinstance(post.get("hook"), str) and post["hook"].strip()):
            errors.append(f"{pid}: empty creative placeholder 'hook'")
        if not (isinstance(body, str) and body.strip()):
            errors.append(f"{pid}: empty creative placeholder 'body'")
        if not (isinstance(post.get("cta"), str) and post["cta"].strip()):
            errors.append(f"{pid}: empty creative placeholder 'cta'")
        if not hashtags:
            errors.append(f"{pid}: empty creative placeholder 'hashtags'")

    return errors


def validate_posts(doc: dict[str, Any]) -> list[str]:
    """Return a flat list of human-readable errors; empty list == valid."""
    if not isinstance(doc.get("posts"), list):
        return ["posts.json: 'posts' must be a list"]
    posts = as_list(doc.get("posts"))
    if not posts:
        return ["posts.json: 'posts' is empty"]
    errors: list[str] = []
    seen_ids: set[str] = set()
    for raw_post in posts:
        if not isinstance(raw_post, dict):
            errors.append("a post entry is not an object")
            continue
        post = as_obj(raw_post)
        pid = post.get("post_id")
        if isinstance(pid, str):
            if pid in seen_ids:
                errors.append(f"{pid}: duplicate post_id")
            seen_ids.add(pid)
        errors.extend(_validate_post(post))
    return errors


def _main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate a Phase-7 posts.json")
    parser.add_argument("posts", type=Path, help="path to posts.json")
    args = parser.parse_args(argv)

    doc = json.loads(args.posts.read_text())
    errors = validate_posts(doc)
    if errors:
        print(f"INVALID: {len(errors)} error(s)", file=sys.stderr)
        for err in errors:
            print(f"  - {err}", file=sys.stderr)
        return 1
    print("OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(_main())

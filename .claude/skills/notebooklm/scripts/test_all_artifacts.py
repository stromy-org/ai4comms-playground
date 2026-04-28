"""
Comprehensive multi-artifact test for the NotebookLM skill.

Creates ONE notebook with Shell HQ Relocation sources + Duke Strategies branding,
then generates all 7 artifact types sequentially and downloads them.

Artifact types tested:
  1. audio_overview  — podcast (WAV)
  2. report          — briefing doc (MD)
  3. mind_map        — JSON (synchronous)
  4. flashcards      — Markdown
  5. quiz            — Markdown
  6. infographic     — image
  7. data_table      — CSV

Usage:
    uv run python .claude/skills/notebooklm/scripts/test_all_artifacts.py
"""

from __future__ import annotations

import asyncio
import sys
import time
from pathlib import Path

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

REPO_ROOT = Path(__file__).resolve().parents[4]
SCRIPTS_DIR = Path(__file__).resolve().parent
INPUTS_DIR = Path(
    "/Users/williammasquelier/Repositories/stromy-org/Stromy"
    "/workspaces/program_runs/workflows/stakeholder_analysis_workflow/inputs"
)
OUTPUT_DIR = REPO_ROOT / "workspace" / "duke-strategies" / "output" / "notebooklm-test"
COMPANY_DIR = REPO_ROOT / ".claude" / "companies" / "dukestrategies"

sys.path.insert(0, str(SCRIPTS_DIR))


# ---------------------------------------------------------------------------
# Sources: local files + URL samples
# ---------------------------------------------------------------------------

LOCAL_DOCS = [
    INPUTS_DIR / "raw" / "Board_Strategy_Memo_Shell_HQ_Relocation.docx",
    INPUTS_DIR / "raw" / "Executive_Interview_Shell_HQ_Relocation.docx",
    INPUTS_DIR / "raw" / "Press Release Fossil_EN.pdf",
    INPUTS_DIR / "raw" / "english-summary-of-legal-summons.pdf",
    INPUTS_DIR / "raw" / "2021-gm-rns-announcement-final.pdf",
    INPUTS_DIR / "raw" / "Joint_Union_Statement_Shell_HQ_Move.pdf",
]

# Public URLs (no paywall) from the workflow's urls.txt
URL_SOURCES = [
    "https://www.esgtoday.com/shell-to-move-to-the-uk-as-it-gears-up-energy-transition-strategy/",
    "https://www.euronews.com/next/2021/11/23/shell-structure",
]


# ---------------------------------------------------------------------------
# Artifact plan
# ---------------------------------------------------------------------------

# (artifact_type, output_filename, use_brand_instructions)
ARTIFACTS: list[tuple[str, str, bool]] = [
    ("audio_overview", "shell-hq-overview.wav",          False),  # Audio branding not ready; needs ~10-15 min
    ("report",         "shell-hq-report.md",             True),
    ("mind_map",       "shell-hq-mindmap.json",          False),  # No instructions param
    ("flashcards",     "shell-hq-flashcards.md",         False),  # No instructions param
    ("quiz",           "shell-hq-quiz.md",               False),  # No instructions param
    ("infographic",    "shell-hq-infographic.png",       False),  # NOTE: may fail via API (account limitation)
    ("data_table",     "shell-hq-data-table.csv",        True),
]


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

async def run_all() -> None:
    from notebooklm import NotebookLMClient
    from brand_inject import generate_company_context, generate_brand_instructions

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Verify all local files exist
    missing = [f for f in LOCAL_DOCS if not f.exists()]
    if missing:
        print("WARNING: Missing local files (will be skipped):")
        for m in missing:
            print(f"  - {m}")
    available_docs = [f for f in LOCAL_DOCS if f.exists()]

    sources = [str(f) for f in available_docs] + URL_SOURCES
    print(f"\nSources: {len(available_docs)} local docs + {len(URL_SOURCES)} URLs")
    for s in sources:
        print(f"  • {Path(s).name if not s.startswith('http') else s}")

    # Build brand context
    brand_context = generate_company_context(COMPANY_DIR)

    print("\n" + "="*60)
    print("Creating notebook…")
    print("="*60)

    async with await NotebookLMClient.from_storage() as client:
        notebook = await client.notebooks.create("Shell HQ Relocation — Duke Strategies Test")
        nb_id = notebook.id
        print(f"Notebook created: id={nb_id}")

        # Add all sources
        print(f"\nAdding {len(sources)} source(s)…")
        added = []
        for src in sources:
            try:
                if src.startswith("http"):
                    s = await client.sources.add_url(nb_id, src)
                    print(f"  + URL: {src[:80]}")
                else:
                    s = await client.sources.add_file(nb_id, src)
                    print(f"  + File: {Path(src).name}")
                added.append(s)
            except Exception as e:
                print(f"  ! Failed to add {src[:60]}: {e}")

        # Add brand context as text source
        brand_src = await client.sources.add_text(nb_id, "Duke Strategies — Company Context", brand_context)
        added.append(brand_src)
        print(f"  + Brand context injected")

        # Wait for all sources
        source_ids = [s.id for s in added]
        print(f"\nWaiting for {len(source_ids)} sources to process…")
        try:
            await client.sources.wait_for_sources(nb_id, source_ids, timeout=180)
            print("All sources ready.\n")
        except Exception as e:
            print(f"WARNING: Some sources may not be ready: {e}\nContinuing anyway…\n")

        # Generate each artifact type
        results: list[tuple[str, str, float, str]] = []  # (type, path, duration, status)

        for artifact_type, filename, use_brand in ARTIFACTS:
            output_path = OUTPUT_DIR / filename
            instructions: str | None = None
            if use_brand:
                instructions = generate_brand_instructions(COMPANY_DIR, artifact_type)

            print(f"{'='*60}")
            print(f"[{artifact_type}]")
            if instructions:
                print(f"  Instructions: {instructions[:80]}…")
            t0 = time.monotonic()

            try:
                # Mind map: synchronous
                if artifact_type == "mind_map":
                    print(f"  Generating (synchronous)…")
                    result = await client.artifacts.generate_mind_map(nb_id)
                    if result.get("mind_map") is None:
                        raise RuntimeError("Mind map generation returned no data")
                    saved = await client.artifacts.download_mind_map(nb_id, str(output_path))

                elif artifact_type == "audio_overview":
                    status = await client.artifacts.generate_audio(nb_id)
                    if not status.task_id:
                        raise RuntimeError("generate_audio returned empty task_id (API limitation?)")
                    print(f"  Waiting (task={status.task_id}) — audio can take 10-15 min…")
                    final = await client.artifacts.wait_for_completion(
                        nb_id, status.task_id, timeout=1200
                    )
                    if final.is_failed:
                        raise RuntimeError(f"Failed: {final.error}")
                    saved = await client.artifacts.download_audio(nb_id, str(output_path))

                elif artifact_type == "report":
                    gen_kw: dict = {}
                    if instructions:
                        gen_kw["extra_instructions"] = instructions
                    status = await client.artifacts.generate_report(nb_id, **gen_kw)
                    print(f"  Waiting (task={status.task_id})…")
                    final = await client.artifacts.wait_for_completion(
                        nb_id, status.task_id, timeout=300
                    )
                    if final.is_failed:
                        raise RuntimeError(f"Failed: {final.error}")
                    saved = await client.artifacts.download_report(nb_id, str(output_path))

                elif artifact_type == "flashcards":
                    status = await client.artifacts.generate_flashcards(nb_id)
                    print(f"  Waiting (task={status.task_id})…")
                    final = await client.artifacts.wait_for_completion(
                        nb_id, status.task_id, timeout=300
                    )
                    if final.is_failed:
                        raise RuntimeError(f"Failed: {final.error}")
                    saved = await client.artifacts.download_flashcards(
                        nb_id, str(output_path), output_format="markdown"
                    )

                elif artifact_type == "quiz":
                    status = await client.artifacts.generate_quiz(nb_id)
                    print(f"  Waiting (task={status.task_id})…")
                    final = await client.artifacts.wait_for_completion(
                        nb_id, status.task_id, timeout=300
                    )
                    if final.is_failed:
                        raise RuntimeError(f"Failed: {final.error}")
                    saved = await client.artifacts.download_quiz(
                        nb_id, str(output_path), output_format="markdown"
                    )

                elif artifact_type == "infographic":
                    status = await client.artifacts.generate_infographic(nb_id)
                    if not status.task_id:
                        raise RuntimeError(
                            "generate_infographic returned empty task_id — "
                            "infographic generation may not be available via API for this account"
                        )
                    print(f"  Waiting (task={status.task_id})…")
                    final = await client.artifacts.wait_for_completion(
                        nb_id, status.task_id, timeout=600
                    )
                    if final.is_failed:
                        raise RuntimeError(f"Failed: {final.error}")
                    saved = await client.artifacts.download_infographic(nb_id, str(output_path))

                elif artifact_type == "data_table":
                    gen_kw = {}
                    if instructions:
                        gen_kw["instructions"] = instructions
                    status = await client.artifacts.generate_data_table(nb_id, **gen_kw)
                    print(f"  Waiting (task={status.task_id})…")
                    final = await client.artifacts.wait_for_completion(
                        nb_id, status.task_id, timeout=300
                    )
                    if final.is_failed:
                        raise RuntimeError(f"Failed: {final.error}")
                    saved = await client.artifacts.download_data_table(nb_id, str(output_path))

                else:
                    raise ValueError(f"Unhandled artifact type: {artifact_type}")

                elapsed = time.monotonic() - t0
                print(f"  ✓ Saved → {saved}  ({elapsed:.0f}s)")
                results.append((artifact_type, saved, elapsed, "OK"))

            except Exception as e:
                elapsed = time.monotonic() - t0
                print(f"  ✗ Error: {e}  ({elapsed:.0f}s)")
                results.append((artifact_type, "", elapsed, f"ERROR: {e}"))

        # Summary
        print("\n" + "="*60)
        print("TEST SUMMARY")
        print("="*60)
        for art_type, path, elapsed, status in results:
            icon = "✓" if status == "OK" else "✗"
            size = f"({Path(path).stat().st_size // 1024}KB)" if status == "OK" and path else ""
            print(f"  {icon} {art_type:<20} {elapsed:>5.0f}s  {size}")
            if status != "OK":
                print(f"    └─ {status}")

        print(f"\nOutput directory: {OUTPUT_DIR}")
        print("="*60)


def main() -> None:
    auth_path = Path.home() / ".notebooklm" / "storage_state.json"
    if not auth_path.exists():
        print("ERROR: Not authenticated. Run: uv run notebooklm login", file=sys.stderr)
        sys.exit(1)
    asyncio.run(run_all())


if __name__ == "__main__":
    main()

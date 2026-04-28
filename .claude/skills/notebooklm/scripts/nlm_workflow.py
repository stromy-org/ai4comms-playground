"""
NotebookLM async workflow wrapper.

Uses the notebooklm v0.3.x namespaced API:
  client.notebooks.*  — create, list, delete, rename
  client.sources.*    — add_url, add_text, add_file, wait_for_sources
  client.artifacts.*  — generate_*, wait_for_completion, download_*

Usage (CLI):
    uv run python nlm_workflow.py \
        --name "My Notebook" \
        --sources "https://example.com" "local.pdf" \
        --artifact audio_overview \
        --output output/podcast.wav

    # With company branding:
    uv run python nlm_workflow.py \
        --name "Branded Podcast" \
        --sources "https://example.com/report.pdf" \
        --artifact audio_overview \
        --company dukestrategies \
        --output output/podcast.wav

Usage (importable):
    from nlm_workflow import run_workflow
"""

from __future__ import annotations

import argparse
import asyncio
import sys
from pathlib import Path
from typing import Any


# ---------------------------------------------------------------------------
# Auth check
# ---------------------------------------------------------------------------

def check_auth() -> Path:
    """Verify storage_state.json exists and return its path."""
    state_path = Path.home() / ".notebooklm" / "storage_state.json"
    if not state_path.exists():
        msg = (
            "NotebookLM auth not found. Run:\n"
            "  uv run notebooklm login\n"
            "to authenticate via browser."
        )
        raise FileNotFoundError(msg)
    return state_path


# ---------------------------------------------------------------------------
# Source helpers
# ---------------------------------------------------------------------------

async def add_sources(
    client: Any,
    notebook_id: str,
    sources: list[str],
) -> list[Any]:
    """Add mixed source types to a notebook.

    Detects type from the string:
    - Starts with http/https → URL source (YouTube auto-detected by library)
    - Exists as a local file → file upload
    - Otherwise → plain text source
    """
    added: list[Any] = []
    for source in sources:
        if source.startswith(("http://", "https://")):
            result = await client.sources.add_url(notebook_id, source)
        elif Path(source).exists():
            result = await client.sources.add_file(notebook_id, source)
        else:
            title = source[:50] + ("..." if len(source) > 50 else "")
            result = await client.sources.add_text(notebook_id, title, source)
        added.append(result)
    return added


# ---------------------------------------------------------------------------
# Artifact generation
# ---------------------------------------------------------------------------

def _artifact_generate_fn(client: Any, artifact_type: str) -> Any:
    """Map artifact type string to the correct generate method."""
    mapping = {
        "audio_overview": client.artifacts.generate_audio,
        "audio":          client.artifacts.generate_audio,
        "podcast":        client.artifacts.generate_audio,
        "video":          client.artifacts.generate_video,
        "slides":         client.artifacts.generate_slide_deck,
        "slide_deck":     client.artifacts.generate_slide_deck,
        "report":         client.artifacts.generate_report,
        "quiz":           client.artifacts.generate_quiz,
        "flashcards":     client.artifacts.generate_flashcards,
        "infographic":    client.artifacts.generate_infographic,
        "data_table":     client.artifacts.generate_data_table,
        "mind_map":       client.artifacts.generate_mind_map,  # synchronous, returns dict
    }
    fn = mapping.get(artifact_type)
    if fn is None:
        valid = ", ".join(sorted(mapping.keys()))
        raise ValueError(f"Unknown artifact type: {artifact_type!r}. Valid: {valid}")
    return fn


def _artifact_download_fn(client: Any, artifact_type: str) -> Any:
    """Map artifact type string to the correct download method."""
    mapping = {
        "audio_overview": client.artifacts.download_audio,
        "audio":          client.artifacts.download_audio,
        "podcast":        client.artifacts.download_audio,
        "video":          client.artifacts.download_video,
        "slides":         client.artifacts.download_slide_deck,
        "slide_deck":     client.artifacts.download_slide_deck,
        "report":         client.artifacts.download_report,
        "quiz":           client.artifacts.download_quiz,
        "flashcards":     client.artifacts.download_flashcards,
        "infographic":    client.artifacts.download_infographic,
        "data_table":     client.artifacts.download_data_table,
        "mind_map":       client.artifacts.download_mind_map,  # downloads JSON
    }
    fn = mapping.get(artifact_type)
    if fn is None:
        raise ValueError(f"No download method for artifact type: {artifact_type!r}")
    return fn


MIND_MAP_TYPES = {"mind_map"}  # synchronous — no polling needed


async def generate_and_download(
    client: Any,
    notebook_id: str,
    artifact_type: str,
    output_path: str | Path,
    *,
    instructions: str | None = None,
    language: str | None = None,
    timeout: float = 600.0,
) -> Path:
    """Generate an artifact, wait for completion, and download it.

    Mind maps are handled as a special case (synchronous generation, saves to note).

    Args:
        client: Active NotebookLMClient (opened via async with).
        notebook_id: Target notebook ID.
        artifact_type: Artifact type string (audio_overview, report, quiz, …).
        output_path: Where to save the result.
        instructions: Custom generation instructions.
        language: Language code (default: "en").
        timeout: Max seconds to wait for async artifacts.

    Returns:
        Path to the downloaded file.
    """
    output = Path(output_path)
    output.parent.mkdir(parents=True, exist_ok=True)

    gen_fn = _artifact_generate_fn(client, artifact_type)

    if artifact_type in MIND_MAP_TYPES:
        # Mind map: synchronous — generate_mind_map returns a dict immediately
        print(f"[{artifact_type}] Generating (synchronous)…")
        result = await gen_fn(notebook_id)
        if result.get("mind_map") is None:
            raise RuntimeError(f"Mind map generation returned no data: {result}")
        # Download via the dedicated download method (reads from notes)
        dl_fn = _artifact_download_fn(client, artifact_type)
        saved = await dl_fn(notebook_id, str(output))
        print(f"[{artifact_type}] Saved → {saved}")
        return Path(saved)

    # All other artifact types: async generation via GenerationStatus
    gen_kwargs: dict[str, Any] = {}
    if instructions:
        # Different generate methods use different param names
        if artifact_type in {"report"}:
            gen_kwargs["extra_instructions"] = instructions
        else:
            gen_kwargs["instructions"] = instructions
    if language:
        if artifact_type not in {"quiz", "flashcards"}:
            gen_kwargs["language"] = language

    print(f"[{artifact_type}] Starting generation…")
    status = await gen_fn(notebook_id, **gen_kwargs)

    if not status.task_id:
        raise RuntimeError(f"[{artifact_type}] Generation failed immediately: {status}")

    print(f"[{artifact_type}] Waiting for completion (task_id={status.task_id})…")
    final = await client.artifacts.wait_for_completion(
        notebook_id, status.task_id, timeout=timeout
    )

    if final.is_failed:
        raise RuntimeError(f"[{artifact_type}] Generation failed: {final.error}")

    print(f"[{artifact_type}] Done. Downloading → {output}")
    dl_fn = _artifact_download_fn(client, artifact_type)
    saved = await dl_fn(notebook_id, str(output))
    print(f"[{artifact_type}] Saved → {saved}")
    return Path(saved)


# ---------------------------------------------------------------------------
# Full workflow (single artifact, CLI-oriented)
# ---------------------------------------------------------------------------

async def run_workflow(
    name: str,
    sources: list[str],
    artifact_type: str,
    output_path: str,
    *,
    company: str | None = None,
    instructions: str | None = None,
    language: str | None = None,
) -> Path:
    """Run the complete create → add-sources → generate → download workflow.

    Args:
        name: Notebook name.
        sources: List of source strings (URLs, file paths, or raw text).
        artifact_type: What to generate.
        output_path: Where to save.
        company: Company slug for branding (e.g. "dukestrategies").
        instructions: Custom generation instructions.
        language: Language code.

    Returns:
        Path to the downloaded artifact.
    """
    from notebooklm import NotebookLMClient

    check_auth()

    # Resolve brand instructions before opening client
    brand_instructions: str | None = None
    company_dir: Path | None = None
    if company:
        scripts_dir = Path(__file__).resolve().parent
        sys.path.insert(0, str(scripts_dir))
        from brand_inject import generate_brand_instructions
        repo_root = Path(__file__).resolve().parents[4]
        company_dir = repo_root / ".claude" / "companies" / company
        if company_dir.exists():
            brand_instructions = generate_brand_instructions(company_dir, artifact_type)

    final_instructions: str | None = None
    if brand_instructions and instructions:
        final_instructions = f"{brand_instructions}\n\n{instructions}"
    elif brand_instructions:
        final_instructions = brand_instructions
    elif instructions:
        final_instructions = instructions

    async with await NotebookLMClient.from_storage() as client:
        notebook = await client.notebooks.create(name)
        notebook_id = notebook.id
        print(f"Created notebook: {name!r} (id={notebook_id})")

        added = await add_sources(client, notebook_id, sources)
        source_ids = [s.id for s in added]
        print(f"Added {len(added)} source(s). Waiting for processing…")
        await client.sources.wait_for_sources(notebook_id, source_ids, timeout=120)
        print("Sources ready.")

        if company_dir is not None and company_dir.exists():
            scripts_dir = Path(__file__).resolve().parent
            sys.path.insert(0, str(scripts_dir))
            from brand_inject import generate_company_context
            context = generate_company_context(company_dir)
            brand_src = await client.sources.add_text(
                notebook_id, "Company Context", context, wait=True
            )
            print(f"Injected brand context for {company!r} (source_id={brand_src.id})")

        return await generate_and_download(
            client, notebook_id, artifact_type, output_path,
            instructions=final_instructions, language=language,
        )


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="NotebookLM workflow: create → add sources → generate → download"
    )
    parser.add_argument("--name", required=True, help="Notebook name")
    parser.add_argument("--sources", nargs="+", required=True,
                        help="Source URLs, file paths, or text")
    parser.add_argument("--artifact", required=True,
                        help="Artifact type (audio_overview, report, quiz, mind_map, …)")
    parser.add_argument("--output", required=True, help="Output file path")
    parser.add_argument("--company", help="Company slug for branding (e.g. dukestrategies)")
    parser.add_argument("--instructions", help="Custom generation instructions")
    parser.add_argument("--language", default="en", help="Language code (default: en)")

    args = parser.parse_args()

    try:
        result = asyncio.run(run_workflow(
            name=args.name,
            sources=args.sources,
            artifact_type=args.artifact,
            output_path=args.output,
            company=args.company,
            instructions=args.instructions,
            language=args.language,
        ))
        print(f"\nDone! Artifact saved to: {result}")
    except FileNotFoundError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()

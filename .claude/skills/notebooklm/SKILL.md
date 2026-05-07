---
name: notebooklm
description: "Generate content using Google NotebookLM — audio overviews (podcasts), video explainers, slides, quizzes, flashcards, reports, infographics, mind maps, data tables, and more from source material. Supports optional company branding via charter.json/profile.json. Use when the user mentions NotebookLM, wants to create a podcast or audio overview, generate study materials, produce AI-generated video explainers, or convert documents/URLs into any NotebookLM artifact type."
---

# NotebookLM

Generate professional content from source material using Google NotebookLM's API via the `notebooklm-py` library. Supports audio overviews (podcasts), video explainers, slides, quizzes, flashcards, reports, infographics, mind maps, data tables, and more — with optional company branding.

## Prerequisites

```bash
# Already in pyproject.toml — just sync
uv sync
uv run playwright install chromium     # Install browser binary (one-time)
uv run notebooklm login                # One-time browser auth → storage_state.json
```

Authentication is cookie-based. The `notebooklm login` command opens a Chromium browser for Google sign-in and saves session cookies to `~/.notebooklm/storage_state.json`. Sessions expire after ~1-2 weeks — re-run `notebooklm login` when requests fail with 401/403 errors.

**Credential precedence**: `--storage` CLI flag → `NOTEBOOKLM_AUTH_JSON` env var → `$NOTEBOOKLM_HOME/storage_state.json` → `~/.notebooklm/storage_state.json`.

## When to Use

- Creating **audio overviews / podcasts** from documents, URLs, or text
- Generating **video explainers** from source material
- Producing **study materials** — quizzes, flashcards, study guides
- Creating **slides, reports, infographics, mind maps, data tables** from sources
- Any task involving Google NotebookLM artifact generation
- Converting documents/URLs into digestible content formats

**When NOT to use:**
- For Remotion-based video creation (the `remotion-video` skill handles that)
- For static PowerPoint creation from scratch (the `pptx` skill handles that)
- For document creation without NotebookLM (use `docx`, `pdf`, or `pptx` skills directly)

## Workflow

### Step 1: Discover Brand (Optional)

If the user wants branded output or a company context is relevant:

```
CHECK: Does client-data/clients/ exist?
  └── One company (excluding _example) → use it automatically
  └── Multiple → ask user which company
  └── None → proceed without branding
READ: client-data/clients/<name>/profile.json
  └── Extract company.name, company.description, company.tagline
  └── Extract services, credentials for content enrichment
READ: client-data/clients/<name>/charter.json
  └── Extract colors, fonts, logo paths for post-processing
```

### Step 2: Gather Requirements

Ask the user (skip questions already answered):

1. **Sources** — What material to process? (URLs, files, text, YouTube links)
2. **Artifact type** — What to generate? (audio, video, slides, quiz, etc.)
3. **Options** — Language, custom instructions, specific preferences?
4. **Branding** — Should company context be injected? (auto-detect from company data)
5. **Output location** — Where to save? (defaults to workspace convention)

Source limits: NotebookLM supports up to 50 sources per notebook. Each source can be a URL, uploaded file (PDF, TXT, Markdown, etc.), YouTube link, or plain text.

### Step 3: Branding Strategy

Three layers of branding, each optional and independent:

| Layer | How | Best For |
|-------|-----|----------|
| **Source injection** | `brand_inject.py` generates company context text → added as notebook source | All artifacts — influences tone and content |
| **Custom instructions** | Company voice/positioning in generation params | Audio, video — shapes narration style |
| **Post-processing** | Download then refine with format-specific tools | PPTX (logo/colors), audio (intro/outro), PDF (metadata) |

**Source injection** is the primary branding mechanism — it ensures NotebookLM "knows" about the company when generating any artifact type.

### Step 4: Create Notebook & Add Sources

Use `nlm_workflow.py` for the full async workflow:

```bash
# Quick: create notebook, add sources, generate, download — all in one
uv run python .claude/skills/notebooklm/scripts/nlm_workflow.py \
  --name "My Notebook" \
  --sources "https://example.com/doc.pdf" "path/to/file.txt" \
  --artifact audio_overview \
  --output workspace/client/output/podcast/overview.wav

# With company branding
uv run python .claude/skills/notebooklm/scripts/nlm_workflow.py \
  --name "Branded Podcast" \
  --sources "https://example.com/report.pdf" \
  --artifact audio_overview \
  --company dukestrategies \
  --output workspace/duke-strategies/output/podcast/overview.wav
```

Or use inline async code for more control — see `references/api-patterns.md`.

### Step 5: Generate Artifact

The workflow script handles generation and waiting. Key points:

- **Always wait for completion** — artifact generation is async and can take 1-10+ minutes
- **Audio overviews** typically take 2-5 minutes
- **Video** can take 5-15 minutes
- The script polls with exponential backoff until the artifact is ready

### Step 6: Download & Save

Output follows workspace conventions:

```
workspace/<client>/output/<deliverable>/
```

Use `src/workspace.py` for output path resolution when building from `workspace/<client>/build/<deliverable>/`.

**Override**: If the prompt specifies a target output directory, use that path directly.



### Step 7: Post-Process (Optional)

After downloading the artifact, optionally refine it:

| Artifact Format | Post-Processing | Tools |
|----------------|-----------------|-------|
| Audio (WAV/MP3) | Add intro/outro, normalize volume | ffmpeg |
| Video (MP4) | Add branded intro/outro, overlay logo | ffmpeg |
| Slides (PPTX) | Apply brand colors, add logo, restyle | pptx skill patterns |
| PDF | Add metadata, branded header/footer | pdf skill patterns |
| Text formats | Apply formatting, add branding elements | docx skill patterns |

Post-processing is entirely optional. The raw NotebookLM output is often sufficient. For detailed post-processing patterns, see `references/post-processing.md`.

## Artifact Quick Reference

| Type | Enum Value | Output Format | Key Options | Typical Time |
|------|-----------|---------------|-------------|-------------|
| Audio Overview | `audio_overview` | WAV | language, instructions | 10-15 min |
| Video | `video` | MP4 | language, instructions | 5-15 min |
| Slides | `slides` | PPTX | language, instructions | 1-3 min |
| Quiz | `quiz` | Markdown/JSON | topic focus | 1-2 min |
| Flashcards | `flashcards` | Markdown/JSON | topic focus | 1-2 min |
| Report | `report` | Markdown | extra_instructions | 1-2 min |
| Infographic | `infographic` | Image | language, instructions | 2-5 min | ⚠️ May fail via API (returns empty task_id) |
| Mind Map | `mind_map` | JSON | — (synchronous) | <1 min |
| Data Table | `data_table` | CSV | language, instructions | 1-2 min |

For detailed configuration options and enum values, see `references/artifact-types.md`.

## Authentication

### Setup

```bash
uv sync                       # notebooklm-py[browser] is in pyproject.toml
uv run playwright install chromium
uv run notebooklm login
```

The login command opens a Chromium browser for Google sign-in. After authenticating, session state is saved to `~/.notebooklm/storage_state.json`.

### Troubleshooting

| Issue | Solution |
|-------|---------|
| `FileNotFoundError: storage_state.json` | Run `uv run notebooklm login` |
| 401/403 errors | Session expired — re-run `uv run notebooklm login` |
| Browser doesn't open | Run `uv run playwright install chromium` |
| Rate limiting | Wait 60 seconds between requests; reduce concurrent operations |

### Auth Check

Before running any workflow, verify auth is valid:

```python
from notebooklm import NotebookLMClient

async with await NotebookLMClient.from_storage() as client:
    notebooks = [n async for n in client.list_notebooks()]  # If this doesn't raise, auth is valid
```

## Chat & Research

NotebookLM also supports interactive capabilities beyond artifact generation:

- **Chat**: Ask questions about notebook sources — useful for research and summarization
- **Web Research**: Enable web grounding for answers that go beyond the uploaded sources

```python
# Chat with notebook sources
response = await client.chat(notebook_id, "What are the key findings?")

# With web research enabled
response = await client.chat(notebook_id, "How does this compare to industry trends?",
                             web_supplemented=True)
```

These are supplementary to the main artifact generation workflow.

## Common Patterns

### Quick Podcast from URLs

```python
import asyncio
from notebooklm import NotebookLMClient

async def quick_podcast():
    async with await NotebookLMClient.from_storage() as client:
        notebook = await client.notebooks.create("Research Podcast")
        src = await client.sources.add_url(notebook.id, "https://example.com/article")
        await client.sources.wait_for_sources(notebook.id, [src.id], timeout=120)
        status = await client.artifacts.generate_audio(notebook.id)
        final = await client.artifacts.wait_for_completion(notebook.id, status.task_id, timeout=1200)
        if final.is_failed:
            raise RuntimeError(f"Audio generation failed: {final.error}")
        await client.artifacts.download_audio(notebook.id, "output/podcast.wav")

asyncio.run(quick_podcast())
```

### Branded Podcast with Company Context

```python
import asyncio
import sys
from pathlib import Path
from notebooklm import NotebookLMClient

sys.path.insert(0, str(Path(".claude/skills/notebooklm/scripts").resolve()))
from brand_inject import generate_company_context, generate_brand_instructions

company_dir = Path("client-data/clients/dukestrategies")
brand_context = generate_company_context(company_dir)
brand_instructions = generate_brand_instructions(company_dir, "audio_overview")

async def branded_podcast():
    async with await NotebookLMClient.from_storage() as client:
        notebook = await client.notebooks.create("Duke Strategies Podcast")
        # Add source material
        src = await client.sources.add_url(notebook.id, "https://example.com/report.pdf")
        # Inject company context as a text source
        brand_src = await client.sources.add_text(notebook.id, "Company Context", brand_context)
        await client.sources.wait_for_sources(notebook.id, [src.id, brand_src.id], timeout=120)
        # Generate with brand instructions
        status = await client.artifacts.generate_audio(notebook.id, instructions=brand_instructions)
        final = await client.artifacts.wait_for_completion(notebook.id, status.task_id, timeout=1200)
        if final.is_failed:
            raise RuntimeError(f"Audio generation failed: {final.error}")
        await client.artifacts.download_audio(notebook.id, "output/podcast.wav")

asyncio.run(branded_podcast())
```

### Study Materials from PDF

```python
import asyncio
from notebooklm import NotebookLMClient

async def study_materials():
    async with await NotebookLMClient.from_storage() as client:
        notebook = await client.notebooks.create("Study Session")
        src = await client.sources.add_file(notebook.id, "textbook-chapter.pdf")
        await client.sources.wait_for_sources(notebook.id, [src.id], timeout=120)

        # Generate multiple artifact types
        quiz_status = await client.artifacts.generate_quiz(notebook.id)
        cards_status = await client.artifacts.generate_flashcards(notebook.id)

        # Wait and download each
        for status, dl_fn, path in [
            (quiz_status,  client.artifacts.download_quiz,       "output/quiz.md"),
            (cards_status, client.artifacts.download_flashcards, "output/flashcards.md"),
        ]:
            final = await client.artifacts.wait_for_completion(notebook.id, status.task_id, timeout=300)
            if final.is_failed:
                raise RuntimeError(f"Generation failed: {final.error}")
            await dl_fn(notebook.id, path, output_format="markdown")

asyncio.run(study_materials())
```

### Video Explainer from Multiple Sources

```python
import asyncio
from notebooklm import NotebookLMClient

async def video_explainer():
    async with await NotebookLMClient.from_storage() as client:
        notebook = await client.notebooks.create("Product Explainer")
        src1 = await client.sources.add_url(notebook.id, "https://docs.example.com/product")
        src2 = await client.sources.add_text(notebook.id, "Key selling points", "Key selling points: ...")
        await client.sources.wait_for_sources(notebook.id, [src1.id, src2.id], timeout=120)
        status = await client.artifacts.generate_video(notebook.id,
            instructions="Focus on the top 3 features, keep it under 5 minutes")
        final = await client.artifacts.wait_for_completion(notebook.id, status.task_id, timeout=900)
        if final.is_failed:
            raise RuntimeError(f"Video generation failed: {final.error}")
        await client.artifacts.download_video(notebook.id, "output/explainer.mp4")

asyncio.run(video_explainer())
```

## Rules

1. **Check auth first** — verify `storage_state.json` exists before any API call
2. **Always wait for completion** — never return an artifact ID without waiting for generation to finish
3. **Respect source limits** — max 50 sources per notebook
4. **Rate limiting** — space requests at least 5 seconds apart; back off on 429 errors
5. **Clean up** — delete notebooks after downloading artifacts unless the user wants to keep them for chat
6. **Output location** — follow workspace conventions; use `src/workspace.py` for path resolution
7. **Brand data first** — if branding is requested, always read `charter.json` and `profile.json` before generating

## References

Load these on demand — do not read all at once.

| Topic | File | When to Load |
|-------|------|-------------|
| Artifact types | [references/artifact-types.md](references/artifact-types.md) | When you need detailed config for a specific artifact type |
| API patterns | [references/api-patterns.md](references/api-patterns.md) | When writing custom async code or debugging API calls |
| Post-processing | [references/post-processing.md](references/post-processing.md) | When applying branding to downloaded artifacts |

## Dependencies

`notebooklm-py[browser]` is declared in `pyproject.toml`. Just run:

```bash
uv sync
uv run playwright install chromium
```

Optional (for post-processing):
```bash
brew install ffmpeg          # Audio/video post-processing
brew install --cask libreoffice  # PPTX/DOCX conversion
```

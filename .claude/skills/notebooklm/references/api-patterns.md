# API Patterns Reference

Detailed `notebooklm-py` code patterns for custom workflows.

## Table of Contents

1. [Client Setup](#client-setup)
2. [Notebook Management](#notebook-management)
3. [Source Management](#source-management)
4. [Artifact Generation](#artifact-generation)
5. [Waiting & Polling](#waiting--polling)
6. [Chat & Research](#chat--research)
7. [Error Handling](#error-handling)
8. [Concurrent Operations](#concurrent-operations)

---

## Client Setup

The `NotebookLMClient` is an async context manager. Always use it with `async with`:

```python
from notebooklm_py import NotebookLMClient

async with NotebookLMClient() as client:
    # All operations here
    pass
```

**Custom storage state path:**
```python
async with NotebookLMClient(storage_state="path/to/storage_state.json") as client:
    pass
```

**Manual lifecycle** (when you need the client to persist):
```python
client = NotebookLMClient()
await client.__aenter__()
try:
    # operations...
finally:
    await client.__aexit__(None, None, None)
```

---

## Notebook Management

### Create
```python
notebook = await client.create_notebook("My Notebook")
print(notebook.id)  # Use this ID for all subsequent operations
```

### List
```python
notebooks = await client.list_notebooks()
for nb in notebooks:
    print(f"{nb.id}: {nb.name}")
```

### Delete
```python
await client.delete_notebook(notebook_id)
```

---

## Source Management

### URL Source
```python
source = await client.add_url_source(notebook_id, "https://example.com/article")
```

### File Upload
```python
source = await client.add_file_source(notebook_id, "document.pdf")
```

Supported file types: PDF, TXT, Markdown, HTML, and other text-based formats.

### YouTube Source
```python
source = await client.add_youtube_source(notebook_id, "https://youtube.com/watch?v=...")
```

### Text Source
```python
source = await client.add_text_source(
    notebook_id,
    "Your text content here...",
    title="Context Document"
)
```

### List Sources
```python
sources = await client.list_sources(notebook_id)
for src in sources:
    print(f"{src.id}: {src.title} ({src.type})")
```

### Delete Source
```python
await client.delete_source(notebook_id, source_id)
```

---

## Artifact Generation

### Direct Methods (Audio, Video, Slides)

```python
# Audio overview
artifact = await client.generate_audio_overview(
    notebook_id,
    language="en",
    instructions="Focus on key findings"
)

# Video
artifact = await client.generate_video(
    notebook_id,
    instructions="Keep it under 5 minutes"
)

# Slides
artifact = await client.generate_slides(notebook_id)
```

### Generic Method (All Types)

```python
artifact = await client.generate_artifact(
    notebook_id,
    artifact_type="quiz",  # or flashcards, study_guide, report, etc.
    language="en"
)
```

### Download

```python
await client.download_artifact(artifact_id, "output/file.ext")
```

---

## Waiting & Polling

Artifact generation is asynchronous. Always wait for completion:

```python
# Built-in wait method (recommended)
result = await client.wait_for_artifact(artifact.id)

# Check status manually
status = await client.get_artifact_status(artifact.id)
if status.is_complete:
    await client.download_artifact(artifact.id, "output.wav")
```

The `wait_for_artifact` method polls with exponential backoff until the artifact is ready or an error occurs.

---

## Chat & Research

### Basic Chat
```python
response = await client.chat(notebook_id, "What are the key findings?")
print(response.text)
```

### Chat with Web Research
```python
response = await client.chat(
    notebook_id,
    "How does this compare to industry benchmarks?",
    web_supplemented=True
)
print(response.text)
# response.citations contains web sources used
```

### Chat History
```python
messages = await client.get_chat_history(notebook_id)
```

---

## Error Handling

```python
from notebooklm_py import NotebookLMError

try:
    async with NotebookLMClient() as client:
        artifact = await client.generate_audio_overview(notebook_id)
        result = await client.wait_for_artifact(artifact.id)
except FileNotFoundError:
    print("Auth missing — run: notebooklm login")
except NotebookLMError as e:
    if "429" in str(e):
        print("Rate limited — wait 60 seconds and retry")
    elif "401" in str(e) or "403" in str(e):
        print("Auth expired — re-run: notebooklm login")
    else:
        print(f"API error: {e}")
```

---

## Concurrent Operations

### Multiple Artifacts from One Notebook

Generate multiple artifact types sequentially (one at a time per notebook):

```python
artifact_types = ["audio_overview", "slides", "study_guide"]
for atype in artifact_types:
    artifact = await client.generate_artifact(notebook_id, atype)
    result = await client.wait_for_artifact(artifact.id)
    await client.download_artifact(result.id, f"output/{atype}.out")
```

### Multiple Notebooks in Parallel

Use `asyncio.gather` for independent notebooks:

```python
import asyncio

async def process_source(client, url, output_prefix):
    notebook = await client.create_notebook(f"Analysis: {url}")
    await client.add_url_source(notebook.id, url)
    artifact = await client.generate_audio_overview(notebook.id)
    result = await client.wait_for_artifact(artifact.id)
    await client.download_artifact(result.id, f"{output_prefix}.wav")

async with NotebookLMClient() as client:
    await asyncio.gather(
        process_source(client, "https://example.com/doc1", "output/doc1"),
        process_source(client, "https://example.com/doc2", "output/doc2"),
    )
```

**Note:** Be mindful of rate limits when running concurrent operations. Space requests if you encounter 429 errors.

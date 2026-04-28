# Artifact Types Reference

Detailed configuration for each NotebookLM artifact type.

## Table of Contents

1. [Audio Overview](#audio-overview)
2. [Video](#video)
3. [Slides](#slides)
4. [Quiz](#quiz)
5. [Flashcards](#flashcards)
6. [Study Guide](#study-guide)
7. [Report](#report)
8. [Infographic](#infographic)
9. [Mind Map](#mind-map)
10. [Data Table](#data-table)

---

## Audio Overview

Generates a conversational audio discussion about the notebook sources, similar to a podcast episode.

| Property | Value |
|----------|-------|
| **Enum value** | `audio_overview` |
| **Output format** | WAV (44.1kHz, stereo) |
| **Typical duration** | 5-15 minutes of audio |
| **Generation time** | 2-5 minutes |
| **Client method** | `generate_audio_overview()` |

**Options:**
- `language` (str): Language code (e.g., "en", "nl", "fr", "de")
- `instructions` (str): Custom instructions for tone, focus areas, or style

**Example:**
```python
artifact = await client.generate_audio_overview(
    notebook_id,
    language="en",
    instructions="Focus on the financial implications and keep the tone accessible"
)
```

**Notes:**
- Two AI-generated hosts discuss the material conversationally
- Sources should contain enough substance for a meaningful discussion
- Custom instructions shape the hosts' focus areas and conversational style

---

## Video

Generates a video explainer summarizing the notebook sources.

| Property | Value |
|----------|-------|
| **Enum value** | `video` |
| **Output format** | MP4 |
| **Typical duration** | 3-10 minutes |
| **Generation time** | 5-15 minutes |
| **Client method** | `generate_video()` |

**Options:**
- `language` (str): Language code
- `instructions` (str): Focus areas, style guidance

**Example:**
```python
artifact = await client.generate_video(
    notebook_id,
    instructions="Focus on the top 3 features, keep it under 5 minutes"
)
```

---

## Slides

Generates a presentation (PPTX) from the notebook sources.

| Property | Value |
|----------|-------|
| **Enum value** | `slides` |
| **Output format** | PPTX |
| **Typical slides** | 10-20 slides |
| **Generation time** | 1-3 minutes |
| **Client method** | `generate_slides()` |

**Options:**
- `language` (str): Language code
- `instructions` (str): Structure and content guidance

**Notes:**
- Output can be post-processed with the `pptx` skill's editing workflow to apply company branding (logo, colors, fonts)

---

## Quiz

Generates assessment questions based on the notebook sources.

| Property | Value |
|----------|-------|
| **Enum value** | `quiz` |
| **Output format** | JSON/structured text |
| **Typical questions** | 10-20 questions |
| **Generation time** | 1-2 minutes |
| **Client method** | `generate_artifact(notebook_id, "quiz")` |

**Options:**
- `language` (str): Language code

**Output structure:**
```json
{
  "questions": [
    {
      "question": "What is the main finding?",
      "options": ["A", "B", "C", "D"],
      "correct": "B",
      "explanation": "..."
    }
  ]
}
```

---

## Flashcards

Generates study flashcards from the notebook sources.

| Property | Value |
|----------|-------|
| **Enum value** | `flashcards` |
| **Output format** | JSON/structured text |
| **Typical cards** | 15-30 cards |
| **Generation time** | 1-2 minutes |
| **Client method** | `generate_artifact(notebook_id, "flashcards")` |

**Output structure:**
```json
{
  "cards": [
    {
      "front": "Key concept",
      "back": "Detailed explanation"
    }
  ]
}
```

---

## Study Guide

Generates a comprehensive study guide from the notebook sources.

| Property | Value |
|----------|-------|
| **Enum value** | `study_guide` |
| **Output format** | Markdown/text |
| **Typical length** | 2-5 pages |
| **Generation time** | 1-3 minutes |
| **Client method** | `generate_artifact(notebook_id, "study_guide")` |

---

## Report

Generates a written report summarizing and analyzing the notebook sources.

| Property | Value |
|----------|-------|
| **Enum value** | `report` |
| **Output format** | Markdown/text |
| **Typical length** | 3-8 pages |
| **Generation time** | 2-5 minutes |
| **Client method** | `generate_artifact(notebook_id, "report")` |

**Options:**
- `instructions` (str): Report focus, structure, audience

---

## Infographic

Generates a visual infographic from the notebook sources.

| Property | Value |
|----------|-------|
| **Enum value** | `infographic` |
| **Output format** | Image (PNG) |
| **Generation time** | 2-5 minutes |
| **Client method** | `generate_artifact(notebook_id, "infographic")` |

---

## Mind Map

Generates a mind map visualization of the notebook content.

| Property | Value |
|----------|-------|
| **Enum value** | `mind_map` |
| **Output format** | Image or structured text |
| **Generation time** | 1-3 minutes |
| **Client method** | `generate_artifact(notebook_id, "mind_map")` |

---

## Data Table

Extracts and structures data from sources into a tabular format.

| Property | Value |
|----------|-------|
| **Enum value** | `data_table` |
| **Output format** | CSV/JSON |
| **Generation time** | 1-2 minutes |
| **Client method** | `generate_artifact(notebook_id, "data_table")` |

---

## Source Type Compatibility

All artifact types work with all source types. Some combinations produce better results:

| Source Type | Best For |
|------------|----------|
| PDF/documents | Reports, study materials, quizzes |
| URLs/web pages | Audio overviews, reports, mind maps |
| YouTube videos | Audio overviews, study guides, flashcards |
| Plain text | All types (good for supplementary context) |

## Generation Limits

- Max 50 sources per notebook
- One artifact generation at a time per notebook (queue additional requests)
- Rate limit: ~10 requests per minute (back off on 429 errors)
- Generation may fail for very short or insufficient source material

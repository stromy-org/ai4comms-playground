# Post-Processing Reference

How to apply company branding to downloaded NotebookLM artifacts.

Post-processing is optional — raw NotebookLM output is often sufficient. Apply branding when the user specifically requests branded output or the deliverable is client-facing.

## Table of Contents

1. [Audio Post-Processing](#audio-post-processing)
2. [Video Post-Processing](#video-post-processing)
3. [Slides Post-Processing](#slides-post-processing)
4. [PDF Post-Processing](#pdf-post-processing)
5. [Text Format Post-Processing](#text-format-post-processing)

---

## Audio Post-Processing

**Tools:** ffmpeg

### Add Intro/Outro

```bash
# Concatenate intro + main audio + outro
ffmpeg -i intro.wav -i main.wav -i outro.wav \
  -filter_complex "[0:a][1:a][2:a]concat=n=3:v=0:a=1" \
  output_branded.wav
```

### Normalize Volume

```bash
# Two-pass loudness normalization (broadcast standard -16 LUFS)
ffmpeg -i input.wav -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null - 2>&1
# Use the measured values in the second pass
ffmpeg -i input.wav -af loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=<val>:measured_TP=<val>:measured_LRA=<val>:measured_thresh=<val> output.wav
```

### Convert to MP3

```bash
ffmpeg -i input.wav -codec:a libmp3lame -qscale:a 2 output.mp3
```

### Add Metadata

```bash
ffmpeg -i input.wav \
  -metadata title="Company Podcast: Topic" \
  -metadata artist="Company Name" \
  -metadata album="Company Podcast Series" \
  -metadata year="2025" \
  output.wav
```

---

## Video Post-Processing

**Tools:** ffmpeg

### Overlay Logo

```bash
# Logo in top-right corner with padding
ffmpeg -i input.mp4 -i logo.png \
  -filter_complex "overlay=W-w-20:20" \
  output_branded.mp4
```

### Add Branded Intro Card

```bash
# Create a 3-second intro image, then prepend to video
ffmpeg -loop 1 -i intro_card.png -t 3 -pix_fmt yuv420p intro.mp4
ffmpeg -i intro.mp4 -i main.mp4 \
  -filter_complex "[0:v][1:v]concat=n=2:v=1:a=0" \
  output.mp4
```

### Add Branded Lower Third

```bash
# Overlay a lower-third graphic during the first 5 seconds
ffmpeg -i input.mp4 -i lower_third.png \
  -filter_complex "[0:v][1:v]overlay=0:H-h:enable='between(t,0,5)'" \
  output.mp4
```

---

## Slides Post-Processing

**Approach:** Download the PPTX, then apply branding using the OOXML editing workflow.

### Workflow

1. Download PPTX from NotebookLM
2. Unpack to working directory:
   ```bash
   mkdir unpacked && cd unpacked && unzip ../slides.pptx
   ```
3. Edit XML files to apply branding:
   - **Theme colors**: Edit `ppt/theme/theme1.xml` — replace color values with charter colors
   - **Logo**: Add logo image to `ppt/media/`, reference in slide layouts
   - **Fonts**: Edit `ppt/theme/theme1.xml` — update font scheme
4. Repack:
   ```bash
   cd unpacked && zip -r ../slides_branded.pptx . -x ".*"
   ```

### Key Brand Elements

From `charter.json`:
- `colors.primary` → slide accent color, heading color
- `colors.secondary` → secondary elements, borders
- `fonts.heading.family` → slide title fonts
- `fonts.body.family` → body text fonts
- `logo.primary` → add to slide master for all-slide branding

The `pptx` skill handles OOXML editing in detail — its patterns apply here for post-processing NotebookLM slides.

---

## PDF Post-Processing

**Approach:** Add metadata, headers/footers, or watermarks.

### Add Metadata with Python

```python
from pypdf import PdfReader, PdfWriter

reader = PdfReader("input.pdf")
writer = PdfWriter()
for page in reader.pages:
    writer.add_page(page)

writer.add_metadata({
    "/Title": "Company Report: Topic",
    "/Author": "Company Name",
    "/Subject": "Generated from NotebookLM",
    "/Creator": "Company Name"
})

with open("output.pdf", "wb") as f:
    writer.write(f)
```

### Add Watermark/Header

```python
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from pypdf import PdfReader, PdfWriter

# Create watermark
c = canvas.Canvas("watermark.pdf", pagesize=letter)
c.setFont("Helvetica", 10)
c.drawString(72, 750, "Company Name — Confidential")
c.save()

# Merge watermark with each page
reader = PdfReader("input.pdf")
watermark = PdfReader("watermark.pdf")
writer = PdfWriter()

for page in reader.pages:
    page.merge_page(watermark.pages[0])
    writer.add_page(page)

with open("output.pdf", "wb") as f:
    writer.write(f)
```

---

## Text Format Post-Processing

For study guides, reports, and other text outputs:

### Convert to DOCX

Use the `docx` skill's creation workflow to convert Markdown/text output into a branded Word document with:
- Company header/footer from charter
- Heading styles using brand fonts and colors
- Cover page with company branding

### Convert to PDF

1. First create a branded DOCX (above)
2. Convert with LibreOffice:
   ```bash
   libreoffice --headless --convert-to pdf output.docx
   ```

### Apply Brand Colors to Markdown

For Markdown outputs that will be rendered (e.g., in VitePress or GitHub):
- No post-processing needed — the rendering platform handles styling
- If generating standalone HTML, inject brand CSS from charter colors/fonts

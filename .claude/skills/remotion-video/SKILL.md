---
name: remotion-video
description: Create animated videos using Remotion (React-based video framework) with optional company branding from charter.json. Provides branded components, animation utilities, chart/diagram primitives, and a scaffold-to-render workflow. Use when creating videos, explainer animations, data visualizations, or corporate presentations in video format.
---

# Remotion Video

Create animated videos using [Remotion](https://www.remotion.dev/) with optional company branding. Provides pre-built components, animation utilities, and a scaffold-to-render workflow.

## Output Location

**Default**: `<projectRoot>/out/` — Remotion convention, triggered by `.remotion-project` marker.
**Override**: If the prompt specifies a target output directory, use that path for the render `--output` flag.



## When to Use

- Creating **animated videos** — explainers, corporate presentations, data visualizations
- Building **branded video content** for a company with a charter in `client-data/clients/`
- Any task involving Remotion composition, rendering, or animation

**When NOT to use:** For static PowerPoint output, the `pptx` skill is more appropriate. For simple GIF/image generation, use other tools.

## Workflow

### Step 1: Discover Brand

```
CHECK: Does client-data/clients/ exist?
  └── One company (excluding _example) → use it automatically
  └── Multiple → ask user which company
  └── None → scaffold generic (unbranded) project
READ: client-data/clients/<name>/charter.json
  └── Extract colors, fonts, logo paths, video settings (resolution, fps)
  └── Extract formatting rules (accentCycleColors, autoContrastText)
READ: client-data/clients/<name>/profile.json
  └── Extract company.name, company.tagline for title cards
CHECK: client-data/clients/<name>/images/
  └── Discover brand photography for background scenes, intro/outro cards
FALLBACK: Generic theme with system fonts and neutral palette
```

### Step 2: Scaffold Project

```bash
node .claude/skills/remotion-video/scripts/scaffold.js workspace/my-video
node .claude/skills/remotion-video/scripts/scaffold.js workspace/my-video --company dukestrategies
```

This creates a complete project with branded components, theme, and a starter `Root.tsx`. The scaffold writes a `.remotion-project` marker file.

#### Brand images
When a brand directory has an `images/` subdirectory, use brand photography for:
- **Background scenes** — full-bleed behind text overlays
- **Intro/outro cards** — opening and closing visual frames

List available images with `ls client-data/clients/<name>/images/` and choose photos that match each scene's topic.

#### Company identity
If `profile.json` exists, use `company.name` and `company.tagline` for title cards and closing frames instead of hardcoding text.

#### Formatting rules
If the charter has a `formatting` section:
- **`accentCycleColors`**: Map to `theme.accentCycle` for multi-element accent coloring (e.g. cycling bar colors, icon highlights).
- **`autoContrastText`**: Auto-select white or dark text when placing text on colored backgrounds.
- **`headingThreshold`** does NOT apply to Remotion — component-driven sizing replaces pt-based thresholds.

### Step 3: Create Scenes

Create scene files in `src/scenes/`. Each scene uses branded primitives from the theme:

```tsx
import React from "react";
import { useCurrentFrame } from "remotion";
import { SlideFrame, HeadingText, SectionLabel } from "../components/branded";
import { FadeReveal, TypewriterText } from "../components/animations";
import { CoralBar } from "../components/branded";
import { theme } from "../theme";

export const TitleCard: React.FC = () => {
  return (
    <SlideFrame>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
        <FadeReveal startFrame={10}>
          <SectionLabel>Company Name</SectionLabel>
        </FadeReveal>
        <HeadingText size={56} style={{ textAlign: "center", marginTop: 20 }}>
          <TypewriterText text="Your Video Title" startFrame={20} charsPerFrame={1} />
        </HeadingText>
      </div>
      <CoralBar startFrame={80} />
    </SlideFrame>
  );
};
```

### Step 4: Assemble with TransitionSeries

```tsx
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

// IMPORTANT: No React.Fragment wrappers inside TransitionSeries
export const MyVideo: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={150}>
        <TitleCard />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence durationInFrames={240}>
        <ContentScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
```

### Step 5: Register in Root.tsx

```tsx
import { Composition, registerRoot } from "remotion";
import { MyVideo } from "./MyVideo";
import { theme } from "./theme";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="MyVideo"
      component={MyVideo}
      durationInFrames={TOTAL_FRAMES}
      fps={theme.fps}
      width={theme.width}
      height={theme.height}
    />
  </>
);

registerRoot(RemotionRoot);  // REQUIRED for CLI render
```

### Step 6: Preview & Render

```bash
cd workspace/my-video
npx remotion render src/Root.tsx MyVideo out/video.mp4 --frames=0-30  # Test first
npx remotion studio src/Root.tsx          # Preview in browser
npx remotion render src/Root.tsx MyVideo out/video.mp4  # Final render
```

## Available Components

### Branded (`components/branded/`)

| Component | Props | Description |
|-----------|-------|-------------|
| `SlideFrame` | `background?`, `padding?` | Full-screen container with brand defaults |
| `Logo` | `size?`, `variant?: "color"\|"white"\|"grey"` | Brand logo (reads from `public/`) |
| `CoralBar` | `startFrame?`, `position?: "top"\|"bottom"` | Animated gradient bar |
| `HeadingText` | `size?`, `color?` | Heading with brand font |
| `BodyText` | `size?`, `color?` | Body text with brand font |
| `SectionLabel` | `color?` | Uppercase label (e.g. "Phase 1") |

### Animations (`components/animations/`)

| Component | Props | Description |
|-----------|-------|-------------|
| `FadeReveal` | `startFrame?`, `duration?` | Fade + slide-up reveal |
| `StaggeredList` | `items`, `startFrame?`, `staggerFrames?` | List with staggered fade-in |
| `CountUp` | `target`, `startFrame?`, `decimals?`, `suffix?` | Animated number counter |
| `TypewriterText` | `text`, `startFrame?`, `charsPerFrame?` | Character-by-character typing |
| `ProgressBar` | `progress`, `startFrame?`, `label?`, `showPercentage?` | Horizontal fill bar |
| `PulseCircle` | `size?`, `color?`, `label?` | Gently pulsing indicator |

### Diagrams (`components/diagrams/`)

| Component | Props | Description |
|-----------|-------|-------------|
| `FlowArrow` | `startFrame?`, `width?`, `direction?` | Animated connector arrow |
| `MatrixGrid` | `rows`, `cols`, `data`, `startFrame?` | Heatmap matrix with row-by-row reveal |
| `ProbabilityGauge` | `value`, `startFrame?`, `label?` | Half-circle probability gauge |
| `DriverRadar` | `labels`, `values`, `startFrame?` | Animated radar/pentagon chart |
| `FormulaSteps` | `steps`, `startFrame?` | Cascading formula steps |
| `EvidenceLedger` | `items`, `startFrame?` | Animated key-value panel |

### Charts (`components/charts/`)

| Component | Props | Description |
|-----------|-------|-------------|
| `BarChart` | `data`, `startFrame?`, `maxValue?`, `suffix?` | Horizontal bar chart |
| `HeatMap` | `data`, `rowLabels`, `colLabels`, `startFrame?` | Heatmap with legend |

### Animation Library (`lib/animations.ts`)

| Function | Returns | Description |
|----------|---------|-------------|
| `springIn({ frame, fps, delay? })` | `number` | Corporate spring (damping: 200, no bounce) |
| `fadeInUp(frame, startFrame, duration?)` | `{ opacity, translateY }` | Fade + slide-up |
| `staggerDelay(index, baseDelay?)` | `number` | Stagger offset for item at index |
| `heatmapColor(score, maxScore?)` | `string` | Brand heatmap color for score |
| `typewriterProgress(frame, start, length, speed?)` | `number` | Characters to show |
| `sweepProgress(frame, start, duration?)` | `number` | 0→1 sweep for bars |
| `pulseScale(frame, fps, speed?)` | `number` | Gentle pulsing scale |
| `countUpValue(frame, start, duration, target)` | `number` | Animated count value |

## Animation Guidelines

- All animations driven by `useCurrentFrame()` — **never CSS transitions**
- Springs use `{ damping: 200 }` for smooth corporate motion (no bounce)
- All `interpolate()` calls must use `extrapolateRight: "clamp"`
- Standard fade transition: `15 frames` with `linearTiming`
- Standard stagger delay: `8-15 frames` between items

## Duration Calculation

Total frames = sum of all scene frames - (number of transitions x transition duration).

```
scenes:      150 + 240 + 300 = 690
transitions: 2 x 15 = 30
total:       690 - 30 = 660 frames = 22 seconds at 30fps
```

## Updating Brand

If the charter changes, regenerate `theme.ts`:

```bash
node .claude/skills/remotion-video/scripts/sync-from-charter.js
node .claude/skills/remotion-video/scripts/sync-from-charter.js --company <name>
```

Then re-scaffold existing projects to pick up the new theme.

## Important Rules

1. **Always use the scaffold script** — don't set up projects from scratch
2. **Always call `registerRoot()`** in Root.tsx — required for CLI render
3. **Import `fade` from `@remotion/transitions/fade`** — not from `@remotion/transitions`
4. **No React.Fragment wrappers** inside `<TransitionSeries>` — use explicit inline children only
5. **Test render with `--frames=0-30`** before full render to catch errors early
6. **All text uses brand fonts** — read from `theme.fonts`, never hardcode

## Known Issues

### Studio crash: `Cannot read properties of null (reading 'stack')`

Remotion <= 4.0.424 has a bug in its Studio-only createElement proxy. **Fix both files:**

```bash
sed -i '' 's/const newProps = props\.stack/const newProps = props\?.stack/' \
  node_modules/remotion/dist/esm/index.mjs
sed -i '' 's/const newProps = props\.stack/const newProps = (props != null \&\& props.stack)/' \
  node_modules/remotion/dist/cjs/enable-sequence-stack-traces.js
rm -rf node_modules/.cache
```

Re-apply after `npm install`.

## Remotion API References

Load these on demand for detailed API patterns — do not read all at once.

| Topic | File | When to Load |
|-------|------|-------------|
| Animations | [references/animations.md](references/animations.md) | When building frame-based animations |
| Transitions | [references/transitions.md](references/transitions.md) | When wiring scene transitions |
| Charts | [references/charts.md](references/charts.md) | When creating data visualizations |
| Text animations | [references/text-animations.md](references/text-animations.md) | When animating text (typewriter, highlight) |
| Sequencing | [references/sequencing.md](references/sequencing.md) | When timing and ordering clips |
| Timing | [references/timing.md](references/timing.md) | When tuning easing curves and springs |
| Audio | [references/audio.md](references/audio.md) | When adding sound/music |
| Subtitles | [references/subtitles.md](references/subtitles.md) | When dealing with captions or subtitles |
| Fonts | [references/fonts.md](references/fonts.md) | When loading custom fonts |
| Images | [references/images.md](references/images.md) | When embedding static images |
| Videos | [references/videos.md](references/videos.md) | When embedding video clips |
| Assets | [references/assets.md](references/assets.md) | When importing various asset types |
| Compositions | [references/compositions.md](references/compositions.md) | When defining compositions and stills |
| Parameters | [references/parameters.md](references/parameters.md) | When making videos parametrizable with Zod |
| Calculate metadata | [references/calculate-metadata.md](references/calculate-metadata.md) | When dynamically setting duration/dimensions |
| 3D | [references/3d.md](references/3d.md) | When using Three.js / React Three Fiber |
| GIFs | [references/gifs.md](references/gifs.md) | When displaying synchronized GIFs |
| Lottie | [references/lottie.md](references/lottie.md) | When embedding Lottie animations |
| Maps | [references/maps.md](references/maps.md) | When adding Mapbox maps |
| Tailwind | [references/tailwind.md](references/tailwind.md) | When using TailwindCSS in Remotion |
| Trimming | [references/trimming.md](references/trimming.md) | When cutting animation start/end |
| Transparent video | [references/transparent-videos.md](references/transparent-videos.md) | When rendering with transparency |
| Light leaks | [references/light-leaks.md](references/light-leaks.md) | When adding light leak overlays |
| Measuring text | [references/measuring-text.md](references/measuring-text.md) | When fitting text to containers |
| Measuring DOM | [references/measuring-dom-nodes.md](references/measuring-dom-nodes.md) | When measuring element dimensions |
| Video duration | [references/get-video-duration.md](references/get-video-duration.md) | When getting video file duration |
| Video dimensions | [references/get-video-dimensions.md](references/get-video-dimensions.md) | When getting video dimensions |
| Audio duration | [references/get-audio-duration.md](references/get-audio-duration.md) | When getting audio file duration |
| Extract frames | [references/extract-frames.md](references/extract-frames.md) | When extracting frames from video |
| Can decode | [references/can-decode.md](references/can-decode.md) | When checking browser decode support |

## Dependencies

```bash
npm install remotion @remotion/cli @remotion/transitions @remotion/paths
```

import { interpolate, spring, Easing } from "remotion";

/** Corporate spring-in: smooth, no bounce (damping: 200). */
export function springIn({
  frame,
  fps,
  delay = 0,
}: {
  frame: number;
  fps: number;
  delay?: number;
}): number {
  return spring({
    frame: frame - delay,
    fps,
    config: { damping: 200, stiffness: 100, mass: 0.5 },
  });
}

/** Fade + slide-up reveal. Returns opacity and translateY. */
export function fadeInUp(
  frame: number,
  startFrame: number,
  duration = 20
): { opacity: number; translateY: number } {
  const opacity = interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const translateY = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [30, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp", easing: Easing.out(Easing.cubic) }
  );
  return { opacity, translateY };
}

/** Stagger delay for item at index. */
export function staggerDelay(index: number, baseDelay = 8): number {
  return index * baseDelay;
}

/** Map a 0–max score to a heatmap color from the brand palette. */
export function heatmapColor(score: number, maxScore = 5): string {
  const colors = ["#F5F5F5", "#FFE0D9", "#FFBFB0", "#FF9F87", "#FF7F66", "#F3755E"];
  const idx = Math.round((score / maxScore) * (colors.length - 1));
  return colors[Math.max(0, Math.min(idx, colors.length - 1))];
}

/** Typewriter: returns how many characters to show. */
export function typewriterProgress(
  frame: number,
  startFrame: number,
  textLength: number,
  charsPerFrame = 0.8
): number {
  const elapsed = Math.max(0, frame - startFrame);
  return Math.min(Math.floor(elapsed * charsPerFrame), textLength);
}

/** Horizontal sweep progress (0→1) for bars/lines. */
export function sweepProgress(
  frame: number,
  startFrame: number,
  duration = 30
): number {
  return interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
}

/** Gentle pulsing scale (1 ± 0.05). */
export function pulseScale(frame: number, fps: number, speed = 1): number {
  return 1 + 0.05 * Math.sin((frame / fps) * Math.PI * 2 * speed);
}

/** Animated count from 0 to target. */
export function countUpValue(
  frame: number,
  startFrame: number,
  duration: number,
  targetValue: number
): number {
  const progress = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp", easing: Easing.out(Easing.cubic) }
  );
  return Math.round(progress * targetValue);
}

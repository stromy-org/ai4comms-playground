import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { theme } from "../../theme";

/** Horizontal progress bar that fills from 0 to target. */
export const ProgressBar: React.FC<{
  progress: number;
  startFrame?: number;
  duration?: number;
  width?: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  label?: string;
  showPercentage?: boolean;
  style?: React.CSSProperties;
}> = ({
  progress, startFrame = 0, duration = 30, width = 400, height = 24,
  color = theme.colors.primary, backgroundColor = theme.colors.secondary,
  label, showPercentage = false, style,
}) => {
  const frame = useCurrentFrame();
  const animatedProgress = interpolate(
    frame, [startFrame, startFrame + duration], [0, progress],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, ...style }}>
      {label && (
        <span style={{ fontFamily: theme.fonts.body, fontSize: 16, color: theme.colors.text, minWidth: 140 }}>
          {label}
        </span>
      )}
      <div style={{ width, height, backgroundColor, borderRadius: height / 2, overflow: "hidden" }}>
        <div style={{ width: `${animatedProgress * 100}%`, height: "100%", backgroundColor: color, borderRadius: height / 2 }} />
      </div>
      {showPercentage && (
        <span style={{ fontFamily: theme.fonts.heading, fontSize: 16, fontWeight: 700, color: theme.colors.textDark, minWidth: 48 }}>
          {Math.round(animatedProgress * 100)}%
        </span>
      )}
    </div>
  );
};

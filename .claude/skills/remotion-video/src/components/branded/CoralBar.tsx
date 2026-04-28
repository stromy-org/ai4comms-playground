import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { sweepProgress } from "../../lib/animations";

/** Animated gradient bar that sweeps across an edge. */
export const CoralBar: React.FC<{
  startFrame?: number;
  width?: number;
  height?: number;
  position?: "top" | "bottom";
}> = ({ startFrame = 0, width = 1920, height = 6, position = "bottom" }) => {
  const frame = useCurrentFrame();
  const progress = sweepProgress(frame, startFrame, 30);

  return (
    <div
      style={{
        position: "absolute",
        [position]: 0,
        left: 0,
        width: width * progress,
        height,
        background: `linear-gradient(90deg, ${theme.colors.gradientStart}, ${theme.colors.gradientEnd})`,
      }}
    />
  );
};

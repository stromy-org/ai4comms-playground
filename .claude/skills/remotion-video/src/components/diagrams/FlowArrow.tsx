import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { theme } from "../../theme";

/** Animated arrow connector (horizontal or vertical). */
export const FlowArrow: React.FC<{
  startFrame?: number;
  width?: number;
  color?: string;
  direction?: "right" | "down";
  style?: React.CSSProperties;
}> = ({ startFrame = 0, width = 60, color = theme.colors.secondary, direction = "right", style }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
    extrapolateRight: "clamp", extrapolateLeft: "clamp", easing: Easing.out(Easing.cubic),
  });
  const isRight = direction === "right";
  const arrowSize = 10;

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", opacity: progress,
      ...(isRight ? { width, height: 20 } : { width: 20, height: width }), ...style }}>
      <svg width={isRight ? width : 20} height={isRight ? 20 : width}
        viewBox={isRight ? `0 0 ${width} 20` : `0 0 20 ${width}`}>
        {isRight ? (
          <>
            <line x1={0} y1={10} x2={width - arrowSize} y2={10} stroke={color} strokeWidth={2}
              strokeDasharray={`${(width - arrowSize) * progress} ${width}`} />
            <polygon points={`${width - arrowSize},4 ${width},10 ${width - arrowSize},16`} fill={color} opacity={progress} />
          </>
        ) : (
          <>
            <line x1={10} y1={0} x2={10} y2={width - arrowSize} stroke={color} strokeWidth={2}
              strokeDasharray={`${(width - arrowSize) * progress} ${width}`} />
            <polygon points={`4,${width - arrowSize} 10,${width} 16,${width - arrowSize}`} fill={color} opacity={progress} />
          </>
        )}
      </svg>
    </div>
  );
};

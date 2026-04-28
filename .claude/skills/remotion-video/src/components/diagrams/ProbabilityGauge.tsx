import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { theme } from "../../theme";

/** Half-circle gauge that fills to a probability value (0–1). */
export const ProbabilityGauge: React.FC<{
  value: number;
  startFrame?: number;
  size?: number;
  label?: string;
}> = ({ value, startFrame = 0, size = 200, label }) => {
  const frame = useCurrentFrame();
  const animatedValue = interpolate(frame, [startFrame, startFrame + 45], [0, value], {
    extrapolateRight: "clamp", extrapolateLeft: "clamp", easing: Easing.out(Easing.cubic),
  });

  const radius = size / 2 - 20;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference * (1 - animatedValue);
  const cx = size / 2;
  const cy = size / 2 + 10;

  const getColor = (v: number) => {
    if (v >= 0.7) return theme.colors.success;
    if (v >= 0.5) return theme.colors.primary;
    return theme.colors.warning;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width={size} height={size * 0.65}>
        <path d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none" stroke={theme.colors.secondary} strokeWidth={16} strokeLinecap="round" />
        <path d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none" stroke={getColor(animatedValue)} strokeWidth={16} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} />
        <text x={cx} y={cy - 10} textAnchor="middle"
          style={{ fontFamily: theme.fonts.heading, fontSize: 36, fontWeight: 700, fill: theme.colors.textDark }}>
          {Math.round(animatedValue * 100)}%
        </text>
      </svg>
      {label && (
        <div style={{ fontFamily: theme.fonts.body, fontSize: 14, color: theme.colors.text, marginTop: -10 }}>{label}</div>
      )}
    </div>
  );
};

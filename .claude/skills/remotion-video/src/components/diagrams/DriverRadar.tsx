import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { theme } from "../../theme";
import { staggerDelay } from "../../lib/animations";

/** Animated radar/pentagon chart. */
export const DriverRadar: React.FC<{
  labels: string[];
  values: number[];
  maxValue?: number;
  startFrame?: number;
  size?: number;
}> = ({ labels, values, maxValue = 5, startFrame = 0, size = 320 }) => {
  const frame = useCurrentFrame();
  const n = labels.length;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 50;

  const getPoint = (index: number, r: number) => {
    const angle = (Math.PI * 2 * index) / n - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const outlineProgress = interpolate(frame, [startFrame, startFrame + 30], [0, 1], {
    extrapolateRight: "clamp", extrapolateLeft: "clamp", easing: Easing.out(Easing.cubic),
  });
  const fillProgress = interpolate(frame, [startFrame + 20, startFrame + 50], [0, 1], {
    extrapolateRight: "clamp", extrapolateLeft: "clamp", easing: Easing.out(Easing.cubic),
  });

  const outlinePoints = Array.from({ length: n }, (_, i) => getPoint(i, radius));
  const outlinePath = outlinePoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
  const dataPoints = values.map((v, i) => getPoint(i, (v / maxValue) * radius * fillProgress));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
  const rings = [0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {rings.map((r, i) => {
        const ringPoints = Array.from({ length: n }, (_, j) => getPoint(j, radius * r));
        const ringPath = ringPoints.map((p, j) => `${j === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
        return <path key={i} d={ringPath} fill="none" stroke={theme.colors.secondary} strokeWidth={1} opacity={outlineProgress * 0.5} />;
      })}
      {outlinePoints.map((p, i) => (
        <line key={`axis-${i}`} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={theme.colors.secondary} strokeWidth={1} opacity={outlineProgress * 0.5} />
      ))}
      <path d={outlinePath} fill="none" stroke={theme.colors.primary} strokeWidth={2} opacity={outlineProgress} strokeDasharray={`${outlineProgress * 2000} 2000`} />
      <path d={dataPath} fill={theme.colors.primary} fillOpacity={0.2 * fillProgress} stroke={theme.colors.primary} strokeWidth={2} opacity={fillProgress} />
      {dataPoints.map((p, i) => (
        <circle key={`dot-${i}`} cx={p.x} cy={p.y} r={4} fill={theme.colors.primary} opacity={fillProgress} />
      ))}
      {labels.map((label, i) => {
        const delay = startFrame + 30 + staggerDelay(i, 6);
        const labelOpacity = interpolate(frame, [delay, delay + 12], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
        const p = getPoint(i, radius + 30);
        return (
          <text key={`label-${i}`} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
            style={{ fontFamily: theme.fonts.heading, fontSize: 13, fontWeight: 700, fill: theme.colors.textDark }} opacity={labelOpacity}>
            {label}
          </text>
        );
      })}
    </svg>
  );
};

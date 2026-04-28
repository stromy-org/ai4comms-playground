import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { theme } from "../../theme";
import { heatmapColor, staggerDelay } from "../../lib/animations";

/** Animated heatmap grid with color legend. */
export const HeatMap: React.FC<{
  data: number[][];
  rowLabels: string[];
  colLabels: string[];
  startFrame?: number;
  cellSize?: number;
}> = ({ data, rowLabels, colLabels, startFrame = 0, cellSize = 60 }) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ display: "inline-flex", flexDirection: "column" }}>
      <div style={{ display: "flex", marginLeft: 140, marginBottom: 4 }}>
        {colLabels.map((label, ci) => (
          <div key={ci} style={{ width: cellSize, textAlign: "center", fontFamily: theme.fonts.heading, fontSize: 11, fontWeight: 700, color: theme.colors.textDark, margin: 1 }}>
            {label}
          </div>
        ))}
      </div>
      {data.map((row, ri) => {
        const rowDelay = startFrame + staggerDelay(ri, 8);
        const rowOpacity = interpolate(frame, [rowDelay, rowDelay + 10], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
        return (
          <div key={ri} style={{ display: "flex", alignItems: "center", opacity: rowOpacity }}>
            <div style={{ width: 140, fontFamily: theme.fonts.body, fontSize: 12, color: theme.colors.text, paddingRight: 8 }}>{rowLabels[ri]}</div>
            {row.map((value, ci) => {
              const cellDelay = rowDelay + staggerDelay(ci, 4);
              const cellProgress = interpolate(frame, [cellDelay, cellDelay + 10], [0, 1], {
                extrapolateRight: "clamp", extrapolateLeft: "clamp", easing: Easing.out(Easing.cubic),
              });
              return (
                <div key={ci} style={{ width: cellSize, height: cellSize, margin: 1, borderRadius: 4, backgroundColor: heatmapColor(value),
                  display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${cellProgress})` }}>
                  {cellProgress > 0.5 && (
                    <span style={{ fontFamily: theme.fonts.heading, fontSize: 16, fontWeight: 700, color: value >= 4 ? "#fff" : theme.colors.textDark }}>{value}</span>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
      <div style={{ display: "flex", gap: 8, marginLeft: 140, marginTop: 12, alignItems: "center" }}>
        <span style={{ fontFamily: theme.fonts.body, fontSize: 11, color: theme.colors.text }}>Low</span>
        {[1, 2, 3, 4, 5].map((v) => (
          <div key={v} style={{ width: 20, height: 12, backgroundColor: heatmapColor(v), borderRadius: 2 }} />
        ))}
        <span style={{ fontFamily: theme.fonts.body, fontSize: 11, color: theme.colors.text }}>High</span>
      </div>
    </div>
  );
};

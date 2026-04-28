import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { theme } from "../../theme";
import { heatmapColor, staggerDelay } from "../../lib/animations";

/** Animated heatmap matrix with row-by-row reveal. */
export const MatrixGrid: React.FC<{
  rows: string[];
  cols: string[];
  data: number[][];
  startFrame?: number;
  showValues?: boolean;
  cellSize?: number;
  headerWidth?: number;
}> = ({ rows, cols, data, startFrame = 0, showValues = true, cellSize = 70, headerWidth = 160 }) => {
  const frame = useCurrentFrame();
  const headerProgress = interpolate(frame, [startFrame, startFrame + 20], [0, 1], {
    extrapolateRight: "clamp", extrapolateLeft: "clamp", easing: Easing.out(Easing.cubic),
  });

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", marginLeft: headerWidth }}>
        {cols.map((col, ci) => {
          const delay = startFrame + staggerDelay(ci, 5);
          const opacity = interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
          return (
            <div key={ci} style={{ width: cellSize, height: 50, display: "flex", alignItems: "flex-end", justifyContent: "center",
              fontFamily: theme.fonts.heading, fontSize: 11, fontWeight: 700, color: theme.colors.textDark, textAlign: "center", opacity, paddingBottom: 8 }}>
              {col}
            </div>
          );
        })}
      </div>
      {rows.map((row, ri) => {
        const rowDelay = startFrame + 20 + staggerDelay(ri, 12);
        const rowOpacity = interpolate(frame, [rowDelay, rowDelay + 10], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
        return (
          <div key={ri} style={{ display: "flex", alignItems: "center", opacity: rowOpacity }}>
            <div style={{ width: headerWidth, height: cellSize, display: "flex", alignItems: "center",
              fontFamily: theme.fonts.body, fontSize: 13, color: theme.colors.textDark, paddingRight: 12,
              transform: `translateX(${(1 - headerProgress) * -30}px)` }}>
              {row}
            </div>
            {data[ri]?.map((value, ci) => {
              const cellDelay = rowDelay + staggerDelay(ci, 6);
              const cellScale = interpolate(frame, [cellDelay, cellDelay + 12], [0, 1], {
                extrapolateRight: "clamp", extrapolateLeft: "clamp", easing: Easing.out(Easing.cubic),
              });
              return (
                <div key={ci} style={{ width: cellSize, height: cellSize, display: "flex", alignItems: "center", justifyContent: "center",
                  margin: 1, backgroundColor: heatmapColor(value), borderRadius: 4, transform: `scale(${cellScale})` }}>
                  {showValues && cellScale > 0.5 && (
                    <span style={{ fontFamily: theme.fonts.heading, fontSize: 18, fontWeight: 700,
                      color: value >= 4 ? theme.colors.white : theme.colors.textDark }}>{value}</span>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

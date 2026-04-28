import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { theme } from "../../theme";
import { staggerDelay } from "../../lib/animations";

interface BarData { label: string; value: number; color?: string; }

/** Horizontal bar chart with staggered fill animation. */
export const BarChart: React.FC<{
  data: BarData[];
  startFrame?: number;
  maxValue?: number;
  barHeight?: number;
  width?: number;
  labelWidth?: number;
  showValues?: boolean;
  suffix?: string;
}> = ({ data, startFrame = 0, maxValue, barHeight = 32, width = 500, labelWidth = 160, showValues = true, suffix = "" }) => {
  const frame = useCurrentFrame();
  const max = maxValue ?? Math.max(...data.map((d) => d.value));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {data.map((item, i) => {
        const delay = startFrame + staggerDelay(i, 10);
        const barProgress = interpolate(frame, [delay, delay + 25], [0, 1], {
          extrapolateRight: "clamp", extrapolateLeft: "clamp", easing: Easing.out(Easing.cubic),
        });
        const opacity = interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
        const barWidth = (item.value / max) * width * barProgress;

        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, opacity }}>
            <div style={{ width: labelWidth, fontFamily: theme.fonts.body, fontSize: 14, color: theme.colors.text, textAlign: "right" }}>{item.label}</div>
            <div style={{ width, height: barHeight, backgroundColor: theme.colors.backgroundAlt, borderRadius: barHeight / 2, overflow: "hidden" }}>
              <div style={{ width: barWidth, height: "100%", backgroundColor: item.color || theme.colors.primary, borderRadius: barHeight / 2 }} />
            </div>
            {showValues && (
              <div style={{ fontFamily: theme.fonts.heading, fontSize: 16, fontWeight: 700, color: theme.colors.textDark, minWidth: 60 }}>
                {Math.round(item.value * barProgress)}{suffix}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

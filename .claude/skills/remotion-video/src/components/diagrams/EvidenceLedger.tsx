import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { theme } from "../../theme";
import { staggerDelay } from "../../lib/animations";

/** Animated key-value ledger panel. */
export const EvidenceLedger: React.FC<{
  title?: string;
  items: { label: string; count: number }[];
  startFrame?: number;
}> = ({ title = "Evidence Ledger", items, startFrame = 0 }) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: 20,
      backgroundColor: theme.colors.backgroundAlt, borderRadius: 12, border: `1px solid ${theme.colors.secondary}` }}>
      <div style={{ fontFamily: theme.fonts.heading, fontSize: 14, fontWeight: 700, color: theme.colors.primary,
        textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>{title}</div>
      {items.map((item, i) => {
        const delay = startFrame + staggerDelay(i, 8);
        const opacity = interpolate(frame, [delay, delay + 12], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
        const countValue = interpolate(frame, [delay, delay + 20], [0, item.count], {
          extrapolateRight: "clamp", extrapolateLeft: "clamp", easing: Easing.out(Easing.cubic),
        });
        return (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", opacity, padding: "4px 0" }}>
            <span style={{ fontFamily: theme.fonts.body, fontSize: 13, color: theme.colors.text }}>{item.label}</span>
            <span style={{ fontFamily: theme.fonts.heading, fontSize: 14, fontWeight: 700, color: theme.colors.primary }}>{Math.round(countValue)}</span>
          </div>
        );
      })}
    </div>
  );
};

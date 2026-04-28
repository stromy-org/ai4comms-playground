import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { theme } from "../../theme";
import { staggerDelay } from "../../lib/animations";

interface FormulaStep {
  label: string;
  description: string;
  formula: string;
}

/** Cascading formula steps with numbered circles and connecting lines. */
export const FormulaSteps: React.FC<{
  steps: FormulaStep[];
  startFrame?: number;
}> = ({ steps, startFrame = 0 }) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
      {steps.map((step, i) => {
        const delay = startFrame + staggerDelay(i, 20);
        const progress = interpolate(frame, [delay, delay + 18], [0, 1], {
          extrapolateRight: "clamp", extrapolateLeft: "clamp", easing: Easing.out(Easing.cubic),
        });
        const translateX = interpolate(frame, [delay, delay + 18], [-40, 0], {
          extrapolateRight: "clamp", extrapolateLeft: "clamp", easing: Easing.out(Easing.cubic),
        });
        const isLast = i === steps.length - 1;
        const lineProgress = !isLast ? interpolate(frame, [delay + 12, delay + 25], [0, 1], {
          extrapolateRight: "clamp", extrapolateLeft: "clamp",
        }) : 0;

        return (
          <div key={i} style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, opacity: progress, transform: `translateX(${translateX}px)` }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%",
                backgroundColor: isLast ? theme.colors.primary : theme.colors.backgroundAlt,
                border: `2px solid ${theme.colors.primary}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: theme.fonts.heading, fontSize: 16, fontWeight: 700,
                color: isLast ? theme.colors.white : theme.colors.primary, flexShrink: 0 }}>
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: theme.fonts.heading, fontSize: 18, fontWeight: 700, color: theme.colors.textDark }}>{step.label}</div>
                <div style={{ fontFamily: theme.fonts.body, fontSize: 14, color: theme.colors.text }}>{step.description}</div>
              </div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: isLast ? 28 : 20,
                color: isLast ? theme.colors.primary : theme.colors.textDark,
                fontWeight: isLast ? 700 : 400, fontStyle: "italic", minWidth: 140, textAlign: "right" }}>
                {step.formula}
              </div>
            </div>
            {!isLast && (
              <div style={{ position: "absolute", left: 19, top: 42, width: 2, height: 8 * lineProgress, backgroundColor: theme.colors.secondary }} />
            )}
          </div>
        );
      })}
    </div>
  );
};

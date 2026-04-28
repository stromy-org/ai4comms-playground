import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { pulseScale } from "../../lib/animations";
import { theme } from "../../theme";

/** Gently pulsing circle indicator. */
export const PulseCircle: React.FC<{
  size?: number;
  color?: string;
  label?: string;
  style?: React.CSSProperties;
}> = ({ size = 40, color = theme.colors.primary, label, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = pulseScale(frame, fps);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8, ...style }}>
      <div
        style={{
          width: size, height: size, borderRadius: "50%", backgroundColor: color,
          transform: `scale(${scale})`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        {label && (
          <span style={{ color: "white", fontFamily: theme.fonts.heading, fontWeight: 700, fontSize: size * 0.4 }}>
            {label}
          </span>
        )}
      </div>
    </div>
  );
};

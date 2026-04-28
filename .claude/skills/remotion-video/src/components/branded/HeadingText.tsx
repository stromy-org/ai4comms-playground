import React from "react";
import { theme } from "../../theme";

/** Brand heading (Tahoma Bold). */
export const HeadingText: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, size = 48, color = theme.colors.textDark, style }) => (
  <div
    style={{
      fontFamily: theme.fonts.heading,
      fontWeight: theme.fontWeights.bold,
      fontSize: size,
      color,
      lineHeight: 1.2,
      ...style,
    }}
  >
    {children}
  </div>
);

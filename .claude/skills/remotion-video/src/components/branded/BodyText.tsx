import React from "react";
import { theme } from "../../theme";

/** Brand body text (Verdana Normal). */
export const BodyText: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, size = 24, color = theme.colors.text, style }) => (
  <div
    style={{
      fontFamily: theme.fonts.body,
      fontWeight: theme.fontWeights.normal,
      fontSize: size,
      color,
      lineHeight: 1.6,
      ...style,
    }}
  >
    {children}
  </div>
);

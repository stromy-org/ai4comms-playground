import React from "react";
import { theme } from "../../theme";

/** Uppercase section label in primary color. */
export const SectionLabel: React.FC<{
  children: React.ReactNode;
  color?: string;
}> = ({ children, color = theme.colors.primary }) => (
  <div
    style={{
      fontFamily: theme.fonts.heading,
      fontWeight: theme.fontWeights.bold,
      fontSize: 16,
      color,
      textTransform: "uppercase",
      letterSpacing: 3,
      marginBottom: theme.spacing.sm,
    }}
  >
    {children}
  </div>
);

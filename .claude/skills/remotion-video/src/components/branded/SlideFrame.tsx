import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../../theme";

/** Full-screen slide container with brand background and padding. */
export const SlideFrame: React.FC<{
  children: React.ReactNode;
  background?: string;
  padding?: number;
}> = ({ children, background = theme.colors.background, padding = theme.spacing.xl }) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: background,
        padding,
        fontFamily: theme.fonts.body,
        color: theme.colors.text,
        overflow: "hidden",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

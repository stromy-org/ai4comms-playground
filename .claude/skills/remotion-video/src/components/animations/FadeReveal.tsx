import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeInUp } from "../../lib/animations";

/** Fade + slide-up reveal wrapper. */
export const FadeReveal: React.FC<{
  children: React.ReactNode;
  startFrame?: number;
  duration?: number;
  style?: React.CSSProperties;
}> = ({ children, startFrame = 0, duration = 20, style }) => {
  const frame = useCurrentFrame();
  const { opacity, translateY } = fadeInUp(frame, startFrame, duration);

  return (
    <div style={{ opacity, transform: `translateY(${translateY}px)`, ...style }}>
      {children}
    </div>
  );
};

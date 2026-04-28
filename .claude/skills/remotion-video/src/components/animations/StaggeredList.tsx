import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeInUp, staggerDelay } from "../../lib/animations";

/** Render a list of items with staggered fade-in. */
export const StaggeredList: React.FC<{
  items: React.ReactNode[];
  startFrame?: number;
  staggerFrames?: number;
  style?: React.CSSProperties;
  itemStyle?: React.CSSProperties;
}> = ({ items, startFrame = 0, staggerFrames = 10, style, itemStyle }) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, ...style }}>
      {items.map((item, i) => {
        const delay = startFrame + staggerDelay(i, staggerFrames);
        const { opacity, translateY } = fadeInUp(frame, delay, 15);
        return (
          <div key={i} style={{ opacity, transform: `translateY(${translateY}px)`, ...itemStyle }}>
            {item}
          </div>
        );
      })}
    </div>
  );
};

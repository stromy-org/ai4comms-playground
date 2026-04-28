import React from "react";
import { useCurrentFrame } from "remotion";
import { typewriterProgress } from "../../lib/animations";
import { theme } from "../../theme";

/** Text that types itself character by character. */
export const TypewriterText: React.FC<{
  text: string;
  startFrame?: number;
  charsPerFrame?: number;
  style?: React.CSSProperties;
  cursorColor?: string;
}> = ({ text, startFrame = 0, charsPerFrame = 0.8, style, cursorColor = theme.colors.primary }) => {
  const frame = useCurrentFrame();
  const charCount = typewriterProgress(frame, startFrame, text.length, charsPerFrame);
  const displayText = text.slice(0, charCount);
  const showCursor = charCount < text.length;

  return (
    <span style={style}>
      {displayText}
      {showCursor && (
        <span style={{ color: cursorColor, opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0 }}>|</span>
      )}
    </span>
  );
};

import React from "react";
import { useCurrentFrame } from "remotion";
import { countUpValue } from "../../lib/animations";

/** Animated number that counts from 0 to target. */
export const CountUp: React.FC<{
  target: number;
  startFrame?: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  style?: React.CSSProperties;
}> = ({ target, startFrame = 0, duration = 30, decimals = 0, suffix = "", prefix = "", style }) => {
  const frame = useCurrentFrame();
  const rawValue = countUpValue(frame, startFrame, duration, target * Math.pow(10, decimals));
  const displayValue = decimals > 0
    ? (rawValue / Math.pow(10, decimals)).toFixed(decimals)
    : rawValue.toString();

  return <span style={style}>{prefix}{displayValue}{suffix}</span>;
};

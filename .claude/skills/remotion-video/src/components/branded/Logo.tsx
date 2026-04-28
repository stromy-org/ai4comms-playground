import React from "react";
import { Img, staticFile } from "remotion";

/** Brand logo. Copy assets/*.png into public/ when scaffolding. */
export const Logo: React.FC<{
  size?: number;
  variant?: "color" | "white" | "grey";
  style?: React.CSSProperties;
}> = ({ size = 120, variant = "color", style }) => {
  const src =
    variant === "white"
      ? staticFile("logo_white.png")
      : variant === "grey"
        ? staticFile("logo_grey.svg")
        : staticFile("logo.png");

  return (
    <Img
      src={src}
      style={{ width: size, height: "auto", objectFit: "contain", ...style }}
    />
  );
};

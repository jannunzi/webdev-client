import { ReactNode } from "react";

export default function Box({
  children,
  borderStyle = "solid",
  borderColor = "black",
  borderWidth = 1,
  width,
  height,
  position = "static",
  padding = 0,
  margin = 0,
  borderRadius = 0,
  boxShadow = "none",
}: {
  children: ReactNode;
  borderStyle?: string;
  borderColor?: string;
  borderWidth?: number;
  width?: number;
  height?: number;
  position?: "static" | "relative";
  padding?: number;
  margin?: number;
  borderRadius?: number;
  boxShadow?: string;
}) {
  return (
    <div
      style={{
        borderStyle,
        borderColor,
        borderWidth,
        width,
        height,
        position,
        padding,
        margin,
        borderRadius,
        boxShadow,
      }}
    >
      {children}
    </div>
  );
}

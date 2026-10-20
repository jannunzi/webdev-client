import { ReactNode } from "react";

export default function Border({
  children,
  width,
  style = "solid",
  color = "black",
  radius = 0,
}: {
  children: ReactNode;
  width: number;
  style?: string;
  color?: string;
  radius?: number;
}) {
  return (
    <div
      style={{
        borderWidth: width,
        borderStyle: style,
        borderColor: color,
        borderRadius: radius,
        backgroundColor: "#FDDD9B",
      }}
    >
      {children}
    </div>
  );
}

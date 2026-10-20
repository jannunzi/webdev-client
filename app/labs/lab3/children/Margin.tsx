import { ReactNode } from "react";

export default function Margin({
  children,
  margin,
}: {
  children: ReactNode;
  margin: number;
}) {
  return <div style={{ margin, backgroundColor: "#F9CC9D" }}>{children}</div>;
}

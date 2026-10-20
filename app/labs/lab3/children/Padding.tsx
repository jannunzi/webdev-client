import { ReactNode } from "react";

export default function Padding({
  children,
  padding,
}: {
  children: ReactNode;
  padding: number;
}) {
  return <div style={{ padding, backgroundColor: "#C3D08B" }}>{children}</div>;
}

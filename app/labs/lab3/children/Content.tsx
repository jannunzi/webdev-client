import { ReactNode } from "react";

export default function Content({
  children,
  width,
  height,
}: {
  children: ReactNode;
  width: number;
  height: number;
}) {
  return (
    <div style={{ width, height, backgroundColor: "#8CB6C0" }}>{children}</div>
  );
}

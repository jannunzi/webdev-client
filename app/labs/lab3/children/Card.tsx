import { ReactNode } from "react";

export default function Card({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: 260,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 8,
        boxShadow: "2px 2px 6px lightgray",
        margin: 8,
      }}
    >
      {children}
    </div>
  );
}

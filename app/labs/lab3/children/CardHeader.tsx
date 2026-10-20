import { ReactNode } from "react";

export default function CardHeader({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        padding: 8,
        fontWeight: "bold",
        backgroundColor: "whitesmoke",
        borderBottom: "1px solid lightgray",
      }}
    >
      {children}
    </div>
  );
}

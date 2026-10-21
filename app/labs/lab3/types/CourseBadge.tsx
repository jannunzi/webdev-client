import type { ReactNode } from "react";

type Props = {
  number: string;
  credits?: number;
  children: ReactNode;
};

export default function CourseBadge({ number, credits = 4, children }: Props) {
  return (
    <div style={{ border: "1px solid gray", padding: "5px", margin: "5px" }}>
      <strong>{number}</strong> ({credits} credits): {children}
    </div>
  );
}

import { ReactNode } from "react";

export default function CardBody({ children }: { children: ReactNode }) {
  return <div style={{ padding: 8 }}>{children}</div>;
}

import type { ReactNode } from "react";
import GreenCheckmark from "./GreenCheckmark";

export default function Module({
  title,
  extra,
  children,
}: {
  title: ReactNode;
  extra?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <li className="wd-module mb-5 overflow-hidden border border-neutral-400 p-0 text-xl">
      <div className="wd-title flex items-center justify-between bg-neutral-200 p-3 ps-2">
        <span className="min-w-0 flex-1">{title}</span>
        <span className="ms-2 flex items-center gap-2">
          {extra}
          {!extra ? <GreenCheckmark /> : null}
        </span>
      </div>
      <ul className="wd-lessons m-0 list-none p-0">{children}</ul>
    </li>
  );
}

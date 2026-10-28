import type { ReactNode } from "react";
import { FaCheckCircle } from "react-icons/fa";

export default function Lesson({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <li className="wd-lesson border-l-[3px] border-green-600 p-3 pl-1">
      <div className="flex items-center justify-between">
        <span className="wd-title">{title}</span>
        <FaCheckCircle className="text-green-600" />
      </div>
      <ul className="wd-content mt-2 list-disc pl-6">{children}</ul>
    </li>
  );
}

import type { ReactNode } from "react";
import CourseChromeShell from "./CourseChromeShell";

export default function CourseInfoLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <CourseChromeShell mainClassName="min-w-0 px-4 py-8 sm:px-6">
      {children}
    </CourseChromeShell>
  );
}

import type { Metadata } from "next";
import type { ReactNode } from "react";
import CourseChromeShell from "@/app/course-info/CourseChromeShell";

export const metadata: Metadata = {
  title: "Slides — Web Dev",
  description:
    "Classroom slide decks grouped by book chapter and section — HTML, Kambaz, CSS, Tailwind, JavaScript, and Kambaz styling.",
};

export default function SlidesLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <CourseChromeShell>{children}</CourseChromeShell>;
}

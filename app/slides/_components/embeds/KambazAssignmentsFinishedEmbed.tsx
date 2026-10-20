"use client";

import { Suspense, use } from "react";
import AssignmentsFinished from "@/app/book/ch1/embeds/assignments-finished/Assignments";
import LectureDemoFrame from "./LectureDemoFrame";

/**
 * The 1.4.7 finished page exactly as the book lists it. It is an async server
 * page (it awaits `params`), so the slide awaits it once with `cid: "1234"`,
 * the same params the book's live demo passes, and renders the result.
 */
const rendered = AssignmentsFinished({ params: Promise.resolve({ cid: "1234" }) });

function Step() {
  return use(rendered);
}

export default function KambazAssignmentsFinishedEmbed() {
  return (
    <LectureDemoFrame
      label="app/(kambaz)/courses/[cid]/assignments/page.tsx"
      url="/courses/1234/assignments"
    >
      <div className="font-sans text-xl [&_a]:underline">
        <Suspense fallback={null}>
          <Step />
        </Suspense>
      </div>
    </LectureDemoFrame>
  );
}

"use client";

import { useRouter } from "next/navigation";
import {
  adjacentStaffStudentKeys,
  type StaffStudentRow,
} from "@/lib/assignments/staff";

export default function StaffGraderNav({
  assignmentId,
  queue,
  selectedKey,
}: {
  assignmentId: string;
  queue: StaffStudentRow[];
  selectedKey?: string;
}) {
  const router = useRouter();
  const { previous, next, index } = adjacentStaffStudentKeys(queue, selectedKey);
  const submitted = queue.filter((row) => row.hasSubmission).length;

  function go(key: string | null) {
    const base = `/assignments/${assignmentId}`;
    router.push(key ? `${base}?student=${encodeURIComponent(key)}` : base);
  }

  if (queue.length === 0) {
    return (
      <section className="mb-6 rounded-lg border border-neutral-300 bg-white p-4 font-sans shadow-sm">
        <h2 className="mt-0 mb-1 text-lg font-semibold">Staff grading</h2>
        <p className="mb-0 text-sm text-neutral-700">
          No roster students or A1 submissions are available yet.
        </p>
      </section>
    );
  }

  return (
    <section className="mb-6 rounded-lg border border-sky-300 bg-sky-50 p-4 font-sans shadow-sm">
      <h2 className="mt-0 mb-1 text-lg font-semibold text-sky-950">
        Staff grading
      </h2>
      <p className="mt-0 mb-3 text-sm text-sky-950">
        {submitted} of {queue.length} students have a submitted Vercel URL.
        {selectedKey
          ? ` Viewing ${index + 1} of ${queue.length}.`
          : " Select a student to review their deploy."}
      </p>
      <div className="flex flex-wrap items-end gap-2">
        <label className="min-w-[16rem] flex-1 text-sm font-semibold">
          Student
          <select
            className="mt-1 w-full rounded border border-neutral-400 bg-white px-3 py-2 font-normal"
            value={selectedKey ?? ""}
            onChange={(event) => go(event.target.value || null)}
          >
            <option value="">Your own checklist</option>
            {queue.map((row) => (
              <option key={row.key} value={row.key}>
                {row.name}
                {row.email && row.email !== row.name ? ` · ${row.email}` : ""}
                {row.section ? ` · ${row.section}` : ""}
                {row.hasSubmission ? "" : " · no submission"}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="rounded border border-neutral-800 bg-white px-3 py-2 text-sm hover:bg-neutral-50 disabled:opacity-50"
          disabled={!previous}
          onClick={() => go(previous)}
        >
          Previous
        </button>
        <button
          type="button"
          className="rounded border border-neutral-800 bg-white px-3 py-2 text-sm hover:bg-neutral-50 disabled:opacity-50"
          disabled={!next}
          onClick={() => go(next)}
        >
          Next
        </button>
      </div>
    </section>
  );
}

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DEMO_ROSTER_STUDENTS } from "@/lib/roster/demo-students";
import { ensureDemoStudents } from "../demo-actions";

export default function EnsureDemoStudents() {
  const router = useRouter();
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onEnsure() {
    setNote(null);
    setError(null);
    startTransition(async () => {
      const result = await ensureDemoStudents();
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setNote(
        `Saved ${result.upserts} demo student(s): ${result.emails.join(", ")}. Sign in with those emails to test A1.`,
      );
      router.refresh();
    });
  }

  return (
    <section className="mb-6 rounded-lg border border-neutral-300 bg-white p-4 font-sans shadow-sm">
      <h2 className="mt-0 mb-1 text-lg font-semibold tracking-tight">
        Demo students for A1 testing
      </h2>
      <p className="mt-0 text-sm text-neutral-800">
        Upserts two fake <code>canvas_roster</code> rows so staff can Sign up
        with those Northeastern emails and see the A1 GitHub / Vercel fields.
        Not real students.
      </p>
      <ul className="mb-3 text-sm text-neutral-800">
        {DEMO_ROSTER_STUDENTS.map((student) => (
          <li key={student.email}>
            {student.name} — {student.email} — {student.section}
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="rounded border border-neutral-800 bg-neutral-800 px-3 py-2 text-sm text-white hover:bg-neutral-700 disabled:opacity-60"
        disabled={pending}
        onClick={onEnsure}
      >
        {pending ? "Saving…" : "Ensure demo students"}
      </button>
      {note ? (
        <p className="mb-0 mt-2 text-sm text-emerald-800">{note}</p>
      ) : null}
      {error ? (
        <p className="mb-0 mt-2 text-sm text-amber-800">{error}</p>
      ) : null}
    </section>
  );
}

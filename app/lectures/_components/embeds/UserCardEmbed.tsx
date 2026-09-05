"use client";

import { useState } from "react";
import LectureDemoFrame from "./LectureDemoFrame";

const PEOPLE = [
  { name: "Ada", email: "ada@example.com" },
  { name: "Grace", email: "grace@example.com" },
] as const;

function User({ name, email }: { name: string; email: string }) {
  return (
    <div>
      <h2 className="mt-0 mb-2 font-sans text-3xl font-semibold">{name}</h2>
      <p className="mb-0 font-sans text-xl">{email}</p>
    </div>
  );
}

export default function UserCardEmbed() {
  const [index, setIndex] = useState(0);
  const person = PEOPLE[index] ?? PEOPLE[0];

  return (
    <LectureDemoFrame label="User.tsx — same component, different props">
      <User name={person.name} email={person.email} />
      <button
        type="button"
        className="mt-5 rounded border border-neutral-800 bg-white px-3 py-2 font-sans text-base"
        onClick={() => setIndex((current) => (current + 1) % PEOPLE.length)}
      >
        Next person
      </button>
    </LectureDemoFrame>
  );
}

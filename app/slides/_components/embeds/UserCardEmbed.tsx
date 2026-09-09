"use client";

import { useState } from "react";
import LectureDemoFrame from "./LectureDemoFrame";

const PEOPLE = [
  { username: "alice", first: "Alice", last: "Wonderland" },
  { username: "ada", first: "Ada", last: "Lovelace" },
] as const;

function User({
  username,
  first,
  last,
}: {
  username: string;
  first: string;
  last: string;
}) {
  return (
    <div>
      <p className="mb-1 font-sans text-xl">Username: {username}</p>
      <p className="mb-1 font-sans text-xl">First: {first}</p>
      <p className="mb-0 font-sans text-xl">Last: {last}</p>
    </div>
  );
}

export default function UserCardEmbed() {
  const [index, setIndex] = useState(0);
  const person = PEOPLE[index] ?? PEOPLE[0];

  return (
    <LectureDemoFrame label="User.tsx — same component, different data">
      <User username={person.username} first={person.first} last={person.last} />
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

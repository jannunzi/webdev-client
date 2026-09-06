"use client";

import { useState } from "react";
import LectureDemoFrame from "./LectureDemoFrame";

const SCREENS = [
  { href: "/labs", id: "wd-home-link", label: "Home" },
  { href: "/labs/lab1", id: "wd-lab1-link", label: "Lab 1" },
  { href: "/labs/lab2", id: "wd-lab2-link", label: "Lab 2" },
  { href: "/labs/lab3", id: "wd-lab3-link", label: "Lab 3" },
] as const;

type LabsRoute = (typeof SCREENS)[number]["href"];

function LabsPage() {
  return (
    <div id="wd-labs">
      <h1 className="mt-0 mb-2 font-sans text-2xl font-semibold">Labs</h1>
      <ul className="m-0 list-disc pl-5 font-sans text-lg">
        <li>Lab 1: HTML Examples</li>
        <li>Lab 2: CSS Basics</li>
        <li>Lab 3: JavaScript Fundamentals</li>
      </ul>
    </div>
  );
}

function LabStub({ id, title }: { id: string; title: string }) {
  return (
    <div id={id}>
      <h2 className="mt-0 mb-0 font-sans text-2xl font-semibold">{title}</h2>
    </div>
  );
}

function ChildrenFor(route: LabsRoute) {
  if (route === "/labs/lab1") return <LabStub id="wd-lab1" title="Lab 1" />;
  if (route === "/labs/lab2") return <LabStub id="wd-lab2" title="Lab 2" />;
  if (route === "/labs/lab3") return <LabStub id="wd-lab3" title="Lab 3" />;
  return <LabsPage />;
}

export default function LabsLayoutEmbed() {
  const [route, setRoute] = useState<LabsRoute>("/labs");

  return (
    <LectureDemoFrame label="app/labs/layout.tsx" url={route}>
      <table className="w-full border-collapse font-sans text-lg">
        <tbody>
          <tr>
            <td className="align-top pr-4" valign="top" width="100">
              <ul className="m-0 list-disc pl-5">
                {SCREENS.map((screen) => (
                  <li key={screen.id}>
                    <button
                      type="button"
                      id={screen.id}
                      className={`border-0 bg-transparent p-0 underline ${
                        route === screen.href
                          ? "font-semibold text-neutral-900"
                          : "text-blue-700"
                      }`}
                      onClick={() => setRoute(screen.href)}
                    >
                      {screen.label}
                    </button>
                  </li>
                ))}
              </ul>
            </td>
            <td className="align-top" valign="top">
              {ChildrenFor(route)}
            </td>
          </tr>
        </tbody>
      </table>
    </LectureDemoFrame>
  );
}

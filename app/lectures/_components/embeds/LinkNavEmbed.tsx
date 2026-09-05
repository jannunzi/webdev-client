"use client";

import { useState } from "react";
import Lab1Starter from "@/app/labs/lab1/intermediates/1-2-4-Lab1Starter";
import LectureDemoFrame from "./LectureDemoFrame";

export default function LinkNavEmbed() {
  const [route, setRoute] = useState<"/" | "/labs/lab1">("/");

  return (
    <LectureDemoFrame label="next/link in-app navigation" url={route}>
      <nav className="mb-5 flex flex-wrap gap-4 font-sans text-xl">
        <button
          type="button"
          className={`border-0 bg-transparent p-0 underline ${
            route === "/" ? "font-semibold text-neutral-900" : "text-blue-700"
          }`}
          onClick={() => setRoute("/")}
        >
          Home
        </button>
        <button
          type="button"
          className={`border-0 bg-transparent p-0 underline ${
            route === "/labs/lab1" ? "font-semibold text-neutral-900" : "text-blue-700"
          }`}
          onClick={() => setRoute("/labs/lab1")}
        >
          Lab 1
        </button>
      </nav>
      {route === "/" ? (
        <h1 className="mt-0 mb-0 font-sans text-4xl font-semibold">
          Welcome to Web Dev
        </h1>
      ) : (
        <div className="font-sans text-3xl [&_h2]:mt-0 [&_h2]:mb-0">
          <Lab1Starter />
        </div>
      )}
    </LectureDemoFrame>
  );
}

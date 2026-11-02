"use client";

import Signup from "@/app/book/ch4/embeds/_styled/account/signup/page";
import Profile from "@/app/book/ch4/embeds/_styled/account/profile/page";
import Ch4Modules from "@/app/book/ch4/embeds/_styled/courses/cid/modules/page";
import Module from "@/app/book/ch4/embeds/_styled/courses/cid/modules/Module";
import ModuleEditor from "@/app/book/ch4/embeds/_styled/courses/cid/modules/ModuleEditor";
import ModulesControls from "@/app/book/ch4/embeds/_styled/courses/cid/modules/ModulesControls";
import { useEffect, type ReactNode } from "react";
import usersJson from "@/app/book/ch4/embeds/_styled/database/users.json";
import { useAccountContext } from "@/app/book/ch4/embeds/_styled/account/AccountContext";
import Ch4Dashboard from "@/app/book/ch4/embeds/_styled/dashboard/Dashboard";
import CourseCard from "@/app/book/ch4/embeds/_styled/dashboard/CourseCard";
import coursesJson from "@/app/book/ch4/embeds/_styled/database/courses.json";
import AsAccountRouter from "./AsAccountRouter";
import AsCourseParams from "./AsCourseParams";
import LectureDemoFrame from "./LectureDemoFrame";

function SignedOut({ go }: { go: (path: string) => void }) {
  return (
    <div id="wd-signin-screen">
      <p className="text-sm">Signed out (Sign in screen).</p>
      <button
        type="button"
        className="rounded border border-neutral-300 px-3 py-1 text-sm"
        onClick={() => go("/account/signup")}
      >
        Back to Sign up
      </button>
    </div>
  );
}

/** §4.10.5.5 Sign up → Profile → Update → Sign out, on the Ch4 AccountContext. */
export function KambazCh4AccountDemo({ start }: { start: string }) {
  return (
    <AsAccountRouter
      start={start}
      screens={(path, go) =>
        path === "/account/signup" ? (
          <Signup />
        ) : path === "/account/profile" ? (
          <Profile />
        ) : (
          <SignedOut go={go} />
        )
      }
    />
  );
}

export function KambazCh4SignupEmbed() {
  return <KambazCh4AccountDemo start="/account/signup" />;
}

/**
 * Slides-only: signs in the first seed user, and renders Profile only once
 * currentUser is set. Child effects run before parent effects, so mounting
 * Profile first made its "no currentUser" guard redirect to Sign in.
 */
function SignedInAsSeedUser({ children }: { children: ReactNode }) {
  const { currentUser, setCurrentUser } = useAccountContext();
  useEffect(() => {
    if (!currentUser) setCurrentUser(usersJson[0]);
  }, [currentUser, setCurrentUser]);
  return currentUser ? <>{children}</> : null;
}

export function KambazCh4ProfileEmbed() {
  return (
    <div className="mt-6 w-full">
    <AsAccountRouter
      start="/account/profile"
      screens={(path, go) =>
        path === "/account/profile" ? (
          <SignedInAsSeedUser>
            <Profile />
          </SignedInAsSeedUser>
        ) : (
          <SignedOut go={() => go("/account/profile")} />
        )
      }
    />
    </div>
  );
}

/** Foreshadow §4.10.4.1: the real ModuleEditor (+ Module button and dialog). */
export function KambazCh4ModuleEditorEmbed() {
  return (
    // Slides-only: unframed and zoomed like the toolbar demo so it reads at
    // slide size; the button sits on the right as it does in the toolbar.
    <div className="mt-10 flex w-full justify-end font-sans">
      <div style={{ zoom: 2 }}>
        <AsCourseParams cid="RS101">
          <ModuleEditor />
        </AsCourseParams>
      </div>
    </div>
  );
}

/** §4.10.4 Modules wired to the Ch4 modules store (add, delete, rename). */
export function KambazCh4ModulesEmbed() {
  return (
    <div className="font-sans">
      <AsCourseParams cid="RS101">
        <Ch4Modules />
      </AsCourseParams>
    </div>
  );
}

/** Foreshadow §4.10.4.2: one module row with the real ModuleControlButtons. */
export function KambazCh4ModuleRowEmbed() {
  return (
    <div className="mt-6">
      <LectureDemoFrame label="app/(kambaz)/courses/[cid]/modules/Module.tsx">
        {/* Slides-only: padding roughly doubles the row's height on the slide. */}
        <ul className="m-0 list-none py-6 font-sans">
          <Module
            module={{ _id: "M101", name: "Week 1 - HTML", description: "", course: "RS101" }}
          />
        </ul>
      </LectureDemoFrame>
    </div>
  );
}

/** Foreshadow §4.10.4.1: the real ModulesControls toolbar; + Module opens the dialog. */
export function KambazCh4ModulesControlsEmbed() {
  return (
    // Slides-only: unframed so the demo-stage zoom doesn't scale it; full
    // width, one row (overrides the book toolbar's flex-wrap). zoom: 2
    // doubles the controls so the row spans nearly the full slide width;
    // the dropdown stays content-width (book.css min-width overridden).
    <div className="mt-10 w-full overflow-x-auto font-sans [&_#wd-modules-controls]:flex-nowrap [&_#wd-modules-controls]:justify-end [&_#wd-modules-controls>*]:shrink-0 [&_#wd-modules-controls_*]:whitespace-nowrap [&_select]:w-auto [&_select]:min-w-0">
      <div style={{ zoom: 2 }}>
        <AsCourseParams cid="RS101">
          <ModulesControls />
        </AsCourseParams>
      </div>
    </div>
  );
}

/** Foreshadow §4.10.2: the real Dashboard's New Course form (cards hidden). */
export function KambazCh4CourseFormEmbed() {
  return (
    // Slides-only: unframed so the demo-stage zoom doesn't shrink it; full
    // width, and the published heading and card grid are hidden.
    <div className="mt-10 w-full font-sans [&_#wd-dashboard-title]:hidden [&_#wd-dashboard-published]:hidden [&_#wd-dashboard-courses]:hidden [&_hr]:hidden [&_input]:max-w-none [&_textarea]:max-w-none [&_select]:w-auto [&_select]:min-w-0">
      <Ch4Dashboard />
    </div>
  );
}

/** Foreshadow §4.10.2: one real CourseCard with its Edit and Delete buttons. */
export function KambazCh4CourseCardEmbed() {
  return (
    <div className="mt-10 flex w-full justify-center font-sans">
      <CourseCard course={coursesJson[0]} onEdit={() => {}} />
    </div>
  );
}

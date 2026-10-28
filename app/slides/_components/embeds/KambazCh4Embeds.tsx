"use client";

import Signup from "@/app/book/ch4/embeds/_styled/account/signup/page";
import Profile from "@/app/book/ch4/embeds/_styled/account/profile/page";
import Ch4Modules from "@/app/book/ch4/embeds/_styled/courses/cid/modules/page";
import Module from "@/app/book/ch4/embeds/_styled/courses/cid/modules/Module";
import ModulesControls from "@/app/book/ch4/embeds/_styled/courses/cid/modules/ModulesControls";
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

export function KambazCh4ProfileEmbed() {
  return <KambazCh4AccountDemo start="/account/signup" />;
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

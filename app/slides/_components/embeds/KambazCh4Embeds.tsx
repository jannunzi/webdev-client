"use client";

import Signup from "@/app/book/ch4/embeds/_styled/account/signup/page";
import Profile from "@/app/book/ch4/embeds/_styled/account/profile/page";
import Ch4Modules from "@/app/book/ch4/embeds/_styled/courses/cid/modules/page";
import Module from "@/app/book/ch4/embeds/_styled/courses/cid/modules/Module";
import ModulesControls from "@/app/book/ch4/embeds/_styled/courses/cid/modules/ModulesControls";
import ModuleControlButtons from "@/app/book/ch4/embeds/_styled/courses/cid/modules/ModuleControlButtons";
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
    <LectureDemoFrame label="app/(kambaz)/courses/[cid]/modules/ModuleControlButtons.tsx">
      <ul className="m-0 list-none p-0 font-sans">
        <Module
          title="Week 1 - HTML"
          extra={<ModuleControlButtons moduleId="M101" />}
        />
      </ul>
    </LectureDemoFrame>
  );
}

/** Foreshadow §4.10.4.1: the real ModulesControls toolbar; + Module opens the dialog. */
export function KambazCh4ModulesControlsEmbed() {
  return (
    <LectureDemoFrame label="app/(kambaz)/courses/[cid]/modules/ModulesControls.tsx">
      <div className="font-sans">
        <AsCourseParams cid="RS101">
          <ModulesControls />
        </AsCourseParams>
      </div>
    </LectureDemoFrame>
  );
}

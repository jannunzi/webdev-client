"use client";

import Signup from "@/app/book/ch4/embeds/_styled/account/signup/page";
import Signin from "@/app/book/ch4/embeds/_styled/account/signin/page";
import { useAccountContext } from "@/app/book/ch4/embeds/_styled/account/AccountContext";
import Profile from "@/app/book/ch4/embeds/_styled/account/profile/page";
import Ch4Modules from "@/app/book/ch4/embeds/_styled/courses/cid/modules/page";
import AsAccountRouter from "./AsAccountRouter";
import AsCourseParams from "./AsCourseParams";

function SignedIn({ go }: { go: (path: string) => void }) {
  const { currentUser } = useAccountContext();
  return (
    <div id="wd-dashboard">
      <p className="text-sm">Dashboard, signed in as {currentUser?.username}.</p>
      <button
        type="button"
        className="rounded border border-neutral-300 px-3 py-1 text-sm"
        onClick={() => go("/account/profile")}
      >
        Profile
      </button>
    </div>
  );
}

/** §4.10.5.5 Sign up → Profile → Sign out → Sign in, on the Ch4 AccountContext. */
export function KambazCh4AccountDemo({ start }: { start: string }) {
  return (
    <AsAccountRouter
      start={start}
      screens={(path, go) =>
        path === "/account/signup" ? (
          <Signup />
        ) : path === "/account/profile" ? (
          <Profile />
        ) : path === "/dashboard" ? (
          <SignedIn go={go} />
        ) : (
          <Signin />
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

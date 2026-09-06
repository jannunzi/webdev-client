"use client";

import { useState } from "react";
import DemoProfile from "@/app/book/ch1/embeds/DemoProfile";
import DemoSignin from "@/app/book/ch1/embeds/DemoSignin";
import DemoSignup from "@/app/book/ch1/embeds/DemoSignup";
import LectureDemoFrame from "./LectureDemoFrame";

function AccountNav({
  screen,
  onSelect,
}: {
  screen: "signin" | "signup" | "profile";
  onSelect: (next: "signin" | "signup" | "profile") => void;
}) {
  const links = [
    { id: "signin", href: "/account/signin", label: "Signin" },
    { id: "signup", href: "/account/signup", label: "Signup" },
    { id: "profile", href: "/account/profile", label: "Profile" },
  ] as const;
  return (
    <div id="wd-account-navigation" className="font-sans text-base">
      {links.map((link) => (
        <span key={link.id}>
          <button
            type="button"
            className={`border-0 bg-transparent p-0 underline ${
              screen === link.id ? "font-semibold text-neutral-900" : "text-blue-700"
            }`}
            onClick={() => onSelect(link.id)}
          >
            {link.label}
          </button>
          <br />
        </span>
      ))}
    </div>
  );
}

export function KambazLandingEmbed() {
  return (
    <LectureDemoFrame label="app/(kambaz)/page.tsx" url="/">
      <div id="wd-kambaz" className="font-sans">
        <h1 className="mt-0 mb-0 text-2xl font-semibold">Kambaz</h1>
      </div>
    </LectureDemoFrame>
  );
}

export function KambazSigninEmbed() {
  return (
    <LectureDemoFrame
      label="app/(kambaz)/account/signin/page.tsx"
      url="/account/signin"
    >
      <div className="font-sans text-base [&_h3]:mt-0">
        <DemoSignin />
      </div>
    </LectureDemoFrame>
  );
}

export function KambazSignupEmbed() {
  return (
    <LectureDemoFrame
      label="app/(kambaz)/account/signup/page.tsx"
      url="/account/signup"
    >
      <div className="font-sans text-base [&_h3]:mt-0">
        <DemoSignup />
      </div>
    </LectureDemoFrame>
  );
}

export function KambazProfileEmbed() {
  return (
    <LectureDemoFrame
      label="app/(kambaz)/account/profile/page.tsx"
      url="/account/profile"
    >
      <div className="font-sans text-base [&_h3]:mt-0 [&_input]:mb-1">
        <DemoProfile />
      </div>
    </LectureDemoFrame>
  );
}

export function KambazAccountNavEmbed() {
  const [screen, setScreen] = useState<"signin" | "signup" | "profile">(
    "signin",
  );

  return (
    <LectureDemoFrame
      label="app/(kambaz)/account/layout.tsx"
      url={`/account/${screen}`}
    >
      <div id="wd-kambaz-account">
        <table className="w-full border-collapse font-sans text-base">
          <tbody>
            <tr>
              <td className="align-top pr-4" valign="top" width="120">
                <AccountNav screen={screen} onSelect={setScreen} />
              </td>
              <td className="align-top" valign="top" width="100%">
                {screen === "signup" ? (
                  <DemoSignup />
                ) : screen === "profile" ? (
                  <DemoProfile />
                ) : (
                  <DemoSignin />
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </LectureDemoFrame>
  );
}

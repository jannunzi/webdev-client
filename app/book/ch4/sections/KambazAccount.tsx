import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import CodeBlock from "../../components/CodeBlock";
import BookFigure from "../../components/BookFigure";
import FigureLink from "../../components/FigureLink";
import { OnYourOwn, WithAI } from "../../components/Practice";
import Link from "next/link";

export default function KambazAccount() {
  return (
    <>
      <Section
        level={3}
        id="sec-4-10-5"
        title="4.10.5 Account Screens"
      >
        <p>
          Sign in is how Kambaz learns who is using the app, and Profile
          is where that person&apos;s fields show up. Account Navigation
          should hide Sign in and Sign up once someone is signed in, and
          hide Profile when nobody is. Put the current user in React
          Context, wrapped around the Kambaz layout, so Dashboard,
          Account, and Profile all read the same value. We could have
          used Zustand here as well — and we will for courses and
          modules — but who is signed in changes rarely, so Context is a
          fair fit, and it lets you practice the provider you already
          built in the lab. Local <code>useState</code>{" "}plus Zustand
          for everything shared would have worked, and would even have
          been simpler.
        </p>

        <Section
          level={3}
          id="sec-4-10-5-1"
          title="4.10.5.1 Account Context"
        >
          <p>
            The pattern is a context, a provider that holds{" "}
            <code>currentUser</code>{" "}in <code>useState</code>, and a
            hook that throws if you forget the provider — the same shape
            as the lab counter in <SectionLink to="4.4" />:
          </p>
          <CodeBlock
            language="tsx"
            name="AccountContext"
            file="app/(kambaz)/account/AccountContext.tsx"
          >{`"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import usersJson from "../database/users.json";

export type User = (typeof usersJson)[number];

type AccountContextValue = {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
};

const AccountContext = createContext<AccountContextValue | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  return (
    <AccountContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccountContext() {
  const value = useContext(AccountContext);
  if (!value) {
    throw new Error("useAccountContext must be used inside AccountProvider");
  }
  return value;
}`}</CodeBlock>
          <p>
            Wrap the Kambaz layout so every Kambaz screen sits inside the
            provider. The layout can stay a Server Component; it just
            renders the client <code>AccountProvider</code>:
          </p>
          <CodeBlock
            language="tsx"
            name="KambazLayout"
            file="app/(kambaz)/layout.tsx"
          >{`import { AccountProvider } from "./account/AccountContext";

export default function KambazLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <AccountProvider>
      <div id="wd-kambaz" className="font-sans">
        <KambazNavigation />
        <div className="wd-main-content-offset p-3">{children}</div>
      </div>
    </AccountProvider>
  );
}`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-4-10-5-2"
          title="4.10.5.2 Sign in"
        >
          <p>
            Convert Sign in to a Client Component and keep the typed
            username and password in <code>useState</code>. On Sign in,
            look up a user in <code>users.json</code>{" "}whose credentials
            match: if there is none, do nothing; if there is,{" "}
            <code>setCurrentUser(user)</code>{" "}and go to Dashboard with{" "}
            <code>router.push</code>. In a click handler use the router,
            not the server <code>redirect</code> helper:
          </p>
          <CodeBlock
            language="tsx"
            name="Signin"
            file="app/(kambaz)/account/signin/page.tsx"
          >{`"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as db from "../../database";
import { useAccountContext } from "../AccountContext";

export default function Signin() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const { setCurrentUser } = useAccountContext();
  const router = useRouter();

  const signin = () => {
    const user = db.users.find(
      (u) =>
        u.username === credentials.username &&
        u.password === credentials.password,
    );
    if (!user) return;
    setCurrentUser(user);
    router.push("/dashboard");
  };

  return (
    <div id="wd-signin-screen">
      <h3>Sign in</h3>
      <input
        placeholder="username"
        id="wd-username"
        value={credentials.username}
        onChange={(e) =>
          setCredentials({ ...credentials, username: e.target.value })
        }
      />
      <input
        placeholder="password"
        type="password"
        id="wd-password"
        value={credentials.password}
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
      />
      <button type="button" onClick={signin} id="wd-signin-btn">
        Sign in
      </button>
      <Link href="/account/signup" id="wd-signup-link">
        Sign up
      </Link>
    </div>
  );
}`}</CodeBlock>
          <p>
            Try a user from <code>users.json</code> — for example{" "}
            <code>iron_man</code>{" "}/ <code>stark123</code>. A wrong
            password should stay on Sign in. A match should land on
            Dashboard. Open{" "}
            <Link href="/account/signin">/account/signin</Link>.
          </p>
        </Section>

        <Section
          level={3}
          id="sec-4-10-5-3"
          title="4.10.5.3 Dashboard by Enrollment"
        >
          <p>
            Once <code>currentUser</code>{" "}is set, Dashboard should list
            only courses that appear with that user in{" "}
            <code>enrollments.json</code>. If nobody is signed in, keep
            showing every course so the Add/Edit/Delete work in{" "}
            <SectionLink to="4.10.2" />{" "}still has something to click:
          </p>
          <CodeBlock language="tsx">{`const { currentUser } = useAccountContext();
const visibleCourses = currentUser
  ? courses.filter((c) =>
      db.enrollments.some(
        (enrollment) =>
          enrollment.user === currentUser._id && enrollment.course === c._id,
      ),
    )
  : courses;`}</CodeBlock>
          <p>
            Sign in as <code>iron_man</code>{" "}and confirm the published
            list shrinks to that student&apos;s courses. Sign in as{" "}
            <code>nick_fury</code>{" "}/ <code>fury123</code>{" "}and compare.
            A course you Add while signed in will not appear until you
            enroll in it — that is the <SectionLink to="4.10.7" />{" "}
            exercise, the same limitation the original chapter called out.
          </p>
        </Section>

        <Section
          level={3}
          id="sec-4-10-5-4"
          title="4.10.5.4 Account Navigation"
        >
          <p>
            If <code>currentUser</code>{" "}is set, the Account sidebar
            should list only Profile. If it is <code>null</code>, list
            Signin and Signup. The Account landing route should send you
            to Profile or Sign in the same way:
          </p>
          <CodeBlock
            language="tsx"
            name="AccountNavigation"
            file="app/(kambaz)/account/Navigation.tsx"
          >{`"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccountContext } from "./AccountContext";

export default function AccountNavigation() {
  const { currentUser } = useAccountContext();
  const links = currentUser
    ? (["profile"] as const)
    : (["signin", "signup"] as const);
  const pathname = usePathname() ?? "";
  return (
    <div id="wd-account-navigation">
      {links.map((link) => (
        <span key={link}>
          <Link href={\`/account/\${link}\`}>
            {link === "signin"
              ? "Signin"
              : link === "signup"
                ? "Signup"
                : "Profile"}
          </Link>
          <br />
        </span>
      ))}
    </div>
  );
}`}</CodeBlock>
          <CodeBlock
            language="tsx"
            name="AccountPage"
            file="app/(kambaz)/account/page.tsx"
          >{`"use client";

import { redirect } from "next/navigation";
import { useAccountContext } from "./AccountContext";

export default function AccountPage() {
  const { currentUser } = useAccountContext();
  if (!currentUser) {
    redirect("/account/signin");
  } else {
    redirect("/account/profile");
  }
}`}</CodeBlock>
        </Section>

        <Section
          level={3}
          id="sec-4-10-5-5"
          title="4.10.5.5 Profile"
        >
          <p>
            Profile reads <code>currentUser</code>. If it is missing,
            navigate to Sign in. If it is present, copy it into a local{" "}
            <code>profile</code>{" "}state in <code>useEffect</code>{" "}so the
            form can edit fields without writing the context on every
            keystroke. Sign out sets <code>currentUser</code>{" "}to{" "}
            <code>null</code>{" "}and returns to Sign in:
          </p>
          <CodeBlock
            language="tsx"
            name="Profile"
            file="app/(kambaz)/account/profile/page.tsx"
          >{`"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccountContext, type User } from "../AccountContext";

export default function Profile() {
  const [profile, setProfile] = useState<User | null>(null);
  const { currentUser, setCurrentUser } = useAccountContext();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push("/account/signin");
      return;
    }
    setProfile(currentUser);
  }, [currentUser, router]);

  const signout = () => {
    setCurrentUser(null);
    router.push("/account/signin");
  };

  if (!profile) return null;
  return (
    <div id="wd-profile-screen">
      <h3>Profile</h3>
      <input
        id="wd-username"
        value={profile.username}
        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
      />
      {/* password, firstName, lastName, email, role */}
      <button type="button" onClick={signout} id="wd-signout-btn">
        Sign out
      </button>
    </div>
  );
}`}</CodeBlock>
          <p>
            Confirm the form fills with <code>iron_man</code>&apos;s name
            after a successful sign in, and that Sign out returns you to
            Sign in with Account Navigation showing Signin and Signup
            again.
          </p>
          <OnYourOwn>
            Bind the remaining profile fields from{" "}
            <code>app/(kambaz)/account/profile/page.tsx</code>{" "}so every
            input shows the signed-in user.
          </OnYourOwn>
          <WithAI
            prompt={`In app/(kambaz)/account/profile/page.tsx, keep any extra field I added. Ensure inputs for username, password, firstName, lastName, email, and role are controlled from profile state. Do not rename my personal field.`}
          >
            Ask the assistant to fill any sample fields you skipped:
          </WithAI>
        </Section>
      </Section>

      <Section
        level={3}
        id="sec-4-10-6"
        title="4.10.6 Assignments (On Your Own)"
      >
        <p>
          After Dashboard, Courses, and Modules, faculty should be able to
          create, update, and remove assignments while students can still
          view them. The list target looks like{" "}
          <FigureLink to="4.10.6" />; the editor looks like{" "}
          <FigureLink to="4.10.6b" />:
        </p>
        <BookFigure
          id="fig-4.10.6"
          src="/images/book/ch4/figures/fig-4-10-6-assignments.png"
          alt="Assignments screen with search, + Assignment, and a list of assignments"
          caption="Figure 4.10.6 — Assignments"
        />
        <BookFigure
          id="fig-4.10.6b"
          src="/images/book/ch4/figures/fig-4-10-6b-assignment-editor.png"
          alt="Assignment editor with name, description, points, and dates"
          caption="Figure 4.10.6b — Creating and editing assignments"
        />

        <Section
          level={3}
          id="sec-4-10-6-1"
          title="4.10.6.1 Assignments Store"
        >
          <p>
            Following <code>modulesStore.ts</code>, create{" "}
            <code>app/(kambaz)/store/assignmentsStore.ts</code>{" "}seeded
            from <code>assignments.json</code>. Implement{" "}
            <code>addAssignment</code>, <code>deleteAssignment</code>,{" "}
            <code>updateAssignment</code>, and any other functions you
            need.
          </p>
        </Section>

        <Section
          level={3}
          id="sec-4-10-6-2"
          title="4.10.6.2 Creating an Assignment"
        >
          <ul>
            <li>
              Clicking + Assignment navigates to the Assignment Editor.
            </li>
            <li>
              The editor should allow editing at least name, description,
              points, due date, available from, and available until.
            </li>
            <li>
              Save creates the assignment, adds it to the store, and
              navigates back to the list, which must now contain the new
              row.
            </li>
            <li>
              Cancel does not create the assignment and returns to the
              list unchanged.
            </li>
          </ul>
        </Section>

        <Section
          level={3}
          id="sec-4-10-6-3"
          title="4.10.6.3 Editing an Assignment"
        >
          <ul>
            <li>
              Clicking an assignment opens the editor with that
              assignment&apos;s name, description, points, and dates.
            </li>
            <li>The same fields remain editable.</li>
            <li>
              Save updates the store and returns to the list with the new
              values.
            </li>
            <li>
              Cancel leaves the assignment unchanged and returns to the
              list.
            </li>
          </ul>
        </Section>

        <Section
          level={3}
          id="sec-4-10-6-4"
          title="4.10.6.4 Deleting an Assignment"
        >
          <ul>
            <li>
              Using the modules trash as a model, add a Delete control to
              the right of each assignment.
            </li>
            <li>
              Clicking it asks whether you are sure you want to remove the
              assignment.
            </li>
            <li>
              Yes or Ok dismisses the dialog, removes the assignment, and
              updates the list.
            </li>
            <li>
              No or Cancel dismisses the dialog without removing it.
            </li>
          </ul>
        </Section>
        <OnYourOwn>
          Implement the store, the editor save/cancel path, and the
          confirm-on-delete dialog. Filter by the current{" "}
          <code>cid</code>.
        </OnYourOwn>
        <WithAI
          prompt={`Create app/(kambaz)/store/assignmentsStore.ts seeded from assignments.json with addAssignment, updateAssignment, and deleteAssignment. Keep any extra fields I added. Wire + Assignment to navigate to the editor. Do not overwrite my personal assignment fields.`}
        >
          After your own assignment CRUD, you can ask the assistant to add
          a sample store:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-4-10-7"
        title="4.10.7 Enrollments (On Your Own)"
      >
        <p>
          Faculty can Add, Delete, Edit, and Update courses and open a
          course. Other users currently only see courses they are enrolled
          in. Refactor Dashboard so a blue Enrollments button at the top
          right toggles between that enrolled list and every course.
        </p>
        <ul>
          <li>
            Courses the user is enrolled in show a red Unenroll button.
          </li>
          <li>
            Courses the user is not enrolled in show a green Enroll
            button.
          </li>
          <li>
            Clicking Enroll or Unenroll must change the enrollment and
            toggle the button.
          </li>
          <li>
            Sign out and sign in again: the choices should still be there
            for this session. A full reload may lose them — that is
            expected until a later chapter persists to a server.
          </li>
          <li>
            Protect the course route so only enrolled users can open it;
            everyone else stays on Dashboard.
          </li>
        </ul>
        <OnYourOwn>
          Create <code>app/(kambaz)/store/enrollmentsStore.ts</code>{" "}
          seeded from <code>enrollments.json</code>. Wire the Enrollments
          toggle and the People table to that store.
        </OnYourOwn>
        <WithAI
          prompt={`Create app/(kambaz)/store/enrollmentsStore.ts seeded from enrollments.json with enroll and unenroll. In the Dashboard, keep any extra button I added and add a sample button id="wd-enrollments-toggle" that flips a showAllCourses flag. Do not remove my extra button.`}
        >
          Ask the assistant to add a sample enrollments toggle after your
          own extra control:
        </WithAI>
      </Section>

      <Section level={3} id="sec-4-11" title="4.11 Exercises">
        <p>
          Use this checklist to confirm the stateful Kambaz prototype
          covers every screen in <SectionLink to="4.10" />. Each item
          points back to the section where you wired the worked example.
          Build in order as you read — this list is for checking coverage,
          not a substitute for the walkthroughs. Assignments and
          enrollments stay On your own: match the ids, figures, and
          bullets in those sections.
        </p>
        <ol>
          <li>
            Create the courses Zustand store seeded from JSON (
            <SectionLink to="4.10.1" />).
          </li>
          <li>
            Add, edit, update, and delete courses on the Dashboard (
            <SectionLink to="4.10.2" />).
          </li>
          <li>
            Toggle Course Navigation from the hamburger and read the course
            name from the store (<SectionLink to="4.10.3" />).
          </li>
          <li>
            Add a module from the dialog, delete with trash, rename with
            the pencil, and share the list through the modules store (
            <SectionLink to="4.10.4" />).
          </li>
          <li>
            Sign in, filter Dashboard by enrollment, toggle Account
            Navigation, and fill Profile from the current user in Context
            ( <SectionLink to="4.10.5" />).
          </li>
          <li>
            Implement assignment CRUD in Zustand (
            <SectionLink to="4.10.6" />).
          </li>
          <li>
            Implement enroll and unenroll from Dashboard (
            <SectionLink to="4.10.7" />).
          </li>
        </ol>
      </Section>
    </>
  );
}

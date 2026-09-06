"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import DemoSignin from "@/app/book/ch1/embeds/DemoSignin";
import LectureDemoFrame from "./LectureDemoFrame";

function CourseCard({
  id,
  title,
  subtitle,
  image,
}: {
  id: string;
  title: string;
  subtitle: string;
  image: string;
}) {
  return (
    <div className="wd-dashboard-course mb-3">
      <Link href={`/courses/${id}/home`} className="wd-dashboard-course-link">
        <Image src={image} width={160} height={120} alt={title} />
        <div>
          <h5 className="mt-1 mb-0">{title}</h5>
          <p className="wd-dashboard-course-title m-0">{subtitle}</p>
          <button type="button">Go</button>
        </div>
      </Link>
    </div>
  );
}

function DashboardBody() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title" className="mt-0 mb-1 text-xl font-semibold">
        Dashboard
      </h1>
      <hr />
      <h2 id="wd-dashboard-published" className="mt-2 mb-1 text-lg font-semibold">
        Published Courses (3)
      </h2>
      <hr />
      <div id="wd-dashboard-courses" className="flex flex-wrap gap-4 pt-2">
        <CourseCard
          id="1234"
          title="CS1234 React JS"
          subtitle="Full Stack software developer"
          image="/images/reactjs.jpg"
        />
        <CourseCard
          id="2345"
          title="CS2345 Node JS"
          subtitle="Server side JavaScript"
          image="/images/nodejs.jpg"
        />
        <CourseCard
          id="3456"
          title="CS3456 MongoDB"
          subtitle="NoSQL Databases"
          image="/images/mongodb.jpg"
        />
      </div>
    </div>
  );
}

function NotFoundBody() {
  return (
    <div id="wd-not-found">
      <h2 className="mt-0 mb-1 text-lg font-semibold">Page Not Found</h2>
      <p className="m-0 mb-2">
        The requested page could not be found. Please check the page URL or
        return to the dashboard.
      </p>
      <Link href="/dashboard" id="wd-not-found-dashboard-link">
        Back to Dashboard
      </Link>
    </div>
  );
}

type KambazRoute = "account" | "dashboard" | "calendar" | "inbox" | "labs";

function KambazNav({
  route,
  onSelect,
}: {
  route: KambazRoute;
  onSelect: (next: KambazRoute) => void;
}) {
  const links: { id: KambazRoute; label: string; href: string }[] = [
    { id: "account", label: "Account", href: "/account" },
    { id: "dashboard", label: "Dashboard", href: "/dashboard" },
    { id: "calendar", label: "Calendar", href: "/calendar" },
    { id: "inbox", label: "Inbox", href: "/inbox" },
    { id: "labs", label: "Labs", href: "/labs" },
  ];
  return (
    <div id="wd-kambaz-navigation" className="font-sans text-base">
      <a
        href="https://www.northeastern.edu/"
        id="wd-neu-link"
        target="_blank"
        rel="noreferrer"
      >
        Northeastern
      </a>
      <br />
      {links.map((link) => (
        <span key={link.id}>
          <button
            type="button"
            id={
              link.id === "account"
                ? "wd-account-link"
                : link.id === "dashboard"
                  ? "wd-dashboard-link"
                  : link.id === "calendar"
                    ? "wd-calendar-link"
                    : link.id === "inbox"
                      ? "wd-inbox-link"
                      : "wd-labs-link"
            }
            className={`border-0 bg-transparent p-0 underline ${
              route === link.id ? "font-semibold text-neutral-900" : "text-blue-700"
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

export function KambazDashboardEmbed() {
  return (
    <LectureDemoFrame
      label="app/(kambaz)/dashboard/page.tsx"
      url="/dashboard"
    >
      <div className="font-sans text-sm">
        <DashboardBody />
      </div>
    </LectureDemoFrame>
  );
}

export function KambazNavigationEmbed() {
  const [route, setRoute] = useState<KambazRoute>("dashboard");
  const url =
    route === "account"
      ? "/account/signin"
      : route === "labs"
        ? "/labs"
        : `/${route}`;

  return (
    <LectureDemoFrame label="app/(kambaz)/layout.tsx" url={url}>
      <table className="w-full border-collapse font-sans text-sm">
        <tbody>
          <tr>
            <td className="align-top pr-4" valign="top" width="140">
              <KambazNav route={route} onSelect={setRoute} />
            </td>
            <td className="align-top" valign="top" width="100%">
              {route === "account" ? (
                <DemoSignin />
              ) : route === "dashboard" ? (
                <DashboardBody />
              ) : route === "labs" ? (
                <div id="wd-labs">
                  <h1 className="mt-0 mb-0 text-xl font-semibold">Labs</h1>
                </div>
              ) : (
                <NotFoundBody />
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </LectureDemoFrame>
  );
}

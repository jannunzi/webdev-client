import type { ReactNode } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import CoursePeopleTable from "@/app/book/ch2/embeds/_styled/courses/cid/people/PeopleTable";
import UiMockFrame from "./UiMockFrame";

type Row = {
  name: string;
  loginId: string;
  section: string;
  role: string;
  lastActivity: string;
  totalActivity: string;
};

const TONY: Row = {
  name: "Tony Stark",
  loginId: "001234561S",
  section: "S101",
  role: "STUDENT",
  lastActivity: "2020-10-01",
  totalActivity: "10:21:32",
};
const NATASHA: Row = {
  name: "Natasha Romanoff",
  loginId: "001234564S",
  section: "S101",
  role: "TA",
  lastActivity: "2020-11-05",
  totalActivity: "13:23:34",
};
const BANNER: Row = {
  name: "Bruce Banner",
  loginId: "001234567F",
  section: "S102",
  role: "FACULTY",
  lastActivity: "2020-12-05",
  totalActivity: "32:10:45",
};
const FURY: Row = {
  name: "Nick Fury",
  loginId: "001234566F",
  section: "S101",
  role: "FACULTY",
  lastActivity: "2020-11-15",
  totalActivity: "40:12:18",
};
const ANTONIO: Row = { ...TONY, name: "Antonio Stark" };

function Field({
  label,
  value,
  active,
}: {
  label: string;
  value?: string;
  active?: boolean;
}) {
  return (
    <div
      className={`min-w-40 rounded border bg-white px-3 py-1.5 text-base ${
        active ? "border-red-600 font-semibold" : "border-neutral-300"
      }`}
    >
      {value ? <span>{value}</span> : <span className="text-neutral-400">{label}</span>}
    </div>
  );
}

function PeopleTable({ rows, linked }: { rows: Row[]; linked?: string }) {
  return (
    <table className="w-full border-collapse text-left text-sm">
      <thead>
        <tr className="border-b border-neutral-300">
          <th className="p-2">Name</th>
          <th className="p-2">Login ID</th>
          <th className="p-2">Section</th>
          <th className="p-2">Role</th>
          <th className="p-2">Last Activity</th>
          <th className="p-2">Total Activity</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.loginId + row.name} className="odd:bg-neutral-50">
            <td className="p-2 whitespace-nowrap">
              <FaUserCircle className="me-2 inline text-lg text-neutral-500" aria-hidden />
              <span className={linked === row.name ? "cursor-pointer" : undefined}>{row.name}</span>
            </td>
            <td className="p-2">{row.loginId}</td>
            <td className="p-2">{row.section}</td>
            <td className="p-2">{row.role}</td>
            <td className="p-2">{row.lastActivity}</td>
            <td className="p-2">{row.totalActivity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Screen({
  url,
  role,
  roleActive,
  search,
  searchActive,
  rows,
  linked,
  panel,
}: {
  url: string;
  role: string;
  roleActive?: boolean;
  search?: string;
  searchActive?: boolean;
  rows: Row[];
  linked?: string;
  panel?: ReactNode;
}) {
  return (
    <UiMockFrame product="Users" url={url}>
      <div className="w-[980px] font-sans text-neutral-900">
        <h3 className="mb-2 mt-0 text-lg">Users</h3>
        <div className="mb-3 flex flex-wrap gap-2">
          <Field label="All Roles" value={role} active={roleActive} />
          <Field label="Search people" value={search} active={searchActive} />
        </div>
        <div className="flex gap-3">
          <div className="min-w-0 flex-1 overflow-hidden rounded border border-neutral-200 bg-white">
            <PeopleTable rows={rows} linked={linked} />
          </div>
          {panel}
        </div>
      </div>
    </UiMockFrame>
  );
}

function DetailsPanel({
  name,
  role,
  loginId,
  section,
  totalActivity,
  editing,
}: {
  name: string;
  role: string;
  loginId: string;
  section: string;
  totalActivity: string;
  editing?: boolean;
}) {
  return (
    <aside className="relative w-56 shrink-0 rounded border border-neutral-300 bg-white p-3 shadow">
      <IoCloseSharp className="absolute end-2 top-2 text-2xl" aria-hidden />
      <FaUserCircle className="mx-auto mt-2 text-3xl text-neutral-500" aria-hidden />
      {editing ? (
        <input
          className="wd-edit-name mt-3 w-full rounded border border-neutral-300 px-2 py-1 text-base"
          defaultValue={name}
          readOnly
        />
      ) : (
        <div className="wd-name mt-3 text-lg text-red-700">{name}</div>
      )}
      <p className="mb-1">
        <b>Roles:</b> <span className="wd-roles">{role}</span>
      </p>
      <p className="mb-1">
        <b>Login ID:</b> <span className="wd-login-id">{loginId}</span>
      </p>
      <p className="mb-1">
        <b>Section:</b> <span className="wd-section">{section}</span>
      </p>
      <p className="mb-2">
        <b>Total Activity:</b> <span className="wd-total-activity">{totalActivity}</span>
      </p>
      <button type="button" className="float-end rounded bg-red-600 px-3 py-1 text-sm text-white">
        Delete
      </button>
      <button type="button" className="float-end me-2 rounded bg-neutral-200 px-3 py-1 text-sm">
        Cancel
      </button>
    </aside>
  );
}

const PAGE = "http://localhost:3000/account/users";

export default function UsersCrudMock({
  id,
}: {
  id:
    | "users-filters-preview"
    | "users-role-result"
    | "users-name-result"
    | "users-details-result"
    | "users-delete-result"
    | "users-update-result";
}) {
  if (id === "users-filters-preview") {
    return (
      <UiMockFrame product="Users" url="http://localhost:3000/account/users">
        <div className="w-[1080px] font-sans text-neutral-900">
          <div className="mb-3 flex flex-wrap items-start gap-3">
            <div className="overflow-hidden rounded border border-red-600 bg-white text-base shadow">
              {["All Roles", "Students", "Assistants", "Faculty", "Administrators"].map((option) => (
                <div
                  key={option}
                  className={`px-4 py-1.5 ${option === "All Roles" ? "bg-neutral-100 font-semibold" : ""}`}
                >
                  {option}
                </div>
              ))}
            </div>
            <Field label="Search people" />
          </div>
          <div className="overflow-hidden rounded border border-neutral-200 bg-white [&_tbody_tr:nth-child(n+3)]:hidden">
            <CoursePeopleTable />
          </div>
        </div>
      </UiMockFrame>
    );
  }
  if (id === "users-role-result") {
    return (
      <Screen url={PAGE} role="Faculty" roleActive rows={[FURY, BANNER]} />
    );
  }
  if (id === "users-name-result") {
    return (
      <Screen url={PAGE} role="All Roles" search="Stark" searchActive rows={[TONY]} />
    );
  }
  if (id === "users-details-result") {
    return (
      <Screen
        url={PAGE}
        role="All Roles"
        rows={[TONY, BANNER, FURY]}
        linked="Bruce Banner"
        panel={
          <DetailsPanel
            name={BANNER.name}
            role={BANNER.role}
            loginId={BANNER.loginId}
            section={BANNER.section}
            totalActivity={BANNER.totalActivity}
          />
        }
      />
    );
  }
  if (id === "users-delete-result") {
    return (
      <Screen url={PAGE} role="All Roles" rows={[TONY, NATASHA, FURY]} />
    );
  }
  return (
    <Screen
      url={PAGE}
      role="All Roles"
      rows={[ANTONIO, NATASHA, BANNER]}
      linked={ANTONIO.name}
      panel={
        <DetailsPanel
          name={ANTONIO.name}
          role={ANTONIO.role}
          loginId={ANTONIO.loginId}
          section={ANTONIO.section}
          totalActivity={ANTONIO.totalActivity}
          editing
        />
      }
    />
  );
}

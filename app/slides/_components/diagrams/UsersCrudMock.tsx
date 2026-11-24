import type { ReactNode } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import UiMockFrame from "./UiMockFrame";

type Row = {
  name: string;
  role: string;
  email: string;
};

const TONY: Row = { name: "Tony Stark", role: "STUDENT", email: "tony@stark.com" };
const NATASHA: Row = { name: "Natasha Romanoff", role: "TA", email: "natasha@avengers.com" };
const BANNER: Row = { name: "Bruce Banner", role: "FACULTY", email: "bruce@avengers.com" };
const FURY: Row = { name: "Nick Fury", role: "FACULTY", email: "nick@shield.gov" };
const ANTONIO: Row = { name: "Antonio Stark", role: "STUDENT", email: "tony@stark.com" };

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
    <table className="w-full border-collapse text-left text-base">
      <thead>
        <tr className="border-b border-neutral-300">
          <th className="p-2">Name</th>
          <th className="p-2">Role</th>
          <th className="p-2">Email</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.email + row.name} className="odd:bg-neutral-50">
            <td className="p-2 whitespace-nowrap">
              <FaUserCircle className="me-2 inline text-lg text-neutral-500" aria-hidden />
              <span className={linked === row.name ? "text-blue-700 underline" : undefined}>
                {row.name}
              </span>
            </td>
            <td className="p-2">{row.role}</td>
            <td className="p-2">{row.email}</td>
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
  note,
  panel,
}: {
  url: string;
  role: string;
  roleActive?: boolean;
  search?: string;
  searchActive?: boolean;
  rows: Row[];
  linked?: string;
  note?: string;
  panel?: ReactNode;
}) {
  return (
    <UiMockFrame product="Users" url={url}>
      <div className="w-[760px] font-sans text-neutral-900">
        <div className="mb-3 flex flex-wrap gap-2">
          <Field label="All Roles" value={role} active={roleActive} />
          <Field label="Search people" value={search} active={searchActive} />
        </div>
        {note ? <p className="mt-0 mb-3 text-base font-semibold text-red-700">{note}</p> : null}
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
  editing,
  actions,
}: {
  name: string;
  role: string;
  loginId: string;
  section: string;
  editing?: boolean;
  actions?: React.ReactNode;
}) {
  return (
    <aside className="relative w-56 shrink-0 rounded border border-neutral-300 bg-white p-3 shadow">
      <IoCloseSharp className="absolute end-2 top-2 text-2xl" aria-hidden />
      <FaUserCircle className="mx-auto mt-2 text-3xl text-neutral-500" aria-hidden />
      {editing ? (
        <div className="wd-edit-name mt-3 rounded border border-neutral-300 px-2 py-1 text-base font-semibold text-red-700">
          {name}
        </div>
      ) : (
        <div className="wd-name mt-3 text-lg text-red-700">{name}</div>
      )}
      <p className="mb-1">
        <b>Roles:</b> <span className="wd-roles">{role}</span>
      </p>
      <p className="mb-1">
        <b>Login ID:</b> <span className="wd-login-id">{loginId}</span>
      </p>
      <p className="mb-2">
        <b>Section:</b> <span className="wd-section">{section}</span>
      </p>
      {actions}
    </aside>
  );
}

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
        <div className="w-[760px] font-sans text-neutral-900">
          <div className="mb-3 flex flex-wrap items-start gap-3">
            <div className="overflow-hidden rounded border border-red-600 bg-white text-base shadow">
              {["All Roles", "Students", "Assistants", "Faculty", "Administrators"].map((option) => (
                <div
                  key={option}
                  className={`px-3 py-1.5 ${option === "All Roles" ? "bg-neutral-100 font-semibold" : ""}`}
                >
                  {option}
                </div>
              ))}
            </div>
            <Field label="Search people" />
          </div>
          <div className="overflow-hidden rounded border border-neutral-200 bg-white">
            <PeopleTable rows={[TONY, NATASHA, BANNER]} />
          </div>
        </div>
      </UiMockFrame>
    );
  }
  if (id === "users-role-result") {
    return (
      <Screen
        url="GET http://localhost:4000/api/users?role=FACULTY"
        role="Faculty"
        roleActive
        rows={[FURY, BANNER]}
        note="Faculty is selected. Nick Fury and Bruce Banner remain."
      />
    );
  }
  if (id === "users-name-result") {
    return (
      <Screen
        url="GET http://localhost:4000/api/users?name=Stark"
        role="All Roles"
        search="Stark"
        searchActive
        rows={[TONY]}
        note="Search people is Stark. Only Tony Stark remains."
      />
    );
  }
  if (id === "users-details-result") {
    return (
      <Screen
        url="GET http://localhost:4000/api/users/789"
        role="All Roles"
        rows={[TONY, BANNER, FURY]}
        linked="Bruce Banner"
        panel={
          <DetailsPanel
            name="Bruce Banner"
            role="FACULTY"
            loginId="001234567F"
            section="S102"
          />
        }
      />
    );
  }
  if (id === "users-delete-result") {
    return (
      <Screen
        url="DELETE http://localhost:4000/api/users/789"
        role="All Roles"
        rows={[TONY, NATASHA, FURY]}
        note="DELETE /api/users/789 removed Bruce Banner."
      />
    );
  }
  return (
    <Screen
      url="PUT http://localhost:4000/api/users/123"
      role="All Roles"
      rows={[ANTONIO, NATASHA, BANNER]}
      linked="Antonio Stark"
      note="Enter saved Antonio Stark. Email and role stayed put."
      panel={
        <DetailsPanel
          name="Antonio Stark"
          role="STUDENT"
          loginId="001234561S"
          section="S101"
          editing
        />
      }
    />
  );
}

import UiMockFrame from "./UiMockFrame";

type CourseRow = { id: string; name: string; mark?: boolean };
type ModuleRow = { name: string; mark?: boolean };
type JoinRow = { user: string; course: string; gone?: boolean };

const ROCKET: CourseRow = { id: "RS101", name: "Rocket Propulsion" };
const AERO: CourseRow = { id: "RS102", name: "Aerodynamics" };
const INTRO: ModuleRow = { name: "Introduction to Rocket Propulsion" };
const FUEL: ModuleRow = { name: "Fuel and Combustion" };

function CourseList({ rows, note }: { rows: CourseRow[]; note: string }) {
  return (
    <UiMockFrame product="Dashboard" url="http://localhost:3000/dashboard">
      <div className="flex min-h-[460px] w-[1040px] flex-col justify-center font-sans text-neutral-900">
        <p className="mt-0 mb-3 text-base font-semibold text-red-700">{note}</p>
        <div className="grid grid-cols-3 gap-3">
          {rows.map((row) => (
            <div
              key={row.id}
              className={`rounded border bg-white p-3 ${
                row.mark ? "border-red-600" : "border-neutral-300"
              }`}
            >
              <p className="m-0 text-sm text-neutral-500">{row.id}</p>
              <p className="m-0 mt-1 text-lg font-semibold">{row.name}</p>
            </div>
          ))}
        </div>
      </div>
    </UiMockFrame>
  );
}

function ModuleList({ rows, note }: { rows: ModuleRow[]; note: string }) {
  return (
    <UiMockFrame product="Modules" url="http://localhost:3000/courses/RS101/modules">
      <div className="flex min-h-[460px] w-[1040px] flex-col justify-center font-sans text-neutral-900">
        <p className="mt-0 mb-3 text-base font-semibold text-red-700">{note}</p>
        <ul className="m-0 list-none p-0">
          {rows.map((row) => (
            <li
              key={row.name}
              className={`mb-2 rounded border px-4 py-3 text-lg ${
                row.mark ? "border-red-600 bg-white font-semibold" : "border-neutral-300 bg-neutral-100"
              }`}
            >
              {row.name}
            </li>
          ))}
        </ul>
      </div>
    </UiMockFrame>
  );
}

function JoinTable({ rows, note }: { rows: JoinRow[]; note: string }) {
  return (
    <UiMockFrame product="Compass" url="kambaz.enrollments">
      <div className="flex min-h-[460px] w-[1040px] flex-col justify-center font-sans text-neutral-900">
        <p className="mt-0 mb-3 text-base font-semibold text-red-700">{note}</p>
        <table className="w-full border-collapse text-left text-lg">
          <thead>
            <tr className="border-b border-neutral-300">
              <th className="p-2">user</th>
              <th className="p-2">course</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.user}-${row.course}`} className={row.gone ? "text-neutral-400 line-through" : ""}>
                <td className="p-2">{row.user}</td>
                <td className="p-2">{row.course}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </UiMockFrame>
  );
}

function EnrollCard({ enrolled, note }: { enrolled: boolean; note: string }) {
  return (
    <UiMockFrame product="Dashboard" url="http://localhost:3000/dashboard">
      <div className="flex min-h-[460px] w-[1040px] flex-col justify-center font-sans text-neutral-900">
        <p className="mt-0 mb-3 text-base font-semibold text-red-700">{note}</p>
        <div className="w-80 rounded border border-neutral-300 bg-white p-4">
          <p className="m-0 text-sm text-neutral-500">RS102</p>
          <p className="m-0 mt-1 text-lg font-semibold">Aerodynamics</p>
          <button
            type="button"
            className={`mt-3 rounded px-3 py-1.5 text-base font-medium text-white ${
              enrolled ? "bg-neutral-700" : "bg-green-700"
            }`}
          >
            {enrolled ? "Unenroll" : "Enroll"}
          </button>
        </div>
      </div>
    </UiMockFrame>
  );
}

export type KambazDbResultId =
  | "courses-one-result"
  | "courses-create-result"
  | "courses-delete-result"
  | "courses-update-result"
  | "modules-create-result"
  | "modules-delete-result"
  | "modules-update-result"
  | "enroll-read-result"
  | "enroll-joins-result"
  | "enroll-create-result"
  | "enroll-unenroll-result";

export default function KambazDbResult({ id }: { id: KambazDbResultId }) {
  if (id === "courses-one-result") {
    return (
      <UiMockFrame product="Course" url="GET /api/courses/RS101">
        <div className="flex min-h-[460px] w-[1040px] flex-col justify-center font-sans text-neutral-900">
          <p className="mt-0 mb-3 text-base font-semibold text-red-700">
            The course header is the one document findById returned.
          </p>
          <h2 className="m-0 text-2xl font-semibold">Rocket Propulsion</h2>
          <p className="m-0 mt-2 text-lg text-neutral-600">RS101 · 4 credits</p>
        </div>
      </UiMockFrame>
    );
  }
  if (id === "courses-create-result") {
    return (
      <CourseList
        rows={[ROCKET, AERO, { id: "new", name: "Combustion Lab", mark: true }]}
        note="POST returned Combustion Lab. The Dashboard appended that document."
      />
    );
  }
  if (id === "courses-delete-result") {
    return (
      <CourseList
        rows={[ROCKET]}
        note="Aerodynamics is gone. GET /api/courses no longer returns RS102."
      />
    );
  }
  if (id === "courses-update-result") {
    return (
      <CourseList
        rows={[{ id: "RS101", name: "Rocket Engines", mark: true }, AERO]}
        note="Save wrote Rocket Engines. The card shows the name MongoDB stored."
      />
    );
  }
  if (id === "modules-create-result") {
    return (
      <ModuleList
        rows={[INTRO, FUEL, { name: "Nozzle Design", mark: true }]}
        note="POST under RS101 appended Nozzle Design."
      />
    );
  }
  if (id === "modules-delete-result") {
    return (
      <ModuleList rows={[INTRO]} note="Fuel and Combustion was deleted. The list no longer shows it." />
    );
  }
  if (id === "modules-update-result") {
    return (
      <ModuleList
        rows={[{ name: "Intro to Propulsion", mark: true }, FUEL]}
        note="Save wrote Intro to Propulsion over the old module name."
      />
    );
  }
  if (id === "enroll-read-result") {
    return (
      <CourseList
        rows={[ROCKET, AERO]}
        note="These are the courses populate returned for the signed-in user."
      />
    );
  }
  if (id === "enroll-joins-result") {
    return (
      <JoinTable
        rows={[
          { user: "ada", course: "RS101" },
          { user: "ada", course: "RS102", gone: true },
          { user: "grace", course: "RS102", gone: true },
        ]}
        note="RS102 is deleted, and every enrollment that pointed at it is gone."
      />
    );
  }
  if (id === "enroll-create-result") {
    return (
      <EnrollCard enrolled note="One enrollment row was inserted. The button now says Unenroll." />
    );
  }
  return <EnrollCard enrolled={false} note="That enrollment row was deleted. The button says Enroll again." />;
}

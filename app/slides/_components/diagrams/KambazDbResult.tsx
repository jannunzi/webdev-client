import UiMockFrame from "./UiMockFrame";

type CourseRow = { id: string; name: string; mark?: boolean };
type ModuleRow = { name: string; mark?: boolean };
type JoinRow = { user: string; course: string; gone?: boolean };

const ROCKET: CourseRow = { id: "RS101", name: "Rocket Propulsion" };
const AERO: CourseRow = { id: "RS102", name: "Aerodynamics" };
const INTRO: ModuleRow = { name: "Introduction to Rocket Propulsion" };
const FUEL: ModuleRow = { name: "Fuel and Combustion" };

function CourseList({ rows }: { rows: CourseRow[] }) {
  return (
    <UiMockFrame product="Dashboard" url="http://localhost:3000/dashboard">
      <div className="w-[1040px] font-sans text-neutral-900">
        <h2 className="m-0 mb-3 text-xl font-semibold">Published Courses ({rows.length})</h2>
        <div className="grid grid-cols-3 gap-3">
          {rows.map((row) => (
            <div
              key={row.id}
              className={`rounded border bg-white p-4 ${
                row.mark ? "border-red-600" : "border-neutral-300"
              }`}
            >
              <h5 className="m-0 text-lg font-semibold">{row.name}</h5>
            </div>
          ))}
        </div>
      </div>
    </UiMockFrame>
  );
}

function ModuleList({ rows }: { rows: ModuleRow[] }) {
  return (
    <UiMockFrame product="Modules" url="http://localhost:3000/courses/RS101/modules">
      <div className="w-[1040px] font-sans text-neutral-900">
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

function JoinTable({ rows }: { rows: JoinRow[] }) {
  const visible = rows.filter((row) => !row.gone);
  return (
    <UiMockFrame product="Compass" url="kambaz.enrollments">
      <div className="w-[1040px] font-sans text-neutral-900">
        <table className="w-full border-collapse text-left text-lg">
          <thead>
            <tr className="border-b border-neutral-300">
              <th className="p-2">user</th>
              <th className="p-2">course</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr key={`${row.user}-${row.course}`}>
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

function EnrollCard({ enrolled }: { enrolled: boolean }) {
  return (
    <UiMockFrame product="Dashboard" url="http://localhost:3000/dashboard">
      <div className="w-[1040px] font-sans text-neutral-900">
        <div className="w-80 rounded border border-neutral-300 bg-white p-4">
          <h5 className="m-0 text-lg font-semibold">Aerodynamics</h5>
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
        <div className="w-[1040px] font-sans text-neutral-900">
          <h2 className="m-0 text-2xl font-semibold text-red-600">Rocket Propulsion &gt; Home</h2>
        </div>
      </UiMockFrame>
    );
  }
  if (id === "courses-create-result") {
    return (
      <CourseList
        rows={[ROCKET, AERO, { id: "new", name: "Combustion Lab", mark: true }]}
      />
    );
  }
  if (id === "courses-delete-result") {
    return (
      <CourseList
        rows={[ROCKET]}
      />
    );
  }
  if (id === "courses-update-result") {
    return (
      <CourseList
        rows={[{ id: "RS101", name: "Rocket Engines", mark: true }, AERO]}
      />
    );
  }
  if (id === "modules-create-result") {
    return (
      <ModuleList
        rows={[INTRO, FUEL, { name: "Nozzle Design", mark: true }]}
      />
    );
  }
  if (id === "modules-delete-result") {
    return (
      <ModuleList rows={[INTRO]} />
    );
  }
  if (id === "modules-update-result") {
    return (
      <ModuleList
        rows={[{ name: "Intro to Propulsion", mark: true }, FUEL]}
      />
    );
  }
  if (id === "enroll-read-result") {
    return (
      <CourseList
        rows={[ROCKET, AERO]}
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
      />
    );
  }
  if (id === "enroll-create-result") {
    return (
      <EnrollCard enrolled />
    );
  }
  return <EnrollCard enrolled={false} />;
}

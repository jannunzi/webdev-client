import UiMockFrame from "./UiMockFrame";

export default function VercelAddProjectMock() {
  return (
    <UiMockFrame product="Vercel" url="vercel.com/dashboard">
      <div className="rounded-lg border-2 border-neutral-800 bg-neutral-900 p-5 text-white">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="m-0 font-sans text-2xl font-semibold">Projects</p>
          <span className="rounded border-2 border-sky-400 bg-sky-950 px-3 py-1 font-sans text-lg font-semibold">
            Add New…
          </span>
        </div>
        <ul className="m-0 ml-auto w-56 list-none space-y-2 p-0 font-sans text-lg">
          <li className="rounded border-2 border-sky-400 bg-sky-950 px-3 py-2 font-semibold">
            Project
          </li>
          <li className="rounded border border-neutral-600 px-3 py-2 text-neutral-400">
            Domain
          </li>
          <li className="rounded border border-neutral-600 px-3 py-2 text-neutral-400">
            Store
          </li>
        </ul>
      </div>
    </UiMockFrame>
  );
}

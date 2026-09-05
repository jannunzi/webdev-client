import UiMockFrame from "./UiMockFrame";

export default function VercelProtectMock() {
  return (
    <UiMockFrame product="Vercel" url="Project → Settings">
      <div className="rounded-lg border-2 border-neutral-800 bg-neutral-900 p-5 text-white">
        <p className="mt-0 mb-4 font-sans text-2xl font-semibold">
          Deployment Protection
        </p>
        <ul className="m-0 list-none space-y-2 p-0 font-sans text-lg">
          <li className="rounded border border-sky-400 bg-sky-950 px-3 py-2">
            Deployment Settings
          </li>
          <li className="rounded border border-neutral-600 px-3 py-2">
            Deployment Protections
          </li>
          <li className="rounded border border-neutral-600 px-3 py-2">
            Standard Protection
          </li>
        </ul>
      </div>
    </UiMockFrame>
  );
}

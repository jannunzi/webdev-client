import UiMockFrame from "./UiMockFrame";

export default function VercelImportMock() {
  return (
    <UiMockFrame product="Vercel" url="vercel.com/new">
      <div className="rounded-lg border-2 border-neutral-800 bg-neutral-900 p-5 text-white">
        <p className="mt-0 mb-4 font-sans text-2xl font-semibold">
          Import Git Repository
        </p>
        <p className="mb-3 font-sans text-lg text-neutral-300">
          Search <span className="font-mono text-white">kambaz-next-js</span>
        </p>
        <div className="flex items-center justify-between gap-3 rounded border border-neutral-600 px-3 py-3">
          <span className="font-mono text-lg">you/kambaz-next-js</span>
          <span className="rounded bg-white px-3 py-1 font-sans text-base text-neutral-900">
            Import
          </span>
        </div>
      </div>
    </UiMockFrame>
  );
}

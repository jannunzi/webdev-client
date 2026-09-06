import UiMockFrame from "./UiMockFrame";

export default function NpmRunDevMock() {
  return (
    <UiMockFrame product="Browser" url="http://localhost:3000">
      <div className="rounded-lg border-2 border-neutral-800 bg-white px-6 py-8 text-center">
        <p className="m-0 font-sans text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Next.js starter
        </p>
        <p className="mt-3 mb-0 font-sans text-3xl font-semibold">kambaz-next-js</p>
        <p className="mt-3 mb-6 font-sans text-lg text-neutral-700">
          Edit <code>app/page.tsx</code> and save to see changes.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <span className="rounded border-2 border-neutral-800 bg-neutral-900 px-4 py-2 font-sans text-base text-white">
            Deploy now
          </span>
          <span className="rounded border-2 border-neutral-800 bg-white px-4 py-2 font-sans text-base">
            Read the docs
          </span>
        </div>
      </div>
    </UiMockFrame>
  );
}

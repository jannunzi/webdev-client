import UiMockFrame from "./UiMockFrame";

export default function VercelAuthMock() {
  return (
    <UiMockFrame product="Vercel" url="Deployment Protection">
      <div className="rounded-lg border-2 border-neutral-800 bg-neutral-900 p-5 text-white">
        <p className="mt-0 mb-2 font-sans text-2xl font-semibold">
          Vercel Authentication
        </p>
        <p className="mb-5 font-sans text-lg text-neutral-300">
          Turn this off so TAs can open the production URL.
        </p>
        <div className="flex items-center justify-between gap-4 rounded border border-neutral-600 px-3 py-3">
          <span className="font-sans text-lg">Vercel Authentication</span>
          <span className="rounded bg-neutral-600 px-3 py-1 font-sans text-base">
            Off
          </span>
        </div>
        <p className="mb-0 mt-5">
          <span className="inline-block rounded bg-white px-4 py-2 font-sans text-lg font-semibold text-neutral-900">
            Save
          </span>
        </p>
      </div>
    </UiMockFrame>
  );
}

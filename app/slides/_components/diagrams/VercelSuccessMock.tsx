import UiMockFrame from "./UiMockFrame";

export default function VercelSuccessMock() {
  return (
    <UiMockFrame product="Vercel" url="kambaz-next-js.vercel.app">
      <div className="rounded-lg border-2 border-neutral-800 bg-neutral-900 p-5 text-white">
        <p className="mt-0 mb-2 font-sans text-2xl font-semibold">
          Congratulations
        </p>
        <p className="mb-5 font-sans text-lg text-neutral-300">
          Production is live. Open the site, then open the dashboard.
        </p>
        <div className="mb-5 rounded border border-neutral-600 bg-white px-4 py-6 text-center text-neutral-900">
          <p className="m-0 font-sans text-2xl font-semibold">Welcome to Web Dev</p>
        </div>
        <span className="inline-block rounded bg-white px-4 py-2 font-sans text-lg font-semibold text-neutral-900">
          Continue to Dashboard
        </span>
      </div>
    </UiMockFrame>
  );
}

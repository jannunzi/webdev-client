import UiMockFrame from "./UiMockFrame";

export default function VercelDeployMock() {
  return (
    <UiMockFrame product="Vercel" url="vercel.com/new">
      <div className="rounded-lg border-2 border-neutral-800 bg-neutral-900 p-5 text-white">
        <p className="mt-0 mb-4 font-sans text-2xl font-semibold">New Project</p>
        <dl className="m-0 grid gap-2 font-sans text-lg">
          <div className="flex justify-between gap-4">
            <dt className="text-neutral-400">Framework</dt>
            <dd className="m-0 font-semibold">Next.js</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-neutral-400">Root Directory</dt>
            <dd className="m-0 font-mono">./</dd>
          </div>
        </dl>
        <p className="mb-0 mt-6">
          <span className="inline-block rounded bg-white px-5 py-2 font-sans text-lg font-semibold text-neutral-900">
            Deploy
          </span>
        </p>
      </div>
    </UiMockFrame>
  );
}

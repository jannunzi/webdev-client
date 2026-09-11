import DiagramFrame from "./DiagramFrame";

export default function VercelDashboardMock() {
  return (
    <DiagramFrame label="Vercel project — same app as localhost">
      <div className="rounded-lg border-2 border-neutral-800 bg-neutral-900 p-5 text-white">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="rounded border border-sky-400 bg-sky-950 px-2 py-1 font-sans text-sm font-semibold uppercase tracking-wide text-sky-200">
            Project name
          </span>
          <p className="m-0 font-sans text-2xl font-semibold">kambaz-next-js</p>
        </div>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="rounded border border-sky-400 bg-sky-950 px-2 py-1 font-sans text-sm font-semibold uppercase tracking-wide text-sky-200">
            Website URL
          </span>
          <p className="m-0 font-mono text-lg">
            kambaz-next-js.vercel.app
          </p>
        </div>
        <svg
          viewBox="0 0 120 28"
          className="mb-4 h-7 w-24 text-sky-300"
          aria-hidden
        >
          <line
            x1="12"
            y1="4"
            x2="12"
            y2="22"
            stroke="currentColor"
            strokeWidth="3"
          />
          <polygon points="12,28 6,18 18,18" fill="currentColor" />
        </svg>
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded border border-sky-400 bg-sky-950 px-2 py-1 font-sans text-sm font-semibold uppercase tracking-wide text-sky-200">
            GitHub branch and commit
          </span>
          <p className="m-0 font-mono text-lg">main · first commit</p>
        </div>
      </div>
    </DiagramFrame>
  );
}

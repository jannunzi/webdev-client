import type { A1GateDiagnostics } from "@/lib/assignments/diagnostics";

function yn(value: boolean): string {
  return value ? "yes" : "no";
}

/**
 * Staff-only A1 gate dump. Students never see this. Use it to tell
 * “Ada works because demo match skips Atlas” from “this session cannot
 * read canvas_roster” vs “signed-in email is not on the roster.”
 */
export default function A1SubmitDiagnostics({
  data,
}: {
  data: A1GateDiagnostics;
}) {
  return (
    <details className="mb-6 rounded-lg border border-neutral-400 bg-neutral-50 px-4 py-3 font-sans text-sm text-neutral-900">
      <summary className="cursor-pointer font-semibold">
        Staff: A1 submit gate
      </summary>
      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-xs">
        <dt>canSubmit</dt>
        <dd className="m-0">{yn(data.canSubmit)}</dd>
        <dt>gateReason</dt>
        <dd className="m-0">{data.gateReason ?? "null"}</dd>
        <dt>accessBypass</dt>
        <dd className="m-0">{data.accessBypass ?? "none"}</dd>
        <dt>signedIn</dt>
        <dd className="m-0">{yn(data.signedIn)}</dd>
        <dt>mongoConfigured</dt>
        <dd className="m-0">{yn(data.mongoConfigured)}</dd>
        <dt>assignmentConfigured</dt>
        <dd className="m-0">{yn(data.assignmentConfigured)}</dd>
        <dt>rosterStatus</dt>
        <dd className="m-0">{data.rosterStatus}</dd>
        <dt>roster source</dt>
        <dd className="m-0">{data.rosterSource ?? "—"}</dd>
        <dt>matched email</dt>
        <dd className="m-0">{data.rosterEmail ?? "—"}</dd>
        <dt>Atlas target</dt>
        <dd className="m-0">
          {data.rosterDb}.{data.rosterCollection}
        </dd>
        <dt>canvas_roster count</dt>
        <dd className="m-0">
          {data.rosterCount == null ? "unreadable" : data.rosterCount}
        </dd>
        <dt>Clerk emails</dt>
        <dd className="m-0">
          {data.clerkEmailCount === 0
            ? "none collected"
            : data.clerkEmails.join(", ")}
        </dd>
        <dt>has @northeastern / husky</dt>
        <dd className="m-0">{yn(data.hasNortheasternEmail)}</dd>
      </dl>
      <p className="mb-0 mt-3 text-neutral-700">
        Ada/Bob can show URL fields when Mongo is off (built-in demo match).
        A real student needs this page to read the Atlas target above. If
        People is empty or the count is unreadable while Compass has rows,
        the app is on a different database or <code>MONGODB_URI</code> is
        missing on this deployment.
      </p>
    </details>
  );
}

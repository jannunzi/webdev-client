import UiMockFrame from "./UiMockFrame";

export default function VercelGitProviderMock() {
  return (
    <UiMockFrame product="Vercel" url="vercel.com/new">
      <div className="rounded-lg border-2 border-neutral-800 bg-neutral-900 p-5 text-white">
        <p className="mt-0 mb-2 font-sans text-2xl font-semibold">
          Import Git Repository
        </p>
        <p className="mb-5 font-sans text-lg text-neutral-300">
          Select a Git provider
        </p>
        <ul className="m-0 list-none space-y-3 p-0 font-sans text-lg">
          <li className="rounded border-2 border-sky-400 bg-sky-950 px-3 py-3 font-semibold">
            Continue with GitHub
          </li>
          <li className="rounded border border-neutral-600 px-3 py-3 text-neutral-400">
            Continue with GitLab
          </li>
          <li className="rounded border border-neutral-600 px-3 py-3 text-neutral-400">
            Continue with Bitbucket
          </li>
        </ul>
      </div>
    </UiMockFrame>
  );
}

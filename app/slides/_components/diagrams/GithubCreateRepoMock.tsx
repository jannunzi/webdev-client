import UiMockFrame from "./UiMockFrame";

export default function GithubCreateRepoMock() {
  return (
    <UiMockFrame product="GitHub.com" url="github.com/new">
      <div className="rounded-lg border-2 border-neutral-800 bg-white p-5">
        <p className="mt-0 mb-4 font-sans text-2xl font-semibold">
          Create a new repository
        </p>
        <label className="block font-sans text-lg">
          <span className="text-neutral-600">Owner</span>
          <span className="mt-1 block rounded border-2 border-neutral-800 px-3 py-2">
            you
          </span>
        </label>
        <label className="mt-4 block font-sans text-lg">
          <span className="text-neutral-600">Repository name</span>
          <span className="mt-1 block rounded border-2 border-sky-600 bg-sky-50 px-3 py-2 font-mono">
            kambaz-next-js
          </span>
        </label>
        <p className="mt-4 mb-0 font-sans text-lg">
          Public · Do not add a README
        </p>
        <p className="mt-5 mb-0">
          <span className="inline-block rounded border-2 border-neutral-800 bg-emerald-700 px-4 py-2 font-sans text-lg text-white">
            Create repository
          </span>
        </p>
      </div>
    </UiMockFrame>
  );
}

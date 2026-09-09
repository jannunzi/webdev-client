import UiMockFrame from "./UiMockFrame";

export default function YoutubeEnableApiMock() {
  return (
    <UiMockFrame product="Google Cloud Console" url="console.cloud.google.com/apis/library">
      <div className="rounded-lg border-2 border-neutral-800 bg-white p-5">
        <p className="mt-0 mb-3 font-sans text-xl text-neutral-500">API Library</p>
        <p className="mb-4 rounded border-2 border-neutral-800 px-3 py-2 font-mono text-lg">
          YouTube Data API v3
        </p>
        <div className="rounded border-2 border-neutral-800 p-4">
          <p className="mt-0 mb-2 font-sans text-2xl font-semibold">YouTube Data API v3</p>
          <p className="mb-4 font-sans text-lg text-neutral-600">
            Search, videos.list, and snippet metadata
          </p>
          <span className="inline-block rounded bg-blue-600 px-4 py-2 font-sans text-lg text-white">
            Enable
          </span>
        </div>
      </div>
    </UiMockFrame>
  );
}

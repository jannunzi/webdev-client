import UiMockFrame from "./UiMockFrame";

export default function GoogleCloudKeyMock() {
  return (
    <UiMockFrame product="Google Cloud Console" url="console.cloud.google.com/apis/credentials">
      <div className="rounded-lg border-2 border-neutral-800 bg-white p-5">
        <p className="mt-0 mb-4 font-sans text-2xl font-semibold">Create credentials</p>
        <div className="space-y-2 font-sans text-lg">
          <p className="mb-2 rounded border-2 border-sky-600 bg-sky-50 px-3 py-2 font-semibold">
            API key
          </p>
          <p className="mb-0 rounded border border-neutral-300 px-3 py-2 text-neutral-500">
            OAuth client ID
          </p>
          <p className="mb-0 rounded border border-neutral-300 px-3 py-2 text-neutral-500">
            Service account
          </p>
        </div>
        <p className="mt-5 mb-0 rounded border-2 border-neutral-800 bg-neutral-100 px-3 py-2 font-mono text-base">
          YOUR_YOUTUBE_API_KEY
        </p>
      </div>
    </UiMockFrame>
  );
}

import UiMockFrame from "./UiMockFrame";

export default function XaiKeyMock() {
  return (
    <UiMockFrame product="xAI Console" url="console.x.ai">
      <div className="rounded-lg border-2 border-neutral-800 bg-neutral-950 p-5 text-white">
        <p className="mt-0 mb-4 font-sans text-2xl font-semibold">Create API key</p>
        <label className="block font-sans text-lg">
          <span className="text-neutral-400">Name</span>
          <span className="mt-1 block rounded border-2 border-sky-400 bg-sky-950 px-3 py-2 font-mono">
            kambaz-grok
          </span>
        </label>
        <p className="mt-5 mb-2 font-sans text-lg">Copy the key once, then test with curl</p>
        <p className="mb-0 rounded border border-neutral-600 bg-neutral-900 px-3 py-2 font-mono text-base">
          XAI_API_KEY=YOUR_XAI_API_KEY
        </p>
      </div>
    </UiMockFrame>
  );
}

import UiMockFrame from "./UiMockFrame";

export default function OpenaiProjectKeyMock() {
  return (
    <UiMockFrame product="OpenAI platform" url="platform.openai.com/api-keys">
      <div className="rounded-lg border-2 border-neutral-800 bg-white p-5">
        <p className="mt-0 mb-4 font-sans text-2xl font-semibold">Create new secret key</p>
        <label className="block font-sans text-lg">
          <span className="text-neutral-600">Name</span>
          <span className="mt-1 block rounded border-2 border-sky-600 bg-sky-50 px-3 py-2 font-mono">
            kambaz-webdev
          </span>
        </label>
        <p className="mt-5 mb-2 font-sans text-lg">
          Copy once. Store in server <span className="font-mono">.env</span>
        </p>
        <p className="mb-0 rounded border-2 border-neutral-800 bg-neutral-100 px-3 py-2 font-mono text-base">
          OPENAI_API_KEY=your-api-key-here
        </p>
      </div>
    </UiMockFrame>
  );
}

import UiMockFrame from "./UiMockFrame";

export default function VercelLoginMock() {
  return (
    <UiMockFrame product="Vercel" url="vercel.com/login">
      <div className="rounded-lg border-2 border-neutral-800 bg-neutral-900 p-5 text-white">
        <p className="mt-0 mb-5 font-sans text-2xl font-semibold">
          Log in to Vercel
        </p>
        <div className="rounded border border-neutral-600 px-3 py-3 font-sans text-lg text-neutral-400">
          Email Address
        </div>
        <p className="mb-4 mt-3">
          <span className="inline-block rounded bg-white px-4 py-2 font-sans text-lg font-semibold text-neutral-900">
            Continue with Email
          </span>
        </p>
        <p className="mb-3 font-sans text-base text-neutral-500">or</p>
        <div className="rounded border-2 border-sky-400 bg-sky-950 px-3 py-3 font-sans text-lg font-semibold">
          Continue with GitHub
        </div>
      </div>
    </UiMockFrame>
  );
}

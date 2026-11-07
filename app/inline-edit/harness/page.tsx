import Link from "next/link";
import { notFound } from "next/navigation";
import InlineEditController from "../InlineEditController";
import "../../book/book.css";

export const dynamic = "force-dynamic";

/**
 * Staff-editor exercise page. It 404s unless INLINE_EDIT_HARNESS=1, and it
 * does not bypass the staff check on the save or suggest routes.
 */
export default function InlineEditHarnessPage() {
  if (process.env.NODE_ENV === "production" || process.env.INLINE_EDIT_HARNESS !== "1") notFound();
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-[1.05rem]">
      <section id="sec-demo">
        <h2 id="intro" className="mb-3 font-sans text-2xl font-semibold">
          1.1 Learning objectives
        </h2>
        <div className="space-y-3">
          <p
            data-src-file="app/book/ch1/sections/IntroAndSetup.tsx"
            data-src-hash="aaaaaaaaaaaaaaaaaaaaaaaa"
            data-edit-kind="jsx"
          >
            The foundation of the web is the{" "}
            <Link href="/book/terms/internet">Internet</Link> and <code>HTML</code>.
          </p>
          <p>A following paragraph stays in place.</p>
        </div>
      </section>
      <InlineEditController forceEnabled />
    </main>
  );
}

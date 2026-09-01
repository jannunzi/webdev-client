import Link from "next/link";
import { LAB5_INTERMEDIATES } from "./index";

export default function Lab5IntermediatesIndex() {
  return (
    <div id="wd-lab5-intermediates">
      <h2>Lab 5 Intermediate Steps</h2>
      <p>
        Progressive HTTP examples from Chapter 5: Route Handlers in
        this Next.js app, then a separate Express server the UI calls
        over HTTP. Import these components into the book chapter
        instead of screenshots.
      </p>
      <ul>
        <li>
          <Link href="/labs/lab5" id="wd-lab5-final-link">
            Final Lab 5 (complete)
          </Link>
        </li>
        {LAB5_INTERMEDIATES.map((step) => (
          <li key={step.slug}>
            <Link href={`/labs/lab5/intermediates/${step.slug}`}>
              {step.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

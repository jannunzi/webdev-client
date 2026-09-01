import Link from "next/link";
import { LAB5_INTERMEDIATES } from "./index";

export default function Lab5IntermediatesIndex() {
  return (
    <div id="wd-lab5-intermediates">
      <h2>Lab 5 Intermediate Steps</h2>
      <p>
        Progressive Express HTTP exercises from Chapter 5, then the Next.js
        Route Handler calculator. Run{" "}
        <code>npm run server:dev</code> in a second terminal so remote
        demos can reach <code>http://localhost:4000</code>.
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

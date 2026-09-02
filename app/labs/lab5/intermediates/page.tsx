import Link from "next/link";
import { LAB5_INTERMEDIATES } from "./index";

export default function Lab5IntermediatesIndex() {
  return (
    <div id="wd-lab5-intermediates">
      <h2>Lab 5 Intermediate Steps</h2>
      <p>
        Progressive Express HTTP exercises from Chapter 5, then the Next.js
        Route Handler calculator. In a second terminal{" "}
        <code>cd kambaz-node-server-app && npm run dev</code>{" "}
        (<code>nodemon</code>) so remote demos reach{" "}
        <code>http://localhost:4000</code>. Render is not required locally.
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

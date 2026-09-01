import Link from "next/link";
import { LAB4_INTERMEDIATES } from "./index";

export default function Lab4IntermediatesIndex() {
  return (
    <div id="wd-lab4-intermediates">
      <h2>Lab 4 Intermediate Steps</h2>
      <p>
        Client-state examples from Chapter 4. Import these components into
        the book chapter instead of screenshots.
      </p>
      <ul>
        <li>
          <Link href="/labs/lab4" id="wd-lab4-final-link">
            Final Lab 4 (complete)
          </Link>
        </li>
        {LAB4_INTERMEDIATES.map((step) => (
          <li key={step.slug}>
            <Link href={`/labs/lab4/intermediates/${step.slug}`}>{step.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

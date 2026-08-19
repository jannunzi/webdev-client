import Link from "next/link";
import { LAB2_INTERMEDIATES } from "./index";

export default function Lab2IntermediatesIndex() {
  return (
    <div id="wd-lab2-intermediates">
      <h2>Lab 2 Intermediate Steps</h2>
      <p>
        Progressive CSS examples from Chapter 2. Import these components into
        the book chapter later instead of screenshots.
      </p>
      <ul>
        <li>
          <Link href="/labs/lab2" id="wd-lab2-final-link">
            Final Lab 2 (complete)
          </Link>
        </li>
        {LAB2_INTERMEDIATES.map((step) => (
          <li key={step.slug}>
            <Link href={`/labs/lab2/intermediates/${step.slug}`}>{step.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

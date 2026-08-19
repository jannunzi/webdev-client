import Link from "next/link";
import { LAB3_INTERMEDIATES } from "./index";

export default function Lab3IntermediatesIndex() {
  return (
    <div id="wd-lab3-intermediates">
      <h2>Lab 3 Intermediate Steps</h2>
      <p>
        Progressive JavaScript examples from Chapter 3. Import these components
        into the book chapter later instead of screenshots.
      </p>
      <ul>
        <li>
          <Link href="/labs/lab3" id="wd-lab3-final-link">
            Final Lab 3 (complete)
          </Link>
        </li>
        {LAB3_INTERMEDIATES.map((step) => (
          <li key={step.slug}>
            <Link href={`/labs/lab3/intermediates/${step.slug}`}>{step.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

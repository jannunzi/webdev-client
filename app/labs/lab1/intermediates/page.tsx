import Link from "next/link";
import { LAB1_INTERMEDIATES } from "./index";

export default function Lab1IntermediatesIndex() {
  return (
    <div id="wd-lab1-intermediates">
      <h2>Lab 1 Intermediate Steps</h2>
      <p>
        Progressive HTML examples from Chapter 1. Import these components into
        the book chapter later instead of screenshots.
      </p>
      <ul>
        <li>
          <Link href="/labs/lab1" id="wd-lab1-final-link">
            Final Lab 1 (complete)
          </Link>
        </li>
        {LAB1_INTERMEDIATES.map((step) => (
          <li key={step.slug}>
            <Link href={`/labs/lab1/intermediates/${step.slug}`}>{step.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

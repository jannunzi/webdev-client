import Link from "next/link";

export default function Labs() {
  return (
    <div id="wd-labs">
      <h1>Labs</h1>
      <h2>Jose Annunziato</h2>
      <ul>
        <li>
          <Link href="/labs/lab1" id="wd-lab1-link">
            Lab 1: HTML Examples
          </Link>
        </li>
        <li>
          <Link href="/labs/lab2" id="wd-lab2-link">
            Lab 2: CSS Basics
          </Link>
        </li>
        <li>
          <Link href="/labs/lab3" id="wd-lab3-link">
            Lab 3: JavaScript Fundamentals
          </Link>
        </li>
        <li>
          <Link href="/labs/lab4" id="wd-lab4-link">
            Lab 4: Client State
          </Link>
        </li>
        <li>
          <Link href="/labs/lab2/intermediates" id="wd-lab2-steps-link">
            Lab 2 Intermediate Steps
          </Link>
        </li>
        <li>
          <Link href="/labs/lab3/intermediates" id="wd-lab3-steps-link">
            Lab 3 Intermediate Steps
          </Link>
        </li>
        <li>
          <Link href="/labs/lab4/intermediates" id="wd-lab4-steps-link">
            Lab 4 Intermediate Steps
          </Link>
        </li>
        <li>
          <Link href="/labs/lab1/intermediates" id="wd-lab1-steps-link">
            Lab 1 Intermediate Steps
          </Link>
        </li>
        <li>
          <Link href="/" id="wd-kambaz-link">
            Kambaz
          </Link>
        </li>
        <li>
          <a
            href="https://github.com/jannunzi"
            id="wd-github"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </li>
      </ul>
    </div>
  );
}

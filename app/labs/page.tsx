import Link from "next/link";

export default function Labs() {
  return (
    <div id="wd-labs">
      <h1>Labs</h1>
      <h2>Jose Annunziato</h2>
      <ul>
        <li>
          <Link href="/syllabus" id="wd-syllabus-link">
            CS 4550 Syllabus
          </Link>
        </li>
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
          <Link href="/labs/lab5" id="wd-lab5-link">
            Lab 5: RESTful Web APIs
          </Link>
        </li>
        <li>
          <Link href="/labs/lab6" id="wd-lab6-link">
            Lab 6: MongoDB
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
          <Link href="/labs/lab5/intermediates" id="wd-lab5-steps-link">
            Lab 5 Intermediate Steps
          </Link>
        </li>
        <li>
          <Link href="/labs/lab6/intermediates" id="wd-lab6-steps-link">
            Lab 6 Intermediate Steps
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
        <li>
          <a
            href="https://github.com/jannunzi"
            id="wd-github-node"
            target="_blank"
            rel="noreferrer"
          >
            Node.js HTTP Server GitHub
          </a>
        </li>
        <li>
          <a
            href="http://localhost:4000"
            id="wd-http-server"
            target="_blank"
            rel="noreferrer"
          >
            HTTP Server (local :4000)
          </a>
        </li>
      </ul>
    </div>
  );
}

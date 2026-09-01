import Link from "next/link";

/** Labs index as shown in §1.3.10 */
export default function LabsIndexDemo() {
  return (
    <div id="wd-labs">
      <h1>Labs</h1>
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
      </ul>
    </div>
  );
}

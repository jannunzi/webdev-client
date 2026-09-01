import Link from "next/link";

/** Labs TOC + content layout from §1.3.11 */
export default function LabsLayoutDemo() {
  return (
    <table>
      <tbody>
        <tr>
          <td valign="top" width="100px">
            <ul>
              <li>
                <Link href="/labs" id="wd-home-link">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/labs/lab1" id="wd-lab1-link">
                  Lab 1
                </Link>
              </li>
              <li>
                <Link href="/labs/lab2" id="wd-lab2-link">
                  Lab 2
                </Link>
              </li>
              <li>
                <Link href="/labs/lab3" id="wd-lab3-link">
                  Lab 3
                </Link>
              </li>
              <li>
                <Link href="/" id="wd-kambaz-link">
                  Kambaz
                </Link>
              </li>
            </ul>
          </td>
          <td valign="top">
            <div id="wd-labs">
              <h1>Labs</h1>
              <ul>
                <li>
                  <Link href="/labs/lab1">Lab 1: HTML Examples</Link>
                </li>
                <li>
                  <Link href="/labs/lab2">Lab 2: CSS Basics</Link>
                </li>
                <li>
                  <Link href="/labs/lab3">Lab 3: JavaScript Fundamentals</Link>
                </li>
              </ul>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

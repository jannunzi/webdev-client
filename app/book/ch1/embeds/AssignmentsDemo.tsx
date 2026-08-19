import Link from "next/link";
import PlainCourseNavigation from "./PlainCourseNavigation";

/**
 * Plain expected output for §1.4.7 — unstyled structure students should match.
 * (The live Kambaz Assignments page is the Chapter 2 styled version.)
 */
export default function AssignmentsDemo() {
  return (
    <div id="wd-courses">
      <h2>Courses 1234</h2>
      <hr />
      <table width="100%">
        <tbody>
          <tr>
            <td valign="top" width="160">
              <PlainCourseNavigation cid="1234" />
            </td>
            <td valign="top">
              <div id="wd-assignments">
                <input
                  placeholder="Search for Assignments"
                  id="wd-search-assignment"
                />{" "}
                <button id="wd-add-assignment-group">+ Group</button>{" "}
                <button id="wd-add-assignment">+ Assignment</button>
                <h3 id="wd-assignments-title">
                  ASSIGNMENTS 40% of Total <button>+</button>
                </h3>
                <ul id="wd-assignment-list">
                  <li className="wd-assignment-list-item">
                    <Link
                      href="/courses/1234/assignments/123"
                      className="wd-assignment-link"
                    >
                      A1 - ENV + HTML
                    </Link>
                    <div>
                      Multiple Modules | Not available until May 6 at 12:00am |
                      <br />
                      Due May 13 at 11:59pm | 100 pts
                    </div>
                  </li>
                  <li className="wd-assignment-list-item">
                    <Link
                      href="/courses/1234/assignments/124"
                      className="wd-assignment-link"
                    >
                      A2 - CSS + TAILWIND
                    </Link>
                    <div>
                      Multiple Modules | Not available until May 13 at 12:00am |
                      <br />
                      Due May 20 at 11:59pm | 100 pts
                    </div>
                  </li>
                  <li className="wd-assignment-list-item">
                    <Link
                      href="/courses/1234/assignments/125"
                      className="wd-assignment-link"
                    >
                      A3 - JAVASCRIPT + REACT
                    </Link>
                    <div>
                      Multiple Modules | Not available until May 20 at 12:00am |
                      <br />
                      Due May 27 at 11:59pm | 100 pts
                    </div>
                  </li>
                </ul>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

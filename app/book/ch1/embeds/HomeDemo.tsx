import PlainCourseNavigation from "./PlainCourseNavigation";

/**
 * Plain expected output for §1.4.6 — Modules + Course Status side by side.
 * (Live Home page is the Chapter 2 styled version.)
 */
function PlainModules() {
  return (
    <div>
      <button type="button">Collapse All</button>{" "}
      <button type="button">View Progress</button>{" "}
      <select defaultValue="publish-all">
        <option value="publish-all">Publish All</option>
      </select>{" "}
      <button type="button">+ Module</button>
      <ul id="wd-modules">
        <li className="wd-module">
          <div className="wd-title">
            Week 1, Lecture 1 - Course Introduction, Syllabus, Agenda
          </div>
          <ul className="wd-lessons">
            <li className="wd-lesson">
              <span className="wd-title">LEARNING OBJECTIVES</span>
              <ul className="wd-content">
                <li className="wd-content-item">Introduction to the course</li>
                <li className="wd-content-item">Learn what is Web Development</li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
}

function PlainCourseStatus() {
  return (
    <div id="wd-course-status">
      <h2>Course Status</h2>
      <button type="button">Unpublish</button>{" "}
      <button type="button">Publish</button>
      <br />
      <button type="button">Import Existing Content</button>
      <br />
      <button type="button">Import from Commons</button>
      <br />
      <button type="button">Choose Home Page</button>
      <br />
      <button type="button">View Course Stream</button>
      <br />
      <button type="button">New Announcement</button>
      <br />
      <button type="button">New Analytics</button>
      <br />
      <button type="button">View Course Notifications</button>
    </div>
  );
}

export default function HomeDemo() {
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
              <div id="wd-home">
                <table width="100%">
                  <tbody>
                    <tr>
                      <td valign="top" width="70%">
                        <PlainModules />
                      </td>
                      <td valign="top">
                        <PlainCourseStatus />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

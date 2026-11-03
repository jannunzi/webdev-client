/**
 * Plain expected output for §1.7 — static AI Assisted Course Builder controls.
 * Buttons do nothing. No Tailwind (Chapter 2 styles this thread later).
 */
export default function AiCourseBuilderDemo() {
  return (
    <div>
      <div id="wd-course-editor">
        <h2>Course Editor</h2>
        <label htmlFor="wd-course-title">Title</label>
        <br />
        <input id="wd-course-title" defaultValue="Web Development" />
        <br />
        <br />
        <label htmlFor="wd-course-description">Description</label>
        <br />
        <textarea
          id="wd-course-description"
          rows={4}
          cols={40}
          defaultValue="Build web applications with HTML."
        />
        <br />
        <br />
        <button type="button" id="wd-generate-description">
          Generate description from title
        </button>{" "}
        <button type="button" id="wd-generate-title">
          Generate title from description
        </button>
      </div>
      <hr />
      <button type="button">Collapse All</button>{" "}
      <button type="button">View Progress</button>{" "}
      <select defaultValue="publish-all">
        <option value="publish-all">Publish All</option>
      </select>{" "}
      <button type="button">+ Module</button>{" "}
      <button type="button" id="wd-ai-suggest-modules">
        AI: suggest modules
      </button>
      <ul id="wd-modules">
        <li className="wd-module">
          <div className="wd-title">
            Week 1, Lecture 1 - Course Introduction, Syllabus, Agenda
          </div>
          <label>
            Lesson type{" "}
            <select className="wd-lesson-type" defaultValue="Reading">
              <option value="Reading">Reading</option>
              <option value="Slides">Slides</option>
              <option value="Quiz">Quiz</option>
            </select>
          </label>{" "}
          <button type="button" className="wd-generate-lessons">
            Generate lessons
          </button>
          <ul className="wd-lessons">
            <li className="wd-lesson">
              <span className="wd-title">READING</span>
              <ul className="wd-content">
                <li className="wd-content-item">
                  Full Stack Developer - Chapter 1 - Introduction
                </li>
              </ul>
            </li>
          </ul>
          <button type="button" className="wd-ai-next-lesson">
            AI: next lesson
          </button>
        </li>
      </ul>
      <button type="button" id="wd-ai-next-module">
        AI: next module
      </button>
    </div>
  );
}

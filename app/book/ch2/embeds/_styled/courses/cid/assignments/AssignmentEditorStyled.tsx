import Link from "next/link";

export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor" className="max-w-3xl space-y-4 p-4">
      <div>
        <label htmlFor="wd-name" className="mb-1 block font-medium">
          Assignment Name
        </label>
        <input
          id="wd-name"
          defaultValue="A1 - ENV + HTML"
          className="w-full rounded border px-3 py-2"
        />
      </div>
      <textarea
        id="wd-description"
        rows={6}
        defaultValue="The assignment is available online Submit a link to the landing page of your Web application running on Vercel."
        className="w-full rounded border px-3 py-2"
      />
      <div className="grid grid-cols-[10rem_1fr] items-center gap-4">
        <label htmlFor="wd-points" className="text-right">Points</label>
        <input id="wd-points" defaultValue={100} className="w-full rounded border px-3 py-2" />

        <label htmlFor="wd-group" className="text-right">Assignment Group</label>
        <select id="wd-group" defaultValue="ASSIGNMENTS" className="w-full rounded border px-3 py-2">
          <option value="ASSIGNMENTS">ASSIGNMENTS</option>
          <option value="QUIZZES">QUIZZES</option>
          <option value="EXAMS">EXAMS</option>
          <option value="PROJECT">PROJECT</option>
        </select>

        <label htmlFor="wd-display-grade-as" className="text-right">Display Grade as</label>
        <select id="wd-display-grade-as" defaultValue="PERCENTAGE" className="w-full rounded border px-3 py-2">
          <option value="PERCENTAGE">Percentage</option>
          <option value="POINTS">Points</option>
        </select>

        <label htmlFor="wd-submission-type" className="self-start pt-2 text-right">
          Submission Type
        </label>
        <div className="space-y-3 rounded border p-4">
          <select id="wd-submission-type" defaultValue="ONLINE" className="w-full rounded border px-3 py-2">
            <option value="ONLINE">Online</option>
            <option value="ON_PAPER">On Paper</option>
          </select>
          <div className="font-semibold">Online Entry Options</div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="wd-text-entry" />
            <label htmlFor="wd-text-entry">Text Entry</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="wd-website-url" />
            <label htmlFor="wd-website-url">Website URL</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="wd-media-recordings" />
            <label htmlFor="wd-media-recordings">Media Recordings</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="wd-student-annotation" />
            <label htmlFor="wd-student-annotation">Student Annotation</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="wd-file-upload" />
            <label htmlFor="wd-file-upload">File Uploads</label>
          </div>
        </div>

        <div className="self-start pt-2 text-right">Assign</div>
        <div className="space-y-3 rounded border p-4">
          <div>
            <label htmlFor="wd-assign-to" className="mb-1 block font-semibold">Assign to</label>
            <input id="wd-assign-to" defaultValue="Everyone" className="w-full rounded border px-3 py-2" />
          </div>
          <div>
            <label htmlFor="wd-due-date" className="mb-1 block font-semibold">Due</label>
            <input type="date" id="wd-due-date" defaultValue="2024-05-13" className="w-full rounded border px-3 py-2" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="wd-available-from" className="mb-1 block font-semibold">Available from</label>
              <input type="date" id="wd-available-from" defaultValue="2024-05-06" className="w-full rounded border px-3 py-2" />
            </div>
            <div>
              <label htmlFor="wd-available-until" className="mb-1 block font-semibold">Until</label>
              <input type="date" id="wd-available-until" defaultValue="2024-05-20" className="w-full rounded border px-3 py-2" />
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="flex justify-end gap-2">
        <Link href="/courses/1234/assignments" id="wd-cancel" className="rounded bg-neutral-200 px-4 py-2">
          Cancel
        </Link>
        <Link href="/courses/1234/assignments" id="wd-save" className="rounded bg-red-600 px-4 py-2 text-white">
          Save
        </Link>
      </div>
    </div>
  );
}

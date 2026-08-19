/**
 * Plain Chapter 1 Assignment Editor — unstyled HTML form.
 * (Live editor page is what students style in Chapter 2.)
 */
export default function AssignmentEditorDemo() {
  return (
    <div id="wd-assignments-editor">
      <label htmlFor="wd-name-demo">Assignment Name</label>
      <input id="wd-name-demo" defaultValue="A1 - ENV + HTML" />
      <br />
      <br />
      <textarea id="wd-description-demo" defaultValue="The assignment is available online Submit a link to the landing page of your Web application running on Vercel." />
      <br />
      <br />
      <label htmlFor="wd-points-demo">Points</label>
      <input id="wd-points-demo" defaultValue={100} />
      <br />
      <br />
      <button type="button">Cancel</button>{" "}
      <button type="button">Save</button>
    </div>
  );
}

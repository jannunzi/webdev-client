/** Section 1.3.6.5 — Single-select dropdown only */
export default function DropdownSingle() {
  return (
    <>
      <h4 id="wd-dropdowns">Dropdowns</h4>
      <h5>Select one</h5>
      <label htmlFor="wd-select-one-genre">Favorite movie genre: </label>
      <br />
      <select id="wd-select-one-genre" defaultValue="SCIFI">
        <option value="COMEDY">Comedy</option>
        <option value="DRAMA">Drama</option>
        <option value="SCIFI">Science Fiction</option>
        <option value="FANTASY">Fantasy</option>
      </select>
    </>
  );
}

/** Section 1.3.7.3 — Two radio groups (different name values) */
export default function RadioTwoGroups() {
  return (
    <div>
      <h5>Two radio groups</h5>
      <p>Favorite movie genre:</p>
      <input type="radio" name="radio-genre" id="wd-radio2-comedy" />
      <label htmlFor="wd-radio2-comedy">Comedy</label>
      <br />
      <input type="radio" name="radio-genre" id="wd-radio2-drama" />
      <label htmlFor="wd-radio2-drama">Drama</label>
      <br />
      <input type="radio" name="radio-genre" id="wd-radio2-scifi" />
      <label htmlFor="wd-radio2-scifi">Science Fiction</label>

      <p style={{ marginTop: "1rem" }}>How often do you watch movies?</p>
      <input type="radio" name="radio-frequency" id="wd-radio-daily" />
      <label htmlFor="wd-radio-daily">Daily</label>
      <br />
      <input type="radio" name="radio-frequency" id="wd-radio-weekly" />
      <label htmlFor="wd-radio-weekly">Weekly</label>
      <br />
      <input type="radio" name="radio-frequency" id="wd-radio-rarely" />
      <label htmlFor="wd-radio-rarely">Rarely</label>
    </div>
  );
}

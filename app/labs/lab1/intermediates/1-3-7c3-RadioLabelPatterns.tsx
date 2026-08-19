/** Section 1.3.7.3 — Sibling labels (htmlFor) vs wrapping labels */
export default function RadioLabelPatterns() {
  return (
    <div>
      <h5>Label next to the input (uses htmlFor)</h5>
      <input type="radio" name="radio-beside" id="wd-radio-beside-yes" />
      <label htmlFor="wd-radio-beside-yes">Yes</label>
      <br />
      <input type="radio" name="radio-beside" id="wd-radio-beside-no" />
      <label htmlFor="wd-radio-beside-no">No</label>

      <h5 style={{ marginTop: "1rem" }}>
        Label wrapping the input (no htmlFor needed)
      </h5>
      <label>
        <input type="radio" name="radio-wrap" /> Yes
      </label>
      <br />
      <label>
        <input type="radio" name="radio-wrap" /> No
      </label>

      <h5 style={{ marginTop: "1rem" }}>
        Separate label and input (not side by side)
      </h5>
      <p>
        With <code>htmlFor</code>, the caption and control do not have to sit
        next to each other:
      </p>
      <div style={{ display: "flex", gap: "2rem" }}>
        <div>
          <div>
            <label htmlFor="wd-radio-distant-a">Option A</label>
          </div>
          <div>
            <label htmlFor="wd-radio-distant-b">Option B</label>
          </div>
        </div>
        <div>
          <div>
            <input type="radio" name="radio-distant" id="wd-radio-distant-a" />
          </div>
          <div>
            <input type="radio" name="radio-distant" id="wd-radio-distant-b" />
          </div>
        </div>
      </div>
    </div>
  );
}

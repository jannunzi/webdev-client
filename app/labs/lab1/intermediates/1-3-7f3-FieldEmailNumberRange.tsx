/** Section 1.3.6.6 — email + number + range */
export default function FieldEmailNumberRange() {
  return (
    <>
      <h4>Other HTML field types</h4>
      <label htmlFor="wd-text-fields-email">Email: </label>
      <input
        type="email"
        placeholder="jdoe@somewhere.com"
        id="wd-text-fields-email"
      />
      <br />
      <label htmlFor="wd-text-fields-salary-start">Starting salary: </label>
      <input
        type="number"
        defaultValue="100000"
        placeholder="1000"
        min={0}
        id="wd-text-fields-salary-start"
      />
      <br />
      <label htmlFor="wd-text-fields-rating">Rating: </label>
      <input
        type="range"
        defaultValue="4"
        min="1"
        max="5"
        id="wd-text-fields-rating"
      />
      <br />
    </>
  );
}

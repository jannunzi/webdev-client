export default function OtherFieldTypes() {
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
      <label htmlFor="wd-text-fields-dob">Date of birth: </label>
      <input
        type="date"
        defaultValue="2000-01-21"
        min="1900-01-01"
        max="2025-12-31"
        id="wd-text-fields-dob"
      />
      <br />
    </>
  );
}

import LectureDemoFrame from "./LectureDemoFrame";

export default function FileFieldEmbed() {
  return (
    <LectureDemoFrame label="type=file">
      <form
        className="font-sans text-lg"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <label htmlFor="wd-file">Upload:</label>{" "}
        <input type="file" id="wd-file" />
      </form>
    </LectureDemoFrame>
  );
}

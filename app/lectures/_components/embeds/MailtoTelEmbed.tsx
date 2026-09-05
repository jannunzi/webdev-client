import LectureDemoFrame from "./LectureDemoFrame";

export default function MailtoTelEmbed() {
  return (
    <LectureDemoFrame label="mailto: and tel:">
      <p className="mt-0 mb-0 font-sans text-xl [&_a]:underline">
        <a href="mailto:ada@example.com">Email Ada</a>
        {" · "}
        <a href="tel:+16175551212">Call the office</a>
      </p>
    </LectureDemoFrame>
  );
}

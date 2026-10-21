import CourseBadge from "./CourseBadge";

export default function TypedProps() {
  return (
    <div id="wd-typed-props">
      <h4>Typing React Props</h4>
      <CourseBadge number="CS5610">Web Development</CourseBadge>
      <CourseBadge number="CS5800" credits={3}>
        Algorithms
      </CourseBadge>
      <hr />
    </div>
  );
}

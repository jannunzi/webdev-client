export default function TypeAnnotations() {
  const course: string = "Web Development";
  const credits: number = 4;
  const isOnline: boolean = false;
  const topics: string[] = ["HTML", "CSS", "JavaScript"];
  const section = "CS5610"; // inferred as string
  const seats = 40; // inferred as number
  return (
    <div id="wd-type-annotations">
      <h4>Type Annotations</h4>
      course = {course} <br />
      credits = {credits} <br />
      isOnline = {isOnline + ""} <br />
      topics = {topics.join(", ")} <br />
      section = {section}, seats = {seats}
      <hr />
    </div>
  );
}

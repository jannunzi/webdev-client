type Course = {
  name: string;
  number: string;
  credits: number;
};

type CourseUpdate = Partial<Course>;
type CourseField = keyof Course;
type Enrollment = Record<string, number>;

export default function UtilityTypes() {
  const course: Course = { name: "Web Dev", number: "CS5610", credits: 4 };
  const update: CourseUpdate = { name: "Web Development" };
  const updated: Course = { ...course, ...update };
  const fields: CourseField[] = ["name", "number", "credits"];
  const enrollment: Enrollment = { CS5610: 120, CS5800: 85 };
  return (
    <div id="wd-utility-types">
      <h4>Utility Types</h4>
      updated.name = {updated.name} <br />
      fields = {fields.map((field) => `${field}: ${updated[field]}`).join(", ")}{" "}
      <br />
      enrollment.CS5610 = {enrollment.CS5610}, enrollment.CS5800 ={" "}
      {enrollment.CS5800}
      <hr />
    </div>
  );
}

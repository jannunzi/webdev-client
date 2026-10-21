interface Person {
  firstName: string;
  lastName: string;
}

interface Student extends Person {
  nuid: string;
  section: string;
}

type Faculty = Person & { office: string };

export default function Interfaces() {
  const student: Student = {
    firstName: "Alice",
    lastName: "Wonderland",
    nuid: "001234567",
    section: "CS5610-02",
  };
  const faculty: Faculty = {
    firstName: "Bob",
    lastName: "Builder",
    office: "WVH 310",
  };
  return (
    <div id="wd-interfaces">
      <h4>Interfaces</h4>
      {student.firstName} {student.lastName} ({student.nuid}) is in{" "}
      {student.section} <br />
      {faculty.firstName} {faculty.lastName} works in {faculty.office}
      <hr />
    </div>
  );
}

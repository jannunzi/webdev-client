type Role = "STUDENT" | "FACULTY" | "TA";
type Id = string | number;

export default function UnionTypes() {
  const role: Role = "FACULTY";
  const courseId: Id = "RS101";
  const userId: Id = 123;
  const roles: Role[] = ["STUDENT", "FACULTY", "TA"];
  return (
    <div id="wd-union-types">
      <h4>Union and Literal Types</h4>
      role = {role} <br />
      courseId = {courseId}, userId = {userId} <br />
      roles = {roles.join(" | ")}
      <hr />
    </div>
  );
}

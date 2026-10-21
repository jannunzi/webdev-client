enum Grade {
  A = "A",
  B = "B",
  C = "C",
}

enum Weekday {
  Monday,
  Tuesday,
  Wednesday,
}

type Status = "OPEN" | "CLOSED";

export default function Enums() {
  const grade: Grade = Grade.A;
  const day: Weekday = Weekday.Wednesday;
  const status: Status = "OPEN";
  return (
    <div id="wd-enums">
      <h4>Enums</h4>
      grade = {grade} <br />
      day = {day} ({Weekday[day]}) <br />
      status = {status}
      <hr />
    </div>
  );
}

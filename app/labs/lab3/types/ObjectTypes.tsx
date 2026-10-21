type Course = {
  name: string;
  number: string;
  credits: number;
  description?: string;
};

export default function ObjectTypes() {
  const webDev: Course = {
    name: "Web Development",
    number: "CS5610",
    credits: 4,
    description: "Full stack web apps",
  };
  const algorithms: Course = {
    name: "Algorithms",
    number: "CS5800",
    credits: 4,
  };
  return (
    <div id="wd-object-types">
      <h4>Object Types</h4>
      {webDev.number} {webDev.name}: {webDev.description} <br />
      {algorithms.number} {algorithms.name}:{" "}
      {algorithms.description ?? "no description"}
      <hr />
    </div>
  );
}

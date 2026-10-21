import DiagramFrame from "./DiagramFrame";

const ROWS = [
  ["usePathname()", "next/navigation", "The current URL path as a string, such as /courses/1234/home."],
  ["useSearchParams()", "next/navigation", "A read-only object for the query string; .get(\"name\") returns one value or null."],
  ["useParams()", "next/navigation", "An object with the route's dynamic segments, such as { cid: \"1234\" } for [cid]."],
  ["useState(initial)", "react", "A pair: the current value and a setter that changes it and renders again."],
  ["useEffect(fn, deps)", "react", "Nothing; it schedules fn to run after render, and fn may return a cleanup function."],
] as const;

export default function HooksTableDiagram() {
  return (
    <DiagramFrame label="Hooks so far">
      <table className="w-full border-collapse text-left font-sans text-lg">
        <thead>
          <tr className="border-b-2 border-neutral-300">
            <th className="py-2 pe-4">Hook</th>
            <th className="py-2 pe-4">From</th>
            <th className="py-2">Returns</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map(([hook, from, returns]) => (
            <tr key={hook} className="border-b border-neutral-200 last:border-b-0">
              <td className="py-2 pe-4 font-mono whitespace-nowrap">{hook}</td>
              <td className="py-2 pe-4 font-mono whitespace-nowrap">{from}</td>
              <td className="py-2">{returns}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </DiagramFrame>
  );
}

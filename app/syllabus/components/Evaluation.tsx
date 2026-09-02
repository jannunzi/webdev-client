import type { EvaluationItem, GradeBand } from "../data/types";
import SyllabusSection from "./SyllabusSection";

export default function Evaluation({
  items,
  bands,
  notes,
}: {
  items: EvaluationItem[];
  bands: GradeBand[];
  notes: string[];
}) {
  const total = items.reduce((sum, item) => sum + item.weight, 0);

  return (
    <SyllabusSection id="evaluation" title="Evaluation">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-neutral-300 bg-neutral-100 font-sans text-sm">
              <th className="px-3 py-2 font-semibold">Component</th>
              <th className="px-3 py-2 font-semibold">Weight</th>
              <th className="px-3 py-2 font-semibold">What it is</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.label} className="border-b border-neutral-200 align-top">
                <td className="px-3 py-2 font-medium">{item.label}</td>
                <td className="px-3 py-2 tabular-nums">{item.weight}%</td>
                <td className="px-3 py-2 text-neutral-800">{item.description}</td>
              </tr>
            ))}
            <tr className="bg-neutral-50 font-sans text-sm font-semibold">
              <td className="px-3 py-2">Total</td>
              <td className="px-3 py-2 tabular-nums">{total}%</td>
              <td className="px-3 py-2" />
            </tr>
          </tbody>
        </table>
      </div>
      {notes.map((note) => (
        <p key={note.slice(0, 40)}>{note}</p>
      ))}
      <h3 className="font-sans text-lg font-semibold">Letter grades</h3>
      <p>
        Final averages map to letters as follows. Thresholds are inclusive of
        the listed minimum.
      </p>
      <ul className="flex flex-wrap gap-2 pl-0 font-sans text-sm">
        {bands.map((band) => (
          <li
            key={band.letter}
            className="rounded border border-neutral-200 bg-white px-2 py-1"
          >
            <span className="font-semibold">{band.letter}</span>{" "}
            <span className="text-neutral-600">
              {band.minimum}
              {band.letter === "F" ? "" : "+"}
            </span>
          </li>
        ))}
      </ul>
    </SyllabusSection>
  );
}

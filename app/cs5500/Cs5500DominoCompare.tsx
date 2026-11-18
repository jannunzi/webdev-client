import {
  cs5500AiEnhancements,
  cs5500DominoCompareTitle,
  cs5500DominoCourse,
  cs5500DominoOverlap,
  cs5500DominoScheduleMap,
  cs5500DominoSources,
  cs5500DominoUnits,
  cs5500OnlyCmu,
  cs5500OnlyDomino,
  cs5500StructureDiffs,
} from "@/lib/courses/cs5500-domino-compare";

const tableClass = "w-full border-collapse text-left text-sm";
const headClass = "border-b border-neutral-300 bg-neutral-100 font-sans";
const cellClass = "border-b border-neutral-200 px-3 py-2 align-top";

export default function Cs5500DominoCompare() {
  const overlap = cs5500DominoOverlap;
  return (
    <section id="wd-cs5500-domino" className="mt-10" aria-labelledby="wd-cs5500-domino-title">
      <h2
        id="wd-cs5500-domino-title"
        className="mt-0 font-sans text-xl font-semibold"
      >
        {cs5500DominoCompareTitle}
      </h2>
      <p className="text-neutral-800">
        Summary of {cs5500DominoCourse.instructor}&apos;s {cs5500DominoCourse.term}{" "}
        Northeastern CS5500, compared with CMU 17-313. This is a topic-level
        summary, not a copy of her materials.
      </p>
      <p className="text-neutral-800">
        <span className="font-sans font-semibold">Format. </span>
        {cs5500DominoCourse.format}
      </p>
      <div className="overflow-x-auto rounded-md border border-neutral-200">
        <table className={tableClass}>
          <caption className="sr-only">Grading</caption>
          <thead>
            <tr className={headClass}>
              <th className="px-3 py-2 font-semibold">Item</th>
              <th className="px-3 py-2 font-semibold">Percent</th>
            </tr>
          </thead>
          <tbody>
            {cs5500DominoCourse.grading.map((row) => (
              <tr key={row.item}>
                <td className={cellClass}>{row.item}</td>
                <td className={`${cellClass} tabular-nums`}>{row.pct}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-neutral-800">
        <span className="font-sans font-semibold">Exams. </span>
        {cs5500DominoCourse.exams}
      </p>
      <p className="text-neutral-800">
        <span className="font-sans font-semibold">AI policy. </span>
        {cs5500DominoCourse.aiPolicy}
      </p>

      <h3 className="font-sans text-lg font-semibold">Unit by unit</h3>
      <div className="overflow-x-auto rounded-md border border-neutral-200">
        <table className={tableClass}>
          <thead>
            <tr className={headClass}>
              <th className="px-3 py-2 font-semibold">Northeastern unit</th>
              <th className="px-3 py-2 font-semibold">Closest CMU topic</th>
            </tr>
          </thead>
          <tbody>
            {cs5500DominoUnits.map((row) => (
              <tr key={row.unit}>
                <td className={cellClass}>{row.unit}</td>
                <td className={cellClass}>{row.cmu}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="font-sans text-lg font-semibold">Overlap</h3>
      <p id="wd-cs5500-domino-overlap" className="text-neutral-800">
        {overlap.cmuTopics} CMU topics: {overlap.full} full, {overlap.partial}{" "}
        partial, {overlap.none} none. Roughly {overlap.weightedPct}% weighted,{" "}
        {overlap.touchedPct}% touched, {overlap.fullyMatchedPct}% fully matched.{" "}
        {overlap.note}
      </p>
      <p id="wd-cs5500-domino-weeks" className="text-neutral-800">
        {cs5500DominoScheduleMap}
      </p>

      <h3 className="font-sans text-lg font-semibold">Only in CMU</h3>
      <ul className="m-0 list-disc ps-5">
        {cs5500OnlyCmu.map((item) => (
          <li key={item} className="mt-1">
            {item}
          </li>
        ))}
      </ul>
      <h3 className="font-sans text-lg font-semibold">Only in Northeastern CS5500</h3>
      <ul className="m-0 list-disc ps-5">
        {cs5500OnlyDomino.map((item) => (
          <li key={item} className="mt-1">
            {item}
          </li>
        ))}
      </ul>

      <h3 className="font-sans text-lg font-semibold">Structure differences</h3>
      <div className="overflow-x-auto rounded-md border border-neutral-200">
        <table className={tableClass}>
          <thead>
            <tr className={headClass}>
              <th className="px-3 py-2 font-semibold">Dimension</th>
              <th className="px-3 py-2 font-semibold">Northeastern CS5500</th>
              <th className="px-3 py-2 font-semibold">CMU 17-313</th>
            </tr>
          </thead>
          <tbody>
            {cs5500StructureDiffs.map((row) => (
              <tr key={row.dimension}>
                <td className={cellClass}>{row.dimension}</td>
                <td className={cellClass}>{row.cs5500}</td>
                <td className={cellClass}>{row.cmu}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="font-sans text-lg font-semibold">How we could enhance it with AI</h3>
      {cs5500AiEnhancements.map((unit) => (
        <div key={unit.unit} className="mt-4">
          <h4 className="mb-1 mt-0 font-sans text-base font-semibold">{unit.unit}</h4>
          <ul className="m-0 list-disc ps-5">
            {unit.ideas.map((idea) => (
              <li key={idea} className="mt-1">
                {idea}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <h3 className="font-sans text-lg font-semibold">Sources</h3>
      <ul className="m-0 list-disc ps-5">
        {cs5500DominoSources.map((source) => (
          <li key={source.url} className="mt-1">
            <a href={source.url} target="_blank" rel="noopener noreferrer">
              {source.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

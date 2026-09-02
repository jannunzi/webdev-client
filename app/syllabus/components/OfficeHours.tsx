import type { OfficeHourRow } from "../data/types";
import SyllabusSection from "./SyllabusSection";

export default function OfficeHours({
  rows,
  columns,
  placeholder,
}: {
  rows: OfficeHourRow[];
  columns: readonly string[];
  placeholder: string;
}) {
  return (
    <SyllabusSection id="office-hours" title="Teaching assistants and office hours">
      <p>{placeholder}</p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-300 bg-neutral-100 font-sans">
              {columns.map((column) => (
                <th key={column} className="px-3 py-2 font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr className="border-b border-neutral-200">
                <td
                  className="px-3 py-3 text-neutral-500 italic"
                  colSpan={columns.length}
                >
                  TBA
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.name} className="border-b border-neutral-200">
                  <td className="px-3 py-2">{row.name}</td>
                  <td className="px-3 py-2">{row.role}</td>
                  <td className="px-3 py-2">{row.hours}</td>
                  <td className="px-3 py-2">{row.location}</td>
                  <td className="px-3 py-2">{row.contact}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </SyllabusSection>
  );
}

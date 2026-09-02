import type { CourseSection } from "../data/types";

export default function SectionTabs({
  sections,
  activeId,
  onSelect,
}: {
  sections: CourseSection[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Course section"
      className="flex flex-wrap gap-2 font-sans text-sm"
    >
      {sections.map((section) => {
        const selected = section.id === activeId;
        return (
          <button
            key={section.id}
            type="button"
            role="tab"
            id={`syllabus-tab-${section.id}`}
            aria-selected={selected}
            aria-controls="syllabus-agenda-panel"
            onClick={() => onSelect(section.id)}
            className={
              selected
                ? "rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 font-medium text-white"
                : "rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-neutral-800 hover:bg-neutral-100"
            }
          >
            {section.tabLabel}
          </button>
        );
      })}
    </div>
  );
}

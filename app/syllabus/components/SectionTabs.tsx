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
    <div className="sticky top-0 z-10 mb-6 border-b border-neutral-200 bg-[#fafafa]/95 py-3 backdrop-blur-sm">
      <p className="mb-2 font-sans text-sm font-medium text-neutral-600">
        Choose your section
      </p>
      <div
        role="tablist"
        aria-label="Course section"
        className="flex flex-wrap gap-2 font-sans text-base"
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
                  ? "rounded-md border-2 border-neutral-900 bg-neutral-900 px-4 py-2.5 font-semibold text-white shadow-sm"
                  : "rounded-md border-2 border-neutral-300 bg-white px-4 py-2.5 font-medium text-neutral-800 hover:border-neutral-500 hover:bg-neutral-100"
              }
            >
              {section.tabLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}

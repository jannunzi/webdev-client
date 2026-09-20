import type { CodingPreview as Preview } from "@/lib/question-bank";

export default function CodingPreview({ preview }: { preview: Preview }) {
  if (preview.kind === "form-input") {
    return (
      <div className="mt-3 rounded-lg border border-sky-200 bg-sky-50 px-3 py-3">
        <p className="mt-0 mb-2 text-xs font-semibold uppercase tracking-wide text-sky-900">
          Try this field
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor={preview.inputId} className="font-medium text-sky-950">
            {preview.label}
          </label>
          <input
            id={preview.inputId}
            name={preview.inputId}
            title={preview.title}
            defaultValue={preview.defaultValue}
            placeholder={preview.placeholder}
            className="rounded border border-neutral-400 bg-white px-2 py-1"
          />
        </div>
        <p className="mb-0 mt-2 text-sm text-sky-950">
          Hover the field for a tooltip. Clear it to see the gray example
          text. Click the label to focus the input.
        </p>
      </div>
    );
  }

  if (preview.kind === "bullet-list") {
    return (
      <div className="mt-3 rounded-lg border border-sky-200 bg-sky-50 px-3 py-3">
        <p className="mt-0 mb-2 text-xs font-semibold uppercase tracking-wide text-sky-900">
          Produce this list
        </p>
        <ul className="mb-0 list-disc pl-5 text-sky-950">
          {preview.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    );
  }

  if (preview.kind === "styled-box") {
    return (
      <div className="mt-3">
        <p className="mt-0 mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-600">
          Styled result
        </p>
        <div style={preview.style}>{preview.text}</div>
      </div>
    );
  }

  return (
    <p className="mt-3 mb-0 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-800">
      {preview.text}
    </p>
  );
}

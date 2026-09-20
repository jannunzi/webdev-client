/**
 * Shared take-page FIB answers: a numbered list of inputs that matches
 * inline `___1___` / `___2___` tokens in the stem or coding template.
 */
export default function FibBlankFields({
  questionId,
  blankCount,
}: {
  questionId: string;
  blankCount: number;
}) {
  const count = blankCount > 0 ? blankCount : 1;

  if (count === 1) {
    return (
      <label className="mt-3 block text-sm">
        <span className="mb-1 block text-neutral-600">Answer</span>
        <input
          type="text"
          name={`q-${questionId}-0`}
          autoComplete="off"
          className="w-full rounded border border-neutral-300 bg-white px-3 py-2 font-mono"
        />
      </label>
    );
  }

  return (
    <ol className="mt-3 mb-0 list-decimal space-y-2 pl-6">
      {Array.from({ length: count }, (_, blankIndex) => (
        <li key={blankIndex} className="pl-1">
          <label className="block text-sm">
            <span className="sr-only">Blank {blankIndex + 1}</span>
            <input
              type="text"
              name={`q-${questionId}-${blankIndex}`}
              autoComplete="off"
              className="w-full rounded border border-neutral-300 bg-white px-3 py-2 font-mono"
            />
          </label>
        </li>
      ))}
    </ol>
  );
}

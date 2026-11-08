export default function SourceNote({
  source,
  title,
  children,
}: {
  source: "draft" | "published" | "practice" | "home";
  title: string;
  children: string;
}) {
  return (
    <p
      data-book-source={source}
      role="note"
      className="rounded border border-sky-300 bg-sky-50 px-3 py-2 font-sans text-sm text-sky-950"
    >
      <strong className="font-semibold">{title}</strong> {children}
    </p>
  );
}

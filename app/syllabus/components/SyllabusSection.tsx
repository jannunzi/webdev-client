import type { ReactNode } from "react";

export default function SyllabusSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-6 py-5">
      <h2 className="mb-3 border-b border-neutral-300 pb-2 font-sans text-2xl font-semibold tracking-tight">
        {title}
      </h2>
      <div className="space-y-3 text-[1.05rem]">{children}</div>
    </section>
  );
}

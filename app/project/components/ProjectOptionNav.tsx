import Link from "next/link";
import { PROJECT_DOCS } from "../docs";
import type { ProjectDocSlug } from "../types";

export default function ProjectOptionNav({
  current,
}: {
  current?: ProjectDocSlug | "hub";
}) {
  return (
    <nav
      aria-label="Project options"
      className="mb-6 flex flex-wrap gap-x-3 gap-y-1 font-sans text-sm text-neutral-600"
    >
      {current === "hub" ? (
        <span className="text-neutral-800">Overview</span>
      ) : (
        <Link href="/project">Overview</Link>
      )}
      {PROJECT_DOCS.map((doc) => (
        <span key={doc.slug}>
          <span aria-hidden="true">· </span>
          {current === doc.slug ? (
            <span className="text-neutral-800">{doc.title}</span>
          ) : (
            <Link href={`/project/${doc.slug}`}>{doc.title}</Link>
          )}
        </span>
      ))}
    </nav>
  );
}

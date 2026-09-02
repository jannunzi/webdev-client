import type { PolicyBlock } from "../data/types";
import SyllabusSection from "./SyllabusSection";

export default function PolicySection({
  id,
  title,
  policy,
}: {
  id: string;
  title: string;
  policy: PolicyBlock;
}) {
  return (
    <SyllabusSection id={id} title={title}>
      {policy.paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 48)}>{paragraph}</p>
      ))}
      {policy.bullets ? (
        <ul className="list-disc space-y-1 pl-6">
          {policy.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      {policy.links ? (
        <ul className="list-none space-y-1 pl-0">
          {policy.links.map((link) => (
            <li key={link.href}>
              <a href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </SyllabusSection>
  );
}

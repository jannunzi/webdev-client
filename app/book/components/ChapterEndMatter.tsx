import OfficialLink from "./OfficialLink";
import Section from "./Section";
import { getTerm } from "../terms/termRegistry";
import { titleFromSlug } from "../terms/termSlug";
import type { ChapterEndMatterData, ExternalLink } from "../chapter-end/types";

function TermItem({ slug }: { slug: string }) {
  const entry = getTerm(slug);
  if (!entry) {
    return <li>{titleFromSlug(slug)}</li>;
  }
  return (
    <li>
      <OfficialLink href={entry.officialUrl}>{entry.term}</OfficialLink>
    </li>
  );
}

function ExternalItem({
  item,
  withDescription,
}: {
  item: ExternalLink;
  withDescription?: boolean;
}) {
  const extra = withDescription ? item.description : item.note;
  return (
    <li>
      <a href={item.href} target="_blank" rel="noreferrer">
        {item.name}
      </a>
      {extra ? <> — {extra}</> : null}
    </li>
  );
}

export default function ChapterEndMatter({
  data,
}: {
  data: ChapterEndMatterData;
}) {
  const { references, tools, aiTools } = data;

  return (
    <>
      <Section id={references.id} title={references.title}>
        <p>{references.lead}</p>
        <ul className="columns-1 gap-x-10 sm:columns-2 [&>li]:break-inside-avoid">
          {references.items.map((slug) => (
            <TermItem key={slug} slug={slug} />
          ))}
        </ul>
        {references.topics.length > 0 ? (
          <>
            <p>
              These ideas also matter in this chapter even though they do not
              have their own term pages yet:
            </p>
            <ul>
              {references.topics.map((topic) => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>
          </>
        ) : null}
      </Section>

      <Section id={tools.id} title={tools.title}>
        <p>{tools.lead}</p>
        <ul>
          {tools.items.map((item) => (
            <ExternalItem key={item.href} item={item} />
          ))}
        </ul>
      </Section>

      <Section id={aiTools.id} title={aiTools.title}>
        <p>{aiTools.lead}</p>
        <ul>
          {aiTools.items.map((item) => (
            <ExternalItem key={item.href} item={item} withDescription />
          ))}
        </ul>
      </Section>
    </>
  );
}

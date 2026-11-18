import { cs5500AiSection } from "@/lib/courses/cs5500-ai-strategies";

export default function Cs5500AiStrategies() {
  return (
    <section id="wd-cs5500-ai" className="mt-10" aria-labelledby="wd-cs5500-ai-title">
      <h2
        id="wd-cs5500-ai-title"
        className="mt-0 font-sans text-xl font-semibold"
      >
        {cs5500AiSection.title}
      </h2>
      <p className="text-neutral-700">
        <span className="me-2 inline-flex rounded-md bg-amber-100 px-2 py-1 font-sans text-xs font-semibold uppercase tracking-wide text-amber-950">
          Proposals
        </span>
        {cs5500AiSection.lede}
      </p>
      {cs5500AiSection.topics.map((topic) => (
        <section key={topic.id} className="mt-6" aria-labelledby={`wd-cs5500-ai-${topic.id}`}>
          <h3
            id={`wd-cs5500-ai-${topic.id}`}
            className="mt-0 font-sans text-lg font-semibold"
          >
            {topic.title}
          </h3>
          <ul className="m-0 list-disc ps-5">
            {topic.suggestions.map((suggestion) => (
              <li key={suggestion} className="mt-2">
                {suggestion}
              </li>
            ))}
          </ul>
        </section>
      ))}
      <section className="mt-6" aria-labelledby="wd-cs5500-ai-assessment">
        <h3
          id="wd-cs5500-ai-assessment"
          className="mt-0 font-sans text-lg font-semibold"
        >
          Assessment ideas
        </h3>
        <ul className="m-0 list-disc ps-5">
          {cs5500AiSection.assessments.map((idea) => (
            <li key={idea} className="mt-2">
              {idea}
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}

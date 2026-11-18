import {
  cs5500ResourceGroups,
  type Cs5500Resource,
} from "@/lib/courses/cs5500-resources";

function ResourceLink({ resource }: { resource: Cs5500Resource }) {
  return (
    <li className="mt-2">
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {resource.label}
      </a>
      <span className="text-neutral-700"> — {resource.note}</span>
    </li>
  );
}

export default function Cs5500Resources() {
  return (
    <section id="wd-cs5500-resources" className="mt-10">
      <h2 className="mt-0 font-sans text-xl font-semibold">
        Resources from other CS5500 instructors
      </h2>
      <p className="text-neutral-700">
        Published materials from other sections. This Summer 2027 offering is not open yet.
      </p>
      {cs5500ResourceGroups.map((group) => (
        <section key={group.id} className="mt-6" aria-labelledby={`wd-cs5500-${group.id}`}>
          <h3
            id={`wd-cs5500-${group.id}`}
            className="mt-0 font-sans text-lg font-semibold"
          >
            {group.title}
          </h3>
          {group.note ? <p className="text-neutral-700">{group.note}</p> : null}
          <ul className="m-0 list-disc ps-5">
            {group.links.map((resource) => (
              <ResourceLink key={resource.url} resource={resource} />
            ))}
          </ul>
        </section>
      ))}
    </section>
  );
}

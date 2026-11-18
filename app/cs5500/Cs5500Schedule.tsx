import { cs5500Schedule, cs5500ScheduleNote, sweAtGoogle } from "@/lib/courses/cs5500-schedule";

export default function Cs5500Schedule() {
  return (
    <section id="wd-cs5500-schedule" className="mt-10" aria-labelledby="wd-cs5500-schedule-title">
      <h2
        id="wd-cs5500-schedule-title"
        className="mt-0 font-sans text-xl font-semibold"
      >
        Proposed 14-week schedule
      </h2>
      <p id="wd-cs5500-schedule-note" className="text-neutral-800">
        {cs5500ScheduleNote}
      </p>
      <p className="text-neutral-800">
        <a href={sweAtGoogle.url} target="_blank" rel="noopener noreferrer">
          {sweAtGoogle.title}
        </a>
        {", "}
        {sweAtGoogle.editors}. {sweAtGoogle.why} {sweAtGoogle.slidesNote}{" "}
        {sweAtGoogle.optional}
      </p>
      <ol className="m-0 grid list-none gap-4 p-0">
        {cs5500Schedule.map((week) => (
          <li
            key={week.week}
            id={`wd-cs5500-week-${week.week}`}
            className="rounded-lg border border-neutral-200 bg-white p-4"
          >
            <p className="m-0 font-sans text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Week {week.week}
            </p>
            <h3 className="mt-1 font-sans text-lg font-semibold">{week.title}</h3>
            <ul className="m-0 list-disc ps-5">
              {week.lessons.map((lesson) => (
                <li key={lesson} className="mt-1">
                  {lesson}
                </li>
              ))}
            </ul>
            <p className="mb-1 mt-3">
              <span className="font-sans font-semibold">Reading. </span>
              {week.reading}
            </p>
            <p className="my-1">
              <span className="font-sans font-semibold">Assignment. </span>
              {week.assignment}
            </p>
            <p className="mb-0 mt-2 font-sans text-sm text-neutral-500">
              Based on: {week.basedOn}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

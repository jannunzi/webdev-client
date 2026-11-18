import { cs5500AiCourses } from "@/lib/courses/cs5500-ai-courses";

export default function Cs5500AiCourses() {
  return (
    <section id="wd-cs5500-ai-courses" className="mt-10" aria-labelledby="wd-cs5500-ai-courses-title">
      <h2
        id="wd-cs5500-ai-courses-title"
        className="mt-0 font-sans text-xl font-semibold"
      >
        Courses already teaching AI in software engineering
      </h2>
      <ul className="m-0 grid list-none gap-4 p-0">
        {cs5500AiCourses.map((course) => (
          <li
            key={course.url}
            className="rounded-lg border border-neutral-200 bg-white p-4"
          >
            <h3 className="mt-0 font-sans text-lg font-semibold">
              <a
                href={course.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {course.name}
              </a>
            </h3>
            <p className="mt-1 mb-2 font-sans text-sm text-neutral-600">
              {course.school}
            </p>
            <p className="m-0 text-neutral-800">
              {course.note}
              {course.links?.map((link) => (
                <span key={link.url}>
                  {" "}
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                </span>
              ))}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

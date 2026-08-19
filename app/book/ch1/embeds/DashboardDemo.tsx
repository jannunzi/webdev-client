import Link from "next/link";
import Image from "next/image";
import PlainKambazNavigation from "./PlainKambazNavigation";

/**
 * Plain expected output for §1.4.3 — unstyled Ch1 structure.
 * (Live Kambaz Dashboard / Navigation are the Chapter 2 styled versions.)
 */
function PlainCourseCard({
  id,
  title,
  subtitle,
  image,
}: {
  id: string;
  title: string;
  subtitle: string;
  image: string;
}) {
  return (
    <div className="wd-dashboard-course">
      <Link href={`/courses/${id}/home`} className="wd-dashboard-course-link">
        <Image src={image} width={200} height={150} alt={title} />
        <div>
          <h5>{title}</h5>
          <p className="wd-dashboard-course-title">{subtitle}</p>
          <button type="button">Go</button>
        </div>
      </Link>
    </div>
  );
}

export default function DashboardDemo() {
  return (
    <table width="100%">
      <tbody>
        <tr>
          <td valign="top" width="160">
            <PlainKambazNavigation />
          </td>
          <td valign="top">
            <div id="wd-dashboard">
              <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
              <h2 id="wd-dashboard-published">Published Courses (3)</h2> <hr />
              <div id="wd-dashboard-courses">
                <PlainCourseCard
                  id="1234"
                  title="CS1234 React JS"
                  subtitle="Full Stack software developer"
                  image="/images/reactjs.jpg"
                />
                <PlainCourseCard
                  id="2345"
                  title="CS2345 Node JS"
                  subtitle="Server side JavaScript"
                  image="/images/nodejs.jpg"
                />
                <PlainCourseCard
                  id="3456"
                  title="CS3456 MongoDB"
                  subtitle="NoSQL Databases"
                  image="/images/mongodb.jpg"
                />
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

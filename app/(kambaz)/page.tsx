import { redirect } from "next/navigation";

/** Course homepage. Kambaz remains at /account/signin, /dashboard, /courses/*. */
export default function Home() {
  redirect("/syllabus");
}

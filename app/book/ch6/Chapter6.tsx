import Intro from "./sections/Intro";
import LocalMongo from "./sections/LocalMongo";
import Programming from "./sections/Programming";
import Apis from "./sections/Apis";
import Atlas from "./sections/Atlas";
import CheckUnderstanding from "./sections/CheckUnderstanding";
import KambazDb from "./sections/KambazDb";
import Deliverables from "./sections/Deliverables";

/**
 * Chapter 6 — PDF spine (MongoDB + Mongoose + Atlas + Kambaz)
 * with Ch1–3 LiveDemos. Connections are real when an env URI is set;
 * otherwise DAOs and /api/lab6 fall back to in-memory so the book builds.
 */
export default function Chapter6() {
  return (
    <article className="mx-auto max-w-3xl">
      <Intro />
      <LocalMongo />
      <Programming />
      <Apis />
      <Atlas />
      <CheckUnderstanding />
      <KambazDb />
      <Deliverables />
    </article>
  );
}

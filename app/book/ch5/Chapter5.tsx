import Intro from "./sections/Intro";
import HttpServer from "./sections/HttpServer";
import LabExercises from "./sections/LabExercises";
import NextRoutes from "./sections/NextRoutes";
import CheckUnderstanding from "./sections/CheckUnderstanding";
import KambazServer from "./sections/KambazServer";
import Deploy from "./sections/Deploy";
import Conclusion from "./sections/Conclusion";

/**
 * Chapter 5 — Express-first REST (PDF spine) with Ch1–3 LiveDemos.
 */
export default function Chapter5() {
  return (
    <article className="mx-auto max-w-3xl">
      <Intro />
      <HttpServer />
      <LabExercises />
      <NextRoutes />
      <CheckUnderstanding />
      <KambazServer />
      <Deploy />
      <Conclusion />
    </article>
  );
}

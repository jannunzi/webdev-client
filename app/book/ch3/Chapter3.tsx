import Intro from "./sections/Intro";
import JsBasics from "./sections/JsBasics";
import Functions from "./sections/Functions";
import DataStructures from "./sections/DataStructures";
import StylingAndComponents from "./sections/StylingAndComponents";
import CheckUnderstanding from "./sections/CheckUnderstanding";
import KambazData from "./sections/KambazData";
import Delivery from "./sections/Delivery";

/**
 * Chapter 3 book content — JavaScript, data-driven React, and Kambaz,
 * with live lab components instead of screenshots.
 */
export default function Chapter3() {
  return (
    <article className="mx-auto max-w-3xl">
      <Intro />
      <JsBasics />
      <Functions />
      <DataStructures />
      <StylingAndComponents />
      <CheckUnderstanding />
      <KambazData />
      <Delivery />
    </article>
  );
}

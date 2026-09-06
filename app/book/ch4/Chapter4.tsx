import Intro from "./sections/Intro";
import EventsAndState from "./sections/EventsAndState";
import SharingAndUrl from "./sections/SharingAndUrl";
import Stores from "./sections/Stores";
import EffectsAndExercises from "./sections/EffectsAndExercises";
import CheckUnderstanding from "./sections/CheckUnderstanding";
import KambazState from "./sections/KambazState";
import Delivery from "./sections/Delivery";
import ChapterEndMatter from "../components/ChapterEndMatter";
import { ch4EndMatter } from "./end-matter";

/**
 * Chapter 4 book content — client state, Context, Zustand, Redux,
 * and a stateful Kambaz, with live lab components instead of screenshots.
 */
export default function Chapter4() {
  return (
    <article className="book-content">
      <Intro />
      <EventsAndState />
      <SharingAndUrl />
      <Stores />
      <EffectsAndExercises />
      <CheckUnderstanding />
      <KambazState />
      <Delivery />
      <ChapterEndMatter data={ch4EndMatter} />
    </article>
  );
}

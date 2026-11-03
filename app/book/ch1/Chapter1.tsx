import IntroAndSetup from "./sections/IntroAndSetup";
import HtmlSections from "./sections/HtmlSections";
import CheckUnderstanding from "./sections/CheckUnderstanding";
import KambazSections from "./sections/KambazSections";
import ClosingSections, { Chapter1Conclusion } from "./sections/ClosingSections";
import EngineeringWithAI from "./sections/EngineeringWithAI";
import ChapterEndMatter from "../components/ChapterEndMatter";
import { ch1EndMatter } from "./end-matter";

/**
 * Chapter 1 book content — same topics as the PDF, with live intermediate
 * components embedded instead of screenshots.
 */
export default function Chapter1() {
  return (
    <article className="book-content">
      <IntroAndSetup />
      <HtmlSections />
      <CheckUnderstanding />
      <KambazSections />
      <ClosingSections />
      <EngineeringWithAI />
      <Chapter1Conclusion />
      <ChapterEndMatter data={ch1EndMatter} />
    </article>
  );
}

import IntroAndSetup from "./sections/IntroAndSetup";
import HtmlSections from "./sections/HtmlSections";
import CheckUnderstanding from "./sections/CheckUnderstanding";
import KambazSections from "./sections/KambazSections";
import ClosingSections from "./sections/ClosingSections";

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
    </article>
  );
}

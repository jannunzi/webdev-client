import Intro from "./sections/Intro";
import CssBasics from "./sections/CssBasics";
import CssProperties from "./sections/CssProperties";
import IconsAndTailwind from "./sections/IconsAndTailwind";
import KambazStyling from "./sections/KambazStyling";
import Delivery from "./sections/Delivery";

/**
 * Chapter 2 book content — CSS, Tailwind, and Kambaz styling,
 * with live intermediates instead of screenshots.
 */
export default function Chapter2() {
  return (
    <article className="book-content">
      <Intro />
      <CssBasics />
      <CssProperties />
      <IconsAndTailwind />
      <KambazStyling />
      <Delivery />
    </article>
  );
}

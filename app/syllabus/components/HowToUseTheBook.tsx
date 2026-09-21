import Link from "next/link";
import {
  HOW_TO_USE_THE_BOOK_HEADING,
  HOW_TO_USE_THE_BOOK_INTRO,
} from "@/app/book/videosOptional";
import SyllabusSection from "./SyllabusSection";

export default function HowToUseTheBook() {
  return (
    <SyllabusSection id="book" title={HOW_TO_USE_THE_BOOK_HEADING}>
      <p>
        {HOW_TO_USE_THE_BOOK_INTRO}{" "}
        <Link href="/book#how-to-use">Open the book</Link>.
      </p>
      <p>
        Optional book videos are not the same as lecture recordings. For
        attendance and lecture recordings, see{" "}
        <Link href="#meetings">Meeting information</Link>.
      </p>
    </SyllabusSection>
  );
}

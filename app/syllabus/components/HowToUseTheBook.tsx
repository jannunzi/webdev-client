import Link from "next/link";
import BookVideosNote from "@/app/book/components/BookVideosNote";
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
      <BookVideosNote />
    </SyllabusSection>
  );
}

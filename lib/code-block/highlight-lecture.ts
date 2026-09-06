import "server-only";
import {
  lectureSlideCodeBlocks,
  type LectureCodeBlock,
  type LectureSlide,
} from "@/lib/lectures/types";
import { highlightCodeToHtml } from "./highlight";

export async function highlightLectureCodeBlock(
  block: LectureCodeBlock,
): Promise<LectureCodeBlock> {
  const html = await highlightCodeToHtml({
    code: block.code,
    language: block.language ?? "tsx",
    lineNumbers: true,
    highlightLines: block.highlightLines,
    addedLines: block.addedLines,
  });
  return { ...block, html };
}

export async function withHighlightedLectureCode(
  slides: LectureSlide[],
): Promise<LectureSlide[]> {
  return Promise.all(
    slides.map(async (slide) => {
      const blocks = lectureSlideCodeBlocks(slide);
      if (blocks.length === 0) return slide;
      const codeBlocks = await Promise.all(
        blocks.map((block) => highlightLectureCodeBlock(block)),
      );
      return {
        ...slide,
        code: undefined,
        codeLanguage: undefined,
        codeFile: undefined,
        codeHighlightLines: undefined,
        codeAddedLines: undefined,
        codeBlocks,
      };
    }),
  );
}

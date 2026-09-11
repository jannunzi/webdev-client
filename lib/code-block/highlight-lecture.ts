import "server-only";
import { isBlockSlide, type AuthoredSlide } from "@/lib/lectures/blocks";
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
  slides: AuthoredSlide[],
): Promise<AuthoredSlide[]> {
  return Promise.all(
    slides.map(async (slide) => {
      if (isBlockSlide(slide)) {
        const blocks = await Promise.all(
          slide.blocks.map(async (block) => {
            if (block.type !== "code") return block;
            const highlighted = await highlightLectureCodeBlock({
              code: block.code,
              language: block.language,
              file: block.file,
              highlightLines: block.highlightLines,
              addedLines: block.addedLines,
            });
            return { ...block, html: highlighted.html };
          }),
        );
        return { ...slide, blocks };
      }
      return highlightLegacySlide(slide);
    }),
  );
}

async function highlightLegacySlide(slide: LectureSlide): Promise<LectureSlide> {
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
}

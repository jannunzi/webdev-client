import type { ExtractedChapter } from "./extract";
import raw from "./chapter1.seed.json";

/** Checked-in Chapter 1 import. Reading it does not write storage. */
export function chapter1Seed(): ExtractedChapter {
  return raw as ExtractedChapter;
}

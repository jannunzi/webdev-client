export {
  COURSE_SITE_ORIGIN,
  adjacentLectureSlugs,
  getLecture,
  getLectureDeck,
  isLectureSlug,
  lectureDeckThumbnail,
  lecturePublicUrl,
  listCanvasLectureGroups,
  listLectureDecks,
  listLectureSlugs,
  listLectures,
} from "./catalog";
export { COMMIT_TO_GITHUB_SLIDES } from "./decks/commit-to-github";
export { CREATING_A_NEXTJS_REACT_APPLICATION_SLIDES } from "./decks/creating-a-nextjs-react-application";
export { DEPLOYING_TO_VERCEL_SLIDES } from "./decks/deploying-to-vercel";
export { INSTALLING_NODEJS_SLIDES } from "./decks/installing-nodejs";
export { INTRO_TO_WEB_DEVELOPMENT_SLIDES } from "./decks/intro-to-web-development";
export {
  LECTURE_DECK_THUMBNAILS,
  LECTURE_EMBED_IDS,
  LECTURE_SLIDE_IMAGE_ALLOWLIST,
  LECTURE_SLUGS,
  lectureSlideAssetPath,
  lectureSlideFigurePath,
  lectureSlideCodeBlocks,
  withLectureSlideImages,
} from "./types";
export type {
  CanvasLectureGroup,
  LectureCodeBlock,
  LectureDeck,
  LectureEmbedId,
  LectureHubItem,
  LectureSlide,
  LectureSlug,
  SlideKind,
} from "./types";

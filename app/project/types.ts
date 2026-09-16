export type ProjectDocImage = {
  type: "img";
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type ProjectDocParagraph = {
  type: "p";
  text: string;
};

export type ProjectDocHeading = {
  type: "h";
  level: 1 | 2 | 3;
  text: string;
};

export type ProjectDocListItem = {
  type: "li";
  depth: number;
  text: string;
};

export type ProjectDocBlock =
  | ProjectDocParagraph
  | ProjectDocHeading
  | ProjectDocListItem
  | ProjectDocImage;

export type ProjectDocSlug = "quizzes" | "pazza" | "open-ended";

export type ProjectDoc = {
  slug: ProjectDocSlug;
  title: string;
  subtitle: string;
  description: string;
  blocks: ProjectDocBlock[];
};

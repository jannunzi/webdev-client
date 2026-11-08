import fs from "node:fs";
import path from "node:path";
import { extractChapter1 } from "../lib/book-editor/extract.ts";

const root = process.cwd();
const extracted = extractChapter1(root);
const seedPath = path.join(root, "lib/book-editor/chapter1.seed.json");
fs.writeFileSync(seedPath, JSON.stringify(extracted));

const lines = extracted.embeds.map((embed) => {
  const imported = `import("${embed.modulePath}")`;
  const pick =
    embed.exportName === "default"
      ? `mod.default`
      : `mod[${JSON.stringify(embed.exportName)}]`;
  return `  ${embed.component}: dynamic(() => ${imported}.then((mod) => ({ default: ${pick} }))),`;
});

const registry = `"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

/** Registered Chapter 1 demos. Props come from the component, never from saved JSON. */
export const BOOK_EMBEDS: Record<string, ComponentType> = {
${lines.join("\n")}
};
`;
fs.writeFileSync(path.join(root, "lib/book-editor/embed-registry.tsx"), registry);
console.log(`seed ${fs.statSync(seedPath).size} bytes, embeds ${extracted.embeds.length}`);

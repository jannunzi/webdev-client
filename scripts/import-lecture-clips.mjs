#!/usr/bin/env node
// Regenerates data/videos/lecture-sets.json from every
// <clipsRoot>/<lectureId>/upload-package.json.
// Usage: node scripts/import-lecture-clips.mjs [clipsRoot]
// Items with hold: true are skipped. Items without a PUBLISHED youtubeVideoId
// are kept with youtubeVideoId: null and shown as "Coming soon". Re-run after
// more parts publish; placeholders become links with no other edits.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.argv[2] ?? "/workspace/webdevtv-lectures/clips";
// Lectures shown on /videos. Add a new lecture id here, then re-run.
const LECTURES = [
  "cs5610-09_2026-10-06",
  "cs4550-01_2026-10-07",
  "cs5610-09_2026-10-13",
  "cs4550-01_2026-10-14",
  "cs5610-02_2026-10-19",
  "cs5610-09_2026-10-20",
  "cs4550-01_2026-10-21",
  "cs5610-02_2026-10-26",
];
const ID = /^[A-Za-z0-9_-]{11}$/;
const sets = [];
for (const dir of LECTURES) {
  const pkgPath = join(root, dir, "upload-package.json");
  if (!existsSync(pkgPath)) { console.warn(`missing ${pkgPath}`); continue; }
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  const lectureId = pkg.lecture_id ?? pkg.items?.[0]?.lectureId ?? dir;
  const m = /^(cs\d+(?:-\d+)?)_(\d{4}-\d{2}-\d{2})$/i.exec(lectureId);
  if (!m) { console.warn(`skip ${dir}: unrecognized lecture id`); continue; }
  const date = m[2];
  const month = Number(date.slice(5, 7));
  const season = month <= 5 ? "SP" : month <= 8 ? "SU" : "FA";
  let skipped = 0;
  const clips = [];
  for (const item of pkg.items ?? []) {
    if (item.hold === true) { skipped++; continue; }
    const id = item.youtubeVideoId;
    const live = typeof id === "string" && ID.test(id) &&
      (!item.uploadStatus || item.uploadStatus === "PUBLISHED");
    const summary = String(item.description ?? "").split(/\n\s*\n/)[0].trim()
      .replace(/^In this WebDevTV clip we cover .*? lecture \([^)]*\)\.\s*/, "");
    clips.push({
      part: item.part,
      youtubeVideoId: live ? id : null,
      title: item.title,
      topic: item.topicLabel ?? null,
      durationSec: item.durationSec ?? null,
      summary,
    });
  }
  clips.sort((a, b) => a.part - b.part);
  const linked = clips.filter((c) => c.youtubeVideoId).length;
  console.log(`${lectureId}: linked ${linked}, coming soon ${clips.length - linked}, skipped ${skipped}`);
  sets.push({
    lectureId,
    course: m[1].toUpperCase(),
    semester: `${season}${date.slice(2, 4)}`,
    date,
    partCount: pkg.items?.length ?? clips.length,
    clips,
  });
}
writeFileSync("data/videos/lecture-sets.json", JSON.stringify(sets, null, 2) + "\n");

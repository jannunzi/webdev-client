import assert from "node:assert/strict";
import { test } from "node:test";
import { listLectureClipSets, type LectureClipSet } from "./lectures";

test("Oct 6 CS5610-09 lecture ships 21 clips starting with Part 1", () => {
  const set = listLectureClipSets().find((s) => s.lectureId === "cs5610-09_2026-10-06");
  assert.ok(set);
  assert.equal(set.clips.length, 21);
  assert.equal(set.clips[0]!.youtubeVideoId, "5rmZS4OI2PU");
  for (const clip of set.clips) assert.match(clip.youtubeVideoId ?? "", /^[A-Za-z0-9_-]{11}$/);
});

test("Oct 7 CS4550-01 Part 1 links TqIA9tXbZsE; unpublished parts are placeholders", () => {
  const set = listLectureClipSets().find((s) => s.lectureId === "cs4550-01_2026-10-07");
  assert.ok(set);
  assert.equal(set.clips[0]!.youtubeVideoId, "TqIA9tXbZsE");
  assert.ok(set.clips.some((c) => c.youtubeVideoId === null));
  assert.equal(listLectureClipSets().length, 8);
});

test("invalid ids become placeholders, empty lectures hidden, newest first", () => {
  const base = { course: "X", semester: "FA26", partCount: 1 };
  const clip = { part: 1, title: "t", topic: null, durationSec: null, summary: "" };
  const files: LectureClipSet[] = [
    { ...base, lectureId: "a", date: "2026-10-01", clips: [{ ...clip, youtubeVideoId: "5rmZS4OI2PU" }] },
    { ...base, lectureId: "b", date: "2026-10-08", clips: [{ ...clip, youtubeVideoId: "AAAAAAAAAAA" }] },
    { ...base, lectureId: "c", date: "2026-10-09", clips: [{ ...clip, youtubeVideoId: "bad" }] },
    { ...base, lectureId: "d", date: "2026-10-10", clips: [] },
  ];
  const out = listLectureClipSets(files);
  assert.deepEqual(out.map((s) => s.lectureId), ["c", "b", "a"]);
  assert.equal(out[0]!.clips[0]!.youtubeVideoId, null);
});

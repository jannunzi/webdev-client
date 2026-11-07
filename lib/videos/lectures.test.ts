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

test("Oct 7 CS4550-01 links every published part, starting with TqIA9tXbZsE", () => {
  const set = listLectureClipSets().find((s) => s.lectureId === "cs4550-01_2026-10-07");
  assert.ok(set);
  assert.equal(set.clips.length, 22);
  assert.equal(set.clips[0]!.youtubeVideoId, "TqIA9tXbZsE");
  assert.equal(set.clips[1]!.youtubeVideoId, "efm72umwkm8");
  for (const clip of set.clips) assert.match(clip.youtubeVideoId ?? "", /^[A-Za-z0-9_-]{11}$/);
  assert.equal(listLectureClipSets().length, 12);
});

test("lectures through Oct 26 link published clips and omit held midterm parts", () => {
  const sets = listLectureClipSets();
  assert.deepEqual(
    sets.map((s) => s.date),
    [
      "2026-10-26",
      "2026-10-21",
      "2026-10-20",
      "2026-10-19",
      "2026-10-14",
      "2026-10-13",
      "2026-10-07",
      "2026-10-06",
      "2026-10-05",
      "2026-09-30",
      "2026-09-29",
      "2026-09-28",
    ],
  );
  const oct26 = sets.find((s) => s.lectureId === "cs5610-02_2026-10-26");
  const oct21 = sets.find((s) => s.lectureId === "cs4550-01_2026-10-21");
  const oct20 = sets.find((s) => s.lectureId === "cs5610-09_2026-10-20");
  const oct19 = sets.find((s) => s.lectureId === "cs5610-02_2026-10-19");
  const oct14 = sets.find((s) => s.lectureId === "cs4550-01_2026-10-14");
  const oct13 = sets.find((s) => s.lectureId === "cs5610-09_2026-10-13");
  assert.equal(oct26?.clips.length, 22);
  assert.equal(oct26?.clips[0]!.youtubeVideoId, "S5m2Z8Hz5Q0");
  assert.equal(oct14?.clips.length, 19);
  assert.equal(oct14?.clips[0]!.youtubeVideoId, "Tepds9s2NSQ");
  assert.equal(oct13?.clips.length, 25);
  assert.equal(oct13?.clips[0]!.youtubeVideoId, "0fCwo_OQ8Q4");
  for (const set of [oct26, oct21, oct20, oct19, oct14, oct13]) {
    assert.ok(set);
    assert.equal(set.clips.some((c) => c.youtubeVideoId == null), false);
  }
  assert.equal(oct21?.partCount, 24);
  assert.equal(oct21?.clips.length, 23);
  assert.equal(oct21?.clips[0]!.youtubeVideoId, "SQgrTIu5628");
  assert.equal(oct20?.partCount, 20);
  assert.equal(oct20?.clips.length, 19);
  assert.equal(oct20?.clips[0]!.youtubeVideoId, "SFJR1ENJoX8");
  assert.equal(oct19?.partCount, 24);
  assert.equal(oct19?.clips.length, 23);
  assert.equal(oct19?.clips[0]!.youtubeVideoId, "j9-e-nLhuQA");
  for (const set of [oct21, oct20, oct19]) {
    assert.equal(set?.clips.some((c) => c.part === 1), false);
  }
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

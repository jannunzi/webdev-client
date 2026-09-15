import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ESTIMATE_MINUTES_PER_STUDENT,
  canJoinQueue,
  closeSession,
  emptyQueue,
  estimateWaitMinutes,
  joinQueue,
  leaveQueue,
  markStudentDone,
  openSession,
  positionInLine,
  removeStudent,
  reorderWaiting,
  serveStudent,
  toQueueView,
} from "./queue.ts";

function queue() {
  return emptyQueue({
    taId: "shloka-trivedi",
    taEmail: "trivedi.shl@northeastern.edu",
    section: "cs4550-01",
    now: "2026-09-14T15:00:00.000Z",
  });
}

function open(now = "2026-09-14T15:00:00.000Z") {
  const opened = openSession(queue(), now);
  assert.equal(opened.ok, true);
  return opened.ok ? opened.queue : queue();
}

function join(
  current: ReturnType<typeof queue>,
  email: string,
  name: string,
  id: string,
  now: string,
) {
  const result = joinQueue(current, {
    studentEmail: email,
    displayName: name,
    id,
    now,
  });
  assert.equal(result.ok, true);
  return result.ok ? result.queue : current;
}

describe("office-hour live queue rules", () => {
  it("rejects join when the session is closed and after a student is already in line", () => {
    const closed = queue();
    assert.deepEqual(canJoinQueue(closed, "ada@northeastern.edu"), {
      ok: false,
      code: "session_closed",
    });
    const first = join(
      open(),
      "ada@northeastern.edu",
      "Ada",
      "e1",
      "2026-09-14T15:01:00.000Z",
    );
    assert.deepEqual(canJoinQueue(first, "ADA@northeastern.edu"), {
      ok: false,
      code: "already_in_line",
    });
  });

  it("lets a student leave themselves and rejoin after leave or done", () => {
    let current = join(
      open(),
      "ada@northeastern.edu",
      "Ada",
      "e1",
      "2026-09-14T15:01:00.000Z",
    );
    const left = leaveQueue(current, "ada@northeastern.edu", "2026-09-14T15:02:00.000Z");
    assert.equal(left.ok, true);
    if (!left.ok) return;
    assert.equal(left.queue.entries[0]?.status, "left");
    current = join(
      left.queue,
      "ada@northeastern.edu",
      "Ada",
      "e2",
      "2026-09-14T15:03:00.000Z",
    );
    assert.equal(current.entries.filter((row) => row.status === "waiting").length, 1);

    const served = serveStudent(current, "e2", "2026-09-14T15:04:00.000Z");
    assert.equal(served.ok, true);
    if (!served.ok) return;
    const done = markStudentDone(served.queue, "e2", "2026-09-14T15:05:00.000Z");
    assert.equal(done.ok, true);
    if (!done.ok) return;
    const again = joinQueue(done.queue, {
      studentEmail: "ada@northeastern.edu",
      displayName: "Ada",
      id: "e3",
      now: "2026-09-14T15:06:00.000Z",
    });
    assert.equal(again.ok, true);
  });

  it("serves, completes, and removes only active students", () => {
    let current = join(
      open(),
      "ada@northeastern.edu",
      "Ada",
      "e1",
      "2026-09-14T15:01:00.000Z",
    );
    current = join(
      current,
      "al@northeastern.edu",
      "Al",
      "e2",
      "2026-09-14T15:02:00.000Z",
    );
    const serving = serveStudent(current, "e1", "2026-09-14T15:03:00.000Z");
    assert.equal(serving.ok, true);
    if (!serving.ok) return;
    assert.equal(
      serving.queue.entries.find((row) => row.id === "e1")?.status,
      "serving",
    );
    const done = markStudentDone(serving.queue, "e1", "2026-09-14T15:04:00.000Z");
    assert.equal(done.ok, true);
    if (!done.ok) return;
    const removed = removeStudent(done.queue, "e2", "2026-09-14T15:05:00.000Z");
    assert.equal(removed.ok, true);
    if (!removed.ok) return;
    assert.equal(
      removed.queue.entries.find((row) => row.id === "e2")?.status,
      "left",
    );
    assert.deepEqual(markStudentDone(removed.queue, "e2", "2026-09-14T15:06:00.000Z"), {
      ok: false,
      code: "not_waiting",
    });
    assert.deepEqual(leaveQueue(removed.queue, "missing@northeastern.edu", "now"), {
      ok: false,
      code: "not_in_line",
    });
  });

  it("reorders waiting students and estimates wait as 10 minutes × position", () => {
    let current = join(
      open(),
      "ada@northeastern.edu",
      "Ada",
      "e1",
      "2026-09-14T15:01:00.000Z",
    );
    current = join(
      current,
      "al@northeastern.edu",
      "Al",
      "e2",
      "2026-09-14T15:02:00.000Z",
    );
    current = join(
      current,
      "bea@northeastern.edu",
      "Bea",
      "e3",
      "2026-09-14T15:03:00.000Z",
    );
    assert.equal(positionInLine(current, "al@northeastern.edu"), 2);
    assert.equal(estimateWaitMinutes(2), 2 * ESTIMATE_MINUTES_PER_STUDENT);

    const up = reorderWaiting(current, "e3", "up", "2026-09-14T15:04:00.000Z");
    assert.equal(up.ok, true);
    if (!up.ok) return;
    assert.equal(positionInLine(up.queue, "bea@northeastern.edu"), 2);
    assert.equal(positionInLine(up.queue, "al@northeastern.edu"), 3);

    const closed = closeSession(up.queue, "2026-09-14T15:05:00.000Z");
    assert.equal(closed.ok, true);
    if (!closed.ok) return;
    assert.equal(closed.queue.open, false);
    assert.deepEqual(canJoinQueue(closed.queue, "new@northeastern.edu"), {
      ok: false,
      code: "session_closed",
    });
  });

  it("builds a public view without emails and a staff view with emails", () => {
    const current = join(
      open(),
      "ada@northeastern.edu",
      "Ada Lovelace",
      "e1",
      "2026-09-14T15:01:00.000Z",
    );
    const student = toQueueView(current, { viewerEmail: "ada@northeastern.edu" });
    assert.equal(student.line[0]?.studentEmail, undefined);
    assert.equal(student.myPosition, 1);
    assert.equal(student.myEstimateMinutes, ESTIMATE_MINUTES_PER_STUDENT);
    assert.equal(student.line[0]?.isYou, true);

    const staff = toQueueView(current, { includeEmails: true });
    assert.equal(staff.line[0]?.studentEmail, "ada@northeastern.edu");
    assert.equal(staff.taEmail, "trivedi.shl@northeastern.edu");
  });
});

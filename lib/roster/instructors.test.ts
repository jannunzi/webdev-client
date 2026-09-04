import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_INSTRUCTOR_EMAIL,
  instructorEmailsFromEnv,
  isInstructor,
  isStaff,
  isTa,
  taEmailsFromEnv,
} from "./instructors";

describe("instructor and TA email allowlists", () => {
  it("defaults INSTRUCTOR_EMAILS to Jose when unset or empty", () => {
    assert.deepEqual(instructorEmailsFromEnv(undefined), [
      DEFAULT_INSTRUCTOR_EMAIL,
    ]);
    assert.deepEqual(instructorEmailsFromEnv(""), [DEFAULT_INSTRUCTOR_EMAIL]);
    assert.deepEqual(instructorEmailsFromEnv("  , ; "), [
      DEFAULT_INSTRUCTOR_EMAIL,
    ]);
  });

  it("parses a comma-separated instructor allowlist", () => {
    assert.deepEqual(
      instructorEmailsFromEnv(
        "jannunzi@gmail.com, TA@Northeastern.edu; skip not-an-email",
      ),
      ["jannunzi@gmail.com", "ta@northeastern.edu"],
    );
  });

  it("does not inject the instructor default when the env list is non-empty", () => {
    assert.deepEqual(instructorEmailsFromEnv("other@northeastern.edu"), [
      "other@northeastern.edu",
    ]);
  });

  it("treats TA_EMAILS as empty when unset", () => {
    assert.deepEqual(taEmailsFromEnv(undefined), []);
    assert.deepEqual(taEmailsFromEnv(""), []);
    assert.deepEqual(taEmailsFromEnv("  , ; "), []);
  });

  it("parses TA_EMAILS the same way as roster emails", () => {
    assert.deepEqual(
      taEmailsFromEnv("ada@northeastern.edu, Pat@Gmail.com; skip"),
      ["ada@northeastern.edu", "pat@gmail.com"],
    );
  });

  it("isInstructor matches any collected email against the instructor allowlist", () => {
    const allowlist = ["jannunzi@gmail.com"];
    assert.equal(isInstructor(["Jannunzi@Gmail.com"], allowlist), true);
    assert.equal(
      isInstructor(
        ["j.annunziato@northeastern.edu", "jannunzi@gmail.com"],
        allowlist,
      ),
      true,
    );
    assert.equal(
      isInstructor(["jane.doe@northeastern.edu"], allowlist),
      false,
    );
    assert.equal(isInstructor([], allowlist), false);
  });

  it("does not treat a rostered student or TA as instructor", () => {
    assert.equal(
      isInstructor(["ta@northeastern.edu"], ["jannunzi@gmail.com"]),
      false,
    );
    assert.equal(
      isInstructor(["jane.doe@northeastern.edu"], ["jannunzi@gmail.com"]),
      false,
    );
  });

  it("isStaff is instructor OR TA, and canvas_roster emails are not staff", () => {
    const instructors = ["jannunzi@gmail.com"];
    const tas = ["ada@northeastern.edu"];
    assert.equal(isStaff(["jannunzi@gmail.com"], instructors, tas), true);
    assert.equal(isStaff(["ADA@northeastern.edu"], instructors, tas), true);
    assert.equal(
      isStaff(["jane.doe@northeastern.edu"], instructors, tas),
      false,
    );
    assert.equal(isStaff([], instructors, tas), false);
    assert.equal(isTa(["ada@northeastern.edu"], tas), true);
    assert.equal(isTa(["jannunzi@gmail.com"], tas), false);
  });
});

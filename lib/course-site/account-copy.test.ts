import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { COURSE_WEBSITE_ACCOUNT_COPY } from "./account-copy";

const ALL_COPY = Object.values(COURSE_WEBSITE_ACCOUNT_COPY).join(" ");

describe("course website account copy", () => {
  it("never names Clerk in strings shown to students", () => {
    for (const [key, value] of Object.entries(COURSE_WEBSITE_ACCOUNT_COPY)) {
      assert.equal(/\bClerk\b/i.test(value), false, key);
    }
  });

  it("states that Kambaz / the course site is separate from Canvas and SSO", () => {
    assert.equal(
      COURSE_WEBSITE_ACCOUNT_COPY.heading,
      "Course website accounts",
    );
    assert.match(COURSE_WEBSITE_ACCOUNT_COPY.separateFromCanvas, /Kambaz/);
    assert.match(
      COURSE_WEBSITE_ACCOUNT_COPY.separateFromCanvas,
      /https:\/\/webdev-client\.vercel\.app\//,
    );
    assert.match(
      COURSE_WEBSITE_ACCOUNT_COPY.separateFromCanvas,
      /separate from Canvas and Northeastern SSO/i,
    );
    assert.match(
      COURSE_WEBSITE_ACCOUNT_COPY.separateFromCanvas,
      /not the same as signing into Canvas/i,
    );
  });

  it("tells students to Sign up first because accounts are not pre-provisioned", () => {
    assert.match(
      COURSE_WEBSITE_ACCOUNT_COPY.notPreProvisioned,
      /not pre-provisioned/i,
    );
    assert.match(
      COURSE_WEBSITE_ACCOUNT_COPY.notPreProvisioned,
      /couldn['’]t find your account/i,
    );
    assert.match(
      COURSE_WEBSITE_ACCOUNT_COPY.notPreProvisioned,
      /do not need roster access/i,
    );
    assert.match(COURSE_WEBSITE_ACCOUNT_COPY.signUpThenSignIn, /Sign up/);
    assert.match(COURSE_WEBSITE_ACCOUNT_COPY.signUpThenSignIn, /Sign in/);
    assert.match(
      COURSE_WEBSITE_ACCOUNT_COPY.signUpThenSignIn,
      /school email is fine/i,
    );
    assert.match(COURSE_WEBSITE_ACCOUNT_COPY.signInPageHint, /Sign up first/i);
    assert.match(
      COURSE_WEBSITE_ACCOUNT_COPY.signInPageHint,
      /If you don['’]t have an account yet/i,
    );
    assert.match(
      COURSE_WEBSITE_ACCOUNT_COPY.signInPageHint,
      /Couldn['’]t find your account/i,
    );
    assert.match(
      COURSE_WEBSITE_ACCOUNT_COPY.signInPageHint,
      /not that you need roster access/i,
    );
    assert.match(
      COURSE_WEBSITE_ACCOUNT_COPY.signUpPageHint,
      /nothing is pre-provisioned/i,
    );
  });

  it("keeps graded-quiz roster gating separate from creating a site account", () => {
    assert.match(COURSE_WEBSITE_ACCOUNT_COPY.quizRosterSeparate, /Sign-up is open/i);
    assert.match(
      COURSE_WEBSITE_ACCOUNT_COPY.quizRosterSeparate,
      /Taking a graded quiz is different/i,
    );
    assert.match(
      COURSE_WEBSITE_ACCOUNT_COPY.quizRosterSeparate,
      /Canvas course roster/i,
    );
    assert.match(
      COURSE_WEBSITE_ACCOUNT_COPY.quizRosterSeparate,
      /does not enroll you on the roster/i,
    );
    assert.match(
      COURSE_WEBSITE_ACCOUNT_COPY.signUpPageHint,
      /taking a graded quiz still requires your Canvas roster email/i,
    );
    assert.doesNotMatch(
      COURSE_WEBSITE_ACCOUNT_COPY.signInPageHint,
      /email on the course roster/i,
    );
    assert.doesNotMatch(ALL_COPY, /pre-created/i);
    assert.doesNotMatch(ALL_COPY, /Canvas login/i);
    assert.doesNotMatch(ALL_COPY, /Northeastern login/i);
  });
});

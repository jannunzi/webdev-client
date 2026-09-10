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

  it("requires the same Northeastern email used on Canvas so progress can be mapped", () => {
    const canvasEmail = /same Northeastern email you use on Canvas/i;
    const mapProgress = /map site progress back to the Canvas roster/i;
    assert.match(COURSE_WEBSITE_ACCOUNT_COPY.signUpThenSignIn, canvasEmail);
    assert.match(COURSE_WEBSITE_ACCOUNT_COPY.signUpThenSignIn, mapProgress);
    assert.match(COURSE_WEBSITE_ACCOUNT_COPY.signInPageHint, canvasEmail);
    assert.match(COURSE_WEBSITE_ACCOUNT_COPY.signInPageHint, mapProgress);
    assert.match(COURSE_WEBSITE_ACCOUNT_COPY.signUpPageHint, canvasEmail);
    assert.match(COURSE_WEBSITE_ACCOUNT_COPY.signUpPageHint, mapProgress);
    assert.match(COURSE_WEBSITE_ACCOUNT_COPY.assignmentAuthHint, canvasEmail);
    assert.match(COURSE_WEBSITE_ACCOUNT_COPY.assignmentSignInHint, canvasEmail);
    assert.match(
      COURSE_WEBSITE_ACCOUNT_COPY.signInWithCanvasEmail,
      /Canvas email/i,
    );
    assert.match(
      COURSE_WEBSITE_ACCOUNT_COPY.signUpWithCanvasEmail,
      /Canvas email/i,
    );
    assert.doesNotMatch(ALL_COPY, /school email is fine/i);
  });

  it("keeps graded-quiz roster gating on the Canvas email", () => {
    assert.match(
      COURSE_WEBSITE_ACCOUNT_COPY.quizRosterSeparate,
      /same Northeastern email you use on Canvas/i,
    );
    assert.match(
      COURSE_WEBSITE_ACCOUNT_COPY.quizRosterSeparate,
      /Taking a graded quiz still requires that Canvas email/i,
    );
    assert.match(
      COURSE_WEBSITE_ACCOUNT_COPY.quizRosterSeparate,
      /does not enroll you on the roster/i,
    );
    assert.match(
      COURSE_WEBSITE_ACCOUNT_COPY.signUpPageHint,
      /taking a graded quiz still requires your Canvas roster email/i,
    );
    assert.doesNotMatch(ALL_COPY, /pre-created/i);
    assert.doesNotMatch(ALL_COPY, /Canvas login/i);
    assert.doesNotMatch(ALL_COPY, /Northeastern login/i);
    assert.doesNotMatch(ALL_COPY, /sign (?:in|up) with (?:Northeastern )?SSO/i);
  });
});

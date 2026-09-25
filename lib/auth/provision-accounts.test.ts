import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import {
  DEFAULT_PROVISIONED_TAG,
  maskSecret,
  parseProvisionCsv,
  provisionPublicMetadata,
  provisionResultStatus,
  scrubSecrets,
} from "./provision-accounts";

const CSV = `email,firstName,lastName,nuid,section
Ada.Lovelace@northeastern.edu,Ada,Lovelace,001234567,CS5610-09
bob@northeastern.edu,Bob,Stone,12345678,CS4550-01
chen.ryan@northeastern.edu,"Ryan",Chen,009988776,CS5610-02
`;

describe("provision account CSV", () => {
  it("parses the required columns and keeps the NUID as text", () => {
    const { rows, errors } = parseProvisionCsv(CSV);
    assert.equal(rows.length, 2);
    assert.equal(errors.length, 1);
    assert.equal(rows[0]?.email, "ada.lovelace@northeastern.edu");
    assert.equal(rows[0]?.firstName, "Ada");
    assert.equal(rows[0]?.nuid, "001234567");
    assert.equal(rows[0]?.section, "CS5610-09");
    assert.equal(rows[1]?.email, "chen.ryan@northeastern.edu");
    assert.equal(rows[1]?.firstName, "Ryan");
    assert.match(errors[0]?.message ?? "", /9 digits/);
  });

  it("accepts spaced headers and rejects a missing column", () => {
    const spaced = parseProvisionCsv(
      "Email,First Name,Last Name,NUID,Section\nok@northeastern.edu,Ok,Student,123456789,01\n",
    );
    assert.equal(spaced.errors.length, 0);
    assert.equal(spaced.rows[0]?.firstName, "Ok");
    const missing = parseProvisionCsv("email,firstName,lastName\na@b.co,A,B\n");
    assert.match(missing.errors[0]?.message ?? "", /section/);
    assert.equal(missing.rows.length, 0);
  });

  it("masks secrets and never keeps password characters", () => {
    assert.equal(maskSecret("001234567"), "*********");
    assert.equal(maskSecret("001234567").includes("1"), false);
    const secret = "sk_live_super_secret";
    const scrubbed = scrubSecrets(
      `failed for 001234567 using ${secret}`,
      ["001234567", secret],
    );
    assert.equal(scrubbed.includes("001234567"), false);
    assert.equal(scrubbed.includes(secret), false);
    assert.match(scrubbed, /\*{9}/);
  });

  it("builds the public metadata flag and dry-run statuses", () => {
    assert.deepEqual(
      provisionPublicMetadata({ provisioned: DEFAULT_PROVISIONED_TAG, section: "CS5610-09" }),
      {
        mustChangePassword: true,
        provisioned: "2026-09-fa26",
        section: "CS5610-09",
      },
    );
    assert.equal(provisionResultStatus({ existing: true, dryRun: true }), "skipped");
    assert.equal(provisionResultStatus({ existing: false, dryRun: true }), "dry-run");
    assert.equal(provisionResultStatus({ existing: false, dryRun: false }), "created");
  });

  it("documents usage on the script and keeps it out of the build", () => {
    const script = readFileSync(join(process.cwd(), "scripts/provision-accounts.ts"), "utf8");
    const pkg = readFileSync(join(process.cwd(), "package.json"), "utf8");
    assert.match(script, /--dry-run/);
    assert.match(script, /CLERK_SECRET_KEY/);
    assert.match(script, /skipPasswordChecks:\s*true/);
    assert.match(script, /emailAddress:\s*\[row\.email\]/);
    assert.match(script, /password:\s*row\.nuid/);
    assert.match(script, /provisionPublicMetadata/);
    const build = JSON.parse(pkg).scripts.build as string;
    assert.equal(build.includes("provision-accounts"), false);
  });
});

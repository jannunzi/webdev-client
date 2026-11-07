import assert from "node:assert/strict";
import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, it } from "node:test";
import {
  AppRouterContext,
  type AppRouterInstance,
} from "next/dist/shared/lib/app-router-context.shared-runtime";
import OfficeHoursPage from "../../office-hours/page.tsx";
import SyllabusOfficeHours from "../components/OfficeHours.tsx";
import { course } from "./course.ts";
import {
  instructorOfficeBlocks,
  instructorOfficeHourRows,
  officeHourColumns,
  officeHourRows,
  officeHoursPlaceholder,
} from "./officeHours.ts";

const router: AppRouterInstance = {
  back() {},
  forward() {},
  refresh() {},
  push() {},
  replace() {},
  prefetch() {},
};

function markup(node: ReactNode): string {
  return renderToStaticMarkup(
    createElement(AppRouterContext.Provider, { value: router }, node),
  );
}

function assertPlainScheduleCopy(text: string) {
  assert.doesNotMatch(text, /Actual times are announced weekly/);
  assert.doesNotMatch(text, /Typical recent slot/);
  assert.doesNotMatch(text, /\btypical\b/i);
  assert.doesNotMatch(text, /\brecent\b/i);
  assert.doesNotMatch(text, /\babout\b/i);
  assert.doesNotMatch(text, /\blatest\b/i);
  assert.doesNotMatch(text, /not guaranteed/i);
  assert.doesNotMatch(text, /time not yet posted/);
  assert.doesNotMatch(text, /join link not yet posted/);
}

describe("instructor office hours", () => {
  it("keeps Monday and Wednesday at 3:00–4:00pm ET in Meserve Hall 052", () => {
    const block = instructorOfficeBlocks.find((item) => item.id === "mon-wed-in-person");
    assert.ok(block);
    assert.equal(block.days, "Monday and Wednesday");
    assert.equal(block.time, "3:00–4:00pm ET");
    assert.equal(block.modality, "in-person");
    assert.equal(block.place, "Meserve Hall 052 (basement)");
    assert.doesNotMatch(block.place, /105|Shillman/);
  });

  it("keeps Thursday and Friday on Zoom with no clock time and no join link", () => {
    const block = instructorOfficeBlocks.find((item) => item.id === "thu-fri-zoom");
    assert.ok(block);
    assert.equal(block.days, "Thursday and Friday");
    assert.equal(block.time, undefined);
    assert.equal(block.modality, "zoom");
    assert.equal(block.place, undefined);
    assert.equal(instructorOfficeBlocks.length, 2);
  });

  it("preserves the posted instructor email, room, and unposted Zoom time", () => {
    const rows = instructorOfficeHourRows(course.instructor);
    assert.equal(course.instructor.email, "j.annunziato@northeastern.edu");
    assert.equal(rows.length, 2);
    for (const row of rows) {
      assert.equal(row.name, "Dr. Jose Annunziato");
      assert.equal(row.role, "Instructor");
      assert.equal(row.contact, "j.annunziato@northeastern.edu");
    }
    assert.equal(rows[0]?.hours, "Monday and Wednesday, 3:00–4:00pm ET");
    assert.equal(rows[0]?.location, "Meserve Hall 052 (basement)");
    assert.equal(rows[1]?.hours, "Thursday and Friday on Zoom");
    assert.equal(
      rows[1]?.location,
      "An invite with the Zoom link will be posted on Piazza.",
    );
    assert.doesNotMatch(rows[1]?.location ?? "", /zoom\.us|https?:/);
    assert.equal(
      officeHoursPlaceholder,
      "Teaching assistants meet on Microsoft Teams. No join link is published — check that section’s Piazza announcements or email the TA for how to join.",
    );
    assertPlainScheduleCopy(
      `${officeHoursPlaceholder}\n${rows.map((row) => `${row.hours} ${row.location}`).join("\n")}`,
    );
  });

  it("records each section's recent TA slots and verified emails, without join links", () => {
    const byName = Object.fromEntries(officeHourRows.map((row) => [row.name, row]));
    assert.equal(officeHourRows.length, 7);

    const shloka = byName["Shloka Shreyans Trivedi"];
    assert.equal(shloka?.role, "Teaching assistant, CS 4550-01");
    assert.equal(shloka?.contact, "trivedi.shl@northeastern.edu");
    assert.equal(shloka?.hours, "Thursday and Friday, 10:00am–2:00pm ET");

    const anurag = byName["Anurag Bheemappa Gnanamurthy"];
    assert.equal(anurag?.role, "Teaching assistant, CS 4550-01");
    assert.equal(anurag?.contact, "bheemappagnanamurt.a@northeastern.edu");
    assert.match(anurag?.hours ?? "", /Fridays, 5:00–11:00pm ET/);

    const tisha = byName["Tisha Sujal Kotadia"];
    assert.equal(tisha?.role, "Teaching assistant, CS 5610-02");
    assert.equal(tisha?.contact, "kotadia.t@northeastern.edu");
    assert.match(tisha?.hours ?? "", /starting 7:00pm ET/);
    assert.match(tisha?.hours ?? "", /end time varies/);
    assert.doesNotMatch(tisha?.hours ?? "", /7:00–9:00|7:00–11:00|7–9|7–11/);

    const aryan = byName["Aryan Alpesh Mehta"];
    assert.equal(aryan?.role, "Teaching assistant, CS 5610-02");
    assert.equal(aryan?.contact, "mehta.arya@northeastern.edu");
    assert.equal(aryan?.hours, "Weekends; day and time vary");
    assert.doesNotMatch(aryan?.hours ?? "", /\d:00/);

    const tanishq = byName["Tanishq Neela"];
    assert.equal(tanishq?.role, "Teaching assistant, CS 5610-09");
    assert.equal(tanishq?.contact, "neela.t@northeastern.edu");
    assert.match(tanishq?.hours ?? "", /Monday and Wednesday, 7:00–11:00am ET/);

    const geethanjali = byName["Geethanjali Ravichandra"];
    assert.equal(geethanjali?.role, "Teaching assistant, CS 5610-09");
    assert.equal(geethanjali?.contact, "ravichandra.g@northeastern.edu");
    assert.match(geethanjali?.hours ?? "", /Thursday and Friday, 7:00–11:00am ET/);

    const giuseppe = byName["Giuseppe Marotta"];
    assert.equal(giuseppe?.role, "Course staff");
    assert.match(giuseppe?.hours ?? "", /No office hours/);
    assert.match(giuseppe?.hours ?? "", /Piazza/);
    assert.equal(giuseppe?.contact, "Piazza");
    assert.doesNotMatch(giuseppe?.hours ?? "", /24\/7|any time|always available/i);

    for (const row of officeHourRows) {
      if (row.name === "Giuseppe Marotta") continue;
      assert.equal(row.location, "Microsoft Teams — no join link posted");
      assert.match(row.contact, /@northeastern\.edu$/);
    }
    const joined = officeHourRows
      .map((row) => `${row.hours} ${row.location} ${row.contact}`)
      .join("\n");
    assert.doesNotMatch(joined, /https?:|teams\.microsoft|zoom\.us|\d{10,}/);
    assert.doesNotMatch(joined, /phone/i);
    assertPlainScheduleCopy(joined);
  });

  it("renders the room and Piazza Zoom note without a join URL or posted time", () => {
    const html = markup(createElement(OfficeHoursPage));
    assert.match(html, /All times are America\/New_York \(Eastern Time\)/);
    assert.match(html, /Monday and Wednesday, 3:00–4:00pm ET/);
    assert.match(html, /Meserve Hall 052 \(basement\)/);
    assert.match(html, /Thursday and Friday on Zoom/);
    assert.match(html, /An invite with the Zoom link will be posted on Piazza/);
    assert.match(html, /Thursday and Friday, 10:00am–2:00pm ET/);
    assert.match(html, /Friday evenings, starting 7:00pm ET; end time varies/);
    assert.match(html, /Weekends; day and time vary/);
    assert.match(html, /Microsoft Teams\. No join link is published/);
    assert.doesNotMatch(html, /join link not yet posted/);
    assert.doesNotMatch(html, /room not yet posted/);
    assert.doesNotMatch(html, /not a guaranteed/);
    assert.doesNotMatch(html, /guaranteed recurring/);
    assertPlainScheduleCopy(html);
    assert.match(html, /href="mailto:j\.annunziato@northeastern\.edu"/);
    assert.match(html, /href="mailto:trivedi\.shl@northeastern\.edu"/);
    assert.match(html, /href="mailto:bheemappagnanamurt\.a@northeastern\.edu"/);
    assert.match(html, /href="mailto:kotadia\.t@northeastern\.edu"/);
    assert.match(html, /href="mailto:mehta\.arya@northeastern\.edu"/);
    assert.match(html, /href="mailto:neela\.t@northeastern\.edu"/);
    assert.match(html, /href="mailto:ravichandra\.g@northeastern\.edu"/);
    assert.match(html, /CS 4550-01/);
    assert.match(html, /CS 5610-02/);
    assert.match(html, /CS 5610-09/);
    assert.match(html, /Giuseppe Marotta/);
    assert.doesNotMatch(html, /Thursday and Friday[^<]*3:00/);
    assert.doesNotMatch(html, /3:00–4:00pm ET[^<]*Zoom/);
    assert.doesNotMatch(html, /zoom\.us|teams\.microsoft|https?:/);
    assert.doesNotMatch(html, /95309089469/);
    assert.doesNotMatch(html, /\d{10,}/);
    assert.doesNotMatch(html, /Shillman/);
    assert.doesNotMatch(html, /WVH/);
    assert.doesNotMatch(html, /Teaching assistants — TBA/);
    assert.doesNotMatch(html, /24\/7/);
  });

  it("uses the same plain schedule copy in the syllabus office-hours section", () => {
    const html = markup(
      createElement(SyllabusOfficeHours, {
        rows: officeHourRows,
        columns: officeHourColumns,
        placeholder: officeHoursPlaceholder,
      }),
    );
    assert.match(html, /Teaching assistants meet on Microsoft Teams/);
    assert.match(html, /No join link is published/);
    assert.match(html, /Thursday and Friday, 10:00am–2:00pm ET/);
    assert.match(html, /Fridays, 5:00–11:00pm ET/);
    assert.match(html, /Friday evenings, starting 7:00pm ET; end time varies/);
    assert.match(html, /Weekends; day and time vary/);
    assert.match(html, /Monday and Wednesday, 7:00–11:00am ET/);
    assert.match(html, /Thursday and Friday, 7:00–11:00am ET/);
    assert.match(html, /href="mailto:trivedi\.shl@northeastern\.edu"/);
    assert.match(html, /href="\/office-hours"/);
    assertPlainScheduleCopy(html);
    assert.doesNotMatch(html, /7:00–9:00|7:00–11:00pm|7–9|7–11/);
  });
});

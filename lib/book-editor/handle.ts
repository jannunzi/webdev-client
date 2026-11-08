import type { JSONContent } from "@tiptap/core";
import type { StaffGate } from "@/lib/inline-edit/handle-edit";
import { extractChapter1 } from "./extract";
import { chapter1Seed } from "./seed";
import { validateChapterDoc } from "./schema";
import { CHAPTER_ID, storagePlan, type ChapterStore, type StoragePlan } from "./store";

export type ChapterPayload = {
  ok: true;
  id: typeof CHAPTER_ID;
  revision: number;
  persisted: boolean;
  doc: JSONContent;
  storage: StoragePlan;
  inventory: ReturnType<typeof chapter1Seed>["inventory"];
  updatedAt: string | null;
};

function seedPayload(plan: StoragePlan): ChapterPayload {
  const seed = chapter1Seed();
  return {
    ok: true,
    id: CHAPTER_ID,
    revision: 0,
    persisted: false,
    doc: seed.doc,
    storage: plan,
    inventory: seed.inventory,
    updatedAt: null,
  };
}

function storedPayload(
  record: { revision: number; doc: JSONContent; updatedAt: string },
  plan: StoragePlan,
): ChapterPayload {
  return {
    ok: true,
    id: CHAPTER_ID,
    revision: record.revision,
    persisted: true,
    doc: record.doc,
    storage: plan,
    inventory: chapter1Seed().inventory,
    updatedAt: record.updatedAt,
  };
}

export async function readChapter(store: ChapterStore | null, plan = storagePlan()): Promise<ChapterPayload> {
  if (!store || !plan.available) return seedPayload(plan);
  const record = await store.get(CHAPTER_ID);
  if (!record) return seedPayload(plan);
  return storedPayload(record, plan);
}

export async function handleChapterGet(options: {
  staff: StaffGate;
  store: ChapterStore | null;
  plan?: StoragePlan;
}): Promise<Response> {
  const actor = asStaff(options.staff);
  if (actor instanceof Response) return actor;
  return Response.json(await readChapter(options.store, options.plan ?? storagePlan()));
}

export async function handleChapterPut(
  request: Request,
  options: { staff: StaffGate; store: ChapterStore | null; plan?: StoragePlan },
): Promise<Response> {
  const actor = asStaff(options.staff);
  if (actor instanceof Response) return actor;
  const plan = options.plan ?? storagePlan();
  if (!options.store || !plan.available) {
    return Response.json({ ok: false, error: plan.message, storage: plan }, { status: 503 });
  }
  const body = await readJson(request);
  if (!body.ok) return Response.json({ ok: false, error: body.error }, { status: body.status });
  const expected = body.value.expectedRevision;
  if (typeof expected !== "number" || !Number.isInteger(expected) || expected < 0) {
    return Response.json({ ok: false, error: "The revision is missing." }, { status: 400 });
  }
  const embeds = new Set(chapter1Seed().embeds.map((item) => item.component));
  const validated = validateChapterDoc(body.value.doc, embeds);
  if (!validated.ok) return Response.json({ ok: false, error: validated.error }, { status: 400 });
  const saved = await options.store.save({
    id: CHAPTER_ID,
    doc: validated.doc,
    expectedRevision: expected,
    email: actor.email,
  });
  if (!saved.ok) {
    return Response.json(
      {
        ok: false,
        error: "A newer copy is saved. Your draft is still in the editor.",
        conflict: saved.conflict ? storedPayload(saved.conflict, plan) : null,
      },
      { status: 409 },
    );
  }
  return Response.json(storedPayload(saved.record, plan));
}

/**
 * Archives the current Chapter 1 draft as a revision, then replaces it with a
 * fresh import of the published chapter source. Does not touch /book.
 */
export async function handleChapterReset(options: {
  staff: StaffGate;
  store: ChapterStore | null;
  plan?: StoragePlan;
}): Promise<Response> {
  const actor = asStaff(options.staff);
  if (actor instanceof Response) return actor;
  const plan = options.plan ?? storagePlan();
  if (!options.store || !plan.available) {
    return Response.json({ ok: false, error: plan.message, storage: plan }, { status: 503 });
  }
  const current = await options.store.get(CHAPTER_ID);
  const extracted = extractChapter1();
  const embeds = new Set(extracted.embeds.map((item) => item.component));
  const validated = validateChapterDoc(extracted.doc, embeds);
  if (!validated.ok) {
    return Response.json({ ok: false, error: validated.error }, { status: 500 });
  }
  const saved = await options.store.save({
    id: CHAPTER_ID,
    doc: validated.doc,
    expectedRevision: current?.revision ?? 0,
    email: actor.email,
  });
  if (!saved.ok) {
    return Response.json(
      { ok: false, error: "A newer copy is saved. Your draft is still in the editor.", conflict: saved.conflict },
      { status: 409 },
    );
  }
  return Response.json({
    ...storedPayload(saved.record, plan),
    backupRevision: current?.revision ?? null,
  });
}

export async function handleRevisionList(options: {
  staff: StaffGate;
  store: ChapterStore | null;
}): Promise<Response> {
  const actor = asStaff(options.staff);
  if (actor instanceof Response) return actor;
  if (!options.store) {
    return Response.json({ ok: true, revisions: [] });
  }
  const revisions = await options.store.revisions(CHAPTER_ID);
  return Response.json({
    ok: true,
    revisions: revisions.map((item) => ({
      revision: item.revision,
      updatedAt: item.updatedAt,
      updatedBy: item.updatedBy,
    })),
  });
}

export async function handleRevisionRestore(
  request: Request,
  options: { staff: StaffGate; store: ChapterStore | null; plan?: StoragePlan },
): Promise<Response> {
  const actor = asStaff(options.staff);
  if (actor instanceof Response) return actor;
  const plan = options.plan ?? storagePlan();
  if (!options.store || !plan.available) {
    return Response.json({ ok: false, error: plan.message, storage: plan }, { status: 503 });
  }
  const body = await readJson(request);
  if (!body.ok) return Response.json({ ok: false, error: body.error }, { status: body.status });
  const expected = body.value.expectedRevision;
  const revision = body.value.revision;
  if (typeof expected !== "number" || typeof revision !== "number") {
    return Response.json({ ok: false, error: "The revision is missing." }, { status: 400 });
  }
  const snapshot = await options.store.revision(CHAPTER_ID, revision);
  if (!snapshot) return Response.json({ ok: false, error: "That revision is not stored." }, { status: 404 });
  const embeds = new Set(chapter1Seed().embeds.map((item) => item.component));
  const validated = validateChapterDoc(snapshot.doc, embeds);
  if (!validated.ok) return Response.json({ ok: false, error: validated.error }, { status: 400 });
  const saved = await options.store.save({
    id: CHAPTER_ID,
    doc: validated.doc,
    expectedRevision: expected,
    email: actor.email,
  });
  if (!saved.ok) {
    return Response.json(
      { ok: false, error: "A newer copy is saved. Your draft is still in the editor." },
      { status: 409 },
    );
  }
  return Response.json(storedPayload(saved.record, plan));
}

function asStaff(staff: StaffGate): { email: string } | Response {
  if ("error" in staff) {
    return Response.json({ ok: false, error: staff.error }, { status: staff.status });
  }
  return staff;
}

async function readJson(
  request: Request,
): Promise<{ ok: true; value: Record<string, unknown> } | { ok: false; error: string; status: number }> {
  const text = await request.text();
  if (text.length > 1_600_000) return { ok: false, error: "The chapter is too large to save.", status: 413 };
  try {
    const value = JSON.parse(text) as unknown;
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return { ok: false, error: "Invalid JSON.", status: 400 };
    }
    return { ok: true, value: value as Record<string, unknown> };
  } catch {
    return { ok: false, error: "Invalid JSON.", status: 400 };
  }
}

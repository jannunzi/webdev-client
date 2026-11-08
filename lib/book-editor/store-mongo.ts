import "server-only";

import type { JSONContent } from "@tiptap/core";
import { getCollection } from "@/lib/mongo";
import {
  DOCUMENT_COLLECTION,
  REVISION_COLLECTION,
  type ChapterRecord,
  type ChapterStore,
  type RevisionRecord,
} from "./store";

type DocumentRow = ChapterRecord & { namespace: "book-editor" };
type RevisionRow = RevisionRecord & { namespace: "book-editor" };

const CAP = 20;

export function createMongoStore(): ChapterStore {
  return {
    kind: "mongo",
    async get(id) {
      const docs = await getCollection<DocumentRow>(DOCUMENT_COLLECTION);
      const row = await docs.findOne({ id, namespace: "book-editor" });
      return row ? toRecord(row) : null;
    },
    async save(input) {
      const docs = await getCollection<DocumentRow>(DOCUMENT_COLLECTION);
      const revisions = await getCollection<RevisionRow>(REVISION_COLLECTION);
      const current = await docs.findOne({ id: input.id, namespace: "book-editor" });
      if ((current?.revision ?? 0) !== input.expectedRevision) {
        return { ok: false, conflict: current ? toRecord(current) : null };
      }
      const record: ChapterRecord = {
        id: input.id,
        revision: input.expectedRevision + 1,
        doc: input.doc,
        updatedAt: new Date().toISOString(),
        updatedBy: input.email,
      };
      if (current) {
        await revisions.insertOne({ ...toRecord(current), savedAt: record.updatedAt, namespace: "book-editor" });
        const stale = await revisions
          .find({ id: input.id, namespace: "book-editor" })
          .sort({ revision: -1 })
          .skip(CAP)
          .toArray();
        if (stale.length) {
          await revisions.deleteMany({ _id: { $in: stale.map((row) => row._id) } });
        }
      }
      if (!current) {
        try {
          await docs.insertOne({ ...record, namespace: "book-editor" });
        } catch (error) {
          if (!isDuplicateKey(error)) throw error;
          const latest = await docs.findOne({ id: input.id, namespace: "book-editor" });
          return { ok: false, conflict: latest ? toRecord(latest) : null };
        }
      } else {
        const updated = await docs.updateOne(
          { id: input.id, namespace: "book-editor", revision: input.expectedRevision },
          { $set: record },
        );
        if (updated.matchedCount === 0) {
          const latest = await docs.findOne({ id: input.id, namespace: "book-editor" });
          return { ok: false, conflict: latest ? toRecord(latest) : null };
        }
      }
      return { ok: true, record };
    },
    async revisions(id) {
      const revisions = await getCollection<RevisionRow>(REVISION_COLLECTION);
      const rows = await revisions
        .find({ id, namespace: "book-editor" })
        .sort({ revision: -1 })
        .limit(CAP)
        .toArray();
      return rows.map((row) => ({ ...toRecord(row), savedAt: row.savedAt }));
    },
    async revision(id, revision) {
      const revisions = await getCollection<RevisionRow>(REVISION_COLLECTION);
      const row = await revisions.findOne({ id, revision, namespace: "book-editor" });
      return row ? { ...toRecord(row), savedAt: row.savedAt } : null;
    },
  };
}

function isDuplicateKey(error: unknown): boolean {
  return Boolean(error && typeof error === "object" && "code" in error && (error as { code?: number }).code === 11000);
}

function toRecord(row: { id: string; revision: number; doc: JSONContent; updatedAt: string; updatedBy: string }): ChapterRecord {
  return {
    id: row.id,
    revision: row.revision,
    doc: row.doc,
    updatedAt: row.updatedAt,
    updatedBy: row.updatedBy,
  };
}

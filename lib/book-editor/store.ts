import fs from "node:fs";
import path from "node:path";
import type { JSONContent } from "@tiptap/core";

export const CHAPTER_ID = "chapter-1";
export const DOCUMENT_COLLECTION = "book_editor_documents";
export const REVISION_COLLECTION = "book_editor_revisions";
const REVISION_CAP = 20;

export type ChapterRecord = {
  id: string;
  revision: number;
  doc: JSONContent;
  updatedAt: string;
  updatedBy: string;
};

export type RevisionRecord = ChapterRecord & { savedAt: string };

export type ChapterStore = {
  kind: "mongo" | "local-file";
  get(id: string): Promise<ChapterRecord | null>;
  save(input: {
    id: string;
    doc: JSONContent;
    expectedRevision: number;
    email: string;
  }): Promise<{ ok: true; record: ChapterRecord } | { ok: false; conflict: ChapterRecord | null }>;
  revisions(id: string): Promise<RevisionRecord[]>;
  revision(id: string, revision: number): Promise<RevisionRecord | null>;
};

export type StoragePlan =
  | { available: true; kind: "mongo" | "local-file"; message: string }
  | { available: false; kind: "unavailable"; message: string };

export function storagePlan(env: {
  NODE_ENV?: string;
  MONGODB_URI?: string;
} = process.env): StoragePlan {
  if (env.MONGODB_URI?.trim()) {
    return {
      available: true,
      kind: "mongo",
      message:
        "Autosave writes to the book_editor_documents collection in the configured MongoDB database. It does not change /book.",
    };
  }
  if (env.NODE_ENV === "production") {
    return {
      available: false,
      kind: "unavailable",
      message:
        "Chapter editor cannot autosave because MONGODB_URI is not set. The public book is unchanged. Set MONGODB_URI to the existing database (MONGODB_DB defaults to web-dev). No new service is required.",
    };
  }
  return {
    available: true,
    kind: "local-file",
    message:
      "Development file store at .data/book-editor. Production on kambaz.dev uses MONGODB_URI and will not use this folder.",
  };
}

export function localStoreDir(root = process.cwd()): string {
  return path.join(root, ".data", "book-editor");
}

export function createFileStore(dir: string): ChapterStore {
  let chain = Promise.resolve();
  const enqueue = <T>(work: () => Promise<T>) => {
    const run = chain.then(work, work);
    chain = run.then(
      () => undefined,
      () => undefined,
    );
    return run;
  };
  const fileFor = (id: string) => path.join(dir, `${id}.json`);
  const read = (id: string): { record: ChapterRecord | null; revisions: RevisionRecord[] } => {
    const file = fileFor(id);
    if (!fs.existsSync(file)) return { record: null, revisions: [] };
    const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as {
      record?: ChapterRecord | null;
      revisions?: RevisionRecord[];
    };
    return { record: parsed.record ?? null, revisions: parsed.revisions ?? [] };
  };
  const write = (id: string, payload: { record: ChapterRecord | null; revisions: RevisionRecord[] }) => {
    fs.mkdirSync(dir, { recursive: true });
    const file = fileFor(id);
    const tmp = `${file}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(payload));
    fs.renameSync(tmp, file);
  };
  return {
    kind: "local-file",
    get(id) {
      return enqueue(async () => read(id).record);
    },
    async save(input) {
      return enqueue(async () => {
        const current = read(input.id);
        if ((current.record?.revision ?? 0) !== input.expectedRevision) {
          return { ok: false as const, conflict: current.record };
        }
        const record: ChapterRecord = {
          id: input.id,
          revision: input.expectedRevision + 1,
          doc: input.doc,
          updatedAt: new Date().toISOString(),
          updatedBy: input.email,
        };
        const revisions = current.record
          ? [{ ...current.record, savedAt: record.updatedAt }, ...current.revisions].slice(0, REVISION_CAP)
          : current.revisions;
        write(input.id, { record, revisions });
        return { ok: true as const, record };
      });
    },
    revisions(id) {
      return enqueue(async () => read(id).revisions);
    },
    revision(id, revision) {
      return enqueue(async () => read(id).revisions.find((item) => item.revision === revision) ?? null);
    },
  };
}

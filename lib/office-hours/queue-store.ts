import "server-only";

import { isMongoConfigured } from "../config";
import { getCollection } from "../mongo";
import {
  OFFICE_HOUR_QUEUES_COLLECTION,
  emptyQueue,
  type OfficeHourQueue,
  type QueueEntry,
} from "./queue";

export type OfficeHourQueueDoc = {
  taId: string;
  taEmail: string;
  section: string;
  open: boolean;
  entries: QueueEntry[];
  updatedAt: Date;
};

function queueKey(taId: string, section: string): string {
  return `${taId}::${section}`;
}

const memoryQueues = new Map<string, OfficeHourQueue>();

function toQueue(doc: OfficeHourQueueDoc): OfficeHourQueue {
  return {
    taId: doc.taId,
    taEmail: doc.taEmail,
    section: doc.section,
    open: doc.open,
    entries: doc.entries ?? [],
    updatedAt:
      doc.updatedAt instanceof Date
        ? doc.updatedAt.toISOString()
        : new Date(doc.updatedAt).toISOString(),
  };
}

function toDoc(queue: OfficeHourQueue): OfficeHourQueueDoc {
  return {
    taId: queue.taId,
    taEmail: queue.taEmail,
    section: queue.section,
    open: queue.open,
    entries: queue.entries,
    updatedAt: new Date(queue.updatedAt),
  };
}

export async function getOfficeHourQueueCollection() {
  return getCollection<OfficeHourQueueDoc>(OFFICE_HOUR_QUEUES_COLLECTION);
}

let queueIndexesPromise: Promise<void> | null = null;

export async function ensureOfficeHourQueueIndexes(): Promise<void> {
  const collection = await getOfficeHourQueueCollection();
  await collection.createIndex({ taId: 1, section: 1 }, { unique: true });
  await collection.createIndex({ taEmail: 1, section: 1 });
}

function useMemory(): boolean {
  return !isMongoConfigured();
}

export async function readOfficeHourQueue(input: {
  taId: string;
  taEmail: string;
  section: string;
}): Promise<OfficeHourQueue> {
  if (useMemory()) {
    return (
      memoryQueues.get(queueKey(input.taId, input.section)) ??
      emptyQueue(input)
    );
  }

  const collection = await getOfficeHourQueueCollection();
  queueIndexesPromise ??= ensureOfficeHourQueueIndexes().catch((error) => {
    queueIndexesPromise = null;
    console.error("office hour queue index ensure failed", error);
  });
  await queueIndexesPromise;

  const doc = await collection.findOne({
    taId: input.taId,
    section: input.section,
  });
  return doc ? toQueue(doc) : emptyQueue(input);
}

export async function writeOfficeHourQueue(
  queue: OfficeHourQueue,
): Promise<void> {
  if (useMemory()) {
    memoryQueues.set(queueKey(queue.taId, queue.section), queue);
    return;
  }

  const collection = await getOfficeHourQueueCollection();
  await collection.updateOne(
    { taId: queue.taId, section: queue.section },
    { $set: toDoc(queue) },
    { upsert: true },
  );
}

export function resetMemoryOfficeHourQueues(): void {
  memoryQueues.clear();
}

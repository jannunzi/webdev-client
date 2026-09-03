import "server-only";

import { MongoClient, type Collection, type Db, type Document } from "mongodb";
import { isMongoConfigured, mongoDbName } from "./config";

const globalForMongo = globalThis as typeof globalThis & {
  _mongoClient?: MongoClient;
  _mongoClientPromise?: Promise<MongoClient>;
};

export class MongoNotConfiguredError extends Error {
  constructor() {
    super("MONGODB_URI is not configured.");
    this.name = "MongoNotConfiguredError";
  }
}

export async function getMongoClient(): Promise<MongoClient> {
  if (!isMongoConfigured()) {
    throw new MongoNotConfiguredError();
  }

  if (globalForMongo._mongoClient) {
    return globalForMongo._mongoClient;
  }

  if (!globalForMongo._mongoClientPromise) {
    const client = new MongoClient(process.env.MONGODB_URI!);
    globalForMongo._mongoClientPromise = client.connect().then((connected) => {
      globalForMongo._mongoClient = connected;
      return connected;
    });
  }

  return globalForMongo._mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(mongoDbName());
}

export async function getCollection<T extends Document>(
  name: string,
): Promise<Collection<T>> {
  const db = await getDb();
  return db.collection<T>(name);
}

import mongoose from "mongoose";

let connected = false;

/**
 * PDF: DATABASE_CONNECTION_STRING
 * Also accepted: MONGO_CONNECTION_STRING (CI / book env).
 * Unset or unreachable → in-memory DAOs so the server still boots.
 */
export function mongoConnectionString() {
  return (
    process.env.DATABASE_CONNECTION_STRING ||
    process.env.MONGO_CONNECTION_STRING ||
    ""
  );
}

export function isMongoEnabled() {
  return connected;
}

export async function connectDatabase() {
  const uri = mongoConnectionString();
  if (!uri) {
    console.log(
      "[kambaz] No DATABASE_CONNECTION_STRING / MONGO_CONNECTION_STRING — in-memory DAOs",
    );
    return false;
  }
  try {
    await mongoose.connect(uri);
    connected = true;
    console.log("[kambaz] Connected to MongoDB");
    return true;
  } catch (err) {
    connected = false;
    console.warn(
      "[kambaz] MongoDB unavailable, using in-memory DAOs:",
      err instanceof Error ? err.message : err,
    );
    return false;
  }
}

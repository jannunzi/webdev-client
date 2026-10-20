import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { connection } from "next/server";

const COUNTER_FILE = path.join(os.tmpdir(), "lab3-visits.txt");

export default async function VisitCounterDemo() {
  await connection();
  let visits = 0;
  try {
    visits = Number(await fs.readFile(COUNTER_FILE, "utf8")) || 0;
  } catch {
    visits = 0;
  }
  visits += 1;
  try {
    await fs.writeFile(COUNTER_FILE, String(visits));
  } catch (error) {
    console.error("Could not save the visit count:", error);
  }
  return (
    <div id="wd-visit-counter-demo">
      <h3>Visit counter</h3>
      <p>This page has been rendered {visits} times.</p>
      <p>Counter file: {COUNTER_FILE}</p>
    </div>
  );
}

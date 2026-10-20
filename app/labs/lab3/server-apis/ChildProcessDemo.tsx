import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export default async function ChildProcessDemo() {
  let output: string;
  try {
    const { stdout } = await execFileAsync("node", ["--version"]);
    output = stdout.trim();
  } catch (error) {
    output = `Could not run node: ${error instanceof Error ? error.message : "unknown error"}`;
  }
  return (
    <div id="wd-child-process-demo">
      <h3>child_process</h3>
      <p>Output of node --version: {output}</p>
    </div>
  );
}

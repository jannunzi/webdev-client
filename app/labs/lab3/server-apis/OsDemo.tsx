import os from "node:os";

export default function OsDemo() {
  const info = {
    hostname: os.hostname(),
    platform: os.platform(),
    uptimeMinutes: Math.round(os.uptime() / 60),
    cpuCount: os.cpus().length,
    freeMemoryMB: Math.round(os.freemem() / 1024 / 1024),
  };
  return (
    <div id="wd-os-demo">
      <h3>The os module</h3>
      <pre>{JSON.stringify(info, null, 2)}</pre>
    </div>
  );
}

import ClientTime from "./ClientTime";

export default function ServerTimeDemo() {
  const serverTime = new Date().toLocaleTimeString("en-US", { timeZone: "UTC" });
  return (
    <div id="wd-server-time-demo">
      <h3>Server time vs client time</h3>
      <p>Server time (UTC): {serverTime}</p>
      <ClientTime />
    </div>
  );
}

import { headers } from "next/headers";

export default async function RequestHeadersDemo() {
  const requestHeaders = await headers();
  const userAgent = requestHeaders.get("user-agent") ?? "(none)";
  const forwardedFor = requestHeaders.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0].trim() ?? "(unknown, e.g. on localhost)";
  return (
    <div id="wd-request-headers-demo">
      <h3>headers()</h3>
      <p>User agent: {userAgent}</p>
      <p>Your IP as the server sees it: {ip}</p>
    </div>
  );
}

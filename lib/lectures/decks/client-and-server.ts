import type { LectureSlide } from "../types";

export const CLIENT_AND_SERVER_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 3 · Client and Server",
      "§3.7 · where the component is allowed to run",
    ],
  },
  {
    id: "purpose",
    title: "Implementing Client and Server Components",
    kind: "content",
    bullets: [
      "Next.js components are **Server Components** unless you say otherwise",
      "They render on the server, send HTML, and can read disk and env",
      "They cannot use hooks, clicks, or `usePathname`",
      "Add `\"use client\"` as the **first** statement to make a **Client Component**",
      "A Client Component still renders once on the server for the first HTML, then **hydrates** — React attaches to that HTML and keeps it running in the browser",
    ],
  },
  {
    id: "client",
    title: "usePathname needs a Client Component",
    kind: "content",
    code: `"use client";

import { usePathname } from "next/navigation";

export default function ClientComponentDemo() {
  const pathname = usePathname();
  return (
    <div id="wd-client-component-demo">
      <h1>Client Component Demo</h1>
      <p>Current pathname: {pathname}</p>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/ClientComponentDemo.tsx",
    codeHighlightLines: [1, 6],
  },
  {
    id: "client-live",
    title: "ClientComponentDemo: live demo",
    kind: "demo",
    bullets: [
      "`usePathname` reads the address bar — hooks only work in Client Components",
      "Remove the directive and `next dev` or `next build` stops: the hook needs `\"use client\"`",
      "View Source on `/labs/lab3` still shows the pathname text — rendered on the server first",
      "Embedded here the path is the slides route; Lab 3 shows `/labs/lab3`",
    ],
    embed: "js-client-component",
  },
  {
    id: "server",
    title: "The server can read the disk",
    kind: "content",
    code: `import fs from "node:fs";
import path from "node:path";

export default function ServerComponentDemo() {
  const platform = process.platform;
  const nodeVersion = process.version;
  const serverRenderTime = new Date().toLocaleTimeString();
  const lab3Dir = path.join(process.cwd(), "app/labs/lab3");
  let files: string[] = [];
  try {
    files = fs.readdirSync(lab3Dir);
  } catch (error) {
    console.error("Error reading lab3 directory:", error);
    files = [];
  }
  return (
    <div id="wd-server-component-demo">
      <h1>Server Component Demo</h1>
      <h2>Server Render Time</h2>
      <p>Rendered on server at: {serverRenderTime}</p>
      <h2>Server Information</h2>
      <pre>
        {JSON.stringify({ platform, nodeVersion, serverRenderTime }, null, 2)}
      </pre>
      <h2>Filesystem Access Demo</h2>
      <pre>{JSON.stringify(files, null, 2)}</pre>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/ServerComponentDemo.tsx",
    codeHighlightLines: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 26],
  },
  {
    id: "server-live",
    title: "ServerComponentDemo: live demo",
    kind: "demo",
    bullets: [
      "`process.platform` and `fs.readdirSync` exist only on Node",
      "Adding `\"use client\"` here would fail — the browser has no `fs`",
      "`try` / `catch` leaves `files` empty if the folder is missing",
      "On Vercel, Lab 3 is prerendered at build time: the time and file list don’t change on refresh. `npm run dev` re-renders every request",
    ],
    embed: "js-server-component",
  },
  {
    id: "suspense-basics",
    title: "Suspense: a fallback until ready",
    kind: "content",
    bullets: [
      "`<Suspense>`, from `react`, wraps part of a page and shows its `fallback` until that part is ready",
      "`next build` pre-renders the page ahead of time, with no visitor and so no URL",
      "A part that reads the URL renders later, in the browser. Without `<Suspense>`, `next build` fails",
    ],
    code: `<Suspense fallback={<p>Loading...</p>}>
  <SomeComponent />
</Suspense>`,
    codeLanguage: "tsx",
  },
  {
    id: "client-apis",
    title: "More client-only APIs",
    kind: "content",
    bullets: [
      "An **API** (application programming interface) is a set of functions and objects a program can call",
      "A **client-only API** exists only in the browser, so only a Client Component can call it",
      "Six small Client Components, one concept each, in `app/labs/lab3/client-apis`, on their own page `/labs/lab3/client-apis`",
    ],
  },
  {
    id: "pathname-intro",
    title: "usePathname",
    kind: "content",
    bullets: [
      "A **pathname** is the part of the URL after the host and before any `?`, e.g. `/labs/lab3/client-apis`",
      "A **hook** is a React function whose name starts with `use`, called only at the top of a component",
      "`usePathname()` from `next/navigation` returns the current pathname",
      "This version also splits it into **segments**, the pieces between the slashes",
    ],
  },
  {
    id: "pathname",
    title: "usePathname (code)",
    kind: "content",
    code: `"use client";

import { usePathname } from "next/navigation";

export default function PathnameDemo() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter((segment) => segment !== "");
  return (
    <div id="wd-pathname-demo">
      <h3>usePathname</h3>
      <p>Pathname: {pathname}</p>
      <p>Segments: {JSON.stringify(segments)}</p>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/client-apis/PathnameDemo.tsx",
  },
  {
    id: "pathname-live",
    title: "usePathname: live demo",
    kind: "demo",
    bullets: [
      "Here the pathname is the slides route",
      "On your page it is `/labs/lab3/client-apis`, with segments `[\"labs\",\"lab3\",\"client-apis\"]`",
    ],
    embed: "lab3-pathname",
  },
  {
    id: "client-page",
    title: "The client-apis page",
    kind: "content",
    bullets: [
      "Render each demo from a new page, `app/labs/lab3/client-apis/page.tsx`, and open `/labs/lab3/client-apis`. Add the next demos to it the same way",
    ],
    code: `import PathnameDemo from "./PathnameDemo";

export default function ClientApis() {
  return (
    <div id="wd-client-apis">
      <h2>Client-Only APIs</h2>
      <PathnameDemo />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/client-apis/page.tsx",
  },
  {
    id: "search-params-intro",
    title: "useSearchParams",
    kind: "content",
    bullets: [
      "The **query string** is the part of a URL after `?`: `name=value` pairs joined by `&`, as in `?name=Alice`",
      "Each pair is a **search parameter**",
      "`useSearchParams()` returns an object whose `get(\"name\")` reads one parameter, or `null` if it is missing",
      "The `??` operator supplies a default",
    ],
  },
  {
    id: "search-params",
    title: "useSearchParams (code)",
    kind: "content",
    code: `"use client";

import { useSearchParams } from "next/navigation";

export default function SearchParamsDemo() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") ?? "stranger";
  return (
    <div id="wd-search-params-demo">
      <h3>useSearchParams</h3>
      <p>Hello, {name}!</p>
      <p>Query string: {searchParams.toString() || "(empty)"}</p>
      <a href="?name=Alice">Say hi to Alice</a>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/client-apis/SearchParamsDemo.tsx",
  },
  {
    id: "search-params-live",
    title: "useSearchParams: live demo",
    kind: "demo",
    bullets: [
      "Click the link: the greeting changes without a server round trip",
    ],
    embed: "lab3-search-params",
  },
  {
    id: "suspense-intro",
    title: "useSearchParams needs Suspense",
    kind: "content",
    bullets: [
      "**Prerendering**: Next.js builds a page's HTML ahead of time, at `next build`, when there is no visitor and no query string",
      "So a component that calls `useSearchParams` on a prerendered page must sit inside a `<Suspense>` boundary",
      "`Suspense`, from `react`, renders its `fallback` in the prerendered HTML, then swaps in the real component once the browser knows the URL",
      "Without it, `next build` fails with \"Missing Suspense boundary with useSearchParams\"",
    ],
  },
  {
    id: "suspense",
    title: "useSearchParams needs Suspense (code)",
    kind: "content",
    code: `import { Suspense } from "react";
import PathnameDemo from "./PathnameDemo";
import SearchParamsDemo from "./SearchParamsDemo";

export default function ClientApis() {
  return (
    <div id="wd-client-apis">
      <h2>Client-Only APIs</h2>
      <PathnameDemo />
      <Suspense fallback={<p>Loading query string...</p>}>
        <SearchParamsDemo />
      </Suspense>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/client-apis/page.tsx",
  },
  {
    id: "window-api",
    title: "The window object",
    kind: "content",
    bullets: [
      "In the browser, the global `window` object represents the open tab",
      "`window.location` describes the URL: its `protocol` (`http:` or `https:`), `host` (domain plus port), and `port` (empty for the default)",
      "`window.innerWidth` and `innerHeight` give the visible size in pixels",
      "`window` does not exist on the server, where the first HTML is rendered",
    ],
  },
  {
    id: "window-intro",
    title: "Read window in useEffect",
    kind: "content",
    bullets: [
      "**Hydration** is React attaching to the server's HTML in the browser; a **hydration error** is when the two renders differ",
      "`useState` holds a value that re-renders when it changes. `useEffect(fn, [])` runs `fn` once, only in the browser, after the first render",
      "`addEventListener(\"resize\", update)` registers a **listener**, called on every resize. `requestAnimationFrame(update)` calls `update` once before the next repaint",
      "The function returned from the effect is the **cleanup**: it removes the listener when the component goes away",
    ],
  },
  {
    id: "window",
    title: "Read window in useEffect (code)",
    kind: "content",
    code: `"use client";

import { useEffect, useState } from "react";

type WindowInfo = {
  protocol: string;
  host: string;
  port: string;
  width: number;
  height: number;
};

export default function WindowDemo() {
  const [info, setInfo] = useState<WindowInfo | null>(null);
  useEffect(() => {
    const update = () =>
      setInfo({
        protocol: window.location.protocol,
        host: window.location.host,
        port: window.location.port || "(default)",
        width: window.innerWidth,
        height: window.innerHeight,
      });
    const first = requestAnimationFrame(update);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(first);
      window.removeEventListener("resize", update);
    };
  }, []);
  return (
    <div id="wd-window-demo">
      <h3>The window object</h3>
      {info ? (
        <ul>
          <li>Protocol: {info.protocol}</li>
          <li>Host: {info.host}</li>
          <li>Port: {info.port}</li>
          <li>
            Window size: {info.width} x {info.height}
          </li>
        </ul>
      ) : (
        <p>Loading window info...</p>
      )}
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/client-apis/WindowDemo.tsx",
  },
  {
    id: "window-live",
    title: "The window object: live demo",
    kind: "demo",
    bullets: [
      "Resize the browser window and watch the size update",
      "The first render on server and browser shows \"Loading window info...\", so the HTML matches: no hydration error",
    ],
    embed: "lab3-window",
  },
  {
    id: "geolocation-intro",
    title: "navigator.geolocation",
    kind: "content",
    bullets: [
      "`window.navigator` (just `navigator`) describes the browser. `navigator.geolocation` is the **Geolocation API**: the device's latitude and longitude",
      "Location is private, so the browser first shows a **permission prompt**, and the user may refuse",
      "`getCurrentPosition(success, failure, options)` takes two **callbacks** (functions to call later). The error's `code` is `PERMISSION_DENIED` when the user says no",
      "Check the API exists, and call it only from a button click so the prompt never appears unasked",
      "On success, `window.history.replaceState` writes the coordinates into the query string without reloading or adding a Back entry",
    ],
  },
  {
    id: "geolocation",
    title: "navigator.geolocation (code)",
    kind: "content",
    code: `"use client";

import { useState } from "react";

type Coords = { lat: number; lon: number };

export default function GeolocationDemo() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [status, setStatus] = useState("Click the button to share your location.");
  const locate = () => {
    if (!("geolocation" in navigator)) {
      setStatus("Geolocation is not available in this browser.");
      return;
    }
    setStatus("Waiting for permission...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const next = {
          lat: Number(position.coords.latitude.toFixed(4)),
          lon: Number(position.coords.longitude.toFixed(4)),
        };
        setCoords(next);
        setStatus("Location found.");
        window.history.replaceState(null, "", \`?lat=\${next.lat}&lon=\${next.lon}\`);
      },
      (error) => {
        setCoords(null);
        setStatus(
          error.code === error.PERMISSION_DENIED
            ? "Permission denied. That's fine; the demo still works without it."
            : \`Could not get your location: \${error.message}\`,
        );
      },
      { timeout: 10000 },
    );
  };
  return (
    <div id="wd-geolocation-demo">
      <h3>navigator.geolocation</h3>
      <button type="button" onClick={locate}>
        Find my location
      </button>
      <p>{status}</p>
      {coords && (
        <p>
          Latitude: {coords.lat}, Longitude: {coords.lon}
        </p>
      )}
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/client-apis/GeolocationDemo.tsx",
  },
  {
    id: "geolocation-live",
    title: "navigator.geolocation: live demo",
    kind: "demo",
    bullets: [
      "Nothing is asked until you click. Block location in the site settings and try again: the message explains what happened",
      "Coordinates are rounded to four decimals (about 10 meters)",
    ],
    embed: "lab3-geolocation",
  },
  {
    id: "map-intro",
    title: "An OpenStreetMap iframe",
    kind: "content",
    bullets: [
      "An `<iframe>` (inline frame) embeds another web page inside yours",
      "OpenStreetMap is a free, community-made world map; its embed page needs no account or key",
      "It takes a **bounding box** (`bbox`: west, south, east and north edges in degrees) and a `marker`",
      "`lat` and `lon` come from the query string, where the geolocation demo put them, with Northeastern's Boston campus as the default",
    ],
  },
  {
    id: "map",
    title: "An OpenStreetMap iframe (code)",
    kind: "content",
    code: `"use client";

import { useSearchParams } from "next/navigation";

const DEFAULT_LAT = 42.3398;
const DEFAULT_LON = -71.0892;

export default function MapEmbed() {
  const searchParams = useSearchParams();
  const lat = Number(searchParams.get("lat") ?? DEFAULT_LAT);
  const lon = Number(searchParams.get("lon") ?? DEFAULT_LON);
  const valid = Number.isFinite(lat) && Number.isFinite(lon);
  const center = valid ? { lat, lon } : { lat: DEFAULT_LAT, lon: DEFAULT_LON };
  const d = 0.01;
  const bbox = [center.lon - d, center.lat - d, center.lon + d, center.lat + d].join(",");
  const src = \`https://www.openstreetmap.org/export/embed.html?bbox=\${bbox}&layer=mapnik&marker=\${center.lat},\${center.lon}\`;
  return (
    <div id="wd-map-embed">
      <h3>OpenStreetMap iframe</h3>
      <p>
        Showing {center.lat}, {center.lon}
        {searchParams.has("lat") ? "" : " (default location)"}
      </p>
      <iframe title="Map" src={src} width="100%" height="300" style={{ border: 0 }} />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/client-apis/MapEmbed.tsx",
  },
  {
    id: "map-live",
    title: "OpenStreetMap iframe: live demo",
    kind: "demo",
    bullets: [
      "Click **Find my location** on the previous demo and allow access: the map recenters, because both read the URL",
      "On the page, wrap `MapEmbed` in its own `Suspense`, like `SearchParamsDemo`",
    ],
    embed: "lab3-map",
  },
  {
    id: "client-ip-intro",
    title: "The client's public IP address",
    kind: "content",
    bullets: [
      "An **IP address** identifies a machine on the internet. Your **public IP** is the one other servers see, usually your router's",
      "The browser has no API for it, so the component asks a free, keyless **endpoint** (a URL that returns data): `https://api.ipify.org?format=json`",
      "`fetch` returns a **promise**, a value that arrives later. Each `.then` runs when the previous step finishes",
      "`.catch` runs if anything fails, such as no network or an ad blocker, so the page shows a message instead of breaking",
    ],
  },
  {
    id: "client-ip",
    title: "The client's public IP address (code)",
    kind: "content",
    code: `"use client";

import { useEffect, useState } from "react";

export default function ClientIpDemo() {
  const [ip, setIp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((response) => {
        if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
        return response.json();
      })
      .then((data: { ip: string }) => setIp(data.ip))
      .catch((err: Error) => setError(err.message));
  }, []);
  return (
    <div id="wd-client-ip-demo">
      <h3>Public IP address</h3>
      {error ? (
        <p>Could not look up your IP: {error}</p>
      ) : (
        <p>Your public IP: {ip ?? "Looking up..."}</p>
      )}
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/client-apis/ClientIpDemo.tsx",
  },
  {
    id: "client-ip-live",
    title: "Public IP address: live demo",
    kind: "demo",
    bullets: [
      "Every server you contact already sees this address, including your own Next.js server",
      "Asking a third party from the browser shares the visitor's IP with it, so reading it on the server is often better",
    ],
    embed: "lab3-client-ip",
  },
  {
    id: "server-apis",
    title: "More server-only APIs",
    kind: "content",
    bullets: [
      "A **server-only API** exists only in Node.js, so only a Server Component can call it",
      "Seven small Server Components, one concept each, in `app/labs/lab3/server-apis`, on their own page `/labs/lab3/server-apis`",
      "These demos run on the server, so each one shows the live `/labs/lab3/server-apis` page in a frame",
    ],
  },
  {
    id: "client-time-intro",
    title: "Server time vs client time",
    kind: "content",
    bullets: [
      "The server and the browser each have their own clock and time zone",
      "The Server Component formats the server's time in UTC (Coordinated Universal Time, the zone-free reference clock)",
      "It renders a small Client Component, `ClientTime`, that reads the browser's clock in `useEffect`, and with `setInterval` again every second (1000 milliseconds)",
      "So the server's HTML and the browser's first render match",
    ],
  },
  {
    id: "client-time",
    title: "ClientTime (code)",
    kind: "content",
    code: `"use client";

import { useEffect, useState } from "react";

export default function ClientTime() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString());
    const first = setTimeout(tick, 0);
    const timer = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, []);
  return <p>Browser time: {time ?? "(waiting for the browser...)"}</p>;
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/server-apis/ClientTime.tsx",
  },
  {
    id: "server-time",
    title: "ServerTimeDemo (code)",
    kind: "content",
    code: `import ClientTime from "./ClientTime";

export default function ServerTimeDemo() {
  const serverTime = new Date().toLocaleTimeString("en-US", { timeZone: "UTC" });
  return (
    <div id="wd-server-time-demo">
      <h3>Server time vs client time</h3>
      <p>Server time (UTC): {serverTime}</p>
      <ClientTime />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/server-apis/ServerTimeDemo.tsx",
  },
  {
    id: "server-time-live",
    title: "Server vs client time: live demo",
    kind: "demo",
    bullets: [
      "The server time is when the page rendered; the browser time ticks every second",
      "On a page that renders on every request they are milliseconds apart, but may show different hours if the zones differ",
    ],
    embed: "lab3-server-time",
  },
  {
    id: "server-page",
    title: "The server-apis page",
    kind: "content",
    bullets: [
      "Render each demo from a new page, `app/labs/lab3/server-apis/page.tsx`, and open `/labs/lab3/server-apis`. Add the next demos to it the same way",
    ],
    code: `import ServerTimeDemo from "./ServerTimeDemo";

export default function ServerApis() {
  return (
    <div id="wd-server-apis">
      <h2>Server-Only APIs</h2>
      <ServerTimeDemo />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/server-apis/page.tsx",
  },
  {
    id: "os",
    title: "The os module",
    kind: "content",
    bullets: [
      "`node:os` is the Node.js **module** (a file of code you can import) that describes the server's operating system",
      "`hostname` (the machine's name), `platform`, `uptime()` in seconds, `cpus()` (one per core), `freemem()` in bytes",
    ],
    code: `import os from "node:os";

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
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/server-apis/OsDemo.tsx",
  },
  {
    id: "os-live",
    title: "The os module: live demo",
    kind: "demo",
    bullets: [
      "The browser can't see any of this",
      "On Vercel the hostname belongs to a short-lived cloud machine, not to your laptop",
    ],
    embed: "lab3-os",
  },
  {
    id: "env-client-check-intro",
    title: "process.env",
    kind: "content",
    bullets: [
      "An **environment variable** is a named setting given to a program from outside its code; in Node.js they are properties of `process.env`",
      "They hold **secrets** such as passwords and keys: Next.js only copies variables named `NEXT_PUBLIC_...` into browser code",
      "This demo uses a harmless `LAB3_SERVER_MESSAGE`, with a fallback. Never print a real secret like this",
      "The Server Component prints it, then renders a Client Component that tries to read the same variable",
    ],
  },
  {
    id: "env-client-check",
    title: "EnvClientCheck (code)",
    kind: "content",
    code: `"use client";

export default function EnvClientCheck() {
  const value = process.env.LAB3_SERVER_MESSAGE;
  return <p>In the browser: {value ?? "undefined"}</p>;
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/server-apis/EnvClientCheck.tsx",
  },
  {
    id: "env",
    title: "EnvDemo (code)",
    kind: "content",
    code: `import EnvClientCheck from "./EnvClientCheck";

export default function EnvDemo() {
  const message = process.env.LAB3_SERVER_MESSAGE ?? "hello from the server (fallback)";
  return (
    <div id="wd-env-demo">
      <h3>process.env</h3>
      <p>On the server: {message}</p>
      <EnvClientCheck />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/server-apis/EnvDemo.tsx",
  },
  {
    id: "env-live",
    title: "process.env: live demo",
    kind: "demo",
    bullets: [
      "The server line shows the message; the browser line shows `undefined`",
      "To set your own value, add `LAB3_SERVER_MESSAGE=hi` to `.env.local` in the project root and restart `npm run dev`",
    ],
    embed: "lab3-env",
  },
  {
    id: "request-headers-intro",
    title: "headers()",
    kind: "content",
    bullets: [
      "Every request carries **headers**, name-value lines describing it. `user-agent` names the browser and operating system",
      "`x-forwarded-for` is added by **proxies** (servers that pass requests along, like Vercel's edge network) and lists the client's IP first",
      "`headers()` from `next/headers` reads them. It returns a promise, so the component is `async` and uses `await`, which pauses until the value is ready",
      "Server Components may be `async`; Client Components may not",
    ],
  },
  {
    id: "request-headers",
    title: "headers() (code)",
    kind: "content",
    code: `import { headers } from "next/headers";

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
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/server-apis/RequestHeadersDemo.tsx",
  },
  {
    id: "request-headers-live",
    title: "headers(): live demo",
    kind: "demo",
    bullets: [
      "The server sees the same IP as the client IP demo, without asking anyone else. On `npm run dev` there is no proxy, so it is unknown",
      "`headers()` depends on the request, so Next.js renders the page **dynamically**, on every request, instead of prerendering it",
    ],
    embed: "lab3-request-headers",
  },
  {
    id: "weather-intro",
    title: "Fetching data on the server",
    kind: "content",
    bullets: [
      "A Server Component can call other servers with `fetch` before any HTML is sent",
      "Open-Meteo is a free weather service with no key; this asks for Boston's current temperature and wind",
      "`try` / `catch` turns a network failure into a message",
      "`next: { revalidate: 1800 }` lets Next.js **cache** (keep and reuse) the answer for 1800 seconds, 30 minutes",
    ],
  },
  {
    id: "weather",
    title: "Fetching data on the server (code)",
    kind: "content",
    code: `const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=42.34&longitude=-71.09" +
  "&current=temperature_2m,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph";

type Weather = { current: { time: string; temperature_2m: number; wind_speed_10m: number } };

export default async function WeatherDemo() {
  let weather: Weather | null = null;
  let error: string | null = null;
  try {
    const response = await fetch(WEATHER_URL, { next: { revalidate: 1800 } });
    if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
    weather = await response.json();
  } catch (err) {
    error = err instanceof Error ? err.message : "unknown error";
  }
  return (
    <div id="wd-weather-demo">
      <h3>Weather in Boston (Open-Meteo)</h3>
      {weather ? (
        <ul>
          <li>Temperature: {weather.current.temperature_2m} °F</li>
          <li>Wind: {weather.current.wind_speed_10m} mph</li>
          <li>Measured at (UTC): {weather.current.time}</li>
        </ul>
      ) : (
        <p>Weather is unavailable right now: {error}</p>
      )}
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/server-apis/WeatherDemo.tsx",
  },
  {
    id: "weather-live",
    title: "Weather in Boston: live demo",
    kind: "demo",
    bullets: [
      "The browser never contacts Open-Meteo; it only receives the finished HTML",
    ],
    embed: "lab3-weather",
  },
  {
    id: "visit-counter-intro",
    title: "Reading and writing a file",
    kind: "content",
    bullets: [
      "`node:fs/promises` is the promise version of `fs`: `readFile` and `writeFile` return promises you `await`",
      "The counter lives in a text file under `os.tmpdir()`, the system's folder for temporary files; `path.join` builds the file name",
      "A missing file throws, so `catch` starts the count at 0",
      "`await connection()` from `next/server` makes the component run on every request, so the page is never prerendered",
    ],
  },
  {
    id: "visit-counter",
    title: "Reading and writing a file (code)",
    kind: "content",
    code: `import fs from "node:fs/promises";
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
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/server-apis/VisitCounterDemo.tsx",
  },
  {
    id: "visit-counter-live",
    title: "Visit counter: live demo",
    kind: "demo",
    bullets: [
      "With `npm run dev`, refresh: the count keeps rising, even across restarts, because the file stays on your disk",
      "On serverless hosting such as Vercel only `/tmp` is writable, and it is temporary and not shared, so the count resets and jumps. Fine for a demo, not for data you keep",
    ],
    embed: "lab3-visit-counter",
  },
  {
    id: "child-process-intro",
    title: "child_process",
    kind: "content",
    bullets: [
      "`node:child_process` starts another program on the server, a **child process**",
      "`execFile(program, args)` runs one program with a fixed list of arguments and collects what it prints; `promisify` from `node:util` makes it return a promise",
      "This demo only ever runs `node --version`",
      "Never build the program or its arguments from user input such as a query string: anyone could run commands on your server",
    ],
  },
  {
    id: "child-process",
    title: "child_process (code)",
    kind: "content",
    code: `import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export default async function ChildProcessDemo() {
  let output: string;
  try {
    const { stdout } = await execFileAsync("node", ["--version"]);
    output = stdout.trim();
  } catch (error) {
    output = \`Could not run node: \${error instanceof Error ? error.message : "unknown error"}\`;
  }
  return (
    <div id="wd-child-process-demo">
      <h3>child_process</h3>
      <p>Output of node --version: {output}</p>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/server-apis/ChildProcessDemo.tsx",
  },
  {
    id: "child-process-live",
    title: "child_process: live demo",
    kind: "demo",
    bullets: [
      "If the host has no `node` program on its path, the `catch` shows the error instead of crashing the page",
    ],
    embed: "lab3-child-process",
  },
  {
    id: "split",
    title: "Client vs Server Summary",
    kind: "content",
    bullets: [
      "Server components **fetch and format** data",
      "Client components handle **hooks, clicks, and the address bar**",
      "Import both demos into Lab 3 and compare what each can print",
    ],
  },
  {
    id: "recap",
    title: "Client and server recap",
    kind: "content",
    bullets: [
      "Default = server. `\"use client\"` = Client Component, first line of the file",
      "`usePathname` / `useParams` / `onClick` need a client component",
      "`fs`, `process`, and secrets stay on the server",
    ],
  },
  {
    id: "next-up",
    title: "Next: pass data into a component",
    kind: "title",
    bullets: [
      "Attributes become a props object. Children are the body",
      "§3.8: `<Add a={3} b={4} />`, then `Square` and `Highlight`",
    ],
  },
];

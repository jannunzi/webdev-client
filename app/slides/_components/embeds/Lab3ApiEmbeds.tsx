import { Suspense, type ReactNode } from "react";
import PathnameDemo from "@/app/labs/lab3/client-apis/PathnameDemo";
import SearchParamsDemo from "@/app/labs/lab3/client-apis/SearchParamsDemo";
import WindowDemo from "@/app/labs/lab3/client-apis/WindowDemo";
import GeolocationDemo from "@/app/labs/lab3/client-apis/GeolocationDemo";
import MapEmbed from "@/app/labs/lab3/client-apis/MapEmbed";
import ClientIpDemo from "@/app/labs/lab3/client-apis/ClientIpDemo";
import LectureDemoFrame from "./LectureDemoFrame";

/** §3.6.3 client-only demos: the book's Lab 3 components, rendered directly. */
function ClientApiDemo({ label, children }: { label: string; children: ReactNode }) {
  return (
    <LectureDemoFrame label={label} url="/labs/lab3/client-apis">
      <div className="font-sans text-base [&_h3]:mt-0">{children}</div>
    </LectureDemoFrame>
  );
}

export function Lab3PathnameEmbed() {
  return (
    <ClientApiDemo label="client-apis/PathnameDemo.tsx">
      <PathnameDemo />
    </ClientApiDemo>
  );
}

export function Lab3SearchParamsEmbed() {
  return (
    <ClientApiDemo label="client-apis/SearchParamsDemo.tsx">
      <Suspense fallback={<p>Loading query string...</p>}>
        <SearchParamsDemo />
      </Suspense>
    </ClientApiDemo>
  );
}

export function Lab3WindowEmbed() {
  return (
    <ClientApiDemo label="client-apis/WindowDemo.tsx">
      <WindowDemo />
    </ClientApiDemo>
  );
}

/** Asks for location only on click; denied or offline shows the status text. */
export function Lab3GeolocationEmbed() {
  return (
    <ClientApiDemo label="client-apis/GeolocationDemo.tsx">
      <GeolocationDemo />
    </ClientApiDemo>
  );
}

/** Falls back to the default campus location without lat/lon; offline the frame is blank but the text still renders. */
export function Lab3MapEmbed() {
  return (
    <ClientApiDemo label="client-apis/MapEmbed.tsx">
      <Suspense fallback={<p>Loading map...</p>}>
        <MapEmbed />
      </Suspense>
    </ClientApiDemo>
  );
}

export function Lab3ClientIpEmbed() {
  return (
    <ClientApiDemo label="client-apis/ClientIpDemo.tsx">
      <ClientIpDemo />
    </ClientApiDemo>
  );
}

/**
 * §3.6.4 server-only demos. The deck is a Client Component and cannot import
 * node:os / fs / child_process, so, like the book's request-dependent demos,
 * each shows the live /labs/lab3/server-apis page in a frame at its anchor.
 */
function ServerApiFrame({ file, anchor, height }: { file: string; anchor: string; height: number }) {
  return (
    <LectureDemoFrame label={`server-apis/${file}`} url="/labs/lab3/server-apis">
      <iframe
        title={anchor}
        src={`/labs/lab3/server-apis#${anchor}`}
        className="w-full"
        style={{ height, border: 0 }}
      />
    </LectureDemoFrame>
  );
}

export const Lab3ServerTimeEmbed = () => <ServerApiFrame file="ServerTimeDemo.tsx" anchor="wd-server-time-demo" height={220} />;
export const Lab3OsEmbed = () => <ServerApiFrame file="OsDemo.tsx" anchor="wd-os-demo" height={300} />;
export const Lab3EnvEmbed = () => <ServerApiFrame file="EnvDemo.tsx" anchor="wd-env-demo" height={220} />;
export const Lab3RequestHeadersEmbed = () => <ServerApiFrame file="RequestHeadersDemo.tsx" anchor="wd-request-headers-demo" height={260} />;
export const Lab3WeatherEmbed = () => <ServerApiFrame file="WeatherDemo.tsx" anchor="wd-weather-demo" height={240} />;
export const Lab3VisitCounterEmbed = () => <ServerApiFrame file="VisitCounterDemo.tsx" anchor="wd-visit-counter-demo" height={220} />;
export const Lab3ChildProcessEmbed = () => <ServerApiFrame file="ChildProcessDemo.tsx" anchor="wd-child-process-demo" height={200} />;

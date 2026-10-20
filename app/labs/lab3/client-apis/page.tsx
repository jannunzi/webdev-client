import { Suspense } from "react";
import PathnameDemo from "./PathnameDemo";
import SearchParamsDemo from "./SearchParamsDemo";
import WindowDemo from "./WindowDemo";
import GeolocationDemo from "./GeolocationDemo";
import MapEmbed from "./MapEmbed";
import ClientIpDemo from "./ClientIpDemo";

export default function ClientApis() {
  return (
    <div id="wd-client-apis">
      <h2>Client-Only APIs</h2>
      <PathnameDemo />
      <Suspense fallback={<p>Loading query string...</p>}>
        <SearchParamsDemo />
      </Suspense>
      <WindowDemo />
      <GeolocationDemo />
      <Suspense fallback={<p>Loading map...</p>}>
        <MapEmbed />
      </Suspense>
      <ClientIpDemo />
    </div>
  );
}

"use client";

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
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${center.lat},${center.lon}`;
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
}

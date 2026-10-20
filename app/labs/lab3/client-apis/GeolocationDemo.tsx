"use client";

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
        window.history.replaceState(null, "", `?lat=${next.lat}&lon=${next.lon}`);
      },
      (error) => {
        setCoords(null);
        setStatus(
          error.code === error.PERMISSION_DENIED
            ? "Permission denied. That's fine; the demo still works without it."
            : `Could not get your location: ${error.message}`,
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
}

"use client";

export default function EnvClientCheck() {
  const value = process.env.LAB3_SERVER_MESSAGE;
  return <p>In the browser: {value ?? "undefined"}</p>;
}

"use client";

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
}

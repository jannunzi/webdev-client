"use client";

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
}

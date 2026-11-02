"use client";

import { useState, type ComponentType, type ReactNode } from "react";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { PathnameContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { AccountProvider } from "@/app/book/ch4/embeds/_styled/account/AccountContext";

/**
 * Demo-only. The Chapter 4 Sign up and Profile listings call
 * `useRouter().push` and must stay identical to the book, so this wrapper
 * keeps navigation inside the demo: `push` swaps the rendered screen instead
 * of leaving the page. It also supplies the real Chapter 4 AccountProvider.
 */
export default function AsAccountRouter({
  start,
  screens,
  Provider = AccountProvider,
}: {
  start: string;
  screens: (path: string, go: (path: string) => void) => ReactNode;
  /** Defaults to the book's Chapter 4 AccountProvider. */
  Provider?: ComponentType<{ children: ReactNode }>;
}) {
  const [path, setPath] = useState(start);
  const router = {
    push: (href: string) => setPath(href),
    replace: (href: string) => setPath(href),
    back: () => setPath(start),
    forward: () => {},
    refresh: () => {},
    prefetch: () => {},
  };
  return (
    <AppRouterContext.Provider value={router}>
      <PathnameContext.Provider value={path}>
        <Provider>
          <div className="w-full font-sans text-lg [&_a]:text-blue-600 [&_a]:underline [&_button]:mb-2 [&_button]:w-full [&_button]:rounded [&_button]:bg-blue-600 [&_button]:px-4 [&_button]:py-2 [&_button]:text-white [&_h3]:mb-3 [&_h3]:text-2xl [&_h3]:font-semibold [&_input]:mb-2 [&_input]:block [&_input]:w-full [&_input]:rounded [&_input]:border [&_input]:border-neutral-300 [&_input]:px-3 [&_input]:py-2 [&_select]:mb-2 [&_select]:block [&_select]:w-full [&_select]:rounded [&_select]:border [&_select]:border-neutral-300 [&_select]:px-3 [&_select]:py-2">
            <p className="mb-2 font-mono text-xs text-neutral-500">{path}</p>
            {screens(path, setPath)}
          </div>
        </Provider>
      </PathnameContext.Provider>
    </AppRouterContext.Provider>
  );
}

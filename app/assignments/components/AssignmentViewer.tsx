"use client";

import { useAuth } from "@clerk/nextjs";
import type { ReactNode } from "react";

/**
 * Live Clerk user id. Until Clerk finishes loading, the server id is used so
 * the first paint matches the signed-in snapshot. After that, a sign-out or
 * a different sign-in changes the id and callers drop in-memory checkmarks.
 */
export function AssignmentViewer({
  serverUserId,
  authEnabled,
  children,
}: {
  serverUserId: string | null;
  authEnabled: boolean;
  children: (viewerUserId: string | null) => ReactNode;
}) {
  if (!authEnabled) return children(serverUserId);
  return (
    <ClerkAssignmentViewer serverUserId={serverUserId}>
      {children}
    </ClerkAssignmentViewer>
  );
}

function ClerkAssignmentViewer({
  serverUserId,
  children,
}: {
  serverUserId: string | null;
  children: (viewerUserId: string | null) => ReactNode;
}) {
  const { userId, isLoaded } = useAuth();
  const viewerUserId = isLoaded ? (userId ?? null) : serverUserId;
  return children(viewerUserId);
}

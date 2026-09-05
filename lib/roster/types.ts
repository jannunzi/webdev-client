export type CanvasRosterEntry = {
  email: string;
  canvasUserId?: string;
  sisUserId?: string;
  name?: string;
  section?: string;
  source?: "mongo" | "env" | "csv" | "json" | "impersonation";
  importedAt?: Date;
};

export type ClerkEmailLike = {
  id?: string;
  emailAddress: string;
  verification?: { status?: string | null } | null;
};

export type ClerkUserLike = {
  id: string;
  primaryEmailAddressId?: string | null;
  primaryEmailAddress?: ClerkEmailLike | null;
  emailAddresses: ClerkEmailLike[];
  publicMetadata?: Record<string, unknown> | null;
};

export type RosterLookupStatus =
  | "not_configured"
  | "empty"
  | "matched"
  | "not_on_roster";

export type RosterLookupResult =
  | { status: "not_configured" }
  | { status: "empty" }
  | { status: "matched"; entry: CanvasRosterEntry }
  | { status: "not_on_roster" };

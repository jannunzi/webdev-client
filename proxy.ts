import { clerkMiddleware, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  isPasswordChangeExemptPath,
  metadataRequiresPasswordChange,
  passwordChangeRedirect,
  resolveMustChangePassword,
} from "@/lib/auth/must-change-password";

/**
 * Next.js 16 proxy (formerly middleware). Clerk uses this to attach session
 * state. Route protection for graded quizzes lives in the take page and
 * submit Server Action — the rest of the site stays public.
 *
 * Pre-provisioned students with publicMetadata.mustChangePassword === true
 * are sent to /account/set-password. Logged-out requests are unchanged, so
 * the book, slides, videos, and the logged-out A1 Run check stay public.
 * The flag is confirmed with users.getUser (the same read as currentUser())
 * unless the session token already says the flag is false. A stale `true`
 * claim cannot keep redirecting after the password change.
 */
function clerkKeysPresent(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim() &&
      process.env.CLERK_SECRET_KEY?.trim(),
  );
}

async function redirectIfPasswordChangeRequired(
  userId: string,
  sessionClaims: unknown,
  request: NextRequest,
) {
  const mustChangePassword = await resolveMustChangePassword({
    sessionClaims,
    readUserFlag: async () => {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      return metadataRequiresPasswordChange(user.publicMetadata);
    },
  });
  const target = passwordChangeRedirect({
    pathname: request.nextUrl.pathname,
    search: request.nextUrl.search,
    signedIn: true,
    mustChangePassword,
  });
  if (!target) return;
  const url = new URL(target, request.url);
  const status = request.method === "GET" || request.method === "HEAD" ? 307 : 303;
  return NextResponse.redirect(url, status);
}

export default clerkKeysPresent()
  ? clerkMiddleware(async (auth, request) => {
      const { userId, sessionClaims } = await auth();
      if (!userId) return;
      if (isPasswordChangeExemptPath(request.nextUrl.pathname)) return;
      return redirectIfPasswordChangeRequired(userId, sessionClaims, request);
    })
  : function proxy() {
      return NextResponse.next();
    };

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};

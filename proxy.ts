import { clerkMiddleware, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  isPasswordChangeExemptPath,
  metadataRequiresPasswordChange,
  passwordChangeRedirect,
  resolveMustChangePassword,
} from "@/lib/auth/must-change-password";
import { legacyCourseRedirect } from "@/lib/courses/routes";

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

const COURSE_PATH_HEADER = "x-course-path";

/** 307 old course URLs, and remember the public path for the header. */
function withCourseRouting(request: NextRequest): NextResponse {
  const redirectTo = legacyCourseRedirect(
    request.nextUrl.pathname,
    request.nextUrl.searchParams,
  );
  if (redirectTo) {
    const destination = request.nextUrl.clone();
    destination.pathname = redirectTo.pathname;
    destination.search = redirectTo.search;
    return NextResponse.redirect(destination, 307);
  }
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(COURSE_PATH_HEADER, request.nextUrl.pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export default clerkKeysPresent()
  ? clerkMiddleware(async (auth, request) => {
      const { userId, sessionClaims } = await auth();
      if (userId && !isPasswordChangeExemptPath(request.nextUrl.pathname)) {
        const passwordRedirect = await redirectIfPasswordChangeRequired(
          userId,
          sessionClaims,
          request,
        );
        if (passwordRedirect) return passwordRedirect;
      }
      return withCourseRouting(request);
    })
  : function proxy(request: NextRequest) {
      return withCourseRouting(request);
    };

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};

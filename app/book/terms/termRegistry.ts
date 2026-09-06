import {
  defaultSearchQuery,
  safeHttpUrl,
  termSlug,
  titleFromSlug,
} from "./termSlug";

export type TermEntry = {
  /** Display name shown on the term page and used as the default slug source. */
  term: string;
  /** Official docs / site URL (the OfficialLink `href`). */
  officialUrl: string;
  /** Optional YouTube search override when the label is an ambiguous acronym. */
  searchQuery?: string;
  /** Book chapters that introduce or substantively teach this term. */
  chapters?: number[];
};

export type ResolvedTerm = {
  slug: string;
  term: string;
  officialUrl: string | null;
  searchQuery: string;
  known: boolean;
};

/**
 * First-use terms from `<OfficialLink>` in the book, keyed by slug of the
 * display label. First occurrence wins when the same label appears twice.
 * OfficialLink still works if a future chapter adds a term that is not listed
 * here: it passes `href` (and optional `term` / `q`) as query params.
 */
const TERM_LIST: TermEntry[] = [
  { term: "Internet", officialUrl: "https://en.wikipedia.org/wiki/Internet", chapters: [1] },
  { term: "ARPA", officialUrl: "https://www.darpa.mil/", searchQuery: "DARPA ARPA explained", chapters: [1] },
  { term: "DoD", officialUrl: "https://www.defense.gov/", searchQuery: "US Department of Defense explained", chapters: [1] },
  { term: "ARPANET", officialUrl: "https://en.wikipedia.org/wiki/ARPANET", chapters: [1] },
  { term: "TCP/IP", officialUrl: "https://www.ietf.org/", searchQuery: "TCP/IP protocol explained", chapters: [1] },
  { term: "World Wide Web", officialUrl: "https://www.w3.org/", chapters: [1] },
  { term: "Sir Tim Berners-Lee", officialUrl: "https://www.w3.org/People/Berners-Lee/", chapters: [1] },
  { term: "CERN", officialUrl: "https://home.cern/", chapters: [1] },
  { term: "URL", officialUrl: "https://url.spec.whatwg.org/", searchQuery: "URL web address explained", chapters: [1] },
  { term: "HTTP", officialUrl: "https://httpwg.org/specs/rfc9110.html", searchQuery: "HTTP protocol explained", chapters: [1, 5] },
  { term: "WorldWideWeb", officialUrl: "https://en.wikipedia.org/wiki/WorldWideWeb", chapters: [1] },
  { term: "HTML", officialUrl: "https://html.spec.whatwg.org/", searchQuery: "HTML explained tutorial", chapters: [1, 2, 3] },
  { term: "XML", officialUrl: "https://www.w3.org/XML/", searchQuery: "XML markup language explained", chapters: [1] },
  { term: "DOM", officialUrl: "https://dom.spec.whatwg.org/", searchQuery: "DOM document object model explained", chapters: [1, 3] },
  { term: "CGI", officialUrl: "https://datatracker.ietf.org/doc/html/rfc3875", searchQuery: "CGI common gateway interface explained", chapters: [1] },
  { term: "PHP", officialUrl: "https://www.php.net/", chapters: [1] },
  { term: "JavaScript", officialUrl: "https://tc39.es/ecma262/", chapters: [1, 3, 4] },
  { term: "Netscape", officialUrl: "https://en.wikipedia.org/wiki/Netscape", chapters: [1] },
  { term: "TypeScript", officialUrl: "https://www.typescriptlang.org/", chapters: [1, 3] },
  { term: "API", officialUrl: "https://en.wikipedia.org/wiki/API", searchQuery: "API application programming interface explained", chapters: [1, 5] },
  { term: "MongoDB", officialUrl: "https://www.mongodb.com/", chapters: [1, 6] },
  { term: "React", officialUrl: "https://react.dev/", chapters: [1, 2, 3, 4] },
  { term: "SPA", officialUrl: "https://en.wikipedia.org/wiki/Single-page_application", searchQuery: "single page application SPA explained", chapters: [1, 3] },
  { term: "Next.js", officialUrl: "https://nextjs.org/", chapters: [1, 2, 3, 4, 5] },
  { term: "SSR", officialUrl: "https://en.wikipedia.org/wiki/Server-side_rendering", searchQuery: "server side rendering SSR explained", chapters: [1] },
  { term: "SSG", officialUrl: "https://en.wikipedia.org/wiki/Static_site_generator", searchQuery: "static site generation SSG explained", chapters: [1] },
  { term: "GitHub", officialUrl: "https://github.com/", chapters: [1, 2, 5] },
  { term: "Vercel", officialUrl: "https://vercel.com/", chapters: [1, 2, 5] },
  { term: "LMS", officialUrl: "https://en.wikipedia.org/wiki/Learning_management_system", searchQuery: "learning management system LMS explained", chapters: [1] },
  { term: "CSS", officialUrl: "https://www.w3.org/Style/CSS/", searchQuery: "CSS cascading style sheets explained", chapters: [1, 2] },
  { term: "Chrome DevTools", officialUrl: "https://developer.chrome.com/docs/devtools", chapters: [1, 2, 5] },
  { term: "Node.js", officialUrl: "https://nodejs.org/", chapters: [1, 5, 6] },
  { term: "npm", officialUrl: "https://www.npmjs.com/", searchQuery: "npm node package manager explained", chapters: [1] },
  { term: "npx", officialUrl: "https://docs.npmjs.com/cli/v11/commands/npx", searchQuery: "npx explained tutorial", chapters: [1] },
  { term: "mvn", officialUrl: "https://maven.apache.org/", searchQuery: "Maven mvn Java explained", chapters: [1] },
  { term: "Maven", officialUrl: "https://maven.apache.org/", chapters: [1] },
  { term: "pip", officialUrl: "https://pip.pypa.io/", searchQuery: "pip Python package manager explained", chapters: [1] },
  { term: "REST", officialUrl: "https://en.wikipedia.org/wiki/REST", searchQuery: "REST API explained", chapters: [1, 5] },
  { term: "LTS", officialUrl: "https://nodejs.org/en/about/previous-releases", searchQuery: "Node.js LTS long term support explained", chapters: [1] },
  {
    term: "Integrated Development Environment (IDE)",
    officialUrl: "https://en.wikipedia.org/wiki/Integrated_development_environment",
    searchQuery: "IDE integrated development environment explained",
    chapters: [1],
  },
  { term: "Visual Studio Code", officialUrl: "https://code.visualstudio.com", chapters: [1] },
  { term: "Cursor", officialUrl: "https://cursor.com", searchQuery: "Cursor AI code editor explained", chapters: [1] },
  { term: "ESLint", officialUrl: "https://eslint.org/", chapters: [1] },
  { term: "Prettier", officialUrl: "https://prettier.io/", chapters: [1] },
  { term: "React Developer Tools", officialUrl: "https://react.dev/learn/react-developer-tools", chapters: [1, 4] },
  { term: "git", officialUrl: "https://git-scm.com/", searchQuery: "git version control explained", chapters: [1] },
  { term: "Claude", officialUrl: "https://claude.ai", searchQuery: "Claude AI Anthropic explained", chapters: [1] },
  { term: "Anthropic", officialUrl: "https://www.anthropic.com/", chapters: [1] },
  { term: "claude.ai", officialUrl: "https://claude.ai", searchQuery: "Claude AI Anthropic explained", chapters: [1] },
  { term: "Claude Code", officialUrl: "https://code.claude.com/docs/en/vs-code", chapters: [1] },
  { term: "Claude Code for VS Code", officialUrl: "https://code.claude.com/docs/en/vs-code", chapters: [1] },
  { term: "Tailwind CSS", officialUrl: "https://tailwindcss.com/", chapters: [1, 2] },
  { term: "Turbopack", officialUrl: "https://nextjs.org/docs/app/api-reference/turbopack", chapters: [1] },
  { term: "Google Chrome", officialUrl: "https://www.google.com/chrome/", chapters: [1] },
  { term: "JSX", officialUrl: "https://react.dev/learn/writing-markup-with-jsx", searchQuery: "JSX React explained", chapters: [1, 2, 3] },
  { term: "App Router", officialUrl: "https://nextjs.org/docs/app", searchQuery: "Next.js App Router explained", chapters: [1] },
  { term: "useState", officialUrl: "https://react.dev/reference/react/useState", searchQuery: "React useState explained", chapters: [4] },
  { term: "useEffect", officialUrl: "https://react.dev/reference/react/useEffect", searchQuery: "React useEffect explained", chapters: [4] },
  { term: "React Context", officialUrl: "https://react.dev/learn/passing-data-deeply-with-context", chapters: [4] },
  { term: "Redux Toolkit", officialUrl: "https://redux-toolkit.js.org/", chapters: [4] },
  { term: "Zustand", officialUrl: "https://zustand.docs.pmnd.rs/", chapters: [4] },
  { term: "Context", officialUrl: "https://react.dev/learn/passing-data-deeply-with-context", searchQuery: "React Context explained", chapters: [4] },
  { term: "Zustand documentation", officialUrl: "https://zustand.docs.pmnd.rs/", searchQuery: "Zustand React explained", chapters: [4] },
  { term: "React Icons", officialUrl: "https://react-icons.github.io/react-icons/", chapters: [2] },
  { term: "Route Handlers", officialUrl: "https://nextjs.org/docs/app/building-your-application/routing/route-handlers", searchQuery: "Next.js Route Handlers explained", chapters: [5] },
  { term: "NEXT_PUBLIC_", officialUrl: "https://nextjs.org/docs/app/building-your-application/configuring/environment-variables", searchQuery: "Next.js NEXT_PUBLIC environment variables explained", chapters: [5] },
  { term: "AJAX", officialUrl: "https://en.wikipedia.org/wiki/Ajax_(programming)", searchQuery: "AJAX JavaScript explained", chapters: [5] },
  { term: "axios", officialUrl: "https://axios-http.com/", searchQuery: "axios JavaScript HTTP explained", chapters: [5, 6] },
  { term: "CORS", officialUrl: "https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS", searchQuery: "CORS explained tutorial", chapters: [5] },
  { term: "Express.js", officialUrl: "https://expressjs.com/", chapters: [5, 6] },
  { term: "nodejs.org", officialUrl: "https://nodejs.org/en", searchQuery: "Node.js explained tutorial", chapters: [5] },
  { term: "Express", officialUrl: "https://expressjs.com/", searchQuery: "Express.js Node explained", chapters: [5] },
  { term: "nodemon", officialUrl: "https://nodemon.io/", chapters: [5] },
  { term: "Render", officialUrl: "https://render.com/", searchQuery: "Render.com hosting explained", chapters: [5, 6] },
  { term: "Mongoose", officialUrl: "https://mongoosejs.com/", searchQuery: "Mongoose MongoDB explained", chapters: [6] },
  { term: "mongodb.com", officialUrl: "https://www.mongodb.com/", searchQuery: "MongoDB explained tutorial", chapters: [6] },
  { term: "MongoDB Atlas", officialUrl: "https://www.mongodb.com/atlas", chapters: [6] },
  { term: "MongoDB Compass", officialUrl: "https://www.mongodb.com/products/tools/compass", chapters: [6] },
];

function indexTerms(entries: TermEntry[]): Record<string, TermEntry> {
  const index: Record<string, TermEntry> = {};
  for (const entry of entries) {
    const slug = termSlug(entry.term);
    if (!index[slug]) {
      index[slug] = entry;
    }
  }
  return index;
}

export const TERM_REGISTRY: Record<string, TermEntry> = indexTerms(TERM_LIST);

export function getTerm(slug: string): TermEntry | undefined {
  return TERM_REGISTRY[slug];
}

export function listTermSlugs(): string[] {
  return Object.keys(TERM_REGISTRY);
}

/** Terms tagged as taught or first-used in a given chapter (not aliases-only dumps). */
export function listTermsForChapter(chapter: number): TermEntry[] {
  return TERM_LIST.filter((entry) => entry.chapters?.includes(chapter));
}

export type TermSearchParams = {
  href?: string | string[];
  term?: string | string[];
  q?: string | string[];
};

function firstString(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

/** Resolve display name + official URL for a slug, including query fallbacks. */
export function resolveTerm(
  slug: string,
  searchParams?: TermSearchParams,
): ResolvedTerm {
  const entry = getTerm(slug);
  const hrefOverride = safeHttpUrl(firstString(searchParams?.href));
  const termOverride = firstString(searchParams?.term)?.trim();
  const queryOverride = firstString(searchParams?.q)?.trim();

  const term = termOverride || entry?.term || titleFromSlug(slug);
  const officialUrl = hrefOverride ?? entry?.officialUrl ?? null;
  const searchQuery =
    queryOverride || entry?.searchQuery || defaultSearchQuery(term);

  return {
    slug,
    term,
    officialUrl,
    searchQuery,
    known: Boolean(entry),
  };
}

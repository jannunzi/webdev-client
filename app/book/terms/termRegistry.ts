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
  { term: "Internet", officialUrl: "https://en.wikipedia.org/wiki/Internet" },
  { term: "ARPA", officialUrl: "https://www.darpa.mil/", searchQuery: "DARPA ARPA explained" },
  { term: "DoD", officialUrl: "https://www.defense.gov/", searchQuery: "US Department of Defense explained" },
  { term: "ARPANET", officialUrl: "https://en.wikipedia.org/wiki/ARPANET" },
  { term: "TCP/IP", officialUrl: "https://www.ietf.org/", searchQuery: "TCP/IP protocol explained" },
  { term: "World Wide Web", officialUrl: "https://www.w3.org/" },
  { term: "Sir Tim Berners-Lee", officialUrl: "https://www.w3.org/People/Berners-Lee/" },
  { term: "CERN", officialUrl: "https://home.cern/" },
  { term: "URL", officialUrl: "https://url.spec.whatwg.org/", searchQuery: "URL web address explained" },
  { term: "HTTP", officialUrl: "https://httpwg.org/specs/rfc9110.html", searchQuery: "HTTP protocol explained" },
  { term: "WorldWideWeb", officialUrl: "https://en.wikipedia.org/wiki/WorldWideWeb" },
  { term: "HTML", officialUrl: "https://html.spec.whatwg.org/", searchQuery: "HTML explained tutorial" },
  { term: "XML", officialUrl: "https://www.w3.org/XML/", searchQuery: "XML markup language explained" },
  { term: "DOM", officialUrl: "https://dom.spec.whatwg.org/", searchQuery: "DOM document object model explained" },
  { term: "CGI", officialUrl: "https://datatracker.ietf.org/doc/html/rfc3875", searchQuery: "CGI common gateway interface explained" },
  { term: "PHP", officialUrl: "https://www.php.net/" },
  { term: "JavaScript", officialUrl: "https://tc39.es/ecma262/" },
  { term: "Netscape", officialUrl: "https://en.wikipedia.org/wiki/Netscape" },
  { term: "TypeScript", officialUrl: "https://www.typescriptlang.org/" },
  { term: "API", officialUrl: "https://en.wikipedia.org/wiki/API", searchQuery: "API application programming interface explained" },
  { term: "MongoDB", officialUrl: "https://www.mongodb.com/" },
  { term: "React", officialUrl: "https://react.dev/" },
  { term: "SPA", officialUrl: "https://en.wikipedia.org/wiki/Single-page_application", searchQuery: "single page application SPA explained" },
  { term: "Next.js", officialUrl: "https://nextjs.org/" },
  { term: "SSR", officialUrl: "https://en.wikipedia.org/wiki/Server-side_rendering", searchQuery: "server side rendering SSR explained" },
  { term: "SSG", officialUrl: "https://en.wikipedia.org/wiki/Static_site_generator", searchQuery: "static site generation SSG explained" },
  { term: "GitHub", officialUrl: "https://github.com/" },
  { term: "Vercel", officialUrl: "https://vercel.com/" },
  { term: "LMS", officialUrl: "https://en.wikipedia.org/wiki/Learning_management_system", searchQuery: "learning management system LMS explained" },
  { term: "CSS", officialUrl: "https://www.w3.org/Style/CSS/", searchQuery: "CSS cascading style sheets explained" },
  { term: "Chrome DevTools", officialUrl: "https://developer.chrome.com/docs/devtools" },
  { term: "Node.js", officialUrl: "https://nodejs.org/" },
  { term: "npm", officialUrl: "https://www.npmjs.com/", searchQuery: "npm node package manager explained" },
  { term: "npx", officialUrl: "https://docs.npmjs.com/cli/v11/commands/npx", searchQuery: "npx explained tutorial" },
  { term: "mvn", officialUrl: "https://maven.apache.org/", searchQuery: "Maven mvn Java explained" },
  { term: "Maven", officialUrl: "https://maven.apache.org/" },
  { term: "pip", officialUrl: "https://pip.pypa.io/", searchQuery: "pip Python package manager explained" },
  { term: "REST", officialUrl: "https://en.wikipedia.org/wiki/REST", searchQuery: "REST API explained" },
  { term: "LTS", officialUrl: "https://nodejs.org/en/about/previous-releases", searchQuery: "Node.js LTS long term support explained" },
  {
    term: "Integrated Development Environment (IDE)",
    officialUrl: "https://en.wikipedia.org/wiki/Integrated_development_environment",
    searchQuery: "IDE integrated development environment explained",
  },
  { term: "Visual Studio Code", officialUrl: "https://code.visualstudio.com" },
  { term: "Cursor", officialUrl: "https://cursor.com", searchQuery: "Cursor AI code editor explained" },
  { term: "ESLint", officialUrl: "https://eslint.org/" },
  { term: "Prettier", officialUrl: "https://prettier.io/" },
  { term: "React Developer Tools", officialUrl: "https://react.dev/learn/react-developer-tools" },
  { term: "git", officialUrl: "https://git-scm.com/", searchQuery: "git version control explained" },
  { term: "Claude", officialUrl: "https://claude.ai", searchQuery: "Claude AI Anthropic explained" },
  { term: "Anthropic", officialUrl: "https://www.anthropic.com/" },
  { term: "claude.ai", officialUrl: "https://claude.ai", searchQuery: "Claude AI Anthropic explained" },
  { term: "Claude Code", officialUrl: "https://code.claude.com/docs/en/vs-code" },
  { term: "Claude Code for VS Code", officialUrl: "https://code.claude.com/docs/en/vs-code" },
  { term: "Tailwind CSS", officialUrl: "https://tailwindcss.com/" },
  { term: "Turbopack", officialUrl: "https://nextjs.org/docs/app/api-reference/turbopack" },
  { term: "Google Chrome", officialUrl: "https://www.google.com/chrome/" },
  { term: "JSX", officialUrl: "https://react.dev/learn/writing-markup-with-jsx", searchQuery: "JSX React explained" },
  { term: "App Router", officialUrl: "https://nextjs.org/docs/app", searchQuery: "Next.js App Router explained" },
  { term: "useState", officialUrl: "https://react.dev/reference/react/useState", searchQuery: "React useState explained" },
  { term: "React Context", officialUrl: "https://react.dev/learn/passing-data-deeply-with-context" },
  { term: "Redux Toolkit", officialUrl: "https://redux-toolkit.js.org/" },
  { term: "Zustand", officialUrl: "https://zustand.docs.pmnd.rs/" },
  { term: "Context", officialUrl: "https://react.dev/learn/passing-data-deeply-with-context", searchQuery: "React Context explained" },
  { term: "Zustand documentation", officialUrl: "https://zustand.docs.pmnd.rs/", searchQuery: "Zustand React explained" },
  { term: "Route Handlers", officialUrl: "https://nextjs.org/docs/app/building-your-application/routing/route-handlers", searchQuery: "Next.js Route Handlers explained" },
  { term: "NEXT_PUBLIC_", officialUrl: "https://nextjs.org/docs/app/building-your-application/configuring/environment-variables", searchQuery: "Next.js NEXT_PUBLIC environment variables explained" },
  { term: "AJAX", officialUrl: "https://en.wikipedia.org/wiki/Ajax_(programming)", searchQuery: "AJAX JavaScript explained" },
  { term: "axios", officialUrl: "https://axios-http.com/", searchQuery: "axios JavaScript HTTP explained" },
  { term: "CORS", officialUrl: "https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS", searchQuery: "CORS explained tutorial" },
  { term: "Express.js", officialUrl: "https://expressjs.com/" },
  { term: "nodejs.org", officialUrl: "https://nodejs.org/en", searchQuery: "Node.js explained tutorial" },
  { term: "Express", officialUrl: "https://expressjs.com/", searchQuery: "Express.js Node explained" },
  { term: "nodemon", officialUrl: "https://nodemon.io/" },
  { term: "Render", officialUrl: "https://render.com/", searchQuery: "Render.com hosting explained" },
  { term: "Mongoose", officialUrl: "https://mongoosejs.com/", searchQuery: "Mongoose MongoDB explained" },
  { term: "mongodb.com", officialUrl: "https://www.mongodb.com/", searchQuery: "MongoDB explained tutorial" },
  { term: "MongoDB Atlas", officialUrl: "https://www.mongodb.com/atlas" },
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

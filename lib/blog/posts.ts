import type { BlogPost } from "./types";

/**
 * Instructor-curated digests. Intros paraphrase the official posts only —
 * never invent news, quotes, or dates. Source URLs are the originals.
 */
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "vercel-cdn-metadata-shards-91",
    title: "Vercel CDN: indexed metadata shards cut P99 lookup latency 91%",
    publishedAt: "2026-09-15T12:00:00.000Z",
    tags: ["nextjs", "course"],
    relatedChapters: ["ch1"],
    intro: [
      "On September 10, 2026, Tim Caswell, Steven Salat, and Luba Kravchenko described how Vercel cut CDN metadata lookup latency. The CDN runs on average over 80 million routing instructions per second, and metadata lookups decide which paths exist and how to serve them. The team moved from per-path metadata objects to bounded indexed shards of about 200 KB, using JSONL plus inline indexes so one fetch warms many paths while lookups parse only the needed record.",
      "Production measurements on August 5-12, 2026 traffic show P99 metadata lookup latency falling from 215.8 ms to 19.1 ms (91% lower) and the average from 8.59 ms to 1.81 ms (79% lower). Deployments built after July 17, 2026 already use the new shards; older deployments need a redeploy. The Build Output API contract is unchanged, and the change also saved about 16.6 seconds of redundant metadata upload work, making the deploy step about 10% faster overall. For CS 4550 / CS 5610, this helps explain how Next.js App Router deployments are routed on Vercel and why redeploying can pick up platform improvements without app code changes.",
      "Optional further reading for CS 4550 / CS 5610 — not required for labs or grades. Follow the original Vercel post for measurements and rollout details rather than treating this digest as the full write-up.",
    ],
    source: {
      title: "How we cut CDN metadata lookup latency by 91%",
      url: "https://vercel.com/blog/how-we-cut-cdn-metadata-lookup-latency-by-91-percent",
      publisher: "Vercel",
    },
  },
  {
    slug: "cursor-projects-coordinator",
    title: "Cursor Projects: coordinator agents for features, migrations, and gardening",
    publishedAt: "2026-09-15T12:00:00.000Z",
    tags: ["ai", "course"],
    relatedChapters: ["ch1"],
    intro: [
      "On September 10, 2026, Alexi Robbins and Fredrika Lindh introduced Cursor Projects on the product blog, rolling out in beta. Projects take on larger bodies of work such as a feature, a migration, or a full app: they keep context over months, delegate to thousands of subagents, and can run recurring work without being prompted. You chat with a Projects coordinator that directs other agents rather than writing code itself. Runs are cloud by default on their own computer so closing a laptop does not stop the work, agents share context files, and subscriptions cover Slack, a schedule, and pull requests or CI.",
      "Cursor reports that new users merge 30% more pull requests, and that users who primarily use Projects merge six times as many — those figures are Cursor's own reporting. The post describes three patterns: feature work, migrations that span hundreds of pull requests, and ongoing gardening such as a design-system Project watching pull requests.",
      "Optional further reading for CS 4550 / CS 5610 — not required for labs or grades. If you already use Cursor on labs, do not treat agent output as a substitute for understanding Next.js and React yourself.",
    ],
    source: {
      title: "Introducing Projects",
      url: "https://cursor.com/blog/projects",
      publisher: "Cursor",
    },
  },
  {
    slug: "express-august-2026-security-releases",
    title: "Express August 2026 security releases: hbs, multer, and morgan",
    publishedAt: "2026-09-15T12:00:00.000Z",
    tags: ["security", "course"],
    relatedChapters: ["ch5"],
    intro: [
      "On August 31, 2026, Ulises Gascon published August 2026 security releases on the Express blog. The releases are hbs 4.3.0, multer 2.3.0, and morgan 1.12.0, addressing six vulnerabilities.",
      "The post names CVE-2026-16231 (hbs async helper XSS, High); CVE-2026-77037, CVE-2026-77078, and CVE-2026-82333 (multer denial-of-service and resource issues, High); CVE-2026-15603 (morgan Unicode log forging, Medium); and CVE-2026-77063 (multer async fileFilter size-limit bypass, Low). The recommended action is to upgrade with npm update hbs multer morgan, or bump those packages. For Chapter 5 Express and Node server hygiene, multipart upload middleware and logging are common lab patterns; patch when advisories land.",
      "Optional further reading for CS 4550 / CS 5610 — not required for labs or grades. This digest is not a substitute for the advisory — follow the original Express post for the full CVE list and upgrade notes.",
    ],
    source: {
      title: "August 2026 Security Releases",
      url: "https://expressjs.com/en/blog/2026-08-31-security-releases/",
      publisher: "Express.js",
    },
  },
  {
    slug: "react-19-3",
    title: "React 19.3: View Transitions, Fragment Refs, browser(), and Trusted Types",
    publishedAt: "2026-09-14T16:00:00.000Z",
    tags: ["react", "course"],
    relatedChapters: ["ch1", "ch3"],
    intro: [
      "On September 9, 2026, the React Team announced that React 19.3 is on npm. View Transitions and Fragment Refs, shared as experimental APIs last year, are stable in this release.",
      "The ViewTransition component animates elements as they enter, exit, move, or resize using the browser View Transition API. You can pass a ref to a Fragment to get a FragmentInstance for working with sibling DOM children as a group. A component can call use(browser()) to opt out of server-side rendering: the nearest Suspense fallback shows on the server, then the component renders after hydration. React 19.3 also passes Trusted Types values through without string coercion so a Content-Security-Policy require-trusted-types-for policy can protect injection sinks such as innerHTML.",
      "Optional further reading for CS 4550 / CS 5610 — not required for labs or grades. Stay on the React version this repo already pins unless you are experimenting, and follow the original post for APIs and examples.",
    ],
    source: {
      title: "React 19.3",
      url: "https://react.dev/blog/2026/09/09/react-19-3",
      publisher: "React",
    },
  },
  {
    slug: "ai-sdk-7-agent-platform",
    title: "AI SDK 7: agents, tools, and realtime beyond text",
    publishedAt: "2026-09-14T16:00:00.000Z",
    tags: ["ai", "course"],
    relatedChapters: ["ch1"],
    intro: [
      "On June 25, 2026, Vercel published AI SDK 7, the TypeScript SDK they describe as the layer for building AI applications, features, frameworks, and agents across model providers. The post frames the release as production depth for agent work: developing agents (reasoning control, typed tool and runtime context, provider file and skill uploads, MCP Apps, and a terminal UI), running them (tool approvals, durable WorkflowAgent, timeouts, and sandbox sessions), integrating established harnesses, and observing runs with telemetry and lifecycle events.",
      "The same announcement also covers experimental provider-agnostic realtime voice sessions and generateVideo. A v7 codemod is mentioned for upgrades from AI SDK 6.",
      "Optional further reading for CS 4550 / CS 5610 — not required for labs or grades. If you try the SDK, start from the original post rather than assuming last year's AI SDK APIs.",
    ],
    source: {
      title: "AI SDK 7",
      url: "https://vercel.com/blog/ai-sdk-7",
      publisher: "Vercel",
    },
  },
  {
    slug: "nextjs-security-middleware-proxy",
    title: "Next.js security: Middleware and Proxy are not the only authorization layer",
    publishedAt: "2026-09-14T16:00:00.000Z",
    tags: ["nextjs", "security", "course"],
    relatedChapters: ["ch1", "ch5"],
    intro: [
      "On September 14, 2026, iSyncEvolution published a CTO-oriented guide to Next.js Middleware and Proxy authorization risk. It reviews CVE-2025-29927, a critical Middleware authorization bypass (CVSS 9.1) patched in releases including 12.3.5, 13.5.9, 14.2.25, and 15.2.3, plus later 2026 Middleware/Proxy bypasses disclosed in May (App Router segment-prefetch, Pages Router i18n, dynamic route parameters) and July (certain App Router apps using Turbopack and a single i18n locale in the 16.0.x–16.2.x range).",
      "The through-line is architectural: do not treat Middleware or, in Next.js 16, proxy.ts as the only authorization layer. The guide repeats the recommended workaround — enforce authorization in server-side page, Route Handler, Server Action, or data-access logic — and notes that renaming middleware.ts to proxy.ts is not itself a security migration.",
      "Optional further reading for CS 4550 / CS 5610 — not required for labs or grades. This course site already uses a proxy file for request handling; that does not replace checks at protected operations. Read the original article and the linked Next.js advisories before changing lab auth.",
    ],
    source: {
      title: "Next.js Security Best Practices: CTO Guide to Middleware & Proxy Risks",
      url: "https://www.isyncevolution.com/blog/nextjs-security-best-practices",
      publisher: "iSyncEvolution",
    },
  },
  {
    slug: "august-2026-nextjs-security-release",
    title: "August 2026 Next.js security release: patch 16.3.3",
    publishedAt: "2026-08-25T18:00:00.000Z",
    tags: ["nextjs", "security", "course"],
    relatedChapters: ["ch1", "ch5"],
    intro: [
      "On August 25, 2026, the Next.js team published a security release and asked everyone to patch immediately. Updates landed in v16.3.3 (Active LTS) and v15.5.24 (Maintenance LTS) after an extra critical issue in an upstream dependency moved the date forward.",
      "Two issues are called out: unauthenticated remote code execution in the Image Optimization API when using AVIF (a vulnerability in libheif used by sharp; the patched releases disable AVIF optimization until an upstream fix lands), and a Windows-only unauthenticated RCE when an app uses both the Pages Router and the App Router without Cache Components. Linux and macOS are not affected by the Windows issue; the post says there is no known workaround for affected Windows-hosted apps.",
      "Most of you deploy this course on Vercel (Linux), but the habit still matters: when the Next.js blog says patch ASAP, bump next and redeploy. This digest is not a substitute for the advisory — follow the original post and the linked GHSA/CVE entries.",
    ],
    source: {
      title: "August 2026 Security Release",
      url: "https://nextjs.org/blog/august-2026-security-release",
      publisher: "Next.js",
    },
  },
  {
    slug: "nextjs-16-3-instant-navigations",
    title: "Next.js 16.3: Instant Navigations and a faster everyday toolchain",
    publishedAt: "2026-08-03T17:00:00.000Z",
    tags: ["nextjs", "react", "course"],
    relatedChapters: ["ch1", "ch3"],
    intro: [
      "Next.js 16.3 is the framework release this course site already sits on. The official post highlights Instant Navigations — an opt-in suite that aims for SPA-like clicks without giving up the server-driven App Router — plus quieter wins you will feel in lab: lower next dev memory (up to 90% less RAM on long sessions), faster rebuilds via disk cache, TypeScript 7 type-checking during next build, and up to 22% more requests under load after App Router SSR switched to native Node streams.",
      "For CS 4550 / CS 5610, the practical takeaway is upgrade hygiene and navigation mental models. Instant Navigations is still opt-in (cacheComponents and partialPrefetching in next.config.ts); it is not required for labs or grades. If you experiment, read the original notes on Instant Insights, Partial Prefetching, and the Playwright instant() helper so you do not invent caching behavior.",
      "The same post also points at versioned docs for AI agents (the AGENTS.md block next dev writes) and a companion write-up on agent tooling. Treat those as optional further reading while you finish chapters 1 and 3.",
    ],
    source: {
      title: "Next.js 16.3",
      url: "https://nextjs.org/blog/next-16-3",
      publisher: "Next.js",
    },
  },
  {
    slug: "nextjs-16-3-ai-improvements",
    title: "Next.js 16.3 AI improvements: version-matched docs and agent Skills",
    publishedAt: "2026-06-26T15:00:00.000Z",
    tags: ["nextjs", "ai", "course"],
    relatedChapters: ["ch1"],
    intro: [
      "Before 16.3 went stable, the Next.js team published a preview-era post about designing the framework for agent-driven development. The through-line is keeping coding agents on this version of Next.js instead of stale training data: next dev writes a version-matched AGENTS.md pointer at the bundled docs in node_modules/next/dist/docs/.",
      "The post also describes first-party Skills for multi-step workflows (next-dev-loop, Cache Components adoption and optimizer), agent-browser React introspection, Instant Insights fix menus with copy-ready prompts, a smaller DevTools MCP server, and docs-as-Markdown (append .md to any docs URL).",
      "None of this is assigned coursework. If you already use Cursor or another agent for labs, the useful habit is: read the local Next.js docs the repo points at, and do not assume last year's App Router APIs still apply.",
    ],
    source: {
      title: "Next.js 16.3: AI Improvements",
      url: "https://nextjs.org/blog/next-16-3-ai-improvements",
      publisher: "Next.js",
    },
  },
];

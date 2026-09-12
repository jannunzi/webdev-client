import type { BlogPost } from "./types";

/**
 * Instructor-curated digests. Intros paraphrase the official posts only —
 * never invent news, quotes, or dates. Source URLs are the originals.
 */
export const BLOG_POSTS: BlogPost[] = [
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

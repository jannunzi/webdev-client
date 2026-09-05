import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  COURSE_SITE_ORIGIN,
  adjacentLectureSlugs,
  getLecture,
  getLectureDeck,
  isLectureSlug,
  lectureDeckThumbnail,
  lecturePublicUrl,
  listCanvasLectureGroups,
  listLectureDecks,
  listLectureSlugs,
  listLectures,
} from "./catalog";
import {
  LECTURE_1_SLUGS,
  LECTURE_2_SLUGS,
  LECTURE_DIAGRAM_IDS,
  LECTURE_EMBED_IDS,
  LECTURE_SLUGS,
  lectureSlideAssetPath,
  lectureSlideDensity,
  lectureSlideCodeBlocks,
  lectureThumbPath,
} from "./types";

function slideText(deckSlug: string): string {
  const deck = getLectureDeck(deckSlug);
  assert.ok(deck);
  return deck.slides
    .flatMap((slide) => [
      slide.title,
      ...(slide.bullets ?? []),
      slide.interactiveHint ?? "",
      ...lectureSlideCodeBlocks(slide).map((block) => block.code),
    ])
    .join("\n");
}

function findSlide(deckSlug: string, id: string) {
  const deck = getLectureDeck(deckSlug);
  assert.ok(deck);
  const slide = deck.slides.find((row) => row.id === id);
  assert.ok(slide, `${deckSlug} missing slide ${id}`);
  return slide;
}

describe("lecture catalog", () => {
  it("lists Lecture 1 then Lecture 2 slugs in locked order", () => {
    assert.deepEqual(listLectureSlugs(), [
      ...LECTURE_1_SLUGS,
      ...LECTURE_2_SLUGS,
    ]);
    assert.deepEqual(listLectureSlugs(), [...LECTURE_SLUGS]);
    assert.equal(LECTURE_1_SLUGS.length, 5);
    assert.equal(LECTURE_2_SLUGS.length, 6);
  });

  it("marks Lecture 1 entries as Canvas Lecture 1 / Chapter 1", () => {
    const items = listLectures().filter((item) => item.canvasLecture === 1);
    assert.equal(items.length, 5);
    for (const item of items) {
      assert.equal(item.chapter, 1);
      assert.equal(item.canvasLecture, 1);
      assert.equal(item.chapterHref, "/book/ch1");
      assert.ok(item.chapterTitle.length > 0);
      assert.ok(item.title.length > 0);
      assert.ok(item.summary.length > 0);
      assert.equal(item.publicUrl, `${COURSE_SITE_ORIGIN}/lectures/${item.slug}`);
      assert.equal(lecturePublicUrl(item.slug), item.publicUrl);
      assert.equal(item.thumbnailSrc, lectureDeckThumbnail(item.slug));
      assert.doesNotMatch(item.thumbnailSrc, /slide-01/);
      assert.match(item.thumbnailSrc, /\/lectures\/thumbs\/.+\.svg$/);
    }
  });

  it("marks Lecture 2 entries as Canvas Lecture 2 / Chapter 1", () => {
    const items = listLectures().filter((item) => item.canvasLecture === 2);
    assert.equal(items.length, 6);
    assert.deepEqual(
      items.map((item) => item.slug),
      [...LECTURE_2_SLUGS],
    );
    for (const item of items) {
      assert.equal(item.chapter, 1);
      assert.equal(item.canvasLecture, 2);
      assert.equal(item.chapterHref, "/book/ch1");
      assert.match(item.thumbnailSrc, /\/lectures\/thumbs\/.+\.svg$/);
    }
  });

  it("returns undefined for unknown slugs", () => {
    assert.equal(getLecture("not-a-deck"), undefined);
    assert.equal(getLectureDeck("vite-spa"), undefined);
    assert.equal(isLectureSlug("intro-to-web-development"), true);
    assert.equal(isLectureSlug("html-and-dom"), true);
    assert.equal(isLectureSlug("intro"), false);
  });

  it("groups Lecture 1 and Lecture 2 decks; later weeks stay empty", () => {
    const groups = listCanvasLectureGroups();
    assert.ok(groups.length >= 11);
    assert.equal(groups[0]?.title, "Lecture 1");
    assert.equal(groups[0]?.canvasLecture, 1);
    assert.equal(groups[0]?.decks.length, 5);
    assert.deepEqual(
      groups[0]?.decks.map((deck) => deck.slug),
      [...LECTURE_1_SLUGS],
    );
    assert.equal(groups[1]?.title, "Lecture 2");
    assert.equal(groups[1]?.canvasLecture, 2);
    assert.equal(groups[1]?.decks.length, 6);
    assert.deepEqual(
      groups[1]?.decks.map((deck) => deck.slug),
      [...LECTURE_2_SLUGS],
    );
    assert.equal(
      lectureDeckThumbnail(groups[0]!.decks[0]!),
      "/lectures/thumbs/intro-to-web-development.svg",
    );
    assert.equal(
      lectureDeckThumbnail("commit-to-github"),
      "/lectures/thumbs/commit-to-github.svg",
    );
    assert.equal(
      lectureDeckThumbnail("html-and-dom"),
      "/lectures/thumbs/html-and-dom.svg",
    );
    for (const slug of LECTURE_SLUGS) {
      const thumb = lectureDeckThumbnail(slug);
      assert.notEqual(thumb, lectureSlideAssetPath(slug, 1));
      assert.equal(thumb, lectureThumbPath(slug));
      assert.doesNotMatch(thumb, /slide-\d\d/);
      const disk = join(process.cwd(), thumb.replace(/^\//, "public/"));
      assert.ok(existsSync(disk), `${thumb} is missing on disk`);
    }
    for (const group of groups.slice(2)) {
      assert.equal(group.title, `Lecture ${group.canvasLecture}`);
      assert.equal(group.decks.length, 0);
    }
  });

  it("walks adjacent decks across Lecture 1 into Lecture 2", () => {
    const first = adjacentLectureSlugs("intro-to-web-development");
    assert.equal(first.prev, undefined);
    assert.equal(first.next?.slug, "installing-nodejs");
    const lastLecture1 = adjacentLectureSlugs("deploying-to-vercel");
    assert.equal(lastLecture1.next?.slug, "html-and-dom");
    assert.equal(lastLecture1.prev?.slug, "commit-to-github");
    const last = adjacentLectureSlugs("single-page-navigation");
    assert.equal(last.next, undefined);
    assert.equal(last.prev?.slug, "anchors");
  });
});

describe("lecture decks", () => {
  it("exports typed slides at the expected lengths", () => {
    const decks = listLectureDecks();
    const counts = Object.fromEntries(
      decks.map((deck) => [deck.slug, deck.slides.length]),
    );
    assert.equal(counts["intro-to-web-development"], 18);
    assert.ok((counts["installing-nodejs"] ?? 0) >= 16);
    assert.equal(counts["creating-a-nextjs-react-application"], 27);
    assert.equal(counts["commit-to-github"], 7);
    assert.ok((counts["deploying-to-vercel"] ?? 0) >= 14);
    assert.ok((counts["deploying-to-vercel"] ?? 0) <= 17);
    assert.equal(counts["html-and-dom"], 16);
    assert.equal(counts["headings-and-paragraphs"], 9);
    assert.equal(counts["lists-and-tables"], 13);
    assert.equal(counts["web-forms"], 21);
    assert.equal(counts["anchors"], 5);
    assert.equal(counts["single-page-navigation"], 14);
    for (const deck of decks) {
      const ids = deck.slides.map((slide) => slide.id);
      assert.equal(new Set(ids).size, ids.length, `${deck.slug} duplicate slide id`);
      for (const slide of deck.slides) {
        assert.ok(slide.id);
        assert.ok(slide.title);
      }
    }
  });

  it("sizes text-only slides spacious and diagram/embed slides dense", () => {
    const textOnly = findSlide("intro-to-web-development", "internet");
    const diagram = findSlide("intro-to-web-development", "client-server");
    const embed = findSlide("creating-a-nextjs-react-application", "welcome-page");
    const htmlText = findSlide("html-and-dom", "html-means");
    const htmlDiagram = findSlide("html-and-dom", "the-dom");
    const htmlEmbed = findSlide("headings-and-paragraphs", "lab1-nest");
    assert.equal(lectureSlideDensity(textOnly), "spacious");
    assert.equal(lectureSlideDensity(diagram), "dense");
    assert.equal(lectureSlideDensity(embed), "dense");
    assert.equal(lectureSlideDensity(htmlText), "spacious");
    assert.equal(lectureSlideDensity(htmlDiagram), "dense");
    assert.equal(lectureSlideDensity(htmlEmbed), "dense");
    assert.equal(
      lectureSlideDensity({ id: "forced", title: "Forced", density: "dense" }),
      "dense",
    );
  });

  it("teaches App Router only in the Next.js deck", () => {
    const text = slideText("creating-a-nextjs-react-application");
    assert.match(text, /App Router/);
    assert.match(text, /Welcome to Web Dev/);
    assert.match(text, /labs\/lab1/);
    assert.match(text, /globals\.css/);
    assert.match(text, /next\/link/);
    assert.doesNotMatch(text, /npm create vite/i);
    assert.doesNotMatch(text, /create-vite/);
    assert.doesNotMatch(text, /vite\.config/i);
    assert.doesNotMatch(text, /Vite SPA leftover/i);
    assert.doesNotMatch(text, /No Vite SPA setup/i);
  });

  it("drops Vite SPA leftover phrasing from authored decks", () => {
    for (const deck of listLectureDecks()) {
      const text = slideText(deck.slug);
      assert.doesNotMatch(text, /Vite SPA leftover/i);
      assert.doesNotMatch(text, /No Vite SPA setup/i);
      assert.doesNotMatch(text, /Vite-only SPA/i);
    }
    const creating = getLecture("creating-a-nextjs-react-application");
    assert.ok(creating);
    assert.doesNotMatch(creating.summary, /Vite SPA leftover/i);
    const nextUp = findSlide("installing-nodejs", "next-up");
    assert.match(nextUp.title, /Next: create the Next\.js app/);
    assert.ok(!(nextUp.bullets ?? []).some((row) => /vite/i.test(row)));
  });

  it("embeds live Ch1 demos instead of UI screenshots", () => {
    const expected = {
      "user-component": "user-card",
      "welcome-page": "welcome-home",
      "lab1-route": "lab1-stub",
      "link-to-lab1": "link-nav",
      "user-on-page": "user-card",
    } as const;
    for (const [id, embed] of Object.entries(expected)) {
      const slide = findSlide("creating-a-nextjs-react-application", id);
      assert.equal(slide.embed, embed);
      assert.equal(slide.imageSrc, undefined);
      assert.ok((LECTURE_EMBED_IDS as readonly string[]).includes(embed));
    }
  });

  it("embeds Lab 1 HTML previews on Lecture 2 decks", () => {
    const expected = {
      "html-and-dom": { "hello-html": "html-skeleton", "jsx-lab1": "lab1-stub" },
      "headings-and-paragraphs": {
        "heading-scale": "heading-scale",
        "lab1-nest": "heading-tags",
        "wrap-p": "paragraph-tag",
      },
      "lists-and-tables": {
        "pancakes-after": "list-tags",
        "books-ul": "list-tags",
        "quiz-table": "tables",
      },
      "web-forms": {
        "text-fields-demo": "text-fields",
        textarea: "textarea",
        buttons: "buttons",
        "onclick-alert": "alert-button",
        file: "file-field",
        "radio-same-name": "radio-buttons",
        "checkboxes-multi": "checkboxes",
        "select-one": "dropdowns",
        "select-many": "dropdowns",
        number: "typed-fields",
        range: "typed-fields",
        email: "typed-fields",
        date: "typed-fields",
      },
      anchors: {
        "href-documents": "anchors",
        "mailto-tel": "mailto-tel",
        "hash-toc": "hash-toc",
      },
      "single-page-navigation": {
        "link-toc": "labs-index",
        "labs-index-toc": "labs-index",
        "layout-children": "labs-layout",
        "lab2-page": "labs-layout",
        "lab3-page": "labs-layout",
      },
    } as const;
    const used = new Set<string>();
    for (const [slug, slides] of Object.entries(expected)) {
      for (const [id, embed] of Object.entries(slides)) {
        const slide = findSlide(slug, id);
        assert.equal(slide.embed, embed);
        assert.equal(slide.imageSrc, undefined);
        assert.ok((LECTURE_EMBED_IDS as readonly string[]).includes(embed));
        used.add(embed);
      }
    }
    for (const deck of listLectureDecks()) {
      for (const slide of deck.slides) {
        if (slide.embed) used.add(slide.embed);
      }
    }
    assert.deepEqual(
      [...LECTURE_EMBED_IDS].sort(),
      [...used].sort(),
      "every embed id should be wired to a slide",
    );
  });

  it("keeps Node deck evergreen and uses kambaz spelling", () => {
    const text = slideText("installing-nodejs");
    assert.match(text, /mkdir -p webdev/);
    assert.match(text, /kambaz-node-server-app/);
    assert.match(text, /localhost:4000\/hello/);
    assert.doesNotMatch(text, /Fall 2026/);
    assert.doesNotMatch(text, /2026\/fall\/webdev/);
    assert.doesNotMatch(text, /Winter 2034/);
    assert.doesNotMatch(text, /kanbas/);
    assert.doesNotMatch(text, /kanbaz-node/);
  });

  it("omits semester and course-section strings from authored slides", () => {
    for (const deck of listLectureDecks()) {
      const text = slideText(deck.slug);
      assert.doesNotMatch(text, /Fall 20\d\d/);
      assert.doesNotMatch(text, /Winter 20\d\d/);
      assert.doesNotMatch(text, /CS 4550/);
      assert.doesNotMatch(text, /CS 5610/);
      assert.doesNotMatch(text, /2026\/fall/);
    }
  });

  it("rewrites deploy notes to Vercel and not Netlify", () => {
    const text = slideText("deploying-to-vercel");
    assert.match(text, /Vercel/);
    assert.match(text, /Deployment Protection/);
    assert.match(text, /Vercel Authentication/);
    assert.match(text, /OFFICE HOURS/);
    assert.match(text, /BREAK/);
    assert.doesNotMatch(text, /netlify\.com/i);
    assert.doesNotMatch(text, /Deploy to Netlify/);
  });

  it("normalizes kambaz naming in the GitHub deck", () => {
    const text = slideText("commit-to-github");
    assert.match(text, /kambaz/);
    assert.match(text, /node_modules/);
    assert.match(text, /git push -u origin main/);
    assert.doesNotMatch(text, /kanbas/);
    assert.doesNotMatch(text, /kanbaz/);
  });

  it("teaches Chapter 1 HTML topics in the Lecture 2 decks", () => {
    const html = slideText("html-and-dom");
    assert.match(html, /HyperText Markup Language|HTML = HyperText/);
    assert.match(html, /DOCTYPE/);
    assert.match(html, /hello\.html/);
    assert.match(html, /<!--/);
    assert.match(html, /\{\/\*/);
    assert.match(html, /Window/);
    assert.match(html, /wd-lab1/);

    const headings = slideText("headings-and-paragraphs");
    assert.match(headings, /h1/);
    assert.match(headings, /wd-h-tag/);
    assert.match(headings, /wd-p-2/);
    assert.match(headings, /wd-p-4/);

    const lists = slideText("lists-and-tables");
    assert.match(lists, /wd-pancakes/);
    assert.match(lists, /wd-tables/);
    assert.match(lists, /colSpan/);
    assert.match(lists, /not layout|not a layout/i);

    const forms = slideText("web-forms");
    assert.match(forms, /defaultValue/);
    assert.match(forms, /htmlFor/);
    assert.match(forms, /type="file"/);
    assert.match(forms, /radio-genre/);
    assert.match(forms, /preventDefault/);
    assert.doesNotMatch(forms, /Fall 2026/);

    const anchors = slideText("anchors");
    assert.match(anchors, /wd-lipsum/);
    assert.match(anchors, /mailto:/);
    assert.match(anchors, /tel:/);
    assert.match(anchors, /#wd-anchor-bottom/);

    const spa = slideText("single-page-navigation");
    assert.match(spa, /next\/link/);
    assert.match(spa, /History API/);
    assert.match(spa, /layout\.tsx/);
    assert.match(spa, /app\/labs\/page\.tsx/);
    assert.match(spa, /TOC\.tsx/);
    assert.match(spa, /app\/labs\/lab2\/page\.tsx/);
    assert.match(spa, /app\/labs\/lab3\/page\.tsx/);
    assert.match(spa, /\(kambaz\)/);
    assert.match(spa, /#\/lab1/);
    const tocSlide = findSlide("single-page-navigation", "labs-index-toc");
    const tocFiles = lectureSlideCodeBlocks(tocSlide).map((block) => block.file);
    assert.ok(tocFiles.includes("app/labs/page.tsx"));
    assert.ok(tocFiles.includes("app/labs/TOC.tsx"));
  });

  it("uses authored diagrams instead of Google Slides rasters", () => {
    const expected = {
      "intro-to-web-development": {
        "network-of-networks": "network-of-networks",
        "client-server": "client-server",
        ssr: "ssr",
        csr: "csr",
      },
      "installing-nodejs": {
        "course-stack": "course-stack",
      },
      "creating-a-nextjs-react-application": {
        "npm-run-dev": "npm-run-dev-mock",
        "browser-parses-dom": "dom-tree",
      },
      "commit-to-github": {
        "create-repo": "github-create-repo-mock",
      },
      "deploying-to-vercel": {
        "select-repo": "vercel-import-mock",
        deploy: "vercel-deploy-mock",
        congratulations: "vercel-success-mock",
        protections: "vercel-protect-mock",
        "disable-auth": "vercel-auth-mock",
      },
      "html-and-dom": {
        "the-dom": "dom-tree",
      },
    } as const;

    const used = new Set<string>();
    for (const [slug, slides] of Object.entries(expected)) {
      for (const [id, diagram] of Object.entries(slides)) {
        const slide = findSlide(slug, id);
        assert.equal(slide.diagram, diagram);
        assert.equal(
          slide.imageSrc,
          undefined,
          `${slug} ${id} should not attach a PNG figure`,
        );
        assert.ok((LECTURE_DIAGRAM_IDS as readonly string[]).includes(diagram));
        used.add(diagram);
      }
    }

    assert.deepEqual(
      [...LECTURE_DIAGRAM_IDS].sort(),
      [...used].sort(),
      "every diagram id should be wired to a slide",
    );

    for (const deck of listLectureDecks()) {
      for (const slide of deck.slides) {
        assert.equal(
          slide.imageSrc,
          undefined,
          `${deck.slug} ${slide.id} should not auto-attach a PNG`,
        );
        if (slide.diagram) {
          assert.ok(
            (LECTURE_DIAGRAM_IDS as readonly string[]).includes(slide.diagram),
          );
        }
      }
    }
  });

  it("keeps commands and source in code blocks, not bullets", () => {
    const hello = findSlide("installing-nodejs", "hello-js");
    const express = findSlide("installing-nodejs", "express");
    const createApp = findSlide(
      "creating-a-nextjs-react-application",
      "create-next-app",
    );
    const welcome = findSlide(
      "creating-a-nextjs-react-application",
      "welcome-page",
    );
    const git = findSlide("commit-to-github", "from-project");
    const ignore = findSlide("commit-to-github", "gitignore");
    const lab1 = findSlide("html-and-dom", "jsx-lab1");

    assert.match(hello.code ?? "", /console\.log/);
    assert.ok(!(hello.bullets ?? []).some((row) => row.includes("console.log")));

    const expressCode = lectureSlideCodeBlocks(express)
      .map((block) => block.code)
      .join("\n");
    assert.match(expressCode, /npm install express/);
    assert.match(expressCode, /app\.listen\(4000\)/);
    assert.ok(!(express.bullets ?? []).some((row) => row.includes("app.listen")));

    assert.equal(createApp.code, "npx create-next-app@latest kambaz-next-js");
    assert.equal(createApp.codeLanguage, "bash");
    assert.match(welcome.code ?? "", /Welcome to Web Dev/);
    assert.equal(welcome.codeFile, "app/page.tsx");
    assert.match(git.code ?? "", /git push -u origin main/);
    assert.ok(!(git.bullets ?? []).some((row) => row.startsWith("`git ")));
    assert.match(ignore.code ?? "", /node_modules\//);
    assert.equal(ignore.codeFile, ".gitignore");
    assert.match(lab1.code ?? "", /wd-lab1/);
    assert.equal(lab1.codeFile, "app/labs/lab1/page.tsx");
  });
});

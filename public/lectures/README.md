# Slide deck assets

Decks live in `lib/lectures/decks/*.ts` as authored TypeScript — titles,
bullets, code blocks, live Ch1 `embed`s, and `diagram` ids. The shell
renders an authored SVG/React figure from
`app/slides/_components/diagrams/` when `diagram` is set. Default: no
`imageSrc`. Do not crop Google Slides into slide figures.

Exception: Chapter 1 Kambaz decks may set `imageSrc` to a book Canvas /
Kambaz **target** screenshot under `/images/book/kambaz/` (the same
`BookFigure` assets as `app/book`). Place those slides **before** the
code + live-demo pair for that screen. Do not invent UI mockups.

Exception: the Lab 5 path, object, array, and HTTP-server decks may set
`imageSrc` to a Jose-approved request/response PNG under
`/lectures/<slug>/*-diagram.png`,
with `imageAlt` that describes the flow. Those files are the slide figures.
They are not Google Slides crops and not index cards.

Side-by-side boxes in one diagram share the height of the tallest
box. A JSON array keeps `[` on the first object's line and `]` on the
last object's line, and those rows are left-aligned so the objects
line up. Keep square-bottom title bands, the standard arrows, and
fill-height-then-scale (`DiagramFit` in the slide shell).

Each deck should open with a high-level diagram on slide 2 or 3 that
shows the deck's overall goal, unless a diagram would not explain that
goal (a language or styling drill whose next slides are the syntax, or a
screen build whose target screenshot is already the picture). Reuse a
diagram from later in the deck when that figure is the overview.

`LECTURE_DIAGRAM_IDS` in `lib/lectures/types.ts` is the catalog of
diagrams and product-UI mocks (browser chrome + key labels, not
screenshots). Live React demos stay on `embed` (User card, Welcome
heading, Lab 1 stub, Link nav, plus Lab 1 HTML previews).

Index thumbnails are authored 16:9 logo cards in `public/lectures/thumbs/`
(`lectureThumbPath(slug)`). They are not Google Slides `slide-01` rasters.
Instructor-created draft decks use the shared `draft.svg` placeholder until
a real thumb is authored.
Regenerate with `node scripts/write-lecture-thumbs.mjs`. Do not nest these
assets under `/book`.

PNG exports from classroom Google Slides may remain on disk as historical
reference. They are **not** the slide figures and are **not** the index
cards.


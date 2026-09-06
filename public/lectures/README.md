# Slide deck assets

Decks live in `lib/lectures/decks/*.ts` as authored TypeScript — titles,
bullets, code blocks, live Ch1 `embed`s, and `diagram` ids. The shell
renders an authored SVG/React figure from
`app/slides/_components/diagrams/` when `diagram` is set. Default: no
`imageSrc`. Do not crop Google Slides into slide figures.

`LECTURE_DIAGRAM_IDS` in `lib/lectures/types.ts` is the catalog of
diagrams and product-UI mocks (browser chrome + key labels, not
screenshots). Live React demos stay on `embed` (User card, Welcome
heading, Lab 1 stub, Link nav, plus Lab 1 HTML previews).

Index thumbnails are authored 16:9 logo cards in `public/lectures/thumbs/`
(`lectureThumbPath(slug)`). They are not Google Slides `slide-01` rasters.
Regenerate with `node scripts/write-lecture-thumbs.mjs`. Do not nest these
assets under `/book`.

PNG exports from classroom Google Slides may remain on disk as historical
reference. They are **not** the slide figures and are **not** the index
cards.

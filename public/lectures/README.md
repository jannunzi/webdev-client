# Lecture slide assets

PNG exports from classroom Google Slides remain on disk as optional
**index-card thumbnails** and historical reference. They are **not** the
slide figures.

Decks live in `lib/lectures/decks/*.ts` as authored TypeScript — titles,
bullets, code blocks, live Ch1 `embed`s, and `diagram` ids. The shell
renders an authored SVG/React figure from
`app/lectures/_components/diagrams/` when `diagram` is set. Default: no
`imageSrc`. Do not crop Google Slides into slide figures.

`LECTURE_DIAGRAM_IDS` in `lib/lectures/types.ts` is the catalog of
diagrams and product-UI mocks (browser chrome + key labels, not
screenshots). Live React demos stay on `embed` (User card, Welcome
heading, Lab 1 stub, Link nav).

Original export counts (full `slide-NN.png` files remain even when unused):

- intro-to-web-development (17)
- installing-nodejs (16)
- creating-a-nextjs-react-application (27)
- commit-to-github (7)
- deploying-to-vercel (17)

Index thumbnails use `LECTURE_DECK_THUMBNAILS` — distinctive mid-deck
figures, never `slide-01.png` (the shared WEB DEV title). Do not nest
these assets under `/book`.

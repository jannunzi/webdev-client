# Lecture slide assets

PNG exports from classroom Google Slides. These are **supporting
diagrams and UI screenshots**, not the slides themselves.

Decks live in `lib/lectures/decks/*.ts` as authored TypeScript — titles,
bullets, code blocks, and room for React embeds / book links. The catalog
attaches a PNG only when `{slug, slideId}` is on the allowlist in
`lib/lectures/types.ts` (`LECTURE_SLIDE_IMAGE_ALLOWLIST`). Default: no
`imageSrc`. The shell always renders the authored slide; an image, if
present, is a figure under the text.

Allowlisted figures are `slide-NN-figure.png`: the original export with
the top title band cropped so the Google Slides heading is not repeated
next to the authored title.

Original export counts (full `slide-NN.png` files remain even when unused):

- intro-to-web-development (17)
- installing-nodejs (16)
- creating-a-nextjs-react-application (27)
- commit-to-github (7)
- deploying-to-vercel (17)

Index thumbnails use `LECTURE_DECK_THUMBNAILS` — distinctive mid-deck
figures, never `slide-01.png` (the shared WEB DEV title). Do not nest
these assets under `/book`.

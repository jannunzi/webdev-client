# Lecture slide assets

PNG exports from Fall 2026 Google Slides. These are **supporting
diagrams and UI screenshots**, not the slides themselves.

Decks live in `lib/lectures/decks/*.ts` as authored TypeScript — titles,
bullets, code blocks, and room for React embeds / book links. The catalog
attaches a PNG only when `{slug, slideId}` is on the allowlist in
`lib/lectures/types.ts` (`LECTURE_SLIDE_IMAGE_ALLOWLIST`). Default: no
`imageSrc`. The shell always renders the authored slide; an image, if
present, is a figure under the text.

Original export counts (files remain in this folder even when unused):

- intro-to-web-development (17)
- installing-nodejs (16)
- creating-a-nextjs-react-application (27)
- commit-to-github (7)
- deploying-to-vercel (17)

Index thumbnails use `LECTURE_DECK_THUMBNAILS` — distinctive mid-deck
diagrams, never `slide-01.png` (the shared WEB DEV title). Do not nest
these assets under `/book`.

# Lecture slide assets

PNG exports from Fall 2026 Google Slides (one image per original slide).
The deck shell reads `LectureSlide.imageSrc` from `/lectures/<slug>/slide-NN.png`.

Original export counts:

- intro-to-web-development (17)
- installing-nodejs (16)
- creating-a-nextjs-react-application (27)
- commit-to-github (7)
- deploying-to-vercel (17)

The catalog sets `imageSrc` on every slide (`/lectures/<slug>/slide-NN.png`).
Most decks map 1-based index → `slide-NN.png`. Intro / Vercel / the last
Next.js slides remap so drawings land on the matching original export
(SSR `slide-09`, CSR `slide-11`, office hours `slide-17`).

A missing file shows a dashed “not in the repo yet” frame. Do not nest
these under `/book`.

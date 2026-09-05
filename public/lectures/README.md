# Lecture slide assets

PNG exports from Fall 2026 Google Slides (one image per original slide).
The deck shell reads `LectureSlide.imageSrc` from `/lectures/<slug>/slide-NN.png`.

Original export counts:

- intro-to-web-development (17)
- installing-nodejs (16)
- creating-a-nextjs-react-application (27)
- commit-to-github (7)
- deploying-to-vercel (17)

Lecture 1 intro currently wires the diagram-heavy slides:

| Slide id | File |
| --- | --- |
| `network-of-networks` | `public/lectures/intro-to-web-development/slide-05.png` |
| `client-server` | `public/lectures/intro-to-web-development/slide-06.png` |
| `ssr` | `public/lectures/intro-to-web-development/slide-09.png` |
| `csr` | `public/lectures/intro-to-web-development/slide-11.png` |

Set `imageAlt` when the drawing needs a short description. A missing file
shows a dashed “not in the repo yet” frame. Do not nest these under `/book`.

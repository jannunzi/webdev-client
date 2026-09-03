# web-dev-client

Next.js client for CS 4550 / CS 5610 Web Development. Students build **Kambaz**, a Canvas-inspired LMS UI, in this repo. The sibling Express API is **web-dev-server** (nested here as a convenience copy; assignments still treat it as its own GitHub repository).

The course homepage (`/`) redirects to `/syllabus`. Kambaz stays on its existing routes (`/account/signin`, `/dashboard`, `/courses/…`).

This project was bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to the syllabus. Kambaz is at [http://localhost:3000/account/signin](http://localhost:3000/account/signin).

For Lab 5–6 LiveDemos, run the Express sibling in a second terminal:

```bash
cd web-dev-server
npm install
npm run dev
```

Or from this repo root: `npm run server:dev`.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

## Deploy on Vercel

The easiest way to deploy the Next.js app is the [Vercel Platform](https://vercel.com/new). Deploy **web-dev-server** separately (Render or Heroku) and point `NEXT_PUBLIC_HTTP_SERVER` at that origin.

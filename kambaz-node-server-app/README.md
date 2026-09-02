# kambaz-node-server-app

Sibling **Node.js / Express** HTTP server for Chapter 5 of *Developing Full Stack Next.js Web Applications*.

This folder is **not** part of the Next.js app source tree. Students treat it as its own project: `git init`, push to a **separate** public GitHub repository named `kambaz-node-server-app`, and deploy that repo to Render (or Heroku). This monorepo copy exists so the interactive book and Lab 5 LiveDemos can call `http://localhost:4000` locally.

## Run locally (with the Next.js app)

From the Next.js repo root:

```bash
npm run server:dev
```

Or from this folder:

```bash
npm install
npm run dev
```

The server listens on **port 4000** (`PORT` overrides). In a second terminal run `npm run dev` for Next.js (port 3000).

Set `NEXT_PUBLIC_HTTP_SERVER=http://localhost:4000` in the Next.js `.env.development` (the book helper defaults to that origin if the var is omitted).

## Check

- http://localhost:4000 — Welcome to Full Stack Development!
- http://localhost:4000/hello — Life is good!
- http://localhost:4000/lab5/welcome — Welcome to Lab 5
- http://localhost:4000/api/courses — JSON course list

## Production

See Chapter 5.5 in the book. Render env: `SERVER_ENV=production`, `CLIENT_URL` (Vercel origin, no trailing slash), `SERVER_URL` (Render host without `https://`), `SESSION_SECRET`. On Vercel set `NEXT_PUBLIC_HTTP_SERVER` to the Render origin with `https://` and no trailing slash.

No MongoDB here — that is Chapter 6.

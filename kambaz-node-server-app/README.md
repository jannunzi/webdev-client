# kambaz-node-server-app

Sibling **Node.js / Express** HTTP server for Chapter 5.

This is its **own project** — not Next.js app source. In this interactive-book
repo the folder sits at the **root next to** `app/`, `package.json`, and the
rest of `kambaz-next-js` so Lab 5 LiveDemos can call `http://localhost:4000`.
That is a convenience copy. For the assignment, treat it as a **separate Git
repository**:

```bash
cd kambaz-node-server-app
git init
# push to a public GitHub repo named kambaz-node-server-app (branch a5)
```

Do **not** nest this server inside `app/` or submit it only as files inside
the Next.js tree.

## Run locally (required for Lab 5 / book LiveDemos)

Render is **not** required locally. Two terminals:

```bash
# terminal 1 — Next.js (repo root)
npm run dev

# terminal 2 — this folder
cd kambaz-node-server-app
npm install
npm run dev          # nodemon index.js
# or: npm start      # node index.js
```

Listens on **port 4000**. In the Next.js app set
`NEXT_PUBLIC_HTTP_SERVER=http://localhost:4000` (the book helper defaults to
that origin if the var is omitted).

Shortcut from the Next.js root in this monorepo only: `npm run server:dev`.

## Check

- http://localhost:4000 — Welcome to Full Stack Development!
- http://localhost:4000/hello — Life is good!
- http://localhost:4000/lab5/welcome — Welcome to Lab 5
- http://localhost:4000/api/courses — JSON course list

## Later (Chapter 5.5, not needed for demos)

Deploy **this** GitHub repo to Render (or Heroku). Point Vercel
`NEXT_PUBLIC_HTTP_SERVER` at that origin. No MongoDB here — that is Chapter 6.

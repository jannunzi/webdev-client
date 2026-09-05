import type { LectureSlide } from "../types";

export const COMMIT_TO_GITHUB_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "Commit to GitHub",
    kind: "title",
    bullets: [
      "Lecture 1 · Deck 4 — Git on your machine, a repo on github.com",
      "Your username will differ from the instructor’s — that is expected",
    ],
  },
  {
    id: "install-git",
    title: "Install Git",
    kind: "content",
    bullets: [
      "**macOS**: Terminal already has `git` on recent systems. Confirm with `git --version`",
      "If missing: install Xcode Command Line Tools (`xcode-select --install`) or Git from git-scm.com",
      "**Windows**: download Git from [git-scm.com](https://git-scm.com/). Use Git Bash or PowerShell",
      "Optional GUI: **SourceTree** (or GitHub Desktop). This course demos the terminal so everyone shares the same commands",
      "You need Git **before** the GitHub website can receive your project",
    ],
    interactiveHint:
      "If `git` is not found, install it and open a **new** terminal. Then `git --version` again.",
  },
  {
    id: "gitignore",
    title: ".gitignore must ignore node_modules",
    kind: "content",
    bullets: [
      "`create-next-app` already wrote a `.gitignore`. Open it before the first commit",
      "`node_modules/` **must** be listed. It is huge and `npm install` can recreate it",
      "Never commit secrets or the Next.js build output",
      "If `node_modules` appears in `git status`, stop and fix `.gitignore` before `git add .`",
    ],
    code: `node_modules/
.next/
.env*.local
*.log
.idea/
.DS_Store`,
    codeLanguage: "text",
    codeFile: ".gitignore",
    interactiveHint:
      "Run `git status`. If you see thousands of files under `node_modules`, do not add or commit yet.",
  },
  {
    id: "create-repo",
    title: "Create the repo on GitHub.com",
    kind: "demo",
    bullets: [
      "Sign in at **github.com** — use your personal GitHub account, **not** a school GitLab / Bitbucket unless the staff say so",
      "New repository. Name it `kambaz-next-js` or `webdev-client` (match your folder)",
      "Public. **Do not** add a README, `.gitignore`, or license if the project already exists on disk (empty repo)",
      "Copy the HTTPS URL: `https://github.com/<your-username>/kambaz-next-js.git`",
      "`<your-username>` is yours. Do not paste the instructor’s username",
    ],
  },
  {
    id: "empty-repo-commands",
    title: "Empty-repo starter commands (GitHub)",
    kind: "content",
    bullets: [
      "GitHub shows a “…or push an existing repository” block. That is us",
      "Usernames differ — use yours",
      "If you created the GitHub repo **with** a README, you will need to pull --rebase first. Prefer an empty repo",
    ],
    code: `git remote add origin https://github.com/<your-username>/kambaz-next-js.git
git branch -M main
git push -u origin main`,
    codeLanguage: "bash",
  },
  {
    id: "from-project",
    title: "From the project folder",
    kind: "demo",
    bullets: [
      "`cd` into `kambaz-next-js` (or `webdev-client`) first",
    ],
    code: `git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/<your-username>/kambaz-next-js.git
git push -u origin main`,
    codeLanguage: "bash",
    interactiveHint:
      "HTTPS push asks for a password: GitHub wants a **Personal Access Token**, not your account password. Keep the token private.",
  },
  {
    id: "naming-and-next",
    title: "kambaz — then deploy",
    kind: "title",
    bullets: [
      "Spell the app **kambaz** — the course name for the LMS prototype",
      "Confirm GitHub shows your source (and not `node_modules`)",
      "Deck 5: import that same GitHub repo into **Vercel** (not Netlify) and share the URL",
    ],
  },
];

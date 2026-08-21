---
description: Make and deploy changes to ruffleskerman.com (Astro site auto-deployed to Vercel on push to main). Use whenever the user proposes any code or content change to this repo — edit on main (or a branch if asked), verify it builds cleanly, summarize the change, and get explicit confirmation before pushing.
---

# Editing & deploying ruffleskerman.com

This repo is an Astro site deployed on Vercel. **Any push to `main` on GitHub triggers an automatic production deploy** — treat that push as the point of no return, not the commit.

## Workflow

1. **Branch**: Work directly on `main` unless the user explicitly asks for a branch. If a branch is requested, first make sure `main` is up to date (`git pull`), then branch off it with a descriptive name.

2. **Make the change**: Edit only what's needed for the request. Don't bundle in unrelated refactors or cleanup.

3. **Verify it will deploy correctly**. Vercel builds with `npm run build` (see `vercel.json`), so that's the real gate — reproduce it locally before saying a change is ready:
   - `npm run lint` — ESLint
   - `npm run build` — Astro build; this is exactly what Vercel runs, so a failure here means production breaks
   - For changes touching `.astro` files or TS/TSX types, also run `npx astro check` to catch type errors the build may not surface
   
   If lint or build fails, fix it before proposing anything to the user — don't present a broken change as ready to ship.

4. **Summarize and confirm before pushing**. Give the user:
   - A short summary of what changed and why (files touched, not a raw diff dump, unless they ask for the diff)
   - Confirmation that lint + build passed
   - The target branch (`main` or the feature branch), and if it's a branch, a note that pushing it will *not* go to production (Vercel may still spin up a preview deploy if the project is configured for that)
   
   Then explicitly ask whether to push. Treat each push as needing its own fresh go-ahead — an earlier approval in the conversation doesn't carry forward to a new change.

5. **Commit and push** only after that confirmation. Use a concise, descriptive commit message. Never force-push `main`.

## Repo specifics

- Astro 5 + React islands, Tailwind v4, `@astrojs/vercel` adapter.
- Build output is `dist/` (matches `vercel.json`'s `outputDirectory`).
- Node engine `>=18.20.8` (`.nvmrc`).
- `npm run format` (Prettier) exists but isn't required pre-push unless the diff is messy.
- If a change touches `package.json` dependencies, update `package-lock.json` via `npm install`, not by hand.
- Never commit `.env` — only `.env.example` is tracked.

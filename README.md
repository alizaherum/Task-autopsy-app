# Task Autopsy

A post-mortem procrastination tracker. Instead of just logging what you put off, it
prompts a short reflection once you finally do the task — what triggered the delay:
fear, boredom, unclear first step, overwhelm, perfectionism, low energy, or something
else? Over time it builds a personal pattern map, e.g. "you stall most on tasks with
no clear first step," which is more actionable than a plain to-do streak counter.

## How it works

- **The Pile** — add tasks you're avoiding, optionally tagged (e.g. "no clear first
  step", "high stakes", "admin"). Mark one done with "Finally did it" to trigger a
  short reflection modal.
- **History** — a log of completed tasks with the trigger you identified for each.
- **Patterns** — aggregated insights: your most common delay trigger, a breakdown of
  triggers, average delay, and per-tag patterns like "you stall most on 'admin' tasks
  due to boredom."

Sign in with just your email — no password — and your tasks sync across every device,
backed by Supabase (Postgres + Auth, with Row Level Security so each account only ever
sees its own data).

It's also an installable PWA — see [Installing on your phone](#installing-on-your-phone)
below.

## Stack

React + TypeScript + Vite + Tailwind CSS, [Supabase](https://supabase.com) for auth and
data sync (Postgres + Realtime), [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) for
the installable app manifest and service worker.

## Setup

1. Create a free project at [supabase.com](https://supabase.com).
2. In the project's SQL editor, run [`supabase/schema.sql`](./supabase/schema.sql) — it
   creates the `tasks` table, Row Level Security policies scoping each row to its owner,
   and enables Realtime so changes sync live across devices.
3. Copy `.env.example` to `.env` and fill in your project's URL and anon key (Project
   Settings → API in the Supabase dashboard):
   ```bash
   cp .env.example .env
   ```
4. Sign-in is passwordless (magic link) via Supabase's built-in email OTP — nothing
   further to configure. In Authentication → URL Configuration, make sure your deployed
   URL (and `http://localhost:5173` for local dev) is listed under Redirect URLs, or the
   sign-in link won't be able to complete.

Without a configured `.env`, the app shows a setup screen instead of a broken sign-in
form.

## Development

```bash
npm install
npm run dev      # start dev server
npm run build    # typecheck + production build
npm run lint      # oxlint
```

## Deploying

`npm run build` outputs a static site in `dist/` — deploy it to any static host. The
quickest options, both with a generous free tier and zero server to manage:

- **Vercel**: `npx vercel` from the project root (or connect the GitHub repo at
  [vercel.com/new](https://vercel.com/new) for automatic deploys on push). Add the two
  `VITE_SUPABASE_*` variables from `.env` under Project Settings → Environment Variables.
- **Netlify**: `npx netlify deploy --build` (or drag-and-drop the `dist/` folder at
  [app.netlify.com/drop](https://app.netlify.com/drop) for a one-off). Set the same env
  vars under Site configuration → Environment variables.

Either way you'll get a real `https://` URL — needed for install prompts and service
workers to work (they don't run over plain HTTP except on localhost).

## Installing on your phone

Once deployed, the app installs like a native app, no app store needed:

- **iOS (Safari)**: open the URL → Share icon → **Add to Home Screen**.
- **Android (Chrome)**: open the URL → ⋮ menu → **Install app** (or **Add to Home
  screen**). Chrome will often prompt automatically after a visit or two.

It then launches full-screen with its own icon, no browser chrome, and works offline for
already-visited screens (new data still needs a connection to sync via Supabase).

## App Store (iOS)

The app is also wrapped as a native iOS project via [Capacitor](https://capacitorjs.com)
(`capacitor.config.ts`, `ios/`) for a real App Store listing, as an alternative to the PWA
above. This requires a Mac with Xcode and an Apple Developer account — see
[`docs/ios-app-store.md`](./docs/ios-app-store.md) for the full walkthrough.

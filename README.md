# Energy-Matched Scheduler

Time-blocking assumes every hour is interchangeable. It isn't — your focus, mood, and
stamina move through the day in a pattern that's mostly consistent and mostly personal.
This app skips the hourly grid: you tag tasks by the *kind* of effort they need, log how
your energy actually feels as you go, and it learns which task type tends to fit which
slot for you specifically.

## How it works

- **Tag by cognitive load, not by hour.** Every task is `Deep` (focused, hard to
  interrupt), `Shallow` (easy, low-stakes), or `Admin` (logistics, replies, chores).
- **Log energy in one tap.** A five-point check-in (🪫 → 🔥) takes a second and quietly
  builds a personal energy-by-time-of-day curve.
- **Get a live recommendation.** The **Now** tab predicts your current energy level and
  recommends which task type best fits this exact slot, then surfaces matching tasks
  from your backlog.
- **Watch the model learn.** The **Insights** tab shows your energy heatmap across the
  day and, once you've completed a few tasks of each type, the time slot where each one
  has historically gone best for you.

## The recommendation engine

This is the interesting part, and it's intentionally simple enough to read end to end
in [`src/lib/recommend.ts`](./src/lib/recommend.ts) — no ML framework, just a small,
explainable personalization model:

1. **Energy prediction** is a kernel-weighted average over your own check-ins: each past
   check-in "votes" on the current hour, weighted by how close its time-of-day is (a
   Gaussian kernel, wrapped around the 24-hour clock) and how recent it is (an
   exponential half-life, so old data fades but never disappears).
2. **Cold start.** With no data, predictions fall back to a generic circadian curve
   (energy rises through the morning, dips after lunch, recovers in the afternoon). As
   check-ins accumulate, the estimate blends toward your personal pattern — the blend
   weight is just a confidence score derived from how much relevant data exists nearby.
3. **Task-type scoring** works the same way: each cognitive-load type gets a heuristic
   fit score against the predicted energy level (deep work wants high energy, admin
   tolerates low energy), blended with your own logged focus ratings for tasks you've
   completed in similar slots — the more you log, the more the recommendation reflects
   *your* history instead of the generic prior.

Nothing here needs a server or a training step — it recomputes from local history on
every render, which keeps the whole thing auditable and fast.

## Stack

React + TypeScript + Vite + Tailwind CSS. All data (tasks and energy check-ins) is
stored in `localStorage` — no backend, no account, no setup required.

## Development

```bash
npm install
npm run dev      # start dev server
npm run build    # typecheck + production build
npm run lint      # oxlint
```

## Deploying

`npm run build` outputs a static site in `dist/` — deploy it to any static host, no
environment variables needed:

- **Vercel**: `npx vercel` from the project root (or connect the GitHub repo at
  [vercel.com/new](https://vercel.com/new) for automatic deploys on push).
- **Netlify**: `npx netlify deploy --build` (or drag-and-drop the `dist/` folder at
  [app.netlify.com/drop](https://app.netlify.com/drop) for a one-off).

Because everything lives in `localStorage`, data stays on-device per browser — there's
no sync across devices without adding a backend.

## iOS app

The web app is also wrapped as a native iOS project via
[Capacitor](https://capacitorjs.com) (`capacitor.config.ts`, `ios/`), ready to open in
Xcode and ship to the App Store — see [`docs/ios-app-store.md`](./docs/ios-app-store.md)
for the full walkthrough (requires a Mac).

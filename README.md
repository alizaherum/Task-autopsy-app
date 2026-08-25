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

Sign in with an account and your tasks sync across every device, backed by Supabase
(Postgres + Auth, with Row Level Security so each account only ever sees its own data).

## Stack

React + TypeScript + Vite + Tailwind CSS, [Supabase](https://supabase.com) for auth and
data sync (Postgres + Realtime).

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
4. By default Supabase requires email confirmation for new sign-ups (Authentication →
   Providers → Email in the dashboard, if you want to disable that for local testing).

Without a configured `.env`, the app shows a setup screen instead of a broken sign-in
form.

## Development

```bash
npm install
npm run dev      # start dev server
npm run build    # typecheck + production build
npm run lint      # oxlint
```

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

Data is stored locally in the browser (`localStorage`) — no backend or account needed.

## Stack

React + TypeScript + Vite + Tailwind CSS.

## Development

```bash
npm install
npm run dev      # start dev server
npm run build    # typecheck + production build
npm run lint      # oxlint
```

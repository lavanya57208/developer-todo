# ⌘ DEV TODO

A personal developer command center: recurring daily coding goals, streaks, history and weekly progress.

> Complete it whenever you can. Just don't stop learning.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Notes

- Data lives in `localStorage` (key `dev-todo:v1`). Each day is stored as its own snapshot, so history never changes when a new day starts or when you edit your default tasks.
- Shortcuts: `N` add task, `1`–`5` switch views, `T` toggle theme, `Esc` close dialog.
- Reminders are optional and only fire while the page is open.

## Consistency & motivation system

All analytics live in `src/lib/analytics.ts` and are computed from the existing per-day history (`state.days`). Nothing is stored twice; the only new saved field is `reflections` (mood + note per date), which older saves pick up automatically.

- A task counts only when marked completed. Skipped tasks never count as done, and opening the app does nothing for the streak.
- Consistency score (last 30 days, or since first use): 50% task completion rate + 30% share of active days + 20% current streak (capped at 7 days).
- Calendar shades: 1 task, 2–3 tasks, 4+ tasks, every task of the day completed.

import type { AppState, DayStats, DayTask, DefaultTask } from '../types';
import { addDays } from './date';
import { uid } from './storage';

export function dayStats(tasks: DayTask[] = []): DayStats {
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const skipped = tasks.filter((t) => t.status === 'skipped').length;
  const total = tasks.length;
  return {
    total,
    completed,
    skipped,
    pending: total - completed - skipped,
    custom: tasks.filter((t) => !t.defaultId).length,
    percent: total ? Math.round((completed / total) * 100) : 0,
  };
}

export type DayLevel = 'none' | 'partial' | 'full';

/** full = something done and nothing left pending; partial = something done. */
export function dayLevel(tasks: DayTask[] = []): DayLevel {
  const s = dayStats(tasks);
  if (s.completed === 0) return 'none';
  return s.pending === 0 ? 'full' : 'partial';
}

const isActive = (tasks?: DayTask[]) => !!tasks?.some((t) => t.status === 'completed');

export interface Totals {
  current: number;
  best: number;
  totalCompleted: number;
  codingDays: number;
  dsaCompleted: number;
}

export function totals(state: AppState, today: string): Totals {
  const keys = Object.keys(state.days).filter((k) => isActive(state.days[k])).sort();
  let best = 0;
  let run = 0;
  let prev = '';
  for (const k of keys) {
    run = prev && addDays(prev, 1) === k ? run + 1 : 1;
    best = Math.max(best, run);
    prev = k;
  }
  // Current streak: today counts if active; otherwise it is still alive from yesterday.
  let cursor = isActive(state.days[today]) ? today : addDays(today, -1);
  let current = 0;
  while (isActive(state.days[cursor])) {
    current++;
    cursor = addDays(cursor, -1);
  }
  const all = Object.values(state.days).flat().filter((t) => t.status === 'completed');
  return {
    current,
    best: Math.max(best, current),
    totalCompleted: all.length,
    codingDays: keys.length,
    dsaCompleted: all.filter((t) => t.category === 'dsa').length,
  };
}

const fromDefault = (d: DefaultTask): DayTask => ({
  id: uid(),
  defaultId: d.id,
  title: d.title,
  description: d.description,
  emoji: d.emoji,
  category: d.category,
  reminder: d.reminder,
  status: 'pending',
});

/**
 * Bring one day's task list in line with the current default tasks.
 * Only ever called for *today*: past days are snapshots and never touched.
 * Anything already completed or skipped is kept as-is.
 */
export function syncDay(existing: DayTask[] = [], defaults: DefaultTask[]): DayTask[] {
  const byDefault = new Map(existing.filter((t) => t.defaultId).map((t) => [t.defaultId!, t]));
  const out: DayTask[] = [];
  for (const d of defaults) {
    const t = byDefault.get(d.id);
    byDefault.delete(d.id);
    if (!d.enabled) {
      if (t && t.status !== 'pending') out.push(t);
    } else if (!t) {
      out.push(fromDefault(d));
    } else if (t.status === 'pending' && !t.edited) {
      out.push({ ...t, title: d.title, description: d.description, emoji: d.emoji, category: d.category, reminder: d.reminder });
    } else {
      out.push(t);
    }
  }
  // Instances whose template was deleted: keep the record if something happened.
  for (const t of byDefault.values()) if (t.status !== 'pending') out.push(t);
  return [...out, ...existing.filter((t) => !t.defaultId)];
}

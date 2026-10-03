import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AppState, DayTask, DefaultTask, Reflection, TaskDraft, TaskStatus, Theme } from '../types';
import { toKey } from '../lib/date';
import { loadState, saveState, uid } from '../lib/storage';
import { dayStats, syncDay, totals } from '../lib/stats';
import { categoryOf } from '../lib/constants';

const withToday = (s: AppState, today: string, defaults = s.defaults): AppState => ({
  ...s,
  defaults,
  days: { ...s.days, [today]: syncDay(s.days[today], defaults) },
});

const draftFields = (d: TaskDraft) => ({
  title: d.title.trim(),
  description: d.description.trim(),
  emoji: d.emoji.trim() || categoryOf(d.category).emoji,
  category: d.category,
  reminder: d.reminder || undefined,
});

export function useTodoStore() {
  const [today, setToday] = useState(() => toKey(new Date()));
  const [state, setState] = useState<AppState>(() => withToday(loadState(), toKey(new Date())));

  useEffect(() => saveState(state), [state]);

  useEffect(() => {
    document.documentElement.dataset.theme = state.theme;
  }, [state.theme]);

  // Day rollover: create the new day's fresh tasks, leave yesterday untouched.
  useEffect(() => {
    const check = () => {
      const key = toKey(new Date());
      if (key !== today) {
        setToday(key);
        setState((s) => withToday(s, key));
      }
    };
    const id = window.setInterval(check, 30_000);
    document.addEventListener('visibilitychange', check);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', check);
    };
  }, [today]);

  const mutateToday = useCallback(
    (fn: (tasks: DayTask[]) => DayTask[]) => setState((s) => ({ ...s, days: { ...s.days, [today]: fn(s.days[today] ?? []) } })),
    [today],
  );
  const mutateDefaults = useCallback(
    (fn: (defaults: DefaultTask[]) => DefaultTask[]) => setState((s) => withToday(s, today, fn(s.defaults))),
    [today],
  );

  const actions = useMemo(
    () => ({
      setStatus: (id: string, status: TaskStatus) => mutateToday((ts) => ts.map((t) => (t.id === id ? { ...t, status } : t))),
      addTask: (draft: TaskDraft) => {
        if (draft.recurring) mutateDefaults((ds) => [...ds, { id: uid(), enabled: true, ...draftFields(draft) }]);
        else mutateToday((ts) => [...ts, { id: uid(), status: 'pending', ...draftFields(draft) }]);
      },
      editTask: (id: string, draft: TaskDraft) =>
        mutateToday((ts) => ts.map((t) => (t.id === id ? { ...t, ...draftFields(draft), edited: true } : t))),
      deleteTask: (id: string) => mutateToday((ts) => ts.filter((t) => t.id !== id)),
      addDefault: (draft: TaskDraft) => mutateDefaults((ds) => [...ds, { id: uid(), enabled: true, ...draftFields(draft) }]),
      updateDefault: (id: string, draft: TaskDraft) =>
        mutateDefaults((ds) => ds.map((d) => (d.id === id ? { ...d, ...draftFields(draft) } : d))),
      toggleDefault: (id: string) => mutateDefaults((ds) => ds.map((d) => (d.id === id ? { ...d, enabled: !d.enabled } : d))),
      deleteDefault: (id: string) => mutateDefaults((ds) => ds.filter((d) => d.id !== id)),
      moveDefault: (id: string, dir: -1 | 1) =>
        mutateDefaults((ds) => {
          const i = ds.findIndex((d) => d.id === id);
          const j = i + dir;
          if (i < 0 || j < 0 || j >= ds.length) return ds;
          const next = [...ds];
          [next[i], next[j]] = [next[j], next[i]];
          return next;
        }),
      setGoal: (text: string) => setState((s) => ({ ...s, goals: { ...s.goals, [today]: text } })),
      setReflection: (date: string, patch: Reflection) =>
        setState((s) => ({ ...s, reflections: { ...s.reflections, [date]: { ...s.reflections[date], ...patch } } })),
      setTheme: (theme: Theme) => setState((s) => ({ ...s, theme })),
    }),
    [mutateToday, mutateDefaults, today],
  );

  const todayTasks = state.days[today] ?? [];
  const stats = useMemo(() => dayStats(todayTasks), [todayTasks]);
  const summary = useMemo(() => totals(state, today), [state, today]);

  return { state, today, todayTasks, stats, summary, ...actions };
}

export type Store = ReturnType<typeof useTodoStore>;

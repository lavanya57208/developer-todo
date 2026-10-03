/**
 * Analytics derived purely from the existing per-day task history (`state.days`).
 * Nothing here stores or invents data: a task only counts when its status is
 * 'completed', skipped tasks never count as done, and a day with no record is a missed day.
 */
import type { AppState, Category, DayStats, DayTask } from '../types';
import { CATEGORIES } from './constants';
import { addDays, fromKey, toKey, weekOf } from './date';
import { dayStats } from './stats';

type Days = Record<string, DayTask[]>;

const isActive = (tasks?: DayTask[]) => !!tasks?.some((t) => t.status === 'completed');

export const rangeKeys = (start: string, end: string): string[] => {
  const out: string[] = [];
  for (let k = start; k <= end; k = addDays(k, 1)) out.push(k);
  return out;
};

/** First day the app has any task record for. */
export const firstRecordedDay = (days: Days): string | null =>
  Object.keys(days).filter((k) => days[k].length > 0).sort()[0] ?? null;

/** 0 none · 1 one task · 2 two–three · 3 four or more · 4 every task of the day completed */
export type HeatLevel = 0 | 1 | 2 | 3 | 4;
export function heatLevel(tasks: DayTask[] = []): HeatLevel {
  const s = dayStats(tasks);
  if (s.completed === 0) return 0;
  if (s.completed === s.total) return 4;
  if (s.completed >= 4) return 3;
  return s.completed >= 2 ? 2 : 1;
}

/** Days since the last day with a completed task, before today. null = never active. */
export function daysSinceLastActive(days: Days, today: string): number | null {
  const last = Object.keys(days).filter((k) => k < today && isActive(days[k])).sort().pop();
  return last ? Math.round((fromKey(today).getTime() - fromKey(last).getTime()) / 86400000) : null;
}

export interface DayPoint extends DayStats {
  key: string;
  recorded: boolean;
}
export const dailySeries = (days: Days, keys: string[]): DayPoint[] =>
  keys.map((key) => ({ key, recorded: !!days[key]?.length, ...dayStats(days[key]) }));

const mean = (xs: number[]) => (xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : 0);

/** Average daily completion %, counting missed days as 0% but ignoring days before the app was first used. */
export function averageCompletion(days: Days, keys: string[]): number {
  const first = firstRecordedDay(days);
  if (!first) return 0;
  return mean(dailySeries(days, keys.filter((k) => k >= first)).map((p) => p.percent));
}

export interface Consistency {
  score: number | null; // null until there is at least one day to judge
  windowDays: number;
  activeDays: number;
  missedDays: number;
  completed: number;
  skipped: number;
  total: number;
  completionRate: number; // 0–100
  activeRate: number; // 0–100
  streakRate: number; // 0–100
}

export const SCORE_WINDOW = 30;
export const SCORE_WEIGHTS = { completion: 50, active: 30, streak: 20 };

/**
 * Consistency score over the last 30 days (or since first use, if shorter):
 *   50% task completion rate + 30% share of active days + 20% current streak (capped at 7 days).
 * Today only enters the window once something is completed, so an unfinished morning doesn't drag it down.
 */
export function consistency(state: AppState, today: string, currentStreak: number): Consistency {
  const empty: Consistency = { score: null, windowDays: 0, activeDays: 0, missedDays: 0, completed: 0, skipped: 0, total: 0, completionRate: 0, activeRate: 0, streakRate: 0 };
  const first = firstRecordedDay(state.days);
  if (!first) return empty;
  const end = isActive(state.days[today]) ? today : addDays(today, -1);
  const earliest = addDays(end, -(SCORE_WINDOW - 1));
  const start = first > earliest ? first : earliest;
  if (start > end) return empty;

  const points = dailySeries(state.days, rangeKeys(start, end));
  const completed = points.reduce((n, p) => n + p.completed, 0);
  const skipped = points.reduce((n, p) => n + p.skipped, 0);
  const total = points.reduce((n, p) => n + p.total, 0);
  const activeDays = points.filter((p) => p.completed > 0).length;
  const completionRate = total ? (completed / total) * 100 : 0;
  const activeRate = (activeDays / points.length) * 100;
  const streakRate = (Math.min(currentStreak, 7) / 7) * 100;
  const score = (completionRate * SCORE_WEIGHTS.completion + activeRate * SCORE_WEIGHTS.active + streakRate * SCORE_WEIGHTS.streak) / 100;
  return {
    score: Math.round(score),
    windowDays: points.length,
    activeDays,
    missedDays: points.length - activeDays,
    completed,
    skipped,
    total,
    completionRate: Math.round(completionRate),
    activeRate: Math.round(activeRate),
    streakRate: Math.round(streakRate),
  };
}

export interface WeekSummary {
  completed: number;
  skipped: number;
  activeDays: number;
  average: number;
  message: string;
}
export function weekSummary(days: Days, today: string): WeekSummary {
  const elapsed = weekOf(today).filter((k) => k <= today);
  const points = dailySeries(days, elapsed);
  const average = averageCompletion(days, elapsed);
  return {
    completed: points.reduce((n, p) => n + p.completed, 0),
    skipped: points.reduce((n, p) => n + p.skipped, 0),
    activeDays: points.filter((p) => p.completed > 0).length,
    average,
    message:
      average > 80 ? "Excellent consistency! You're building a strong habit. 🔥"
      : average >= 60 ? 'Good progress. Keep showing up. 💪'
      : average >= 30 ? "You're moving forward. Let's make next week stronger. 🌱"
      : 'No pressure. Start small and come back tomorrow. 💜',
  };
}

export interface SkillStat {
  category: Category;
  completed: number;
  total: number;
  percent: number;
}
/** Completion rate per category across the given days (all history by default). */
export function skillProgress(days: Days, keys: string[] = Object.keys(days)): SkillStat[] {
  const all = keys.flatMap((k) => days[k] ?? []);
  return CATEGORIES.map((category) => {
    const mine = all.filter((t) => t.category === category.id);
    const completed = mine.filter((t) => t.status === 'completed').length;
    return { category, completed, total: mine.length, percent: mine.length ? Math.round((completed / mine.length) * 100) : 0 };
  }).filter((s) => s.total > 0);
}

export interface MonthOverview {
  total: number;
  completed: number;
  skipped: number;
  rate: number;
  activeDays: number;
  longestStreak: number;
  best: SkillStat | null;
}
export function monthOverview(days: Days, year: number, month: number): MonthOverview {
  const keys = rangeKeys(toKey(new Date(year, month, 1)), toKey(new Date(year, month + 1, 0)));
  const points = dailySeries(days, keys);
  let run = 0;
  let longestStreak = 0;
  for (const p of points) {
    run = p.completed > 0 ? run + 1 : 0;
    longestStreak = Math.max(longestStreak, run);
  }
  const total = points.reduce((n, p) => n + p.total, 0);
  const completed = points.reduce((n, p) => n + p.completed, 0);
  const skills = skillProgress(days, keys).filter((s) => s.completed > 0);
  skills.sort((a, b) => b.percent - a.percent || b.completed - a.completed);
  return {
    total,
    completed,
    skipped: points.reduce((n, p) => n + p.skipped, 0),
    rate: total ? Math.round((completed / total) * 100) : 0,
    activeDays: points.filter((p) => p.completed > 0).length,
    longestStreak,
    best: skills[0] ?? null,
  };
}

export const JOURNEY = ['Learning', 'Practicing', 'Building', 'Becoming'] as const;
/** Stage is earned by active days only: under 7, 7+, 30+, 90+. */
export const journeyStage = (activeDays: number) => (activeDays >= 90 ? 3 : activeDays >= 30 ? 2 : activeDays >= 7 ? 1 : 0);

export type GirlMood = 'idle' | 'calm' | 'welcome' | 'happy' | 'proud' | 'done';
export function girlState(stats: DayStats, gap: number | null, hour = new Date().getHours()): { mood: GirlMood; message: string } {
  if (stats.total > 0 && stats.pending === 0 && stats.completed > 0)
    return { mood: 'done', message: 'Mission complete! See you tomorrow, developer! 🚀' };
  if (stats.completed > 0 && stats.completed / stats.total >= 0.6)
    return { mood: 'proud', message: "Look at you! You're actually staying consistent! 🔥" };
  if (stats.completed > 0) return { mood: 'happy', message: "You're doing great! Keep going! ✨" };
  if (gap !== null && gap >= 3)
    return { mood: 'welcome', message: "Welcome back! You don't have to start perfectly. Just start again. 🌱" };
  if (stats.skipped > 0 || hour >= 17) return { mood: 'calm', message: "It's okay. Start with just one task. 💜" };
  return { mood: 'idle', message: 'Hey! Ready to code today? 💻' };
}

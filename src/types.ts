export type TaskStatus = 'pending' | 'completed' | 'skipped';
export type CategoryId = 'coding' | 'dsa' | 'development' | 'learning' | 'dbms' | 'web' | 'skills' | 'personal';
export type View = 'dashboard' | 'tasks' | 'calendar' | 'progress' | 'settings';
export type Theme = 'dark' | 'light';

export interface Category {
  id: CategoryId;
  label: string;
  emoji: string;
  /** Tailwind classes for the category chip */
  chip: string;
  /** Tailwind class for bars */
  bar: string;
}

/** A recurring task template that is materialised fresh every day. */
export interface DefaultTask {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: CategoryId;
  reminder?: string; // "HH:MM", optional
  enabled: boolean;
}

/** A task as it existed on one specific day. Days are independent snapshots. */
export interface DayTask {
  id: string;
  defaultId?: string; // set when created from a DefaultTask
  title: string;
  description: string;
  emoji: string;
  category: CategoryId;
  reminder?: string;
  status: TaskStatus;
  edited?: boolean; // edited for this day only; don't overwrite from the template
}

export interface TaskDraft {
  title: string;
  description: string;
  emoji: string;
  category: CategoryId;
  reminder: string; // '' = none
  recurring: boolean;
}

export type Mood = 'great' | 'good' | 'okay' | 'low';

/** Optional end-of-day note, stored per date next to the task history. */
export interface Reflection {
  mood?: Mood;
  note?: string;
}

export interface AppState {
  version: 1;
  defaults: DefaultTask[];
  days: Record<string, DayTask[]>; // key: YYYY-MM-DD (local)
  goals: Record<string, string>;
  reflections: Record<string, Reflection>; // key: YYYY-MM-DD
  theme: Theme;
}

export interface DayStats {
  total: number;
  completed: number;
  pending: number;
  skipped: number;
  custom: number;
  percent: number;
}

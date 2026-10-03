import type { AppState } from '../types';
import { INITIAL_DEFAULTS, STORAGE_KEY } from './constants';

const fresh = (): AppState => ({ version: 1, defaults: INITIAL_DEFAULTS, days: {}, goals: {}, reflections: {}, theme: 'dark' });

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fresh();
    const parsed = JSON.parse(raw) as Partial<AppState>;
    if (!parsed || !Array.isArray(parsed.defaults) || typeof parsed.days !== 'object') return fresh();
    return { ...fresh(), ...parsed } as AppState;
  } catch {
    return fresh(); // storage unavailable or corrupt: run in memory
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable: keep working in memory */
  }
}

export const uid = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36);

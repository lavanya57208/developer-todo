const pad = (n: number) => String(n).padStart(2, '0');

/** Local-time YYYY-MM-DD key (never UTC, so days roll over at local midnight). */
export const toKey = (d: Date): string => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const fromKey = (key: string): Date => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const addDays = (key: string, n: number): string => {
  const d = fromKey(key);
  d.setDate(d.getDate() + n);
  return toKey(d);
};

/** Monday-first week containing the given day. */
export const weekOf = (key: string): string[] => {
  const d = fromKey(key);
  const offset = (d.getDay() + 6) % 7;
  const monday = addDays(key, -offset);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
};

export const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export const weekdayName = (key: string) => fromKey(key).toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();

export const longDate = (key: string) => {
  const d = fromKey(key);
  return `${pad(d.getDate())} ${d.toLocaleDateString('en-US', { month: 'long' }).toUpperCase()} ${d.getFullYear()}`;
};

export const greeting = (now = new Date()) => {
  const h = now.getHours();
  if (h < 5) return 'Burning the midnight oil';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

export const dayOfYear = (key: string) => {
  const d = fromKey(key);
  return Math.round((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000);
};

export const formatTime = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return `${((h + 11) % 12) + 1}:${pad(m)} ${h < 12 ? 'AM' : 'PM'}`;
};

export const nowHHMM = () => {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

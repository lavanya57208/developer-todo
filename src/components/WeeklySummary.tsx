import type { DayTask } from '../types';
import { weekSummary } from '../lib/analytics';

interface Props {
  days: Record<string, DayTask[]>;
  today: string;
  currentStreak: number;
}

export default function WeeklySummary({ days, today, currentStreak }: Props) {
  const w = weekSummary(days, today);
  const rows: [string, string | number][] = [
    ['Tasks completed', w.completed],
    ['Tasks skipped', w.skipped],
    ['Active days', `${w.activeDays} / 7`],
    ['Average completion', `${w.average}%`],
    ['Current streak', `${currentStreak} ${currentStreak === 1 ? 'day' : 'days'}`],
  ];
  return (
    <section className="card flex flex-col p-5">
      <h2 className="label">This week</h2>
      <dl className="mt-4 flex flex-col gap-2.5 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-3">
            <dt className="text-muted">{k}</dt>
            <dd className="font-mono font-semibold tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 rounded-lg border border-purple/30 bg-purple/10 px-3 py-2 text-sm">{w.message}</p>
    </section>
  );
}

import type { DayTask } from '../types';
import { WEEKDAYS, weekOf } from '../lib/date';

interface Props {
  days: Record<string, DayTask[]>;
  today: string;
}

export default function WeeklyProgress({ days, today }: Props) {
  const week = weekOf(today).map((key, i) => ({
    key,
    name: WEEKDAYS[i],
    future: key > today,
    count: (days[key] ?? []).filter((t) => t.status === 'completed').length,
  }));
  const max = Math.max(1, ...week.map((d) => d.count));

  return (
    <section className="card p-5">
      <h2 className="label">Weekly progress</h2>
      <div className="mt-4 flex flex-col gap-2 font-mono text-xs">
        {week.map((d) => (
          <div key={d.key} className="flex items-center gap-3">
            <span className={`w-8 ${d.key === today ? 'text-green' : 'text-muted'}`}>{d.name}</span>
            <div className="h-3 flex-1 overflow-hidden rounded-sm bg-panel2">
              <div
                className={`h-full rounded-sm transition-all duration-500 ${d.key === today ? 'bg-green' : 'bg-cyan/70'}`}
                style={{ width: `${(d.count / max) * 100}%` }}
              />
            </div>
            <span className="w-5 text-right tabular-nums text-muted">{d.future ? '--' : d.count}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

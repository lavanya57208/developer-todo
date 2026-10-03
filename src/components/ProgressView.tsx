import type { Store } from '../hooks/useTodoStore';
import { CATEGORIES } from '../lib/constants';
import { addDays, longDate } from '../lib/date';
import { dayLevel } from '../lib/stats';
import WeeklyProgress from './WeeklyProgress';

const LEVEL = { full: 'bg-green', partial: 'bg-green/40', none: 'bg-panel2' };

export default function ProgressView({ store }: { store: Store }) {
  const { state, today, summary } = store;
  const tiles = [
    { label: 'Current streak', value: `${summary.current}d`, tone: 'text-amber' },
    { label: 'Best streak', value: `${summary.best}d`, tone: 'text-purple' },
    { label: 'Tasks completed', value: summary.totalCompleted, tone: 'text-green' },
    { label: 'Coding days', value: summary.codingDays, tone: 'text-cyan' },
    { label: 'DSA sessions done', value: summary.dsaCompleted, tone: 'text-purple' },
  ];

  const done = Object.values(state.days).flat().filter((t) => t.status === 'completed');
  const byCat = CATEGORIES.map((c) => ({ ...c, count: done.filter((t) => t.category === c.id).length })).filter((c) => c.count > 0);
  const maxCat = Math.max(1, ...byCat.map((c) => c.count));
  const last = Array.from({ length: 35 }, (_, i) => addDays(today, i - 34));

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-mono text-2xl font-bold">
        <span className="text-muted">./</span>progress
      </h1>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {tiles.map((t) => (
          <div key={t.label} className="card p-4">
            <div className={`font-mono text-2xl font-semibold tabular-nums ${t.tone}`}>{t.value}</div>
            <div className="label mt-1 !tracking-wider">{t.label}</div>
          </div>
        ))}
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-2">
        <WeeklyProgress days={state.days} today={today} />

        <section className="card p-5">
          <h2 className="label">Last 5 weeks</h2>
          <div className="mt-4 grid grid-cols-7 gap-1.5">
            {last.map((k) => (
              <div key={k} title={longDate(k)} className={`aspect-square rounded-sm ${LEVEL[dayLevel(state.days[k])]} ${k === today ? 'ring-1 ring-cyan' : ''}`} />
            ))}
          </div>
          <p className="mt-3 font-mono text-[11px] text-muted">Each square is one day. Brighter means every task was handled.</p>
        </section>

        <section className="card p-5 lg:col-span-2">
          <h2 className="label">Completed by category</h2>
          {byCat.length === 0 ? (
            <p className="mt-4 font-mono text-sm text-muted">// complete a task and it shows up here</p>
          ) : (
            <div className="mt-4 flex flex-col gap-2 font-mono text-xs">
              {byCat.map((c) => (
                <div key={c.id} className="flex items-center gap-3">
                  <span className="w-36 truncate text-muted">{c.emoji} {c.label}</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-sm bg-panel2">
                    <div className={`h-full rounded-sm ${c.bar}`} style={{ width: `${(c.count / maxCat) * 100}%` }} />
                  </div>
                  <span className="w-6 text-right tabular-nums">{c.count}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

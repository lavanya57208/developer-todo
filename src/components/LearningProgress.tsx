import { useState } from 'react';
import type { DayTask } from '../types';
import { addDays, fromKey } from '../lib/date';
import { averageCompletion, dailySeries, rangeKeys } from '../lib/analytics';

interface Props {
  days: Record<string, DayTask[]>;
  today: string;
}

const RANGES = [7, 14, 30] as const;

/** Completion % per day as bars, built from real task history only. */
export default function LearningProgress({ days, today }: Props) {
  const [range, setRange] = useState<(typeof RANGES)[number]>(7);
  const keys = rangeKeys(addDays(today, -(range - 1)), today);
  const points = dailySeries(days, keys);
  const completed = points.reduce((n, p) => n + p.completed, 0);
  const skipped = points.reduce((n, p) => n + p.skipped, 0);
  const active = points.filter((p) => p.completed > 0).length;
  const hasData = points.some((p) => p.recorded);

  const facts = [
    { label: 'Tasks completed', value: completed, tone: 'text-green' },
    { label: 'Avg completion', value: `${averageCompletion(days, keys)}%`, tone: 'text-cyan' },
    { label: 'Active days', value: `${active} / ${range}`, tone: 'text-purple' },
    { label: 'Skipped', value: skipped, tone: 'text-amber' },
  ];

  return (
    <section className="card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="label">My learning progress</h2>
          <p className="mt-1 text-xs text-muted">Share of each day&apos;s tasks you completed</p>
        </div>
        <div className="flex gap-1">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              aria-pressed={range === r}
              className={`rounded-md border px-2 py-1 font-mono text-xs transition ${range === r ? 'border-cyan/50 bg-cyan/10 text-cyan' : 'border-line text-muted hover:text-fg'}`}
            >
              {r}d
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <div className="flex h-40 flex-col justify-between text-right font-mono text-[10px] leading-none text-muted" aria-hidden="true">
          <span>100%</span>
          <span>50%</span>
          <span>0%</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="relative h-40">
            {[0, 50, 100].map((g) => (
              <div key={g} className="absolute inset-x-0 border-t border-dashed border-line" style={{ bottom: `${g}%` }} />
            ))}
            <div className={`absolute inset-0 flex items-end ${range === 30 ? 'gap-[2px]' : 'gap-1.5 sm:gap-2'}`}>
              {points.map((p) => {
                const d = fromKey(p.key);
                const title = `${d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}: ${
                  p.recorded ? `${p.completed}/${p.total} completed (${p.percent}%)${p.skipped ? `, ${p.skipped} skipped` : ''}` : 'no activity'
                }`;
                return (
                  <div key={p.key} title={title} aria-label={title} role="img" className="group relative flex h-full min-w-0 flex-1 flex-col justify-end">
                    {range !== 30 && p.completed > 0 && (
                      <span className="mb-1 text-center font-mono text-[10px] tabular-nums text-muted">{p.percent}%</span>
                    )}
                    <div
                      className={`w-full rounded-t-sm transition-all duration-500 group-hover:brightness-125 ${p.key === today ? 'bg-cyan' : 'bg-green'}`}
                      style={{ height: `${p.percent}%`, minHeight: p.completed > 0 ? 3 : 0 }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div className={`mt-1.5 flex font-mono text-[10px] text-muted ${range === 30 ? 'gap-[2px]' : 'gap-1.5 sm:gap-2'}`}>
            {points.map((p, i) => {
              const d = fromKey(p.key);
              const show = range === 7 || (range === 14 ? i % 2 === 1 : i % 5 === 4);
              return (
                <span key={p.key} className={`min-w-0 flex-1 overflow-visible whitespace-nowrap text-center ${p.key === today ? 'text-cyan' : ''}`}>
                  {show ? (range === 7 ? d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase() : d.getDate()) : ''}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {!hasData && <p className="mt-3 font-mono text-xs text-muted">// no history in this range yet. it fills in as you complete tasks</p>}

      <dl className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {facts.map((f) => (
          <div key={f.label} className="rounded-lg border border-line bg-bg px-3 py-2">
            <dd className={`font-mono text-lg font-semibold tabular-nums ${f.tone}`}>{f.value}</dd>
            <dt className="label mt-0.5 !tracking-wider">{f.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}

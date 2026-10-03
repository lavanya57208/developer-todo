import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { DayTask } from '../types';
import { fromKey } from '../lib/date';
import { monthOverview } from '../lib/analytics';

interface Props {
  days: Record<string, DayTask[]>;
  today: string;
}

export default function MonthlyOverview({ days, today }: Props) {
  const now = fromKey(today);
  const [offset, setOffset] = useState(0); // months back from the current month
  const month = new Date(now.getFullYear(), now.getMonth() - offset, 1);
  const m = monthOverview(days, month.getFullYear(), month.getMonth());

  const facts: [string, string | number][] = [
    ['Total tasks', m.total],
    ['Completed', m.completed],
    ['Skipped', m.skipped],
    ['Completion rate', `${m.rate}%`],
    ['Active days', m.activeDays],
    ['Longest streak', `${m.longestStreak}d`],
  ];

  return (
    <section className="card p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="label">Monthly overview</h2>
          <p className="mt-1 font-mono text-sm">{month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="flex gap-1">
          <button type="button" className="btn" onClick={() => setOffset(offset + 1)} aria-label="Previous month">
            <ChevronLeft size={14} />
          </button>
          <button type="button" className="btn disabled:opacity-30" disabled={offset === 0} onClick={() => setOffset(offset - 1)} aria-label="Next month">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {facts.map(([k, v]) => (
          <div key={k} className="rounded-lg border border-line bg-bg px-3 py-2">
            <dd className="font-mono text-lg font-semibold tabular-nums">{v}</dd>
            <dt className="label mt-0.5 !tracking-wider">{k}</dt>
          </div>
        ))}
      </dl>

      <p className="mt-4 text-sm">
        <span className="text-muted">🏆 Most consistent: </span>
        {m.best ? (
          <>
            {m.best.category.emoji} {m.best.category.label} <span className="font-mono text-xs text-muted">({m.best.percent}%)</span>
          </>
        ) : (
          <span className="font-mono text-xs text-muted">// nothing completed this month yet</span>
        )}
      </p>
    </section>
  );
}

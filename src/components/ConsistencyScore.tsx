import { Flame, Trophy } from 'lucide-react';
import type { Consistency } from '../lib/analytics';
import { SCORE_WEIGHTS, SCORE_WINDOW } from '../lib/analytics';
import type { Totals } from '../lib/stats';

interface Props {
  data: Consistency;
  summary: Totals;
}

export default function ConsistencyScore({ data, summary }: Props) {
  const parts = [
    { label: 'Task completion', detail: `${data.completed} of ${data.total} tasks`, rate: data.completionRate, weight: SCORE_WEIGHTS.completion, bar: 'bg-green' },
    { label: 'Active days', detail: `${data.activeDays} of ${data.windowDays} days, ${data.missedDays} missed`, rate: data.activeRate, weight: SCORE_WEIGHTS.active, bar: 'bg-cyan' },
    { label: 'Current streak', detail: `${summary.current} of 7 days`, rate: data.streakRate, weight: SCORE_WEIGHTS.streak, bar: 'bg-purple' },
  ];
  const tiles = [
    { icon: <Flame size={16} className="text-amber" />, label: 'Current streak', value: `${summary.current} ${summary.current === 1 ? 'day' : 'days'}` },
    { icon: <Trophy size={16} className="text-purple" />, label: 'Best streak', value: `${summary.best} ${summary.best === 1 ? 'day' : 'days'}` },
    { icon: <span aria-hidden="true">📅</span>, label: 'Active days', value: summary.codingDays },
    { icon: <span aria-hidden="true">✅</span>, label: 'Tasks completed', value: summary.totalCompleted },
  ];

  return (
    <section className="card p-5">
      <div className="grid gap-6 lg:grid-cols-3">
        <div>
          <h2 className="label">Consistency score</h2>
          <div className="mt-2 font-mono text-5xl font-bold tabular-nums text-green">
            {data.score === null ? '--' : data.score}
            <span className="text-2xl text-muted">%</span>
          </div>
          <p className="mt-2 text-xs text-muted">
            {data.score === null
              ? 'Complete your first task and the score starts here.'
              : `Based on your last ${data.windowDays} ${data.windowDays === 1 ? 'day' : 'days'} (up to ${SCORE_WINDOW}). Skipped tasks are not counted as done, and days with nothing completed count as missed.`}
          </p>
        </div>

        <ul className="flex flex-col justify-center gap-3 lg:col-span-2">
          {parts.map((p) => (
            <li key={p.label}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-sm">
                <span>
                  {p.label} <span className="font-mono text-[11px] text-muted">· {p.weight}% of score</span>
                </span>
                <span className="font-mono text-xs tabular-nums text-muted">
                  {p.detail} · <span className="text-fg">{p.rate}%</span>
                </span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-panel2">
                <div className={`h-full rounded-full transition-all duration-500 ${p.bar}`} style={{ width: `${p.rate}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-2 border-t border-line pt-5 lg:grid-cols-4">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-lg border border-line bg-bg px-3 py-2.5">
            <dt className="label flex items-center gap-1.5 !tracking-wider">{t.icon} {t.label}</dt>
            <dd className="mt-1 font-mono text-xl font-semibold tabular-nums">{t.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

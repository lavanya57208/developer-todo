import type { DayStats } from '../types';

const Stat = ({ label, value, tone }: { label: string; value: number; tone: string }) => (
  <div className="rounded-lg border border-line bg-bg px-3 py-2">
    <div className={`font-mono text-xl font-semibold tabular-nums ${tone}`}>{value}</div>
    <div className="label mt-0.5 !tracking-wider">{label}</div>
  </div>
);

export default function ProgressCard({ stats }: { stats: DayStats }) {
  const blocks = Math.round(stats.percent / 10);
  return (
    <section className="card p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="label">Today&apos;s progress</h2>
        <span className="font-mono text-sm text-muted">
          <span className="text-fg">{stats.completed}</span> / {stats.total} tasks completed
        </span>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-panel2" role="progressbar" aria-valuenow={stats.percent} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-gradient-to-r from-green to-cyan transition-all duration-500 ease-out" style={{ width: `${stats.percent}%` }} />
        </div>
        <span className="w-12 text-right font-mono text-lg font-semibold tabular-nums text-green">{stats.percent}%</span>
      </div>
      <div className="mt-2 font-mono text-xs text-muted" aria-hidden="true">
        [<span className="text-green">{'█'.repeat(blocks)}</span>
        {'░'.repeat(10 - blocks)}]
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Completed" value={stats.completed} tone="text-green" />
        <Stat label="Pending" value={stats.pending} tone="text-cyan" />
        <Stat label="Skipped" value={stats.skipped} tone="text-amber" />
        <Stat label="Custom" value={stats.custom} tone="text-purple" />
      </div>
    </section>
  );
}

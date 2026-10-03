import { Flame } from 'lucide-react';
import type { Totals } from '../lib/stats';

export default function StreakCard({ summary }: { summary: Totals }) {
  const { current, best, totalCompleted } = summary;
  return (
    <section className="card p-5">
      <div className="flex items-center gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg border ${current ? 'border-amber/40 bg-amber/10 text-amber' : 'border-line text-muted'}`}>
          <Flame size={24} />
        </div>
        <div>
          <div className="font-mono text-2xl font-semibold tabular-nums">
            {current} <span className="text-base font-normal text-muted">day streak</span>
          </div>
          <p className="text-xs text-muted">
            {current ? 'Complete one task a day to keep it going.' : 'Complete one task to start a streak. No pressure.'}
          </p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 font-mono text-xs">
        <div className="rounded-lg border border-line bg-bg px-3 py-2">
          <span className="text-muted">best </span>
          <span className="tabular-nums text-purple">{best}d</span>
        </div>
        <div className="rounded-lg border border-line bg-bg px-3 py-2">
          <span className="text-muted">total done </span>
          <span className="tabular-nums text-green">{totalCompleted}</span>
        </div>
      </div>
    </section>
  );
}

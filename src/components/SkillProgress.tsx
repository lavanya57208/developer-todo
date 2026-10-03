import type { DayTask } from '../types';
import { skillProgress } from '../lib/analytics';

export default function SkillProgress({ days }: { days: Record<string, DayTask[]> }) {
  const skills = skillProgress(days);
  return (
    <section className="card p-5">
      <h2 className="label">Where I&apos;m spending my time</h2>
      <p className="mt-1 text-xs text-muted">Completed out of every task that appeared, per area, across all history</p>
      {skills.length === 0 ? (
        <p className="mt-4 font-mono text-sm text-muted">// no task history yet</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {skills.map((s) => (
            <li key={s.category.id}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="min-w-0 truncate">{s.category.emoji} {s.category.label}</span>
                <span className="font-mono text-xs tabular-nums text-muted">
                  {s.completed}/{s.total} · <span className="text-fg">{s.percent}%</span>
                </span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-panel2">
                <div className={`h-full rounded-full transition-all duration-500 ${s.category.bar}`} style={{ width: `${s.percent}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

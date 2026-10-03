import { useEffect, useMemo, useRef, useState } from 'react';
import type { DayTask } from '../types';
import { fromKey, toKey } from '../lib/date';
import { heatLevel, rangeKeys } from '../lib/analytics';
import { dayStats } from '../lib/stats';

interface Props {
  days: Record<string, DayTask[]>;
  today: string;
  onSelect: (key: string) => void;
}

// Shades of the existing green accent, lightest to full.
const SHADE = ['bg-panel2', 'bg-green/25', 'bg-green/50', 'bg-green/75', 'bg-green'];
const MARK = { completed: '✅', skipped: '⏭️', pending: '▫️' };
const CELL = 'repeat(7, 0.75rem)';

export default function ConsistencyCalendar({ days, today, onSelect }: Props) {
  const year = fromKey(today).getFullYear();
  const [hovered, setHovered] = useState(today);
  const scroller = useRef<HTMLDivElement>(null);

  const { cells, months, weeks, shownUp } = useMemo(() => {
    const keys = rangeKeys(toKey(new Date(year, 0, 1)), toKey(new Date(year, 11, 31)));
    const lead = (new Date(year, 0, 1).getDay() + 6) % 7; // Monday-first
    const cells: (string | null)[] = [...Array<null>(lead).fill(null), ...keys];
    const months = keys
      .filter((k) => k.endsWith('-01'))
      .map((k) => ({ label: fromKey(k).toLocaleDateString('en-US', { month: 'short' }), col: Math.floor((lead + keys.indexOf(k)) / 7) + 1 }));
    return { cells, months, weeks: Math.ceil(cells.length / 7), shownUp: keys.filter((k) => heatLevel(days[k]) > 0).length };
  }, [year, days]);

  // On narrow screens the grid scrolls sideways inside its own box; start at today.
  useEffect(() => {
    const box = scroller.current;
    const el = box?.querySelector<HTMLElement>('[data-today="true"]');
    if (box && el) box.scrollLeft = el.offsetLeft - box.clientWidth / 2;
  }, []);

  const tasks = days[hovered] ?? [];
  const stats = dayStats(tasks);

  return (
    <section className="card p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="label">Coding consistency · {year}</h2>
        <span className="font-mono text-xs text-muted">
          <span className="text-green">{shownUp}</span> {shownUp === 1 ? 'day' : 'days'} you showed up
        </span>
      </div>

      <div ref={scroller} className="relative mt-4 overflow-x-auto pb-2">
        <div className="inline-block">
          <div className="grid gap-[3px] font-mono text-[10px] text-muted" style={{ gridTemplateColumns: `repeat(${weeks}, 0.75rem)` }}>
            {months.map((m) => (
              <span key={m.label} style={{ gridColumnStart: m.col }} className="whitespace-nowrap">
                {m.label}
              </span>
            ))}
          </div>
          <div className="mt-1 grid grid-flow-col gap-[3px]" style={{ gridTemplateRows: CELL, gridAutoColumns: '0.75rem' }}>
            {cells.map((key, i) =>
              key ? (
                <button
                  key={key}
                  type="button"
                  data-today={key === today}
                  disabled={key > today}
                  onMouseEnter={() => setHovered(key)}
                  onFocus={() => setHovered(key)}
                  onClick={() => onSelect(key)}
                  aria-label={`${fromKey(key).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}: ${dayStats(days[key]).completed} completed`}
                  className={`h-3 w-3 rounded-[3px] transition-transform hover:scale-125 focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan disabled:opacity-40 disabled:hover:scale-100 ${
                    SHADE[key > today ? 0 : heatLevel(days[key])]
                  } ${key === today ? 'ring-1 ring-cyan' : ''}`}
                />
              ) : (
                <span key={`b${i}`} />
              ),
            )}
          </div>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 font-mono text-[10px] text-muted">
          none
          {SHADE.map((s, i) => (
            <span key={s} title={['No activity', '1 task', '2–3 tasks', '4+ tasks', 'All tasks completed'][i]} className={`h-3 w-3 rounded-[3px] ${s}`} />
          ))}
          all tasks
        </div>
        <span className="font-mono text-[10px] text-muted">hover a day for details · click to open its history</span>
      </div>

      <div className="mt-4 rounded-lg border border-line bg-bg p-3 font-mono text-xs" aria-live="polite">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-fg">{fromKey(hovered).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          {tasks.length > 0 && (
            <span className="text-muted">
              <span className="text-green">{stats.completed} / {stats.total}</span> tasks completed · {stats.percent}% completed
            </span>
          )}
        </div>
        {tasks.length === 0 ? (
          <p className="mt-1 text-muted">// no activity recorded</p>
        ) : (
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-muted">
            {tasks.map((t) => (
              <li key={t.id} className={t.status === 'completed' ? 'text-fg' : ''}>
                {t.title} {MARK[t.status]}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

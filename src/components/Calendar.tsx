import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { TaskStatus } from '../types';
import type { Store } from '../hooks/useTodoStore';
import DailyReflection from './DailyReflection';
import { WEEKDAYS, fromKey, longDate, toKey, weekdayName } from '../lib/date';
import { dayLevel, dayStats } from '../lib/stats';
import TaskList from './TaskList';

interface Props {
  store: Store;
  /** Day to open on, e.g. when coming from the consistency calendar. */
  initial?: string;
}

const DOT = { full: 'bg-green', partial: 'bg-amber', none: 'bg-muted/40' };
const GROUPS: { status: TaskStatus; label: string; tone: string }[] = [
  { status: 'completed', label: 'Completed', tone: 'text-green' },
  { status: 'skipped', label: 'Skipped', tone: 'text-amber' },
  { status: 'pending', label: 'Pending', tone: 'text-cyan' },
];

export default function Calendar({ store, initial }: Props) {
  const { today } = store;
  const { days, reflections } = store.state;
  const [selected, setSelected] = useState(initial ?? today);
  const [cursor, setCursor] = useState(() => {
    const d = fromKey(initial ?? today);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const lead = (cursor.getDay() + 6) % 7;
  const count = new Date(year, month + 1, 0).getDate();
  const cells: (string | null)[] = [
    ...Array<null>(lead).fill(null),
    ...Array.from({ length: count }, (_, i) => toKey(new Date(year, month, i + 1))),
  ];
  const shift = (n: number) => setCursor(new Date(year, month + n, 1));

  const tasks = days[selected] ?? [];
  const stats = dayStats(tasks);

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-mono text-2xl font-bold">
        <span className="text-muted">./</span>calendar
      </h1>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <section className="card p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <button type="button" className="btn" onClick={() => shift(-1)} aria-label="Previous month">
              <ChevronLeft size={14} />
            </button>
            <span className="font-mono text-sm uppercase tracking-widest">
              {cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button type="button" className="btn" onClick={() => shift(1)} aria-label="Next month">
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-1 text-center">
            {WEEKDAYS.map((w) => (
              <div key={w} className="label py-1 !tracking-normal">
                {w}
              </div>
            ))}
            {cells.map((key, i) =>
              key ? (
                <button
                  key={key}
                  type="button"
                  disabled={key > today}
                  onClick={() => setSelected(key)}
                  aria-pressed={selected === key}
                  aria-label={longDate(key)}
                  className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-md border font-mono text-sm tabular-nums transition disabled:opacity-30 ${
                    selected === key ? 'border-cyan bg-cyan/10 text-cyan' : key === today ? 'border-green/50 text-green' : 'border-transparent hover:bg-panel2'
                  }`}
                >
                  {Number(key.slice(8))}
                  <span className={`h-1.5 w-1.5 rounded-full ${key > today ? 'bg-transparent' : DOT[dayLevel(days[key])]}`} />
                </button>
              ) : (
                <span key={`e${i}`} />
              ),
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-4 border-t border-line pt-3 font-mono text-[11px] text-muted">
            <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-green" /> completed day</span>
            <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-amber" /> partially completed</span>
            <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-muted/40" /> no activity</span>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div>
            <p className="label">{selected === today ? 'Today' : weekdayName(selected)}</p>
            <p className="font-mono text-lg">{longDate(selected)}</p>
            <p className="mt-1 font-mono text-xs text-muted">
              {stats.completed} completed · {stats.skipped} skipped · {stats.pending} pending · {stats.custom} custom
            </p>
          </div>
          {tasks.length === 0 ? (
            <p className="card border-dashed p-6 text-center font-mono text-sm text-muted">// no record for this day</p>
          ) : (
            GROUPS.map((g) => {
              const list = tasks.filter((t) => t.status === g.status);
              return list.length ? (
                <div key={g.status} className="flex flex-col gap-2">
                  <h2 className={`font-mono text-xs ${g.tone}`}>
                    {g.label} ({list.length})
                  </h2>
                  <TaskList tasks={list} readOnly />
                </div>
              ) : null;
            })
          )}
          <DailyReflection
            key={selected}
            date={selected}
            heading={selected === today ? 'How was today?' : 'How was this day?'}
            value={reflections[selected]}
            onChange={(patch) => store.setReflection(selected, patch)}
          />
        </section>
      </div>
    </div>
  );
}

import type { Mood, Reflection } from '../types';

export const MOODS: { id: Mood; emoji: string; label: string }[] = [
  { id: 'great', emoji: '😀', label: 'Great' },
  { id: 'good', emoji: '🙂', label: 'Good' },
  { id: 'okay', emoji: '😐', label: 'Okay' },
  { id: 'low', emoji: '😔', label: 'Not productive' },
];

interface Props {
  date: string;
  heading: string;
  value?: Reflection;
  onChange: (patch: Reflection) => void;
}

/** Optional mood + short note stored with the date. Never required. */
export default function DailyReflection({ date, heading, value, onChange }: Props) {
  return (
    <section className="card p-5">
      <h2 className="label">{heading} <span className="normal-case tracking-normal">· optional</span></h2>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {MOODS.map((m) => {
          const on = value?.mood === m.id;
          return (
            <button
              key={m.id}
              type="button"
              aria-pressed={on}
              onClick={() => onChange({ mood: on ? undefined : m.id })}
              className={`rounded-md border px-2 py-1 text-xs transition ${on ? 'border-purple/50 bg-purple/10 text-fg' : 'border-line text-muted hover:text-fg'}`}
            >
              {m.emoji} {m.label}
            </button>
          );
        })}
      </div>
      <input
        id={`reflection-note-${date}`}
        className="input mt-3"
        maxLength={200}
        placeholder="Today I solved 3 LeetCode problems."
        aria-label="Short note about the day"
        value={value?.note ?? ''}
        onChange={(e) => onChange({ note: e.target.value })}
      />
    </section>
  );
}

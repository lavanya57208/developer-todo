import type { DayStats } from '../types';
import { JOURNEY, girlState, journeyStage } from '../lib/analytics';
import DevGirl from './DevGirl';

interface Props {
  stats: DayStats;
  /** Days since the last productive day (null if there has never been one). */
  gap: number | null;
  activeDays: number;
}

/** The developer girl with her message, plus "The Girl I'm Becoming" journey line. */
export default function JourneyCard({ stats, gap, activeDays }: Props) {
  const { mood, message } = girlState(stats, gap);
  const stage = journeyStage(activeDays);

  return (
    <section className="card overflow-hidden">
      <div className="flex items-end gap-3 bg-gradient-to-b from-purple/10 to-transparent px-4 pt-4">
        <DevGirl mood={mood} pulse={stats.completed} className="h-28 w-auto shrink-0" />
        <p key={message} className="animate-fade-up mb-5 min-w-0 flex-1 rounded-lg rounded-bl-none border border-line bg-bg px-3 py-2 text-sm leading-snug" aria-live="polite">
          {message}
        </p>
      </div>

      <div className="border-t border-line p-5">
        <h2 className="font-mono text-sm font-semibold text-purple">The Girl I&apos;m Becoming</h2>
        <p className="mt-1 text-sm text-muted">Every small task is building the version of me I want to become.</p>

        <ol className="mt-4 flex flex-wrap items-center gap-x-1.5 gap-y-1 font-mono text-xs">
          {JOURNEY.map((name, i) => (
            <li key={name} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-muted" aria-hidden="true">→</span>}
              <span
                aria-current={i === stage ? 'step' : undefined}
                className={i === stage ? 'rounded border border-green/40 bg-green/10 px-1.5 py-0.5 text-green' : i < stage ? 'text-fg' : 'text-muted'}
              >
                {name}
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-2 font-mono text-[11px] text-muted">
          {activeDays} active {activeDays === 1 ? 'day' : 'days'} so far · stages at 7, 30 and 90
        </p>
      </div>
    </section>
  );
}

import { QUOTES } from '../lib/constants';
import { dayOfYear } from '../lib/date';

export default function MotivationCard({ today }: { today: string }) {
  const quote = QUOTES[dayOfYear(today) % QUOTES.length];
  return (
    <section className="card overflow-hidden">
      <div className="flex items-center gap-1.5 border-b border-line bg-panel2 px-4 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-green/70" />
        <span className="ml-2 font-mono text-[11px] text-muted">~/motivation</span>
      </div>
      <p className="break-words p-5 font-mono text-sm leading-relaxed text-green">
        <span className="text-purple">❯</span> {quote}
        <span className="cursor-blink ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-green/80" />
      </p>
    </section>
  );
}

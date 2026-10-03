import { useMemo } from 'react';

const COLORS = ['bg-green', 'bg-cyan', 'bg-purple', 'bg-amber'];

/** A short, subtle burst shown once when every task for the day is handled. */
export default function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        color: COLORS[i % COLORS.length],
        size: 5 + Math.random() * 5,
      })),
    [],
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          className={`confetti-piece absolute top-0 rounded-sm ${p.color}`}
          style={{ left: `${p.left}%`, width: p.size, height: p.size * 1.6, animationDelay: `${p.delay}s` }}
        />
      ))}
    </div>
  );
}

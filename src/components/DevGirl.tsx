import type { GirlMood } from '../lib/analytics';

interface Props {
  mood: GirlMood;
  /** Changes whenever a task is completed, which replays the little hop. */
  pulse: number;
  className?: string;
}

const HAIR = '#3d2f63';
const SKIN = '#f4cfb2';

/** A small developer at her laptop. Pure inline SVG, animated with CSS transforms only. */
export default function DevGirl({ mood, pulse, className = 'h-32 w-auto' }: Props) {
  const cheerful = mood === 'happy' || mood === 'proud' || mood === 'done';
  return (
    <svg viewBox="0 0 160 128" className={className} role="img" aria-label="A developer girl coding on her laptop">
      <ellipse cx="80" cy="121" rx="60" ry="4" className="fill-line" opacity="0.6" />

      <g key={pulse} className={`girl-part ${pulse > 0 ? 'girl-hop' : ''}`}>
        <g className="girl-part girl-bob">
          {/* hair behind, hoodie, neck */}
          <path d="M55 54 C53 24 107 24 105 54 L109 90 C98 97 62 97 51 90 Z" fill={HAIR} />
          <path d="M38 121 C38 96 55 84 80 84 C105 84 122 96 122 121 Z" className="fill-purple" />
          <path d="M68 86 Q80 96 92 86" fill="none" className="stroke-bg" strokeWidth="1.5" opacity="0.35" />
          <rect x="75" y="72" width="10" height="14" rx="4" fill={SKIN} />
          {/* head, fringe, bun */}
          <ellipse cx="80" cy="56" rx="21" ry="20" fill={SKIN} />
          <path d="M59 56 C57 33 103 33 101 56 C95 46 88 43 81 46 C72 43 65 47 59 56 Z" fill={HAIR} />
          <circle cx="80" cy="29" r="8" fill={HAIR} />
          <rect x="74" y="34" width="12" height="3" rx="1.5" className="fill-cyan" />
          {/* glasses */}
          <g fill="none" className="stroke-cyan" strokeWidth="1.2" opacity="0.85">
            <circle cx="72" cy="59" r="6" />
            <circle cx="88" cy="59" r="6" />
            <path d="M78 59 h4" />
          </g>
          {/* eyes */}
          {cheerful ? (
            <g fill="none" stroke={HAIR} strokeWidth="1.8" strokeLinecap="round">
              <path d="M69 60 q3 -4 6 0" />
              <path d="M85 60 q3 -4 6 0" />
            </g>
          ) : (
            <g fill={HAIR}>
              <ellipse cx="72" cy="59" rx="2" ry="2.6" className="girl-part girl-blink" />
              <ellipse cx="88" cy="59" rx="2" ry="2.6" className="girl-part girl-blink" />
            </g>
          )}
          <circle cx="66" cy="66" r="3" className="fill-red" opacity="0.28" />
          <circle cx="94" cy="66" r="3" className="fill-red" opacity="0.28" />
          {cheerful ? (
            <path d="M75 67 q5 6 10 0 z" fill="#b4505f" />
          ) : (
            <path d="M76 68 q4 3 8 0" fill="none" stroke="#b4505f" strokeWidth="1.5" strokeLinecap="round" />
          )}
        </g>
      </g>

      {/* laptop */}
      <path d="M54 119 L57 90 a3 3 0 0 1 3 -3 h40 a3 3 0 0 1 3 3 L106 119 Z" className="fill-panel2 stroke-line" strokeWidth="1" />
      <text x="80" y="108" textAnchor="middle" fontSize="11" fontWeight="700" className="girl-glow fill-green font-mono">
        &lt;/&gt;
      </text>
      <rect x="42" y="118" width="76" height="4" rx="2" className="fill-line" />
      {/* typing hands */}
      <circle cx="49" cy="115" r="4" fill={SKIN} className="girl-part girl-type" />
      <circle cx="111" cy="115" r="4" fill={SKIN} className="girl-part girl-type" style={{ animationDelay: '0.22s' }} />

      {/* mood accents */}
      {cheerful && (
        <g className="fill-amber font-mono" fontSize="12">
          <text x="24" y="40" className="girl-part girl-twinkle">✦</text>
          <text x="128" y="30" className="girl-part girl-twinkle fill-cyan" style={{ animationDelay: '0.6s' }}>✦</text>
          {mood !== 'happy' && <text x="134" y="66" fontSize="9" className="girl-part girl-twinkle" style={{ animationDelay: '1.1s' }}>✦</text>}
          {mood === 'done' && <text x="18" y="72" fontSize="9" className="girl-part girl-twinkle fill-green" style={{ animationDelay: '0.3s' }}>✦</text>}
        </g>
      )}
      {(mood === 'calm' || mood === 'welcome') && (
        <text x="126" y="38" fontSize="12" className="girl-part girl-twinkle fill-purple">♥</text>
      )}
      {mood === 'idle' && (
        <text x="124" y="40" fontSize="10" className="girl-part girl-twinkle fill-cyan font-mono">{'{ }'}</text>
      )}
    </svg>
  );
}

import { BarChart3, CalendarDays, LayoutDashboard, ListTodo, Moon, Settings as SettingsIcon, Sun } from 'lucide-react';
import type { Theme, View } from '../types';

export const NAV: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tasks', label: 'Tasks', icon: ListTodo },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'progress', label: 'Progress', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

interface Props {
  view: View;
  theme: Theme;
  onView: (v: View) => void;
  onTheme: () => void;
}

export default function Sidebar({ view, theme, onView, onTheme }: Props) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 flex-col border-r border-line bg-panel/80 backdrop-blur md:flex">
        <div className="px-5 py-6 font-mono text-sm font-semibold tracking-widest">
          <span className="text-green">⌘</span> DEV TODO
          <div className="mt-1 text-[11px] font-normal tracking-normal text-muted">&lt;/&gt; command center</div>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {NAV.map((n, i) => (
            <button
              key={n.id}
              type="button"
              onClick={() => onView(n.id)}
              aria-current={view === n.id ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan/60 ${
                view === n.id ? 'bg-green/10 text-green' : 'text-muted hover:bg-panel2 hover:text-fg'
              }`}
            >
              <n.icon size={16} />
              <span className="flex-1 text-left">{n.label}</span>
              <kbd className="font-mono text-[10px] opacity-50">{i + 1}</kbd>
            </button>
          ))}
        </nav>
        <div className="border-t border-line p-3">
          <button type="button" onClick={onTheme} className="btn btn-ghost w-full justify-start">
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />} {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-panel/95 backdrop-blur md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {NAV.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => onView(n.id)}
            aria-current={view === n.id ? 'page' : undefined}
            className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] ${view === n.id ? 'text-green' : 'text-muted'}`}
          >
            <n.icon size={18} />
            {n.label}
          </button>
        ))}
      </nav>
    </>
  );
}

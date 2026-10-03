import { Moon, Sun } from 'lucide-react';
import type { DefaultTask } from '../types';
import type { Store } from '../hooks/useTodoStore';
import DefaultTaskManager from './DefaultTaskManager';

interface Props {
  store: Store;
  onAddDefault: () => void;
  onEditDefault: (task: DefaultTask) => void;
}

const SHORTCUTS: [string, string][] = [
  ['N', 'Add a task'],
  ['1 – 5', 'Switch section'],
  ['T', 'Toggle dark / light'],
  ['Esc', 'Close dialog'],
];

export default function Settings({ store, onAddDefault, onEditDefault }: Props) {
  const theme = store.state.theme;
  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-mono text-2xl font-bold">
        <span className="text-muted">./</span>settings
      </h1>

      <DefaultTaskManager store={store} onAdd={onAddDefault} onEdit={onEditDefault} />

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="card p-5">
          <h2 className="label">Appearance</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {(['dark', 'light'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => store.setTheme(t)}
                aria-pressed={theme === t}
                className={`btn justify-center capitalize ${theme === t ? 'border-cyan/50 bg-cyan/10 text-cyan' : ''}`}
              >
                {t === 'dark' ? <Moon size={14} /> : <Sun size={14} />} {t}
              </button>
            ))}
          </div>
        </section>

        <section className="card p-5">
          <h2 className="label">Keyboard shortcuts</h2>
          <dl className="mt-3 flex flex-col gap-2 text-sm">
            {SHORTCUTS.map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-3">
                <dt className="text-muted">{v}</dt>
                <dd><kbd className="rounded border border-line bg-bg px-1.5 py-0.5 font-mono text-xs">{k}</kbd></dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <p className="font-mono text-xs text-muted">// Your data is saved in this browser. Reminders are optional and only fire while this page is open.</p>
    </div>
  );
}

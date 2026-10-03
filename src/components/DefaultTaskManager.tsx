import { useState } from 'react';
import { ArrowDown, ArrowUp, Bell, Eye, EyeOff, Pencil, Plus, Trash2 } from 'lucide-react';
import type { DefaultTask } from '../types';
import type { Store } from '../hooks/useTodoStore';
import { categoryOf } from '../lib/constants';
import { formatTime } from '../lib/date';

interface Props {
  store: Store;
  onAdd: () => void;
  onEdit: (task: DefaultTask) => void;
}

const iconBtn = 'rounded p-1.5 text-muted hover:bg-panel2 hover:text-fg disabled:opacity-25 disabled:hover:bg-transparent';

export default function DefaultTaskManager({ store, onAdd, onEdit }: Props) {
  const [confirming, setConfirming] = useState<string | null>(null);
  const defaults = store.state.defaults;

  return (
    <section className="card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4">
        <div>
          <h2 className="label">Default daily tasks</h2>
          <p className="mt-1 text-xs text-muted">These appear fresh every day. Changes apply from today onward; past days stay as they were.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={onAdd}>
          <Plus size={14} /> Add default
        </button>
      </div>

      {defaults.length === 0 && <p className="p-6 text-center font-mono text-sm text-muted">// no default tasks yet</p>}

      <ul>
        {defaults.map((d, i) => (
          <li key={d.id} className={`flex flex-wrap items-center gap-2 border-b border-line px-4 py-3 last:border-b-0 ${d.enabled ? '' : 'opacity-50'}`}>
            <div className="min-w-0 flex-1 basis-48">
              <div className="break-words text-sm font-medium">
                <span className="mr-2">{d.emoji}</span>
                {d.title}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted">
                <span className={`rounded border px-1.5 py-0.5 ${categoryOf(d.category).chip}`}>{categoryOf(d.category).label}</span>
                {d.reminder && (
                  <span className="inline-flex items-center gap-1">
                    <Bell size={11} /> {formatTime(d.reminder)}
                  </span>
                )}
                {!d.enabled && <span>disabled</span>}
              </div>
            </div>

            {confirming === d.id ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted">Delete? History is kept.</span>
                <button type="button" className="btn border-red/40 text-red" onClick={() => { store.deleteDefault(d.id); setConfirming(null); }}>
                  Delete
                </button>
                <button type="button" className="btn" onClick={() => setConfirming(null)}>
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center">
                <button type="button" className={iconBtn} disabled={i === 0} onClick={() => store.moveDefault(d.id, -1)} aria-label={`Move ${d.title} up`}>
                  <ArrowUp size={15} />
                </button>
                <button type="button" className={iconBtn} disabled={i === defaults.length - 1} onClick={() => store.moveDefault(d.id, 1)} aria-label={`Move ${d.title} down`}>
                  <ArrowDown size={15} />
                </button>
                <button type="button" className={iconBtn} onClick={() => store.toggleDefault(d.id)} aria-label={`${d.enabled ? 'Disable' : 'Enable'} ${d.title}`} title={d.enabled ? 'Disable' : 'Enable'}>
                  {d.enabled ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button type="button" className={iconBtn} onClick={() => onEdit(d)} aria-label={`Edit ${d.title}`}>
                  <Pencil size={15} />
                </button>
                <button type="button" className={`${iconBtn} hover:!text-red`} onClick={() => setConfirming(d.id)} aria-label={`Delete ${d.title}`}>
                  <Trash2 size={15} />
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

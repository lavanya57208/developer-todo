import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import type { TaskDraft } from '../types';
import { CATEGORIES } from '../lib/constants';

export type ModalMode = 'add' | 'edit' | 'default';

interface Props {
  mode: ModalMode;
  heading: string;
  initial?: Partial<TaskDraft>;
  onSubmit: (draft: TaskDraft) => void;
  onClose: () => void;
}

const EMPTY: TaskDraft = { title: '', description: '', emoji: '', category: 'coding', reminder: '', recurring: false };

export default function AddTaskModal({ mode, heading, initial, onSubmit, onClose }: Props) {
  const [draft, setDraft] = useState<TaskDraft>({ ...EMPTY, ...initial });
  const titleRef = useRef<HTMLInputElement>(null);
  const set = <K extends keyof TaskDraft>(k: K, v: TaskDraft[K]) => setDraft((d) => ({ ...d, [k]: v }));

  useEffect(() => {
    titleRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.title.trim()) return;
    onSubmit(draft);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={onClose}>
      <form
        onSubmit={submit}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={heading}
        className="card animate-fade-up max-h-[92vh] w-full max-w-md overflow-y-auto rounded-b-none sm:rounded-b-xl"
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <span className="font-mono text-sm text-green">
            <span className="text-muted">$</span> {heading}
          </span>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded p-1 text-muted hover:bg-panel2 hover:text-fg">
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-4 p-4">
          <div className="flex gap-3">
            <label className="flex w-16 flex-col gap-1.5">
              <span className="label">Icon</span>
              <input id="task-emoji" className="input text-center" maxLength={4} placeholder="💻" value={draft.emoji} onChange={(e) => set('emoji', e.target.value)} />
            </label>
            <label className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span className="label">Task</span>
              <input id="task-title" ref={titleRef} className="input" placeholder="Build React Login Page" value={draft.title} onChange={(e) => set('title', e.target.value)} required />
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="label">Description · optional</span>
            <input id="task-desc" className="input" placeholder="What does done look like?" value={draft.description} onChange={(e) => set('description', e.target.value)} />
          </label>

          <div className="flex flex-col gap-1.5">
            <span className="label">Category</span>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => set('category', c.id)}
                  aria-pressed={draft.category === c.id}
                  className={`rounded-md border px-2 py-1 text-xs transition ${draft.category === c.id ? c.chip : 'border-line text-muted hover:text-fg'}`}
                >
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="label">Reminder · optional</span>
            <div className="flex items-center gap-2">
              <input id="task-reminder" type="time" className="input w-36" value={draft.reminder} onChange={(e) => set('reminder', e.target.value)} />
              {draft.reminder ? (
                <button type="button" className="btn btn-ghost" onClick={() => set('reminder', '')}>
                  Remove
                </button>
              ) : (
                <span className="text-xs text-muted">No time set. Do it whenever you can.</span>
              )}
            </div>
          </div>

          {mode === 'add' && (
            <div className="flex flex-col gap-1.5">
              <span className="label">Recurrence</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { v: false, t: 'Today only' },
                  { v: true, t: 'Every day' },
                ].map((o) => (
                  <button
                    key={o.t}
                    type="button"
                    onClick={() => set('recurring', o.v)}
                    aria-pressed={draft.recurring === o.v}
                    className={`rounded-md border px-3 py-2 font-mono text-xs transition ${
                      draft.recurring === o.v ? 'border-cyan/50 bg-cyan/10 text-cyan' : 'border-line text-muted hover:text-fg'
                    }`}
                  >
                    {o.t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-line px-4 py-3">
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {mode === 'add' ? 'Add task' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}

import { Bell, Check, Pencil, RotateCcw, SkipForward, Trash2 } from 'lucide-react';
import type { DayTask, TaskStatus } from '../types';
import { categoryOf } from '../lib/constants';
import { formatTime } from '../lib/date';

interface Props {
  task: DayTask;
  readOnly?: boolean;
  onStatus?: (status: TaskStatus) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const STATUS_LABEL: Record<TaskStatus, string> = { pending: 'Pending', completed: 'Completed', skipped: 'Skipped today' };

export default function TaskCard({ task, readOnly, onStatus, onEdit, onDelete }: Props) {
  const cat = categoryOf(task.category);
  const done = task.status === 'completed';
  const skipped = task.status === 'skipped';

  return (
    <div
      className={`card flex gap-3 p-4 transition-all duration-300 ${
        done ? 'border-green/30 opacity-60' : skipped ? 'border-dashed opacity-60' : 'hover:border-cyan/40'
      }`}
    >
      <button
        type="button"
        disabled={readOnly}
        onClick={() => onStatus?.(done ? 'pending' : 'completed')}
        aria-label={done ? `Mark ${task.title} as not completed` : `Complete ${task.title}`}
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan/60 ${
          done ? 'border-green bg-green text-bg' : 'border-line bg-bg hover:border-green'
        } ${readOnly ? 'cursor-default' : ''}`}
      >
        {done && <Check key="c" size={15} strokeWidth={3} className="animate-pop" />}
        {skipped && <SkipForward size={12} className="text-muted" />}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className={`min-w-0 break-words font-medium leading-snug ${done ? 'line-through decoration-green/60' : ''}`}>
            <span className="mr-2">{task.emoji}</span>
            {task.title}
          </h3>
          {!readOnly && (
            <div className="flex shrink-0 gap-0.5">
              <button type="button" onClick={onEdit} aria-label={`Edit ${task.title}`} className="rounded p-1 text-muted hover:bg-panel2 hover:text-fg">
                <Pencil size={14} />
              </button>
              {!task.defaultId && (
                <button type="button" onClick={onDelete} aria-label={`Delete ${task.title}`} className="rounded p-1 text-muted hover:bg-panel2 hover:text-red">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          )}
        </div>
        {task.description && <p className="mt-0.5 break-words text-sm text-muted">{task.description}</p>}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className={`rounded border px-1.5 py-0.5 font-mono text-[11px] ${cat.chip}`}>{cat.label}</span>
          {!task.defaultId && <span className="rounded border border-line px-1.5 py-0.5 font-mono text-[11px] text-muted">custom</span>}
          {task.reminder && (
            <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted">
              <Bell size={11} /> {formatTime(task.reminder)}
            </span>
          )}
          <span className={`font-mono text-[11px] ${done ? 'text-green' : skipped ? 'text-amber' : 'text-muted'}`}>
            {done ? '✓ ' : ''}
            {skipped && readOnly ? 'Skipped' : STATUS_LABEL[task.status]}
          </span>

          {!readOnly && (
            <div className="ml-auto flex gap-2">
              {task.status === 'pending' ? (
                <>
                  <button type="button" className="btn btn-primary" onClick={() => onStatus?.('completed')}>
                    <Check size={13} /> Complete
                  </button>
                  <button type="button" className="btn" onClick={() => onStatus?.('skipped')}>
                    <SkipForward size={13} /> Skip
                  </button>
                </>
              ) : (
                <button type="button" className="btn" onClick={() => onStatus?.('pending')}>
                  <RotateCcw size={13} /> {done ? 'Undo' : 'Restore'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

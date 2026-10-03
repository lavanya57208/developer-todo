import { useMemo, useRef, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import type { CategoryId, DayTask, TaskStatus } from '../types';
import type { Store } from '../hooks/useTodoStore';
import { CATEGORIES } from '../lib/constants';
import TaskList from './TaskList';

interface Props {
  store: Store;
  onAdd: () => void;
  onEdit: (task: DayTask) => void;
}

const STATUSES: ('all' | TaskStatus)[] = ['all', 'pending', 'completed', 'skipped'];

export default function TasksView({ store, onAdd, onEdit }: Props) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | TaskStatus>('all');
  const [category, setCategory] = useState<'all' | CategoryId>('all');
  const searchRef = useRef<HTMLInputElement>(null);

  const tasks = useMemo(() => {
    const q = query.trim().toLowerCase();
    return store.todayTasks.filter(
      (t) =>
        (status === 'all' || t.status === status) &&
        (category === 'all' || t.category === category) &&
        (!q || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)),
    );
  }, [store.todayTasks, query, status, category]);

  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-center justify-between gap-3">
        <h1 className="font-mono text-2xl font-bold">
          <span className="text-muted">./</span>tasks
        </h1>
        <button type="button" className="btn btn-primary" onClick={onAdd}>
          <Plus size={14} /> Add Task
        </button>
      </header>

      <div className="card flex flex-col gap-3 p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input id="task-search" ref={searchRef} className="input pl-9" placeholder="Search today's tasks" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <select id="task-category-filter" className="input sm:w-52" value={category} onChange={(e) => setCategory(e.target.value as 'all' | CategoryId)} aria-label="Filter by category">
            <option value="all">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              aria-pressed={status === s}
              className={`rounded-md border px-2.5 py-1 font-mono text-xs capitalize transition ${
                status === s ? 'border-cyan/50 bg-cyan/10 text-cyan' : 'border-line text-muted hover:text-fg'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <TaskList tasks={tasks} emptyText="// no tasks match these filters" onStatus={store.setStatus} onEdit={onEdit} onDelete={store.deleteTask} />
    </div>
  );
}

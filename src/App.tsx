import { useCallback, useEffect, useRef, useState } from 'react';
import { Bell, Moon, Sun, X } from 'lucide-react';
import type { DayTask, DefaultTask, TaskDraft, View } from './types';
import { useTodoStore } from './hooks/useTodoStore';
import { nowHHMM } from './lib/date';
import Sidebar, { NAV } from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TasksView from './components/TasksView';
import Calendar from './components/Calendar';
import ProgressView from './components/ProgressView';
import Settings from './components/Settings';
import AddTaskModal from './components/AddTaskModal';
import Confetti from './components/Confetti';

type Modal =
  | { mode: 'add' }
  | { mode: 'edit'; task: DayTask }
  | { mode: 'default'; task?: DefaultTask };

const toDraft = (t: DayTask | DefaultTask): Partial<TaskDraft> => ({
  title: t.title,
  description: t.description,
  emoji: t.emoji,
  category: t.category,
  reminder: t.reminder ?? '',
});

export default function App() {
  const store = useTodoStore();
  const { state, today, todayTasks, stats } = store;
  const [view, setView] = useState<View>('dashboard');
  const [modal, setModal] = useState<Modal | null>(null);
  const [calendarDate, setCalendarDate] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [celebrate, setCelebrate] = useState(false);

  const toggleTheme = useCallback(() => store.setTheme(state.theme === 'dark' ? 'light' : 'dark'), [store, state.theme]);

  // Keyboard shortcuts (ignored while typing or when a dialog is open).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (modal || e.metaKey || e.ctrlKey || e.altKey || /INPUT|TEXTAREA|SELECT/.test(el.tagName)) return;
      const k = e.key.toLowerCase();
      if (k === 'n') { e.preventDefault(); setModal({ mode: 'add' }); }
      else if (k === 't') toggleTheme();
      else if (/^[1-5]$/.test(k)) setView(NAV[Number(k) - 1].id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modal, toggleTheme]);

  // Confetti once, when the last pending task of the day gets handled.
  const allDone = stats.total > 0 && stats.pending === 0 && stats.completed > 0;
  const wasDone = useRef(allDone);
  useEffect(() => {
    if (allDone && !wasDone.current) {
      setCelebrate(true);
      const id = window.setTimeout(() => setCelebrate(false), 3000);
      wasDone.current = allDone;
      return () => window.clearTimeout(id);
    }
    wasDone.current = allDone;
  }, [allDone]);

  // Optional reminders: a gentle nudge at the chosen time while the page is open.
  const fired = useRef(new Set<string>());
  useEffect(() => {
    const tick = () => {
      const now = nowHHMM();
      for (const t of todayTasks) {
        const key = `${today}:${t.id}:${t.reminder}`;
        if (t.status !== 'pending' || t.reminder !== now || fired.current.has(key)) continue;
        fired.current.add(key);
        setToast(`${t.emoji} ${t.title}`);
        try {
          if ('Notification' in window && Notification.permission === 'granted') new Notification('Dev Todo reminder', { body: `${t.emoji} ${t.title}` });
        } catch { /* notifications unavailable */ }
      }
    };
    tick();
    const id = window.setInterval(tick, 20_000);
    return () => window.clearInterval(id);
  }, [todayTasks, today]);

  const askNotify = (draft: TaskDraft) => {
    try {
      if (draft.reminder && 'Notification' in window && Notification.permission === 'default') void Notification.requestPermission();
    } catch { /* ignore */ }
  };

  const submit = (draft: TaskDraft) => {
    if (!modal) return;
    askNotify(draft);
    if (modal.mode === 'add') store.addTask(draft);
    else if (modal.mode === 'edit') store.editTask(modal.task.id, draft);
    else if (modal.task) store.updateDefault(modal.task.id, draft);
    else store.addDefault(draft);
  };

  const openAdd = () => setModal({ mode: 'add' });
  const openEdit = (task: DayTask) => setModal({ mode: 'edit', task });

  return (
    <div className="relative min-h-screen">
      <div className="grid-bg pointer-events-none fixed inset-0" aria-hidden="true" />
      <Sidebar view={view} theme={state.theme} onView={setView} onTheme={toggleTheme} />

      <div className="relative md:pl-56">
        <div className="flex items-center justify-between border-b border-line px-4 py-3 md:hidden">
          <span className="font-mono text-sm font-semibold tracking-widest">
            <span className="text-green">⌘</span> DEV TODO
          </span>
          <button type="button" onClick={toggleTheme} aria-label="Toggle theme" className="rounded p-1.5 text-muted hover:text-fg">
            {state.theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 md:px-8 md:pb-12 md:pt-10">
          {view === 'dashboard' && <Dashboard store={store} onAdd={openAdd} onEdit={openEdit} onOpenDay={(key) => { setCalendarDate(key); setView('calendar'); }} />}
          {view === 'tasks' && <TasksView store={store} onAdd={openAdd} onEdit={openEdit} />}
          {view === 'calendar' && <Calendar key={calendarDate ?? 'today'} store={store} initial={calendarDate ?? undefined} />}
          {view === 'progress' && <ProgressView store={store} />}
          {view === 'settings' && (
            <Settings store={store} onAddDefault={() => setModal({ mode: 'default' })} onEditDefault={(task) => setModal({ mode: 'default', task })} />
          )}
        </main>
      </div>

      {modal && (
        <AddTaskModal
          mode={modal.mode}
          heading={modal.mode === 'add' ? 'new task' : modal.mode === 'edit' ? 'edit task' : modal.task ? 'edit default task' : 'new default task'}
          initial={modal.mode !== 'add' && modal.task ? toDraft(modal.task) : undefined}
          onSubmit={submit}
          onClose={() => setModal(null)}
        />
      )}

      {toast && (
        <div className="card animate-fade-up fixed bottom-20 right-4 z-50 flex max-w-xs items-center gap-3 border-cyan/40 p-3 pr-2 shadow-lg md:bottom-6" role="status">
          <Bell size={16} className="shrink-0 text-cyan" />
          <div className="min-w-0 text-sm">
            <div className="label">Reminder</div>
            <div className="break-words">{toast}</div>
          </div>
          <button type="button" onClick={() => setToast(null)} aria-label="Dismiss" className="rounded p-1 text-muted hover:text-fg">
            <X size={14} />
          </button>
        </div>
      )}

      {celebrate && <Confetti />}
    </div>
  );
}

import { Plus, Target } from 'lucide-react';
import type { DayTask } from '../types';
import type { Store } from '../hooks/useTodoStore';
import { greeting, longDate, weekdayName } from '../lib/date';
import ProgressCard from './ProgressCard';
import StreakCard from './StreakCard';
import TaskList from './TaskList';
import MotivationCard from './MotivationCard';
import JourneyCard from './JourneyCard';
import DailyReflection from './DailyReflection';
import ConsistencyCalendar from './ConsistencyCalendar';
import LearningProgress from './LearningProgress';
import WeeklySummary from './WeeklySummary';
import SkillProgress from './SkillProgress';
import MonthlyOverview from './MonthlyOverview';
import ConsistencyScore from './ConsistencyScore';
import { consistency, daysSinceLastActive } from '../lib/analytics';

interface Props {
  store: Store;
  onAdd: () => void;
  onEdit: (task: DayTask) => void;
  onOpenDay: (key: string) => void;
}

export default function Dashboard({ store, onAdd, onEdit, onOpenDay }: Props) {
  const { state, today, todayTasks, stats, summary } = store;
  const allDone = stats.total > 0 && stats.pending === 0 && stats.completed > 0;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-sm text-muted">
            <span className="text-purple">{'{'}</span> {greeting()}, Developer 👋 <span className="text-purple">{'}'}</span>
          </p>
          <h1 className="mt-2 font-mono text-3xl font-bold tracking-tight sm:text-4xl">{weekdayName(today)}</h1>
          <p className="font-mono text-lg tracking-widest text-cyan">{longDate(today)}</p>
        </div>
        <p className="max-w-xs text-sm text-muted">Complete it whenever you can. Just don&apos;t stop learning.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProgressCard stats={stats} />
        </div>
        <StreakCard summary={summary} />
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <section className="flex flex-col gap-3 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="label">Today&apos;s tasks</h2>
            <button type="button" className="btn btn-primary" onClick={onAdd}>
              <Plus size={14} /> Add Task
            </button>
          </div>
          {allDone && (
            <p className="animate-fade-up rounded-lg border border-green/30 bg-green/10 px-4 py-3 font-mono text-sm text-green">
              ✓ All tasks handled for today. Build succeeded.
            </p>
          )}
          <TaskList
            tasks={todayTasks}
            emptyText="// no tasks today. add one, or enable a default task in Settings"
            onStatus={store.setStatus}
            onEdit={onEdit}
            onDelete={store.deleteTask}
          />
        </section>

        <aside className="flex flex-col gap-4">
          <JourneyCard stats={stats} gap={daysSinceLastActive(state.days, today)} activeDays={summary.codingDays} />
          <section className="card p-5">
            <label htmlFor="today-goal" className="label flex items-center gap-1.5">
              <Target size={12} /> Today&apos;s goal
            </label>
            <input
              id="today-goal"
              className="input mt-3"
              placeholder="e.g. Finish the login form"
              value={state.goals[today] ?? ''}
              onChange={(e) => store.setGoal(e.target.value)}
            />
          </section>
          <DailyReflection date={today} heading="How was today?" value={state.reflections[today]} onChange={(patch) => store.setReflection(today, patch)} />
          <MotivationCard today={today} />
        </aside>
      </div>

      <ConsistencyCalendar days={state.days} today={today} onSelect={onOpenDay} />

      <div className="grid items-start gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LearningProgress days={state.days} today={today} />
        </div>
        <WeeklySummary days={state.days} today={today} currentStreak={summary.current} />
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-2">
        <SkillProgress days={state.days} />
        <MonthlyOverview days={state.days} today={today} />
      </div>

      <ConsistencyScore data={consistency(state, today, summary.current)} summary={summary} />
    </div>
  );
}

import type { DayTask, TaskStatus } from '../types';
import TaskCard from './TaskCard';

interface Props {
  tasks: DayTask[];
  readOnly?: boolean;
  emptyText?: string;
  onStatus?: (id: string, status: TaskStatus) => void;
  onEdit?: (task: DayTask) => void;
  onDelete?: (id: string) => void;
}

export default function TaskList({ tasks, readOnly, emptyText = '// nothing here', onStatus, onEdit, onDelete }: Props) {
  if (!tasks.length) return <p className="card border-dashed p-6 text-center font-mono text-sm text-muted">{emptyText}</p>;
  return (
    <div className="flex flex-col gap-3">
      {tasks.map((t) => (
        <TaskCard
          key={t.id}
          task={t}
          readOnly={readOnly}
          onStatus={(s) => onStatus?.(t.id, s)}
          onEdit={() => onEdit?.(t)}
          onDelete={() => onDelete?.(t.id)}
        />
      ))}
    </div>
  );
}

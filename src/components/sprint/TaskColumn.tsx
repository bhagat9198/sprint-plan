import React from 'react';
import { Column } from '../../types/sprint';
import { TaskCard } from './TaskCard';
import { getColumnIcon, getColumnColor } from '../../data/sprint';

interface TaskColumnProps {
  column: Column;
  isDraggedOver: boolean;
  onDragStart: (taskId: string) => void;
  onDragOver: (columnId: string) => void;
  onDragEnd: (columnId: string) => void;
}

export const TaskColumn: React.FC<TaskColumnProps> = ({
  column,
  isDraggedOver,
  onDragStart,
  onDragOver,
  onDragEnd,
}) => {
  return (
    <div 
      className={`flex-shrink-0 w-[350px] glassmorphism rounded-xl overflow-hidden transition-all duration-200
        ${isDraggedOver ? 'bg-white/20 dark:bg-white/10 scale-[1.02]' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(column.id);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDragEnd(column.id);
      }}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 ${getColumnColor(column.id)}`}>
              {getColumnIcon(column.id)}
            </div>
            <div>
              <h3 className="font-semibold">{column.title}</h3>
              <span className="text-sm text-text-secondary dark:text-dark-text-secondary">
                {column.tasks.length} {column.tasks.length === 1 ? 'task' : 'tasks'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="p-4 space-y-4 min-h-[calc(100vh-20rem)]">
        {column.tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDragStart={() => onDragStart(task.id)}
          />
        ))}
      </div>
    </div>
  );
};
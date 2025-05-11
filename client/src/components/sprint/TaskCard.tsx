import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Link as LinkIcon, Flag, Clock } from 'lucide-react';
import { Task } from '../../types/sprint';

interface TaskCardProps {
  task: Task;
  onDragStart: () => void;
}

const priorityColors = {
  low: 'bg-success/20 text-success dark:bg-dark-success/20 dark:text-dark-success',
  medium: 'bg-warning/20 text-warning dark:bg-dark-warning/20 dark:text-dark-warning',
  high: 'bg-critical/20 text-critical dark:bg-dark-critical/20 dark:text-dark-critical',
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onDragStart }) => {
  return (
    <motion.div
      layoutId={task.id}
      className="glassmorphism rounded-xl p-4 cursor-move group hover:shadow-lg hover:shadow-primary/5"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      draggable
      onDragStart={onDragStart}
    >
      {/* Task Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-primary">TMS{task.id.padStart(6, '0')}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
        </div>
        <div className="flex items-center gap-1 text-text-secondary">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{task.eta}</span>
        </div>
      </div>

      {/* Task Title & Description */}
      <div className="mb-4">
        <h4 className="font-medium mb-1">{task.title}</h4>
        <p className="text-sm text-text-secondary dark:text-dark-text-secondary line-clamp-2">
          {task.description}
        </p>
      </div>

      {/* Task Metadata */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={task.assignee.avatar}
            alt={task.assignee.name}
            className="w-6 h-6 rounded-full ring-2 ring-white/10"
          />
          <span className="text-sm text-text-secondary">{task.assignee.name}</span>
        </div>

        <div className="flex items-center gap-3 text-text-secondary">
          {task.dependencies > 0 && (
            <div className="flex items-center gap-1">
              <LinkIcon className="w-4 h-4" />
              <span className="text-xs">{task.dependencies}</span>
            </div>
          )}
          {task.comments > 0 && (
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span className="text-xs">{task.comments}</span>
            </div>
          )}
          {task.blockers > 0 && (
            <div className="flex items-center gap-1">
              <Flag className="w-4 h-4 text-critical" />
              <span className="text-xs">{task.blockers}</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: '65%' }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
};
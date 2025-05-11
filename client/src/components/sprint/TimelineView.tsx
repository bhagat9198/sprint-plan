import React from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle, MessageSquare, Link as LinkIcon } from 'lucide-react';
import { Task } from '../../types/sprint';

interface TimelineViewProps {
  tasks: Task[];
}

export const TimelineView: React.FC<TimelineViewProps> = ({ tasks }) => {
  const today = new Date();
  const sprintStart = new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000); // 5 days ago

  const getTaskPosition = (task: Task) => {
    // Mock progress calculation - replace with actual logic
    const progress = task.id === '1' ? 50 :
                    task.id === '2' ? 30 :
                    task.id === '3' ? 70 :
                    40;
    return `${progress}%`;
  };

  const getTaskWidth = (task: Task) => {
    // Mock duration calculation - replace with actual logic
    const duration = task.id === '1' ? 30 :
                    task.id === '2' ? 40 :
                    task.id === '3' ? 20 :
                    35;
    return `${duration}%`;
  };

  const getStatusColor = (task: Task) => {
    switch (task.status) {
      case 'on-track':
        return 'bg-success/20 border-success/30';
      case 'slight-delay':
        return 'bg-warning/20 border-warning/30';
      case 'critical-delay':
        return 'bg-critical/20 border-critical/30';
      default:
        return 'bg-primary/20 border-primary/30';
    }
  };

  const totalDays = 10;
  const days = Array.from({ length: totalDays + 1 }, (_, i) => {
    const date = new Date(sprintStart);
    date.setDate(date.getDate() + i);
    return date;
  });

  return (
    <div className="p-6">
      {/* Timeline Header */}
      <div className="flex items-center mb-8">
        <div className="w-[200px] flex-shrink-0" />
        <div className="flex-1 relative">
          {/* Time Markers */}
          <div className="flex justify-between absolute -top-6 w-full">
            {days.map((date, index) => {
              const isToday = date.toDateString() === today.toDateString();
              
              return (
                <div
                  key={index}
                  className={`text-xs ${isToday ? 'text-primary' : 'text-text-secondary'}`}
                >
                  {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              );
            })}
          </div>
          
          {/* Timeline Grid */}
          <div className="h-full border-l border-white/10">
            {Array.from({ length: totalDays }).map((_, index) => (
              <div
                key={index}
                className="absolute h-full border-l border-white/10"
                style={{ left: `${(index + 1) * (100 / totalDays)}%` }}
              />
            ))}
          </div>

          {/* Today Marker */}
          <div
            className="absolute h-full w-px bg-primary"
            style={{ left: '50%' }}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-1 rounded-full bg-primary text-white text-xs">
              Today
            </div>
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="space-y-6">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            {/* Task Info */}
            <div className="w-[200px] flex-shrink-0">
              <div className="flex items-start gap-2">
                <span className="text-xs font-mono text-primary">
                  TMS{task.id.padStart(6, '0')}
                </span>
                <div>
                  <h4 className="font-medium text-sm">{task.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <img
                      src={task.assignee.avatar}
                      alt={task.assignee.name}
                      className="w-5 h-5 rounded-full"
                    />
                    <span className="text-xs text-text-secondary">
                      {task.assignee.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Bar */}
            <div className="flex-1 h-12 relative">
              <motion.div
                className={`absolute h-8 rounded-lg border ${getStatusColor(task)} 
                           flex items-center px-3 cursor-pointer hover:scale-[1.02] transition-transform`}
                style={{
                  left: getTaskPosition(task),
                  width: getTaskWidth(task),
                }}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center gap-3 text-xs">
                  <Clock className="w-4 h-4" />
                  <span>{task.eta}</span>
                  {task.blockers > 0 && (
                    <span className="flex items-center gap-1 text-critical">
                      <AlertTriangle className="w-4 h-4" />
                      {task.blockers}
                    </span>
                  )}
                  {task.dependencies > 0 && (
                    <span className="flex items-center gap-1">
                      <LinkIcon className="w-4 h-4" />
                      {task.dependencies}
                    </span>
                  )}
                  {task.comments > 0 && (
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {task.comments}
                    </span>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
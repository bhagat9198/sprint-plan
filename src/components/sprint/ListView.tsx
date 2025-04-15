import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, AlertTriangle, MessageSquare, Link as LinkIcon, ChevronRight
} from 'lucide-react';
import { Task } from '../../types/sprint';
import { MagneticButton } from '../ui/MagneticButton';

interface ListViewProps {
  tasks: Task[];
}

type SortField = 'id' | 'title' | 'priority' | 'assignee' | 'qa' | 'time' | 'status' | 'startDate' | 'dueDate';

export const ListView: React.FC<ListViewProps> = ({ tasks }) => {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('priority');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isCompactMode, setIsCompactMode] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortTasks = (tasksToSort: Task[]) => {
    return [...tasksToSort].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'id':
          comparison = a.id.localeCompare(b.id);
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
          break;
        case 'status': {
          const statusOrder: Record<string, number> = { 
            'critical-delay': 3, 
            'slight-delay': 2, 
            'on-track': 1 
          };
          comparison = (statusOrder[b.status] || 0) - (statusOrder[a.status] || 0);
          break;
        }
        case 'assignee':
          comparison = a.assignee.name.localeCompare(b.assignee.name);
          break;
        case 'time':
          comparison = parseInt(a.eta) - parseInt(b.eta);
          break;
        default:
          comparison = 0;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-critical/10 text-critical border-critical/20';
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'low':
        return 'bg-success/10 text-success border-success/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const sortedTasks = sortTasks(tasks);

  return (
    <div className="relative px-6 py-4">
      {/* Filters Bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <MagneticButton>
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="px-3 py-2 rounded-lg border border-white/10 hover:bg-white/5
                       flex items-center gap-2 transition-colors"
            >
              <span>Filters</span>
              {activeFilters.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs">
                  {activeFilters.length}
                </span>
              )}
            </button>
          </MagneticButton>
        </div>

        <button
          onClick={() => setIsCompactMode(!isCompactMode)}
          className="px-3 py-2 rounded-lg border border-white/10 hover:bg-white/5
                   text-text-secondary hover:text-text-primary transition-colors"
        >
          {isCompactMode ? 'Standard View' : 'Compact View'}
        </button>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          {activeFilters.map((filter, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs rounded-lg bg-white/5 border border-white/10
                       flex items-center gap-1"
            >
              {filter}
              <button
                onClick={() => setActiveFilters(prev => prev.filter(f => f !== filter))}
                className="hover:text-critical"
              >
                <MessageSquare className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-white/10 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[300px_120px_200px_150px_120px_150px_150px] gap-4 p-4 
                     bg-white/5 border-b border-white/10 sticky top-0 z-10 backdrop-blur-sm">
          {[
            { field: 'id', label: 'Task', width: '300px' },
            { field: 'priority', label: 'Priority', width: '120px' },
            { field: 'assignee', label: 'Assignee', width: '200px' },
            { field: 'qa', label: 'QA Owner', width: '150px' },
            { field: 'time', label: 'Time Est.', width: '120px' },
            { field: 'startDate', label: 'Start Date', width: '150px' },
            { field: 'dueDate', label: 'Due Date', width: '150px' }
          ].map(({ field, label, width }) => (
            <div
              key={field}
              className="flex items-center"
              style={{ width }}
            >
              <button
                onClick={() => handleSort(field as SortField)}
                className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors"
              >
                {label}
                {sortField === field && (
                  <ChevronRight className={`w-4 h-4 transition-transform ${
                    sortDirection === 'asc' ? 'rotate-90' : '-rotate-90'
                  }`} />
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Table Body */}
        <div className="divide-y divide-white/10">
          {sortedTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="group transition-colors hover:bg-white/5"
            >
              {/* Task Row */}
              <div className={`grid grid-cols-[300px_120px_200px_150px_120px_150px_150px] gap-4 p-4 items-center
                           ${isCompactMode ? 'py-2' : 'py-3'}`}>
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                >
                  <span className="text-xs font-mono text-primary">
                    TMS{task.id.padStart(6, '0')}
                  </span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${
                    expandedTask === task.id ? 'rotate-90' : ''
                  }`} />
                  <span className="font-medium truncate">{task.title}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-lg border ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <div className="flex items-center gap-2">
                  <img
                    src={task.assignee.avatar}
                    alt={task.assignee.name}
                    className="w-6 h-6 rounded-full ring-1 ring-white/10"
                  />
                  <span className="text-sm truncate">{task.assignee.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                    <span className="text-xs">QA</span>
                  </div>
                  <span className="text-sm text-text-secondary">Unassigned</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-text-secondary" />
                  <span className="text-sm">{task.eta}</span>
                </div>
                <div className="text-sm text-text-secondary">Apr 10, 2024</div>
                <div className="text-sm text-text-secondary">Apr 15, 2024</div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {expandedTask === task.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-white/5 border-t border-white/10"
                  >
                    <div className="p-4 pl-12 space-y-4">
                      <p className="text-sm text-text-secondary">
                        {task.description}
                      </p>
                      <div className="flex items-center gap-6">
                        {task.blockers > 0 && (
                          <span className="flex items-center gap-2 text-critical text-sm">
                            <AlertTriangle className="w-4 h-4" />
                            {task.blockers} Blockers
                          </span>
                        )}
                        {task.dependencies > 0 && (
                          <span className="flex items-center gap-2 text-sm">
                            <LinkIcon className="w-4 h-4" />
                            {task.dependencies} Dependencies
                          </span>
                        )}
                        {task.comments > 0 && (
                          <span className="flex items-center gap-2 text-sm">
                            <MessageSquare className="w-4 h-4" />
                            {task.comments} Comments
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
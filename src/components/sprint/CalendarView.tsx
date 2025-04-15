import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Clock, MessageSquare, Ticket, AlertTriangle, Code, TestTube, Timer
} from 'lucide-react';
import { Task, TeamMember, TaskDetails } from '../../types/sprint';
import { TaskDetailsPanel } from './TaskDetailsPanel';
import { useTaskStore } from '../../store/taskStore';

interface CalendarViewProps {
  startDate: Date;
  endDate: Date;
  tasks: Task[];
  teamMembers: TeamMember[];
}

const getDaysArray = (start: Date, end: Date) => {
  const days = [];
  const current = new Date(start);
  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
};

export const CalendarView: React.FC<CalendarViewProps> = ({
  startDate,
  endDate,
  tasks,
}) => {
  const { addComment, initializeTasks, getTaskComments, getTask } = useTaskStore();
  const [selectedTask, setSelectedTask] = useState<TaskDetails | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  
  useEffect(() => {
    initializeTasks(tasks);
  }, [tasks, initializeTasks]);

  const handleTaskClick = (task: Task, date: Date) => {
    const taskComments = getTaskComments(task.id);
    const currentTask = getTask(task.id) || task;
    
    const taskDetails: TaskDetails = {
      ...currentTask,
      comments: taskComments,
      timeLogs: [
        {
          hours: 2,
          note: 'Implemented login flow',
          timestamp: new Date(),
        },
      ],
      linkedPRs: ['PR #123: Add Google OAuth'],
      linkedDefects: ['BUG-456: Login redirect issue'],
      dependencies: [
        {
          id: '1',
          title: 'Backend API endpoints',
          status: 'completed',
        },
      ],
    };

    setSelectedTask(taskDetails);
    setSelectedDate(date);
  };

  const handleClosePanel = () => {
    setSelectedTask(null);
    setSelectedDate(null);
  };

  const handleAddComment = (comment: string) => {
    if (selectedTask) {
      addComment(
        selectedTask.id,
        comment,
        '1',
        'Alex Chen',
        'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      );
    }
  };

  const handleLogTime = (hours: number, note?: string) => {
    console.log('Logging time:', hours, note);
  };

  const handleToggleBlocked = () => {
    console.log('Toggling blocked status');
  };

  const days = getDaysArray(startDate, endDate);

  const formatDate = (date: Date) => {
    const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
    const day = date.getDate();
    return { weekday, month, day };
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const getTaskAssignment = (taskId: string, date: Date) => {
    if (taskId === '1' && date.getDate() === 10) {
      return {
        hours: 2,
        status: 'in-progress',
      };
    }
    return null;
  };

  return (
    <>
      <div className="h-[calc(100vh-13rem)] flex flex-col rounded-xl glassmorphism overflow-hidden">
        {/* Fixed Header */}
        <div className="grid grid-cols-[400px_repeat(10,minmax(120px,1fr))] border-b border-white/10">
          {/* Task Meta Header */}
          <div className="py-2 px-4 flex items-center gap-2 sticky left-0 z-20 bg-white/10 backdrop-blur-md">
            <Ticket className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">Task Details</span>
          </div>

          {/* Date Headers */}
          {days.map((day) => {
            const { weekday, month, day: dayNum } = formatDate(day);
            return (
              <div
                key={day.toISOString()}
                className={`py-2 px-1 text-center border-l border-white/10
                  ${isWeekend(day) ? 'bg-white/5' : ''}
                  ${isToday(day) ? 'bg-primary/10' : ''}`}
              >
                <div className="text-xs text-text-secondary">{weekday}</div>
                <div className="font-medium">{dayNum}</div>
                <div className="text-xs text-text-secondary">{month}</div>
              </div>
            );
          })}
        </div>

        {/* Scrollable Content */}
        <div className="overflow-auto flex-1">
          <div className="grid grid-cols-[400px_repeat(10,minmax(120px,1fr))]">
            {tasks.map((task) => (
              <React.Fragment key={task.id}>
                {/* Task Meta Column */}
                <div 
                  className={`sticky left-0 z-10 bg-white/10 backdrop-blur-md py-3 px-4 border-b border-white/10
                    ${hoveredTaskId === task.id ? 'bg-white/20' : ''}`}
                  onMouseEnter={() => setHoveredTaskId(task.id)}
                  onMouseLeave={() => setHoveredTaskId(null)}
                >
                  <div className="flex flex-col gap-2">
                    {/* Task Details */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-primary">TMS{task.id.padStart(6, '0')}</span>
                        <span className={`w-2 h-2 rounded-full ${
                          task.priority === 'high' ? 'bg-critical' :
                          task.priority === 'medium' ? 'bg-warning' :
                          'bg-success'
                        }`} />
                      </div>
                      <div className="flex items-center gap-1 text-xs text-text-secondary">
                        <Clock className="w-3 h-3" />
                        <span>{task.eta}</span>
                      </div>
                    </div>

                    {/* Task Title & Description */}
                    <div className="group cursor-pointer" onClick={() => handleTaskClick(task, new Date())}>
                      <h4 className="font-medium text-sm truncate group-hover:text-primary">
                        {task.title}
                      </h4>
                      <p className="text-xs text-text-secondary truncate">
                        {task.description}
                      </p>
                    </div>

                    {/* Assignees */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Developer */}
                        <div className="flex items-center gap-1">
                          <Code className="w-3 h-3 text-text-secondary" />
                          <img
                            src={task.assignee.avatar}
                            alt={task.assignee.name}
                            className="w-5 h-5 rounded-full ring-1 ring-white/10"
                            title={`Developer: ${task.assignee.name}`}
                          />
                        </div>
                        {/* QA */}
                        <div className="flex items-center gap-1">
                          <TestTube className="w-3 h-3 text-text-secondary" />
                          <div 
                            className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-text-secondary"
                            title="No QA assigned"
                          >
                            QA
                          </div>
                        </div>
                      </div>

                      {/* Status Indicators */}
                      <div className="flex items-center gap-2">
                        {task.blockers > 0 && (
                          <span className="flex items-center gap-1 text-critical">
                            <AlertTriangle className="w-3 h-3" />
                            <span className="text-xs">{task.blockers}</span>
                          </span>
                        )}
                        {task.comments > 0 && (
                          <span className="flex items-center gap-1 text-text-secondary">
                            <MessageSquare className="w-3 h-3" />
                            <span className="text-xs">{task.comments}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Task Timeline Cells */}
                {days.map((day) => {
                  const cellId = `${task.id}-${day.toISOString()}`;
                  const assignment = getTaskAssignment(task.id, day);
                  
                  return (
                    <div
                      key={cellId}
                      className={`py-1 px-1 border-b border-l border-white/10 min-h-[80px] relative group
                        ${isWeekend(day) ? 'bg-white/5' : ''}
                        ${isToday(day) ? 'bg-primary/5' : ''}
                        ${hoveredTaskId === task.id ? 'bg-white/5' : ''}
                        ${hoveredCell === cellId ? 'bg-white/10' : ''}`}
                      onMouseEnter={() => setHoveredCell(cellId)}
                      onMouseLeave={() => setHoveredCell(null)}
                      onClick={() => handleTaskClick(task, day)}
                    >
                      {assignment ? (
                        <div className="absolute inset-2 rounded-lg bg-primary/10 border border-primary/20 p-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Timer className="w-3 h-3 text-primary" />
                              <span className="text-xs">{assignment.hours}h</span>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          </div>
                        </div>
                      ) : (
                        <AnimatePresence>
                          {hoveredCell === cellId && (
                            <motion.button
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 flex items-center justify-center"
                            >
                              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
                                <Plus className="w-4 h-4 text-text-secondary" />
                              </div>
                            </motion.button>
                          )}
                        </AnimatePresence>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Task Details Panel */}
      {selectedTask && selectedDate && (
        <TaskDetailsPanel
          task={selectedTask}
          date={selectedDate}
          isOpen={!!selectedTask}
          onClose={handleClosePanel}
          onAddComment={handleAddComment}
          onLogTime={handleLogTime}
          onToggleBlocked={handleToggleBlocked}
        />
      )}
    </>
  );
};
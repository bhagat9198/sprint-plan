import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Clock, AlertCircle, Send, GitPullRequest, Bug,
  Link2, CheckCircle2, Timer, Paperclip, AlertTriangle
} from 'lucide-react';
import { TaskDetails } from '../../types/sprint';
import { MagneticButton } from '../ui/MagneticButton';
import { useTaskStore } from '../../store/taskStore';

interface TaskDetailsPanelProps {
  task: TaskDetails;
  date: Date;
  isOpen: boolean;
  onClose: () => void;
  onAddComment: (comment: string) => void;
  onLogTime: (hours: number, note?: string) => void;
  onToggleBlocked: () => void;
}

export const TaskDetailsPanel: React.FC<TaskDetailsPanelProps> = ({
  task,
  date,
  isOpen,
  onClose,
  onAddComment,
  onLogTime,
  onToggleBlocked,
}) => {
  const [newComment, setNewComment] = useState('');
  const [timeLogged, setTimeLogged] = useState(task.timeLogs[0]?.hours || 0);
  const [timeNote, setTimeNote] = useState('');
  const [expandedSection, setExpandedSection] = useState<'qa' | 'time' | null>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const commentsContainerRef = useRef<HTMLDivElement>(null);
  
  const { addComment, getTaskComments } = useTaskStore();
  const comments = getTaskComments(task.id);

  useEffect(() => {
    if (commentsEndRef.current && commentsContainerRef.current) {
      const container = commentsContainerRef.current;
      const isScrolledToBottom = container.scrollHeight - container.scrollTop === container.clientHeight;
      
      if (isScrolledToBottom) {
        commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [comments.length]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      addComment(
        task.id,
        newComment,
        '1', // Current user ID
        'Alex Chen', // Current user name
        'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      );
      
      // Clear input
      setNewComment('');
      
      // Notify parent
      onAddComment(newComment);

      // Scroll to bottom after a short delay to ensure the new comment is rendered
      setTimeout(() => {
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleLogTime = (e: React.FormEvent) => {
    e.preventDefault();
    onLogTime(timeLogged, timeNote);
    setTimeNote('');
    setExpandedSection(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 400 }}
          className="fixed top-0 right-0 w-[400px] h-screen bg-card dark:bg-dark-card shadow-2xl z-50 flex flex-col"
        >
          {/* Header */}
          <div className="flex-shrink-0 p-6 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  task.priority === 'high' ? 'bg-critical' :
                  task.priority === 'medium' ? 'bg-warning' :
                  'bg-success'
                }`} />
                <h2 className="text-lg font-semibold">{task.title}</h2>
              </div>
              <MagneticButton>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </MagneticButton>
            </div>

            <div className="flex items-center gap-4 text-sm text-text-secondary">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{task.eta}</span>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src={task.assignee.avatar}
                  alt={task.assignee.name}
                  className="w-6 h-6 rounded-full"
                />
                <span>{task.assignee.name}</span>
              </div>
            </div>

            <div className="mt-4 text-sm text-text-secondary">
              {formatDate(date)}
            </div>
          </div>

          {/* Main Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            {/* QA & Blockers Section */}
            <div className="p-6 border-b border-white/10">
              <button
                onClick={() => setExpandedSection(expandedSection === 'qa' ? null : 'qa')}
                className="flex items-center justify-between w-full"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  <h3 className="font-medium">QA & Blockers</h3>
                </div>
                <div className="flex items-center gap-2">
                  {task.qaStatus === 'passed' ? (
                    <span className="text-xs px-2 py-1 rounded-full bg-success/20 text-success">
                      Passed QA
                    </span>
                  ) : task.qaStatus === 'failed' ? (
                    <span className="text-xs px-2 py-1 rounded-full bg-critical/20 text-critical">
                      Failed QA
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded-full bg-warning/20 text-warning">
                      Pending QA
                    </span>
                  )}
                </div>
              </button>

              <AnimatePresence>
                {expandedSection === 'qa' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 space-y-4"
                  >
                    {/* Linked PRs */}
                    {task.linkedPRs.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Linked PRs</h4>
                        {task.linkedPRs.map((pr, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-sm text-text-secondary"
                          >
                            <GitPullRequest className="w-4 h-4" />
                            <span>{pr}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Linked Defects */}
                    {task.linkedDefects.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Linked Defects</h4>
                        {task.linkedDefects.map((defect, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-sm text-text-secondary"
                          >
                            <Bug className="w-4 h-4" />
                            <span>{defect}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Dependencies */}
                    {task.dependencies.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Dependencies</h4>
                        {task.dependencies.map((dep) => (
                          <div
                            key={dep.id}
                            className="flex items-center gap-2 text-sm text-text-secondary"
                          >
                            <Link2 className="w-4 h-4" />
                            <span>{dep.title}</span>
                            {dep.status === 'completed' ? (
                              <CheckCircle2 className="w-4 h-4 text-success" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-warning" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <MagneticButton>
                      <button
                        onClick={onToggleBlocked}
                        className="w-full py-2 px-4 rounded-lg bg-critical/10 text-critical hover:bg-critical/20"
                      >
                        {task.blockers > 0 ? 'Remove Blocker' : 'Mark as Blocked'}
                      </button>
                    </MagneticButton>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Time Tracking Section */}
            <div className="p-6 border-b border-white/10">
              <button
                onClick={() => setExpandedSection(expandedSection === 'time' ? null : 'time')}
                className="flex items-center justify-between w-full"
              >
                <div className="flex items-center gap-2">
                  <Timer className="w-5 h-5 text-primary" />
                  <h3 className="font-medium">Time Tracking</h3>
                </div>
                <span className="text-sm text-text-secondary">
                  {task.timeLogs.reduce((acc, log) => acc + log.hours, 0)}h logged
                </span>
              </button>

              <AnimatePresence>
                {expandedSection === 'time' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4"
                  >
                    <form onSubmit={handleLogTime} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Hours Worked
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          value={timeLogged}
                          onChange={(e) => setTimeLogged(parseFloat(e.target.value))}
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Notes (optional)
                        </label>
                        <textarea
                          value={timeNote}
                          onChange={(e) => setTimeNote(e.target.value)}
                          placeholder="What did you work on?"
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary resize-none"
                          rows={3}
                        />
                      </div>
                      <MagneticButton>
                        <button
                          type="submit"
                          className="w-full py-2 px-4 rounded-lg bg-primary text-white hover:bg-primary/90"
                        >
                          Log Time
                        </button>
                      </MagneticButton>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Comments Section */}
            <div className="p-6">
              <h3 className="font-medium mb-4 sticky top-0 bg-card dark:bg-dark-card z-10">
                Comments ({comments.length})
              </h3>
              
              {/* Comments List - Scrollable */}
              <div 
                ref={commentsContainerRef}
                className="space-y-4 max-h-[300px] overflow-y-auto pr-2"
              >
                {comments.map((comment, index) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={comment.userAvatar}
                        alt={comment.userName}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="font-medium text-sm">{comment.userName}</span>
                      <span className="text-xs text-text-secondary">
                        {new Intl.DateTimeFormat('en-US', {
                          hour: 'numeric',
                          minute: 'numeric',
                        }).format(new Date(comment.timestamp))}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary pl-8">
                      {comment.content}
                    </p>
                    {comment.attachments && comment.attachments.length > 0 && (
                      <div className="pl-8 flex gap-2">
                        {comment.attachments.map((attachment, i) => (
                          <a
                            key={i}
                            href={attachment.url}
                            className="text-xs px-2 py-1 rounded-full bg-white/5 text-primary hover:bg-white/10"
                          >
                            {attachment.type === 'pr' ? (
                              <GitPullRequest className="w-3 h-3 inline mr-1" />
                            ) : (
                              <Paperclip className="w-3 h-3 inline mr-1" />
                            )}
                            {attachment.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
                <div ref={commentsEndRef} />
              </div>
            </div>
          </div>

          {/* Comment Input - Fixed at bottom */}
          <div className="flex-shrink-0 p-4 border-t border-white/10 bg-card dark:bg-dark-card">
            <form onSubmit={handleSubmitComment} className="relative">
              <div className="flex gap-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary resize-none"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmitComment(e);
                    }
                  }}
                />
                <MagneticButton>
                  <button
                    type="submit"
                    className={`p-2 rounded-lg text-white transition-colors ${
                      newComment.trim() 
                        ? 'bg-primary hover:bg-primary/90' 
                        : 'bg-primary/50 cursor-not-allowed'
                    }`}
                    disabled={!newComment.trim()}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </MagneticButton>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
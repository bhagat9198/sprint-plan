import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, Search, Timer, Layout, GanttChart, List, ChevronDown, ChevronRight } from 'lucide-react';
import { ViewSwitcher } from './ViewSwitcher';
import { ViewType, Sprint } from '../../types/sprint';
import { MagneticButton } from '../ui/MagneticButton';
import { useSprintStore } from '../../store/sprintStore';
import { useNavigate } from 'react-router-dom';

interface SprintHeaderProps {
  selectedView: ViewType;
  onViewChange: (view: ViewType) => void;
  onSearch: (query: string) => void;
  onCreateTask: () => void;
}

export const SprintHeader: React.FC<SprintHeaderProps> = ({
  selectedView,
  onViewChange,
  onSearch,
  onCreateTask,
}) => {
  const [isSprintDropdownOpen, setIsSprintDropdownOpen] = useState(false);
  const [sprintSearchQuery, setSprintSearchQuery] = useState('');
  const sprints = useSprintStore((state) => state.sprints);
  const currentSprintId = useSprintStore((state) => state.currentSprintId);
  const setCurrentSprint = useSprintStore((state) => state.setCurrentSprint);
  const navigate = useNavigate();

  const currentSprint = sprints.find(sprint => sprint.id === currentSprintId);

  // If no current sprint is found, redirect to dashboard
  React.useEffect(() => {
    if (!currentSprint) {
      navigate('/dashboard');
    }
  }, [currentSprint, navigate]);

  // If we're still loading or no sprint found, show loading state
  if (!currentSprint) {
    return (
      <div className="sticky top-16 z-20 bg-background/95 dark:bg-dark-background/95 backdrop-blur-xl border-b border-white/10">
        <div className="px-6 py-4">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-white/10 rounded-lg mb-2" />
            <div className="h-4 w-32 bg-white/10 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  const filteredSprints = sprints.filter(sprint => 
    sprint.name.toLowerCase().includes(sprintSearchQuery.toLowerCase()) ||
    sprint.startDate.includes(sprintSearchQuery) ||
    sprint.endDate.includes(sprintSearchQuery)
  );

  const handleSprintSelect = (sprint: Sprint) => {
    setCurrentSprint(sprint.id);
    navigate(`/sprint/${sprint.id}`);
    setIsSprintDropdownOpen(false);
    setSprintSearchQuery('');
  };

  return (
    <div className="sticky top-16 z-20 bg-background/95 dark:bg-dark-background/95 backdrop-blur-xl border-b border-white/10">
      <div className="px-6 py-4">
        {/* Sprint Info & Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Sprint Selector */}
            <div className="relative">
              <MagneticButton>
                <button
                  onClick={() => setIsSprintDropdownOpen(!isSprintDropdownOpen)}
                  className="flex items-center gap-3 group"
                >
                  <div>
                    <h1 className="text-2xl font-montserrat font-bold group-hover:text-primary transition-colors">
                      {currentSprint.name}
                    </h1>
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Timer className="w-4 h-4" />
                      <span>Day {currentSprint.day} of {currentSprint.totalDays}</span>
                      <span>•</span>
                      <span>{new Date(currentSprint.startDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric'
                      })} - {new Date(currentSprint.endDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric'
                      })}</span>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 transition-transform ${
                    isSprintDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </button>
              </MagneticButton>

              {/* Sprint Dropdown */}
              <AnimatePresence>
                {isSprintDropdownOpen && (
                  <>
                    {/* Backdrop */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-30"
                      onClick={() => setIsSprintDropdownOpen(false)}
                    />
                    
                    {/* Dropdown Content */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 mt-2 w-80 bg-card dark:bg-dark-card rounded-xl border border-white/10 shadow-xl overflow-hidden z-40"
                    >
                      {/* Sprint Search */}
                      <div className="p-3 border-b border-white/10">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                          <input
                            type="text"
                            value={sprintSearchQuery}
                            onChange={(e) => setSprintSearchQuery(e.target.value)}
                            placeholder="Search sprints..."
                            className="w-full pl-9 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 
                                     focus:border-primary outline-none text-sm placeholder-text-secondary/50"
                          />
                        </div>
                      </div>

                      {/* Sprint List */}
                      <div className="max-h-[300px] overflow-y-auto">
                        {filteredSprints.length > 0 ? (
                          <div className="p-2">
                            {filteredSprints.map((sprint) => (
                              <button
                                key={sprint.id}
                                onClick={() => handleSprintSelect(sprint)}
                                className="w-full px-4 py-3 rounded-lg hover:bg-white/5 text-left flex items-center justify-between group"
                              >
                                <div>
                                  <div className="font-medium group-hover:text-primary transition-colors">
                                    {sprint.name}
                                  </div>
                                  <div className="text-sm text-text-secondary">
                                    {new Date(sprint.startDate).toLocaleDateString('en-US', { 
                                      month: 'short', 
                                      day: 'numeric'
                                    })} - {new Date(sprint.endDate).toLocaleDateString('en-US', { 
                                      month: 'short', 
                                      day: 'numeric'
                                    })}
                                  </div>
                                </div>
                                {sprint.id === currentSprintId ? (
                                  <div className="w-2 h-2 rounded-full bg-primary" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
                                )}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="p-8 text-center text-text-secondary">
                            No sprints found
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ViewSwitcher
              views={[
                { icon: <Layout className="w-4 h-4" />, value: 'kanban', label: 'Kanban' },
                { icon: <Calendar className="w-4 h-4" />, value: 'calendar', label: 'Calendar' },
                { icon: <GanttChart className="w-4 h-4" />, value: 'timeline', label: 'Timeline' },
                { icon: <List className="w-4 h-4" />, value: 'list', label: 'List' },
              ]}
              activeView={selectedView}
              onViewChange={onViewChange}
            />

            <MagneticButton>
              <button 
                className="btn-primary"
                onClick={onCreateTask}
              >
                <Plus className="w-4 h-4" />
                New Task
              </button>
            </MagneticButton>
          </div>
        </div>

        {/* Task Search */}
        <div className="flex gap-4 items-center relative z-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
            <input
              type="text"
              placeholder="Search tasks..."
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 dark:bg-white/2 rounded-xl border border-white/10 
                       focus:border-primary outline-none transition-colors text-text-primary dark:text-dark-text-primary 
                       placeholder-text-secondary/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
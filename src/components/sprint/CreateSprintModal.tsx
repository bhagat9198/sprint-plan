import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Calendar, Users, ChevronRight, Brain,
  Clock, Plus, Check, FileUp, Link as LinkIcon
} from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import { teamMembers } from '../../data/sprint';
import { Task } from '../../types/sprint';

interface CreateSprintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SprintFormData {
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  teamMembers: {
    id: string;
    role: string;
    capacity: number;
  }[];
  tasks: {
    title: string;
    priority: Task['priority'];
    estimate: string;
    assigneeId: string;
  }[];
}

const roles = [
  'Developer',
  'QA Engineer',
  'Designer',
  'Product Manager',
  'Tech Lead',
  'Scrum Master'
];

export const CreateSprintModal: React.FC<CreateSprintModalProps> = ({
  isOpen,
  onClose
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<SprintFormData>({
    name: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: '',
    teamMembers: [],
    tasks: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState<SprintFormData['tasks'][0]>({
    title: '',
    priority: 'medium',
    estimate: '',
    assigneeId: ''
  });
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [isOpen]);

  const calculateWorkingDays = () => {
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    let days = 0;
    const current = new Date(start);
    
    while (current <= end) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) days++;
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.name.trim()) {
          newErrors.name = 'Sprint name is required';
        }
        if (!formData.startDate) {
          newErrors.startDate = 'Start date is required';
        }
        if (!formData.endDate) {
          newErrors.endDate = 'End date is required';
        }
        if (new Date(formData.endDate) <= new Date(formData.startDate)) {
          newErrors.endDate = 'End date must be after start date';
        }
        break;

      case 2:
        if (formData.teamMembers.length === 0) {
          newErrors.teamMembers = 'At least one team member is required';
        }
        break;

      case 3:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    console.log('Creating sprint:', formData);
    onClose();
  };

  const getTotalCapacity = () => {
    return formData.teamMembers.reduce((total, member) => total + member.capacity, 0);
  };

  const getPlannedHours = () => {
    return formData.tasks.reduce((total, task) => total + parseInt(task.estimate || '0', 10), 0);
  };

  const handleTeamMemberToggle = (member: typeof teamMembers[0]) => {
    setFormData(prev => {
      const isSelected = prev.teamMembers.some(m => m.id === member.id);
      
      if (isSelected) {
        return {
          ...prev,
          teamMembers: prev.teamMembers.filter(m => m.id !== member.id)
        };
      } else {
        return {
          ...prev,
          teamMembers: [
            ...prev.teamMembers,
            {
              id: member.id,
              role: roles[0],
              capacity: 6 * calculateWorkingDays()
            }
          ]
        };
      }
    });
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Sprint Name</label>
              <input
                ref={firstInputRef}
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 
                         focus:border-primary outline-none transition-colors"
                placeholder="e.g., Sprint Alpha, Q2-Week1"
              />
              {errors.name && (
                <span className="text-sm text-critical mt-1">{errors.name}</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={e => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 
                           focus:border-primary outline-none transition-colors"
                />
                {errors.startDate && (
                  <span className="text-sm text-critical mt-1">{errors.startDate}</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={e => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 
                           focus:border-primary outline-none transition-colors"
                />
                {errors.endDate && (
                  <span className="text-sm text-critical mt-1">{errors.endDate}</span>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-sm text-text-secondary mb-4">
                <Clock className="w-4 h-4" />
                <span>Duration: {calculateWorkingDays()} working days</span>
              </div>
              {calculateWorkingDays() > 10 && (
                <div className="flex items-center gap-2 p-4 rounded-xl bg-warning/10 border border-warning/20">
                  <Brain className="w-5 h-5 text-warning" />
                  <span className="text-sm text-warning">
                    Best practice: Keep sprints 1-2 weeks for better agility
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Sprint Goal (Optional)</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 
                         focus:border-primary outline-none transition-colors resize-none"
                rows={3}
                placeholder="What do we want to achieve in this sprint?"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Team Members</label>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {teamMembers.map(member => {
                  const isSelected = formData.teamMembers.some(m => m.id === member.id);
                  const memberData = formData.teamMembers.find(m => m.id === member.id);

                  return (
                    <div
                      key={member.id}
                      onClick={() => handleTeamMemberToggle(member)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-primary/10 border-primary/20'
                          : 'border-white/10 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-12 h-12 rounded-full ring-2 ring-white/10"
                          />
                          {isSelected && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary 
                                          flex items-center justify-center text-white">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-text-secondary">{member.role}</div>
                        </div>
                      </div>

                      {isSelected && memberData && (
                        <div className="grid grid-cols-2 gap-4 pl-16" onClick={e => e.stopPropagation()}>
                          <div>
                            <label className="block text-sm font-medium mb-2">Role</label>
                            <select
                              value={memberData.role}
                              onChange={e => {
                                setFormData(prev => ({
                                  ...prev,
                                  teamMembers: prev.teamMembers.map(m =>
                                    m.id === member.id ? { ...m, role: e.target.value } : m
                                  )
                                }));
                              }}
                              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 
                                       focus:border-primary outline-none"
                            >
                              {roles.map(role => (
                                <option key={role} value={role}>{role}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Daily Capacity (hours)
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="24"
                              value={memberData.capacity / calculateWorkingDays()}
                              onChange={e => {
                                const dailyHours = parseInt(e.target.value, 10);
                                setFormData(prev => ({
                                  ...prev,
                                  teamMembers: prev.teamMembers.map(m =>
                                    m.id === member.id
                                      ? { ...m, capacity: dailyHours * calculateWorkingDays() }
                                      : m
                                  )
                                }));
                              }}
                              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 
                                       focus:border-primary outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {errors.teamMembers && (
                <span className="text-sm text-critical mt-2">{errors.teamMembers}</span>
              )}
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-medium">Total Sprint Capacity</span>
              </div>
              <span className="text-xl font-bold text-primary">
                {getTotalCapacity()} hours
              </span>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              {formData.tasks.map((task, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-text-secondary">
                        <span className={`px-2 py-0.5 rounded-full ${
                          task.priority === 'high' ? 'bg-critical/20 text-critical' :
                          task.priority === 'medium' ? 'bg-warning/20 text-warning' :
                          'bg-success/20 text-success'
                        }`}>
                          {task.priority}
                        </span>
                        <span>{task.estimate}h</span>
                        <span>{teamMembers.find(m => m.id === task.assigneeId)?.name}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          tasks: prev.tasks.filter((_, i) => i !== index)
                        }));
                      }}
                      className="p-1 rounded-lg hover:bg-white/10 text-text-secondary 
                               hover:text-critical transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {isAddingTask ? (
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Task Title</label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={e => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 
                               focus:border-primary outline-none"
                      placeholder="What needs to be done?"
                      autoFocus
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Priority</label>
                      <select
                        value={newTask.priority}
                        onChange={e => setNewTask(prev => ({
                          ...prev,
                          priority: e.target.value as Task['priority']
                        }))}
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 
                                 focus:border-primary outline-none"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Estimate (hours)</label>
                      <input
                        type="number"
                        min="1"
                        value={newTask.estimate}
                        onChange={e => setNewTask(prev => ({ ...prev, estimate: e.target.value }))}
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 
                                 focus:border-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Assignee</label>
                      <select
                        value={newTask.assigneeId}
                        onChange={e => setNewTask(prev => ({ ...prev, assigneeId: e.target.value }))}
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 
                                 focus:border-primary outline-none"
                      >
                        <option value="">Select assignee</option>
                        {formData.teamMembers.map(member => (
                          <option key={member.id} value={member.id}>
                            {teamMembers.find(m => m.id === member.id)?.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <MagneticButton>
                      <button
                        onClick={() => {
                          setIsAddingTask(false);
                          setNewTask({
                            title: '',
                            priority: 'medium',
                            estimate: '',
                            assigneeId: ''
                          });
                        }}
                        className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        Cancel
                      </button>
                    </MagneticButton>
                    <MagneticButton>
                      <button
                        onClick={() => {
                          if (newTask.title && newTask.estimate && newTask.assigneeId) {
                            setFormData(prev => ({
                              ...prev,
                              tasks: [...prev.tasks, newTask]
                            }));
                            setIsAddingTask(false);
                            setNewTask({
                              title: '',
                              priority: 'medium',
                              estimate: '',
                              assigneeId: ''
                            });
                          }
                        }}
                        className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 
                                 transition-colors"
                        disabled={!newTask.title || !newTask.estimate || !newTask.assigneeId}
                      >
                        Add Task
                      </button>
                    </MagneticButton>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-4">
                <MagneticButton>
                  <button
                    onClick={() => setIsAddingTask(true)}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 
                             hover:bg-white/5 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Task Manually
                  </button>
                </MagneticButton>
                <MagneticButton>
                  <button
                    className="w-full px-4 py-3 rounded-xl border border-white/10 
                             hover:bg-white/5 transition-colors flex items-center gap-2"
                  >
                    <FileUp className="w-4 h-4" />
                    Import from Previous Sprint
                  </button>
                </MagneticButton>
                <MagneticButton>
                  <button
                    className="w-full px-4 py-3 rounded-xl border border-white/10 
                             hover:bg-white/5 transition-colors flex items-center gap-2"
                  >
                    <LinkIcon className="w-4 h-4" />
                    Import from Jira
                  </button>
                </MagneticButton>
              </div>
            )}

            <div className="space-y-4 mt-8">
              <div className="flex items-center justify-between p-4 rounded-xl bg-primary/10 
                            border border-primary/20">
                <span className="font-medium">Total Hours Planned</span>
                <span className="text-xl font-bold text-primary">{getPlannedHours()} hours</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-success/10 
                            border border-success/20">
                <span className="font-medium">Remaining Capacity</span>
                <span className="text-xl font-bold text-success">
                  {getTotalCapacity() - getPlannedHours()} hours
                </span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-warning/10 
                            border border-warning/20">
                <span className="font-medium">Tasks Added</span>
                <span className="text-xl font-bold text-warning">{formData.tasks.length}</span>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-3xl max-h-[90vh] overflow-hidden bg-card dark:bg-dark-card 
                     rounded-2xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Create New Sprint</h2>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <React.Fragment key={i}>
                        <div className={`w-2 h-2 rounded-full transition-colors ${
                          i + 1 === step ? 'bg-primary' : 'bg-white/20'
                        }`} />
                        {i < 2 && (
                          <div className="w-8 h-0.5 bg-white/10" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <MagneticButton>
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </MagneticButton>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    {renderStepContent()}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-between p-6 border-t border-white/10">
                <div className="text-sm text-text-secondary">
                  Step {step} of 3
                </div>
                <div className="flex items-center gap-3">
                  {step > 1 && (
                    <MagneticButton>
                      <button
                        type="button"
                        onClick={handleBack}
                        className="px-6 py-2 rounded-xl hover:bg-white/10 transition-colors"
                      >
                        Back
                      </button>
                    </MagneticButton>
                  )}
                  <MagneticButton>
                    <button
                      type={step === 3 ? 'submit' : 'button'}
                      onClick={step === 3 ? undefined : handleNext}
                      className="px-6 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 
                               transition-colors flex items-center gap-2"
                    >
                      {step === 3 ? (
                        <>
                          <Calendar className="w-4 h-4" />
                          Create Sprint
                        </>
                      ) : (
                        <>
                          Continue
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </MagneticButton>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
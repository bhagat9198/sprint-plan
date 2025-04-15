import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Users, Clock, Tag, Plus, Check, Hash, Send
} from 'lucide-react';
import { Task } from '../../types/sprint';
import { teamMembers } from '../../data/sprint';
import { useSprintStore } from '../../store/sprintStore';
import { MagneticButton } from '../ui/MagneticButton';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultColumnId?: string;
}

interface TaskFormData {
  title: string;
  description: string;
  assignees: string[];
  qaOwner: string;
  priority: Task['priority'];
  eta: string;
  startDate: string;
  dueDate: string;
  tags: string[];
  dependencies: string[];
  blockDependencies: boolean;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  defaultColumnId = 'on-track'
}) => {
  const addTask = useSprintStore((state) => state.addTask);
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    assignees: [],
    qaOwner: '',
    priority: 'medium',
    eta: '',
    startDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    tags: [],
    dependencies: [],
    blockDependencies: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentTag, setCurrentTag] = useState('');
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        description: '',
        assignees: [],
        qaOwner: '',
        priority: 'medium',
        eta: '',
        startDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        tags: [],
        dependencies: [],
        blockDependencies: false,
      });
      setErrors({});
      setStep(1);
    }
  }, [isOpen]);

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.title.trim()) {
          newErrors.title = 'Required';
        }
        break;
      case 2:
        if (formData.assignees.length === 0) {
          newErrors.assignees = 'Select at least one assignee';
        }
        break;
      case 3:
        if (!formData.eta) {
          newErrors.eta = 'Required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    const newTask: Task = {
      id: `${Date.now()}`,
      title: formData.title,
      description: formData.description,
      status: defaultColumnId,
      priority: formData.priority,
      assignee: teamMembers.find(member => member.id === formData.assignees[0])!,
      eta: formData.eta,
      dependencies: 0,
      comments: 0,
      blockers: 0,
      qaStatus: 'pending',
    };

    addTask(newTask, defaultColumnId);
    onClose();
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Hash className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-medium">Basic Details</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className={`w-full px-6 py-4 text-xl font-medium bg-transparent border-none outline-none placeholder-text-secondary/50 ${
                      errors.title ? 'text-critical' : ''
                    }`}
                    placeholder="What needs to be done?"
                    autoFocus
                  />
                  {errors.title && (
                    <span className="text-sm text-critical ml-6">{errors.title}</span>
                  )}
                </div>
                <div>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-6 py-3 bg-transparent border-none outline-none resize-none placeholder-text-secondary/50"
                    rows={3}
                    placeholder="Add a description..."
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-medium">Tags</h3>
              </div>
              <div className="px-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20
                               flex items-center gap-1.5 group"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          tags: prev.tags.filter((_, i) => i !== index)
                        }))}
                        className="opacity-0 group-hover:opacity-100 hover:text-critical transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={e => setCurrentTag(e.target.value)}
                    onKeyPress={e => {
                      if (e.key === 'Enter' && currentTag.trim()) {
                        e.preventDefault();
                        setFormData(prev => ({
                          ...prev,
                          tags: [...prev.tags, currentTag.trim()]
                        }));
                        setCurrentTag('');
                      }
                    }}
                    className="flex-1 bg-transparent border-none outline-none placeholder-text-secondary/50"
                    placeholder="Add tags..."
                  />
                  {currentTag.trim() && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          tags: [...prev.tags, currentTag.trim()]
                        }));
                        setCurrentTag('');
                      }}
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-medium">Assignment</h3>
              </div>
              <div className="space-y-2">
                {teamMembers.map(member => (
                  <label
                    key={member.id}
                    className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all
                               ${formData.assignees.includes(member.id)
                                 ? 'bg-primary/10 border border-primary/20'
                                 : 'hover:bg-white/5'}`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.assignees.includes(member.id)}
                      onChange={e => {
                        const isChecked = e.target.checked;
                        setFormData(prev => ({
                          ...prev,
                          assignees: isChecked
                            ? [...prev.assignees, member.id]
                            : prev.assignees.filter(id => id !== member.id)
                        }));
                      }}
                      className="hidden"
                    />
                    <div className="relative">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-12 h-12 rounded-full ring-2 ring-white/10"
                      />
                      {formData.assignees.includes(member.id) && (
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
                  </label>
                ))}
                {errors.assignees && (
                  <span className="text-sm text-critical">{errors.assignees}</span>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-medium">Time & Priority</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Priority Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['low', 'medium', 'high'] as const).map(priority => (
                      <button
                        key={priority}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, priority }))}
                        className={`p-4 rounded-xl border transition-all ${
                          formData.priority === priority
                            ? priority === 'high'
                              ? 'bg-critical/10 border-critical text-critical'
                              : priority === 'medium'
                              ? 'bg-warning/10 border-warning text-warning'
                              : 'bg-success/10 border-success text-success'
                            : 'border-white/10 hover:bg-white/5'
                        }`}
                      >
                        <div className="text-lg mb-1">
                          {priority === 'high' ? '🔥' : priority === 'medium' ? '⚡️' : '🌱'}
                        </div>
                        <div className="font-medium">
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Time Estimate</label>
                    <input
                      type="text"
                      value={formData.eta}
                      onChange={e => setFormData(prev => ({ ...prev, eta: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                        errors.eta ? 'border-critical' : 'border-white/10'
                      } focus:border-primary outline-none transition-colors`}
                      placeholder="e.g., 4h"
                    />
                    {errors.eta && (
                      <span className="text-sm text-critical mt-1">{errors.eta}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Due Date</label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={e => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 
                               focus:border-primary outline-none transition-colors"
                    />
                  </div>
                </div>
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
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-hidden bg-card dark:bg-dark-card rounded-2xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Create New Task</h2>
                  <div className="flex items-center gap-1 text-text-secondary">
                    {Array.from({ length: totalSteps }).map((_, i) => (
                      <React.Fragment key={i}>
                        <div className={`w-2 h-2 rounded-full transition-colors ${
                          i + 1 === step ? 'bg-primary' : 'bg-white/20'
                        }`} />
                        {i < totalSteps - 1 && (
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
                  Step {step} of {totalSteps}
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
                      type={step === totalSteps ? 'submit' : 'button'}
                      onClick={step === totalSteps ? undefined : handleNext}
                      className="px-6 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 
                               transition-colors flex items-center gap-2"
                    >
                      {step === totalSteps ? (
                        <>
                          <Send className="w-4 h-4" />
                          Create Task
                        </>
                      ) : (
                        'Continue'
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
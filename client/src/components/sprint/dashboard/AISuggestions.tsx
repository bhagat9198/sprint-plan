import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, UserCheck, Zap, Target } from 'lucide-react';
import { MagneticButton } from '../../ui/MagneticButton';

const suggestions = [
  {
    id: 1,
    icon: <UserCheck className="w-5 h-5" />,
    title: 'Reassign Task',
    description: 'Move "API Integration" to Mike to balance workload',
    impact: 'High Impact',
    type: 'workload',
  },
  {
    id: 2,
    icon: <Zap className="w-5 h-5" />,
    title: 'Boost Test Coverage',
    description: 'Add tests for authentication flow',
    impact: 'Medium Impact',
    type: 'quality',
  },
  {
    id: 3,
    icon: <Target className="w-5 h-5" />,
    title: 'Sprint Goal at Risk',
    description: 'Consider removing lower priority tasks',
    impact: 'High Impact',
    type: 'planning',
  },
];

export const AISuggestions: React.FC = () => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-primary dark:text-dark-primary" />
          <h2 className="text-xl font-semibold">AI Suggestions</h2>
        </div>
        <MagneticButton>
          <button className="text-sm text-primary dark:text-dark-primary hover:underline flex items-center gap-1">
            View History
            <ArrowRight className="w-4 h-4" />
          </button>
        </MagneticButton>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
        {suggestions.map((suggestion, index) => (
          <MagneticButton key={suggestion.id}>
            <motion.div
              className="glassmorphism rounded-xl p-6 min-w-[300px] cursor-pointer snap-start
                         hover:bg-white/5 dark:hover:bg-white/2 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-dark-primary/10 
                              flex items-center justify-center text-primary dark:text-dark-primary">
                  {suggestion.icon}
                </div>
                <div>
                  <h3 className="font-medium">{suggestion.title}</h3>
                  <span className="text-xs text-text-secondary dark:text-dark-text-secondary">
                    {suggestion.impact}
                  </span>
                </div>
              </div>
              <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-4">
                {suggestion.description}
              </p>
              <div className="flex justify-between items-center">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  suggestion.type === 'workload' ? 'bg-primary/20 text-primary' :
                  suggestion.type === 'quality' ? 'bg-success/20 text-success' :
                  'bg-warning/20 text-warning'
                }`}>
                  {suggestion.type}
                </span>
                <motion.div
                  className="w-8 h-8 rounded-full bg-primary/10 dark:bg-dark-primary/10 
                           flex items-center justify-center cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowRight className="w-4 h-4 text-primary dark:text-dark-primary" />
                </motion.div>
              </div>
            </motion.div>
          </MagneticButton>
        ))}
      </div>
    </div>
  );
};
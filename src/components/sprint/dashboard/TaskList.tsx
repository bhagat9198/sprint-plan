import React from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';

const tasks = [
  {
    id: 1,
    title: 'API Integration',
    status: 'in-progress',
    priority: 'high',
    timeLeft: '2h',
    description: 'Implement OAuth2 flow for user authentication',
    progress: 65,
  },
  {
    id: 2,
    title: 'Dashboard UI',
    status: 'blocked',
    priority: 'medium',
    timeLeft: '4h',
    description: 'Create responsive layout for analytics widgets',
    progress: 45,
  },
  {
    id: 3,
    title: 'Unit Tests',
    status: 'todo',
    priority: 'low',
    timeLeft: '3h',
    description: 'Write tests for new authentication methods',
    progress: 20,
  },
];

const statusIcons: Record<string, JSX.Element> = {
  'in-progress': <Clock className="w-5 h-5 text-warning" />,
  'blocked': <AlertCircle className="w-5 h-5 text-critical" />,
  'todo': <CheckCircle className="w-5 h-5 text-success" />,
};

export const TaskList: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Today's Focus</h2>
      <div className="space-y-4">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            className="group relative glassmorphism rounded-lg overflow-hidden cursor-pointer"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {/* Progress Bar Background */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent dark:from-dark-primary/5"
              style={{ width: `${task.progress}%` }}
            />
            
            <div className="relative p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center
                    ${task.status === 'blocked' ? 'bg-critical/10 text-critical' :
                      task.status === 'in-progress' ? 'bg-warning/10 text-warning' :
                      'bg-success/10 text-success'}`}
                  >
                    {statusIcons[task.status]}
                  </div>
                  <div>
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                      {task.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-text-secondary dark:text-dark-text-secondary" />
                    <span className="text-sm text-text-secondary dark:text-dark-text-secondary">
                      {task.timeLeft} remaining
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full
                    ${task.priority === 'high' ? 'bg-critical/20 text-critical' :
                      task.priority === 'medium' ? 'bg-warning/20 text-warning' :
                      'bg-success/20 text-success'}`}
                  >
                    {task.priority}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-text-secondary dark:text-dark-text-secondary">
                    Progress
                  </span>
                  <span className="font-medium">{task.progress}%</span>
                </div>
              </div>

              {/* Animated Progress Bar */}
              <motion.div 
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-success dark:from-dark-primary dark:to-dark-success"
                initial={{ width: 0 }}
                animate={{ width: `${task.progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
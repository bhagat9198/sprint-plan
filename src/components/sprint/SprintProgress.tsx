import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Timer, AlertTriangle } from 'lucide-react';
import { useSprintStore } from '../../store/sprintStore';

export const SprintProgress: React.FC = () => {
  const currentSprintId = useSprintStore((state) => state.currentSprintId);
  const sprints = useSprintStore((state) => state.sprints);
  const currentSprint = sprints.find(sprint => sprint.id === currentSprintId)!;
  
  const progress = Math.round((currentSprint.day / currentSprint.totalDays) * 100);
  const status = progress >= 80 ? '🧯 Fire!' : progress >= 50 ? '⏳ Getting tight' : '🚀 On track';
  const statusColor = progress >= 80 ? 'text-critical' : progress >= 50 ? 'text-warning' : 'text-success';

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Sprint Progress</h2>
        <div className={`flex items-center gap-2 ${statusColor}`}>
          <span className="text-lg">{status}</span>
        </div>
      </div>

      <div className="relative w-48 h-48 mx-auto">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            className="stroke-current text-text-disabled dark:text-dark-text-disabled"
            strokeWidth="12"
            fill="none"
          />
          <motion.circle
            cx="96"
            cy="96"
            r="88"
            className="stroke-current text-primary dark:text-dark-primary"
            strokeWidth="12"
            fill="none"
            strokeDasharray={553}
            initial={{ strokeDashoffset: 553 }}
            animate={{ strokeDashoffset: 553 * (1 - progress / 100) }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold">{progress}%</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-8">
        {[
          { icon: <Rocket className="w-5 h-5" />, label: 'Velocity', value: '24 pts' },
          { icon: <Timer className="w-5 h-5" />, label: 'Time Left', value: `${currentSprint.totalDays - currentSprint.day} days` },
          { icon: <AlertTriangle className="w-5 h-5" />, label: 'Blockers', value: '2' },
        ].map((stat, index) => (
          <div key={index} className="text-center">
            <div className="flex items-center justify-center mb-2 text-primary dark:text-dark-primary">
              {stat.icon}
            </div>
            <div className="text-sm text-text-secondary dark:text-dark-text-secondary">
              {stat.label}
            </div>
            <div className="font-semibold">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
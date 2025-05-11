import React from 'react';
import { motion } from 'framer-motion';
import { ViewOption, ViewType } from '../../types/sprint';
import { MagneticButton } from '../ui/MagneticButton';

interface ViewSwitcherProps {
  views: ViewOption[];
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({
  views,
  activeView,
  onViewChange,
}) => {
  return (
    <div className="flex items-center gap-1 bg-white/5 dark:bg-white/2 rounded-xl p-1">
      {views.map((view) => (
        <MagneticButton key={view.value}>
          <button
            onClick={() => onViewChange(view.value)}
            className="relative px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <span className="relative z-10 flex items-center gap-2 text-sm">
              {view.icon}
              {view.label}
            </span>
            {activeView === view.value && (
              <motion.div
                layoutId="activeView"
                className="absolute inset-0 bg-primary dark:bg-dark-primary rounded-lg"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        </MagneticButton>
      ))}
    </div>
  );
};
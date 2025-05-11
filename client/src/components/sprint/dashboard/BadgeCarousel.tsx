import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Zap, Target } from 'lucide-react';

const badges = [
  {
    id: 1,
    icon: <Star className="w-6 h-6" />,
    name: 'Sprint Champion',
    description: 'Completed all tasks before deadline',
    date: '2 days ago',
    color: 'text-warning',
    bgColor: 'bg-warning/5',
    borderColor: 'border-warning/20',
    glowColor: 'shadow-warning/20',
  },
  {
    id: 2,
    icon: <Zap className="w-6 h-6" />,
    name: 'Quick Resolver',
    description: 'Resolved 5 blockers in one day',
    date: '1 week ago',
    color: 'text-primary',
    bgColor: 'bg-primary/5',
    borderColor: 'border-primary/20',
    glowColor: 'shadow-primary/20',
  },
  {
    id: 3,
    icon: <Target className="w-6 h-6" />,
    name: 'Perfect Planning',
    description: '100% sprint completion rate',
    date: '2 weeks ago',
    color: 'text-success',
    bgColor: 'bg-success/5',
    borderColor: 'border-success/20',
    glowColor: 'shadow-success/20',
  },
];

export const BadgeCarousel: React.FC = () => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Award className="w-6 h-6 text-primary dark:text-dark-primary" />
          <h2 className="text-xl font-semibold">Recent Achievements</h2>
        </div>
        <span className="text-sm text-text-secondary dark:text-dark-text-secondary">
          {badges.length} badges earned
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {badges.map((badge, index) => (
          <motion.div
            key={badge.id}
            className={`relative overflow-hidden rounded-xl border ${badge.borderColor}
                       backdrop-blur-sm ${badge.bgColor} cursor-pointer
                       transition-all duration-300 group`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative z-10 p-4">
              <div className="flex items-center gap-4">
                <motion.div
                  className={`w-12 h-12 rounded-xl ${badge.bgColor} ${badge.color}
                             flex items-center justify-center border ${badge.borderColor}`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {badge.icon}
                </motion.div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{badge.name}</h3>
                    <span className="text-xs text-text-secondary dark:text-dark-text-secondary">
                      {badge.date}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary dark:text-dark-text-secondary mt-1">
                    {badge.description}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Animated gradient background */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 
                           transition-opacity duration-300 pointer-events-none`}>
              <div className={`absolute inset-0 ${badge.bgColor} opacity-20`} />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
                            animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
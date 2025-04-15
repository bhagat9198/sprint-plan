import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Home, BarChart2, Layout } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useSprintStore } from '../../store/sprintStore';

const getMenuItems = (sprintId: string | undefined) => [
  { icon: <Home className="w-5 h-5" />, label: 'Dashboard', path: '/dashboard' },
  ...(sprintId ? [
    { icon: <BarChart2 className="w-5 h-5" />, label: 'Sprint Overview', path: `/sprint/${sprintId}` },
    { icon: <Layout className="w-5 h-5" />, label: 'Sprint Board', path: `/sprint/${sprintId}/board` },
  ] : [])
];

export const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const { sprintId } = useParams<{ sprintId: string }>();
  const currentSprintId = useSprintStore((state) => state.currentSprintId);

  // Use either the route param or the current sprint from store
  const activeSprint = sprintId || currentSprintId || undefined;
  const menuItems = getMenuItems(activeSprint);

  return (
    <nav
      className={`fixed left-0 top-0 h-full z-40 transition-[width] duration-300 ease-in-out
                  ${isExpanded ? 'w-64' : 'w-16'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Glassmorphism Background with Gradient Border */}
      <div className="absolute inset-0 glassmorphism">
        <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative h-full flex flex-col py-6 px-4">
        {/* Logo Section */}
        <Link to="/" className="mb-8">
          <MagneticButton>
            <div className="flex items-center justify-center">
              <div className="relative">
                <Timer className="w-8 h-8 text-primary dark:text-dark-primary" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-success dark:bg-dark-success rounded-full pulse-effect" />
              </div>
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="ml-3 text-lg font-montserrat font-bold whitespace-nowrap"
                  >
                    SprintMaster
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </MagneticButton>
        </Link>

        {/* Navigation Links */}
        <div className="flex-1 flex flex-col gap-2">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link to={item.path} key={index}>
                <MagneticButton>
                  <motion.div
                    className={`flex items-center p-3 rounded-xl transition-colors relative
                               ${isActive 
                                 ? 'text-primary dark:text-dark-primary' 
                                 : 'text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary'}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Icon */}
                    <span className="relative z-10">{item.icon}</span>

                    {/* Label */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="ml-3 text-sm font-medium whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* Active Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavItem"
                        className="absolute inset-0 rounded-xl bg-primary/10 dark:bg-dark-primary/10"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </motion.div>
                </MagneticButton>
              </Link>
            );
          })}
        </div>

        {/* User Section */}
        <div className="mt-auto pt-4 border-t border-white/10">
          <MagneticButton>
            <motion.div
              className="flex items-center p-2 rounded-xl hover:bg-white/5 dark:hover:bg-white/2 transition-colors cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="User"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white/20"
              />
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="ml-3"
                  >
                    <div className="text-sm font-medium">Sarah Kim</div>
                    <div className="text-xs text-text-secondary dark:text-dark-text-secondary">
                      Product Manager
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </MagneticButton>
        </div>
      </div>
    </nav>
  );
};
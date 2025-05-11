import React from 'react';
import { Bell, Sun, Moon } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import { useThemeStore } from '../../store/themeStore';

export const Header: React.FC = () => {
  const { isDark, toggleTheme } = useThemeStore();
  const [notifications, setNotifications] = React.useState(3);

  return (
    <header className="fixed top-0 left-16 right-0 z-30 glassmorphism">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-xl font-montserrat">Welcome back, Sarah 👋</h1>

        <div className="flex items-center gap-4">
          <MagneticButton>
            <button
              className="relative p-2 rounded-full hover:bg-white/10 dark:hover:bg-white/5"
              onClick={() => setNotifications(0)}
            >
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-critical dark:bg-dark-critical rounded-full text-white text-xs flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
          </MagneticButton>

          <MagneticButton>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-white/10 dark:hover:bg-white/5"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </MagneticButton>

          <MagneticButton>
            <button className="flex items-center gap-2">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="User"
                className="w-8 h-8 rounded-full object-cover"
              />
            </button>
          </MagneticButton>
        </div>
      </div>
    </header>
  );
};
import React from 'react';
import { Link } from 'react-router-dom';
import { Timer, Sun, Moon, Rocket } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import { useThemeStore } from '../../store/themeStore';

export const Navigation: React.FC = () => {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <nav className="fixed w-full glassmorphism z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/">
            <MagneticButton>
              <div className="flex items-center">
                <Timer className="w-8 h-8 text-primary dark:text-dark-primary pulse-effect" />
                <span className="ml-2 font-montserrat font-bold text-xl">SprintMaster</span>
              </div>
            </MagneticButton>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <MagneticButton>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-white/10 dark:hover:bg-white/5"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </MagneticButton>
            <MagneticButton>
              <Link to="/dashboard">
                <button className="btn-primary card-shine">
                  <Rocket className="w-4 h-4" />
                  Get Started Free
                </button>
              </Link>
            </MagneticButton>
          </div>
        </div>
      </div>
    </nav>
  );
};
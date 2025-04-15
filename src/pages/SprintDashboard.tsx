import React from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { SprintProgress } from '../components/sprint/dashboard/SprintProgress';
import { TaskList } from '../components/sprint/dashboard/TaskList';
import { TeamWorkload } from '../components/sprint/dashboard/TeamWorkload';
import { RiskAlerts } from '../components/sprint/dashboard/RiskAlerts';
import { AISuggestions } from '../components/sprint/dashboard/AISuggestions';
import { BadgeCarousel } from '../components/sprint/dashboard/BadgeCarousel';
import { Analytics } from '../components/sprint/dashboard/Analytics';
import { GlowingCard } from '../components/ui/GlowingCard';
import { useParams, useNavigate } from 'react-router-dom';
import { useSprintStore } from '../store/sprintStore';
import { Layout, ArrowRight, Calendar, Timer } from 'lucide-react';
import { MagneticButton } from '../components/ui/MagneticButton';
import { motion } from 'framer-motion';

export const SprintDashboard: React.FC = () => {
  const { sprintId } = useParams<{ sprintId: string }>();
  const sprints = useSprintStore((state) => state.sprints);
  const setCurrentSprint = useSprintStore((state) => state.setCurrentSprint);
  const navigate = useNavigate();

  const currentSprint = sprints.find(sprint => sprint.id === sprintId);

  React.useEffect(() => {
    if (sprintId) {
      setCurrentSprint(sprintId);
    }
  }, [sprintId, setCurrentSprint]);

  // If no sprint found, redirect to dashboard
  React.useEffect(() => {
    if (!currentSprint) {
      navigate('/dashboard');
    }
  }, [currentSprint, navigate]);

  const handleNavigateToBoard = () => {
    navigate(`/sprint/${sprintId}/board`);
  };

  if (!currentSprint) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background dark:bg-dark-background">
      {/* Ambient Time Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-success/20 to-primary/20 animate-gradient z-50" />

      {/* Layout */}
      <Sidebar />
      <Header />

      {/* Main Content */}
      <main className="pt-20 pl-20">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header with Sprint Info & Actions */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <motion.h1 
                  className="text-3xl font-montserrat font-bold mb-2"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {currentSprint.name}
                </motion.h1>
                <motion.div 
                  className="flex items-center gap-4 text-text-secondary"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(currentSprint.startDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric'
                    })} - {new Date(currentSprint.endDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4" />
                    <span>Day {currentSprint.day} of {currentSprint.totalDays}</span>
                  </div>
                </motion.div>
              </div>
              <div className="flex items-center gap-3">
                <MagneticButton>
                  <button
                    onClick={handleNavigateToBoard}
                    className="btn-primary card-shine"
                  >
                    <Layout className="w-4 h-4" />
                    View Board
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </MagneticButton>
              </div>
            </div>

            {/* Sprint Progress Bar */}
            <motion.div 
              className="relative h-2 bg-white/5 rounded-full overflow-hidden mt-6"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-success"
                initial={{ width: 0 }}
                animate={{ width: `${(currentSprint.day / currentSprint.totalDays) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              />
            </motion.div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sprint Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <GlowingCard>
                <SprintProgress />
              </GlowingCard>
            </motion.div>

            {/* Today's Focus */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlowingCard>
                <TaskList />
              </GlowingCard>
            </motion.div>

            {/* Team Workload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <GlowingCard>
                <TeamWorkload />
              </GlowingCard>
            </motion.div>

            {/* Risk Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <GlowingCard>
                <RiskAlerts />
              </GlowingCard>
            </motion.div>

            {/* AI Suggestions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-3"
            >
              <GlowingCard>
                <AISuggestions />
              </GlowingCard>
            </motion.div>

            {/* Badge Carousel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <GlowingCard>
                <BadgeCarousel />
              </GlowingCard>
            </motion.div>

            {/* Analytics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="lg:col-span-2"
            >
              <GlowingCard>
                <Analytics />
              </GlowingCard>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Timer, Calendar, Users, ArrowRight, CheckCircle2, Clock, AlertTriangle, TrendingUp, TrendingDown, BarChart2, Brain, Search,
  X
} from 'lucide-react';
import { MagneticButton } from '../components/ui/MagneticButton';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { CreateSprintModal } from '../components/sprint/CreateSprintModal';
import { useSprintStore } from '../store/sprintStore';
import { Sprint } from '../types/sprint';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { GlowingCard } from '../components/ui/GlowingCard';

export const Dashboard: React.FC = () => {
  const sprints = useSprintStore((state) => state.sprints);
  const getSprintHealthMetrics = useSprintStore((state) => state.getSprintHealthMetrics);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'upcoming' | 'completed'>('all');
  // const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCompactMode, setIsCompactMode] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const getSprintStatusColor = (status: Sprint['status']) => {
    switch (status) {
      case 'active':
        return 'bg-success/20 text-success border-success/20';
      case 'upcoming':
        return 'bg-warning/20 text-warning border-warning/20';
      case 'completed':
        return 'bg-primary/20 text-primary border-primary/20';
    }
  };

  const getHealthColor = (value: number) => {
    if (value >= 80) return 'text-success';
    if (value >= 60) return 'text-warning';
    return 'text-critical';
  };

  const filteredSprints = sprints
    .filter(sprint => {
      if (selectedFilter === 'all') return true;
      return sprint.status === selectedFilter;
    })
    .filter(sprint => 
      sprint.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sprint.status.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const healthMetrics = getSprintHealthMetrics();

  const healthPercentages = {
    onTrack: Math.round(healthMetrics.onTrack / healthMetrics.total),
    slightDelay: Math.round(healthMetrics.slightDelay / healthMetrics.total),
    critical: Math.round(healthMetrics.critical / healthMetrics.total),
  };

  const trendData = {
    labels: ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4', 'Sprint 5'],
    datasets: [
      {
        label: 'Delivery Success',
        data: [85, 88, 92, 87, 90],
        borderColor: '#4A90E2',
        tension: 0.4,
        fill: false,
      },
      {
        label: 'Team Velocity',
        data: [24, 28, 32, 30, 34],
        borderColor: '#34C759',
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-background dark:bg-dark-background">
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-success/20 to-primary/20 animate-gradient z-50" />

      <Sidebar />
      <Header />

      <main className="pt-20 pl-20">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-montserrat font-bold mb-2">Sprint Overview</h1>
              <p className="text-text-secondary">Strategic view of all sprint activities and health metrics</p>
            </div>
            <div className="flex items-center gap-3">
              <MagneticButton>
                <button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 
                                 flex items-center gap-2 transition-colors">
                  <Calendar className="w-4 h-4" />
                  Plan New Sprint
                </button>
              </MagneticButton>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            {[
              { 
                icon: <CheckCircle2 className="w-5 h-5 text-success" />,
                label: 'On Track',
                value: `${healthPercentages.onTrack}%`,
                trend: +5,
              },
              {
                icon: <Clock className="w-5 h-5 text-warning" />,
                label: 'Slight Delay',
                value: `${healthPercentages.slightDelay}%`,
                trend: -2,
              },
              {
                icon: <AlertTriangle className="w-5 h-5 text-critical" />,
                label: 'Critical',
                value: `${healthPercentages.critical}%`,
                trend: -3,
              },
            ].map((metric, index) => (
              <GlowingCard key={index} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                      {metric.icon}
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{metric.value}</div>
                      <div className="text-text-secondary">{metric.label}</div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 ${
                    metric.trend > 0 ? 'text-success' : 'text-critical'
                  }`}>
                    {metric.trend > 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>{Math.abs(metric.trend)}%</span>
                  </div>
                </div>
              </GlowingCard>
            ))}
          </div>

          <GlowingCard className="mb-8 p-6">
            <div className="flex items-center gap-3 mb-6">
              <BarChart2 className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold">Sprint Performance Trends</h2>
            </div>
            <div className="h-[300px]">
              <Line data={trendData} options={chartOptions} />
            </div>
          </GlowingCard>

          <div className="mb-8 flex items-center gap-4">
            <GlowingCard className="flex-1 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold">AI Insights</h2>
              </div>
              <div className="text-text-secondary">
                🧠 Based on current trends, Sprint Beta might need load balancing. 2 developers are showing signs of overload.
              </div>
            </GlowingCard>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-4">
              <div className="dashboard-search">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search sprints..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="filter-group">
                {(['all', 'active', 'upcoming', 'completed'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`filter-button ${selectedFilter === filter
                        ? 'bg-primary/10 border-primary text-primary'
                        : ''
                      }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsCompactMode(!isCompactMode)}
                className="view-toggle"
              >
                {isCompactMode ? 'Standard View' : 'Compact View'}
              </button>
            </div>

            {activeFilters.length > 0 && (
              <div className="flex items-center gap-2 mt-4">
                {activeFilters.map((filter, index) => (
                  <div key={index} className="filter-tag">
                    <span>{filter}</span>
                    <button
                      onClick={() => {
                        setActiveFilters(prev => prev.filter(f => f !== filter));
                      }}
                    >
                      <X className="remove-icon" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-6">
            {filteredSprints.map((sprint) => (
              <Link key={sprint.id} to={`/sprint/${sprint.id}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative overflow-hidden glassmorphism p-6 rounded-xl cursor-pointer group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="absolute inset-0 border border-white/10 rounded-xl group-hover:border-primary/20 
                                transition-colors duration-300" />

                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
                                translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <motion.h3 
                          className="text-xl font-semibold group-hover:text-primary transition-colors"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          {sprint.name}
                        </motion.h3>
                        <div className="flex items-center gap-4 mt-1 text-text-secondary">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(sprint.startDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric'
                            })} - {new Date(sprint.endDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric'
                            })}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Timer className="w-4 h-4" />
                            <span>Day {sprint.day} of {sprint.totalDays}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-sm border ${getSprintStatusColor(sprint.status)}`}>
                          {sprint.status.charAt(0).toUpperCase() + sprint.status.slice(1)}
                        </span>
                        <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 text-primary transition-all 
                                             transform group-hover:translate-x-1" />
                      </div>
                    </div>

                    <div className="relative h-2 bg-white/5 rounded-full overflow-hidden mb-6">
                      <motion.div
                        className="absolute left-0 top-0 h-full rounded-full"
                        style={{
                          background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-success) 100%)',
                          width: `${sprint.progress}%`
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${sprint.progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/10 
                                      animate-shimmer" />
                      </motion.div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      {[
                        { icon: <Users className="w-4 h-4" />, label: 'Team Size', value: sprint.teamSize },
                        { icon: <CheckCircle2 className="w-4 h-4" />, label: 'Completed', value: sprint.completedTasks },
                        { icon: <Clock className="w-4 h-4" />, label: 'In Progress', value: sprint.inProgressTasks },
                        { icon: <AlertTriangle className="w-4 h-4" />, label: 'Blockers', value: sprint.blockers },
                      ].map((stat, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-lg bg-white/5 group-hover:bg-white/10 
                                   transition-colors"
                          whileHover={{ scale: 1.05 }}
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center 
                                        text-primary group-hover:bg-primary/20 transition-colors">
                            {stat.icon}
                          </div>
                          <div>
                            <div className="font-medium">{stat.value}</div>
                            <div className="text-sm text-text-secondary">{stat.label}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
                      {[
                        { value: sprint.health.onTrack, label: 'On Track' },
                        { value: sprint.health.slightDelay, label: 'Delayed' },
                        { value: sprint.health.critical, label: 'Critical' }
                      ].map((health, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <motion.div 
                            className={`w-2 h-2 rounded-full ${getHealthColor(health.value)}`}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                          <span className="text-sm text-text-secondary">
                            {health.value}% {health.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <CreateSprintModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};
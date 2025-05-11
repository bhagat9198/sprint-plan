import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, ArrowUpRight, Activity, TrendingDown } from 'lucide-react';

const alerts = [
  {
    id: 1,
    title: 'API Integration Delayed',
    description: 'OAuth2 implementation blocked by external dependency',
    severity: 'high',
    timeAgo: '2h ago',
    impact: 'Critical Path',
    type: 'dependency',
    trend: -15,
  },
  {
    id: 2,
    title: 'Test Coverage Below Threshold',
    description: 'Current coverage at 78%, target is 85%',
    severity: 'medium',
    timeAgo: '4h ago',
    impact: 'Quality Gate',
    type: 'quality',
    trend: -7,
  },
  {
    id: 3,
    title: 'Performance Regression',
    description: 'Dashboard load time increased by 25%',
    severity: 'high',
    timeAgo: '1h ago',
    impact: 'User Experience',
    type: 'performance',
    trend: -25,
  },
];

const getAlertStyles = (type: string) => {
  const baseStyles = 'absolute inset-0 opacity-20';
  
  switch (type) {
    case 'dependency':
      return `${baseStyles} bg-critical/10 dark:bg-dark-critical/10`;
    case 'quality':
      return `${baseStyles} bg-warning/10 dark:bg-dark-warning/10`;
    case 'performance':
      return `${baseStyles} bg-primary/10 dark:bg-dark-primary/10`;
    default:
      return `${baseStyles} bg-critical/10 dark:bg-dark-critical/10`;
  }
};

export const RiskAlerts: React.FC = () => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-critical dark:text-dark-critical" />
          <h2 className="text-xl font-semibold">Risk Alerts</h2>
        </div>
        <span className="text-sm text-text-secondary dark:text-dark-text-secondary">
          {alerts.length} active
        </span>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative overflow-hidden rounded-lg cursor-pointer group"
          >
            {/* Background with dynamic color based on type */}
            <div className={getAlertStyles(alert.type)} />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" 
                 style={{ backgroundSize: '200% 100%' }} />

            {/* Content */}
            <div className="relative p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{alert.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full
                      ${alert.severity === 'high' 
                        ? 'bg-critical/20 text-critical dark:bg-dark-critical/20 dark:text-dark-critical' 
                        : 'bg-warning/20 text-warning dark:bg-dark-warning/20 dark:text-dark-warning'}`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                    {alert.description}
                  </p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 45 }}
                  className="ml-4"
                >
                  <ArrowUpRight className="w-5 h-5 text-text-secondary dark:text-dark-text-secondary" />
                </motion.div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-xs text-text-secondary dark:text-dark-text-secondary">
                    <Clock className="w-4 h-4" />
                    {alert.timeAgo}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-secondary dark:text-dark-text-secondary">
                    <Activity className="w-4 h-4" />
                    {alert.impact}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingDown className={`w-4 h-4 ${
                    Math.abs(alert.trend) > 20 
                      ? 'text-critical dark:text-dark-critical' 
                      : 'text-warning dark:text-dark-warning'
                  }`} />
                  <span className="text-xs font-medium">{alert.trend}%</span>
                </div>
              </div>

              {/* Animated border */}
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-critical via-warning to-critical dark:from-dark-critical dark:via-dark-warning dark:to-dark-critical"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
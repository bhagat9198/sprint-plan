import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart2, TrendingUp, Clock, AlertCircle 
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type MetricType = 'velocity' | 'accuracy' | 'blockers';

interface MetricData {
  label: string;
  value: number;
  change: number;
}

const metrics: Record<MetricType, MetricData[]> = {
  velocity: [
    { label: 'Mon', value: 24, change: -1 },
    { label: 'Tue', value: 28, change: 1 },
    { label: 'Wed', value: 32, change: -2 },
    { label: 'Thu', value: 35, change: -1 },
    { label: 'Fri', value: 30, change: 1 },
  ],
  accuracy: [
    { label: 'Mon', value: 92, change: -1 },
    { label: 'Tue', value: 88, change: 1 },
    { label: 'Wed', value: 95, change: -2 },
    { label: 'Thu', value: 98, change: -1 },
    { label: 'Fri', value: 96, change: 1 },
  ],
  blockers: [
    { label: 'Mon', value: 3, change: -1 },
    { label: 'Tue', value: 4, change: 1 },
    { label: 'Wed', value: 2, change: -2 },
    { label: 'Thu', value: 1, change: -1 },
    { label: 'Fri', value: 2, change: 1 },
  ],
};

const tabs: { id: MetricType; label: string; icon: JSX.Element }[] = [
  { id: 'velocity', label: 'Velocity', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'accuracy', label: 'Accuracy', icon: <Clock className="w-4 h-4" /> },
  { id: 'blockers', label: 'Blockers', icon: <AlertCircle className="w-4 h-4" /> },
];

const getMetricColor = (type: MetricType) => {
  switch (type) {
    case 'velocity':
      return { base: '#4A90E2', light: 'rgba(74, 144, 226, 0.1)' };
    case 'accuracy':
      return { base: '#34C759', light: 'rgba(52, 199, 89, 0.1)' };
    case 'blockers':
      return { base: '#FF3B30', light: 'rgba(255, 59, 48, 0.1)' };
  }
};

const VelocityChart: React.FC<{ data: MetricData[]; color: { base: string; light: string } }> = ({ data, color }) => {
  const chartData = {
    labels: data.map(d => d.label),
    datasets: [
      {
        label: 'Velocity',
        data: data.map(d => d.value),
        fill: true,
        borderColor: color.base,
        backgroundColor: color.light,
        tension: 0.4,
        pointBackgroundColor: color.base,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: color.base,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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
    <div className="h-[300px] w-full">
      <Line data={chartData} options={options} />
    </div>
  );
};

const AccuracyChart: React.FC<{ data: MetricData[]; color: { base: string; light: string } }> = ({ data, color }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const average = total / data.length;
  
  const chartData = {
    labels: ['Accuracy', 'Remaining'],
    datasets: [
      {
        data: [average, 100 - average],
        backgroundColor: [color.base, color.light],
        borderColor: ['transparent', 'transparent'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="h-[300px] w-full relative">
      <Doughnut data={chartData} options={options} />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-bold" style={{ color: color.base }}>
          {Math.round(average)}%
        </span>
      </div>
    </div>
  );
};

const BlockersChart: React.FC<{ data: MetricData[]; color: { base: string; light: string } }> = ({ data, color }) => {
  const chartData = {
    labels: data.map(d => d.label),
    datasets: [
      {
        label: 'Blockers',
        data: data.map(d => d.value),
        backgroundColor: color.base,
        borderColor: 'transparent',
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="h-[300px] w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MetricType>('velocity');
  const metricColor = getMetricColor(activeTab);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BarChart2 className="w-6 h-6 text-primary dark:text-dark-primary" />
          <h2 className="text-xl font-semibold">Sprint Analytics</h2>
        </div>
      </div>

      <div className="flex gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                       ${activeTab === tab.id 
                         ? 'text-white' 
                         : 'text-text-secondary dark:text-dark-text-secondary hover:text-text-primary'}`}
          >
            <span className="relative z-10 flex items-center gap-2">
              {tab.icon}
              {tab.label}
            </span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: metricColor.base }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white/5 dark:bg-black/5 rounded-xl p-4 relative"
        >
          {activeTab === 'velocity' && (
            <VelocityChart data={metrics.velocity} color={metricColor} />
          )}
          {activeTab === 'accuracy' && (
            <AccuracyChart data={metrics.accuracy} color={metricColor} />
          )}
          {activeTab === 'blockers' && (
            <BlockersChart data={metrics.blockers} color={metricColor} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
import { BarChart3, Brain, Zap, Target } from 'lucide-react';
import { Feature } from '../types';

export const features: Feature[] = [
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Real-Time Daily Tracking",
    description: "Monitor sprint progress with live updates and instant notifications.",
    stats: ["24/7 Monitoring", "99.9% Uptime", "2ms Latency"],
    benefits: ["Instant Updates", "Smart Alerts", "Team Sync"]
  },
  {
    icon: <Brain className="w-8 h-8" />,
    title: "AI-Powered Risk Analyzer",
    description: "Predict bottlenecks before they happen with ML insights.",
    stats: ["95% Accuracy", "3hr Early Warning", "Auto-mitigation"],
    benefits: ["Risk Prevention", "Smart Analysis", "Trend Detection"]
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Smart Reassignment",
    description: "Auto-balance workload based on team capacity and priorities.",
    stats: ["5min Response", "100% Coverage", "AI-powered"],
    benefits: ["Load Balancing", "Priority Queue", "Smart Routing"]
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: "Gamified Team Metrics",
    description: "Drive engagement with achievement badges and leaderboards.",
    stats: ["500+ Badges", "Daily Rewards", "Team Ranks"],
    benefits: ["Engagement Boost", "Skill Tracking", "Team Building"]
  }
];
import React from 'react';
import { ArrowUpRight, Gauge, Trophy, Lightbulb } from 'lucide-react';
import { FlipCard } from '../ui/FlipCard';
import { Feature } from '../../types';

interface FeatureCardProps {
  feature: Feature;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
  return (
    <FlipCard
      front={
        <div className="feature-card h-full">
          <div className="text-primary dark:text-dark-primary mb-4 pulse-effect">
            {feature.icon}
          </div>
          <h3 className="font-montserrat font-semibold text-xl mb-2">
            {feature.title}
          </h3>
          <p className="text-text-secondary dark:text-dark-text-secondary">
            {feature.description}
          </p>
          <div className="absolute bottom-6 right-6">
            <ArrowUpRight className="w-5 h-5 text-primary dark:text-dark-primary" />
          </div>
        </div>
      }
      back={
        <div className="feature-card-back h-full">
          <h3 className="font-montserrat font-semibold text-xl mb-4 text-primary dark:text-dark-primary">
            Key Metrics
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-primary dark:text-dark-primary" />
              <span>{feature.stats[0]}</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary dark:text-dark-primary" />
              <span>{feature.stats[1]}</span>
            </div>
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary dark:text-dark-primary" />
              <span>{feature.stats[2]}</span>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Benefits</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {feature.benefits.map((benefit, i) => (
                <li key={i}>{benefit}</li>
              ))}
            </ul>
          </div>
        </div>
      }
    />
  );
};
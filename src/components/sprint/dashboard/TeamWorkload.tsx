import React from 'react';
import { motion } from 'framer-motion';
import { Users, ArrowRight } from 'lucide-react';
import { MagneticButton } from '../../ui/MagneticButton';

const teamMembers = [
  {
    id: 1,
    name: 'Alex Chen',
    role: 'Frontend Dev',
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    workload: 85,
    tasks: 8,
  },
  {
    id: 2,
    name: 'Sarah Kim',
    role: 'UX Designer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    workload: 60,
    tasks: 5,
  },
  {
    id: 3,
    name: 'Mike Ross',
    role: 'Backend Dev',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    workload: 45,
    tasks: 4,
  },
  {
    id: 4,
    name: 'Emma Wilson',
    role: 'Product Manager',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    workload: 75,
    tasks: 6,
  },
];

const getWorkloadColor = (workload: number) => {
  if (workload >= 80) return 'bg-critical/20 text-critical';
  if (workload >= 60) return 'bg-warning/20 text-warning';
  return 'bg-success/20 text-success';
};

export const TeamWorkload: React.FC = () => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-primary dark:text-dark-primary" />
          <h2 className="text-xl font-semibold">Team Workload</h2>
        </div>
        <MagneticButton>
          <button className="text-sm text-primary dark:text-dark-primary hover:underline flex items-center gap-1">
            View All
            <ArrowRight className="w-4 h-4" />
          </button>
        </MagneticButton>
      </div>

      <div className="grid gap-4">
        {teamMembers.map((member) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="glassmorphism rounded-lg p-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{member.name}</h3>
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                      {member.role}
                    </p>
                  </div>
                  <span className={`text-sm px-2 py-1 rounded-full ${getWorkloadColor(member.workload)}`}>
                    {member.workload}%
                  </span>
                </div>
                <div className="mt-2 relative h-2 bg-input dark:bg-dark-input rounded-full overflow-hidden">
                  <motion.div
                    className={`absolute left-0 top-0 h-full rounded-full ${
                      member.workload >= 80 ? 'bg-critical' :
                      member.workload >= 60 ? 'bg-warning' :
                      'bg-success'
                    }`}
                    initial={{ width: '0%' }}
                    animate={{ width: `${member.workload}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <div className="mt-2 text-sm text-text-secondary dark:text-dark-text-secondary">
                  {member.tasks} active tasks
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
import { CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { Column, Task, TeamMember } from '../types/sprint';

export const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Alex Chen',
    role: 'Frontend Dev',
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '2',
    name: 'Sarah Kim',
    role: 'UX Designer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '3',
    name: 'Mike Ross',
    role: 'Backend Dev',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '4',
    name: 'Emma Wilson',
    role: 'Product Manager',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

export const getColumnIcon = (columnId: string) => {
  switch (columnId) {
    case 'on-track':
      return <CheckCircle className="w-5 h-5" />;
    case 'slight-delay':
      return <Clock className="w-5 h-5" />;
    case 'critical-delay':
      return <AlertTriangle className="w-5 h-5" />;
    default:
      return <CheckCircle className="w-5 h-5" />;
  }
};

export const getColumnColor = (columnId: string) => {
  switch (columnId) {
    case 'on-track':
      return 'text-success dark:text-dark-success';
    case 'slight-delay':
      return 'text-warning dark:text-dark-warning';
    case 'critical-delay':
      return 'text-critical dark:text-dark-critical';
    default:
      return 'text-success dark:text-dark-success';
  }
};

export const columnData = [
  {
    id: 'on-track',
    title: 'On Track',
  },
  {
    id: 'slight-delay',
    title: 'Slight Delay',
  },
  {
    id: 'critical-delay',
    title: 'Critical Delay',
  },
];

export const initialTasks: Task[] = [
  {
    id: '1',
    title: 'User Authentication Flow',
    description: 'Implement OAuth2 with social providers',
    status: 'on-track',
    priority: 'high',
    assignee: teamMembers[0],
    eta: '2h',
    dependencies: 2,
    comments: 5,
    blockers: 0,
    qaStatus: 'pending',
  },
  {
    id: '2',
    title: 'Dashboard Analytics',
    description: 'Implement real-time data visualization',
    status: 'on-track',
    priority: 'medium',
    assignee: teamMembers[1],
    eta: '4h',
    dependencies: 1,
    comments: 3,
    blockers: 0,
    qaStatus: 'pending',
  },
  {
    id: '3',
    title: 'API Documentation',
    description: 'Update Swagger docs for new endpoints',
    status: 'slight-delay',
    priority: 'low',
    assignee: teamMembers[2],
    eta: '3h',
    dependencies: 0,
    comments: 2,
    blockers: 1,
    qaStatus: 'pending',
  },
  {
    id: '4',
    title: 'Performance Optimization',
    description: 'Fix dashboard loading time issues',
    status: 'critical-delay',
    priority: 'high',
    assignee: teamMembers[3],
    eta: '6h',
    dependencies: 3,
    comments: 8,
    blockers: 2,
    qaStatus: 'failed',
  },
];

export const getInitialColumns = (): Column[] => {
  return columnData.map(column => ({
    ...column,
    icon: getColumnIcon(column.id),
    color: getColumnColor(column.id),
    tasks: initialTasks.filter(task => task.status === column.id),
  }));
};
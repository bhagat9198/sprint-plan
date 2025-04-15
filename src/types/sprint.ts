import { ReactNode } from 'react';

export interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'completed';
  day: number;
  totalDays: number;
  velocity: number;
  completedTasks: number;
  inProgressTasks: number;
  blockers: number;
  teamSize: number;
  progress: number;
  health: {
    onTrack: number;
    slightDelay: number;
    critical: number;
  };
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: 'low' | 'medium' | 'high';
  assignee: {
    name: string;
    avatar: string;
  };
  eta: string;
  dependencies: number;
  comments: number;
  blockers: number;
  qaStatus: 'pending' | 'passed' | 'failed';
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export interface ViewOption {
  icon: ReactNode;
  value: ViewType;
  label: string;
}

export type ViewType = 'kanban' | 'timeline' | 'list' | 'calendar';

export interface TaskMetadata {
  icon: ReactNode;
  count: number;
  color?: string;
}

export interface CalendarCell {
  date: Date;
  tasks: Task[];
  totalHours: number;
}

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

export interface TaskComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: Date;
  attachments?: {
    type: 'pr' | 'file';
    name: string;
    url: string;
  }[];
}

export interface TaskTimeLog {
  hours: number;
  note?: string;
  timestamp: Date;
}

export interface BaseTask {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: 'low' | 'medium' | 'high';
  assignee: {
    name: string;
    avatar: string;
  };
  eta: string;
  blockers: number;
  qaStatus: 'pending' | 'passed' | 'failed';
}

export interface TaskDetails extends BaseTask {
  comments: TaskComment[];
  timeLogs: TaskTimeLog[];
  linkedPRs: string[];
  linkedDefects: string[];
  dependencies: {
    id: string;
    title: string;
    status: string;
  }[];
}
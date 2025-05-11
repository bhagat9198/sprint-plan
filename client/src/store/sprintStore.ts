import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Sprint, Task } from '../types/sprint';
import { columnData, initialTasks } from '../data/sprint';

interface SprintState {
  sprints: Sprint[];
  currentSprintId: string | null;
  columns: { id: string; title: string; tasks: Task[] }[];
  setCurrentSprint: (sprintId: string) => void;
  moveTask: (taskId: string, sourceColumnId: string, targetColumnId: string) => void;
  addTask: (task: Task, columnId: string) => void;
  getSprintHealthMetrics: () => { onTrack: number; slightDelay: number; critical: number; total: number };
}

const initialSprints: Sprint[] = [
  {
    id: '1',
    name: 'Sprint Alpha',
    startDate: '2024-04-01',
    endDate: '2024-04-14',
    status: 'active',
    day: 5,
    totalDays: 10,
    velocity: 24,
    completedTasks: 24,
    inProgressTasks: 12,
    blockers: 3,
    teamSize: 8,
    progress: 65,
    health: {
      onTrack: 85,
      slightDelay: 12,
      critical: 3
    }
  },
  {
    id: '2',
    name: 'Sprint Beta',
    startDate: '2024-04-15',
    endDate: '2024-04-28',
    status: 'active',
    day: 0,
    totalDays: 10,
    velocity: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    blockers: 0,
    teamSize: 8,
    progress: 0,
    health: {
      onTrack: 75,
      slightDelay: 20,
      critical: 5
    }
  },
  {
    id: '3',
    name: 'Sprint Gamma',
    startDate: '2024-04-29',
    endDate: '2024-05-12',
    status: 'upcoming',
    day: 0,
    totalDays: 10,
    velocity: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    blockers: 0,
    teamSize: 8,
    progress: 0,
    health: {
      onTrack: 0,
      slightDelay: 0,
      critical: 0
    }
  }
];

const initialColumns = columnData.map(column => ({
  ...column,
  tasks: initialTasks.filter(task => task.status === column.id),
}));

export const useSprintStore = create<SprintState>()(
  persist(
    (set, get) => ({
      sprints: initialSprints,
      currentSprintId: '1',
      columns: initialColumns,
      setCurrentSprint: (sprintId: string) => set({ currentSprintId: sprintId }),
      moveTask: (taskId: string, sourceColumnId: string, targetColumnId: string) =>
        set((state) => {
          const task = state.columns
            .find((col) => col.id === sourceColumnId)
            ?.tasks.find((t) => t.id === taskId);

          if (!task) return state;

          const updatedTask = { ...task, status: targetColumnId };

          return {
            columns: state.columns.map((col) => {
              if (col.id === sourceColumnId) {
                return {
                  ...col,
                  tasks: col.tasks.filter((t) => t.id !== taskId),
                };
              }
              if (col.id === targetColumnId) {
                return {
                  ...col,
                  tasks: [...col.tasks, updatedTask],
                };
              }
              return col;
            }),
          };
        }),
      addTask: (task: Task, columnId: string) =>
        set((state) => ({
          columns: state.columns.map((col) => {
            if (col.id === columnId) {
              return {
                ...col,
                tasks: [...col.tasks, task],
              };
            }
            return col;
          }),
        })),
      getSprintHealthMetrics: () => {
        const state = get();
        const activeSprints = state.sprints.filter(sprint => 
          sprint.status === 'active' || sprint.status === 'completed'
        );

        if (activeSprints.length === 0) {
          return { onTrack: 0, slightDelay: 0, critical: 0, total: 1 };
        }

        // Calculate total metrics across all active sprints
        const totalMetrics = activeSprints.reduce((acc, sprint) => ({
          onTrack: acc.onTrack + sprint.health.onTrack,
          slightDelay: acc.slightDelay + sprint.health.slightDelay,
          critical: acc.critical + sprint.health.critical,
          total: acc.total + 1
        }), {
          onTrack: 0,
          slightDelay: 0,
          critical: 0,
          total: 0
        });

        // Calculate averages
        return {
          onTrack: Math.round(totalMetrics.onTrack / totalMetrics.total),
          slightDelay: Math.round(totalMetrics.slightDelay / totalMetrics.total),
          critical: Math.round(totalMetrics.critical / totalMetrics.total),
          total: totalMetrics.total
        };
      },
    }),
    {
      name: 'sprint-store',
      partialize: (state) => ({
        sprints: state.sprints,
        currentSprintId: state.currentSprintId,
        columns: state.columns,
      }),
    }
  )
);
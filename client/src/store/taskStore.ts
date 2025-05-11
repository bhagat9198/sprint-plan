import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, TaskComment } from '../types/sprint';

interface TaskState {
  tasks: Task[];
  comments: Record<string, TaskComment[]>;
  initializeTasks: (tasks: Task[]) => void;
  addComment: (taskId: string, comment: string, userId: string, userName: string, userAvatar: string) => void;
  getTaskComments: (taskId: string) => TaskComment[];
  getTask: (taskId: string) => Task | undefined;
  updateTaskCommentCount: (taskId: string, count: number) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      comments: {},

      initializeTasks: (tasks: Task[]) => {
        set((state) => {
          // Only initialize if no tasks exist
          if (state.tasks.length === 0) {
            const initialTasks = tasks.map(task => ({
              ...task,
              comments: state.comments[task.id]?.length || task.comments || 0
            }));
            return { tasks: initialTasks };
          }
          return state;
        });
      },
      
      addComment: (taskId: string, comment: string, userId: string, userName: string, userAvatar: string) => {
        const newComment: TaskComment = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          userId,
          userName,
          userAvatar,
          content: comment,
          timestamp: new Date(),
        };

        set((state) => {
          const existingComments = state.comments[taskId] || [];
          const newComments = [...existingComments, newComment];

          // Update tasks with new comment count
          const updatedTasks = state.tasks.map(task => 
            task.id === taskId 
              ? { ...task, comments: newComments.length }
              : task
          );

          // Return updated state
          return {
            tasks: updatedTasks,
            comments: {
              ...state.comments,
              [taskId]: newComments,
            },
          };
        });

        // Return the new comment for immediate UI update
        return newComment;
      },

      getTaskComments: (taskId: string) => {
        const comments = get().comments[taskId] || [];
        return [...comments].sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
      },

      getTask: (taskId: string) => {
        return get().tasks.find(task => task.id === taskId);
      },

      updateTaskCommentCount: (taskId: string, count: number) => {
        set((state) => ({
          tasks: state.tasks.map(task =>
            task.id === taskId ? { ...task, comments: count } : task
          )
        }));
      },
    }),
    {
      name: 'task-store',
      partialize: (state) => ({
        tasks: state.tasks,
        comments: state.comments,
      }),
    }
  )
);
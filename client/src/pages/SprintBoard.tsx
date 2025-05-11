import React, { useState, useMemo } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { SprintHeader } from '../components/sprint/SprintHeader';
import { TaskColumn } from '../components/sprint/TaskColumn';
import { CalendarView } from '../components/sprint/CalendarView';
import { TimelineView } from '../components/sprint/TimelineView';
import { ListView } from '../components/sprint/ListView';
import { CreateTaskModal } from '../components/sprint/CreateTaskModal';
import { ViewType, Task } from '../types/sprint';
import { useSprintStore } from '../store/sprintStore';
import { teamMembers } from '../data/sprint';

export const SprintBoard: React.FC = () => {
  const [selectedView, setSelectedView] = useState<ViewType>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const columns = useSprintStore((state) => state.columns);
  const moveTask = useSprintStore((state) => state.moveTask);

  // Filter tasks based on search query
  const filterTasks = (tasks: Task[]) => {
    if (!searchQuery) return tasks;
    
    const query = searchQuery.toLowerCase();
    return tasks.filter(task => 
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query) ||
      task.assignee.name.toLowerCase().includes(query) ||
      task.id.toLowerCase().includes(query) ||
      task.priority.toLowerCase().includes(query) ||
      task.status.toLowerCase().includes(query)
    );
  };

  // Filter columns and their tasks
  const filteredColumns = useMemo(() => {
    return columns.map(column => ({
      ...column,
      tasks: filterTasks(column.tasks)
    }));
  }, [columns, searchQuery]);

  // Get all tasks for non-kanban views
  const allTasks = useMemo(() => {
    return filterTasks(columns.flatMap(column => column.tasks));
  }, [columns, searchQuery]);

  // Drag and drop handlers
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (columnId: string) => {
    setDragOverColumn(columnId);
  };

  const handleDragEnd = (targetColumnId: string) => {
    if (!draggedTask) return;

    const sourceColumn = columns.find((col) =>
      col.tasks.some((task) => task.id === draggedTask)
    );

    if (sourceColumn) {
      moveTask(draggedTask, sourceColumn.id, targetColumnId);
    }

    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleCreateTask = () => {
    setIsCreateModalOpen(true);
  };

  const renderView = () => {
    switch (selectedView) {
      case 'kanban':
        return (
          <div className="flex gap-6 overflow-x-auto pb-6 snap-x">
            {filteredColumns.map((column) => (
              <div key={column.id} className="snap-start">
                <TaskColumn
                  column={column}
                  isDraggedOver={dragOverColumn === column.id}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                />
              </div>
            ))}
          </div>
        );
      case 'calendar':
        return (
          <CalendarView
            startDate={new Date('2024-04-07')}
            endDate={new Date('2024-04-16')}
            tasks={allTasks}
            teamMembers={teamMembers}
          />
        );
      case 'timeline':
        return <TimelineView tasks={allTasks} />;
      case 'list':
        return <ListView tasks={allTasks} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-dark-background">
      {/* Ambient Time Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-success/20 to-primary/20 animate-gradient z-50" />

      {/* Layout */}
      <Sidebar />
      <Header />

      {/* Main Content */}
      <main className="pt-20 pl-20">
        <SprintHeader
          selectedView={selectedView}
          onViewChange={setSelectedView}
          onSearch={setSearchQuery}
          onCreateTask={handleCreateTask}
        />

        {/* Board */}
        <div className="p-6">
          {renderView()}
        </div>
      </main>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        defaultColumnId="on-track"
      />
    </div>
  );
};
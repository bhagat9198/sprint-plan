import { useState } from 'react';
import { Column } from '../types/sprint';

export const useDragAndDrop = (initialColumns: Column[]) => {
  const [columns, setColumns] = useState(initialColumns);
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

    setColumns((prevColumns) => {
      const sourceColumn = prevColumns.find((col) =>
        col.tasks.some((task) => task.id === draggedTask)
      );
      const targetColumn = prevColumns.find((col) => col.id === targetColumnId);

      if (!sourceColumn || !targetColumn) return prevColumns;

      const task = sourceColumn.tasks.find((t) => t.id === draggedTask);
      if (!task) return prevColumns;

      // Create updated task with new status
      const updatedTask = { ...task, status: targetColumnId };

      return prevColumns.map((col) => {
        if (col.id === sourceColumn.id) {
          return {
            ...col,
            tasks: col.tasks.filter((t) => t.id !== draggedTask),
          };
        }
        if (col.id === targetColumnId) {
          return {
            ...col,
            tasks: [...col.tasks, updatedTask],
          };
        }
        return col;
      });
    });

    setDraggedTask(null);
    setDragOverColumn(null);
  };

  return {
    columns,
    setColumns,
    draggedTask,
    dragOverColumn,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
};
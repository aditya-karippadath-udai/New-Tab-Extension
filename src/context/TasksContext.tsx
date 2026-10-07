import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { TaskItem, TaskPriority } from '../types';
import { getTasks, saveTasks } from '../storage/taskStorage';
import { formatDateToIso } from '../utils/dateUtils';

interface TasksContextType {
  tasks: TaskItem[];
  filteredTasks: TaskItem[];
  filter: 'all' | 'active' | 'completed' | 'today';
  setFilter: (filter: 'all' | 'active' | 'completed' | 'today') => void;
  addTask: (text: string, priority?: TaskPriority, dueDate?: string) => void;
  updateTask: (id: string, updates: Partial<TaskItem>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  moveTaskUp: (id: string) => void;
  moveTaskDown: (id: string) => void;
  clearCompleted: () => void;
  stats: {
    total: number;
    completed: number;
    active: number;
    percent: number;
  };
  todayDateIso: string;
}

const TasksContext = createContext<TasksContextType | null>(null);

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'today'>('all');
  const todayDateIso = formatDateToIso(new Date());

  useEffect(() => {
    let isMounted = true;
    getTasks().then((loaded) => {
      if (isMounted) setTasks(loaded);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const persist = (next: TaskItem[]) => {
    setTasks(next);
    saveTasks(next);
  };

  const addTask = (text: string, priority: TaskPriority = 'medium', dueDate?: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const newTask: TaskItem = {
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      text: trimmed,
      completed: false,
      createdAt: Date.now(),
      priority,
      dueDate: dueDate || todayDateIso,
    };
    setTasks((prev) => {
      const next = [newTask, ...prev];
      saveTasks(next);
      return next;
    });
    // Ensure new task is visible if user was on completed filter
    if (filter === 'completed') {
      setFilter('all');
    }
  };

  const updateTask = (id: string, updates: Partial<TaskItem>) => {
    setTasks((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, ...updates } : t));
      saveTasks(next);
      return next;
    });
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => {
      const next = prev.filter((t) => t.id !== id);
      saveTasks(next);
      return next;
    });
  };

  const toggleTask = (id: string) => {
    setTasks((prev) => {
      const next = prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? Date.now() : undefined,
          };
        }
        return t;
      });
      saveTasks(next);
      return next;
    });
  };

  const moveTaskUp = (id: string) => {
    setTasks((prev) => {
      const index = prev.findIndex((t) => t.id === id);
      if (index <= 0) return prev;
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      saveTasks(copy);
      return copy;
    });
  };

  const moveTaskDown = (id: string) => {
    setTasks((prev) => {
      const index = prev.findIndex((t) => t.id === id);
      if (index === -1 || index >= prev.length - 1) return prev;
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      saveTasks(copy);
      return copy;
    });
  };

  const clearCompleted = () => {
    setTasks((prev) => {
      const next = prev.filter((t) => !t.completed);
      saveTasks(next);
      return next;
    });
  };

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'active':
        return tasks.filter((t) => !t.completed);
      case 'completed':
        return tasks.filter((t) => t.completed);
      case 'today':
        return tasks.filter((t) => t.dueDate === todayDateIso || (!t.dueDate && !t.completed));
      case 'all':
      default:
        return tasks;
    }
  }, [tasks, filter, todayDateIso]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const active = total - completed;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, active, percent };
  }, [tasks]);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        filteredTasks,
        filter,
        setFilter,
        addTask,
        updateTask,
        deleteTask,
        toggleTask,
        moveTaskUp,
        moveTaskDown,
        clearCompleted,
        stats,
        todayDateIso,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) {
    throw new Error('useTasks must be used within TasksProvider');
  }
  return ctx;
}

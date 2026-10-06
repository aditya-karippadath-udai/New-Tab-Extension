import { TaskItem } from '../types';
import { getStorageItem, setStorageItem } from './browserStorage';

const TASKS_KEY = 'auratab_tasks';

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    text: 'Complete project architecture review',
    completed: true,
    createdAt: Date.now() - 3600000 * 4,
    completedAt: Date.now() - 3600000 * 2,
    priority: 'high',
    dueDate: new Date().toISOString().split('T')[0],
  },
  {
    id: 'task-2',
    text: 'Study Node.js and Chromium extension APIs',
    completed: false,
    createdAt: Date.now() - 3600000 * 3,
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
  },
  {
    id: 'task-3',
    text: 'Push extension update to Web Store',
    completed: true,
    createdAt: Date.now() - 3600000 * 2,
    completedAt: Date.now() - 3600000 * 1,
    priority: 'high',
  },
  {
    id: 'task-4',
    text: 'Practice DSA graphs & dynamic programming',
    completed: false,
    createdAt: Date.now() - 3600000,
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
  },
  {
    id: 'task-5',
    text: 'Refine keyboard shortcuts and glassmorphism styling',
    completed: false,
    createdAt: Date.now() - 1800000,
    priority: 'low',
  },
];

export async function getTasks(): Promise<TaskItem[]> {
  const tasks = await getStorageItem<TaskItem[] | null>(TASKS_KEY, null);
  if (tasks === null) {
    // First time initializing
    await saveTasks(INITIAL_TASKS);
    return INITIAL_TASKS;
  }
  return tasks;
}

export async function saveTasks(tasks: TaskItem[]): Promise<void> {
  await setStorageItem(TASKS_KEY, tasks);
}

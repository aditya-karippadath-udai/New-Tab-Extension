import { TaskItem } from '../types';
import { getStorageItem, setStorageItem } from './browserStorage';

const TASKS_KEY = 'auratab_tasks';

export const INITIAL_TASKS: TaskItem[] = [];

export async function getTasks(): Promise<TaskItem[]> {
  const tasks = await getStorageItem<TaskItem[] | null>(TASKS_KEY, null);
  if (tasks === null) {
    // First time initializing: start clean with no mock tasks
    await saveTasks([]);
    return [];
  }
  return tasks;
}

export async function saveTasks(tasks: TaskItem[]): Promise<void> {
  await setStorageItem(TASKS_KEY, tasks);
}

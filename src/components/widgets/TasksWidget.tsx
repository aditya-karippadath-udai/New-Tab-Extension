import React, { useState, useRef } from 'react';
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Calendar,
  Sparkles,
  Clock,
} from 'lucide-react';
import { WidgetContainer } from './WidgetContainer';
import { useTasks } from '../../context/TasksContext';
import { useSettings } from '../../context/SettingsContext';
import { TaskPriority } from '../../types';

interface TasksWidgetProps {
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export const TasksWidget: React.FC<TasksWidgetProps> = ({ inputRef: externalInputRef }) => {
  const {
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
  } = useTasks();

  const { settings, accentTheme } = useSettings();
  const internalInputRef = useRef<HTMLInputElement>(null);
  const inputRef = externalInputRef || internalInputRef;

  const [newTaskText, setNewTaskText] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState<string>(todayDateIso);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [inputError, setInputError] = useState(false);

  const handleAddTask = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newTaskText.trim();
    if (!trimmed) {
      setInputError(true);
      inputRef.current?.focus();
      setTimeout(() => setInputError(false), 1500);
      return;
    }

    addTask(trimmed, priority, dueDate);
    setNewTaskText('');
    setInputError(false);
  };

  const startEditing = (id: string, currentText: string) => {
    setEditingId(id);
    setEditText(currentText);
  };

  const saveEdit = (id: string) => {
    if (editText.trim()) {
      updateTask(id, { text: editText.trim() });
    }
    setEditingId(null);
  };

  return (
    <WidgetContainer
      id="tasks-widget"
      title="Tasks & To-Do"
      icon={<CheckSquare className="w-3.5 h-3.5" />}
      headerAction={
        <div className="flex items-center gap-2">
          {stats.completed > 0 && (
            <button
              onClick={clearCompleted}
              className="text-[11px] text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer"
            >
              Clear completed
            </button>
          )}
          <button
            onClick={() => {
              inputRef.current?.focus();
            }}
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-medium text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Add Task</span>
          </button>
        </div>
      }
    >
      {/* Progress Bar Indicator */}
      {settings.showTaskProgress && stats.total > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
            <span className="font-mono tabular-nums">
              {stats.completed} / {stats.total} completed
            </span>
            <span className="font-mono tabular-nums font-semibold text-neutral-300">
              {stats.percent}%
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${accentTheme.progressBarColor}`}
              style={{ width: `${stats.percent}%` }}
            />
          </div>
        </div>
      )}

      {/* Filter Tabs (Interactive Filter Controls) */}
      <div className="flex items-center gap-1 p-0.5 rounded-lg bg-black/20 dark:bg-black/30 border border-white/5 mb-3 text-xs">
        {(['all', 'active', 'completed', 'today'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`flex-1 py-1 px-2 rounded-md font-medium capitalize text-center transition-colors cursor-pointer ${
              filter === tab
                ? `${accentTheme.bgActive} font-semibold shadow-xs`
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Add Task Input Form */}
      <form onSubmit={handleAddTask} className="flex flex-col gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={newTaskText}
              onChange={(e) => {
                setNewTaskText(e.target.value);
                if (inputError) setInputError(false);
              }}
              placeholder={inputError ? 'Type a task name first...' : 'Add new task (Press T or type here)...'}
              className={`w-full bg-white/5 dark:bg-black/20 border rounded-xl px-3 py-1.5 text-xs text-neutral-200 placeholder:text-neutral-500 outline-none transition-all ${
                inputError
                  ? 'border-rose-500/80 bg-rose-500/10 placeholder:text-rose-400'
                  : 'border-white/10 focus:border-white/30'
              }`}
            />
          </div>

          {/* Priority Selector */}
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            aria-label="Task priority"
            className="bg-white/5 dark:bg-black/30 border border-white/10 rounded-xl px-2 py-1.5 text-xs text-neutral-300 outline-none cursor-pointer"
          >
            <option value="low" className="bg-neutral-900 text-neutral-200">Low</option>
            <option value="medium" className="bg-neutral-900 text-neutral-200">Med</option>
            <option value="high" className="bg-neutral-900 text-neutral-200">High</option>
          </select>

          {/* Due date toggle button */}
          <button
            type="button"
            onClick={() => setShowDatePicker(!showDatePicker)}
            title="Toggle due date picker"
            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
              showDatePicker
                ? 'bg-white/20 border-white/30 text-white'
                : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
          </button>

          {/* Add Task Button (Always clickable) */}
          <button
            type="button"
            onClick={() => handleAddTask()}
            aria-label="Add task"
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition-all cursor-pointer font-medium text-xs text-white shrink-0 shadow-sm ${accentTheme.buttonClass}`}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>

        {/* Optional Due Date row if opened */}
        {showDatePicker && (
          <div className="flex items-center gap-2 px-1 text-xs text-neutral-400">
            <span>Due Date:</span>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-black/30 border border-white/10 rounded-lg px-2 py-0.5 text-xs text-neutral-200 outline-none"
            />
            <button
              type="button"
              onClick={() => setDueDate(todayDateIso)}
              className="text-[11px] underline text-cyan-400 hover:text-cyan-300"
            >
              Today
            </button>
          </div>
        )}
      </form>

      {/* Task List */}
      <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
        {filteredTasks.length === 0 ? (
          <div className="py-6 text-center text-xs text-neutral-400 select-none">
            <Sparkles className="w-5 h-5 mx-auto mb-1.5 text-neutral-500" />
            <p className="font-medium text-neutral-300">You're all caught up 🎉</p>
            <p className="text-[11px] text-neutral-500 mt-0.5 mb-2">
              Add a task to get started
            </p>
            <button
              type="button"
              onClick={() => inputRef.current?.focus()}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-medium text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 hover:bg-cyan-900/40 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add task</span>
            </button>
          </div>
        ) : (
          <>
            {filteredTasks.map((task) => {
              const isEditing = editingId === task.id;

              return (
                <div
                  key={task.id}
                  className="group flex items-center justify-between gap-2 p-2 rounded-xl bg-white/5 hover:bg-white/10 dark:bg-black/20 dark:hover:bg-black/35 border border-white/5 hover:border-white/15 transition-all text-xs"
                >
                  {/* Left check & title */}
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <button
                      onClick={() => toggleTask(task.id)}
                      aria-label={task.completed ? 'Mark incomplete' : 'Mark completed'}
                      className="text-neutral-400 hover:text-white transition-colors shrink-0 cursor-pointer"
                    >
                      {task.completed ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>

                    {isEditing ? (
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onBlur={() => saveEdit(task.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit(task.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        autoFocus
                        className="flex-1 bg-black/40 text-neutral-100 px-1.5 py-0.5 rounded outline-none border border-cyan-500/50"
                      />
                    ) : (
                      <span
                        onDoubleClick={() => startEditing(task.id, task.text)}
                        title="Double click to edit"
                        className={`truncate flex-1 cursor-pointer select-text ${
                          task.completed
                            ? 'line-through text-neutral-500'
                            : 'text-neutral-200'
                        }`}
                      >
                        {task.text}
                      </span>
                    )}
                  </div>

                  {/* Priority dot / subtle tag */}
                  {task.priority !== 'none' && !task.completed && (
                    <span
                      className={`text-[10px] font-mono capitalize shrink-0 ${
                        task.priority === 'high'
                          ? 'text-rose-400'
                          : task.priority === 'medium'
                          ? 'text-amber-400'
                          : 'text-neutral-400'
                      }`}
                    >
                      {task.priority === 'high' && '• High'}
                      {task.priority === 'medium' && '• Med'}
                      {task.priority === 'low' && '• Low'}
                    </span>
                  )}

                  {/* Hover Action Controls: Move Up/Down, Delete */}
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity shrink-0">
                    <button
                      onClick={() => moveTaskUp(task.id)}
                      title="Move up"
                      aria-label="Move task up"
                      className="p-1 rounded text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => moveTaskDown(task.id)}
                      title="Move down"
                      aria-label="Move task down"
                      className="p-1 rounded text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      title="Delete task"
                      aria-label="Delete task"
                      className="p-1 rounded text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Explicit "+ Add task" clickable row at bottom of list */}
            <button
              type="button"
              onClick={() => {
                inputRef.current?.focus();
              }}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl border border-dashed border-white/10 hover:border-white/25 bg-white/[0.02] hover:bg-white/5 text-neutral-400 hover:text-white transition-all text-xs group cursor-pointer mt-1"
            >
              <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span>+ Add task</span>
            </button>
          </>
        )}
      </div>
    </WidgetContainer>
  );
};

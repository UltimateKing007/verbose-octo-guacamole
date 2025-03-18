import React, { useState } from 'react';
import { PRIORITY_LEVELS, DEFAULT_CATEGORIES } from '../../services/todoService';
import Button from '../common/Button';
import Input from '../common/Input';

const TodoForm = ({ onSubmit, loading }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState(PRIORITY_LEVELS.MEDIUM);
  const [category, setCategory] = useState('other');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      priority,
      category,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null
    });

    setTitle('');
    setPriority(PRIORITY_LEVELS.MEDIUM);
    setCategory('other');
    setDueDate('');
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="space-y-4 bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700"
    >
      <div className="space-y-2">
        <label 
          htmlFor="title"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Task Title
        </label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          required
          disabled={loading}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label 
            htmlFor="priority"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            disabled={loading}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 
                     bg-white dark:bg-slate-700 text-slate-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {Object.values(PRIORITY_LEVELS).map(level => (
              <option key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label 
            htmlFor="category"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={loading}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 
                     bg-white dark:bg-slate-700 text-slate-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {DEFAULT_CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label 
            htmlFor="dueDate"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Due Date
          </label>
          <Input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            disabled={loading}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={!title.trim() || loading}
          variant="primary"
          size="lg"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          }
        >
          Add Task
        </Button>
      </div>
    </form>
  );
};

export default TodoForm;
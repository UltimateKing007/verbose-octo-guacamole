import React, { useState } from 'react';
import { format } from 'date-fns';
import { PRIORITY_LEVELS } from '../../services/todoService';

const TodoItem = ({ 
  todo, 
  onToggle, 
  onDelete, 
  onEdit, 
  dragHandleProps,
  isDark 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const priorityColors = {
    [PRIORITY_LEVELS.HIGH]: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100',
    [PRIORITY_LEVELS.MEDIUM]: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-100',
    [PRIORITY_LEVELS.LOW]: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onEdit(todo.id, { title: editedTitle });
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditedTitle(todo.title);
    }
  };

  return (
    <div
      className={`
        group relative flex items-center gap-4 p-4 rounded-lg
        bg-white dark:bg-slate-800
        border border-slate-200 dark:border-slate-700
        hover:shadow-md dark:hover:shadow-slate-700/30
        transition-all duration-200
        ${todo.completed ? 'opacity-75' : ''}
      `}
      role="listitem"
    >
      {/* Drag Handle */}
      <div
        {...dragHandleProps}
        className="cursor-move text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        aria-label="Drag to reorder"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </div>

      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo.id)}
        className={`
          flex-shrink-0 w-6 h-6 rounded-full border-2
          transition-colors duration-200
          ${todo.completed
            ? 'bg-blue-500 border-blue-500 dark:bg-blue-600 dark:border-blue-600'
            : 'border-slate-300 dark:border-slate-600'
          }
        `}
        aria-checked={todo.completed}
        role="checkbox"
      >
        {todo.completed && (
          <svg className="w-full h-full text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
          </svg>
        )}
      </button>

      {/* Title */}
      {isEditing ? (
        <form onSubmit={handleSubmit} className="flex-1">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleSubmit}
            onKeyDown={handleKeyDown}
            className="w-full px-2 py-1 rounded border border-blue-500 dark:border-blue-400 
                     bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            autoFocus
          />
        </form>
      ) : (
        <div className="flex-1 min-w-0">
          <h3 
            className={`
              text-slate-900 dark:text-white truncate
              ${todo.completed ? 'line-through text-slate-500 dark:text-slate-400' : ''}
            `}
          >
            {todo.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            {/* Priority Badge */}
            <span className={`
              px-2 py-0.5 rounded-full text-xs font-medium
              ${priorityColors[todo.priority]}
            `}>
              {todo.priority}
            </span>

            {/* Category Badge */}
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
              {todo.category}
            </span>

            {/* Due Date */}
            {todo.dueDate && (
              <span className={`
                text-xs
                ${todo.overdue ? 'text-red-500 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}
              `}>
                {format(new Date(todo.dueDate), 'MMM d, yyyy')}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setIsEditing(true)}
          className="p-1 text-slate-400 hover:text-blue-500 dark:hover:text-blue-400"
          aria-label="Edit todo"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="p-1 text-slate-400 hover:text-red-500 dark:hover:text-red-400"
          aria-label="Delete todo"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
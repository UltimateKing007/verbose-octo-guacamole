import React from 'react';
import { PRIORITY_LEVELS, DEFAULT_CATEGORIES } from '../../services/todoService';

const FilterButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`
      px-4 py-2 rounded-lg text-sm font-medium
      transition-all duration-200
      ${active
        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100'
        : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
      }
    `}
  >
    {children}
  </button>
);

const TodoFilter = ({
  filter,
  categoryFilter,
  priorityFilter,
  sortBy,
  onFilterChange,
  onCategoryChange,
  onPriorityChange,
  onSortChange,
  stats
}) => {
  return (
    <div className="space-y-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
          <div className="text-sm text-slate-500 dark:text-slate-400">Total</div>
          <div className="text-2xl font-semibold text-slate-900 dark:text-white">{stats.total}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
          <div className="text-sm text-slate-500 dark:text-slate-400">Active</div>
          <div className="text-2xl font-semibold text-blue-600 dark:text-blue-400">{stats.active}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
          <div className="text-sm text-slate-500 dark:text-slate-400">Completed</div>
          <div className="text-2xl font-semibold text-green-600 dark:text-green-400">{stats.completed}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
          <div className="text-sm text-slate-500 dark:text-slate-400">Due Soon</div>
          <div className="text-2xl font-semibold text-yellow-600 dark:text-yellow-400">{stats.dueSoon}</div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="space-y-4">
        {/* Status Filters */}
        <div>
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Status</h3>
          <div className="flex flex-wrap gap-2">
            <FilterButton
              active={filter === 'all'}
              onClick={() => onFilterChange('all')}
            >
              All
            </FilterButton>
            <FilterButton
              active={filter === 'active'}
              onClick={() => onFilterChange('active')}
            >
              Active
            </FilterButton>
            <FilterButton
              active={filter === 'completed'}
              onClick={() => onFilterChange('completed')}
            >
              Completed
            </FilterButton>
          </div>
        </div>

        {/* Category Filters */}
        <div>
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category</h3>
          <div className="flex flex-wrap gap-2">
            <FilterButton
              active={categoryFilter === 'all'}
              onClick={() => onCategoryChange('all')}
            >
              All Categories
            </FilterButton>
            {DEFAULT_CATEGORIES.map(category => (
              <FilterButton
                key={category.id}
                active={categoryFilter === category.id}
                onClick={() => onCategoryChange(category.id)}
              >
                {category.name}
              </FilterButton>
            ))}
          </div>
        </div>

        {/* Priority Filters */}
        <div>
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Priority</h3>
          <div className="flex flex-wrap gap-2">
            <FilterButton
              active={priorityFilter === 'all'}
              onClick={() => onPriorityChange('all')}
            >
              All Priorities
            </FilterButton>
            {Object.values(PRIORITY_LEVELS).map(priority => (
              <FilterButton
                key={priority}
                active={priorityFilter === priority}
                onClick={() => onPriorityChange(priority)}
              >
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </FilterButton>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div>
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Sort By</h3>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full md:w-auto rounded-lg border border-slate-300 dark:border-slate-600 
                     bg-white dark:bg-slate-700 text-slate-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="order">Custom Order</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TodoFilter;
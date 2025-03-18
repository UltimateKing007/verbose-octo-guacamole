import { format, isToday, isTomorrow, isPast, differenceInDays } from 'date-fns';

// Format date for display
export const formatDate = (date) => {
  if (!date) return '';
  const dateObj = new Date(date);
  if (isToday(dateObj)) {
    return 'Today';
  }
  if (isTomorrow(dateObj)) {
    return 'Tomorrow';
  }
  return format(dateObj, 'MMM d, yyyy');
};

// Format time for display
export const formatTime = (date) => {
  if (!date) return '';
  return format(new Date(date), 'h:mm a');
};

// Get relative time string
export const getRelativeTime = (date) => {
  if (!date) return '';
  const dateObj = new Date(date);
  const now = new Date();
  const diffDays = differenceInDays(dateObj, now);

  if (isPast(dateObj)) {
    return 'Overdue';
  }
  if (isToday(dateObj)) {
    return 'Due today';
  }
  if (isTomorrow(dateObj)) {
    return 'Due tomorrow';
  }
  if (diffDays <= 7) {
    return `Due in ${diffDays} days`;
  }
  return `Due on ${format(dateObj, 'MMM d')}`;
};

// Sort todos by different criteria
export const sortTodos = (todos, sortBy = 'dueDate') => {
  return [...todos].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      case 'createdAt':
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  });
};

// Filter todos by status
export const filterTodos = (todos, filter = 'all') => {
  switch (filter) {
    case 'active':
      return todos.filter(todo => !todo.completed);
    case 'completed':
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};

// Filter todos by category
export const filterByCategory = (todos, category) => {
  if (!category || category === 'all') return todos;
  return todos.filter(todo => todo.category === category);
};

// Filter todos by priority
export const filterByPriority = (todos, priority) => {
  if (!priority || priority === 'all') return todos;
  return todos.filter(todo => todo.priority === priority);
};

// Get color for priority level
export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high':
      return 'text-red-600 dark:text-red-400';
    case 'medium':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'low':
      return 'text-green-600 dark:text-green-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
};

// Get background color for priority level
export const getPriorityBgColor = (priority) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 dark:bg-red-900/20';
    case 'medium':
      return 'bg-yellow-100 dark:bg-yellow-900/20';
    case 'low':
      return 'bg-green-100 dark:bg-green-900/20';
    default:
      return 'bg-gray-100 dark:bg-gray-800';
  }
};

// Get category color
export const getCategoryColor = (category) => {
  const colors = {
    personal: 'text-blue-600 dark:text-blue-400',
    work: 'text-green-600 dark:text-green-400',
    shopping: 'text-purple-600 dark:text-purple-400',
    health: 'text-red-600 dark:text-red-400',
    education: 'text-yellow-600 dark:text-yellow-400',
  };
  return colors[category] || 'text-gray-600 dark:text-gray-400';
};

// Get category background color
export const getCategoryBgColor = (category) => {
  const colors = {
    personal: 'bg-blue-100 dark:bg-blue-900/20',
    work: 'bg-green-100 dark:bg-green-900/20',
    shopping: 'bg-purple-100 dark:bg-purple-900/20',
    health: 'bg-red-100 dark:bg-red-900/20',
    education: 'bg-yellow-100 dark:bg-yellow-900/20',
  };
  return colors[category] || 'bg-gray-100 dark:bg-gray-800';
};

// Generate a unique ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Validate email format
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}; 
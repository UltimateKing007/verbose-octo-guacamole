import { useState, useEffect, useCallback } from 'react';
import { 
  addTodo as addTodoService,
  getTodos as getTodosService,
  updateTodo as updateTodoService,
  deleteTodo as deleteTodoService,
  reorderTodos as reorderTodosService,
  subscribeToTodos,
  syncWithFirebase,
  PRIORITY_LEVELS,
  DEFAULT_CATEGORIES
} from '../services/todoService';
import { useAuth } from './useAuth';

export const useTodos = () => {
  const { user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate'); // dueDate, priority, order
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncWithFirebase(user.uid);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [user.uid]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToTodos(user.uid, (updatedTodos) => {
      setTodos(updatedTodos);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Fetch todos on mount and when user changes
  useEffect(() => {
    let isMounted = true;

    const fetchTodos = async () => {
      if (!user) {
        setTodos([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const fetchedTodos = await getTodosService(user.uid);
        if (isMounted) {
          setTodos(fetchedTodos);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to fetch todos');
          console.error('Error fetching todos:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTodos();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Add new todo with enhanced properties
  const addTodo = async (title, priority = PRIORITY_LEVELS.MEDIUM, category = 'other', dueDate = null) => {
    try {
      setLoading(true);
      const newTodo = {
        title,
        completed: false,
        userId: user.uid,
        priority,
        category,
        dueDate,
        createdAt: new Date().toISOString(),
        order: todos.length
      };
      
      const addedTodo = await addTodoService(newTodo);
      if (!isOnline) {
        setTodos(prevTodos => [...prevTodos, addedTodo]);
      }
      setError(null);
      return addedTodo;
    } catch (err) {
      setError('Failed to add todo');
      console.error('Error adding todo:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update todo with enhanced properties
  const updateTodoItem = async (todoId, updates) => {
    try {
      const todoToUpdate = todos.find(todo => todo.id === todoId);
      if (!todoToUpdate) return;

      const updatedTodo = {
        ...todoToUpdate,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await updateTodoService(todoId, updatedTodo);
      if (!isOnline) {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === todoId ? updatedTodo : todo
          )
        );
      }
      setError(null);
    } catch (err) {
      setError('Failed to update todo');
      console.error('Error updating todo:', err);
    }
  };

  // Reorder todos
  const reorderTodoItems = async (reorderedTodos) => {
    try {
      await reorderTodosService(user.uid, reorderedTodos);
      if (!isOnline) {
        setTodos(reorderedTodos);
      }
      setError(null);
    } catch (err) {
      setError('Failed to reorder todos');
      console.error('Error reordering todos:', err);
    }
  };

  // Filter and sort todos
  const filteredAndSortedTodos = useCallback(() => {
    let filtered = [...todos];

    // Apply completion filter
    if (filter !== 'all') {
      filtered = filtered.filter(todo => 
        filter === 'completed' ? todo.completed : !todo.completed
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(todo => todo.category === categoryFilter);
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(todo => todo.priority === priorityFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'order':
          return a.order - b.order;
        default:
          return 0;
      }
    });

    return filtered;
  }, [todos, filter, categoryFilter, priorityFilter, sortBy]);

  // Get todos stats with enhanced properties
  const stats = {
    total: todos.length,
    active: todos.filter(todo => !todo.completed).length,
    completed: todos.filter(todo => todo.completed).length,
    overdue: todos.filter(todo => todo.overdue).length,
    dueSoon: todos.filter(todo => todo.dueSoon).length,
    byPriority: {
      high: todos.filter(todo => todo.priority === PRIORITY_LEVELS.HIGH).length,
      medium: todos.filter(todo => todo.priority === PRIORITY_LEVELS.MEDIUM).length,
      low: todos.filter(todo => todo.priority === PRIORITY_LEVELS.LOW).length
    },
    byCategory: DEFAULT_CATEGORIES.reduce((acc, cat) => ({
      ...acc,
      [cat.id]: todos.filter(todo => todo.category === cat.id).length
    }), {})
  };

  const updateTodo = async (todoId, updates) => {
    try {
      const updatedTodo = await updateTodoService(todoId, updates);
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === todoId ? updatedTodo : todo))
      );
      return updatedTodo;
    } catch (err) {
      setError('Failed to update todo');
      throw err;
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      await deleteTodoService(todoId, user.uid);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
    } catch (err) {
      setError('Failed to delete todo');
      throw err;
    }
  };

  const toggleTodoComplete = async (todoId, completed) => {
    try {
      const updatedTodo = await updateTodoService(todoId, { completed });
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === todoId ? updatedTodo : todo))
      );
      return updatedTodo;
    } catch (err) {
      setError('Failed to toggle todo completion');
      throw err;
    }
  };

  const updateTodoPriority = async (todoId, priority) => {
    try {
      const updatedTodo = await updateTodoService(todoId, { priority });
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === todoId ? updatedTodo : todo))
      );
      return updatedTodo;
    } catch (err) {
      setError('Failed to update todo priority');
      throw err;
    }
  };

  const updateTodoCategory = async (todoId, category) => {
    try {
      const updatedTodo = await updateTodoService(todoId, { category });
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === todoId ? updatedTodo : todo))
      );
      return updatedTodo;
    } catch (err) {
      setError('Failed to update todo category');
      throw err;
    }
  };

  const updateTodoDueDate = async (todoId, dueDate) => {
    try {
      const updatedTodo = await updateTodoService(todoId, { dueDate });
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === todoId ? updatedTodo : todo))
      );
      return updatedTodo;
    } catch (err) {
      setError('Failed to update todo due date');
      throw err;
    }
  };

  // Get todos stats
  const getTodosStats = () => {
    const total = todos.length;
    const completed = todos.filter((todo) => todo.completed).length;
    const active = total - completed;
    const dueSoon = todos.filter((todo) => {
      if (!todo.dueDate || todo.completed) return false;
      const dueDate = new Date(todo.dueDate);
      const now = new Date();
      const diffDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
      return diffDays <= 3 && diffDays >= 0;
    }).length;

    return {
      total,
      completed,
      active,
      dueSoon,
    };
  };

  return {
    todos: filteredAndSortedTodos(),
    loading,
    error,
    filter,
    categoryFilter,
    priorityFilter,
    sortBy,
    stats,
    isOnline,
    setFilter,
    setCategoryFilter,
    setPriorityFilter,
    setSortBy,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodoComplete,
    updateTodoPriority,
    updateTodoCategory,
    updateTodoDueDate,
    getTodosStats,
    reorderTodos: reorderTodoItems,
    categories: DEFAULT_CATEGORIES,
    priorityLevels: PRIORITY_LEVELS
  };
};

export default useTodos;
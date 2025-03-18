import {
  collection,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
} from 'firebase/firestore';
import { db } from './firebase';

// LocalStorage key prefix
const LOCAL_STORAGE_KEY = 'todos_';
const SYNC_QUEUE_KEY = 'todos_sync_queue';

// Priority levels
export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

// Default categories
export const DEFAULT_CATEGORIES = [
  { id: 'personal', name: 'Personal', color: 'blue' },
  { id: 'work', name: 'Work', color: 'green' },
  { id: 'shopping', name: 'Shopping', color: 'purple' },
  { id: 'health', name: 'Health', color: 'red' },
  { id: 'education', name: 'Education', color: 'yellow' },
];

// Helper function to get user-specific storage key
const getUserStorageKey = (userId) => `${LOCAL_STORAGE_KEY}${userId}`;

// Helper function to handle offline queue
const getOfflineQueue = () => {
  const queue = localStorage.getItem(SYNC_QUEUE_KEY);
  return queue ? JSON.parse(queue) : [];
};

const setOfflineQueue = (queue) => {
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
};

// Add operation to sync queue
const addToSyncQueue = (operation) => {
  const queue = getOfflineQueue();
  queue.push({ ...operation, timestamp: Date.now() });
  setOfflineQueue(queue);
};

// Get todos from local storage
const getLocalTodos = (userId) => {
  const todos = localStorage.getItem(getUserStorageKey(userId));
  return todos ? JSON.parse(todos) : [];
};

// Save todos to local storage
const saveLocalTodos = (userId, todos) => {
  localStorage.setItem(getUserStorageKey(userId), JSON.stringify(todos));
};

// Check online status
const isOnline = () => navigator.onLine;

// Check if a todo is due soon (within 24 hours)
export const isDueSoon = (dueDate) => {
  if (!dueDate) return false;
  const now = new Date();
  const due = new Date(dueDate);
  const diffHours = (due - now) / (1000 * 60 * 60);
  return diffHours > 0 && diffHours <= 24;
};

// Check if a todo is overdue
export const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  const now = new Date();
  const due = new Date(dueDate);
  return due < now;
};

// Sync with Firebase
export const syncWithFirebase = async (userId) => {
  if (!isOnline()) return;

  const queue = getOfflineQueue();
  
  for (const operation of queue) {
    try {
      switch (operation.type) {
        case 'add':
          await addDoc(collection(db, 'todos'), operation.todo);
          break;
        case 'update':
          await updateDoc(doc(db, 'todos', operation.todoId), operation.todo);
          break;
        case 'delete':
          await deleteDoc(doc(db, 'todos', operation.todoId));
          break;
      }
    } catch (error) {
      console.error('Sync error:', error);
      return;
    }
  }

  setOfflineQueue([]);
};

// Subscribe to real-time updates with sorting
export const subscribeToTodos = (userId, callback) => {
  const q = query(
    collection(db, 'todos'),
    where("userId", "==", userId),
    orderBy("priority", "desc"),
    orderBy("dueDate", "asc")
  );
  
  return onSnapshot(q, (snapshot) => {
    const todos = [];
    snapshot.forEach((doc) => {
      const todo = { id: doc.id, ...doc.data() };
      // Add computed properties for UI
      todo.dueSoon = isDueSoon(todo.dueDate);
      todo.overdue = isOverdue(todo.dueDate);
      todos.push(todo);
    });
    
    saveLocalTodos(userId, todos);
    callback(todos);
  }, (error) => {
    console.error('Firestore subscription error:', error);
    callback(getLocalTodos(userId));
  });
};

// Get all todos
export const getTodos = async (userId) => {
  try {
    if (isOnline()) {
      const q = query(
        collection(db, 'todos'),
        where("userId", "==", userId),
        orderBy("priority", "desc"),
        orderBy("dueDate", "asc")
      );
      const querySnapshot = await getDocs(q);
      const todos = [];
      querySnapshot.forEach((doc) => {
        const todo = { id: doc.id, ...doc.data() };
        todo.dueSoon = isDueSoon(todo.dueDate);
        todo.overdue = isOverdue(todo.dueDate);
        todos.push(todo);
      });
      saveLocalTodos(userId, todos);
      return todos;
    } else {
      return getLocalTodos(userId);
    }
  } catch (error) {
    console.error('Error fetching todos:', error);
    return getLocalTodos(userId);
  }
};

// Add new todo with enhanced properties
export const addTodo = async (todo) => {
  const todoWithId = {
    ...todo,
    id: Date.now().toString(),
    priority: todo.priority || PRIORITY_LEVELS.MEDIUM,
    category: todo.category || 'other',
    dueDate: todo.dueDate || null,
    order: todo.order || Date.now(),
    dueSoon: isDueSoon(todo.dueDate),
    overdue: isOverdue(todo.dueDate)
  };
  
  try {
    if (isOnline()) {
      await addDoc(collection(db, 'todos'), todoWithId);
    } else {
      addToSyncQueue({ type: 'add', todo: todoWithId });
    }
    
    const todos = getLocalTodos(todo.userId);
    todos.push(todoWithId);
    saveLocalTodos(todo.userId, todos);
    
    return todoWithId;
  } catch (error) {
    console.error('Error adding todo:', error);
    throw error;
  }
};

// Update todo with enhanced properties
export const updateTodo = async (todoId, updatedTodo) => {
  const todoWithComputedProps = {
    ...updatedTodo,
    dueSoon: isDueSoon(updatedTodo.dueDate),
    overdue: isOverdue(updatedTodo.dueDate)
  };

  try {
    if (isOnline()) {
      await updateDoc(doc(db, 'todos', todoId), todoWithComputedProps);
    } else {
      addToSyncQueue({ type: 'update', todoId, todo: todoWithComputedProps });
    }
    
    const todos = getLocalTodos(updatedTodo.userId);
    const updatedTodos = todos.map(todo => 
      todo.id === todoId ? { ...todoWithComputedProps, id: todoId } : todo
    );
    saveLocalTodos(updatedTodo.userId, updatedTodos);
    
    return { ...todoWithComputedProps, id: todoId };
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
};

// Reorder todos
export const reorderTodos = async (userId, reorderedTodos) => {
  try {
    const updates = reorderedTodos.map((todo, index) => ({
      ...todo,
      order: index
    }));

    if (isOnline()) {
      await Promise.all(
        updates.map(todo => 
          updateDoc(doc(db, 'todos', todo.id), todo)
        )
      );
    } else {
      updates.forEach(todo => {
        addToSyncQueue({ type: 'update', todoId: todo.id, todo });
      });
    }

    saveLocalTodos(userId, updates);
    return updates;
  } catch (error) {
    console.error('Error reordering todos:', error);
    throw error;
  }
};

// Delete todo
export const deleteTodo = async (todoId, userId) => {
  try {
    if (isOnline()) {
      await deleteDoc(doc(db, 'todos', todoId));
    } else {
      addToSyncQueue({ type: 'delete', todoId });
    }
    
    const todos = getLocalTodos(userId);
    const updatedTodos = todos.filter(todo => todo.id !== todoId);
    saveLocalTodos(userId, updatedTodos);
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};

export const todoService = {
  // Create a new todo
  async createTodo(userId, todoData) {
    try {
      const todosRef = collection(db, 'todos');
      const newTodo = {
        ...todoData,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completed: false,
      };
      const docRef = await addDoc(todosRef, newTodo);
      return { id: docRef.id, ...newTodo };
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  },

  // Get all todos for a user
  async getTodos(userId) {
    try {
      const todosRef = collection(db, 'todos');
      const q = query(
        todosRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error getting todos:', error);
      throw error;
    }
  },

  // Update a todo
  async updateTodo(todoId, updates) {
    try {
      const todoRef = doc(db, 'todos', todoId);
      const updatedData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      await updateDoc(todoRef, updatedData);
      const updatedDoc = await getDoc(todoRef);
      return { id: todoId, ...updatedDoc.data() };
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  },

  // Delete a todo
  async deleteTodo(todoId) {
    try {
      const todoRef = doc(db, 'todos', todoId);
      await deleteDoc(todoRef);
      return todoId;
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  },

  // Toggle todo completion status
  async toggleTodoComplete(todoId, completed) {
    try {
      const todoRef = doc(db, 'todos', todoId);
      await updateDoc(todoRef, {
        completed,
        updatedAt: new Date().toISOString(),
      });
      const updatedDoc = await getDoc(todoRef);
      return { id: todoId, ...updatedDoc.data() };
    } catch (error) {
      console.error('Error toggling todo completion:', error);
      throw error;
    }
  },

  // Update todo priority
  async updateTodoPriority(todoId, priority) {
    try {
      const todoRef = doc(db, 'todos', todoId);
      await updateDoc(todoRef, {
        priority,
        updatedAt: new Date().toISOString(),
      });
      const updatedDoc = await getDoc(todoRef);
      return { id: todoId, ...updatedDoc.data() };
    } catch (error) {
      console.error('Error updating todo priority:', error);
      throw error;
    }
  },

  // Update todo category
  async updateTodoCategory(todoId, category) {
    try {
      const todoRef = doc(db, 'todos', todoId);
      await updateDoc(todoRef, {
        category,
        updatedAt: new Date().toISOString(),
      });
      const updatedDoc = await getDoc(todoRef);
      return { id: todoId, ...updatedDoc.data() };
    } catch (error) {
      console.error('Error updating todo category:', error);
      throw error;
    }
  },

  // Update todo due date
  async updateTodoDueDate(todoId, dueDate) {
    try {
      const todoRef = doc(db, 'todos', todoId);
      await updateDoc(todoRef, {
        dueDate,
        updatedAt: new Date().toISOString(),
      });
      const updatedDoc = await getDoc(todoRef);
      return { id: todoId, ...updatedDoc.data() };
    } catch (error) {
      console.error('Error updating todo due date:', error);
      throw error;
    }
  },
};

export default todoService; 
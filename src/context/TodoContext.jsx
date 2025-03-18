import { createContext, useContext, useState, useEffect } from "react";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot, 
  orderBy 
} from "firebase/firestore";
import { db, auth } from "../services/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, active, completed
  const [user] = useAuthState(auth);

  // Fetch todos from Firestore
  useEffect(() => {
    if (!user) {
      setTodos([]);
      setLoading(false);
      return;
    }

    const todosRef = collection(db, "todos");
    const q = query(
      todosRef,
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const todosData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTodos(todosData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Add a new todo
  const addTodo = async (title) => {
    if (!user) return;
    
    await addDoc(collection(db, "todos"), {
      title,
      completed: false,
      userId: user.uid,
      createdAt: new Date()
    });
  };

  // Toggle todo completion status
  const toggleTodo = async (id, completed) => {
    await updateDoc(doc(db, "todos", id), {
      completed: !completed
    });
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, "todos", id));
  };

  // Edit todo title
  const editTodo = async (id, title) => {
    await updateDoc(doc(db, "todos", id), {
      title
    });
  };

  // Clear all completed todos
  const clearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    
    for (const todo of completedTodos) {
      await deleteDoc(doc(db, "todos", todo.id));
    }
  };

  // Get filtered todos
  const filteredTodos = todos.filter(todo => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const value = {
    todos: filteredTodos,
    loading,
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};

export const useTodos = () => {
  return useContext(TodoContext);
};
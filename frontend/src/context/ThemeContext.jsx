import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, LogOut, CheckCircle2, Circle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import "../styles/Todo.css";

function Todo() {
  const [todo, setTodo] = useState("");
  const [todolist, setTodolist] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { isDarkMode } = useTheme(); // ✅ USE CONTEXT
  const { logout } = useAuth();
  const navigate = useNavigate();

  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/todos`,
          getAuthHeaders()
        );
        setTodolist(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          logout();
          navigate("/login");
        } else {
          setError("Failed to load tasks");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!todo.trim()) return;
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/todos`,
      { text: todo },
      getAuthHeaders()
    );
    setTodolist([res.data, ...todolist]);
    setTodo("");
  };

  const toggleComplete = async (id) => {
    const current = todolist.find((t) => t._id === id);
    const res = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/todos/${id}`,
      { completed: !current.completed },
      getAuthHeaders()
    );
    setTodolist(todolist.map((t) => (t._id === id ? res.data : t)));
  };

  const deleteTodo = async (id) => {
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/todos/${id}`,
      getAuthHeaders()
    );
    setTodolist(todolist.filter((t) => t._id !== id));
  };

  return (
    <div className={`todo-page ${isDarkMode ? "dark" : ""}`}>
      <div className="todo-container">
        <div className="todo-header">
          <h1>My Tasks</h1>
          {loading && <span>Syncing...</span>}
        </div>

        {error && <div className="error">{error}</div>}

        <div className="input-group">
          <input
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            placeholder="Add task..."
          />
          <button onClick={addTodo}>
            <Plus size={18} /> Add
          </button>
        </div>

        <AnimatePresence>
          {todolist.map((item) => (
            <motion.div
              key={item._id}
              className={`todo-item ${item.completed ? "completed" : ""}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div onClick={() => toggleComplete(item._id)}>
                {item.completed ? <CheckCircle2 /> : <Circle />}
              </div>

              <span>{item.text}</span>

              <button onClick={() => deleteTodo(item._id)}>
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        <button onClick={() => { logout(); navigate("/login"); }} className="logout-btn">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
}

export default Todo;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, LogOut, CheckCircle2, Circle, Edit3, X, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/Todo.css';

function Todo() {
  const [todo, setTodo] = useState('');
  const [todolist, setTodolist] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const navigate = useNavigate();
  const { logout } = useAuth();

  // ✅ FIX: Bearer token
  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(''), 3000);
  };

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
        // ✅ FIX: logout ONLY on 401
        if (err.response?.status === 401) {
          showError('Session expired. Please login again.');
          logout();
          navigate('/login');
        } else {
          showError('Failed to load todos.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!todo.trim()) return;
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/todos`,
        { text: todo },
        getAuthHeaders()
      );
      setTodolist([res.data, ...todolist]);
      setTodo('');
    } catch {
      showError('Failed to add task.');
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/todos/${id}`,
        getAuthHeaders()
      );
      setTodolist(todolist.filter((t) => t._id !== id));
    } catch {
      showError('Failed to delete task.');
    }
  };

  const toggleComplete = async (id) => {
    const current = todolist.find((t) => t._id === id);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/todos/${id}`,
        { completed: !current.completed },
        getAuthHeaders()
      );
      setTodolist(todolist.map((t) => (t._id === id ? res.data : t)));
    } catch {
      showError('Failed to update task.');
    }
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) return;
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/todos/${id}`,
        { text: editText },
        getAuthHeaders()
      );
      setTodolist(todolist.map((t) => (t._id === id ? res.data : t)));
      setEditingId(null);
    } catch {
      showError('Failed to update task.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="todo-page">
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
            <motion.div key={item._id} className="todo-item">
              <div onClick={() => toggleComplete(item._id)}>
                {item.completed ? <CheckCircle2 /> : <Circle />}
              </div>

              {editingId === item._id ? (
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
              ) : (
                <span>{item.text}</span>
              )}

              <div>
                <button onClick={() => deleteTodo(item._id)}>
                  <Trash2 />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <button onClick={handleLogout} className="logout-btn">
          <LogOut /> Logout
        </button>
      </div>
    </div>
  );
}

export default Todo;

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

  const getAuthHeaders = () => ({
    headers: { Authorization: localStorage.getItem('token') }
  });

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 3000);
  };

  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/api/todos', getAuthHeaders());
        setTodolist(res.data);
      } catch (err) {
        showError('Session expired. Please log in again.');
        logout();
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, [navigate]);

  const addTodo = async () => {
    if (todo.trim() === '') return;
    try {
      const res = await axios.post('http://localhost:5000/api/todos', { text: todo }, getAuthHeaders());
      setTodolist([res.data, ...todolist]);
      setTodo('');
    } catch (err) {
      showError('Failed to add task.');
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`, getAuthHeaders());
      setTodolist(todolist.filter((item) => item._id !== id));
    } catch (err) {
      showError('Failed to delete task.');
    }
  };

  const toggleComplete = async (id) => {
    const currentTodo = todolist.find((item) => item._id === id);
    if (!currentTodo) return;
    try {
      const res = await axios.put(`http://localhost:5000/api/todos/${id}`, { completed: !currentTodo.completed }, getAuthHeaders());
      setTodolist(todolist.map((item) => (item._id === id ? res.data : item)));
    } catch (err) {
      showError('Failed to update task.');
    }
  };

  const saveEdit = async (id) => {
    if (editText.trim() === '') return;
    try {
      const res = await axios.put(`http://localhost:5000/api/todos/${id}`, { text: editText }, getAuthHeaders());
      setTodolist(todolist.map((item) => (item._id === id ? res.data : item)));
      setEditingId(null);
    } catch (err) {
      showError('Failed to update task.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="todo-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="todo-container"
      >
        <div className="todo-header">
          <h1>My Tasks</h1>
          {loading && <div className="text-sm opacity-50">Syncing...</div>}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-center text-sm"
          >
            {error}
          </motion.div>
        )}

        <div className="input-group">
          <input
            type="text"
            placeholder="Add a new task..."
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addTodo}
            className="add-button"
            disabled={!todo.trim()}
          >
            <Plus size={20} />
            <span>Add Task</span>
          </motion.button>
        </div>

        <div className="todo-list">
          <AnimatePresence mode="popLayout">
            {todolist.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.9, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                transition={{ duration: 0.2 }}
                className={`todo-item ${item.completed ? 'completed' : ''}`}
              >
                <div
                  className="checkbox-wrapper"
                  onClick={() => toggleComplete(item._id)}
                >
                  {item.completed ? (
                    <CheckCircle2 className="text-emerald-500" size={24} />
                  ) : (
                    <Circle className="text-slate-300" size={24} />
                  )}
                </div>

                {editingId === item._id ? (
                  <input
                    className="todo-text p-1 border-b-2 border-indigo-500 focus:outline-none bg-transparent"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && saveEdit(item._id)}
                    autoFocus
                  />
                ) : (
                  <span className="todo-text">{item.text}</span>
                )}

                <div className="item-actions">
                  {editingId === item._id ? (
                    <>
                      <button onClick={() => saveEdit(item._id)} className="action-btn text-emerald-500">
                        <Save size={18} />
                      </button>
                      <button onClick={() => setEditingId(null)} className="action-btn text-slate-400">
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(item._id);
                          setEditText(item.text);
                        }}
                        className="action-btn"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button onClick={() => deleteTodo(item._id)} className="action-btn delete">
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {todolist.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              className="text-center py-10"
            >
              No tasks yet. Enjoy your day!
            </motion.div>
          )}
        </div>

        <div className="logout-container">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default Todo;
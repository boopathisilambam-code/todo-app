import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, UserPlus, CheckCircle2 } from 'lucide-react';
import '../styles/Auth.css';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post('${process.env.REACT_APP_API_URL}/api/signup', { email, password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="auth-card"
      >
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join us and stay organized</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="message error"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="message success"
          >
            <CheckCircle2 size={16} /> account created! Redirecting...
          </motion.div>
        )}

        <form onSubmit={handleSignup}>
          <div className="form-group">
            <div className="input-wrapper">
              <Mail size={18} />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="auth-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-wrapper">
              <Lock size={18} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="auth-input"
                required
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="auth-button"
            disabled={loading || success}
          >
            {loading ? 'Creating...' : success ? 'Success' : 'Sign Up'}
            {!loading && !success && <UserPlus size={18} />}
          </motion.button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <span className="auth-link" onClick={() => navigate('/login')}>
              Sign in
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

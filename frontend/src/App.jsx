import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Todo from './pages/Todo';
import ThemeToggle from './components/ThemeToggle';

import { useAuth } from './context/AuthContext';

function App() {
  const { isAuth } = useAuth();

  return (
    <div className="main-layout transition-colors duration-500">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/todo"
            element={isAuth ? <Todo /> : <Navigate to="/login" />}
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
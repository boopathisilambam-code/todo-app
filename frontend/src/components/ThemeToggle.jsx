import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label="Toggle theme"
        >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </motion.button>
    );
};

export default ThemeToggle;

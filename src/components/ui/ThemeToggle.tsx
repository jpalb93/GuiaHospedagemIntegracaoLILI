import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();

    const cycleTheme = () => {
        if (theme === 'light') setTheme('dark');
        else if (theme === 'dark') setTheme('system');
        else setTheme('light');
    };

    return (
        <button
            onClick={cycleTheme}
            className="relative p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            aria-label="Alternar tema"
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={theme}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {theme === 'light' && <Sun size={20} className="text-orange-500" />}
                    {theme === 'dark' && <Moon size={20} className="text-blue-400" />}
                    {theme === 'system' && <Monitor size={20} className="text-gray-500 dark:text-gray-400" />}
                </motion.div>
            </AnimatePresence>

            <span className="sr-only">
                {theme === 'light' ? 'Tema Claro' : theme === 'dark' ? 'Tema Escuro' : 'Tema do Sistema'}
            </span>
        </button>
    );
};

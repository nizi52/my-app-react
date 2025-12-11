// hooks/useThemeMode.jsx
import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

export const useThemeMode = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeMode must be used within AppThemeProvider');
    }
    return {
        mode: context.mode,
        toggleTheme: context.toggleTheme
    };
};

// Для удобства можно добавить хук для проверки темы
export const useIsDarkMode = () => {
    const { mode } = useThemeMode();
    return mode === 'dark';
};
import React, { createContext, useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Экспортируем контекст отдельно
export const ThemeContext = createContext();

// Компонент-провайдер темы
export const AppThemeProvider = ({ children }) => {
    const [mode, setMode] = useState(() => {
        const saved = localStorage.getItem('theme-mode');
        return saved || 'light';
    });

    useEffect(() => {
        localStorage.setItem('theme-mode', mode);
    }, [mode]);

    const toggleTheme = () => {
        setMode(prev => prev === 'light' ? 'dark' : 'light');
    };

    const theme = createTheme({
        palette: {
            mode,
            primary: {
                main: mode === 'light' ? '#1976d2' : '#90caf9',
            },
            secondary: {
                main: mode === 'light' ? '#dc004e' : '#f48fb1',
            },
        },
        components: {
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                    }
                }
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        textTransform: 'none',
                    }
                }
            }
        }
    });

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

export default AppThemeProvider;
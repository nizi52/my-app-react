import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useThemeMode } from '../hooks/useThemeMode';

function ThemeToggle() {
    const { mode, toggleTheme } = useThemeMode();
    
    return (
        <Tooltip title={`Сменить тему: ${mode === 'light' ? 'тёмная' : 'светлая'}`}>
            <IconButton 
                onClick={toggleTheme} 
                color="inherit"
                sx={{ ml: 1 }}
            >
                {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
            </IconButton>
        </Tooltip>
    );
}

export default ThemeToggle;
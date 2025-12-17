import { useThemeMode } from '../hooks/useThemeMode';

function ThemeToggle() {
  const { mode, toggleTheme } = useThemeMode();
  
  return (
    <button 
      onClick={toggleTheme}
      className="theme-toggle-btn"
      title={`Сменить тему: ${mode === 'light' ? 'тёмная' : 'светлая'}`}
      style={{
        background: 'transparent',
        border: '2px solid currentColor',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2em',
        transition: 'all 0.3s ease',
        margin: '15px'
      }}
    >
      {mode === 'light' ? '🌙' : '☀️'}
    </button>
  );
}

export default ThemeToggle;
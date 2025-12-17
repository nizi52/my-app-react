import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';
import ThemeToggle from './ThemeToggle';

function Navigation() {
  const location = useLocation();

  return (
    <nav className="main-navigation">
      <div className="nav-brand">
        <Link to="/">
          <h2>🚀 Трекер технологий</h2>
        </Link>
      </div>

      <ul className="nav-menu">
        <li>
          <Link
            to="/"
            className={location.pathname === '/' ? 'active' : ''}
          >
            Главная
          </Link>
        </li>
        
        <li>
          <Link
            to="/technologies"
            className={location.pathname === '/technologies' || location.pathname.includes('/technology/') ? 'active' : ''}
          >
            Технологии
          </Link>
        </li>
        
        <li>
          <Link
            to="/add-technology"
            className={location.pathname === '/add-technology' ? 'active' : ''}
          >
            Add
          </Link>
        </li>
                
        <li>
          <Link
            to="/deadlines"
            className={location.pathname === '/deadlines' ? 'active' : ''}
            title="Форма с валидацией сроков"
          >
            ⏱Сроки
          </Link>
        </li>
        
        <li>
          <Link
            to="/bulk-edit"
            className={location.pathname === '/bulk-edit' ? 'active' : ''}
            title="Массовое редактирование статусов"
          >
            🔀Масс
          </Link>
        </li>
        
        <li>
          <Link
            to="/import-export"
            className={location.pathname === '/import-export' ? 'active' : ''}
            title="Импорт и экспорт данных"
          >
            📁Имп/Эксп
          </Link>
        </li>
        
        <li>
          <Link 
            to="/notifications" 
            className={location.pathname === '/notifications' ? 'active' : ''}
            title="Система уведомлений"
          >
            🔔Уведы
          </Link>
        </li>
        
        <li>
          <Link 
            to="/statistics" 
            className={location.pathname === '/statistics' ? 'active' : ''}
            title="Статистика прогресса"
          >
            📊Статистика
          </Link>
        </li>
        
        <li>
          <Link 
            to="/responsive-test" 
            className={location.pathname === '/responsive-test' ? 'active' : ''}
            title="Тестирование адаптивности"
          >
            📱Адаптивность
          </Link>
        </li>
        
        <li>
          <Link 
            to="/settings" 
            className={location.pathname === '/settings' ? 'active' : ''}
            title="Настройки приложения"
          >
            ⚙️Setting
          </Link>
        </li>
      </ul>
      
      <div className="nav-theme-toggle">
        <ThemeToggle />
      </div>
    </nav>
  );
}

export default Navigation;
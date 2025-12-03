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
            Все технологии
          </Link>
        </li>
        <li>
          <Link
            to="/add-technology"
            className={location.pathname === '/add-technology' ? 'active' : ''}
          >
            Добавить
          </Link>
        </li>
        
        <li className="nav-divider">|</li>
        
        <li>
          <Link
            to="/deadlines"
            className={location.pathname === '/deadlines' ? 'active' : ''}
            title="Форма с валидацией сроков"
          >
            ⏱ Сроки
          </Link>
        </li>
        <li>
          <Link
            to="/bulk-edit"
            className={location.pathname === '/bulk-edit' ? 'active' : ''}
            title="Массовое редактирование статусов"
          >
            🔄 Массовое
          </Link>
        </li>
        <li>
          <Link
            to="/import-export"
            className={location.pathname === '/import-export' ? 'active' : ''}
            title="Импорт и экспорт данных"
          >
            📁 Импорт/Экспорт
          </Link>
        </li>
        <li>
            <Link to="/notifications" 
            className={location.pathname === '/notifications' ? 'active' : ''}>
                🔔 Уведомления
            </Link>
        </li>
        <li>
            <Link to="/responsive-test" 
            className={location.pathname === '/responsive-test' ? 'active' : ''}>
                📱 Адаптивность
            </Link>
        </li>        
      </ul>
      <li>
        <ThemeToggle />
      </li>
    </nav>
  );
}

export default Navigation;
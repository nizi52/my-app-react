import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

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
        
        {/* Разделитель (визуальный) */}
        <li className="nav-divider">|</li>
        
        {/* Задания ПЗ 25 */}
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
      </ul>
    </nav>
  );
}

export default Navigation;
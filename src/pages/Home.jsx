import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ProgressHeader from '../components/ProgressHeader';
import QuickActions from '../components/QuickActions';
import TechnologyFilter from '../components/TechnologyFilter';
import TechnologyCard from '../components/TechnologyCard';

function Home({ 
  technologies, 
  onStatusChange, 
  onNotesChange,
  onMarkAllCompleted,
  onResetAll,
  onRandomize,
  onClearData,
  onRefresh
}) {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTechnologies = technologies.filter(tech => {
    const statusMatch = activeFilter === 'all' || tech.status === activeFilter;
    const searchMatch = searchQuery === '' || 
      tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tech.notes && tech.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return statusMatch && searchMatch;
  });

  const getFilterStats = () => {
    const total = technologies.length;
    const filteredCount = filteredTechnologies.length;
    
    if (activeFilter === 'all' && searchQuery === '') {
      return `Показаны все ${total} технологий`;
    } else if (searchQuery !== '') {
      return `Найдено ${filteredCount} из ${total} по запросу "${searchQuery}"`;
    } else {
      const statusText = {
        'not-started': 'не начатых',
        'in-progress': 'в процессе',
        'completed': 'выполненных'
      };
      return `Показано ${filteredCount} из ${total} (${statusText[activeFilter]})`;
    }
  };

  const handleAddTechnology = () => {
    navigate('/add-technology');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveFilter('all');
  };

  return (
    <>
      <header className="App-header">
        <div className="header-content">
          <div className="header-main">
            <div className="header-icon">🚀</div>
            <div className="header-text">
              <h1>Трекер изучения технологий</h1>
              <p>Отслеживайте ваш прогресс в изучении технологий</p>
            </div>
          </div>
          <div className="header-actions">
            <button 
              onClick={onRefresh}
              className="header-refresh-btn"
              title="Обновить данные"
              aria-label="Обновить данные"
            >
              🔄
            </button>
          </div>
        </div>
      </header>

      <ProgressHeader technologies={technologies} />
      
      <QuickActions 
        onMarkAllCompleted={onMarkAllCompleted}
        onResetAll={onResetAll}
        onRandomize={onRandomize}
        onClearData={onClearData}
        onRefresh={onRefresh}
      />

      <div className="search-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Поиск по названию, описанию или заметкам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button 
              className="clear-search"
              onClick={() => setSearchQuery('')}
              title="Очистить поиск"
            >
              ✕
            </button>
          )}
        </div>
        <div className="search-stats">
          {getFilterStats()}
        </div>
      </div>

      <TechnologyFilter 
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
      
      <div className="technologies-container">
        <div className="technologies-header">
          <h2>Дорожная карта технологий</h2>
          <div className="technologies-header-actions">
            <div className="filter-stats">
              {getFilterStats()}
            </div>
            <button 
              onClick={handleAddTechnology}
              className="btn btn-primary add-tech-btn"
            >
              + Добавить технологию
            </button>
          </div>
        </div>
        
        {filteredTechnologies.length > 0 ? (
          <div className="technologies-list">
            {filteredTechnologies.map(tech => (
              <TechnologyCard
                key={tech.id}
                id={tech.id}
                title={tech.title}
                description={tech.description}
                status={tech.status}
                notes={tech.notes || ''}
                onStatusChange={onStatusChange}
                onNotesChange={onNotesChange}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>Технологии не найдены</h3>
            <p>
              {searchQuery 
                ? `По запросу "${searchQuery}" ничего не найдено.`
                : 'Нет технологий с выбранным статусом.'
              }
            </p>
            <div className="empty-state-actions">
              {searchQuery || activeFilter !== 'all' ? (
                <button 
                  onClick={handleResetFilters}
                  className="btn btn-secondary"
                >
                  Сбросить фильтры
                </button>
              ) : null}
              <button 
                onClick={handleAddTechnology}
                className="btn btn-primary"
              >
                + Добавить технологию
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
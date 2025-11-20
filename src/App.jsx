import { useState, useEffect } from 'react';
import './App.css';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';
import QuickActions from './components/QuickActions';
import TechnologyFilter from './components/TechnologyFilter';

function App() {
  // состояние для хранения массива технологий
  const [technologies, setTechnologies] = useState([
    { id: 1, title: 'React Components', description: 'Изучение базовых компонентов', status: 'not-started', notes: '' },
    { id: 2, title: 'JSX Syntax', description: 'Освоение синтаксиса JSX', status: 'not-started', notes: '' },
    { id: 3, title: 'State Management', description: 'Работа с состоянием компонентов', status: 'not-started', notes: '' },
    { id: 4, title: 'Props', description: 'Передача данных между компонентами', status: 'not-started', notes: '' },
    { id: 5, title: 'Hooks', description: 'Использование хуков React', status: 'not-started', notes: '' },
    { id: 6, title: 'Forms', description: 'Работа с формами в React', status: 'not-started', notes: '' }
  ]);

  // состояние для активного фильтра
  const [activeFilter, setActiveFilter] = useState('all');
  
  // состояние для поискового запроса
  const [searchQuery, setSearchQuery] = useState('');

  // Автосохранение в localStorage при любом изменении technologies
  useEffect(() => {
    localStorage.setItem('techTrackerData', JSON.stringify(technologies));
    console.log('✅ Данные сохранены в localStorage');
  }, [technologies]);

  // Загрузка из localStorage при первом рендере
  useEffect(() => {
    const savedData = localStorage.getItem('techTrackerData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setTechnologies(parsedData);
        console.log('📥 Данные загружены из localStorage');
      } catch (error) {
        console.error('❌ Ошибка при загрузке данных из localStorage:', error);
      }
    }
  }, []);

  // функция для фильтрации технологий по статусу и поисковому запросу
  const filteredTechnologies = technologies.filter(tech => {
    // Фильтрация по статусу
    const statusMatch = activeFilter === 'all' || tech.status === activeFilter;
    
    // Фильтрация по поисковому запросу
    const searchMatch = searchQuery === '' || 
      tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.notes.toLowerCase().includes(searchQuery.toLowerCase());
    
    return statusMatch && searchMatch;
  });

  // функция для изменения статуса технологии по id
  const updateTechnologyStatus = (id) => {
    setTechnologies(prevTech => 
      prevTech.map(tech => {
        if (tech.id === id) {
          // циклическое переключение статусов
          const statusOrder = ['not-started', 'in-progress', 'completed'];
          const currentIndex = statusOrder.indexOf(tech.status);
          const nextIndex = (currentIndex + 1) % statusOrder.length;
          return { ...tech, status: statusOrder[nextIndex] };
        }
        return tech;
      })
    );
  };

  // функция для обновления заметок технологии
  const updateTechnologyNotes = (id, newNotes) => {
    setTechnologies(prevTech => 
      prevTech.map(tech => 
        tech.id === id ? { ...tech, notes: newNotes } : tech
      )
    );
  };

  // функция для отметки всех как выполненные
  const markAllAsCompleted = () => {
    setTechnologies(prevTech => 
      prevTech.map(tech => ({ ...tech, status: 'completed' }))
    );
  };

  // функция для сброса всех статусов
  const resetAllStatuses = () => {
    setTechnologies(prevTech => 
      prevTech.map(tech => ({ ...tech, status: 'not-started' }))
    );
  };

  // функция для случайного выбора технологии
  const randomizeNext = () => {
    const notStarted = technologies.filter(tech => tech.status === 'not-started');
    if (notStarted.length > 0) {
      const randomTech = notStarted[Math.floor(Math.random() * notStarted.length)];
      updateTechnologyStatus(randomTech.id);
    } else {
      alert('Все технологии уже начаты или завершены!');
    }
  };

  // функция для изменения фильтра
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  // функция для очистки всех данных
  const clearAllData = () => {
    if (window.confirm('Вы уверены, что хотите очистить все данные? Это действие нельзя отменить.')) {
      localStorage.removeItem('techTrackerData');
      setTechnologies([
        { id: 1, title: 'React Components', description: 'Изучение базовых компонентов', status: 'not-started', notes: '' },
        { id: 2, title: 'JSX Syntax', description: 'Освоение синтаксиса JSX', status: 'not-started', notes: '' },
        { id: 3, title: 'State Management', description: 'Работа с состоянием компонентов', status: 'not-started', notes: '' },
        { id: 4, title: 'Props', description: 'Передача данных между компонентами', status: 'not-started', notes: '' },
        { id: 5, title: 'Hooks', description: 'Использование хуков React', status: 'not-started', notes: '' },
        { id: 6, title: 'Forms', description: 'Работа с формами в React', status: 'not-started', notes: '' }
      ]);
      setSearchQuery('');
      setActiveFilter('all');
    }
  };

  // получаем статистику для отображения в заголовке
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

  return (
    <div className="App">
      <header className="App-header">
        <h1>Трекер изучения технологий</h1>
        <p>Отслеживайте ваш прогресс в изучении технологий</p>
      </header>

      <ProgressHeader technologies={technologies} />
      
      <QuickActions 
        onMarkAllCompleted={markAllAsCompleted}
        onResetAll={resetAllStatuses}
        onRandomize={randomizeNext}
        onClearData={clearAllData}
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
        onFilterChange={handleFilterChange}
      />
      
      <div className="technologies-container">
        <div className="technologies-header">
          <h2>Дорожная карта технологий</h2>
          <div className="filter-stats">
            {getFilterStats()}
          </div>
        </div>
        <div className="technologies-list">
          {filteredTechnologies.map(tech => (
            <TechnologyCard
              key={tech.id}
              id={tech.id}
              title={tech.title}
              description={tech.description}
              status={tech.status}
              notes={tech.notes}
              onStatusChange={updateTechnologyStatus}
              onNotesChange={updateTechnologyNotes}
            />
          ))}
        </div>
        {filteredTechnologies.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>Технологии не найдены</h3>
            <p>
              {searchQuery 
                ? `По запросу "${searchQuery}" ничего не найдено. Попробуйте изменить поисковый запрос или фильтр.`
                : 'Нет технологий с выбранным статусом. Попробуйте изменить фильтр.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
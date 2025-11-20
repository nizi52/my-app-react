import './TechnologyFilter.css';

function TechnologyFilter({ activeFilter, onFilterChange }) {
  const filters = [
    { key: 'all', label: 'Все технологии', icon: '🌐' },
    { key: 'not-started', label: 'Не начатые', icon: '⏳' },
    { key: 'in-progress', label: 'В процессе', icon: '🔄' },
    { key: 'completed', label: 'Выполненные', icon: '✅' }
  ];

  return (
    <div className="technology-filter">
      <h3>🔍 Фильтр по статусу</h3>
      <div className="filter-buttons">
        {filters.map(filter => (
          <button
            key={filter.key}
            className={`filter-btn ${activeFilter === filter.key ? 'active' : ''}`}
            onClick={() => onFilterChange(filter.key)}
            data-filter={filter.key}
          >
            <span className="filter-icon">{filter.icon}</span>
            <span className="filter-label">{filter.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default TechnologyFilter;
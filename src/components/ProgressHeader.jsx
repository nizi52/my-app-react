import React, { useMemo } from 'react';
import './ProgressHeader.css';

function ProgressHeader({ technologies }) {
  const stats = useMemo(() => {
    const total = technologies.length;
    const completed = technologies.filter(tech => tech.status === 'completed').length;
    const inProgress = technologies.filter(tech => tech.status === 'in-progress').length;
    const notStarted = technologies.filter(tech => tech.status === 'not-started').length;
    
    const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Определяем самую популярную категорию
    const categories = {
      'completed': completed,
      'in-progress': inProgress,
      'not-started': notStarted
    };
    
    const mostPopular = Object.keys(categories).reduce((a, b) => 
      categories[a] > categories[b] ? a : b
    );
    
    let mostPopularCategory = 'Все категории равны';
    switch (mostPopular) {
      case 'completed': 
        mostPopularCategory = 'Изученные технологии';
        break;
      case 'in-progress': 
        mostPopularCategory = 'Технологии в процессе';
        break;
      case 'not-started': 
        mostPopularCategory = 'Не начатые технологии';
        break;
    }
    
    return {
      total,
      completed,
      inProgress,
      notStarted,
      progressPercentage,
      mostPopularCategory
    };
  }, [technologies]);

  return (
    <div className="progress-header">
      <h2>📊 Общий прогресс изучения</h2>
      
      <div className="progress-stats">
        <div className="stat-item">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Всего технологий</span>
        </div>
        <div className="stat-item completed">
          <span className="stat-number">{stats.completed}</span>
          <span className="stat-label">Изучено</span>
        </div>
        <div className="stat-item in-progress">
          <span className="stat-number">{stats.inProgress}</span>
          <span className="stat-label">В процессе</span>
        </div>
        <div className="stat-item not-started">
          <span className="stat-number">{stats.notStarted}</span>
          <span className="stat-label">Не начато</span>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-info">
          <span className="progress-text">Общий прогресс: {stats.progressPercentage}%</span>
          <span className="progress-details">({stats.completed} из {stats.total} технологий)</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${stats.progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="additional-stats">
        <div className="stat-category">
          <span className="category-label">Самая популярная категория:</span>
          <span className="category-value">{stats.mostPopularCategory}</span>
        </div>
      </div>
    </div>
  );
}

export default React.memo(ProgressHeader);
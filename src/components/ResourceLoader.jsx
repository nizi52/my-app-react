import { useState } from 'react';
import './ResourceLoader.css';

function ResourceLoader({ technologyId, onResourcesLoaded }) {
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState([]);
  const [error, setError] = useState(null);

  const loadResources = async () => {
    setLoading(true);
    setError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`https://api.example.com/technologies/${technologyId}/resources`, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ошибка: ${response.status}`);
      }

      const data = await response.json();
      setResources(data);
      if (onResourcesLoaded) {
        onResourcesLoaded(data);
      }

    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Превышено время ожидания');
      } else {
        const mockResources = [
          { 
            id: 1, 
            title: 'Официальная документация', 
            url: 'https://reactjs.org/docs',
            type: 'documentation',
            description: 'Полное руководство по React'
          },
          { 
            id: 2, 
            title: 'Видеоуроки на YouTube', 
            url: 'https://youtube.com/playlist?list=PLqKQF2ojwm3l4oPjsB9chrJmlhZ-zOzWT',
            type: 'video',
            description: 'Бесплатные уроки для начинающих'
          },
          { 
            id: 3, 
            title: 'Практические задания', 
            url: 'https://github.com/example/practice',
            type: 'practice',
            description: 'Упражнения для закрепления знаний'
          }
        ];
        
        setResources(mockResources);
        if (onResourcesLoaded) {
          onResourcesLoaded(mockResources);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resource-loader">
      <div className="loader-header">
        <h4>📚 Ресурсы для изучения</h4>
        <button 
          onClick={loadResources} 
          disabled={loading}
          className="load-resources-btn"
        >
          {loading ? '⏳ Загрузка...' : '🔄 Загрузить ресурсы'}
        </button>
      </div>

      {error && (
        <div className="resource-error">
          <p>⚠️ {error}</p>
        </div>
      )}

      {resources.length > 0 && (
        <div className="resources-list">
          {resources.map(resource => (
            <div key={resource.id} className="resource-item">
              <div className="resource-icon">
                {resource.type === 'documentation' && '📖'}
                {resource.type === 'video' && '🎬'}
                {resource.type === 'practice' && '💻'}
                {!resource.type && '🔗'}
              </div>
              <div className="resource-content">
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="resource-title"
                >
                  {resource.title}
                </a>
                {resource.description && (
                  <p className="resource-description">{resource.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ResourceLoader;
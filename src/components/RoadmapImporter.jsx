import { useState } from 'react';
import './RoadmapImporter.css';

function RoadmapImporter({ onImport }) {
  const [importing, setImporting] = useState(false);
  const [apiUrl, setApiUrl] = useState('');
  const [error, setError] = useState(null);

  const handleImport = async () => {
    if (!apiUrl.trim()) {
      setError('Введите URL API');
      return;
    }

    setImporting(true);
    setError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(apiUrl, { 
        signal: controller.signal 
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ошибка: ${response.status}`);
      }

      const roadmapData = await response.json();
      
      const formattedTechnologies = roadmapData.map((item, index) => ({
        id: Date.now() + index,
        title: item.title || item.name || `Технология ${index + 1}`,
        description: item.description || 'Описание отсутствует',
        status: 'not-started',
        notes: '',
        category: item.category || 'uncategorized',
        source: 'API импорт'
      }));

      onImport(formattedTechnologies);
      alert(`Успешно импортировано ${formattedTechnologies.length} технологий`);
      setApiUrl('');

    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Превышено время ожидания запроса');
      } else {
        setError(`Ошибка импорта: ${err.message}`);
      }
    } finally {
      setImporting(false);
    }
  };

  const handleExampleImport = async () => {
    setImporting(true);
    setError(null);

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
      
      if (!response.ok) throw new Error('Ошибка API');
      
      const posts = await response.json();
      
      const exampleTechnologies = posts.map((post, index) => ({
        id: Date.now() + index,
        title: `Технология: ${post.title.split(' ').slice(0, 3).join(' ')}`,
        description: post.body.substring(0, 150) + '...',
        status: 'not-started',
        notes: '',
        category: 'example',
        source: 'Пример API',
        difficulty: index % 2 === 0 ? 'beginner' : 'intermediate'
      }));

      onImport(exampleTechnologies);
      alert(`Импортировано ${exampleTechnologies.length} примеров технологий`);

    } catch (err) {
      setError(`Ошибка: ${err.message}`);
      
      const mockTechnologies = [
        {
          id: Date.now(),
          title: 'Пример технологии 1',
          description: 'Это пример импортированной технологии',
          status: 'not-started',
          notes: '',
          category: 'example',
          difficulty: 'beginner'
        },
        {
          id: Date.now() + 1,
          title: 'Пример технологии 2',
          description: 'Еще один пример для демонстрации',
          status: 'not-started',
          notes: '',
          category: 'example',
          difficulty: 'intermediate'
        }
      ];
      
      onImport(mockTechnologies);
      alert('Используются тестовые данные. Импортировано 2 технологии');
      
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="roadmap-importer">
      <h3>📥 Импорт дорожной карты из API</h3>
      
      <div className="import-controls">
        <div className="api-input-group">
          <input
            type="text"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="Введите URL API..."
            className="api-url-input"
            disabled={importing}
          />
          <button
            onClick={handleImport}
            disabled={importing || !apiUrl.trim()}
            className="btn btn-primary import-btn"
          >
            {importing ? 'Импорт...' : 'Импорт'}
          </button>
        </div>

        <div className="import-divider">
          <span>или</span>
        </div>

        <button
          onClick={handleExampleImport}
          disabled={importing}
          className="btn btn-secondary example-btn"
        >
          {importing ? 'Загрузка...' : '📋 Загрузить примеры'}
        </button>
      </div>

      {error && (
        <div className="import-error">
          <p>⚠️ {error}</p>
        </div>
      )}

      <div className="api-examples">
        <p className="examples-title">Примеры публичных API для тестирования:</p>
        <ul className="examples-list">
          <li>
            <strong>JSONPlaceholder:</strong>{' '}
            <code>https://jsonplaceholder.typicode.com/posts</code>
          </li>
          <li>
            <strong>GitHub API:</strong>{' '}
            <code>https://api.github.com/users/facebook/repos</code>
          </li>
          <li>
            <strong>DummyJSON:</strong>{' '}
            <code>https://dummyjson.com/products</code>
          </li>
        </ul>
        <p className="examples-hint">
          ⚠️ Для большинства API потребуется преобразование данных в формат приложения
        </p>
      </div>
    </div>
  );
}

export default RoadmapImporter;
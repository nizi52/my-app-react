import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function TechnologyDetail({ technologies, onStatusChange, onNotesChange, onDelete, ResourceLoader }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [technology, setTechnology] = useState(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const tech = technologies.find(t => t.id === parseInt(id));
    if (tech) {
      setTechnology(tech);
      setNotes(tech.notes || '');
    } else {
      navigate('/technologies', { replace: true });
    }
  }, [id, technologies, navigate]);

  const handleStatusChange = () => {
    onStatusChange(parseInt(id));
    const tech = technologies.find(t => t.id === parseInt(id));
    if (tech) {
      const statusOrder = ['not-started', 'in-progress', 'completed'];
      const currentIndex = statusOrder.indexOf(tech.status);
      const nextIndex = (currentIndex + 1) % statusOrder.length;
      setTechnology({ ...tech, status: statusOrder[nextIndex] });
    }
  };

  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    onNotesChange(parseInt(id), newNotes);
  };

  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить эту технологию?')) {
      onDelete(parseInt(id));
      navigate('/technologies');
    }
  };

  const handleEdit = () => {
    // В будущем можно сделать отдельную страницу редактирования
    // Пока просто показываем alert
    alert('Редактирование пока не реализовано. Изменяйте статус и заметки через текущий интерфейс.');
  };

  if (!technology) {
    return (
      <div className="page">
        <h1>Загрузка...</h1>
        <p>Загружаем информацию о технологии...</p>
        <Link to="/technologies" className="btn">
          ← Назад к списку
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <button 
          onClick={() => navigate('/technologies')} 
          className="back-link"
        >
          ← Назад к списку
        </button>
        <div className="page-header-actions">
          <h1>{technology.title}</h1>
          <div className="detail-actions">
            <button 
              onClick={handleEdit}
              className="btn btn-secondary"
            >
              📝 Редактировать
            </button>
            <button 
              onClick={handleDelete}
              className="btn btn-danger"
            >
              🗑️ Удалить
            </button>
          </div>
        </div>
      </div>

      <div className="technology-detail">
        <div className="detail-section">
          <h3>Описание</h3>
          <p>{technology.description}</p>
          {technology.category && (
            <div className="tech-meta">
              <span className="tech-category">Категория: {technology.category}</span>
              {technology.difficulty && (
                <span className="tech-difficulty">Сложность: {technology.difficulty}</span>
              )}
            </div>
          )}
        </div>

        <div className="detail-section">
          <h3>Статус изучения</h3>
          <div className="status-buttons">
            <button
              onClick={handleStatusChange}
              className={`status-btn ${technology.status === 'not-started' ? 'active' : ''}`}
            >
              ⏳ Не начато
            </button>
            <button
              onClick={handleStatusChange}
              className={`status-btn ${technology.status === 'in-progress' ? 'active' : ''}`}
            >
              🔄 В процессе
            </button>
            <button
              onClick={handleStatusChange}
              className={`status-btn ${technology.status === 'completed' ? 'active' : ''}`}
            >
              ✅ Завершено
            </button>
          </div>
          <p className="status-hint">
            Нажмите на кнопку статуса, чтобы изменить его
          </p>
        </div>

        <div className="detail-section">
          <h3>Мои заметки</h3>
          <textarea
            value={notes}
            onChange={handleNotesChange}
            placeholder="Записывайте сюда важные моменты, ссылки, идеи..."
            className="notes-textarea"
            rows="6"
          />
          <div className="notes-hint">
            {notes.length > 0 
              ? `✓ Заметка сохранена (${notes.length} символов)` 
              : '✎ Добавьте заметку для этой технологии'
            }
          </div>
        </div>

        {ResourceLoader && (
          <div className="detail-section">
            <ResourceLoader 
              technologyId={technology.id}
              technologyTitle={technology.title}
              onResourcesLoaded={(resources) => {
                console.log('Ресурсы загружены:', resources);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default TechnologyDetail;
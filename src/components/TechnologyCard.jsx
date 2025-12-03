import { useState } from 'react';
import './TechnologyCard.css';

function TechnologyCard({ id, title, description, status, notes, onStatusChange, onNotesChange }) {
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  
  const handleClick = () => {
    onStatusChange(id);
  };

  const handleNotesChange = (e) => {
    onNotesChange(id, e.target.value);
  };

  const toggleNotes = () => {
    setIsNotesExpanded(!isNotesExpanded);
  };

  const getStatusInfo = () => {
    switch (status) {
      case 'completed':
        return { 
          icon: '✅', 
          text: 'Изучено', 
          color: 'completed',
          nextAction: 'Начать заново'
        };
      case 'in-progress':
        return { 
          icon: '🔄', 
          text: 'В процессе', 
          color: 'in-progress',
          nextAction: 'Завершить изучение'
        };
      case 'not-started':
        return { 
          icon: '⏳', 
          text: 'Не начато', 
          color: 'not-started',
          nextAction: 'Начать изучение'
        };
      default:
        return { 
          icon: '❓', 
          text: 'Неизвестно', 
          color: 'not-started',
          nextAction: 'Изменить статус'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div 
      className={`technology-card ${statusInfo.color}`}
      title={`Кликните чтобы изменить статус. Следующее действие: ${statusInfo.nextAction}`}
    >
      <div className="card-content">
        <div className="card-main" onClick={handleClick}>
          <h3 className="card-title">{title}</h3>
          <p className="card-description">{description}</p>
          <div className="status-indicator">
            <span className="status-icon">{statusInfo.icon}</span>
            <span className="status-text">{statusInfo.text}</span>
            <span className="status-hint">Кликните для изменения статуса</span>
          </div>
        </div>

        <div className="notes-section">
          <div className="notes-header" onClick={toggleNotes}>
            <span className="notes-title">
                📝 Заметки 
                {notes.length > 0 && <span className="notes-badge">{notes.length} симв.</span>}
            </span>
            <span className="notes-toggle">
              {isNotesExpanded ? '▲' : '▼'}
            </span>
          </div>
          
          {isNotesExpanded && (
            <div className="notes-content">
              <textarea
                value={notes}
                onChange={handleNotesChange}
                placeholder="Записывайте сюда важные моменты, ссылки, идеи..."
                className="notes-textarea"
                rows="4"
              />
              <div className="notes-hint">
                {notes.length > 0 
                  ? `✓ Заметка сохранена (${notes.length} символов)` 
                  : '✎ Добавьте заметку для этой технологии'
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TechnologyCard;